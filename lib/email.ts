import nodemailer from "nodemailer";

/**
 * Email Integration — Hostinger SMTP via Nodemailer
 * Uses info@goatrippackage.com for transactional emails
 */

// Singleton transporter (reuse across requests)
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.hostinger.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // STARTTLS
    auth: {
      user: process.env.SMTP_USER || "info@goatrippackage.com",
      pass: process.env.SMTP_PASS,
    },
    pool: true,
    maxConnections: 3,
    maxMessages: 100,
  });

  return transporter;
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
  replyTo?: string;
}

/**
 * Send a transactional email
 */
export async function sendEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpPass) {
    console.warn("[email] SMTP_PASS not configured — skipping email");
    return { success: false, error: "SMTP not configured" };
  }

  try {
    const info = await getTransporter().sendMail({
      from: process.env.SMTP_FROM || "Goa Trip Package <info@goatrippackage.com>",
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || stripHtml(options.html),
      replyTo: options.replyTo || process.env.SMTP_USER,
      attachments: options.attachments,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[email] Send failed: ${message}`);
    return { success: false, error: message };
  }
}

/**
 * Send booking confirmation email with invoice PDF
 */
export async function sendBookingConfirmation(booking: {
  customerName: string;
  customerEmail: string;
  bookingId: string;
  packageName: string;
  travelDate: string;
  totalAmount: number;
  advancePaid: number;
  invoicePdf?: Buffer;
}) {
  const balanceDue = booking.totalAmount - booking.advancePaid;

  const html = `
    <div style="font-family: 'Inter', system-ui, sans-serif; max-width: 600px; margin: 0 auto; background: #05000f; color: #ffffff; padding: 40px 32px; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="font-size: 24px; margin: 0; color: #c9a84c;">Booking Confirmed!</h1>
        <p style="color: rgba(255,255,255,0.6); margin-top: 8px;">Your Goa experience awaits</p>
      </div>

      <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(201,168,76,0.25); border-radius: 8px; padding: 24px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px;"><strong>Booking ID:</strong> ${booking.bookingId}</p>
        <p style="margin: 0 0 8px;"><strong>Package:</strong> ${booking.packageName}</p>
        <p style="margin: 0 0 8px;"><strong>Travel Date:</strong> ${booking.travelDate}</p>
        <p style="margin: 0 0 8px;"><strong>Total:</strong> ₹${booking.totalAmount.toLocaleString("en-IN")}</p>
        <p style="margin: 0 0 8px;"><strong>Paid:</strong> ₹${booking.advancePaid.toLocaleString("en-IN")}</p>
        ${balanceDue > 0 ? `<p style="margin: 0; color: #c9a84c;"><strong>Balance Due:</strong> ₹${balanceDue.toLocaleString("en-IN")}</p>` : ""}
      </div>

      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL}/my-booking" style="display: inline-block; padding: 12px 32px; background: linear-gradient(90deg, #8b6914, #c9a84c, #f0d080, #c9a84c, #8b6914); color: #05000f; font-weight: 700; text-decoration: none; border-radius: 8px;">View Booking</a>
      </div>

      <p style="color: rgba(255,255,255,0.5); font-size: 13px; text-align: center; margin: 0;">
        Questions? WhatsApp us at +91 98908 30249<br>
        — Goa Trip Package Team
      </p>
    </div>
  `;

  const attachments = booking.invoicePdf
    ? [{ filename: `Invoice-${booking.bookingId}.pdf`, content: booking.invoicePdf, contentType: "application/pdf" }]
    : undefined;

  return sendEmail({
    to: booking.customerEmail,
    subject: `✅ Booking Confirmed — ${booking.bookingId} | Goa Trip Package`,
    html,
    attachments,
  });
}

/**
 * Strip HTML to plain text (basic fallback)
 */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}
