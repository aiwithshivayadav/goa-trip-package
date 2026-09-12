import { db } from "@/lib/db";
import { CalendarView } from "./calendar-view";

export const dynamic = "force-dynamic";

export interface CalendarBooking {
  id: number;
  bookingId: string;
  customerName: string;
  packageName: string;
  packageCategory: string;
  travelDate: string; // ISO date string YYYY-MM-DD
  adults: number;
  children: number;
  totalAmount: number;
  status: string;
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const monthParam = params.month; // YYYY-MM format

  // Parse requested month or default to current
  let year: number;
  let month: number; // 0-indexed
  const now = new Date();

  if (monthParam && /^\d{4}-\d{2}$/.test(monthParam)) {
    const parts = monthParam.split("-").map(Number);
    year = parts[0] ?? now.getFullYear();
    month = (parts[1] ?? now.getMonth() + 1) - 1;
  } else {
    year = now.getFullYear();
    month = now.getMonth();
  }

  // Build date range for the requested month (UTC dates to match @db.Date)
  const startOfMonth = new Date(Date.UTC(year, month, 1));
  const endOfMonth = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

  let bookings: CalendarBooking[] = [];

  try {
    const raw = await db.booking.findMany({
      where: {
        travelDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      select: {
        id: true,
        bookingId: true,
        customerName: true,
        packageName: true,
        packageCategory: true,
        travelDate: true,
        adults: true,
        children: true,
        totalAmount: true,
        status: true,
      },
      orderBy: { travelDate: "asc" },
    });

    bookings = raw.map((b) => ({
      id: b.id,
      bookingId: b.bookingId,
      customerName: b.customerName,
      packageName: b.packageName,
      packageCategory: b.packageCategory,
      travelDate: b.travelDate.toISOString().slice(0, 10),
      adults: b.adults,
      children: b.children,
      totalAmount: Number(b.totalAmount),
      status: b.status,
    }));
  } catch {
    // DB unreachable — render empty calendar
  }

  // Summary stats
  const totalBookings = bookings.length;
  const today = now.toISOString().slice(0, 10);
  const upcomingBookings = bookings.filter((b) => b.travelDate >= today).length;
  const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;

  return (
    <CalendarView
      bookings={bookings}
      year={year}
      month={month}
      totalBookings={totalBookings}
      upcomingBookings={upcomingBookings}
      confirmedBookings={confirmedBookings}
      totalRevenue={totalRevenue}
    />
  );
}
