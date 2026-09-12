import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const [payments, total] = await Promise.all([
      db.payment.findMany({
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: { booking: { select: { bookingId: true, customerName: true, customerPhone: true } } },
      }),
      db.payment.count(),
    ]);

    const totalCollected = await db.payment.aggregate({
      where: { status: "paid" },
      _sum: { amount: true },
    });

    const totalPending = await db.booking.aggregate({
      where: { paymentStatus: { in: ["pending", "partial"] } },
      _sum: { balanceDue: true },
    });

    const totalRefunded = await db.payment.aggregate({
      where: { milestone: "refund" },
      _sum: { amount: true },
    });

    return NextResponse.json({
      payments,
      total,
      page,
      limit,
      summary: {
        collected: totalCollected._sum.amount || 0,
        pending: totalPending._sum.balanceDue || 0,
        refunded: totalRefunded._sum.amount || 0,
      },
    });
  } catch (error) {
    console.error("[Payments API] GET error:", error);
    return NextResponse.json({ payments: [], total: 0, page: 1, limit: 50, summary: { collected: 0, pending: 0, refunded: 0 } });
  }
}
