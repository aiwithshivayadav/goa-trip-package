import type { Metadata } from "next";
import { getCruises } from "@/lib/data/db-products";
import { WhyChooseUs } from "@/components/marketing/WhyChooseUs";
import { ProductListingFilters } from "@/components/marketing/ProductListingFilters";

export const metadata: Metadata = {
  title: "Goa Cruises — Sunset, Dinner, Party, Dolphin, Private",
  description:
    "12 premium Goa cruises on the Mandovi River. Sunset dinner, night party, dolphin sightseeing, private charter. Starting ₹399. Book online instantly.",
};

export default async function CruisesPage() {
  const cruises = await getCruises();
  return (
    <div className="min-h-screen bg-ground">
      <section className="relative bg-hero-gradient py-16 text-center md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(26,142,125,0.15),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <p className="text-sm uppercase tracking-[0.15em] text-amber mb-3">On the Mandovi</p>
          <h1 className="font-display text-3xl font-bold text-white md:text-5xl lg:text-6xl">
            Goa <span className="text-lagoon-100">Cruises</span>
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-lg mx-auto">
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
