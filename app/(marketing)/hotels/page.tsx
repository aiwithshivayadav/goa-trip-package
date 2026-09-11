import type { Metadata } from "next";
import { getHotels } from "@/lib/data/db-products";
import { ProductListingFilters } from "@/components/marketing/ProductListingFilters";

export const metadata: Metadata = {
  title: "Hotels in Goa — Luxury Resorts to Budget Stays",
  description:
    "Handpicked Goa hotels — The Leela, W Goa, Resort Rio, Crown. 5-star luxury to budget-friendly. Best rates guaranteed through Goa Trip Package.",
};

export default async function HotelsPage() {
  const hotels = await getHotels();
  return (
    <div className="min-h-screen bg-ground">
      <section className="relative bg-hero-gradient py-20 text-center md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(198,139,63,0.08),transparent_60%)]" />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <p className="text-sm uppercase tracking-[0.15em] text-amber mb-3">
            Handpicked Stays
          </p>
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Goa <span className="text-lagoon-100">Hotels</span>
          </h1>
          <p className="mt-4 text-lg text-white/70 max-w-lg mx-auto">
            From boutique beach villas to 5-star luxury resorts — {hotels.length}+ properties at best rates.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <ProductListingFilters products={hotels} categoryLabel="All Hotels" />
      </section>
    </div>
  );
}
