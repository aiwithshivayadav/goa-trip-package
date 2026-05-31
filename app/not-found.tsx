import type { Metadata } from "next";
import Link from "next/link";
import { Search, Anchor, Ship, Sailboat, Waves, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist. Browse Goa Trip Package for cruises, yachts, packages, and activities.",
};

export default function NotFoundPage() {
  const categories = [
    { href: "/packages", label: "Packages", icon: Waves, desc: "39 curated trip packages" },
    { href: "/cruises", label: "Cruises", icon: Ship, desc: "13 river & sunset cruises" },
    { href: "/yachts", label: "Yachts", icon: Sailboat, desc: "23 luxury yachts" },
    { href: "/activities", label: "Activities", icon: Anchor, desc: "18 adventure activities" },
  ];

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-cosmic-scene px-6 py-20 text-center">
      <div className="bg-stars absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-lg">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-border-gold/30 bg-surface">
          <Search className="h-10 w-10 text-gold" />
        </div>

        {/* Heading */}
        <p className="text-sm uppercase tracking-[0.15em] text-gold mb-3">
          Error 404
        </p>
        <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
          Page <span className="text-gold-gradient">Not Found</span>
        </h1>
        <p className="mt-4 text-text-muted leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        {/* Search link */}
        <Link
          href="/search"
          className="mx-auto mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold-gradient px-8 text-sm font-bold text-cosmic-950 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Search className="h-4 w-4" />
          Search Experiences
        </Link>

        {/* Popular categories */}
        <div className="mt-12">
          <p className="text-xs uppercase tracking-[0.15em] text-text-dim mb-4">
            Popular Categories
          </p>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="glass-card rounded-xl p-4 text-left transition-colors"
                >
                  <Icon className="h-5 w-5 text-gold mb-2" />
                  <p className="text-sm font-bold text-white">{cat.label}</p>
                  <p className="text-xs text-text-muted mt-0.5">{cat.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* WhatsApp help */}
        <div className="mt-10 border-t border-border-gold/20 pt-8">
          <p className="text-xs text-text-muted mb-3">
            Still can&apos;t find what you need?
          </p>
          <a
            href="https://wa.me/919890830249?text=Hi%2C%20I%20need%20help%20finding%20something%20on%20your%20website"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border-gold px-6 text-sm text-gold transition-colors hover:bg-surface-hover"
          >
            <MessageCircle className="h-4 w-4" />
            Chat with us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
