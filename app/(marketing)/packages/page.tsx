import type { Metadata } from "next";
import { getPackages } from "@/lib/data/db-products";

export const dynamic = "force-dynamic";
import { WhyChooseUs } from "@/components/marketing/WhyChooseUs";
import { ProductListingFilters } from "@/components/marketing/ProductListingFilters";

export const metadata: Metadata = {
  title: "Goa Tour Packages — Honeymoon, Family, Group, Corporate",
  description:
    "30+ curated Goa tour packages starting ₹3,499/person. Honeymoon, family, bachelor group, corporate offsite. Book with confidence — 1,200+ happy guests.",
};

export default async function PackagesPage() {
  const packages = await getPackages();
  return (
    <div className="min-h-screen bg-ground">
      <section className="relative bg-hero-gradient py-16 text-center md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_80%,rgba(198,139,63,0.1),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <p className="text-sm uppercase tracking-[0.15em] text-amber mb-3">Curated Experiences</p>
          <h1 className="font-display text-3xl font-bold text-white md:text-5xl lg:text-6xl">
            Goa Tour <span className="text-lagoon-100">Packages</span>
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-lg mx-auto">
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
