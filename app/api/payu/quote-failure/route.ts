import { NextRequest, NextResponse } from "next/server";
import { notifyN8N } from "@/lib/n8n";

/**
 * POST /api/payu/quote-failure
 * PayU redirects here when quote payment fails.
 * Redirects the customer back to the quote page with a failure indicator.
 */
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const response: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      response[key] = String(value);
    }

    const publicToken = response.udf5 || "";
    const quoteCode = response.udf1 || "";
    const txnid = response.txnid || "";

    console.warn("[Quote PayU Failure]", {
      txnid,
      quoteCode,
      status: response.status,
      error_Message: response.error_Message || "",
    });

    // Fire webhook (non-blocking)
    notifyN8N("payment_failed", {
      txnid,
      quote_code: quoteCode,
      amount: response.amount || "",
      customer_name: response.firstname || "",
      customer_email: response.email || "",
      error: response.error_Message || response.status || "unknown",
      source: "quote_payment",
    });

    // Redirect back to quote page with failure indicator
    if (publicToken) {
      return NextResponse.redirect(
        new URL(`/quote/${publicToken}?payment=failed`, request.url)
      );
    }

    // Fallback if no token
    return NextResponse.redirect(
      new URL("/booking/error?reason=payment_failed", request.url)
    );
  } catch (error) {
    console.error("[Quote PayU Failure] Error:", error);
    return NextResponse.redirect(
      new URL("/booking/error?reason=server_error", request.url)
    );
  }
}
