import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const users = await db.salesUser.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("[Settings Users API] GET error:", error);
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 });
  }
}
