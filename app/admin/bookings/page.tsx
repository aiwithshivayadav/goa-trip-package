"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Search, Filter, Plus, Download } from "lucide-react";

// Mock data — shown when DB is empty or unreachable
const mockBookings = [
  { id: "GTP-2026-A8K2L", customer: "Meera Joshi", phone: "+91 98765 43210", package: "Scuba Diving — Grande Island", category: "activity", date: "Jun 3, 2026", adults: 1, children: 0, total: 3500, paid: 3500, balance: 0, paymentStatus: "paid", status: "confirmed", source: "Website" },
  { id: "GTP-2026-B3M9N", customer: "Rahul & Priya", phone: "+91 87654 32109", package: "Honeymoon Classic 3N/4D", category: "package", date: "Jun 8, 2026", adults: 2, children: 0, total: 25998, paid: 6500, balance: 19498, paymentStatus: "partial", status: "confirmed", source: "Google Ads" },
  { id: "GTP-2026-C7P4Q", customer: "Vikram's Team (20)", phone: "+91 76543 21098", package: "Corporate Offsite 2N/3D", category: "package", date: "Jun 15, 2026", adults: 20, children: 0, total: 149980, paid: 0, balance: 149980, paymentStatus: "pending", status: "confirmed", source: "Referral" },
  { id: "GTP-2026-D2R6S", customer: "Sneha & Amit", phone: "+91 65432 10987", package: "Sunset Dinner Cruise", category: "cruise", date: "May 28, 2026", adults: 2, children: 0, total: 2400, paid: 2400, balance: 0, paymentStatus: "paid", status: "completed", source: "Instagram" },
  { id: "GTP-2026-E5T8U", customer: "Arjun's Group (8)", phone: "+91 54321 09876", package: "Bachelor Group 3N/4D", category: "package", date: "Jun 20, 2026", adults: 8, children: 0, total: 47992, paid: 12000, balance: 35992, paymentStatus: "partial", status: "confirmed", source: "WhatsApp" },
  { id: "GTP-2026-F9V1W", customer: "Divya Kapoor", phone: "+91 43210 98765", package: "Maxum Luxury Yacht", category: "yacht", date: "Jun 5, 2026", adults: 10, children: 2, total: 24000, paid: 24000, balance: 0, paymentStatus: "paid", status: "confirmed", source: "Website" },
];

// Map Prisma packageCategory enum to UI category string
const categoryMap: Record<string, string> = {
  cruise: "cruise",
  yacht: "yacht",
  package_tour: "package",
  activity: "activity",
  party: "party",
  hotel: "hotel",
  combo: "combo",
  transfer: "transfer",
  custom: "custom",
};

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
};

export default function BookingsPage() {
  const [search, setSearch] = useState("");
  const bookings = mockBookings;

  const filtered = search
    ? bookings.filter((b) => b.customer.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase()))
    : bookings;

  const handleExportCSV = () => {
    const csv = "ID,Customer,Phone,Package,Category,Date,Adults,Children,Total,Paid,Balance,Payment Status,Status,Source\n" +
      bookings.map(b => `${b.id},${b.customer},${b.phone},"${b.package}",${b.category},${b.date},${b.adults},${b.children},${b.total},${b.paid},${b.balance},${b.paymentStatus},${b.status},${b.source}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bookings.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Bookings exported to CSV");
  };

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bookings..." className="w-full h-9 rounded-lg bg-surface border border-border-gold pl-9 pr-3 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors" />
          </div>
          <button className="flex h-9 items-center gap-1.5 rounded-lg border border-border-gold px-3 text-xs text-text-muted hover:text-white hover:bg-surface transition-colors">
            <Filter className="h-3.5 w-3.5" /> Filters
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExportCSV} className="flex h-9 items-center gap-1.5 rounded-lg border border-border-gold px-3 text-xs text-text-muted hover:text-white hover:bg-surface transition-colors">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
          <button onClick={() => toast.info("New booking form coming soon")} className="flex h-9 items-center gap-1.5 rounded-lg bg-gold-gradient px-4 text-xs font-bold text-cosmic-950 transition-transform hover:scale-[1.02]">
            <Plus className="h-3.5 w-3.5" /> New Booking
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
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
                <tr key={b.id} onClick={() => toast.info("Booking detail view coming soon")} className="border-b border-border-gold/10 hover:bg-surface/50 transition-colors cursor-pointer">
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-xs text-gold">{b.id}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-white text-sm">{b.customer}</p>
                    <p className="text-[10px] text-text-dim mt-0.5">{b.phone}</p>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <p className="text-sm text-text-muted">{b.package}</p>
                    <p className="text-[10px] text-text-dim capitalize mt-0.5">{b.category} · {b.adults}A{b.children > 0 ? `+${b.children}C` : ""}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-text-muted whitespace-nowrap">{b.date}</td>
                  <td className="px-4 py-3.5 text-right text-sm font-medium text-white">₹{b.total.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3.5 text-right text-sm hidden sm:table-cell">
                    {b.balance > 0 ? (
                      <span className="text-gold font-medium">₹{b.balance.toLocaleString("en-IN")}</span>
                    ) : (
                      <span className="text-green-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${paymentColors[b.paymentStatus]}`}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColors[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-text-muted">
        <span>Showing {filtered.length} of {bookings.length} bookings</span>
        <div className="flex items-center gap-4">
          <span>Total Revenue: <strong className="text-white">₹{bookings.reduce((s, b) => s + b.total, 0).toLocaleString("en-IN")}</strong></span>
          <span>Collected: <strong className="text-green-400">₹{bookings.reduce((s, b) => s + b.paid, 0).toLocaleString("en-IN")}</strong></span>
          <span>Pending: <strong className="text-gold">₹{bookings.reduce((s, b) => s + b.balance, 0).toLocaleString("en-IN")}</strong></span>
        </div>
      </div>
    </div>
  );
}
