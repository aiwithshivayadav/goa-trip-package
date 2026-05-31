import type { Metadata } from "next";
import { packages } from "@/lib/data/products";
import { ProductCard } from "@/components/marketing/ProductCard";

export const metadata: Metadata = {
  title: "Goa Tour Packages — Honeymoon, Family, Group, Corporate",
  description:
    "30+ curated Goa tour packages starting ₹3,499/person. Honeymoon, family, bachelor group, corporate offsite. Book with confidence — 1,200+ happy guests.",
};

export default function PackagesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-cosmic-scene py-20 text-center md:py-28">
        <div className="bg-stars absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <p className="text-sm uppercase tracking-[0.15em] text-gold mb-3">
            Curated Experiences
          </p>
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Goa Tour <span className="text-gold-gradient">Packages</span>
          </h1>
          <p className="mt-4 text-lg text-text-muted max-w-lg mx-auto">
            Honeymoon, family, group, bachelor, corporate — {packages.length}+ itineraries crafted for every traveller.
          </p>
        </div>
      </section>

      {/* Products grid */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        {/* Filter bar placeholder */}
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm text-text-muted">
            Showing <span className="text-white font-medium">{packages.length}</span> packages
          </p>
          <div className="text-sm text-text-dim">
            {/* TODO: Sort dropdown + filter drawer */}
            Sort: Recommended
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <ProductCard
              key={pkg.slug}
              slug={pkg.slug}
              type={pkg.type}
              name={pkg.name}
              shortDesc={pkg.shortDesc}
              basePrice={pkg.basePrice}
              priceUnit={pkg.priceUnit}
              duration={pkg.duration}
              location={pkg.location}
              rating={pkg.rating}
              isFeatured={pkg.isFeatured}
              imageUrl={pkg.imageUrl}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
