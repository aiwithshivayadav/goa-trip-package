"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  TrendingUp,
  Clock,
  IndianRupee,
  CheckCircle2,
  Users,
  X,
} from "lucide-react";
import type { CalendarBooking } from "./page";

// ── Category colors ──
const CATEGORY_CONFIG: Record<
  string,
  { label: string; dot: string; bg: string; text: string }
> = {
  cruise: {
    label: "Cruise",
    dot: "bg-blue-400",
    bg: "bg-blue-400/15",
    text: "text-blue-400",
  },
  yacht: {
    label: "Yacht",
    dot: "bg-amber-400",
    bg: "bg-amber-400/15",
    text: "text-amber-400",
  },
  package_tour: {
    label: "Package",
    dot: "bg-emerald-400",
    bg: "bg-emerald-400/15",
    text: "text-emerald-400",
  },
  activity: {
    label: "Activity",
    dot: "bg-violet-400",
    bg: "bg-violet-400/15",
    text: "text-violet-400",
  },
  party: {
    label: "Party",
    dot: "bg-pink-400",
    bg: "bg-pink-400/15",
    text: "text-pink-400",
  },
  hotel: {
    label: "Hotel",
    dot: "bg-orange-400",
    bg: "bg-orange-400/15",
    text: "text-orange-400",
  },
  combo: {
    label: "Combo",
    dot: "bg-cyan-400",
    bg: "bg-cyan-400/15",
    text: "text-cyan-400",
  },
  transfer: {
    label: "Transfer",
    dot: "bg-slate-400",
    bg: "bg-slate-400/15",
    text: "text-slate-400",
  },
  custom: {
    label: "Custom",
    dot: "bg-rose-400",
    bg: "bg-rose-400/15",
    text: "text-rose-400",
  },
};

