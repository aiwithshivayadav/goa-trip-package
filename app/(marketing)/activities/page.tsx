import type { Metadata } from "next";
import { activities } from "@/lib/data/products";
import { ProductListingFilters } from "@/components/marketing/ProductListingFilters";

export const metadata: Metadata = {
  title: "Water Activities & Adventures in Goa — Scuba, Parasailing, Bungee",
  description:
    "15+ adventure activities in Goa — scuba diving, parasailing, bungee jumping, kayaking, jet ski, helicopter ride. Starting ₹600. Book instantly.",
};

export default function ActivitiesPage() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-cosmic-scene py-20 text-center md:py-28">
        <div className="bg-stars absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <p className="text-sm uppercase tracking-[0.15em] text-gold mb-3">
            Thrill & Adventure
          </p>
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Adventures & <span className="text-gold-gradient">Activities</span>
          </h1>
          <p className="mt-4 text-lg text-text-muted max-w-lg mx-auto">
            {activities.length}+ experiences — scuba, parasail, bungee, kayak, jet ski, helicopter, and more.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <ProductListingFilters products={activities} categoryLabel="All Activities" />
      </section>
    </div>
  );
}
