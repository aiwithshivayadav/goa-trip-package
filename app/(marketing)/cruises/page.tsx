import type { Metadata } from "next";
import { cruises } from "@/lib/data/products";
import { WhyChooseUs } from "@/components/marketing/WhyChooseUs";
import { ProductListingFilters } from "@/components/marketing/ProductListingFilters";

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
        <ProductListingFilters products={cruises} categoryLabel="All Cruises" />
      </section>
    </div>
  );
}
