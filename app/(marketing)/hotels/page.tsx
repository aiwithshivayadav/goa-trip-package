import type { Metadata } from "next";
import { hotels } from "@/lib/data/products";
import { ProductCard } from "@/components/marketing/ProductCard";

export const metadata: Metadata = {
  title: "Hotels in Goa — Luxury Resorts to Budget Stays",
  description:
    "Handpicked Goa hotels — The Leela, W Goa, Resort Rio, Crown. 5-star luxury to budget-friendly. Best rates guaranteed through Goa Trip Package.",
};

export default function HotelsPage() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-cosmic-scene py-20 text-center md:py-28">
        <div className="bg-stars absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <p className="text-sm uppercase tracking-[0.15em] text-gold mb-3">
            Handpicked Stays
          </p>
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Goa <span className="text-gold-gradient">Hotels</span>
          </h1>
          <p className="mt-4 text-lg text-text-muted max-w-lg mx-auto">
            From boutique beach villas to 5-star luxury resorts — {hotels.length}+ properties at best rates.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm text-text-muted">
            Showing <span className="text-white font-medium">{hotels.length}</span> hotels
          </p>
          <div className="text-sm text-text-dim">Sort: Rating (high → low)</div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => (
            <ProductCard
              key={hotel.slug}
              slug={hotel.slug}
              type={hotel.type}
              name={hotel.name}
              shortDesc={hotel.shortDesc}
              basePrice={hotel.basePrice}
              priceUnit={hotel.priceUnit}
              location={hotel.location}
              rating={hotel.rating}
              isFeatured={hotel.isFeatured}
              imageUrl={hotel.imageUrl}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
