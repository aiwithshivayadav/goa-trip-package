import { Search, Download, IndianRupee } from "lucide-react";

const payments = [
  { id: 1, bookingId: "GTP-2026-A8K2L", customer: "Meera Joshi", amount: 3500, method: "PayU", status: "success", txnId: "PAY-8472615", date: "Jun 1, 2026" },
  { id: 2, bookingId: "GTP-2026-B3M9N", customer: "Rahul & Priya", amount: 6500, method: "PayU", status: "success", txnId: "PAY-8472616", date: "May 30, 2026" },
  { id: 3, bookingId: "GTP-2026-D2R6S", customer: "Sneha & Amit", amount: 2400, method: "PayU", status: "success", txnId: "PAY-8472614", date: "May 26, 2026" },
  { id: 4, bookingId: "GTP-2026-E5T8U", customer: "Arjun's Group", amount: 12000, method: "PayU", status: "success", txnId: "PAY-8472617", date: "May 29, 2026" },
  { id: 5, bookingId: "GTP-2026-F9V1W", customer: "Divya Kapoor", amount: 24000, method: "Bank Transfer", status: "success", txnId: "NEFT-99218", date: "Jun 1, 2026" },
];

export default function PaymentsPage() {
  const total = payments.reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
          <input type="text" placeholder="Search payments..." className="w-full h-9 rounded-lg bg-surface border border-border-gold pl-9 pr-3 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors" />
        </div>
        <button className="flex h-9 items-center gap-1.5 rounded-lg border border-border-gold px-3 text-xs text-text-muted hover:text-white hover:bg-surface transition-colors">
          <Download className="h-3.5 w-3.5" /> Export Ledger
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-xs text-text-muted">Total Collected</p>
          <p className="text-2xl font-bold text-green-400 mt-1">₹{total.toLocaleString("en-IN")}</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-xs text-text-muted">Pending Balance</p>
          <p className="text-2xl font-bold text-gold mt-1">₹2,04,490</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-xs text-text-muted">Refunds</p>
          <p className="text-2xl font-bold text-text-muted mt-1">₹0</p>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-gold/30 bg-cosmic-900/50">
                <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Date</th>
                <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Booking</th>
                <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Customer</th>
                <th className="text-right text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Amount</th>
                <th className="text-center text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Method</th>
                <th className="text-center text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 hidden md:table-cell">Txn ID</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-border-gold/10 hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-3.5 text-text-muted whitespace-nowrap">{p.date}</td>
                  <td className="px-4 py-3.5"><span className="font-mono text-xs text-gold">{p.bookingId}</span></td>
                  <td className="px-4 py-3.5 text-white font-medium">{p.customer}</td>
                  <td className="px-4 py-3.5 text-right font-bold text-white">₹{p.amount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3.5 text-center hidden sm:table-cell"><span className="rounded bg-surface px-2 py-0.5 text-[10px] text-text-muted">{p.method}</span></td>
                  <td className="px-4 py-3.5 text-center"><span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-bold text-green-400">{p.status}</span></td>
                  <td className="px-4 py-3.5 hidden md:table-cell"><span className="font-mono text-[10px] text-text-dim">{p.txnId}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
