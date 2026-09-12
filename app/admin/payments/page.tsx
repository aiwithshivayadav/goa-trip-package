"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Download, Loader2 } from "lucide-react";
import { formatINR } from "@/lib/utils";

interface PaymentRow {
  id: number;
  bookingId: string;
  customer: string;
  amount: number;
  method: string;
  status: string;
  milestone: string;
  txnId: string;
  date: string;
}

interface Summary { collected: number; pending: number; refunded: number }

const statusColors: Record<string, string> = {
  paid: "bg-green-500/20 text-green-400",
  pending: "bg-gold/20 text-gold",
  failed: "bg-red-500/20 text-red-400",
  refunded: "bg-violet-500/20 text-violet-400",
  partial: "bg-gold/20 text-gold",
};

const methodLabels: Record<string, string> = {
  payu: "PayU", cash: "Cash", bank_transfer: "Bank Transfer", upi_qr: "UPI / QR",
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [summary, setSummary] = useState<Summary>({ collected: 0, pending: 0, refunded: 0 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/payments?limit=200")
      .then((r) => r.json())
      .then((data) => {
        if (data.payments) {
          setPayments(
            data.payments.map((p: Record<string, unknown>) => {
              const booking = p.booking as Record<string, unknown> | null;
              return {
                id: p.id,
                bookingId: booking?.bookingId || `#${p.bookingId}`,
                customer: booking?.customerName || "—",
                amount: Number(p.amount) || 0,
                method: methodLabels[(p.method as string)] || (p.method as string) || "—",
                status: (p.status as string) || "pending",
                milestone: (p.milestone as string) || "full",
                txnId: (p.payuTxnid as string) || (p.payuMihpayid as string) || "—",
                date: p.createdAt ? new Date(p.createdAt as string).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—",
              };
            })
          );
        }
        if (data.summary) setSummary({ collected: Number(data.summary.collected), pending: Number(data.summary.pending), refunded: Number(data.summary.refunded) });
      })
      .catch(() => toast.error("Failed to load payments"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? payments.filter((p) => p.customer.toLowerCase().includes(search.toLowerCase()) || p.bookingId.toLowerCase().includes(search.toLowerCase()) || p.txnId.toLowerCase().includes(search.toLowerCase()))
    : payments;

  const handleExportCSV = () => {
    const csv = "Date,Booking ID,Customer,Amount,Method,Milestone,Status,Txn ID\n" +
      payments.map((p) => `${p.date},${p.bookingId},"${p.customer}",${p.amount},${p.method},${p.milestone},${p.status},${p.txnId}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "payment-ledger.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Payment ledger exported");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search payments..." className="w-full h-9 rounded-lg bg-surface border border-border-gold pl-9 pr-3 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors" />
        </div>
        <button onClick={handleExportCSV} className="flex h-9 items-center gap-1.5 rounded-lg border border-border-gold px-3 text-xs text-text-muted hover:text-white hover:bg-surface transition-colors">
          <Download className="h-3.5 w-3.5" /> Export Ledger
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-xs text-text-muted">Total Collected</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{formatINR(summary.collected)}</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-xs text-text-muted">Pending Balance</p>
          <p className="text-2xl font-bold text-gold mt-1">{formatINR(summary.pending)}</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <p className="text-xs text-text-muted">Refunds</p>
          <p className="text-2xl font-bold text-text-muted mt-1">{formatINR(summary.refunded)}</p>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
          </div>
        ) : payments.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-text-muted text-sm">No payments recorded yet</p>
            <p className="text-text-dim text-xs mt-1">Payment records are created when customers pay via PayU</p>
          </div>
        ) : (
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
                {filtered.map((p) => (
                  <tr key={p.id} className="border-b border-border-gold/10 hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3.5 text-text-muted whitespace-nowrap">{p.date}</td>
                    <td className="px-4 py-3.5"><span className="font-mono text-xs text-gold">{p.bookingId}</span></td>
                    <td className="px-4 py-3.5 text-white font-medium">{p.customer}</td>
                    <td className="px-4 py-3.5 text-right font-bold text-white">{formatINR(p.amount)}</td>
                    <td className="px-4 py-3.5 text-center hidden sm:table-cell"><span className="rounded bg-surface px-2 py-0.5 text-[10px] text-text-muted">{p.method}</span></td>
                    <td className="px-4 py-3.5 text-center"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusColors[p.status] || "bg-surface text-text-muted"}`}>{p.status}</span></td>
                    <td className="px-4 py-3.5 hidden md:table-cell"><span className="font-mono text-[10px] text-text-dim">{p.txnId}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
