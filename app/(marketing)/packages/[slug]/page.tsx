import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Users, MapPin, Star, Check, X, ArrowLeft } from "lucide-react";
import { packages, type ProductData } from "@/lib/data/products";
import { formatINR } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = packages.find((p) => p.slug === slug);
  if (!pkg) return { title: "Package Not Found" };

  return {
    title: pkg.name,
    description: pkg.shortDesc,
  };
}

export async function generateStaticParams() {
  return packages.map((pkg) => ({ slug: pkg.slug }));
}

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const pkg = packages.find((p) => p.slug === slug);

  if (!pkg) notFound();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-cosmic-scene py-16 md:py-24">
        <div className="bg-stars absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
          {/* Breadcrumb */}
          <Link href="/packages" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" /> All Packages
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left — content (2/3) */}
            <div className="lg:col-span-2">
              {/* Type badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold mb-4">
                {pkg.isFeatured && <Star className="h-3 w-3 fill-gold" />}
                Tour Package
              </div>

              <h1 className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
                {pkg.name}
              </h1>

              <p className="mt-4 text-lg text-text-muted max-w-2xl">
                {pkg.shortDesc}
              </p>

              {/* Meta */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-text-muted">
                {pkg.duration && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-gold" /> {pkg.duration}
                  </span>
                )}
                {pkg.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-gold" /> {pkg.location}
                  </span>
                )}
                {pkg.rating && (
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-gold text-gold" /> {pkg.rating} / 5
                  </span>
                )}
              </div>
            </div>

            {/* Right — pricing card (1/3, sticky on desktop) */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="glass-card rounded-2xl p-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-text-muted">Starting from</p>
                  <p className="mt-1 text-3xl font-bold text-white">
                    {formatINR(pkg.basePrice)}
                  </p>
                  <p className="text-sm text-text-dim">/ {pkg.priceUnit}</p>
                </div>

                <div className="gold-divider my-4" />

                {/* Quick facts */}
                <div className="space-y-2 text-sm mb-6">
                  {pkg.duration && (
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">Duration</span>
                      <span className="text-white font-medium">{pkg.duration}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Type</span>
                    <span className="text-white font-medium capitalize">Quote-led</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted">Payment</span>
                    <span className="text-white font-medium">25% advance</span>
                  </div>
                </div>

                {/* CTA buttons */}
                <div className="space-y-3">
                  <Link
                    href={`/custom-trip?package=${pkg.slug}`}
                    className="flex h-12 w-full items-center justify-center rounded-xl bg-gold-gradient text-sm font-bold text-cosmic-950 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Get Custom Quote
                  </Link>
                  <a
                    href={`https://wa.me/919890830249?text=${encodeURIComponent(`Hi, I'm interested in: ${pkg.name} (${formatINR(pkg.basePrice)} ${pkg.priceUnit})`)}`}
                    className="flex h-12 w-full items-center justify-center rounded-xl border border-border-gold text-sm font-medium text-gold transition-colors hover:bg-surface"
                  >
                    WhatsApp Enquiry
                  </a>
                </div>

                <p className="mt-4 text-center text-xs text-text-dim">
                  Free cancellation up to 48 hrs before travel
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content sections */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">
            {/* Itinerary */}
            {pkg.itinerary && pkg.itinerary.length > 0 && (
              <div>
                <h2 className="font-display text-2xl font-bold text-white mb-6">
                  Day-wise <span className="text-gold">Itinerary</span>
                </h2>
                <div className="space-y-4">
                  {pkg.itinerary.map((day) => (
                    <div
                      key={day.day}
                      className="glass-card rounded-xl p-5 transition-all hover:border-gold/40"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-sm font-bold text-gold">
                          D{day.day}
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{day.title}</h3>
                          <p className="mt-1 text-sm text-text-muted">{day.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions / Exclusions */}
            <div className="grid gap-6 sm:grid-cols-2">
              {pkg.inclusions && (
                <div>
                  <h2 className="font-display text-xl font-bold text-white mb-4">
                    <Check className="inline h-5 w-5 text-green-400 mr-2" />
                    Inclusions
                  </h2>
                  <ul className="space-y-2">
                    {pkg.inclusions.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-muted">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pkg.exclusions && (
                <div>
                  <h2 className="font-display text-xl font-bold text-white mb-4">
                    <X className="inline h-5 w-5 text-rose mr-2" />
                    Exclusions
                  </h2>
                  <ul className="space-y-2">
                    {pkg.exclusions.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-text-muted">
                        <X className="mt-0.5 h-4 w-4 shrink-0 text-rose" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right column spacer (pricing card is sticky in hero above on desktop) */}
          <div className="hidden lg:block" />
        </div>
      </section>

      {/* Mobile sticky bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border-gold bg-cosmic-950/95 backdrop-blur-lg p-4 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-text-dim">From</p>
            <p className="text-lg font-bold text-white">{formatINR(pkg.basePrice)}</p>
          </div>
          <Link
            href={`/custom-trip?package=${pkg.slug}`}
            className="flex h-11 items-center justify-center rounded-xl bg-gold-gradient px-6 text-sm font-bold text-cosmic-950"
          >
            Get Quote
          </Link>
          <a
            href={`https://wa.me/919890830249?text=${encodeURIComponent(`Hi, interested in: ${pkg.name}`)}`}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-border-gold text-gold"
            aria-label="WhatsApp"
          >
            💬
          </a>
        </div>
      </div>
    </div>
  );
}
