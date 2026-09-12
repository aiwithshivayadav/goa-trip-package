"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Search, Plus, FileText, Eye, Send, CheckCircle2, XCircle, Clock, Loader2, RefreshCw } from "lucide-react";
import { formatINR, timeAgo } from "@/lib/utils";

type QuoteStatus = "draft" | "sent" | "viewed" | "accepted" | "declined" | "expired" | "converted";

interface Quote {
  id: number;
  quoteCode: string;
  title: string;
  totalPrice: number;
  status: QuoteStatus;
  validUntil: string;
  createdAt: string;
  viewedCount: number;
  publicToken: string | null;
  customer: { name: string; phone: string; email: string | null } | null;
  lead: { name: string; phone: string } | null;
}

const statusTabs: { key: QuoteStatus | "all"; label: string; icon: typeof FileText; color: string; badge: string }[] = [
  { key: "all", label: "All", icon: FileText, color: "text-text-muted", badge: "bg-surface text-text-muted" },
  { key: "draft", label: "Draft", icon: FileText, color: "text-text-muted", badge: "bg-surface text-text-muted" },
  { key: "sent", label: "Sent", icon: Send, color: "text-blue-400", badge: "bg-blue-500/20 text-blue-400" },
  { key: "viewed", label: "Viewed", icon: Eye, color: "text-violet-400", badge: "bg-violet-500/20 text-violet-400" },
  { key: "accepted", label: "Accepted", icon: CheckCircle2, color: "text-green-400", badge: "bg-green-500/20 text-green-400" },
  { key: "declined", label: "Declined", icon: XCircle, color: "text-rose", badge: "bg-rose/20 text-rose" },
  { key: "expired", label: "Expired", icon: Clock, color: "text-text-dim", badge: "bg-surface text-text-dim" },
  { key: "converted", label: "Converted", icon: CheckCircle2, color: "text-gold", badge: "bg-gold/20 text-gold" },
];

const statusBadgeColors: Record<QuoteStatus, string> = {
  draft: "bg-surface text-text-muted",
  sent: "bg-blue-500/20 text-blue-400",
  viewed: "bg-violet-500/20 text-violet-400",
  accepted: "bg-green-500/20 text-green-400",
  declined: "bg-rose/20 text-rose",
  expired: "bg-surface text-text-dim",
  converted: "bg-gold/20 text-gold",
};

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<QuoteStatus | "all">("all");
  const [search, setSearch] = useState("");

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (activeTab !== "all") params.set("status", activeTab);
      const res = await fetch(`/api/quotes?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setQuotes(data.quotes || []);
      setTotal(data.total || 0);
    } catch {
      toast.error("Failed to load quotes");
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { fetchQuotes(); }, [fetchQuotes]);

  const customerName = (q: Quote) => q.customer?.name || q.lead?.name || "—";
  const customerPhone = (q: Quote) => q.customer?.phone || q.lead?.phone || "";

  const filtered = search
    ? quotes.filter(
        (q) =>
          customerName(q).toLowerCase().includes(search.toLowerCase()) ||
          q.quoteCode.toLowerCase().includes(search.toLowerCase()) ||
          q.title.toLowerCase().includes(search.toLowerCase())
      )
    : quotes;

  const statusCounts = quotes.reduce((acc, q) => {
    acc[q.status] = (acc[q.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quotes..."
              className="w-full h-9 rounded-lg bg-surface border border-border-gold pl-9 pr-3 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors"
            />
          </div>
          <button
            onClick={fetchQuotes}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-gold text-text-muted hover:text-white hover:bg-surface transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
        <Link href="/admin/quotes/new" className="flex h-9 items-center gap-1.5 rounded-lg bg-gold-gradient px-4 text-xs font-bold text-cosmic-950 transition-transform hover:scale-[1.02]">
          <Plus className="h-3.5 w-3.5" /> New Quote
        </Link>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {statusTabs.map((tab) => {
          const Icon = tab.icon;
          const count = tab.key === "all" ? total : (statusCounts[tab.key] || 0);
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key ? "bg-gold/20 text-gold border border-gold/40" : "text-text-muted hover:text-white hover:bg-surface border border-transparent"
              }`}
            >
              {tab.key !== "all" && <Icon className={`h-3.5 w-3.5 ${activeTab === tab.key ? "text-gold" : tab.color}`} />}
              {tab.label}
              {count > 0 && (
                <span className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                  activeTab === tab.key ? "bg-gold/30 text-gold" : tab.badge
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 text-gold animate-spin" />
            <span className="ml-2 text-sm text-text-muted">Loading quotes...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-8 w-8 text-gold/20 mx-auto mb-2" />
            <p className="text-sm text-text-dim">{search ? "No quotes match your search" : "No quotes yet"}</p>
            {!search && (
              <Link href="/admin/quotes/new" className="mt-3 text-xs text-gold hover:underline">
                Create your first quote →
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-gold/30 bg-cosmic-900/50">
                  <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Quote</th>
                  <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Customer</th>
                  <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 hidden md:table-cell">Title</th>
                  <th className="text-right text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Total</th>
                  <th className="text-center text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Valid Until</th>
                  <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((q) => (
                  <tr key={q.id} className="border-b border-border-gold/10 hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs text-gold">{q.quoteCode}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-white text-sm">{customerName(q)}</p>
                      <p className="text-[10px] text-text-dim mt-0.5">{customerPhone(q)}</p>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <p className="text-sm text-text-muted max-w-[200px] truncate">{q.title}</p>
                    </td>
                    <td className="px-4 py-3.5 text-right text-sm font-medium text-white">
                      {formatINR(Number(q.totalPrice))}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${statusBadgeColors[q.status] || "bg-surface text-text-muted"}`}>
                        {q.status}
                      </span>
                      {q.status === "viewed" && q.viewedCount > 0 && (
                        <span className="ml-1 text-[9px] text-violet-400">{q.viewedCount}x</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-text-muted hidden sm:table-cell whitespace-nowrap">
                      {new Date(q.validUntil).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-text-dim hidden lg:table-cell whitespace-nowrap">
                      {timeAgo(q.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      {!loading && filtered.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-text-muted">
          <span>{filtered.length} of {total} quotes{search ? ` matching "${search}"` : ""}</span>
          <div className="flex items-center gap-4">
            <span>Total Value: <strong className="text-white">{formatINR(quotes.reduce((s, q) => s + Number(q.totalPrice), 0))}</strong></span>
            <span>Accepted: <strong className="text-green-400">{formatINR(quotes.filter((q) => q.status === "accepted").reduce((s, q) => s + Number(q.totalPrice), 0))}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
