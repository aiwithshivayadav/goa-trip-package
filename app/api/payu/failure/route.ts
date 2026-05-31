import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/payu/failure
 * PayU redirects here after failed/cancelled payment
 */
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const response: Record<string, string> = {};

    for (const [key, value] of formData.entries()) {
      response[key] = String(value);
    }

    const bookingId = response.udf1 || "";
    const txnid = response.txnid || "";
    const status = response.status || "failure";
    const errorMessage = response.error_Message || response.error || "Payment failed";

    console.log("[PayU Failure] Payment failed:", {
      bookingId,
      txnid,
      status,
      errorMessage,
    });

    // TODO (Phase C): Log failed payment attempt in DB

    // Redirect to failure page
    const failUrl = new URL(`/booking/${bookingId}/failed`, request.url);
    failUrl.searchParams.set("reason", status);
    failUrl.searchParams.set("txnid", txnid);

    return NextResponse.redirect(failUrl);
  } catch (error) {
    console.error("[PayU Failure] Error:", error);
    return NextResponse.redirect(
      new URL("/booking/error?reason=server_error", request.url)
    );
  }
}
