import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const coupons = await db.coupon.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ coupons });
  } catch (error) {
    console.error("[Coupons API] GET error:", error);
    return NextResponse.json({ error: "Failed to load coupons" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const body = await request.json();

    if (!body.code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await db.coupon.create({
      data: {
        code: body.code.toUpperCase(),
        type: body.type || "percent",
        value: body.value,
        appliesTo: body.appliesTo || "all",
        minAmount: body.minAmount || null,
        maxDiscount: body.maxDiscount || null,
        maxUses: body.maxUses || null,
        validFrom: body.validFrom ? new Date(body.validFrom) : null,
        validTo: body.validTo ? new Date(body.validTo) : null,
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
    }
    console.error("[Coupons API] POST error:", error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
