import type { Metadata } from "next";
import { packages } from "@/lib/data/products";
import { ProductCard } from "@/components/marketing/ProductCard";
import { WhyChooseUs } from "@/components/marketing/WhyChooseUs";

export const metadata: Metadata = {
  title: "Goa Tour Packages — Honeymoon, Family, Group, Corporate",
  description:
    "30+ curated Goa tour packages starting ₹3,499/person. Honeymoon, family, bachelor group, corporate offsite. Book with confidence — 1,200+ happy guests.",
};

export default function PackagesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
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

      {/* Why choose us strip */}
      <WhyChooseUs />

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="flex gap-8">
          {/* Filter sidebar (desktop) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Filters</h3>

              {/* Duration */}
              <div>
                <h4 className="text-xs font-semibold text-text-muted mb-2">Duration</h4>
                <div className="space-y-1.5">
                  {["2N / 3D", "3N / 4D", "4N / 5D", "5N / 6D+"].map((d) => (
                    <label key={d} className="flex items-center gap-2 text-sm text-text-muted hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="accent-gold rounded" />
                      {d}
                    </label>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <h4 className="text-xs font-semibold text-text-muted mb-2">Budget (per person)</h4>
                <div className="space-y-1.5">
                  {["Under ₹5,000", "₹5,000 – ₹10,000", "₹10,000 – ₹20,000", "₹20,000+"].map((b) => (
                    <label key={b} className="flex items-center gap-2 text-sm text-text-muted hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="accent-gold rounded" />
                      {b}
                    </label>
                  ))}
                </div>
              </div>

              {/* Themes */}
              <div>
                <h4 className="text-xs font-semibold text-text-muted mb-2">Themes</h4>
                <div className="space-y-1.5">
                  {["Honeymoon", "Family", "Group / Friends", "Corporate", "Adventure", "Budget"].map((t) => (
                    <label key={t} className="flex items-center gap-2 text-sm text-text-muted hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="accent-gold rounded" />
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              {/* Hotel category */}
              <div>
                <h4 className="text-xs font-semibold text-text-muted mb-2">Hotel Category</h4>
                <div className="space-y-1.5">
                  {["Budget / Hostel", "3 Star", "4 Star", "5 Star Luxury"].map((h) => (
                    <label key={h} className="flex items-center gap-2 text-sm text-text-muted hover:text-white cursor-pointer transition-colors">
                      <input type="checkbox" className="accent-gold rounded" />
                      {h}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-text-muted">
                <span className="text-white font-bold">ALL PACKAGES</span>
                <span className="text-gold ml-1">({packages.length})</span>
              </p>
              <select className="bg-surface border border-border-gold rounded-lg px-3 py-1.5 text-sm text-text-muted focus:border-gold">
                <option>Recommended</option>
                <option>Price: Low → High</option>
                <option>Price: High → Low</option>
                <option>Rating</option>
                <option>Duration</option>
              </select>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {packages.map((pkg) => (
                <ProductCard
                  key={pkg.slug}
                  slug={pkg.slug}
                  type={pkg.type}
                  name={pkg.name}
                  shortDesc={pkg.shortDesc}
                  basePrice={pkg.basePrice}
                  originalPrice={pkg.originalPrice}
                  priceUnit={pkg.priceUnit}
                  duration={pkg.duration}
                  location={pkg.location}
                  rating={pkg.rating}
                  isFeatured={pkg.isFeatured}
                  imageUrl={pkg.imageUrl}
                  inclusions={pkg.inclusions}
                  highlights={pkg.highlights}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
