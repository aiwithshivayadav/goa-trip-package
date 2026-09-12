"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Plus, Tag, Percent, IndianRupee, Copy, Loader2, X } from "lucide-react";
import { formatINR } from "@/lib/utils";

interface CouponRow {
  id: number;
  code: string;
  type: string;
  value: number;
  usedCount: number;
  maxUses: number | null;
  validFrom: string | null;
  validTo: string | null;
  isActive: boolean;
  minAmount: number | null;
  maxDiscount: number | null;
  appliesTo: string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<CouponRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({ code: "", type: "percent", value: "", minAmount: "", maxDiscount: "", maxUses: "", validFrom: "", validTo: "" });

  const loadCoupons = () => {
    fetch("/api/coupons")
      .then((r) => r.json())
      .then((data) => {
        if (data.coupons) {
          setCoupons(
            data.coupons.map((c: Record<string, unknown>) => ({
              id: c.id,
              code: c.code,
              type: c.type,
              value: Number(c.value),
              usedCount: (c.usedCount as number) || 0,
              maxUses: (c.maxUses as number) || null,
              validFrom: c.validFrom ? new Date(c.validFrom as string).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null,
              validTo: c.validTo ? new Date(c.validTo as string).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null,
              isActive: c.isActive as boolean,
              minAmount: c.minAmount ? Number(c.minAmount) : null,
              maxDiscount: c.maxDiscount ? Number(c.maxDiscount) : null,
              appliesTo: (c.appliesTo as string) || "all",
            }))
          );
        }
      })
      .catch(() => toast.error("Failed to load coupons"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadCoupons(); }, []);

  const handleCreate = async () => {
    if (!form.code || !form.value) { toast.error("Code and value required"); return; }
    setCreating(true);
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          type: form.type,
          value: Number(form.value),
          minAmount: form.minAmount ? Number(form.minAmount) : null,
          maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
          maxUses: form.maxUses ? Number(form.maxUses) : null,
          validFrom: form.validFrom || null,
          validTo: form.validTo || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to create");
        return;
      }
      toast.success(`Coupon ${form.code.toUpperCase()} created`);
      setShowCreate(false);
      setForm({ code: "", type: "percent", value: "", minAmount: "", maxDiscount: "", maxUses: "", validFrom: "", validTo: "" });
      loadCoupons();
    } catch { toast.error("Network error"); }
    finally { setCreating(false); }
  };

  const activeCoupons = coupons.filter((c) => c.isActive);
  const totalRedemptions = coupons.reduce((s, c) => s + c.usedCount, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
          <input type="text" placeholder="Search coupons..." className="w-full h-9 rounded-lg bg-surface border border-border-gold pl-9 pr-3 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors" />
        </div>
        <button onClick={() => setShowCreate(true)} className="flex h-9 items-center gap-1.5 rounded-lg bg-gold-gradient px-4 text-xs font-bold text-cosmic-950 transition-transform hover:scale-[1.02]">
          <Plus className="h-3.5 w-3.5" /> Create Coupon
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-400"><Tag className="h-5 w-5" /></div>
            <div><p className="text-lg font-bold text-white">{activeCoupons.length}</p><p className="text-xs text-text-muted">Active Coupons</p></div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10 text-gold"><Copy className="h-5 w-5" /></div>
            <div><p className="text-lg font-bold text-white">{totalRedemptions}</p><p className="text-xs text-text-muted">Total Redemptions</p></div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400"><IndianRupee className="h-5 w-5" /></div>
            <div><p className="text-lg font-bold text-white">{coupons.length}</p><p className="text-xs text-text-muted">Total Coupons</p></div>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-gold" /></div>
        ) : coupons.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-text-muted text-sm">No coupons created yet</p>
            <p className="text-text-dim text-xs mt-1">Create your first coupon to offer discounts</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-gold/30 bg-cosmic-900/50">
                  <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Code</th>
                  <th className="text-center text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Type</th>
                  <th className="text-right text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Value</th>
                  <th className="text-center text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Usage</th>
                  <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 hidden md:table-cell">Valid From</th>
                  <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 hidden md:table-cell">Valid Until</th>
                  <th className="text-center text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} className="border-b border-border-gold/10 hover:bg-surface/50 transition-colors cursor-pointer">
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-sm font-bold text-gold tracking-wide">{c.code}</span>
                      {c.minAmount && <p className="text-[10px] text-text-dim mt-0.5">Min order {formatINR(c.minAmount)}</p>}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${c.type === "percent" ? "bg-violet-500/20 text-violet-400" : "bg-green-500/20 text-green-400"}`}>
                        {c.type === "percent" ? <Percent className="h-3 w-3" /> : <IndianRupee className="h-3 w-3" />}
                        {c.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right text-sm font-medium text-white">
                      {c.type === "percent" ? `${c.value}%` : formatINR(c.value)}
                      {c.maxDiscount && <p className="text-[10px] text-text-dim">max {formatINR(c.maxDiscount)}</p>}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="text-sm text-white font-medium">{c.usedCount}</span>
                      {c.maxUses && <span className="text-text-dim">/{c.maxUses}</span>}
                      {c.maxUses && (
                        <div className="mt-1 h-1 w-16 mx-auto rounded-full bg-surface overflow-hidden">
                          <div className={`h-full rounded-full ${c.usedCount >= c.maxUses ? "bg-rose" : "bg-gold"}`} style={{ width: `${Math.min((c.usedCount / c.maxUses) * 100, 100)}%` }} />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-sm text-text-muted hidden md:table-cell whitespace-nowrap">{c.validFrom || "—"}</td>
                    <td className="px-4 py-3.5 text-sm text-text-muted hidden md:table-cell whitespace-nowrap">{c.validTo || "—"}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${c.isActive ? "bg-green-500/20 text-green-400" : "bg-surface text-text-dim"}`}>
                        {c.isActive ? "active" : "inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowCreate(false)}>
          <div className="w-full max-w-md rounded-2xl border border-border-gold/30 bg-cosmic-900 p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Create Coupon</h2>
              <button onClick={() => setShowCreate(false)} className="text-text-muted hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-muted block mb-1">Code *</label>
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. WELCOME500" className="w-full h-9 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white uppercase placeholder:text-text-dim focus:border-gold" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-muted block mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full h-9 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white focus:border-gold">
                    <option value="percent">Percentage</option>
                    <option value="flat">Flat Amount</option>
                    <option value="per_person">Per Person</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-muted block mb-1">Value *</label>
                  <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder={form.type === "percent" ? "15" : "500"} className="w-full h-9 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white placeholder:text-text-dim focus:border-gold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-muted block mb-1">Min Order</label>
                  <input type="number" value={form.minAmount} onChange={(e) => setForm({ ...form, minAmount: e.target.value })} placeholder="5000" className="w-full h-9 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white placeholder:text-text-dim focus:border-gold" />
                </div>
                <div>
                  <label className="text-xs text-text-muted block mb-1">Max Uses</label>
                  <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} placeholder="100" className="w-full h-9 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white placeholder:text-text-dim focus:border-gold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-muted block mb-1">Valid From</label>
                  <input type="date" value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} className="w-full h-9 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white focus:border-gold" />
                </div>
                <div>
                  <label className="text-xs text-text-muted block mb-1">Valid Until</label>
                  <input type="date" value={form.validTo} onChange={(e) => setForm({ ...form, validTo: e.target.value })} className="w-full h-9 rounded-lg bg-surface border border-border-gold px-3 text-sm text-white focus:border-gold" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowCreate(false)} className="h-9 rounded-lg border border-border-gold px-4 text-xs text-text-muted hover:text-white transition-colors">Cancel</button>
              <button onClick={handleCreate} disabled={creating} className="flex h-9 items-center gap-1.5 rounded-lg bg-gold-gradient px-4 text-xs font-bold text-cosmic-950 disabled:opacity-50">
                {creating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
