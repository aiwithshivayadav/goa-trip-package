import { NextRequest, NextResponse } from "next/server";
import { generateHash, getPayUEndpoint } from "@/lib/payu";
import { db } from "@/lib/db";

/**
 * GET /api/quotes/public/[token]/pay
 * Builds a PayU payment form for the quote's advance amount and auto-submits it.
 * Public route — authenticated by the quote's publicToken.
 */
export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token || token.length < 10) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  try {
    const quote = await db.quote.findUnique({
      where: { publicToken: token },
      include: { customer: true },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    // Validate quote is in a payable state
    if (["converted", "declined", "expired"].includes(quote.status)) {
      return NextResponse.redirect(
        new URL(`/quote/${token}?payment=unavailable`, request.url)
      );
    }

    if (!["sent", "viewed", "accepted"].includes(quote.status)) {
      return NextResponse.redirect(
        new URL(`/quote/${token}?payment=unavailable`, request.url)
      );
    }

    // Check expiry
    if (new Date() > new Date(quote.validUntil)) {
      return NextResponse.redirect(
        new URL(`/quote/${token}?payment=expired`, request.url)
      );
    }

    // Calculate advance amount
    const totalPrice = Number(quote.totalPrice);
    const advancePercent = quote.advancePercent || 25;
    const advanceAmount = Math.round(totalPrice * advancePercent / 100);

    if (advanceAmount <= 0) {
      return NextResponse.redirect(
        new URL(`/quote/${token}?payment=invalid_amount`, request.url)
      );
    }

    // Customer details
    const customerName = quote.customer?.name || "Guest";
    const customerEmail = quote.customer?.email || "guest@goatrippackage.com";
    const customerPhone = quote.customer?.phone || "";
    const nameParts = customerName.split(" ");
    const firstname = nameParts[0] || "Guest";
    const lastname = nameParts.slice(1).join(" ") || "";

    // Build PayU params
    const txnid = `QT-${quote.quoteCode}_${Date.now()}`;
    const origin = new URL(request.url).origin;
    const surl = `${origin}/api/payu/quote-success`;
    const furl = `${origin}/api/payu/quote-failure`;

    const hashParams = {
      txnid,
      amount: advanceAmount.toFixed(2),
      productinfo: `Quote ${quote.quoteCode} — ${quote.title}`.substring(0, 100),
      firstname,
      email: customerEmail,
      udf1: quote.quoteCode,
      udf2: "",
      udf3: "",
      udf4: "quote",
      udf5: token,
    };

    const hash = generateHash(hashParams);
    const payuEndpoint = getPayUEndpoint();
    const key = process.env.PAYU_KEY ?? "zide1p";

    // Mark quote as accepted (they're proceeding to pay)
    if (quote.status === "sent" || quote.status === "viewed") {
      await db.quote.update({
        where: { id: quote.id },
        data: { status: "accepted" },
      });
    }

    // Return auto-submit form
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Redirecting to Payment...</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #f9fafb;
      color: #374151;
    }
    .loader {
      text-align: center;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e5e7eb;
      border-top-color: #1A8E7D;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    p { font-size: 14px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="loader">
    <div class="spinner"></div>
    <p>Redirecting to payment gateway...</p>
    <p style="font-size:12px;margin-top:4px;">Amount: &#8377;${advanceAmount.toLocaleString("en-IN")}</p>
  </div>
  <form id="payuForm" action="${payuEndpoint}" method="POST" style="display:none;">
    <input type="hidden" name="key" value="${key}" />
    <input type="hidden" name="txnid" value="${txnid}" />
    <input type="hidden" name="amount" value="${advanceAmount.toFixed(2)}" />
    <input type="hidden" name="productinfo" value="${escapeHtml(hashParams.productinfo)}" />
    <input type="hidden" name="firstname" value="${escapeHtml(firstname)}" />
    <input type="hidden" name="lastname" value="${escapeHtml(lastname)}" />
    <input type="hidden" name="email" value="${escapeHtml(customerEmail)}" />
    <input type="hidden" name="phone" value="${escapeHtml(customerPhone)}" />
    <input type="hidden" name="surl" value="${surl}" />
    <input type="hidden" name="furl" value="${furl}" />
    <input type="hidden" name="hash" value="${hash}" />
    <input type="hidden" name="udf1" value="${escapeHtml(hashParams.udf1 || "")}" />
    <input type="hidden" name="udf2" value="${escapeHtml(hashParams.udf2 || "")}" />
    <input type="hidden" name="udf3" value="${escapeHtml(hashParams.udf3 || "")}" />
    <input type="hidden" name="udf4" value="${escapeHtml(hashParams.udf4 || "")}" />
    <input type="hidden" name="udf5" value="${escapeHtml(hashParams.udf5 || "")}" />
  </form>
  <script>document.getElementById("payuForm").submit();</script>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    console.error("[Quote Pay] Error:", error);
    return NextResponse.redirect(
      new URL(`/quote/${token}?payment=error`, request.url)
    );
  }
}

/** Escape HTML special characters to prevent XSS in the auto-submit form */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
