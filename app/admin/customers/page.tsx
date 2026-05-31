import { Search, Filter, Download, Users } from "lucide-react";
import { db } from "@/lib/db";

// Mock data — shown when DB is empty or unreachable
const mockCustomers = [
  { id: 1, name: "Priya Sharma", phone: "+91 98765 43210", email: "priya@gmail.com", bookings: 2, ltv: 38997, lastBooking: "Jun 8, 2026", source: "Google Ads" },
  { id: 2, name: "Vikram Patel", phone: "+91 87654 32109", email: "vikram@corp.com", bookings: 1, ltv: 149980, lastBooking: "Jun 15, 2026", source: "Referral" },
  { id: 3, name: "Sneha Rao", phone: "+91 76543 21098", email: "sneha@outlook.com", bookings: 3, ltv: 12800, lastBooking: "May 28, 2026", source: "Instagram" },
  { id: 4, name: "Arjun Mehta", phone: "+91 65432 10987", bookings: 1, ltv: 47992, lastBooking: "Jun 20, 2026", source: "WhatsApp" },
  { id: 5, name: "Divya Kapoor", phone: "+91 54321 09876", email: "divya@gmail.com", bookings: 1, ltv: 24000, lastBooking: "Jun 5, 2026", source: "Website" },
  { id: 6, name: "Meera Joshi", phone: "+91 43210 98765", bookings: 1, ltv: 3500, lastBooking: "Jun 3, 2026", source: "Website" },
];

export default async function CustomersPage() {
  // ── Fetch real customers from DB (with fallback) ──
  let customers = mockCustomers;

  try {
    const realCustomers = await db.customer.findMany({
      orderBy: { lastSeenAt: "desc" },
      take: 50,
    }).catch(() => []);

    if (realCustomers.length > 0) {
      customers = realCustomers.map((c) => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        email: c.email || undefined,
        bookings: c.totalBookings,
        ltv: Number(c.lifetimeValue),
        lastBooking: c.lastSeenAt.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
        source: c.source || "—",
      }));
    }
  } catch {
    // DB unreachable — keep mock data
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
          <input type="text" placeholder="Search customers..." className="w-full h-9 rounded-lg bg-surface border border-border-gold pl-9 pr-3 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors" />
        </div>
        <button className="flex h-9 items-center gap-1.5 rounded-lg border border-border-gold px-3 text-xs text-text-muted hover:text-white hover:bg-surface transition-colors">
          <Download className="h-3.5 w-3.5" /> Export
        </button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-gold/30 bg-cosmic-900/50">
                <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Customer</th>
                <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 hidden md:table-cell">Contact</th>
                <th className="text-center text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Bookings</th>
                <th className="text-right text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Lifetime Value</th>
                <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Last Booking</th>
                <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Source</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-border-gold/10 hover:bg-surface/50 transition-colors cursor-pointer">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-gold">{c.name[0]}</span>
                      </div>
                      <p className="font-medium text-white text-sm">{c.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <p className="text-xs text-text-muted">{c.phone}</p>
                    {c.email && <p className="text-[10px] text-text-dim">{c.email}</p>}
                  </td>
                  <td className="px-4 py-3.5 text-center text-sm text-white font-medium">{c.bookings}</td>
                  <td className="px-4 py-3.5 text-right text-sm font-medium text-gold">₹{c.ltv.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3.5 text-sm text-text-muted hidden sm:table-cell">{c.lastBooking}</td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] text-text-muted">{c.source}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
