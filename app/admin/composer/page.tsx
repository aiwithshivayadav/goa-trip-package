"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  Search, Plus, X, Loader2, ChevronDown, ChevronUp,
  GripVertical, Trash2, Save, Sparkles, Ship, Anchor,
  Hotel, MapPin, Car, PartyPopper, Package, ArrowRight,
  IndianRupee, Calendar, Users, Clock, Image as ImageIcon,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

// ── Types ──

interface CatalogProduct {
  id: number;
  slug: string;
  type: string;
  name: string;
  shortDesc?: string;
  imageUrl?: string;
  basePrice: number;
  originalPrice?: number;
  priceUnit: string;
  duration?: string;
  capacity?: string;
  location?: string;
  isFeatured: boolean;
}

interface ComposerItem {
  uid: string;
  productId: number;
  name: string;
  type: string;
  basePrice: number;
  priceUnit: string;
  quantity: number;
  imageUrl?: string;
  duration?: string;
  location?: string;
}

interface DayPlan {
  dayNumber: number;
  title: string;
  items: ComposerItem[];
}

// ── Helpers ──

const typeIcons: Record<string, typeof Ship> = {
  cruise: Ship, yacht: Anchor, hotel: Hotel, activity: MapPin,
  transfer: Car, party: PartyPopper, package_tour: Package, combo: Package,
};

const typeLabels: Record<string, string> = {
  package_tour: "Package", cruise: "Cruise", yacht: "Yacht", activity: "Activity",
  hotel: "Hotel", party: "Party", transfer: "Transfer", combo: "Combo",
};

const typeColors: Record<string, string> = {
  cruise: "bg-blue-500/20 text-blue-400", yacht: "bg-cyan-500/20 text-cyan-400",
  hotel: "bg-violet-500/20 text-violet-400", activity: "bg-green-500/20 text-green-400",
  transfer: "bg-orange-500/20 text-orange-400", party: "bg-pink-500/20 text-pink-400",
  package_tour: "bg-gold/20 text-gold", combo: "bg-gold/20 text-gold",
};

let uidCounter = 0;
function uid() { return `item_${++uidCounter}_${Date.now()}`; }

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ── Component ──

