"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Download, Loader2 } from "lucide-react";
import { formatINR } from "@/lib/utils";

interface CustomerRow {
  id: number;
  name: string;
  phone: string;
  email?: string;
  totalBookings: number;
  lifetimeValue: number;
  lastSeenAt: string;
  source?: string;
  city?: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customers?limit=200")
      .then((r) => r.json())
      .then((data) => {
        if (data.customers) {
          setCustomers(
            data.customers.map((c: Record<string, unknown>) => ({
              id: c.id,
              name: (c.name as string) || "—",
              phone: (c.phone as string) || "",
              email: (c.email as string) || undefined,
              totalBookings: (c.totalBookings as number) || 0,
              lifetimeValue: Number(c.lifetimeValue) || 0,
              lastSeenAt: c.lastSeenAt ? new Date(c.lastSeenAt as string).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—",
              source: (c.source as string) || undefined,
              city: (c.city as string) || undefined,
            }))
          );
        }
      })
      .catch(() => toast.error("Failed to load customers"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = search
    ? customers.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || (c.email && c.email.toLowerCase().includes(search.toLowerCase())))
    : customers;

  const handleExportCSV = () => {
    const csv = "ID,Name,Phone,Email,Bookings,Lifetime Value,Last Seen,Source,City\n" +
      customers.map((c) => `${c.id},"${c.name}",${c.phone},${c.email || ""},${c.totalBookings},${c.lifetimeValue},${c.lastSeenAt},${c.source || ""},${c.city || ""}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "customers.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Customers exported");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers..." className="w-full h-9 rounded-lg bg-surface border border-border-gold pl-9 pr-3 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors" />
        </div>
        <button onClick={handleExportCSV} className="flex h-9 items-center gap-1.5 rounded-lg border border-border-gold px-3 text-xs text-text-muted hover:text-white hover:bg-surface transition-colors">
          <Download className="h-3.5 w-3.5" /> Export
        </button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
          </div>
        ) : customers.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-text-muted text-sm">No customers yet</p>
            <p className="text-text-dim text-xs mt-1">Customers are auto-created when leads come in or bookings are made</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-gold/30 bg-cosmic-900/50">
                  <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Customer</th>
                  <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 hidden md:table-cell">Contact</th>
                  <th className="text-center text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Bookings</th>
                  <th className="text-right text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Lifetime Value</th>
                  <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Last Seen</th>
                  <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Source</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-border-gold/10 hover:bg-surface/50 transition-colors cursor-pointer">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-gold">{c.name[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{c.name}</p>
                          {c.city && <p className="text-[10px] text-text-dim">{c.city}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <p className="text-xs text-text-muted">{c.phone}</p>
                      {c.email && <p className="text-[10px] text-text-dim">{c.email}</p>}
                    </td>
                    <td className="px-4 py-3.5 text-center text-sm text-white font-medium">{c.totalBookings}</td>
                    <td className="px-4 py-3.5 text-right text-sm font-medium text-gold">{formatINR(c.lifetimeValue)}</td>
                    <td className="px-4 py-3.5 text-sm text-text-muted hidden sm:table-cell">{c.lastSeenAt}</td>
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      {c.source && <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] text-text-muted">{c.source}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {customers.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 text-xs text-text-muted">
          <span>Total: <strong className="text-white">{customers.length}</strong> customers</span>
          <span>Total LTV: <strong className="text-gold">{formatINR(customers.reduce((s, c) => s + c.lifetimeValue, 0))}</strong></span>
        </div>
      )}
    </div>
  );
}
