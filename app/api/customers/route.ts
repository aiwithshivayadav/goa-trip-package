import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

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
    return NextResponse.json({ error: "Failed to load customers" }, { status: 500 });
  }
}
