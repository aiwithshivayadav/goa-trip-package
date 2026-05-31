import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Water Activities & Adventures in Goa",
  description: "15+ water activities in Goa — scuba diving, parasailing, bungee jumping, kayaking, helicopter ride. Starting ₹500. Book now.",
};

export default function ActivitiesPage() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-cosmic-scene py-24 text-center">
        <div className="bg-stars absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
            Adventures & <span className="text-gold-gradient">Activities</span>
          </h1>
          <p className="mt-4 text-lg text-text-muted">
            15+ thrilling experiences — scuba, parasail, bungee, kayak, helicopter
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <p className="text-center text-text-dim">
          Activities listings — coming Phase B (Week 2)
        </p>
      </section>
    </div>
  );
}
