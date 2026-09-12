"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Filter, Download, Plus, Loader2 } from "lucide-react";
import { formatINR } from "@/lib/utils";

interface BookingRow {
  id: string;
  bookingId: string;
  customerName: string;
  customerPhone: string;
  packageName: string;
  packageCategory: string;
  travelDate: string;
  adults: number;
  children: number;
  totalAmount: number;
  advancePaid: number;
  balanceDue: number;
  paymentStatus: string;
  status: string;
}

const statusColors: Record<string, string> = {
  confirmed: "bg-green-500/20 text-green-400",
  completed: "bg-blue-500/20 text-blue-400",
  cancelled: "bg-red-500/20 text-red-400",
  draft: "bg-surface text-text-muted",
};

const paymentColors: Record<string, string> = {
  paid: "bg-green-500/20 text-green-400",
  partial: "bg-gold/20 text-gold",
  pending: "bg-rose/20 text-rose",
  failed: "bg-red-500/20 text-red-400",
  refunded: "bg-violet-500/20 text-violet-400",
};

const categoryLabels: Record<string, string> = {
  cruise: "cruise", yacht: "yacht", package_tour: "package", activity: "activity",
  party: "party", hotel: "hotel", combo: "combo", transfer: "transfer", custom: "custom",
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings?limit=200")
      .then((r) => r.json())
      .then((data) => {
        if (data.bookings) {
          setBookings(
            data.bookings.map((b: Record<string, unknown>) => ({
              id: b.id,
              bookingId: b.bookingId || `GTP-${b.id}`,
              customerName: b.customerName || "—",
              customerPhone: b.customerPhone || "",
              packageName: b.packageName || "—",
              packageCategory: categoryLabels[(b.packageCategory as string)] || (b.packageCategory as string) || "—",
              travelDate: b.travelDate ? new Date(b.travelDate as string).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—",
              adults: (b.adults as number) || 0,
              children: (b.children as number) || 0,
              totalAmount: Number(b.totalAmount) || 0,
              advancePaid: Number(b.advancePaid) || 0,
              balanceDue: Number(b.balanceDue) || 0,
              paymentStatus: (b.paymentStatus as string) || "pending",
              status: (b.status as string) || "draft",
            }))
          );
        }
      })
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? bookings.filter((b) => b.customerName.toLowerCase().includes(search.toLowerCase()) || b.bookingId.toLowerCase().includes(search.toLowerCase()) || b.packageName.toLowerCase().includes(search.toLowerCase()))
    : bookings;

  const totals = {
    revenue: bookings.reduce((s, b) => s + b.totalAmount, 0),
    collected: bookings.reduce((s, b) => s + b.advancePaid, 0),
    pending: bookings.reduce((s, b) => s + b.balanceDue, 0),
  };

  const handleExportCSV = () => {
    const csv = "Booking ID,Customer,Phone,Package,Category,Travel Date,Adults,Children,Total,Paid,Balance,Payment,Status\n" +
      bookings.map((b) => `${b.bookingId},"${b.customerName}",${b.customerPhone},"${b.packageName}",${b.packageCategory},${b.travelDate},${b.adults},${b.children},${b.totalAmount},${b.advancePaid},${b.balanceDue},${b.paymentStatus},${b.status}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "bookings.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Bookings exported");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bookings..." className="w-full h-9 rounded-lg bg-surface border border-border-gold pl-9 pr-3 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportCSV} className="flex h-9 items-center gap-1.5 rounded-lg border border-border-gold px-3 text-xs text-text-muted hover:text-white hover:bg-surface transition-colors">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-text-muted text-sm">No bookings yet</p>
            <p className="text-text-dim text-xs mt-1">Bookings from PayU payments will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-gold/30 bg-cosmic-900/50">
                  <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Booking ID</th>
                  <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Customer</th>
                  <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 hidden md:table-cell">Package</th>
                  <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Travel Date</th>
                  <th className="text-right text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Total</th>
                  <th className="text-right text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Balance</th>
                  <th className="text-center text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Payment</th>
                  <th className="text-center text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.bookingId} className="border-b border-border-gold/10 hover:bg-surface/50 transition-colors cursor-pointer">
                    <td className="px-4 py-3.5"><span className="font-mono text-xs text-gold">{b.bookingId}</span></td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-white text-sm">{b.customerName}</p>
                      <p className="text-[10px] text-text-dim mt-0.5">{b.customerPhone}</p>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <p className="text-sm text-text-muted">{b.packageName}</p>
                      <p className="text-[10px] text-text-dim capitalize mt-0.5">{b.packageCategory} · {b.adults}A{b.children > 0 ? `+${b.children}C` : ""}</p>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-text-muted whitespace-nowrap">{b.travelDate}</td>
                    <td className="px-4 py-3.5 text-right text-sm font-medium text-white">{formatINR(b.totalAmount)}</td>
                    <td className="px-4 py-3.5 text-right text-sm hidden sm:table-cell">
                      {b.balanceDue > 0 ? <span className="text-gold font-medium">{formatINR(b.balanceDue)}</span> : <span className="text-green-400">—</span>}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${paymentColors[b.paymentStatus] || "bg-surface text-text-muted"}`}>{b.paymentStatus}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColors[b.status] || "bg-surface text-text-muted"}`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {bookings.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-text-muted">
          <span>Showing {filtered.length} of {bookings.length} bookings</span>
          <div className="flex items-center gap-4">
            <span>Total Revenue: <strong className="text-white">{formatINR(totals.revenue)}</strong></span>
            <span>Collected: <strong className="text-green-400">{formatINR(totals.collected)}</strong></span>
            <span>Pending: <strong className="text-gold">{formatINR(totals.pending)}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
