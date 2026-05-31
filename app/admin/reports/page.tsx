import { IndianRupee, TrendingUp, Users, BarChart3, FileSpreadsheet, Receipt, UserCheck, Download } from "lucide-react";

const summaryStats = [
  { label: "Revenue (This Month)", value: "₹4,85,000", change: "+12.3%", up: true, icon: IndianRupee, color: "text-gold" },
  { label: "Bookings (This Month)", value: "47", change: "+8", up: true, icon: BarChart3, color: "text-green-400" },
  { label: "Leads (This Month)", value: "186", change: "+23", up: true, icon: Users, color: "text-blue-400" },
];

interface ReportType {
  title: string;
  description: string;
  icon: typeof BarChart3;
  color: string;
  bgColor: string;
  details: string[];
}

const reportTypes: ReportType[] = [
  {
    title: "Revenue Report",
    description: "Detailed revenue breakdown by product type, source, and time period. Includes payment status and collection rates.",
    icon: IndianRupee,
    color: "text-gold",
    bgColor: "bg-gold/10",
    details: ["Daily / Weekly / Monthly", "By product category", "Payment collection rate"],
  },
  {
    title: "Booking Funnel",
    description: "Lead-to-booking conversion funnel with drop-off analysis at each stage. Track which sources convert best.",
    icon: TrendingUp,
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    details: ["Lead → Quote → Booking", "Source-wise conversion", "Avg. time to convert"],
  },
  {
    title: "GST Report",
    description: "GSTR-compliant tax report with invoice-wise GST breakup (CGST/SGST/IGST). Ready for CA filing.",
    icon: Receipt,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    details: ["CGST / SGST / IGST split", "HSN-code wise summary", "Monthly filing format"],
  },
  {
    title: "Customer LTV",
    description: "Customer lifetime value analysis with repeat booking rates, referral tracking, and top customer rankings.",
    icon: UserCheck,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    details: ["Repeat booking rate", "Top 20 customers", "Referral attribution"],
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Reports</h2>
          <p className="text-sm text-text-muted mt-0.5">Generate and export business reports</p>
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
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-surface ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`text-xs font-medium ${stat.up ? "text-green-400" : "text-rose"}`}>
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
            <div key={report.title} className="glass-card rounded-xl p-5 transition-all hover:border-gold/50 hover:-translate-y-0.5">
              <div className="flex items-start gap-4 mb-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${report.bgColor} shrink-0`}>
                  <Icon className={`h-6 w-6 ${report.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white mb-1">{report.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed">{report.description}</p>
                </div>
              </div>

              {/* Details */}
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

      {/* Recent reports */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-4">Recently Generated</h3>
        <div className="space-y-2">
          {[
            { name: "Revenue Report — May 2026", type: "revenue", date: "May 31, 2026", format: "XLSX" },
            { name: "GST Report — Q1 2026", type: "gst", date: "Apr 2, 2026", format: "PDF" },
            { name: "Booking Funnel — May 2026", type: "funnel", date: "May 28, 2026", format: "CSV" },
          ].map((r) => (
            <div key={r.name} className="flex items-center justify-between rounded-lg bg-surface/50 border border-border-gold/10 px-4 py-3 hover:border-border-gold/30 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-4 w-4 text-text-dim" />
                <div>
                  <p className="text-xs font-medium text-white">{r.name}</p>
                  <p className="text-[10px] text-text-dim">{r.date}</p>
                </div>
              </div>
              <span className="rounded-full bg-surface border border-border-gold/20 px-2 py-0.5 text-[10px] font-medium text-text-muted">{r.format}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
