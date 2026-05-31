import { NextRequest, NextResponse } from "next/server";
import { verifyHash } from "@/lib/payu";
import { db } from "@/lib/db";
import { notifyN8N } from "@/lib/n8n";

/**
 * POST /api/payu/success
 * PayU redirects here after successful payment
 * Verifies hash → updates booking → creates payment record → fires webhook
 */
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const response: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      response[key] = String(value);
    }

    // Verify hash
    const isValid = verifyHash({
      txnid: response.txnid || "",
      amount: response.amount || "",
      productinfo: response.productinfo || "",
      firstname: response.firstname || "",
      email: response.email || "",
      status: response.status || "",
      hash: response.hash || "",
      mihpayid: response.mihpayid || "",
      udf1: response.udf1 || "",
      udf2: response.udf2 || "",
      udf3: response.udf3 || "",
      udf4: response.udf4 || "",
      udf5: response.udf5 || "",
    });

    if (!isValid) {
      console.error("[PayU Success] Hash verification failed", { txnid: response.txnid });
      return NextResponse.redirect(
        new URL(`/booking/${response.udf1}/failed?reason=hash_mismatch`, request.url)
      );
    }

    const bookingId = response.udf1 || "";
    const txnid = response.txnid || "";
    const mihpayid = response.mihpayid || "";
    const amount = response.amount || "";

    // Try to update booking in DB
    try {
      const booking = await db.booking.findUnique({
        where: { bookingId },
      });

      if (booking) {
        const paidAmount = parseFloat(amount);

        // Update booking
        await db.booking.update({
          where: { bookingId },
          data: {
            paymentStatus: paidAmount >= Number(booking.totalAmount) ? "paid" : "partial",
            advancePaid: { increment: paidAmount },
            balanceDue: { decrement: paidAmount },
            payuTxnid: txnid,
            payuMihpayid: mihpayid,
            payuStatus: "success",
          },
        });

        // Create payment record
        await db.payment.create({
          data: {
            bookingId: booking.id,
            milestone: paidAmount >= Number(booking.totalAmount) ? "full" : "advance",
            amount: paidAmount,
            method: "payu",
            payuTxnid: txnid,
            payuMihpayid: mihpayid,
            status: "paid",
            gatewayResponse: JSON.stringify(response),
            completedAt: new Date(),
          },
        });
      }
    } catch (dbError) {
      console.error("[PayU Success] DB update failed:", dbError);
      // Don't block the redirect — booking data is in PayU dashboard
    }

    // Fire webhook (non-blocking)
    notifyN8N("booking_confirmed", {
      booking_id: bookingId,
      txnid,
      mihpayid,
      amount,
      customer_name: response.firstname || "",
      customer_email: response.email || "",
      product: response.productinfo || "",
    });

    // Redirect to confirmation
    const confirmUrl = new URL(`/booking/${bookingId}/confirmation`, request.url);
    confirmUrl.searchParams.set("txnid", txnid);
    confirmUrl.searchParams.set("amount", amount);
    confirmUrl.searchParams.set("verified", "1");

    return NextResponse.redirect(confirmUrl);
  } catch (error) {
    console.error("[PayU Success] Error:", error);
    return NextResponse.redirect(
      new URL("/booking/error?reason=server_error", request.url)
    );
  }
}
