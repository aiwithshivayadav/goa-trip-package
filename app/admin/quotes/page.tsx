"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Plus, FileText, Eye, Send, CheckCircle2, XCircle, Clock } from "lucide-react";

type QuoteStatus = "draft" | "sent" | "viewed" | "accepted" | "declined" | "expired";

interface Quote {
  id: string;
  customer: string;
  phone: string;
  package: string;
  total: number;
  status: QuoteStatus;
  validUntil: string;
  createdAt: string;
  viewCount: number;
}

const mockQuotes: Quote[] = [
  { id: "Q-2026-X7K2P", customer: "Priya Sharma", phone: "+91 98765 43210", package: "Honeymoon Classic 3N/4D", total: 25998, status: "viewed", validUntil: "Jun 10, 2026", createdAt: "May 28, 2026", viewCount: 3 },
  { id: "Q-2026-R3M8N", customer: "Vikram Patel", phone: "+91 87654 32109", package: "Corporate Offsite 2N/3D (20 pax)", total: 149980, status: "sent", validUntil: "Jun 12, 2026", createdAt: "May 30, 2026", viewCount: 0 },
  { id: "Q-2026-A5J9L", customer: "Arjun Mehta", phone: "+91 65432 10987", package: "Bachelor Group 3N/4D (8 pax)", total: 47992, status: "accepted", validUntil: "Jun 15, 2026", createdAt: "May 25, 2026", viewCount: 5 },
  { id: "Q-2026-D1F4H", customer: "Sneha Rao", phone: "+91 76543 21098", package: "Royal Cruise Night Party (4 pax)", total: 9600, status: "draft", validUntil: "Jun 8, 2026", createdAt: "May 31, 2026", viewCount: 0 },
  { id: "Q-2026-B8G6K", customer: "Rohan Deshmukh", phone: "+91 54321 09876", package: "Premium Honeymoon 4N/5D", total: 34999, status: "expired", validUntil: "May 20, 2026", createdAt: "May 10, 2026", viewCount: 1 },
];

const statusTabs: { key: QuoteStatus; label: string; icon: typeof FileText; color: string; badge: string }[] = [
  { key: "draft", label: "Draft", icon: FileText, color: "text-text-muted", badge: "bg-surface text-text-muted" },
  { key: "sent", label: "Sent", icon: Send, color: "text-blue-400", badge: "bg-blue-500/20 text-blue-400" },
  { key: "viewed", label: "Viewed", icon: Eye, color: "text-violet-400", badge: "bg-violet-500/20 text-violet-400" },
  { key: "accepted", label: "Accepted", icon: CheckCircle2, color: "text-green-400", badge: "bg-green-500/20 text-green-400" },
  { key: "declined", label: "Declined", icon: XCircle, color: "text-rose", badge: "bg-rose/20 text-rose" },
  { key: "expired", label: "Expired", icon: Clock, color: "text-text-dim", badge: "bg-surface text-text-dim" },
];

const statusBadgeColors: Record<QuoteStatus, string> = {
  draft: "bg-surface text-text-muted",
  sent: "bg-blue-500/20 text-blue-400",
  viewed: "bg-violet-500/20 text-violet-400",
  accepted: "bg-green-500/20 text-green-400",
  declined: "bg-rose/20 text-rose",
  expired: "bg-surface text-text-dim",
};

export default function QuotesPage() {
  const [activeTab, setActiveTab] = useState<QuoteStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = mockQuotes
    .filter((q) => activeTab === "all" || q.status === activeTab)
    .filter((q) => !search || q.customer.toLowerCase().includes(search.toLowerCase()) || q.id.toLowerCase().includes(search.toLowerCase()));

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
          <button className="flex h-9 items-center gap-1.5 rounded-lg border border-border-gold px-3 text-xs text-text-muted hover:text-white hover:bg-surface transition-colors">
            <Filter className="h-3.5 w-3.5" /> Filters
          </button>
        </div>
        <button className="flex h-9 items-center gap-1.5 rounded-lg bg-gold-gradient px-4 text-xs font-bold text-cosmic-950 transition-transform hover:scale-[1.02]">
          <Plus className="h-3.5 w-3.5" /> New Quote
        </button>
      </div>

      {/* Status tabs (kanban-style) */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
            activeTab === "all" ? "bg-gold/20 text-gold border border-gold/40" : "text-text-muted hover:text-white hover:bg-surface border border-transparent"
          }`}
        >
          All
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-surface/80 px-1.5 text-[10px] font-bold">
            {mockQuotes.length}
          </span>
        </button>
        {statusTabs.map((tab) => {
          const Icon = tab.icon;
          const count = mockQuotes.filter((q) => q.status === tab.key).length;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key ? "bg-gold/20 text-gold border border-gold/40" : "text-text-muted hover:text-white hover:bg-surface border border-transparent"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${activeTab === tab.key ? "text-gold" : tab.color}`} />
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-gold/30 bg-cosmic-900/50">
                <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Quote ID</th>
                <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Customer</th>
                <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 hidden md:table-cell">Package</th>
                <th className="text-right text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Total</th>
                <th className="text-center text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Valid Until</th>
                <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((q) => (
                <tr key={q.id} className="border-b border-border-gold/10 hover:bg-surface/50 transition-colors cursor-pointer">
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-xs text-gold">{q.id}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-white text-sm">{q.customer}</p>
                    <p className="text-[10px] text-text-dim mt-0.5">{q.phone}</p>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <p className="text-sm text-text-muted">{q.package}</p>
                  </td>
                  <td className="px-4 py-3.5 text-right text-sm font-medium text-white">
                    {"₹"}{q.total.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${statusBadgeColors[q.status]}`}>
                      {q.status}
                    </span>
                    {q.status === "viewed" && q.viewCount > 0 && (
                      <span className="ml-1 text-[9px] text-violet-400">{q.viewCount}x</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-text-muted hidden sm:table-cell whitespace-nowrap">
                    {q.validUntil}
                  </td>
                  <td className="px-4 py-3.5 text-sm text-text-dim hidden lg:table-cell whitespace-nowrap">
                    {q.createdAt}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <FileText className="h-8 w-8 text-gold/20 mx-auto mb-2" />
                    <p className="text-sm text-text-dim">No quotes match your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-text-muted">
        <span>Showing {filtered.length} of {mockQuotes.length} quotes</span>
        <div className="flex items-center gap-4">
          <span>Total Value: <strong className="text-white">{"₹"}{mockQuotes.reduce((s, q) => s + q.total, 0).toLocaleString("en-IN")}</strong></span>
          <span>Accepted: <strong className="text-green-400">{"₹"}{mockQuotes.filter((q) => q.status === "accepted").reduce((s, q) => s + q.total, 0).toLocaleString("en-IN")}</strong></span>
        </div>
      </div>
    </div>
  );
}
