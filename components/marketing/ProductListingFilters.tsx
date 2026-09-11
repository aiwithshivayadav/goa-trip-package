"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "./ProductCard";
import type { ProductData } from "@/lib/data/db-products";

interface PriceRange {
  label: string;
  min: number;
  max: number;
}

const PRICE_RANGES: PriceRange[] = [
  { label: "Under ₹1,000", min: 0, max: 999 },
  { label: "₹1,000 – ₹2,500", min: 1000, max: 2500 },
  { label: "₹2,500 – ₹5,000", min: 2500, max: 5000 },
  { label: "₹5,000+", min: 5000, max: Infinity },
];

type SortOption = "recommended" | "price-low" | "price-high" | "rating";

interface Props {
  products: ProductData[];
  categoryLabel: string;
}

export function ProductListingFilters({ products, categoryLabel }: Props) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("recommended");
  const [priceFilter, setPriceFilter] = useState<PriceRange | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDesc?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q)
      );
    }

    if (priceFilter) {
      result = result.filter(
        (p) => p.basePrice >= priceFilter.min && p.basePrice <= priceFilter.max
      );
    }

    switch (sort) {
      case "price-low":
        result.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "price-high":
        result.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "rating":
        result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
    }

    return result;
  }, [products, query, sort, priceFilter]);

  const hasActiveFilters = query.trim() || priceFilter;

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${categoryLabel.toLowerCase()}...`}
            className="w-full h-10 rounded-lg bg-white border border-border-warm pl-10 pr-8 text-sm text-ink placeholder:text-gray-400 focus:outline-none focus:border-lagoon transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
              showFilters || priceFilter
                ? "border-lagoon bg-lagoon-50 text-lagoon"
                : "border-border-warm bg-white text-gray-500 hover:border-lagoon/40"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {priceFilter && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-lagoon text-[9px] font-bold text-white">
                1
              </span>
            )}
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="bg-white border border-border-warm rounded-lg px-3 py-2 text-xs text-gray-500 focus:border-lagoon"
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400 mr-1">Price:</span>
          {PRICE_RANGES.map((range) => (
            <button
              key={range.label}
              type="button"
              onClick={() =>
                setPriceFilter((prev) =>
                  prev?.label === range.label ? null : range
                )
              }
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                priceFilter?.label === range.label
                  ? "border-lagoon bg-lagoon-50 text-lagoon"
                  : "border-border-warm bg-white text-gray-500 hover:border-lagoon/40 hover:text-ink"
              }`}
            >
              {range.label}
            </button>
          ))}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setPriceFilter(null);
              }}
              className="ml-1 flex items-center gap-1 text-[10px] text-rose-500 hover:text-rose-400"
            >
              <X className="h-3 w-3" /> Clear all
            </button>
          )}
        </div>
      )}

      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <span className="text-ink font-bold">{categoryLabel.toUpperCase()}</span>
          <span className="text-lagoon ml-1">({filtered.length})</span>
        </p>
        {hasActiveFilters && filtered.length !== products.length && (
          <p className="text-xs text-gray-400">
            Showing {filtered.length} of {products.length}
          </p>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard
              key={p.slug}
              slug={p.slug}
              type={p.type}
              name={p.name}
              shortDesc={p.shortDesc}
              basePrice={p.basePrice}
              originalPrice={p.originalPrice}
              priceUnit={p.priceUnit}
              duration={p.duration}
              capacity={p.capacity}
              location={p.location}
              rating={p.rating}
              isFeatured={p.isFeatured}
              isSelfServe={p.isSelfServe}
              imageUrl={p.imageUrl}
              inclusions={p.inclusions}
              highlights={p.highlights}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-gray-500 mb-2">No matches found</p>
          <p className="text-sm text-gray-400">
            Try a different search term or adjust filters.
          </p>
        </div>
      )}
    </>
  );
}
