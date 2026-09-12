import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const quoteId = parseInt(id);
  if (isNaN(quoteId)) {
    return NextResponse.json({ error: "Invalid quote ID" }, { status: 400 });
  }

  try {
    const quote = await db.quote.findUnique({
      where: { id: quoteId },
      include: {
        customer: { select: { name: true, phone: true, email: true } },
        lead: { select: { name: true, phone: true } },
      },
    });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json({ quote });
  } catch (error) {
    console.error("[Quotes API] GET by ID error:", error);
    return NextResponse.json({ error: "Failed to load quote" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const quoteId = parseInt(id);
  if (isNaN(quoteId)) {
    return NextResponse.json({ error: "Invalid quote ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const data: Record<string, unknown> = {};

    if (body.title !== undefined) data.title = body.title;
    if (body.validUntil !== undefined) data.validUntil = new Date(body.validUntil);
    if (body.itemsJson !== undefined) data.itemsJson = body.itemsJson;
    if (body.totalPrice !== undefined) data.totalPrice = body.totalPrice;
    if (body.discountAmount !== undefined) data.discountAmount = body.discountAmount;
    if (body.gstAmount !== undefined) data.gstAmount = body.gstAmount;
    if (body.advancePercent !== undefined) data.advancePercent = body.advancePercent;
    if (body.status !== undefined) data.status = body.status;

    const quote = await db.quote.update({
      where: { id: quoteId },
      data,
    });

    return NextResponse.json({ success: true, quote });
  } catch (error) {
    console.error("[Quotes API] PATCH error:", error);
    const message = error instanceof Error ? error.message : "Failed to update quote";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
