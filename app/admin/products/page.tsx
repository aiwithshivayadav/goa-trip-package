"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Filter, Plus, Star, Anchor, Ship, Waves, Hotel, Palmtree, PartyPopper, Loader2, RefreshCw, Copy } from "lucide-react";
import { toast } from "sonner";

type ProductType = "package_tour" | "cruise" | "yacht" | "activity" | "hotel" | "party";

const displayType: Record<string, string> = {
  package_tour: "package",
  cruise: "cruise",
  yacht: "yacht",
  activity: "activity",
  hotel: "hotel",
  party: "party",
};

interface DbProduct {
  id: number;
  name: string;
  slug: string;
  type: ProductType;
  basePrice: number;
  priceUnit: string;
  status: "active" | "paused" | "archived";
  isFeatured: boolean;
  imageUrl: string | null;
  imagesJson: string | null;
  location: string | null;
}

const typeIcons: Record<string, typeof Ship> = {
  package_tour: Palmtree,
  cruise: Ship,
  yacht: Anchor,
  activity: Waves,
  hotel: Hotel,
  party: PartyPopper,
};

const typeColors: Record<string, string> = {
  package_tour: "bg-violet-500/20 text-violet-400",
  cruise: "bg-blue-500/20 text-blue-400",
  yacht: "bg-gold/20 text-gold",
  activity: "bg-green-500/20 text-green-400",
  hotel: "bg-orange-500/20 text-orange-400",
  party: "bg-pink-500/20 text-pink-400",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "200" });
      if (typeFilter) params.set("type", typeFilter);
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const filtered = search
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (displayType[p.type] || p.type).includes(search.toLowerCase()) ||
          p.slug.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  async function toggleStatus(id: number, current: string) {
    const next = current === "active" ? "paused" : "active";
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: next as DbProduct["status"] } : p))
      );
      toast.success(`Product ${next === "active" ? "activated" : "paused"}`);
    } catch {
      toast.error("Failed to update status");
    }
  }

  async function toggleFeatured(id: number, current: boolean) {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !current }),
      });
      if (!res.ok) throw new Error();
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isFeatured: !current } : p))
      );
    } catch {
      toast.error("Failed to update featured");
    }
  }

  function getThumb(p: DbProduct): string | null {
    if (p.imageUrl) return p.imageUrl;
    if (p.imagesJson) {
      try {
        const arr = JSON.parse(p.imagesJson);
        if (Array.isArray(arr) && arr[0]) return arr[0];
      } catch { /* ignore */ }
    }
    return null;
  }

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
              placeholder="Search products..."
              className="w-full h-9 rounded-lg bg-surface border border-border-gold pl-9 pr-3 text-sm text-white placeholder:text-text-dim focus:border-gold transition-colors"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 rounded-lg border border-border-gold bg-surface px-2 text-xs text-text-muted focus:border-gold transition-colors"
          >
            <option value="">All types</option>
            <option value="package_tour">Packages</option>
            <option value="cruise">Cruises</option>
            <option value="yacht">Yachts</option>
            <option value="activity">Activities</option>
            <option value="hotel">Hotels</option>
            <option value="party">Parties</option>
          </select>
          <button
            onClick={fetchProducts}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-gold text-text-muted hover:text-white hover:bg-surface transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
        <Link
          href="/admin/products/new"
          className="flex h-9 items-center gap-1.5 rounded-lg bg-gold-gradient px-4 text-xs font-bold text-cosmic-950 transition-transform hover:scale-[1.02]"
        >
          <Plus className="h-3.5 w-3.5" /> Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 text-gold animate-spin" />
            <span className="ml-2 text-sm text-text-muted">Loading products...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-text-dim">
            <p className="text-sm">No products found</p>
            {search && <p className="text-xs mt-1">Try a different search term</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-gold/30 bg-cosmic-900/50">
                  <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 w-12"></th>
                  <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Product</th>
                  <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Type</th>
                  <th className="text-right text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Price</th>
                  <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 hidden md:table-cell">Location</th>
                  <th className="text-center text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-center text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 w-16">Featured</th>
                  <th className="text-center text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 w-12"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const TypeIcon = typeIcons[p.type] || Ship;
                  const thumb = getThumb(p);
                  return (
                    <tr key={p.id} className="border-b border-border-gold/10 hover:bg-surface/50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="h-10 w-10 rounded-lg bg-surface border border-border-gold/30 flex items-center justify-center overflow-hidden">
                          {thumb ? (
                            <img src={thumb} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <TypeIcon className="h-4 w-4 text-text-dim" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <Link href={`/admin/products/${p.id}`} className="font-medium text-white text-sm hover:text-gold transition-colors">
                          {p.name}
                        </Link>
                        <p className="text-[10px] text-text-dim mt-0.5 font-mono">/{p.slug}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${typeColors[p.type] || "bg-gray-500/20 text-gray-400"}`}>
                          <TypeIcon className="h-3 w-3" />
                          {displayType[p.type] || p.type}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <p className="text-sm font-medium text-white">{"₹"}{Number(p.basePrice).toLocaleString("en-IN")}</p>
                        <p className="text-[10px] text-text-dim">{p.priceUnit}</p>
                      </td>
                      <td className="px-4 py-3.5 text-sm text-text-muted hidden md:table-cell max-w-[140px] truncate">
                        {p.location || "—"}
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          onClick={() => toggleStatus(p.id, p.status)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            p.status === "active" ? "bg-green-500/30" : "bg-surface"
                          }`}
                          title={p.status === "active" ? "Click to pause" : "Click to activate"}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 rounded-full transition-transform ${
                              p.status === "active" ? "translate-x-4.5 bg-green-400" : "translate-x-1 bg-text-dim"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button onClick={() => toggleFeatured(p.id, p.isFeatured)} className="transition-colors">
                          <Star className={`h-4 w-4 ${p.isFeatured ? "fill-gold text-gold" : "text-text-dim hover:text-gold/50"}`} />
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <Link href={`/admin/products/new?clone=${p.id}`} className="text-text-dim hover:text-gold transition-colors" title="Clone product">
                          <Copy className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      {!loading && (
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-text-muted">
          <span>{filtered.length} of {total} products{search ? ` matching "${search}"` : ""}</span>
          <div className="flex items-center gap-4">
            <span>Active: <strong className="text-green-400">{products.filter((p) => p.status === "active").length}</strong></span>
            <span>Paused: <strong className="text-text-dim">{products.filter((p) => p.status === "paused").length}</strong></span>
            <span>Featured: <strong className="text-gold">{products.filter((p) => p.isFeatured).length}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
