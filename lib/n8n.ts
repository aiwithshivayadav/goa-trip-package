/**
 * n8n Webhook Integration
 * Fires events to n8n which routes to Interakt for WhatsApp templates
 *
 * Events:
 * - lead_created: new enquiry
 * - quote_sent: quote published & shared
 * - quote_viewed: customer opened quote link
 * - quote_accepted: customer clicked Accept
 * - booking_confirmed: payment success → booking created
 * - balance_due_reminder: cron → balance due in X days
 * - day_before_pickup: cron → travel tomorrow
 * - post_trip_review: cron → T+1 day after travel
 * - payment_failed: PayU returned failure
 * - refund_initiated: admin triggered refund
 */

export type N8NEvent =
  | "lead_created"
  | "quote_sent"
  | "quote_viewed"
  | "quote_accepted"
  | "quote_declined"
  | "booking_confirmed"
  | "balance_due_reminder"
  | "day_before_pickup"
  | "post_trip_review"
  | "payment_failed"
  | "refund_initiated";

interface N8NPayload {
  event: N8NEvent;
  timestamp: string;
  data: Record<string, unknown>;
}

/**
 * Fire-and-forget notification to n8n webhook
 * Non-blocking — logs errors but never throws
 */
export async function notifyN8N(
  event: N8NEvent,
  data: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("[n8n] N8N_WEBHOOK_URL not configured — skipping notification");
    return { success: false, error: "N8N_WEBHOOK_URL not set" };
  }

  const payload: N8NPayload = {
    event,
    timestamp: new Date().toISOString(),
    data,
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Source": "goa-trip-package",
        "X-Event": event,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000), // 10s timeout — don't block main flow
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "unknown");
      console.error(`[n8n] Webhook failed (${response.status}): ${errorText}`);
      return { success: false, error: `HTTP ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[n8n] Webhook error: ${message}`);
    return { success: false, error: message };
  }
}

/**
 * Helper: notify lead creation
 */
export function notifyLeadCreated(lead: {
  name: string;
  phone: string;
  email?: string;
  productInterest?: string;
  source?: string;
  leadCode: string;
}) {
  return notifyN8N("lead_created", {
    customer_name: lead.name,
    customer_phone: lead.phone,
    customer_email: lead.email || "",
    product_interest: lead.productInterest || "",
    source: lead.source || "website",
    lead_code: lead.leadCode,
  });
}

/**
 * Helper: notify booking confirmed
 */
export function notifyBookingConfirmed(booking: {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  packageName: string;
  travelDate: string;
  totalAmount: number;
  advancePaid: number;
}) {
  return notifyN8N("booking_confirmed", {
    booking_id: booking.bookingId,
    customer_name: booking.customerName,
    customer_phone: booking.customerPhone,
    customer_email: booking.customerEmail,
    package_name: booking.packageName,
    travel_date: booking.travelDate,
    total_amount: booking.totalAmount,
    advance_paid: booking.advancePaid,
  });
}

/**
 * Helper: notify quote sent
 */
export function notifyQuoteSent(quote: {
  quoteCode: string;
  customerName: string;
  customerPhone: string;
  quoteUrl: string;
  validUntil: string;
  totalAmount: number;
}) {
  return notifyN8N("quote_sent", {
    quote_code: quote.quoteCode,
    customer_name: quote.customerName,
    customer_phone: quote.customerPhone,
    quote_url: quote.quoteUrl,
    valid_until: quote.validUntil,
    total_amount: quote.totalAmount,
  });
}
