"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { allProducts, type ProductData } from "@/lib/data/products";
import { formatINR, cn } from "@/lib/utils";
import {
  Search,
  Plus,
  Minus,
  X,
  ArrowLeft,
  Package,
  Ship,
  Sailboat,
  Waves,
  Hotel,
  PartyPopper,
  ChevronDown,
  Save,
  Send,
  User,
  Phone,
  Mail,
  Percent,
  Receipt,
  Calculator,
  Trash2,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────
interface ItineraryItem {
  id: string;
  name: string;
  price: number;
  type: string;
}

interface Day {
  day: number;
  items: ItineraryItem[];
}

// ─── Type icon + color helpers ───────────────────────────────────
const typeConfig: Record<string, { icon: typeof Package; label: string; color: string; bg: string }> = {
  package:  { icon: Package,     label: "Package",  color: "text-violet-400", bg: "bg-violet-500/20" },
  cruise:   { icon: Ship,        label: "Cruise",   color: "text-blue-400",   bg: "bg-blue-500/20" },
  yacht:    { icon: Sailboat,    label: "Yacht",    color: "text-cyan-400",   bg: "bg-cyan-500/20" },
  activity: { icon: Waves,       label: "Activity", color: "text-emerald-400",bg: "bg-emerald-500/20" },
  hotel:    { icon: Hotel,       label: "Hotel",    color: "text-amber-400",  bg: "bg-amber-500/20" },
  party:    { icon: PartyPopper, label: "Party",    color: "text-pink-400",   bg: "bg-pink-500/20" },
};

const typeFilters = ["all", "package", "cruise", "yacht", "activity", "hotel", "party"] as const;

// ─── Component ──────────────────────────────────────────────────
export default function NewQuotePage() {
  // Itinerary state
  const [days, setDays] = useState<Day[]>([
    { day: 1, items: [] },
    { day: 2, items: [] },
    { day: 3, items: [] },
  ]);
  const [selectedDay, setSelectedDay] = useState(1);

  // Customer state
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });

  // Pricing state
  const [discount, setDiscount] = useState(0);
  const [advancePercent, setAdvancePercent] = useState(25);

  // Catalog filters
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogType, setCatalogType] = useState<string>("all");
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);

  // ── Filtered catalog ───────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      const matchesType = catalogType === "all" || p.type === catalogType;
      const matchesSearch =
        !catalogSearch ||
        p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
        p.type.toLowerCase().includes(catalogSearch.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [catalogSearch, catalogType]);

  // ── Add product to selected day ────────────────────────────────
  function addProduct(product: ProductData) {
    setDays((prev) =>
      prev.map((d) =>
        d.day === selectedDay
          ? {
              ...d,
              items: [
                ...d.items,
                {
                  id: `${product.slug}-${Date.now()}`,
                  name: product.name,
                  price: product.basePrice,
                  type: product.type,
                },
              ],
            }
          : d
      )
    );
    toast.success(`Added to Day ${selectedDay}`, {
      description: product.name,
    });
  }

  // ── Remove item from a day ─────────────────────────────────────
  function removeItem(dayNum: number, itemId: string) {
    setDays((prev) =>
      prev.map((d) =>
        d.day === dayNum
          ? { ...d, items: d.items.filter((i) => i.id !== itemId) }
          : d
      )
    );
  }

  // ── Add / remove days ──────────────────────────────────────────
  function addDay() {
    const nextDay = days.length + 1;
    setDays((prev) => [...prev, { day: nextDay, items: [] }]);
  }

  function removeDay() {
    if (days.length <= 1) return;
    setDays((prev) => {
      const newDays = prev.slice(0, -1);
      if (selectedDay > newDays.length) setSelectedDay(newDays.length);
      return newDays;
    });
  }

  // ── Pricing calculations ───────────────────────────────────────
  const subtotal = days.reduce(
    (sum, d) => sum + d.items.reduce((s, i) => s + i.price, 0),
    0
  );
  const discountAmount = Math.round((subtotal * discount) / 100);
  const afterDiscount = subtotal - discountAmount;
  const gstAmount = Math.round(afterDiscount * 0.05);
  const total = afterDiscount + gstAmount;
  const advanceAmount = Math.round((total * advancePercent) / 100);

  const totalItems = days.reduce((sum, d) => sum + d.items.length, 0);

  // ── Publish handler ────────────────────────────────────────────
  function handlePublish() {
    if (!customer.name.trim()) {
      toast.error("Customer name is required");
      return;
    }
    if (!customer.phone.trim()) {
      toast.error("Customer phone is required");
      return;
    }
    if (totalItems === 0) {
      toast.error("Add at least one product to the itinerary");
      return;
    }
    toast.success("Quote published! Link copied to clipboard");
  }

  function handleSaveDraft() {
    toast.success("Draft saved", { description: "You can continue editing later." });
  }

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/quotes"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border-gold text-text-muted hover:text-white hover:bg-surface transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-white">New Quote</h1>
          <p className="text-xs text-text-dim">
            Build a day-wise itinerary, set pricing, and publish a shareable link
          </p>
        </div>
      </div>

      {/* 3-pane layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* ════════════════════════════════════════════════════════
            LEFT PANE — Product Catalog (1/4)
           ════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-1 glass-card rounded-xl p-4 flex flex-col max-h-[calc(100vh-10rem)] overflow-hidden">
          <h2 className="text-xs font-bold text-gold uppercase tracking-wider mb-3">
            Product Catalog
          </h2>

          {/* Search */}
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-dim" />
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full h-8 rounded-lg bg-surface border border-border-gold pl-8 pr-3 text-xs text-white placeholder:text-text-dim focus:border-gold transition-colors"
            />
          </div>

          {/* Type filter dropdown */}
          <div className="relative mb-3">
            <button
              onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
              className="flex w-full h-8 items-center justify-between rounded-lg bg-surface border border-border-gold px-3 text-xs text-text-muted hover:text-white transition-colors"
            >
              <span className="capitalize">
                {catalogType === "all" ? "All Types" : catalogType}
              </span>
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", typeDropdownOpen && "rotate-180")} />
            </button>
            {typeDropdownOpen && (
              <div className="absolute top-9 left-0 right-0 z-20 rounded-lg bg-cosmic-900 border border-border-gold shadow-xl py-1">
                {typeFilters.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setCatalogType(t);
                      setTypeDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-1.5 text-xs hover:bg-surface transition-colors capitalize",
                      catalogType === t ? "text-gold" : "text-text-muted"
                    )}
                  >
                    {t === "all" ? "All Types" : t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Adding to day indicator */}
          <div className="mb-2 rounded-lg bg-gold/10 border border-gold/20 px-3 py-1.5 text-[10px] text-gold font-medium text-center">
            Click to add to Day {selectedDay}
          </div>

          {/* Product list */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
            {filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <Package className="h-6 w-6 text-gold/20 mx-auto mb-2" />
                <p className="text-xs text-text-dim">No products found</p>
              </div>
            )}
            {filteredProducts.map((product) => {
              const tc = typeConfig[product.type] ?? typeConfig["package"]!
              const Icon = tc.icon;
              return (
                <button
                  key={product.slug}
                  onClick={() => addProduct(product)}
                  className="w-full text-left rounded-lg bg-surface/50 border border-border-gold/30 px-3 py-2.5 hover:border-gold/50 hover:bg-surface transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate group-hover:text-gold transition-colors">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold",
                            tc.bg,
                            tc.color
                          )}
                        >
                          <Icon className="h-2.5 w-2.5" />
                          {tc.label}
                        </span>
                        <span className="text-[10px] text-text-dim">
                          {product.priceUnit}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gold whitespace-nowrap">
                      {formatINR(product.basePrice)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-border-gold/20 text-[10px] text-text-dim text-center">
            {filteredProducts.length} products
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════
            CENTER PANE — Day-wise Itinerary (2/4)
           ════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-2 glass-card rounded-xl p-4 flex flex-col max-h-[calc(100vh-10rem)] overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-gold uppercase tracking-wider">
              Itinerary
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                onClick={removeDay}
                disabled={days.length <= 1}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border-gold text-text-muted hover:text-rose hover:border-rose/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Remove last day"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="text-xs text-text-muted font-medium px-1">
                {days.length} {days.length === 1 ? "day" : "days"}
              </span>
              <button
                onClick={addDay}
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-border-gold text-text-muted hover:text-gold hover:border-gold/50 transition-colors"
                title="Add day"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Day tabs */}
          <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1">
            {days.map((d) => (
              <button
                key={d.day}
                onClick={() => setSelectedDay(d.day)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
                  selectedDay === d.day
                    ? "bg-gold/20 text-gold border border-gold/40"
                    : "text-text-muted hover:text-white hover:bg-surface border border-transparent"
                )}
              >
                Day {d.day}
                {d.items.length > 0 && (
                  <span
                    className={cn(
                      "flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold",
                      selectedDay === d.day
                        ? "bg-gold/30 text-gold"
                        : "bg-surface text-text-dim"
                    )}
                  >
                    {d.items.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Day content — scrollable */}
          <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin">
            {days.map((d) => (
              <div
                key={d.day}
                className={cn(
                  d.day === selectedDay ? "block" : "hidden"
                )}
              >
                {d.items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center mb-3">
                      <Plus className="h-5 w-5 text-gold/40" />
                    </div>
                    <p className="text-sm text-text-muted">No items in Day {d.day}</p>
                    <p className="text-xs text-text-dim mt-1">
                      Click a product in the catalog to add it here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {d.items.map((item, idx) => {
                      const tc = typeConfig[item.type] ?? typeConfig["package"]!
                      const Icon = tc.icon;
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 rounded-lg bg-surface border border-border-gold/30 px-3 py-2.5 group"
                        >
                          <span className="text-[10px] font-bold text-text-dim w-5 text-center">
                            {idx + 1}
                          </span>
                          <div
                            className={cn(
                              "flex h-7 w-7 items-center justify-center rounded-lg",
                              tc.bg
                            )}
                          >
                            <Icon className={cn("h-3.5 w-3.5", tc.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">
                              {item.name}
                            </p>
                            <span
                              className={cn(
                                "text-[9px] font-bold capitalize",
                                tc.color
                              )}
                            >
                              {item.type}
                            </span>
                          </div>
                          <span className="text-xs font-bold text-gold">
                            {formatINR(item.price)}
                          </span>
                          <button
                            onClick={() => removeItem(d.day, item.id)}
                            className="flex h-6 w-6 items-center justify-center rounded-md text-text-dim hover:text-rose hover:bg-rose/10 opacity-0 group-hover:opacity-100 transition-all"
                            title="Remove"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Itinerary summary bar */}
          <div className="mt-3 pt-3 border-t border-border-gold/20 flex items-center justify-between">
            <span className="text-[10px] text-text-dim">
              {totalItems} {totalItems === 1 ? "item" : "items"} across {days.length}{" "}
              {days.length === 1 ? "day" : "days"}
            </span>
            <span className="text-xs font-bold text-gold">
              Subtotal: {formatINR(subtotal)}
            </span>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════
            RIGHT PANE — Pricing & Customer (1/4)
           ════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-1 glass-card rounded-xl p-4 flex flex-col max-h-[calc(100vh-10rem)] overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin space-y-5">
            {/* Customer Info */}
            <div>
              <h2 className="text-xs font-bold text-gold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                Customer
              </h2>
              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-dim" />
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer((c) => ({ ...c, name: e.target.value }))
                    }
                    placeholder="Customer name *"
                    className="w-full h-8 rounded-lg bg-surface border border-border-gold pl-8 pr-3 text-xs text-white placeholder:text-text-dim focus:border-gold transition-colors"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-dim" />
                  <input
                    type="tel"
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer((c) => ({ ...c, phone: e.target.value }))
                    }
                    placeholder="Phone number *"
                    className="w-full h-8 rounded-lg bg-surface border border-border-gold pl-8 pr-3 text-xs text-white placeholder:text-text-dim focus:border-gold transition-colors"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-dim" />
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) =>
                      setCustomer((c) => ({ ...c, email: e.target.value }))
                    }
                    placeholder="Email (optional)"
                    className="w-full h-8 rounded-lg bg-surface border border-border-gold pl-8 pr-3 text-xs text-white placeholder:text-text-dim focus:border-gold transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Pricing Controls */}
            <div>
              <h2 className="text-xs font-bold text-gold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Calculator className="h-3.5 w-3.5" />
                Pricing
              </h2>
              <div className="space-y-2">
                {/* Discount */}
                <div>
                  <label className="text-[10px] text-text-dim uppercase tracking-wider mb-1 block">
                    Discount (%)
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-dim" />
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={discount}
                      onChange={(e) =>
                        setDiscount(
                          Math.min(100, Math.max(0, Number(e.target.value)))
                        )
                      }
                      className="w-full h-8 rounded-lg bg-surface border border-border-gold pl-8 pr-3 text-xs text-white focus:border-gold transition-colors"
                    />
                  </div>
                </div>
                {/* Advance % */}
                <div>
                  <label className="text-[10px] text-text-dim uppercase tracking-wider mb-1 block">
                    Advance (%)
                  </label>
                  <div className="relative">
                    <Receipt className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-dim" />
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={advancePercent}
                      onChange={(e) =>
                        setAdvancePercent(
                          Math.min(100, Math.max(0, Number(e.target.value)))
                        )
                      }
                      className="w-full h-8 rounded-lg bg-surface border border-border-gold pl-8 pr-3 text-xs text-white focus:border-gold transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div>
              <h2 className="text-xs font-bold text-gold uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Receipt className="h-3.5 w-3.5" />
                Summary
              </h2>
              <div className="rounded-lg bg-surface border border-border-gold/30 p-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="text-white font-medium">
                    {formatINR(subtotal)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-green-400">
                      Discount ({discount}%)
                    </span>
                    <span className="text-green-400 font-medium">
                      -{formatINR(discountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">GST (5%)</span>
                  <span className="text-white font-medium">
                    +{formatINR(gstAmount)}
                  </span>
                </div>
                <div className="border-t border-border-gold/20 pt-2 flex justify-between text-sm">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-gold font-bold">
                    {formatINR(total)}
                  </span>
                </div>
                <div className="flex justify-between text-xs pt-1">
                  <span className="text-text-dim">
                    Advance ({advancePercent}%)
                  </span>
                  <span className="text-amber-400 font-medium">
                    {formatINR(advanceAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-dim">Balance due</span>
                  <span className="text-text-muted font-medium">
                    {formatINR(total - advanceAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons — fixed at bottom */}
          <div className="mt-4 pt-3 border-t border-border-gold/20 space-y-2">
            <button
              onClick={handlePublish}
              className="flex w-full h-9 items-center justify-center gap-2 rounded-lg bg-gold-gradient text-xs font-bold text-cosmic-950 transition-transform hover:scale-[1.02]"
            >
              <Send className="h-3.5 w-3.5" />
              Publish Quote
            </button>
            <button
              onClick={handleSaveDraft}
              className="flex w-full h-9 items-center justify-center gap-2 rounded-lg border border-border-gold text-xs font-medium text-text-muted hover:text-white hover:bg-surface transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              Save Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
