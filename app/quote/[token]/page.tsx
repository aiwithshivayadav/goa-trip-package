import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface QuotePageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: QuotePageProps): Promise<Metadata> {
  const { token } = await params;
  return {
    title: `Your Goa Quote`,
    description: "View your personalised Goa trip itinerary and book with one click.",
    robots: { index: false, follow: false },
  };
}

export default async function QuotePage({ params }: QuotePageProps) {
  const { token } = await params;

  return (
    <div className="min-h-screen bg-ground">
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center">
        <div className="section-divider mx-auto mb-8 w-16" />

        <p className="text-sm uppercase tracking-widest text-amber mb-4">Your Personalised Quote</p>

        <h1 className="font-display text-4xl font-bold text-ink md:text-5xl mb-6">
          Goa Trip <span className="text-lagoon">Itinerary</span>
        </h1>

        <div className="rounded-2xl border border-border-warm bg-white p-8 text-left">
          <p className="text-gray-500 text-sm mb-2">Quote Token</p>
          <p className="text-ink font-mono text-sm break-all">{token}</p>

          <div className="section-divider my-6" />

          <p className="text-gray-500">
            Full quote view (day-wise itinerary, hotel photos, pricing, Accept & Pay CTA) — coming Phase C (Week 4).
          </p>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border-warm bg-white/95 backdrop-blur-lg p-4 sm:hidden">
          <div className="flex gap-3">
            <button className="flex-1 h-11 rounded-lg bg-lagoon text-white font-bold text-sm">
              Accept & Pay 25%
            </button>
            <a
              href={`https://wa.me/919890830249?text=${encodeURIComponent("Hi, I have questions about my quote")}`}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-border-warm text-lagoon"
            >
              💬
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
