import { Inbox, FileText, CalendarDays, IndianRupee, TrendingUp, Clock, AlertCircle, Users, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";

/**
 * Admin Dashboard — Today KPIs + This Month + Pending Actions + Quick Links
 * Fetches real counts from DB; falls back to mock data if DB is empty/unreachable.
 */

// Mock data — shown when DB is empty or unreachable
const mockTodayStats = [
  { label: "New Leads", value: "8", change: "+3", up: true, icon: Inbox, href: "/admin/leads", color: "text-blue-400" },
  { label: "Quotes Sent", value: "3", change: "+1", up: true, icon: FileText, href: "/admin/quotes", color: "text-violet-400" },
  { label: "Bookings", value: "2", change: "0", up: true, icon: CalendarDays, href: "/admin/bookings", color: "text-green-400" },
  { label: "Revenue Today", value: "₹34,500", change: "+₹12k", up: true, icon: IndianRupee, href: "/admin/payments", color: "text-gold" },
];

const mockMonthStats = {
  revenue: "₹4,85,000",
  bookings: 47,
  leads: 186,
  conversion: "25.3%",
};

const mockPendingActions = [
  { type: "follow-up", text: "Follow up with Priya Sharma — honeymoon quote sent 2d ago", time: "Overdue", urgent: true },
  { type: "balance", text: "₹15,000 balance due from Arjun's Group — travel in 5 days", time: "Due Jun 6", urgent: true },
  { type: "quote", text: "Quote Q-2026-X7K2P viewed 3 times but not accepted", time: "2 hrs ago", urgent: false },
  { type: "lead", text: "New lead from Google Ads — Vikram, corporate offsite for 20 pax", time: "30 min ago", urgent: false },
  { type: "review", text: "Post-trip review request pending for Sneha & Amit (anniversary trip)", time: "Send today", urgent: false },
];

const mockRecentBookings = [
  { id: "GTP-2026-A8K2L", customer: "Meera Joshi", package: "Scuba Diving — Grande Island", date: "Jun 3", amount: "₹3,500", status: "confirmed" },
  { id: "GTP-2026-B3M9N", customer: "Rahul & Priya", package: "Honeymoon Classic 3N/4D", date: "Jun 8", amount: "₹12,999", status: "partial" },
  { id: "GTP-2026-C7P4Q", customer: "Vikram's Team", package: "Corporate Offsite 2N/3D", date: "Jun 15", amount: "₹1,49,980", status: "pending" },
];

export default async function AdminDashboardPage() {
  // ── Fetch real data from DB (with fallback) ──
  let leadCount = 0;
  let bookingCount = 0;
  let customerCount = 0;
  let quoteCount = 0;
  let dbRecentBookings: typeof mockRecentBookings = [];
  let usingRealData = false;

  try {
    [leadCount, bookingCount, customerCount, quoteCount] = await Promise.all([
      db.lead.count().catch(() => 0),
      db.booking.count().catch(() => 0),
      db.customer.count().catch(() => 0),
      db.quote.count().catch(() => 0),
    ]);

    usingRealData = leadCount > 0 || bookingCount > 0 || customerCount > 0;

    if (bookingCount > 0) {
      const realBookings = await db.booking.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }).catch(() => []);

      dbRecentBookings = realBookings.map((b) => ({
        id: b.bookingId,
        customer: b.customerName,
        package: b.packageName,
        date: b.travelDate.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        amount: `₹${Number(b.totalAmount).toLocaleString("en-IN")}`,
        status: b.paymentStatus === "paid" ? "confirmed" : b.paymentStatus === "partial" ? "partial" : "pending",
      }));
    }
  } catch {
    // DB unreachable — fall through to mock data
  }

  const todayStats = usingRealData
    ? [
        { label: "Total Leads", value: String(leadCount), change: "", up: true, icon: Inbox, href: "/admin/leads", color: "text-blue-400" },
        { label: "Quotes", value: String(quoteCount), change: "", up: true, icon: FileText, href: "/admin/quotes", color: "text-violet-400" },
        { label: "Bookings", value: String(bookingCount), change: "", up: true, icon: CalendarDays, href: "/admin/bookings", color: "text-green-400" },
        { label: "Customers", value: String(customerCount), change: "", up: true, icon: Users, href: "/admin/customers", color: "text-gold" },
      ]
    : mockTodayStats;

  const monthStats = usingRealData
    ? { revenue: "—", bookings: bookingCount, leads: leadCount, conversion: "—" }
    : mockMonthStats;

  const pendingActions = mockPendingActions;

  const recentBookings = dbRecentBookings.length > 0 ? dbRecentBookings : mockRecentBookings;
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-bold text-white">Good morning, Shiva</h2>
        <p className="text-sm text-text-muted mt-0.5">Here&apos;s what&apos;s happening today</p>
      </div>

      {/* Today KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {todayStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="glass-card rounded-xl p-4 transition-all hover:border-gold/50 hover:-translate-y-0.5 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-surface ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-medium ${stat.up ? "text-green-400" : "text-rose"}`}>
                  {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: This Month + Recent Bookings (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* This Month Summary */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">This Month</h3>
              <span className="text-[10px] text-text-dim uppercase tracking-wider">June 2026</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-lg font-bold text-white">{monthStats.revenue}</p>
                <p className="text-[11px] text-text-muted">Revenue</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">{monthStats.bookings}</p>
                <p className="text-[11px] text-text-muted">Bookings</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">{monthStats.leads}</p>
                <p className="text-[11px] text-text-muted">Leads</p>
              </div>
              <div>
                <p className="text-lg font-bold text-white">{monthStats.conversion}</p>
                <p className="text-[11px] text-text-muted">Conversion</p>
              </div>
            </div>
            {/* Chart placeholder */}
            <div className="mt-4 h-40 rounded-lg bg-surface border border-border-gold/20 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-gold/30 mx-auto mb-2" />
                <p className="text-xs text-text-dim">Revenue chart — connect DB to activate</p>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Recent Bookings</h3>
              <Link href="/admin/bookings" className="text-xs text-gold hover:text-gold-200">View all →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-gold/20">
                    <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider py-2 pr-4">Booking</th>
                    <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider py-2 pr-4">Customer</th>
                    <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider py-2 pr-4 hidden sm:table-cell">Package</th>
                    <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider py-2 pr-4">Date</th>
                    <th className="text-right text-[10px] font-medium text-text-dim uppercase tracking-wider py-2 pr-4">Amount</th>
                    <th className="text-right text-[10px] font-medium text-text-dim uppercase tracking-wider py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b) => (
                    <tr key={b.id} className="border-b border-border-gold/10 hover:bg-surface/50 transition-colors">
                      <td className="py-3 pr-4">
                        <span className="font-mono text-xs text-gold">{b.id}</span>
                      </td>
                      <td className="py-3 pr-4 text-white font-medium">{b.customer}</td>
                      <td className="py-3 pr-4 text-text-muted hidden sm:table-cell">{b.package}</td>
                      <td className="py-3 pr-4 text-text-muted">{b.date}</td>
                      <td className="py-3 pr-4 text-right text-white font-medium">{b.amount}</td>
                      <td className="py-3 text-right">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          b.status === "confirmed" ? "bg-green-500/20 text-green-400" :
                          b.status === "partial" ? "bg-gold/20 text-gold" :
                          "bg-surface text-text-muted"
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Pending Actions (1/3) */}
        <div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Pending Actions</h3>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-rose/20 px-1.5 text-[10px] font-bold text-rose">
                {pendingActions.filter((a) => a.urgent).length}
              </span>
            </div>
            <div className="space-y-3">
              {pendingActions.map((action, i) => (
                <div
                  key={i}
                  className={`rounded-lg p-3 text-sm transition-colors cursor-pointer hover:bg-surface ${
                    action.urgent ? "border border-rose/30 bg-rose/5" : "border border-border-gold/20"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {action.urgent ? (
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose mt-0.5" />
                    ) : (
                      <Clock className="h-4 w-4 shrink-0 text-text-dim mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-muted leading-relaxed">{action.text}</p>
                      <p className={`text-[10px] mt-1 ${action.urgent ? "text-rose" : "text-text-dim"}`}>
                        {action.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="glass-card rounded-xl p-5 mt-4">
            <h3 className="text-sm font-bold text-white mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Travels today</span>
                <span className="text-white font-medium">3</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Travels this week</span>
                <span className="text-white font-medium">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Balance dues (total)</span>
                <span className="text-gold font-medium">₹45,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Expiring quotes</span>
                <span className="text-rose font-medium">4</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
