import { NextRequest, NextResponse } from "next/server";
import { verifyHash } from "@/lib/payu";
import { db } from "@/lib/db";
import { notifyN8N } from "@/lib/n8n";

/**
 * POST /api/payu/quote-success
 * PayU redirects here after successful quote payment.
 * Verifies hash -> creates booking from quote -> marks quote converted -> fires webhook.
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
      console.error("[Quote PayU Success] Hash verification failed", {
        txnid: response.txnid,
        quoteCode: response.udf1,
      });
      const publicToken = response.udf5 || "";
      return NextResponse.redirect(
        new URL(
          `/quote/${publicToken}?payment=failed&reason=hash_mismatch`,
          request.url
        )
      );
    }

    const quoteCode = response.udf1 || "";
    const publicToken = response.udf5 || "";
    const txnid = response.txnid || "";
    const mihpayid = response.mihpayid || "";
    const paidAmount = parseFloat(response.amount || "0");

    let bookingId = "";

    try {
      // Fetch the quote with customer data
      const quote = await db.quote.findUnique({
        where: { quoteCode },
        include: { customer: true },
      });

      if (!quote) {
        console.error("[Quote PayU Success] Quote not found:", quoteCode);
        return NextResponse.redirect(
          new URL(`/quote/${publicToken}?payment=failed&reason=quote_not_found`, request.url)
        );
      }

      // Prevent double-conversion
      if (quote.status === "converted") {
        // Find the existing booking
        const existingBooking = await db.booking.findFirst({
          where: { quoteId: quote.id },
        });
        if (existingBooking) {
          const confirmUrl = new URL(
            `/booking/${existingBooking.bookingId}/confirmation`,
            request.url
          );
          confirmUrl.searchParams.set("txnid", txnid);
          confirmUrl.searchParams.set("amount", response.amount || "");
          confirmUrl.searchParams.set("verified", "1");
          return NextResponse.redirect(confirmUrl);
        }
      }

      const totalPrice = Number(quote.totalPrice);
      const balanceDue = totalPrice - paidAmount;

      // Generate booking ID
      const lastBooking = await db.booking.findFirst({
        orderBy: { id: "desc" },
      });
      const nextId = (lastBooking?.id || 0) + 1;
      bookingId = `GTP-${new Date().getFullYear()}-${nextId}`;

      // Create booking from quote data
      const newBooking = await db.booking.create({
        data: {
          bookingId,
          customerName: quote.customer?.name || response.firstname || "Guest",
          customerEmail: quote.customer?.email || response.email || "",
          customerPhone: quote.customer?.phone || "",
          customerPhoneRaw: quote.customer?.phoneRaw || "",
          packageName: quote.title,
          packageCategory: "combo",
          travelDate: new Date(), // placeholder — quote doesn't have a fixed date
          adults: 1,
          children: 0,
          basePrice: totalPrice,
          totalAmount: totalPrice,
          advancePaid: paidAmount,
          balanceDue: balanceDue > 0 ? balanceDue : 0,
          paymentStatus: paidAmount >= totalPrice ? "paid" : "partial",
          status: "confirmed",
          payuTxnid: txnid,
          payuMihpayid: mihpayid,
          payuStatus: "success",
          notes: `Auto-created from Quote ${quote.quoteCode}. Items: ${quote.itemsJson.substring(0, 500)}`,
          createdBy: "quote_payment",
          customerId: quote.customerId,
          quoteId: quote.id,
          salesUserId: quote.salesUserId,
        },
      });

      // Create payment record
      await db.payment.create({
        data: {
          bookingId: newBooking.id,
          milestone: paidAmount >= totalPrice ? "full" : "advance",
          amount: paidAmount,
          method: "payu",
          payuTxnid: txnid,
          payuMihpayid: mihpayid,
          status: "paid",
          gatewayResponse: JSON.stringify(response),
          completedAt: new Date(),
        },
      });

      // Update quote status to converted
      await db.quote.update({
        where: { id: quote.id },
        data: { status: "converted" },
      });

      // Update customer stats if linked
      if (quote.customerId) {
        await db.customer
          .update({
            where: { id: quote.customerId },
            data: {
              totalBookings: { increment: 1 },
              lifetimeValue: { increment: paidAmount },
              lastSeenAt: new Date(),
            },
          })
          .catch((err: unknown) =>
            console.error("[Quote PayU Success] Customer stats update failed:", err)
          );
      }
    } catch (dbError) {
      console.error("[Quote PayU Success] DB operations failed:", dbError);
      // Don't block the redirect — payment data is in PayU dashboard
    }

    // Fire webhook (non-blocking)
    notifyN8N("booking_confirmed", {
      booking_id: bookingId,
      txnid,
      mihpayid,
      amount: response.amount || "",
      customer_name: response.firstname || "",
      customer_email: response.email || "",
      product: response.productinfo || "",
      source: "quote_payment",
      quote_code: quoteCode,
    });

    // Redirect to confirmation page
    if (bookingId) {
      const confirmUrl = new URL(
        `/booking/${bookingId}/confirmation`,
        request.url
      );
      confirmUrl.searchParams.set("txnid", txnid);
      confirmUrl.searchParams.set("amount", response.amount || "");
      confirmUrl.searchParams.set("verified", "1");
      return NextResponse.redirect(confirmUrl);
    }

    // Fallback: if booking creation failed, redirect to quote page with success
    return NextResponse.redirect(
      new URL(`/quote/${publicToken}?payment=success&txnid=${txnid}`, request.url)
    );
  } catch (error) {
    console.error("[Quote PayU Success] Error:", error);
    return NextResponse.redirect(
      new URL("/booking/error?reason=server_error", request.url)
    );
  }
}
