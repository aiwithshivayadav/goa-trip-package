import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/customers — List customers (admin)
 * Returns real data from DB, or empty array if DB is unreachable.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const [customers, total] = await Promise.all([
      db.customer.findMany({
        orderBy: { lastSeenAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.customer.count(),
    ]);

    return NextResponse.json({ customers, total, page, limit });
  } catch (error) {
    console.error("[Customers API] GET error:", error);
    return NextResponse.json({ customers: [], total: 0, page: 1, limit: 50 });
  }
}
