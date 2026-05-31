import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yacht Charter Goa",
  description: "14 luxury yachts for charter in Goa — parties, celebrations, romantic getaways. Starting ₹7,000/hour. Book your private yacht.",
};

export default function YachtsPage() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-cosmic-scene py-24 text-center">
        <div className="bg-stars absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
            Yacht <span className="text-gold-gradient">Charter</span>
          </h1>
          <p className="mt-4 text-lg text-text-muted">
            14 luxury yachts — private parties, celebrations, romantic getaways
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <p className="text-center text-text-dim">
          Yacht listings — coming Phase B (Week 2)
        </p>
      </section>
    </div>
  );
}
