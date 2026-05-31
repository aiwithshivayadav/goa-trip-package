import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface QuotePageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: QuotePageProps): Promise<Metadata> {
  const { token } = await params;
  // TODO: fetch quote title from DB
  return {
    title: `Your Goa Quote`,
    description: "View your personalised Goa trip itinerary and book with one click.",
    robots: { index: false, follow: false }, // Private URLs — don't index
  };
}

/**
 * /quote/[token] — Public quote page (tokenised, no auth)
 * Customer receives this link via WhatsApp/email after sales builds their quote
 *
 * Structure:
 * - Hero with customer name, quote ID, valid-until countdown
 * - Day-wise itinerary cards
 * - Hotel cards with photos
 * - Inclusions/Exclusions
 * - Price breakdown
 * - Sticky CTA: Accept & Pay 25% / Pay Full / WhatsApp / Decline
 */
export default async function QuotePage({ params }: QuotePageProps) {
  const { token } = await params;

  // TODO (Phase C): Fetch quote from DB by publicToken
  // const quote = await db.quote.findUnique({ where: { publicToken: token } });
  // if (!quote) notFound();
  // if (quote.status === "expired") return <QuoteExpired />;

  // Placeholder — shows the token to confirm routing works
  return (
    <div className="min-h-screen bg-cosmic-scene">
      <div className="bg-stars fixed inset-0 -z-10" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center">
        <div className="gold-divider mx-auto mb-8 w-16" />

        <p className="text-sm uppercase tracking-widest text-gold mb-4">Your Personalised Quote</p>

        <h1 className="font-display text-4xl font-bold text-white md:text-5xl mb-6">
          Goa Trip <span className="text-gold-gradient">Itinerary</span>
        </h1>

        <div className="glass-card rounded-2xl p-8 text-left">
          <p className="text-text-muted text-sm mb-2">Quote Token</p>
          <p className="text-white font-mono text-sm break-all">{token}</p>

          <div className="gold-divider my-6" />

          <p className="text-text-muted">
            Full quote view (day-wise itinerary, hotel photos, pricing, Accept & Pay CTA) — coming Phase C (Week 4).
          </p>
        </div>

        {/* Sticky bottom CTA — mobile */}
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border-gold bg-cosmic-950/95 backdrop-blur-lg p-4 sm:hidden">
          <div className="flex gap-3">
            <button className="flex-1 h-11 rounded-lg bg-gold-gradient text-cosmic-950 font-bold text-sm">
              Accept & Pay 25%
            </button>
            <a
              href={`https://wa.me/919890830249?text=${encodeURIComponent("Hi, I have questions about my quote")}`}
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-border-gold text-gold"
            >
              💬
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