export default function ComposerPage() {
  // Catalog
  const [catalog, setCatalog] = useState<CatalogProduct[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");
  const [catalogSearch, setCatalogSearch] = useState("");

  // Composer state
  const [days, setDays] = useState<DayPlan[]>([
    { dayNumber: 1, title: "Day 1", items: [] },
    { dayNumber: 2, title: "Day 2", items: [] },
    { dayNumber: 3, title: "Day 3", items: [] },
  ]);

  // Package meta
  const [packageName, setPackageName] = useState("");
  const [packageDesc, setPackageDesc] = useState("");
  const [durationText, setDurationText] = useState("");
  const [capacityText, setCapacityText] = useState("");
  const [location, setLocation] = useState("Goa");
  const [markup, setMarkup] = useState(20);
  const [saving, setSaving] = useState(false);
  const [catalogCollapsed, setCatalogCollapsed] = useState(false);

  // Load catalog
  useEffect(() => {
    fetch("/api/products?limit=500&status=active")
      .then((r) => r.json())
      .then((data) => {
        if (data.products) {
          setCatalog(
            data.products.map((p: Record<string, unknown>) => ({
              id: p.id,
              slug: p.slug,
              type: p.type,
              name: p.name,
              shortDesc: p.shortDesc || p.short_desc || "",
              imageUrl: p.imageUrl || p.image_url || "",
              basePrice: Number(p.basePrice || p.base_price) || 0,
              originalPrice: p.originalPrice || p.original_price ? Number(p.originalPrice || p.original_price) : undefined,
              priceUnit: (p.priceUnit || p.price_unit || "per_person") as string,
              duration: (p.duration as string) || "",
              capacity: (p.capacity as string) || "",
              location: (p.location as string) || "",
              isFeatured: !!(p.isFeatured || p.is_featured),
            }))
          );
        }
      })
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setCatalogLoading(false));
  }, []);

  // Filter catalog
  const types = Array.from(new Set(catalog.map((p) => p.type)));
  const filteredCatalog = catalog.filter((p) => {
    if (typeFilter !== "all" && p.type !== typeFilter) return false;
    if (catalogSearch && !p.name.toLowerCase().includes(catalogSearch.toLowerCase())) return false;
    return true;
  });

  // Add product to a day
  const addToDay = useCallback((product: CatalogProduct, dayIndex: number) => {
    const item: ComposerItem = {
      uid: uid(),
      productId: product.id,
      name: product.name,
      type: product.type,
      basePrice: product.basePrice,
      priceUnit: product.priceUnit,
      quantity: 1,
      imageUrl: product.imageUrl,
      duration: product.duration,
      location: product.location,
    };
    setDays((prev) => prev.map((d, i) => i === dayIndex ? { ...d, items: [...d.items, item] } : d));
    toast.success(`Added ${product.name} to ${days[dayIndex].title}`);
  }, [days]);

  // Remove item from day
  const removeItem = (dayIndex: number, itemUid: string) => {
    setDays((prev) => prev.map((d, i) => i === dayIndex ? { ...d, items: d.items.filter((it) => it.uid !== itemUid) } : d));
  };

  // Add / remove day
  const addDay = () => {
    const n = days.length + 1;
    setDays((prev) => [...prev, { dayNumber: n, title: `Day ${n}`, items: [] }]);
  };
  const removeDay = (index: number) => {
    if (days.length <= 1) return;
    setDays((prev) => prev.filter((_, i) => i !== index).map((d, i) => ({ ...d, dayNumber: i + 1, title: d.title.startsWith("Day ") ? `Day ${i + 1}` : d.title })));
  };

  // Pricing
  const baseCost = days.reduce((total, day) => total + day.items.reduce((s, it) => s + it.basePrice * it.quantity, 0), 0);
  const markupAmount = Math.round(baseCost * markup / 100);
  const sellingPrice = baseCost + markupAmount;
  const gst = Math.round(sellingPrice * 0.05);
  const totalWithGST = sellingPrice + gst;
  const totalItems = days.reduce((s, d) => s + d.items.length, 0);

  // Auto-generate duration
  useEffect(() => {
    if (!durationText) {
      const nights = days.length - 1;
      if (nights > 0) setDurationText(`${nights}N/${days.length}D`);
    }
  }, [days.length, durationText]);

  // Save as combo product
  const handleSave = async () => {
    if (!packageName.trim()) { toast.error("Package name is required"); return; }
    if (totalItems === 0) { toast.error("Add at least one product to the package"); return; }

    setSaving(true);
    try {
      const itinerary = days.map((d) => ({
        day: d.dayNumber,
        title: d.title,
        activities: d.items.map((it) => it.name).join(", "),
      }));

      const inclusions = days.flatMap((d) => d.items.map((it) => it.name));
      const highlights = [
        `${days.length} Day${days.length > 1 ? "s" : ""} Curated Itinerary`,
        `${totalItems} Experiences Included`,
        location ? `Based in ${location}` : null,
      ].filter(Boolean);

      const slug = slugify(packageName);

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          type: "combo",
          name: packageName,
          shortDesc: packageDesc || `${durationText || days.length + "D"} curated package with ${totalItems} experiences`,
          longDescMd: packageDesc || "",
          basePrice: sellingPrice,
          originalPrice: totalWithGST > sellingPrice ? totalWithGST : undefined,
          priceUnit: "per_person",
          duration: durationText || `${days.length} Days`,
          durationDays: days.length,
          capacity: capacityText || "2-20 pax",
          location: location || "Goa",
          isFeatured: false,
          isSelfServe: false,
          isQuoteLed: true,
          status: "active",
          inclusionsJson: JSON.stringify(inclusions),
          highlightsJson: JSON.stringify(highlights),
          itineraryJson: JSON.stringify(itinerary),
          keyFeaturesJson: JSON.stringify([
            { icon: "calendar", label: "Duration", value: durationText || `${days.length} Days` },
            { icon: "users", label: "Group Size", value: capacityText || "2-20 pax" },
            { icon: "map-pin", label: "Location", value: location || "Goa" },
            { icon: "indian-rupee", label: "Starting From", value: formatINR(sellingPrice) },
          ]),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || "Failed to save package");
        return;
      }

      toast.success(`Package "${packageName}" created and saved to catalog!`);

      setPackageName("");
      setPackageDesc("");
      setDurationText("");
      setCapacityText("");
      setMarkup(20);
      setDays([
        { dayNumber: 1, title: "Day 1", items: [] },
        { dayNumber: 2, title: "Day 2", items: [] },
        { dayNumber: 3, title: "Day 3", items: [] },
      ]);
    } catch {
      toast.error("Network error saving package");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:h-[calc(100vh-7rem)]">
      {/* ── LEFT: Product Catalog ── */}
      <div className={`${catalogCollapsed ? "lg:w-12" : "lg:w-80"} shrink-0 flex flex-col max-h-[50vh] lg:max-h-none transition-all`}>
        {catalogCollapsed ? (
          <button onClick={() => setCatalogCollapsed(false)} className="glass-card rounded-xl p-3 h-full flex flex-col items-center justify-center gap-2 hover:border-gold/50 transition-colors">
            <Package className="h-5 w-5 text-gold" />
            <span className="text-[10px] text-text-muted [writing-mode:vertical-rl]">CATALOG</span>
          </button>
        ) : (
          <div className="glass-card rounded-xl flex flex-col h-full overflow-hidden">
            <div className="p-3 border-b border-border-gold/20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Product Catalog</h3>
                <button onClick={() => setCatalogCollapsed(true)} className="text-text-dim hover:text-white"><ChevronDown className="h-4 w-4 -rotate-90" /></button>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-dim" />
                <input value={catalogSearch} onChange={(e) => setCatalogSearch(e.target.value)} placeholder="Search..." className="w-full h-8 rounded-lg bg-cosmic-950 border border-border-gold/30 pl-8 pr-3 text-xs text-white placeholder:text-text-dim focus:border-gold transition-colors" />
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                <button onClick={() => setTypeFilter("all")} className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${typeFilter === "all" ? "bg-gold/20 text-gold" : "text-text-dim hover:text-white"}`}>All</button>
                {types.map((t) => (
                  <button key={t} onClick={() => setTypeFilter(t)} className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${typeFilter === t ? "bg-gold/20 text-gold" : "text-text-dim hover:text-white"}`}>
                    {typeLabels[t] || t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {catalogLoading ? (
                <div className="flex items-center justify-center py-10"><Loader2 className="h-5 w-5 animate-spin text-gold" /></div>
              ) : filteredCatalog.length === 0 ? (
                <p className="text-xs text-text-dim text-center py-6">No products found</p>
              ) : (
                filteredCatalog.map((p) => {
                  const Icon = typeIcons[p.type] || Package;
                  return (
                    <div key={p.id} className="group rounded-lg border border-border-gold/10 bg-cosmic-950/50 p-2.5 hover:border-gold/30 transition-colors cursor-pointer">
                      <div className="flex items-start gap-2">
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${typeColors[p.type] || "bg-surface text-text-muted"}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white leading-tight truncate">{p.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-gold font-medium">{formatINR(p.basePrice)}</span>
                            {p.duration && <span className="text-[10px] text-text-dim">{p.duration.split("(")[0]?.trim()}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1 mt-2">
                        {days.map((d, i) => (
                          <button
                            key={d.dayNumber}
                            onClick={() => addToDay(p, i)}
                            className="flex-1 h-6 rounded bg-surface text-[9px] font-medium text-text-dim hover:bg-gold/20 hover:text-gold transition-colors"
                          >
                            +D{d.dayNumber}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── CENTER: Day-wise Itinerary Builder ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-[300px] max-h-[60vh] lg:max-h-none">
        <div className="glass-card rounded-xl flex flex-col h-full overflow-hidden">
          <div className="p-3 border-b border-border-gold/20 flex items-center justify-between">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Itinerary Builder</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-text-muted">{totalItems} items · {days.length} days</span>
              <button onClick={addDay} className="flex h-7 items-center gap-1 rounded-lg bg-surface px-2.5 text-[10px] font-medium text-text-muted hover:text-gold transition-colors">
                <Plus className="h-3 w-3" /> Add Day
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {days.map((day, dayIndex) => (
              <div key={day.dayNumber} className="rounded-xl border border-border-gold/20 bg-cosmic-950/30 overflow-hidden">
                {/* Day header */}
                <div className="flex items-center justify-between px-3 py-2 bg-cosmic-900/50 border-b border-border-gold/10">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 text-[10px] font-bold text-gold">{day.dayNumber}</span>
                    <input
                      value={day.title}
                      onChange={(e) => setDays((prev) => prev.map((d, i) => i === dayIndex ? { ...d, title: e.target.value } : d))}
                      className="bg-transparent text-sm font-medium text-white border-none outline-none w-40"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-text-dim">{day.items.length} items</span>
                    {days.length > 1 && (
                      <button onClick={() => removeDay(dayIndex)} className="h-6 w-6 flex items-center justify-center rounded text-text-dim hover:text-rose transition-colors">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Day items */}
                <div className="p-2 space-y-1.5 min-h-[60px]">
                  {day.items.length === 0 ? (
                    <div className="flex items-center justify-center py-4 border border-dashed border-border-gold/20 rounded-lg">
                      <p className="text-[10px] text-text-dim">Drop products here from the catalog</p>
                    </div>
                  ) : (
                    day.items.map((item) => {
                      const Icon = typeIcons[item.type] || Package;
                      return (
                        <div key={item.uid} className="flex items-center gap-2 rounded-lg bg-surface/50 p-2 group">
                          <GripVertical className="h-3.5 w-3.5 text-text-dim shrink-0" />
                          <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded ${typeColors[item.type] || "bg-surface text-text-muted"}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">{item.name}</p>
                            <div className="flex items-center gap-2">
                              {item.duration && <span className="text-[9px] text-text-dim">{item.duration.split("(")[0]?.trim()}</span>}
                              {item.location && <span className="text-[9px] text-text-dim">{item.location}</span>}
                            </div>
                          </div>
                          <span className="text-xs font-medium text-gold whitespace-nowrap">{formatINR(item.basePrice)}</span>
                          <button onClick={() => removeItem(dayIndex, item.uid)} className="h-6 w-6 flex items-center justify-center rounded text-text-dim opacity-0 group-hover:opacity-100 hover:text-rose transition-all">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Package Details + Pricing ── */}
      <div className="lg:w-80 shrink-0 flex flex-col gap-4">
        {/* Package Info */}
        <div className="glass-card rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Package Details</h3>

          <div>
            <label className="text-[10px] text-text-muted block mb-1">Package Name *</label>
            <input value={packageName} onChange={(e) => setPackageName(e.target.value)} placeholder="e.g. Goa Honeymoon Royal 4N/5D" className="w-full h-8 rounded-lg bg-cosmic-950 border border-border-gold/30 px-3 text-xs text-white placeholder:text-text-dim focus:border-gold transition-colors" />
          </div>

          <div>
            <label className="text-[10px] text-text-muted block mb-1">Description</label>
            <textarea value={packageDesc} onChange={(e) => setPackageDesc(e.target.value)} rows={3} placeholder="Brief package description..." className="w-full rounded-lg bg-cosmic-950 border border-border-gold/30 px-3 py-2 text-xs text-white placeholder:text-text-dim focus:border-gold transition-colors resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-text-muted block mb-1">Duration</label>
              <input value={durationText} onChange={(e) => setDurationText(e.target.value)} placeholder="3N/4D" className="w-full h-8 rounded-lg bg-cosmic-950 border border-border-gold/30 px-3 text-xs text-white placeholder:text-text-dim focus:border-gold transition-colors" />
            </div>
            <div>
              <label className="text-[10px] text-text-muted block mb-1">Capacity</label>
              <input value={capacityText} onChange={(e) => setCapacityText(e.target.value)} placeholder="2-20 pax" className="w-full h-8 rounded-lg bg-cosmic-950 border border-border-gold/30 px-3 text-xs text-white placeholder:text-text-dim focus:border-gold transition-colors" />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-text-muted block mb-1">Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Goa" className="w-full h-8 rounded-lg bg-cosmic-950 border border-border-gold/30 px-3 text-xs text-white placeholder:text-text-dim focus:border-gold transition-colors" />
          </div>
        </div>

        {/* Pricing */}
        <div className="glass-card rounded-xl p-4 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">Pricing</h3>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-text-muted">Base Cost ({totalItems} items)</span>
              <span className="text-white font-medium">{formatINR(baseCost)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">Markup</span>
                <input
                  type="number"
                  value={markup}
                  onChange={(e) => setMarkup(Number(e.target.value) || 0)}
                  className="w-14 h-6 rounded bg-cosmic-950 border border-border-gold/30 px-2 text-xs text-white text-center focus:border-gold transition-colors"
                />
                <span className="text-xs text-text-dim">%</span>
              </div>
              <span className="text-xs text-gold font-medium">+{formatINR(markupAmount)}</span>
            </div>

            <div className="border-t border-border-gold/20 pt-2 flex justify-between text-xs">
              <span className="text-text-muted">Selling Price</span>
              <span className="text-white font-bold">{formatINR(sellingPrice)}</span>
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-text-muted">GST (5%)</span>
              <span className="text-text-dim">{formatINR(gst)}</span>
            </div>

            <div className="border-t border-gold/30 pt-2 flex justify-between">
              <span className="text-sm font-bold text-white">Total</span>
              <span className="text-lg font-bold text-gold">{formatINR(totalWithGST)}</span>
            </div>

            <p className="text-[10px] text-text-dim text-center">per person · inclusive of GST</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={handleSave}
            disabled={saving || !packageName.trim() || totalItems === 0}
            className="flex w-full h-10 items-center justify-center gap-2 rounded-xl bg-gold-gradient text-sm font-bold text-cosmic-950 disabled:opacity-40 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save as Package
          </button>

          <p className="text-[10px] text-text-dim text-center">
            Saves as a new combo product in your catalog
          </p>
        </div>
      </div>
    </div>
  );
}
