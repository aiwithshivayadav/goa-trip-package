import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan Your Custom Goa Trip",
  description: "Build your dream Goa itinerary — pick dates, activities, hotels, cruises. Get a personalised quote in 30 minutes.",
};

/**
 * /custom-trip — 4-step wizard for custom trip enquiry
 * Steps:
 * 1. Dates + travelers
 * 2. Pick experiences (multi-select from catalog)
 * 3. Hotel preference
 * 4. Contact info
 *
 * On submit: writes to leads table + fires n8n webhook
 */
export default function CustomTripPage() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-cosmic-scene py-24 text-center">
        <div className="bg-stars absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <p className="text-sm uppercase tracking-widest text-gold mb-4">Personalised for you</p>
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
            Plan Your Dream
            <span className="text-gold-gradient block mt-1">Goa Trip</span>
          </h1>
          <p className="mt-4 text-lg text-text-muted max-w-md mx-auto">
            Tell us what you want. Our planners craft a custom itinerary and share a quote within 30 minutes.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-16 md:px-8">
        {/* TODO (Phase B Day 7): 4-step wizard component with RHF + Zod */}
        <div className="glass-card rounded-2xl p-8">
          <p className="text-text-muted text-center">
            4-step custom trip wizard — coming Phase B (Week 2)
          </p>
          <div className="gold-divider my-6" />
          <p className="text-sm text-text-dim text-center">
            Meanwhile, WhatsApp us directly:
          </p>
          <div className="mt-4 text-center">
            <a
              href="https://wa.me/919890830249?text=Hi%2C%20I%20want%20to%20plan%20a%20custom%20Goa%20trip"
              className="inline-flex h-12 items-center justify-center rounded-full bg-gold-gradient px-8 text-sm font-bold text-cosmic-950"
            >
              WhatsApp Us →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
