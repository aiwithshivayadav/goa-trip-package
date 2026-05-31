import type { Metadata } from "next";
import { cruises } from "@/lib/data/products";
import { ProductCard } from "@/components/marketing/ProductCard";
import { WhyChooseUs } from "@/components/marketing/WhyChooseUs";

export const metadata: Metadata = {
  title: "Goa Cruises — Sunset, Dinner, Party, Dolphin, Private",
  description:
    "12 premium Goa cruises on the Mandovi River. Sunset dinner, night party, dolphin sightseeing, private charter. Starting ₹399. Book online instantly.",
};

export default function CruisesPage() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-cosmic-scene py-16 text-center md:py-24">
        <div className="bg-stars absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <p className="text-sm uppercase tracking-[0.15em] text-gold mb-3">On the Mandovi</p>
          <h1 className="font-display text-3xl font-bold text-white md:text-5xl lg:text-6xl">
            Goa <span className="text-gold-gradient">Cruises</span>
          </h1>
          <p className="mt-4 text-lg text-text-muted max-w-lg mx-auto">
            Sunset dinners, night parties, dolphin sightseeing, private charters — {cruises.length} experiences on the river.
          </p>
        </div>
      </section>

      <WhyChooseUs />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-text-muted">
            <span className="text-white font-bold">ALL CRUISES</span>
            <span className="text-gold ml-1">({cruises.length})</span>
          </p>
          <select className="bg-surface border border-border-gold rounded-lg px-3 py-1.5 text-sm text-text-muted focus:border-gold">
            <option>Recommended</option>
            <option>Price: Low → High</option>
            <option>Price: High → Low</option>
            <option>Rating</option>
          </select>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cruises.map((cruise) => (
            <ProductCard
              key={cruise.slug}
              slug={cruise.slug}
              type={cruise.type}
              name={cruise.name}
              shortDesc={cruise.shortDesc}
              basePrice={cruise.basePrice}
              originalPrice={cruise.originalPrice}
              priceUnit={cruise.priceUnit}
              duration={cruise.duration}
              capacity={cruise.capacity}
              location={cruise.location}
              rating={cruise.rating}
              isFeatured={cruise.isFeatured}
              isSelfServe={cruise.isSelfServe}
              imageUrl={cruise.imageUrl}
              inclusions={cruise.inclusions}
              highlights={cruise.highlights}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
