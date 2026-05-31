import Link from "next/link";

/**
 * Homepage — temporary placeholder during scaffold phase.
 * Will be replaced by full cinematic hero + marketing sections in Phase B.
 */
export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Cosmic background */}
      <div className="bg-cosmic-scene fixed inset-0 -z-20" />
      <div className="bg-stars fixed inset-0 -z-10" />

      {/* Content */}
      <main className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        {/* Gold divider */}
        <div className="gold-divider mx-auto mb-8 w-24" />

        {/* Headline */}
        <h1 className="font-display text-5xl font-bold tracking-tight text-white md:text-7xl">
          Your Royal
          <span className="text-gold-gradient block mt-2">Goa Experience</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mt-6 max-w-md text-lg text-text-muted">
          Premium packages, cruises, yachts &amp; activities.
          <br />
          Crafted for the moments that matter.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/packages"
            className="inline-flex h-12 items-center justify-center rounded-full bg-gold-gradient px-8 text-sm font-bold text-cosmic-950 shadow-gold transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Browse Packages
          </Link>
          <Link
            href="/custom-trip"
            className="glass-card inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium text-gold transition-all hover:border-gold-400"
          >
            Plan Custom Trip
          </Link>
        </div>

        {/* Trust strip */}
        <div className="gold-divider mx-auto mt-16 w-48" />
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-sm text-text-dim">
          <span className="flex items-center gap-2">
            <span className="text-gold">★</span> 4.9 Rating
          </span>
          <span className="flex items-center gap-2">
            <span className="text-gold">✓</span> 1,200+ Guests
          </span>
          <span className="flex items-center gap-2">
            <span className="text-gold">🔒</span> PayU Secure
          </span>
          <span className="flex items-center gap-2">
            <span className="text-gold">📞</span> 24/7 Support
          </span>
        </div>
      </main>
    </div>
  );
}
