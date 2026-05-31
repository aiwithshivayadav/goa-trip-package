"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Fuse from "fuse.js";
import { Search as SearchIcon } from "lucide-react";
import { allProducts, type ProductData } from "@/lib/data/products";
import { ProductCard } from "@/components/marketing/ProductCard";

const fuse = new Fuse(allProducts, {
  keys: [
    { name: "name", weight: 0.4 },
    { name: "shortDesc", weight: 0.3 },
    { name: "location", weight: 0.15 },
    { name: "type", weight: 0.15 },
  ],
  threshold: 0.4,
  includeScore: true,
});

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}

function SearchSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-text-muted">Loading search...</div>
    </div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo(() => {
    if (!query.trim()) return allProducts;
    return fuse.search(query).map((result) => result.item);
  }, [query]);

  return (
    <div className="min-h-screen">
      {/* Search hero */}
      <section className="relative bg-cosmic-scene py-16 md:py-20">
        <div className="bg-stars absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <h1 className="font-display text-3xl font-bold text-white md:text-4xl mb-8">
            Search <span className="text-gold-gradient">Experiences</span>
          </h1>

          {/* Search input */}
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-dim" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search packages, cruises, yachts, activities..."
              className="w-full h-14 rounded-xl bg-surface border border-border-gold pl-12 pr-4 text-white placeholder:text-text-dim focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors text-base"
              autoFocus
            />
          </div>

          <p className="mt-4 text-sm text-text-dim">
            {query.trim()
              ? `${results.length} result${results.length !== 1 ? "s" : ""} for "${query}"`
              : `${allProducts.length} experiences available`}
          </p>
        </div>
      </section>

      {/* Results */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        {results.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((product: ProductData) => (
              <ProductCard
                key={product.slug}
                slug={product.slug}
                type={product.type}
                name={product.name}
                shortDesc={product.shortDesc}
                basePrice={product.basePrice}
                priceUnit={product.priceUnit}
                duration={product.duration}
                capacity={product.capacity}
                location={product.location}
                rating={product.rating}
                isFeatured={product.isFeatured}
                imageUrl={product.imageUrl}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-2xl text-text-muted mb-4">No results found</p>
            <p className="text-sm text-text-dim">Try a different search term, or browse our categories above.</p>
          </div>
        )}
      </section>
    </div>
  );
}
