import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/api-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    const bookingId = parseInt(id);

    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: { payments: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("[Bookings API] GET by id error:", error);
    return NextResponse.json({ error: "Failed to fetch booking" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    const bookingId = parseInt(id);
    const body = await request.json();

    const updateData: Record<string, unknown> = {};

    if (body.status !== undefined) updateData.status = body.status;
    if (body.notes !== undefined) updateData.notes = body.notes || null;
    if (body.specialRequests !== undefined) updateData.specialRequests = body.specialRequests || null;
    if (body.travelDate !== undefined) updateData.travelDate = new Date(body.travelDate);

    const booking = await db.booking.update({
      where: { id: bookingId },
      data: updateData,
      include: { payments: true },
    });

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error("[Bookings API] PATCH error:", error);
    const message = error instanceof Error ? error.message : "Failed to update booking";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
