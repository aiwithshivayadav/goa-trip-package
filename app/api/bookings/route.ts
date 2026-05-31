import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/bookings — List bookings (admin)
 * Returns real data from DB, or empty array if DB is unreachable.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where = status
      ? { status: status as "draft" | "confirmed" | "cancelled" | "completed" }
      : {};

    const [bookings, total] = await Promise.all([
      db.booking.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.booking.count({ where }),
    ]);

    return NextResponse.json({ bookings, total, page, limit });
  } catch (error) {
    console.error("[Bookings API] GET error:", error);
    return NextResponse.json({ bookings: [], total: 0, page: 1, limit: 50 });
  }
}
