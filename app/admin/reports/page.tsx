export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import Link from "next/link";
import {
  IndianRupee,
  TrendingUp,
  Users,
  BarChart3,
  FileSpreadsheet,
  Receipt,
  UserCheck,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// ── Helpers ──

function formatINR(n: number): string {
  if (!n && n !== 0) return "—";
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function pctChange(current: number, previous: number): { label: string; up: boolean } {
  if (previous === 0) {
    if (current === 0) return { label: "0", up: true };
    return { label: `+${current}`, up: true };
  }
  const pct = ((current - previous) / previous) * 100;
  const sign = pct >= 0 ? "+" : "";
  return { label: `${sign}${pct.toFixed(1)}%`, up: pct >= 0 };
}

function countChange(current: number, previous: number): { label: string; up: boolean } {
  const diff = current - previous;
  const sign = diff >= 0 ? "+" : "";
  return { label: `${sign}${diff}`, up: diff >= 0 };
}

// ── Page ──

export default async function ReportsPage() {
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

  // ─── Summary stats queries (parallel) ───
  const [
    revenueThisMonth,
    revenueLastMonth,
    bookingsThisMonth,
    bookingsLastMonth,
    leadsThisMonth,
    leadsLastMonth,
    // Report card queries
    categoryRevenue,
    paidBookingsCount,
    totalBookingsCount,
    totalLeadsAll,
    totalQuotesAll,
    totalBookingsAll,
    gstThisMonth,
    totalCustomers,
    avgLtv,
    repeatCustomers,
    // Recent bookings
    recentBookings,
  ] = await Promise.all([
    // Revenue this month
    db.booking.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: thisMonthStart } },
    }),
    // Revenue last month
    db.booking.aggregate({
      _sum: { totalAmount: true },
      where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } },
    }),
    // Bookings this month
    db.booking.count({ where: { createdAt: { gte: thisMonthStart } } }),
    // Bookings last month
    db.booking.count({ where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),
    // Leads this month
    db.lead.count({ where: { createdAt: { gte: thisMonthStart } } }),
    // Leads last month
    db.lead.count({ where: { createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),

    // ── Report card data ──

    // Top category by revenue (group by packageCategory, sum totalAmount)
    db.booking.groupBy({
      by: ["packageCategory"],
      _sum: { totalAmount: true },
      orderBy: { _sum: { totalAmount: "desc" } },
      take: 1,
    }),
    // Paid bookings count (collection rate)
    db.booking.count({ where: { paymentStatus: "paid" } }),
    // Total bookings ever
    db.booking.count(),
    // Total leads ever (funnel)
    db.lead.count(),
    // Total quotes ever (funnel)
    db.quote.count(),
    // Total bookings ever (funnel — same as totalBookingsCount but named for clarity)
    db.booking.count(),
    // GST this month
    db.booking.aggregate({
      _sum: { gstAmount: true },
      where: { createdAt: { gte: thisMonthStart } },
    }),
    // Total customers
    db.customer.count(),
    // Average LTV
    db.customer.aggregate({ _avg: { lifetimeValue: true } }),
    // Repeat customers (totalBookings > 1)
    db.customer.count({ where: { totalBookings: { gt: 1 } } }),

    // ── Recent bookings ──
    db.booking.findMany({
      select: {
        id: true,
        bookingId: true,
        customerName: true,
        packageName: true,
        totalAmount: true,
        status: true,
        paymentStatus: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  // ─── Derived values ───
  const revThisMonth = Number(revenueThisMonth._sum.totalAmount ?? 0);
  const revLastMonth = Number(revenueLastMonth._sum.totalAmount ?? 0);
  const revChange = pctChange(revThisMonth, revLastMonth);
  const bookChange = countChange(bookingsThisMonth, bookingsLastMonth);
  const leadChange = countChange(leadsThisMonth, leadsLastMonth);

  const topCategory = categoryRevenue[0]
    ? categoryRevenue[0].packageCategory.replace("_", " ")
    : "—";
  const topCategoryRev = categoryRevenue[0]
    ? Number(categoryRevenue[0]._sum.totalAmount ?? 0)
    : 0;
  const collectionRate =
    totalBookingsCount > 0
      ? Math.round((paidBookingsCount / totalBookingsCount) * 100)
      : 0;

  const gstCollected = Number(gstThisMonth._sum.gstAmount ?? 0);
  const averageLtv = Number(avgLtv._avg.lifetimeValue ?? 0);
  const repeatRate =
    totalCustomers > 0 ? Math.round((repeatCustomers / totalCustomers) * 100) : 0;

  // Summary stats config
  const summaryStats = [
    {
      label: "Revenue (This Month)",
      value: formatINR(revThisMonth),
      change: revChange.label,
      up: revChange.up,
      icon: IndianRupee,
      color: "text-gold",
    },
    {
      label: "Bookings (This Month)",
      value: bookingsThisMonth.toString(),
      change: bookChange.label,
      up: bookChange.up,
      icon: BarChart3,
      color: "text-green-400",
    },
    {
      label: "Leads (This Month)",
      value: leadsThisMonth.toString(),
      change: leadChange.label,
      up: leadChange.up,
      icon: Users,
      color: "text-blue-400",
    },
  ];

  // Report card config
  const reportTypes = [
    {
      title: "Revenue Report",
      description:
        "Detailed revenue breakdown by product type, source, and time period. Includes payment status and collection rates.",
      icon: IndianRupee,
      color: "text-gold",
      bgColor: "bg-gold/10",
      details: [
        `Top category: ${topCategory} (${formatINR(topCategoryRev)})`,
        `Collection rate: ${collectionRate}% paid`,
        `${formatINR(revThisMonth)} this month`,
      ],
    },
    {
      title: "Booking Funnel",
      description:
        "Lead-to-booking conversion funnel with drop-off analysis at each stage. Track which sources convert best.",
      icon: TrendingUp,
      color: "text-violet-400",
      bgColor: "bg-violet-500/10",
      details: [
        `${totalLeadsAll} leads → ${totalQuotesAll} quotes → ${totalBookingsAll} bookings`,
        `Quote rate: ${totalLeadsAll > 0 ? Math.round((totalQuotesAll / totalLeadsAll) * 100) : 0}%`,
        `Conversion: ${totalLeadsAll > 0 ? Math.round((totalBookingsAll / totalLeadsAll) * 100) : 0}%`,
      ],
    },
    {
      title: "GST Report",
      description:
        "GSTR-compliant tax report with invoice-wise GST breakup (CGST/SGST/IGST). Ready for CA filing.",
      icon: Receipt,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      details: [
        `GST collected this month: ${formatINR(gstCollected)}`,
        "CGST / SGST / IGST split",
        "Monthly filing format",
      ],
    },
    {
      title: "Customer LTV",
      description:
        "Customer lifetime value analysis with repeat booking rates, referral tracking, and top customer rankings.",
      icon: UserCheck,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      details: [
        `${totalCustomers} total customers`,
        `Avg LTV: ${formatINR(averageLtv)}`,
        `Repeat rate: ${repeatRate}%`,
      ],
    },
  ];

  // Status badge colors
  const statusColor: Record<string, string> = {
    confirmed: "text-green-400 bg-green-500/10 border-green-500/20",
    completed: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    cancelled: "text-rose bg-rose/10 border-rose/20",
    draft: "text-text-muted bg-surface border-border-gold/20",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Reports</h2>
          <p className="text-sm text-text-muted mt-0.5">
            Generate and export business reports
          </p>
        </div>
        <button className="flex h-9 items-center gap-1.5 rounded-lg border border-border-gold px-3 text-xs text-text-muted hover:text-white hover:bg-surface transition-colors">
          <FileSpreadsheet className="h-3.5 w-3.5" /> Export All as XLSX
        </button>
      </div>

      {/* Summary strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        {summaryStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg bg-surface ${stat.color}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`flex items-center gap-0.5 text-xs font-medium ${
                    stat.up ? "text-green-400" : "text-rose"
                  }`}
                >
                  {stat.up ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-text-muted mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Report types grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.title}
              className="glass-card rounded-xl p-5 transition-all hover:border-gold/50 hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${report.bgColor} shrink-0`}
                >
                  <Icon className={`h-6 w-6 ${report.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white mb-1">
                    {report.title}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    {report.description}
                  </p>
                </div>
              </div>

              {/* Details — now real data */}
              <div className="mb-4 space-y-1.5 pl-16">
                {report.details.map((detail) => (
                  <div key={detail} className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-gold/60" />
                    <span className="text-[11px] text-text-dim">{detail}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pl-16">
                <button className="flex h-8 items-center gap-1.5 rounded-lg bg-gold-gradient px-4 text-[11px] font-bold text-cosmic-950 transition-transform hover:scale-[1.02]">
                  Generate
                </button>
                <button className="flex h-8 items-center gap-1.5 rounded-lg border border-border-gold px-3 text-[11px] text-text-muted hover:text-white hover:bg-surface transition-colors">
                  <Download className="h-3 w-3" /> CSV
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-4">Recent Bookings</h3>
        {recentBookings.length === 0 ? (
          <p className="text-xs text-text-dim py-4 text-center">
            No bookings yet
          </p>
        ) : (
          <div className="space-y-2">
            {recentBookings.map((b) => (
              <Link
                key={b.id}
                href={`/admin/bookings/${b.id}`}
                className="flex items-center justify-between rounded-lg bg-surface/50 border border-border-gold/10 px-4 py-3 hover:border-border-gold/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0">
                    <p className="text-[10px] font-mono text-gold">
                      {b.bookingId}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate">
                      {b.customerName}
                    </p>
                    <p className="text-[10px] text-text-dim truncate">
                      {b.packageName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <p className="text-xs font-semibold text-white">
                    {formatINR(Number(b.totalAmount))}
                  </p>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${
                      statusColor[b.status] ?? statusColor.draft
                    }`}
                  >
                    {b.status}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-text-dim group-hover:text-gold transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