const STATUS_BADGE: Record<string, string> = {
  confirmed: "bg-green-500/20 text-green-400",
  completed: "bg-blue-500/20 text-blue-400",
  cancelled: "bg-red-500/20 text-red-400 line-through",
  draft: "bg-surface text-text-muted",
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_HEADERS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface Props {
  bookings: CalendarBooking[];
  year: number;
  month: number; // 0-indexed
  totalBookings: number;
  upcomingBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
}

export function CalendarView({
  bookings,
  year,
  month,
  totalBookings,
  upcomingBookings,
  confirmedBookings,
  totalRevenue,
}: Props) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // ── Build bookings-by-date map ──
  const bookingsByDate = useMemo(() => {
    const map: Record<string, CalendarBooking[]> = {};
    for (const b of bookings) {
      const key = b.travelDate;
      if (!map[key]) map[key] = [];
      map[key]!.push(b);
    }
    return map;
  }, [bookings]);

  // ── Calendar grid cells ──
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDow = firstDay.getDay(); // 0=Sun

    // Previous month trailing days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const cells: Array<{
      day: number;
      dateStr: string;
      isCurrentMonth: boolean;
      isToday: boolean;
    }> = [];

    for (let i = startDow - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const pm = month === 0 ? 11 : month - 1;
      const py = month === 0 ? year - 1 : year;
      const ds = `${py}-${String(pm + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ day: d, dateStr: ds, isCurrentMonth: false, isToday: false });
    }

    // Current month days
    const todayStr = new Date().toISOString().split("T")[0];
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({
        day: d,
        dateStr: ds,
        isCurrentMonth: true,
        isToday: ds === todayStr,
      });
    }

    // Next month leading days — fill to complete the last row
    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      const nm = month === 11 ? 0 : month + 1;
      const ny = month === 11 ? year + 1 : year;
      for (let d = 1; d <= remaining; d++) {
        const ds = `${ny}-${String(nm + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        cells.push({
          day: d,
          dateStr: ds,
          isCurrentMonth: false,
          isToday: false,
        });
      }
    }

    return cells;
  }, [year, month]);

  // ── Navigation ──
  function goToMonth(dir: -1 | 1) {
    let ny = year;
    let nm = month + dir;
    if (nm < 0) {
      nm = 11;
      ny--;
    } else if (nm > 11) {
      nm = 0;
      ny++;
    }
    setSelectedDate(null);
    router.push(
      `/admin/calendar?month=${ny}-${String(nm + 1).padStart(2, "0")}`
    );
  }

  function goToToday() {
    setSelectedDate(null);
    const now = new Date();
    router.push(
      `/admin/calendar?month=${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
    );
  }

  // ── Selected day bookings ──
  const selectedBookings = selectedDate
    ? bookingsByDate[selectedDate] || []
    : [];

  // ── Unique categories present this month (for legend) ──
  const activeCategories = useMemo(() => {
    const cats = new Set(bookings.map((b) => b.packageCategory));
    return Array.from(cats).sort();
  }, [bookings]);

  // ── Stats cards ──
  const stats = [
    {
      label: "Total Bookings",
      value: String(totalBookings),
      icon: CalendarDays,
      color: "text-blue-400",
    },
    {
      label: "Upcoming",
      value: String(upcomingBookings),
      icon: Clock,
      color: "text-gold",
    },
    {
      label: "Confirmed",
      value: String(confirmedBookings),
      icon: CheckCircle2,
      color: "text-green-400",
    },
    {
      label: "Revenue",
      value: formatINR(totalRevenue),
      icon: IndianRupee,
      color: "text-gold",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div>
        <h2 className="text-xl font-bold text-white">Booking Calendar</h2>
        <p className="text-sm text-text-muted mt-0.5">
          View all bookings by date &mdash; {MONTH_NAMES[month]} {year}
        </p>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="glass-card rounded-xl p-4 flex items-center gap-3"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface border border-border-gold/20">
              <s.icon className={`h-4.5 w-4.5 ${s.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-text-muted truncate">{s.label}</p>
              <p className="text-base font-bold text-white truncate">
                {s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Calendar Card ── */}
      <div className="glass-card rounded-xl p-5">
        {/* Month header + nav */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">
            {MONTH_NAMES[month]} {year}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={goToToday}
              className="rounded-lg border border-border-gold px-3 py-1.5 text-xs font-medium text-text-muted hover:text-white hover:bg-surface transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => goToMonth(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-gold text-text-muted hover:text-white hover:bg-surface transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => goToMonth(1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-gold text-text-muted hover:text-white hover:bg-surface transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 gap-px rounded-t-lg bg-border-gold/20 overflow-hidden">
          {DAY_HEADERS.map((day) => (
            <div
              key={day}
              className="bg-cosmic-900/80 px-2 py-2.5 text-center"
            >
              <span className="text-[11px] font-semibold text-text-dim uppercase tracking-wide">
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-px bg-border-gold/20 rounded-b-lg overflow-hidden">
          {calendarDays.map((cell, idx) => {
            const dayBookings = bookingsByDate[cell.dateStr] || [];
            const count = dayBookings.length;
            const isSelected = selectedDate === cell.dateStr;
            // Unique categories for this day (max 4 dots shown)
            const dayCats = Array.from(
              new Set(dayBookings.map((b) => b.packageCategory))
            ).slice(0, 4);

            return (
              <button
                key={idx}
                onClick={() => {
                  if (cell.isCurrentMonth) {
                    setSelectedDate(isSelected ? null : cell.dateStr);
                  }
                }}
                disabled={!cell.isCurrentMonth}
                className={`
                  relative bg-cosmic-950/80 px-2 py-2 min-h-[60px] sm:min-h-[72px]
                  text-left transition-colors group
                  ${!cell.isCurrentMonth ? "opacity-30 cursor-default" : "hover:bg-surface/40 cursor-pointer"}
                  ${isSelected ? "!bg-gold/10 ring-1 ring-inset ring-gold/40" : ""}
                  ${cell.isToday ? "ring-1 ring-inset ring-gold/30" : ""}
                `}
              >
                {/* Day number */}
                <span
                  className={`
                    text-xs font-medium
                    ${cell.isToday ? "flex h-6 w-6 items-center justify-center rounded-full bg-gold text-cosmic-950 font-bold" : ""}
                    ${!cell.isToday && cell.isCurrentMonth ? "text-text-muted group-hover:text-white" : ""}
                    ${!cell.isCurrentMonth ? "text-text-dim" : ""}
                  `}
                >
                  {cell.day}
                </span>

                {/* Booking count badge */}
                {count > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-gold/20 text-[9px] font-bold text-gold px-1">
                    {count}
                  </span>
                )}

                {/* Category dots */}
                {dayCats.length > 0 && (
                  <div className="mt-1.5 flex gap-1 flex-wrap">
                    {dayCats.map((cat) => (
                      <div
                        key={cat}
                        className={`h-1.5 w-1.5 rounded-full ${CATEGORY_CONFIG[cat]?.dot || "bg-gray-400"}`}
                        title={CATEGORY_CONFIG[cat]?.label || cat}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Legend ── */}
        {activeCategories.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            <span className="text-[10px] uppercase tracking-wider text-text-dim font-semibold">
              Legend
            </span>
            {activeCategories.map((cat) => {
              const cfg = CATEGORY_CONFIG[cat];
              if (!cfg) return null;
              return (
                <div key={cat} className="flex items-center gap-1.5">
                  <div className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                  <span className="text-[11px] text-text-muted">
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Selected Day Detail Panel ── */}
      {selectedDate && (
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 border border-gold/20">
                <CalendarDays className="h-4.5 w-4.5 text-gold" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  {new Date(selectedDate + "T00:00:00").toLocaleDateString(
                    "en-IN",
                    {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </h4>
                <p className="text-xs text-text-muted">
                  {selectedBookings.length === 0
                    ? "No bookings"
                    : `${selectedBookings.length} booking${selectedBookings.length > 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedDate(null)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:text-white hover:bg-surface transition-colors"
              aria-label="Close panel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {selectedBookings.length === 0 ? (
            <div className="py-8 text-center">
              <CalendarDays className="h-8 w-8 text-text-dim mx-auto mb-2" />
              <p className="text-sm text-text-muted">
                No bookings on this date
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {selectedBookings.map((b) => {
                const cfg = CATEGORY_CONFIG[b.packageCategory] ?? { label: "Other", dot: "bg-gray-400", bg: "bg-gray-400/15", text: "text-gray-400" };
                return (
                  <div
                    key={b.id}
                    className="flex items-start gap-3 rounded-lg bg-surface/60 border border-border-gold/10 p-3.5 hover:border-border-gold/30 transition-colors cursor-pointer"
                    onClick={() =>
                      router.push(`/admin/bookings/${b.id}`)
                    }
                  >
                    {/* Category indicator */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${cfg.bg}`}
                    >
                      <div className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {b.packageName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Users className="h-3 w-3 text-text-dim" />
                            <span className="text-xs text-text-muted">
                              {b.customerName}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-gold">
                            {formatINR(b.totalAmount)}
                          </p>
                          <span
                            className={`inline-block mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_BADGE[b.status] || STATUS_BADGE.draft}`}
                          >
                            {b.status}
                          </span>
                        </div>
                      </div>

                      {/* Bottom row */}
                      <div className="flex items-center gap-3 mt-1.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${cfg.bg} ${cfg.text}`}
                        >
                          {cfg.label}
                        </span>
                        <span className="text-[11px] text-text-dim">
                          {b.bookingId}
                        </span>
                        <span className="text-[11px] text-text-dim">
                          {b.adults}A
                          {b.children > 0 ? ` + ${b.children}C` : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
