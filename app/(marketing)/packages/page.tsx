import type { Metadata } from "next";
import { packages } from "@/lib/data/products";
import { WhyChooseUs } from "@/components/marketing/WhyChooseUs";
import { ProductListingFilters } from "@/components/marketing/ProductListingFilters";

export const metadata: Metadata = {
  title: "Goa Tour Packages — Honeymoon, Family, Group, Corporate",
  description:
    "30+ curated Goa tour packages starting ₹3,499/person. Honeymoon, family, bachelor group, corporate offsite. Book with confidence — 1,200+ happy guests.",
};

export default function PackagesPage() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-cosmic-scene py-16 text-center md:py-24">
        <div className="bg-stars absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <p className="text-sm uppercase tracking-[0.15em] text-gold mb-3">Curated Experiences</p>
          <h1 className="font-display text-3xl font-bold text-white md:text-5xl lg:text-6xl">
            Goa Tour <span className="text-gold-gradient">Packages</span>
          </h1>
          <p className="mt-4 text-lg text-text-muted max-w-lg mx-auto">
            Honeymoon, family, group, bachelor, corporate — {packages.length}+ itineraries crafted for every traveller.
          </p>
        </div>
      </section>

      <WhyChooseUs />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <ProductListingFilters products={packages} categoryLabel="All Packages" />
      </section>
    </div>
  );
}
