import type { Metadata } from "next";
import { cruises } from "@/lib/data/products";
import { ProductCard } from "@/components/marketing/ProductCard";

export const metadata: Metadata = {
  title: "Goa Cruises — Sunset, Dinner, Party, Dolphin, Private",
  description:
    "12 premium Goa cruises on the Mandovi River. Sunset dinner, night party, dolphin sightseeing, private charter. Starting ₹399. Book online instantly.",
};

export default function CruisesPage() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-cosmic-scene py-20 text-center md:py-28">
        <div className="bg-stars absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <p className="text-sm uppercase tracking-[0.15em] text-gold mb-3">
            On the Mandovi
          </p>
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Goa <span className="text-gold-gradient">Cruises</span>
          </h1>
          <p className="mt-4 text-lg text-text-muted max-w-lg mx-auto">
            Sunset dinners, night parties, dolphin sightseeing, private charters — {cruises.length} experiences on the river.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm text-text-muted">
            Showing <span className="text-white font-medium">{cruises.length}</span> cruises
          </p>
          <div className="text-sm text-text-dim">Sort: Recommended</div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cruises.map((cruise) => (
            <ProductCard
              key={cruise.slug}
              slug={cruise.slug}
              type={cruise.type}
              name={cruise.name}
              shortDesc={cruise.shortDesc}
              basePrice={cruise.basePrice}
              priceUnit={cruise.priceUnit}
              duration={cruise.duration}
              capacity={cruise.capacity}
              location={cruise.location}
              rating={cruise.rating}
              isFeatured={cruise.isFeatured}
              imageUrl={cruise.imageUrl}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
