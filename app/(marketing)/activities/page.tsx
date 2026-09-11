import type { Metadata } from "next";
import { getActivities } from "@/lib/data/db-products";
import { ProductListingFilters } from "@/components/marketing/ProductListingFilters";

export const metadata: Metadata = {
  title: "Water Activities & Adventures in Goa — Scuba, Parasailing, Bungee",
  description:
    "15+ adventure activities in Goa — scuba diving, parasailing, bungee jumping, kayaking, jet ski, helicopter ride. Starting ₹600. Book instantly.",
};

export default async function ActivitiesPage() {
  const activities = await getActivities();
  return (
    <div className="min-h-screen bg-ground">
      <section className="relative bg-hero-gradient py-20 text-center md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(26,142,125,0.12),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <p className="text-sm uppercase tracking-[0.15em] text-amber mb-3">
            Thrill & Adventure
          </p>
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Adventures & <span className="text-lagoon-100">Activities</span>
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-lg mx-auto">
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
