import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Goa Tour Packages",
  description: "30+ curated Goa packages — honeymoon, family, group, bachelor, corporate. Starting ₹5,000/person. Book with confidence.",
};

/**
 * /packages — Package listing page
 * Will have: hero banner, filter sidebar, sort, card grid with skeleton loaders
 */
export default function PackagesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-cosmic-scene py-24 text-center">
        <div className="bg-stars absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
            Goa Tour <span className="text-gold-gradient">Packages</span>
          </h1>
          <p className="mt-4 text-lg text-text-muted">
            30+ curated experiences — honeymoon, family, group, bachelor, corporate
          </p>
        </div>
      </section>

      {/* Content placeholder */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <p className="text-center text-text-dim">
          Package listings with filters — coming Phase B (Week 2)
        </p>
      </section>
    </div>
  );
}
