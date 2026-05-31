import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Goa Cruises",
  description: "12 premium Goa cruises — sunset, dinner, party, dolphin, private charter. Starting ₹399/person. Book online instantly.",
};

export default function CruisesPage() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-cosmic-scene py-24 text-center">
        <div className="bg-stars absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
            Goa <span className="text-gold-gradient">Cruises</span>
          </h1>
          <p className="mt-4 text-lg text-text-muted">
            12 premium cruises on the Mandovi — sunset, dinner, party, dolphin
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <p className="text-center text-text-dim">
          Cruise listings — coming Phase B (Week 2)
        </p>
      </section>
    </div>
  );
}
