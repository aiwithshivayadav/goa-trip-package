"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, Plus, Star, Image, Anchor, Ship, Waves, Hotel, Palmtree } from "lucide-react";

type ProductType = "package" | "cruise" | "yacht" | "activity" | "hotel";

interface Product {
  id: number;
  name: string;
  type: ProductType;
  price: number;
  priceLabel: string;
  status: "active" | "paused";
  featured: boolean;
  bookings: number;
}

const mockProducts: Product[] = [
  { id: 1, name: "Honeymoon Classic 3N/4D", type: "package", price: 12999, priceLabel: "per couple", status: "active", featured: true, bookings: 34 },
  { id: 2, name: "Sunset Dinner Cruise", type: "cruise", price: 1200, priceLabel: "per person", status: "active", featured: true, bookings: 89 },
  { id: 3, name: "Maxum Luxury Yacht Charter", type: "yacht", price: 24000, priceLabel: "4 hrs", status: "active", featured: false, bookings: 12 },
  { id: 4, name: "Scuba Diving — Grande Island", type: "activity", price: 3500, priceLabel: "per person", status: "active", featured: true, bookings: 156 },
  { id: 5, name: "Hotel Estrela Do Mar (Baga)", type: "hotel", price: 4200, priceLabel: "per night", status: "paused", featured: false, bookings: 8 },
  { id: 6, name: "Corporate Offsite 2N/3D", type: "package", price: 7499, priceLabel: "per person", status: "active", featured: false, bookings: 21 },
];

const typeIcons: Record<ProductType, typeof Ship> = {
  package: Palmtree,
  cruise: Ship,
  yacht: Anchor,
  activity: Waves,
  hotel: Hotel,
};

const typeColors: Record<ProductType, string> = {
  package: "bg-violet-500/20 text-violet-400",
  cruise: "bg-blue-500/20 text-blue-400",
  yacht: "bg-gold/20 text-gold",
  activity: "bg-green-500/20 text-green-400",
  hotel: "bg-orange-500/20 text-orange-400",
};

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [search, setSearch] = useState("");

  const filtered = search
    ? products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.type.includes(search.toLowerCase()))
    : products;

  const toggleStatus = (id: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: p.status === "active" ? "paused" as const : "active" as const } : p
      )
    );
  };

  const toggleFeatured = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
  };

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
          <button className="flex h-9 items-center gap-1.5 rounded-lg border border-border-gold px-3 text-xs text-text-muted hover:text-white hover:bg-surface transition-colors">
            <Filter className="h-3.5 w-3.5" /> Filters
          </button>
        </div>
        <Link href="/admin/products/new" className="flex h-9 items-center gap-1.5 rounded-lg bg-gold-gradient px-4 text-xs font-bold text-cosmic-950 transition-transform hover:scale-[1.02]">
          <Plus className="h-3.5 w-3.5" /> Add Product
        </Link>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-gold/30 bg-cosmic-900/50">
                <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 w-12"></th>
                <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Product</th>
                <th className="text-left text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Type</th>
                <th className="text-right text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Price</th>
                <th className="text-center text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Bookings</th>
                <th className="text-center text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-center text-[10px] font-medium text-text-dim uppercase tracking-wider px-4 py-3 w-16">Featured</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const TypeIcon = typeIcons[p.type];
                return (
                  <tr key={p.id} className="border-b border-border-gold/10 hover:bg-surface/50 transition-colors cursor-pointer">
                    {/* Image placeholder */}
                    <td className="px-4 py-3.5">
                      <div className="h-10 w-10 rounded-lg bg-surface border border-border-gold/30 flex items-center justify-center">
                        <Image className="h-4 w-4 text-text-dim" />
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-white text-sm">{p.name}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${typeColors[p.type]}`}>
                        <TypeIcon className="h-3 w-3" />
                        {p.type}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <p className="text-sm font-medium text-white">{"₹"}{p.price.toLocaleString("en-IN")}</p>
                      <p className="text-[10px] text-text-dim">{p.priceLabel}</p>
                    </td>
                    <td className="px-4 py-3.5 text-center text-sm text-text-muted hidden sm:table-cell">
                      {p.bookings}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => toggleStatus(p.id)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          p.status === "active" ? "bg-green-500/30" : "bg-surface"
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 rounded-full transition-transform ${
                          p.status === "active" ? "translate-x-4.5 bg-green-400" : "translate-x-1 bg-text-dim"
                        }`} />
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button onClick={() => toggleFeatured(p.id)} className="transition-colors">
                        <Star className={`h-4 w-4 ${p.featured ? "fill-gold text-gold" : "text-text-dim hover:text-gold/50"}`} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-text-muted">
        <span>Showing {filtered.length} products</span>
        <div className="flex items-center gap-4">
          <span>Active: <strong className="text-green-400">{products.filter((p) => p.status === "active").length}</strong></span>
          <span>Paused: <strong className="text-text-dim">{products.filter((p) => p.status === "paused").length}</strong></span>
          <span>Featured: <strong className="text-gold">{products.filter((p) => p.featured).length}</strong></span>
        </div>
      </div>
    </div>
  );
}
