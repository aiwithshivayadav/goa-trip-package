import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Public quote actions — no auth required (token-authenticated).
 * PATCH /api/quotes/public/[token]
 *   body: { action: "accept" } or { action: "decline" }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token || token.length < 10) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { action } = body;

    if (!action || !["accept", "decline"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Use 'accept' or 'decline'." },
        { status: 400 }
      );
    }

    const quote = await db.quote.findUnique({
      where: { publicToken: token },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    // Prevent action on already-terminal statuses
    if (quote.status === "converted") {
      return NextResponse.json(
        { error: "This quote has already been converted to a booking." },
        { status: 409 }
      );
    }

    if (action === "accept") {
      // Check expiry
      if (new Date() > new Date(quote.validUntil)) {
        return NextResponse.json(
          { error: "This quote has expired. Please contact us for a revised quote." },
          { status: 410 }
        );
      }

      if (quote.status === "accepted") {
        return NextResponse.json(
          { message: "Quote is already accepted.", status: "accepted" },
          { status: 200 }
        );
      }

      if (quote.status === "declined") {
        return NextResponse.json(
          { error: "This quote was declined. Please contact us to discuss a new quote." },
          { status: 409 }
        );
      }

      await db.quote.update({
        where: { id: quote.id },
        data: { status: "accepted" },
      });

      return NextResponse.json({
        success: true,
        message: "Quote accepted! Our team will reach out shortly to finalize your booking.",
        status: "accepted",
      });
    }

    if (action === "decline") {
      if (quote.status === "declined") {
        return NextResponse.json(
          { message: "Quote is already declined.", status: "declined" },
          { status: 200 }
        );
      }

      if (quote.status === "accepted") {
        return NextResponse.json(
          { error: "This quote was already accepted. Please contact us if you need changes." },
          { status: 409 }
        );
      }

      await db.quote.update({
        where: { id: quote.id },
        data: { status: "declined" },
      });

      return NextResponse.json({
        success: true,
        message: "Quote declined. We'd love to help you find the perfect Goa experience — feel free to reach out anytime.",
        status: "declined",
      });
    }
  } catch (error) {
    console.error("[Public Quote API] PATCH error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
