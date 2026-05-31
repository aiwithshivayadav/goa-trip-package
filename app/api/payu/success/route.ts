import { NextRequest, NextResponse } from "next/server";
import { verifyPayUHash } from "@/lib/payu";

/**
 * POST /api/payu/success
 * PayU redirects here after successful payment
 * Node runtime (needs Prisma for DB updates + email)
 */
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const response: Record<string, string> = {};

    // Extract all PayU response fields
    for (const [key, value] of formData.entries()) {
      response[key] = String(value);
    }

    // Verify hash — ensures response is authentic from PayU
    const isValid = verifyPayUHash({
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

    // Hash valid — payment is genuine
    const bookingId = response.udf1 || "";
    const txnid = response.txnid || "";
    const mihpayid = response.mihpayid || "";
    const amount = response.amount || "";

    // TODO (Phase C): Update booking in DB, create payment record, send email + WA
    // const { db } = await import("@/lib/db");
    // const { notifyBookingConfirmed } = await import("@/lib/n8n");
    // const { sendBookingConfirmation } = await import("@/lib/email");

    console.log("[PayU Success] Payment confirmed:", {
      bookingId,
      txnid,
      mihpayid,
      amount,
    });

    // Redirect to confirmation page
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
