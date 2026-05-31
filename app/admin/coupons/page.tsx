"use client";

import { toast } from "sonner";
import { Search, Plus, Tag, Percent, IndianRupee, Copy } from "lucide-react";

interface Coupon {
  code: string;
  type: "percent" | "flat";
  value: number;
  usageCount: number;
  maxUses: number;
  validFrom: string;
  validUntil: string;
  status: "active" | "expired";
  minOrder: number;
  description: string;
}

const mockCoupons: Coupon[] = [
  {
    code: "GOAFIRST",
    type: "flat",
    value: 500,
    usageCount: 24,
    maxUses: 100,
    validFrom: "Jun 1, 2026",
    validUntil: "Jun 30, 2026",
    status: "active",
    minOrder: 5000,
    description: "First-time booking discount",
  },
  {
    code: "MONSOON26",
    type: "percent",
    value: 15,
    usageCount: 8,
    maxUses: 50,
    validFrom: "Jun 15, 2026",
    validUntil: "Sep 30, 2026",
    status: "active",
    minOrder: 3000,
    description: "Monsoon season special offer",
  },
  {
    code: "GROUP10",
    type: "percent",
    value: 10,
    usageCount: 45,
    maxUses: 45,
    validFrom: "Apr 1, 2026",
    validUntil: "May 31, 2026",
    status: "expired",
    minOrder: 10000,
    description: "Group booking discount (5+ pax)",
  },
];

export default function CouponsPage() {
  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
          <input
            type="text"
            placeholder="Search coupons..."
            className="w-full h-9 rounded-lg bg-surface border border-border-gold pl-9 pr-3 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors"
          />
        </div>
        <button onClick={() => toast.info("Coupon editor coming soon")} className="flex h-9 items-center gap-1.5 rounded-lg bg-gold-gradient px-4 text-xs font-bold text-cosmic-950 transition-transform hover:scale-[1.02]">
          <Plus className="h-3.5 w-3.5" /> Create Coupon
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{mockCoupons.filter((c) => c.status === "active").length}</p>
              <p className="text-xs text-text-muted">Active Coupons</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold">
              <Copy className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{mockCoupons.reduce((s, c) => s + c.usageCount, 0)}</p>
              <p className="text-xs text-text-muted">Total Redemptions</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
              <IndianRupee className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{"₹"}12,320</p>
              <p className="text-xs text-text-muted">Total Discounts Given</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-gold/30 bg-cosmic-900/50">
                <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Code</th>
                <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Description</th>
                <th className="text-center text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Type</th>
                <th className="text-right text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Value</th>
                <th className="text-center text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Usage</th>
                <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 hidden md:table-cell">Valid From</th>
                <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 hidden md:table-cell">Valid Until</th>
                <th className="text-center text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockCoupons.map((c) => (
                <tr key={c.code} className="border-b border-border-gold/10 hover:bg-surface/50 transition-colors cursor-pointer">
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-sm font-bold text-gold tracking-wide">{c.code}</span>
                    <p className="text-[10px] text-text-dim mt-0.5 sm:hidden">{c.description}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-text-muted hidden sm:table-cell">
                    {c.description}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      c.type === "percent" ? "bg-violet-500/20 text-violet-400" : "bg-green-500/20 text-green-400"
                    }`}>
                      {c.type === "percent" ? <Percent className="h-3 w-3" /> : <IndianRupee className="h-3 w-3" />}
                      {c.type}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right text-sm font-medium text-white">
                    {c.type === "percent" ? `${c.value}%` : `₹${c.value}`}
                    <p className="text-[10px] text-text-dim">min {"₹"}{c.minOrder.toLocaleString("en-IN")}</p>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="text-sm text-white font-medium">{c.usageCount}</span>
                    <span className="text-text-dim">/{c.maxUses}</span>
                    {/* Usage bar */}
                    <div className="mt-1 h-1 w-16 mx-auto rounded-full bg-surface overflow-hidden">
                      <div
                        className={`h-full rounded-full ${c.usageCount >= c.maxUses ? "bg-rose" : "bg-gold"}`}
                        style={{ width: `${Math.min((c.usageCount / c.maxUses) * 100, 100)}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-text-muted hidden md:table-cell whitespace-nowrap">{c.validFrom}</td>
                  <td className="px-4 py-3.5 text-sm text-text-muted hidden md:table-cell whitespace-nowrap">{c.validUntil}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      c.status === "active" ? "bg-green-500/20 text-green-400" : "bg-surface text-text-dim"
                    }`}>
                      {c.status}
                    </span>
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
