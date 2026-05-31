import { CalendarDays, Ship, Anchor, Info } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Availability Calendar</h2>
        <p className="text-sm text-text-muted mt-0.5">View all yacht, cruise, and activity bookings by date</p>
      </div>

      {/* Calendar placeholder */}
      <div className="glass-card rounded-xl p-8">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gold/10 border border-gold/20">
              <CalendarDays className="h-10 w-10 text-gold" />
            </div>
            <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-cosmic-950">
              <span className="text-[10px] font-bold">E</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-white mb-2">Availability Calendar</h3>
          <p className="text-sm text-text-muted text-center max-w-md mb-6">
            Connect <span className="text-gold font-medium">FullCalendar.io</span> to activate the interactive availability calendar.
            Shows all yacht, cruise, and activity bookings per day with drag-and-drop scheduling.
          </p>

          {/* Feature preview */}
          <div className="grid gap-3 sm:grid-cols-3 w-full max-w-lg mb-8">
            <div className="rounded-lg bg-surface border border-border-gold/20 p-3 text-center">
              <Ship className="h-5 w-5 text-blue-400 mx-auto mb-1.5" />
              <p className="text-[11px] font-medium text-white">Cruise Slots</p>
              <p className="text-[10px] text-text-dim">Sunset, Night Party, Dinner</p>
            </div>
            <div className="rounded-lg bg-surface border border-border-gold/20 p-3 text-center">
              <Anchor className="h-5 w-5 text-gold mx-auto mb-1.5" />
              <p className="text-[11px] font-medium text-white">Yacht Bookings</p>
              <p className="text-[10px] text-text-dim">Maxum, Polaris, Riviera</p>
            </div>
            <div className="rounded-lg bg-surface border border-border-gold/20 p-3 text-center">
              <CalendarDays className="h-5 w-5 text-green-400 mx-auto mb-1.5" />
              <p className="text-[11px] font-medium text-white">Day View</p>
              <p className="text-[10px] text-text-dim">Capacity & conflicts</p>
            </div>
          </div>

          {/* Mock calendar grid (decorative) */}
          <div className="w-full max-w-2xl">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-sm font-bold text-white">June 2026</span>
              <div className="flex items-center gap-2">
                <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-border-gold text-text-muted hover:text-white hover:bg-surface transition-colors text-xs">&lsaquo;</button>
                <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-border-gold text-text-muted hover:text-white hover:bg-surface transition-colors text-xs">&rsaquo;</button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-px rounded-lg bg-border-gold/20 overflow-hidden">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="bg-cosmic-900/80 px-2 py-2 text-center">
                  <span className="text-[10px] font-medium text-text-dim uppercase">{day}</span>
                </div>
              ))}
              {Array.from({ length: 35 }, (_, i) => {
                const dayNum = i - 0; // June 2026 starts on Monday, adjust offset
                const isCurrentMonth = dayNum >= 1 && dayNum <= 30;
                const hasBooking = [3, 5, 8, 12, 15, 18, 20, 22, 25, 28].includes(dayNum);
                return (
                  <div
                    key={i}
                    className={`bg-cosmic-950/80 px-2 py-2 min-h-[48px] ${
                      !isCurrentMonth ? "opacity-30" : ""
                    }`}
                  >
                    <span className={`text-[11px] ${isCurrentMonth ? "text-text-muted" : "text-text-dim"}`}>
                      {isCurrentMonth ? dayNum : ""}
                    </span>
                    {isCurrentMonth && hasBooking && (
                      <div className="mt-1 flex gap-0.5">
                        <div className="h-1 w-1 rounded-full bg-gold/60" />
                        <div className="h-1 w-1 rounded-full bg-blue-400/60" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Phase note */}
      <div className="flex items-start gap-3 rounded-lg bg-gold/5 border border-gold/20 p-4">
        <Info className="h-4 w-4 text-gold shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-medium text-gold">Phase E Implementation</p>
          <p className="text-xs text-text-muted mt-0.5">
            Calendar integration with FullCalendar.io, real-time availability checks, and conflict detection
            will be wired up in Phase E after the booking engine is connected to the database.
          </p>
        </div>
      </div>
    </div>
  );
}
