import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";
import { generateQuoteCode, generatePublicToken } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [quotes, total] = await Promise.all([
      db.quote.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          customer: { select: { name: true, phone: true, email: true } },
          lead: { select: { name: true, phone: true } },
        },
      }),
      db.quote.count({ where }),
    ]);

    return NextResponse.json({ quotes, total, page, limit });
  } catch (error) {
    console.error("[Quotes API] GET error:", error);
    return NextResponse.json({ error: "Failed to load quotes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();

    if (!body.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const quoteCode = generateQuoteCode();
    const publicToken = generatePublicToken();

    let customerId: number | null = null;
    if (body.customerName && body.customerPhone) {
      const customer = await db.customer.upsert({
        where: { phone: body.customerPhone },
        update: { name: body.customerName, lastSeenAt: new Date() },
        create: {
          name: body.customerName,
          phone: body.customerPhone,
          phoneRaw: body.customerPhone.replace(/\D/g, "").slice(-10),
          email: body.customerEmail || null,
          source: "quote",
        },
      });
      customerId = customer.id;
    }

    const quote = await db.quote.create({
      data: {
        quoteCode,
        title: body.title,
        customerId,
        validUntil: body.validUntil ? new Date(body.validUntil) : new Date(Date.now() + 7 * 86400000),
        itemsJson: body.itemsJson || "[]",
        totalPrice: body.totalPrice || 0,
        discountAmount: body.discountAmount || 0,
        gstAmount: body.gstAmount || 0,
        advancePercent: body.advancePercent ?? 25,
        status: body.status || "draft",
        publicToken,
        brand: "goatrippackage",
      },
    });

    return NextResponse.json({ success: true, quote, quoteCode, publicToken }, { status: 201 });
  } catch (error) {
    console.error("[Quotes API] POST error:", error);
    const message = error instanceof Error ? error.message : "Failed to create quote";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
