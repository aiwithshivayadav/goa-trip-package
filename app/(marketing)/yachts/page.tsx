import type { Metadata } from "next";
import { yachts } from "@/lib/data/products";
import { ProductListingFilters } from "@/components/marketing/ProductListingFilters";

export const metadata: Metadata = {
  title: "Yacht Charter Goa — Luxury Yachts for Parties & Celebrations",
  description:
    "14 luxury yachts in Goa — parties, birthdays, corporate events, romantic getaways. Starting ₹7,000/hour. Professional crew included.",
};

export default function YachtsPage() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-cosmic-scene py-20 text-center md:py-28">
        <div className="bg-stars absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <p className="text-sm uppercase tracking-[0.15em] text-gold mb-3">
            Private Luxury
          </p>
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Yacht <span className="text-gold-gradient">Charter</span>
          </h1>
          <p className="mt-4 text-lg text-text-muted max-w-lg mx-auto">
            {yachts.length} luxury yachts — birthdays, bachelorettes, corporate events, romantic sunsets.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <ProductListingFilters products={yachts} categoryLabel="All Yachts" />
      </section>
    </div>
  );
}
