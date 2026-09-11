import Link from "next/link";
import { Clock, Users, MapPin, Star, Check, X, Shield, Zap, Calendar, ChevronDown, HelpCircle, Info, Navigation, Sparkles, Anchor } from "lucide-react";
import type { ProductData } from "@/lib/data/db-products";
import { formatINR } from "@/lib/utils";
import { ProductHero } from "@/components/marketing/ProductHero";
import { EnquiryButton } from "@/components/booking/EnquiryButton";
import { ProductCard } from "@/components/marketing/ProductCard";
import { GoogleReviews } from "@/components/marketing/GoogleReviews";
import { ScrollReveal } from "@/components/marketing/ScrollReveal";

export interface ProductTypeConfig {
  typeLabel: string;
  featuredLabel: string;
  categoryHref: string;
  categoryLabel: string;
  productType: string;
  similarLabel: string;
  primaryCtaLabel: string;
  overviewLabel: string;
  featuresLabel: string;
}

interface ProductDetailLayoutProps {
  product: ProductData;
  similarProducts: ProductData[];
  config: ProductTypeConfig;
}

export function ProductDetailLayout({ product: p, similarProducts, config }: ProductDetailLayoutProps) {
  const galleryImages = p.images?.length ? p.images : p.imageUrl ? [p.imageUrl] : [];
  const isSelfServe = p.isSelfServe;
  const savings = p.originalPrice ? p.originalPrice - p.basePrice : 0;
  const savingsPercent = p.originalPrice ? Math.round((savings / p.originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      {/* ═══ CINEMATIC HERO ═══ */}
      <ProductHero
        images={galleryImages}
        name={p.name}
        typeLabel={config.typeLabel}
        featuredLabel={config.featuredLabel}
        isFeatured={p.isFeatured}
        rating={p.rating}
        reviewCount={p.reviewCount}
        location={p.location}
        categoryHref={config.categoryHref}
        categoryLabel={config.categoryLabel}
      />

      {/* ═══ TRUST BADGES ═══ */}
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-2 md:px-8">
        <ScrollReveal>
          <div className="flex flex-wrap gap-2.5">
            <span className="flex items-center gap-1.5 rounded-full bg-white border border-border-warm px-3.5 py-2 text-xs text-gray-500 shadow-soft">
              <Shield className="h-3.5 w-3.5 text-green-500" /> Free Cancellation
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white border border-border-warm px-3.5 py-2 text-xs text-gray-500 shadow-soft">
              <Zap className="h-3.5 w-3.5 text-lagoon" /> Instant Confirmation
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white border border-border-warm px-3.5 py-2 text-xs text-gray-500 shadow-soft">
              <Shield className="h-3.5 w-3.5 text-blue-400" /> Best Price Guaranteed
            </span>
          </div>
        </ScrollReveal>
      </div>

      {/* ═══ MAIN CONTENT ═══ */}
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* ── LEFT COLUMN ── */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            {p.longDesc && (
              <ScrollReveal>
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="h-px w-6 bg-amber" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-amber">{config.overviewLabel}</p>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed md:text-base md:leading-7">{p.longDesc}</p>
                </div>
              </ScrollReveal>
            )}

            {/* Key Features — DARK SECTION */}
            {p.keyFeatures && p.keyFeatures.length > 0 && (
              <ScrollReveal>
                <div className="rounded-2xl bg-abyss p-6 md:p-8">
                  <div className="flex items-center gap-2.5 mb-6">
                    <span className="h-px w-6 bg-amber" />
                    <h2 className="font-display text-xl font-bold text-white md:text-2xl">{config.featuresLabel}</h2>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {p.keyFeatures.map((f) => (
                      <div
                        key={f.label}
                        className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-4 flex items-center gap-3 transition-colors hover:bg-white/[0.07]"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-lagoon/15">
                          <Info className="h-4 w-4 text-lagoon" />
                        </div>
                        <div>
                          <p className="text-[10px] text-white/40 uppercase tracking-wider">{f.label}</p>
                          <p className="text-sm font-medium text-white">{f.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Highlights */}
            {p.highlights && p.highlights.length > 0 && (
              <ScrollReveal>
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="h-px w-6 bg-amber" />
                    <h2 className="font-display text-xl font-bold text-ink md:text-2xl">Highlights</h2>
                  </div>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {p.highlights.map((h) => (
                      <div
                        key={h}
                        className="flex items-center gap-3 rounded-xl border border-lagoon/15 bg-lagoon/[0.03] px-4 py-3 transition-colors hover:bg-lagoon/[0.06]"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lagoon/10">
                          <Check className="h-3.5 w-3.5 text-lagoon" />
                        </div>
                        <span className="text-sm text-ink">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Inclusions / Exclusions */}
            {(p.inclusions || p.exclusions) && (
              <ScrollReveal>
                <div className="grid gap-5 sm:grid-cols-2">
                  {p.inclusions && (
                    <div className="rounded-2xl border border-border-warm bg-white p-5 md:p-6">
                      <h2 className="text-sm font-bold text-ink mb-4 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10">
                          <Check className="h-3.5 w-3.5 text-green-500" />
                        </div>
                        What&apos;s Included
                      </h2>
                      <ul className="space-y-2.5">
                        {p.inclusions.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-gray-500">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {p.exclusions && (
                    <div className="rounded-2xl border border-border-warm bg-white p-5 md:p-6">
                      <h2 className="text-sm font-bold text-ink mb-4 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose/10">
                          <X className="h-3.5 w-3.5 text-rose" />
                        </div>
                        Not Included
                      </h2>
                      <ul className="space-y-2.5">
                        {p.exclusions.map((item) => (
                          <li key={item} className="flex items-start gap-2.5 text-sm text-gray-500">
                            <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            )}

            {/* Itinerary */}
            {p.itinerary && p.itinerary.length > 0 && (
              <ScrollReveal>
                <div className="rounded-2xl bg-abyss p-6 md:p-8">
                  <div className="flex items-center gap-2.5 mb-6">
                    <span className="h-px w-6 bg-amber" />
                    <h2 className="font-display text-xl font-bold text-white md:text-2xl">Day-wise Itinerary</h2>
                  </div>
                  <div className="relative">
                    <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10" />
                    <div className="space-y-4">
                      {p.itinerary.map((day) => (
                        <div key={day.day} className="relative flex gap-4 pl-1">
                          <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lagoon/20 border-2 border-lagoon text-sm font-bold text-lagoon">
                            {day.day}
                          </div>
                          <div className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-4 flex-1">
                            <h3 className="font-bold text-white text-sm">{day.title}</h3>
                            <p className="mt-1.5 text-xs text-white/50 leading-relaxed">{day.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Meeting Point */}
            {p.meetingPoint && (
              <ScrollReveal>
                <div className="rounded-2xl border border-border-warm bg-white p-5 md:p-6">
                  <h2 className="text-sm font-bold text-ink mb-2 flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-lagoon" /> Meeting Point
                  </h2>
                  <p className="text-sm text-gray-500">{p.meetingPoint}</p>
                </div>
              </ScrollReveal>
            )}

            {/* What to Bring */}
            {p.whatToBring && (
              <ScrollReveal>
                <div className="rounded-2xl border border-border-warm bg-white p-5 md:p-6">
                  <h2 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
                    <Info className="h-4 w-4 text-lagoon" /> What to Bring
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {p.whatToBring.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-ground border border-border-warm px-3.5 py-1.5 text-xs text-gray-500"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* FAQ */}
            {p.faq && p.faq.length > 0 && (
              <ScrollReveal>
                <div>
                  <div className="flex items-center gap-2.5 mb-5">
                    <span className="h-px w-6 bg-amber" />
                    <h2 className="font-display text-xl font-bold text-ink md:text-2xl flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-lagoon" /> FAQs
                    </h2>
                  </div>
                  <div className="space-y-2.5">
                    {p.faq.map((item) => (
                      <details key={item.q} className="rounded-2xl border border-border-warm bg-white group">
                        <summary className="flex items-center justify-between px-5 py-4 text-sm font-medium text-ink cursor-pointer list-none hover:bg-ground/50 transition-colors rounded-2xl">
                          {item.q}
                          <ChevronDown className="h-4 w-4 text-lagoon shrink-0 transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="px-5 pb-4 border-t border-border-warm pt-3">
                          <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Google Reviews */}
            <ScrollReveal>
              <GoogleReviews />
            </ScrollReveal>

            {/* Similar Products */}
            {similarProducts.length > 0 && (
              <ScrollReveal>
                <div>
                  <div className="flex items-center gap-2.5 mb-5">
                    <span className="h-px w-6 bg-amber" />
                    <h2 className="font-display text-xl font-bold text-ink md:text-2xl">{config.similarLabel}</h2>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {similarProducts.map((s) => (
                      <ProductCard
                        key={s.slug}
                        slug={s.slug}
                        type={s.type}
                        name={s.name}
                        basePrice={s.basePrice}
                        originalPrice={s.originalPrice}
                        priceUnit={s.priceUnit}
                        duration={s.duration}
                        location={s.location}
                        rating={s.rating}
                        imageUrl={s.imageUrl}
                        isSelfServe={s.isSelfServe}
                        inclusions={s.inclusions}
                        highlights={s.highlights}
                      />
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* ── RIGHT COLUMN — Sticky pricing card ── */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              {/* Pricing card */}
              <div className="rounded-2xl bg-abyss border border-white/[0.08] p-6 shadow-elevated overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-lagoon via-amber to-lagoon" />

                <div className="text-center mb-5">
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Starting from</p>
                  <div className="mt-2 flex items-baseline justify-center gap-2">
                    {p.originalPrice && (
                      <span className="text-base text-white/30 line-through">{formatINR(p.originalPrice)}</span>
                    )}
                    <span className="text-3xl font-bold text-white">{formatINR(p.basePrice)}</span>
                  </div>
                  <p className="text-xs text-white/30 mt-0.5">/ {p.priceUnit}</p>
                  {p.originalPrice && savingsPercent > 0 && (
                    <span className="inline-block mt-2 rounded-full bg-lagoon/15 px-3 py-0.5 text-[10px] font-bold text-lagoon border border-lagoon/20">
                      Save {formatINR(savings)} ({savingsPercent}% OFF)
                    </span>
                  )}
                </div>

                <div className="h-px bg-white/[0.08] my-4" />

                {/* Quick facts */}
                <div className="space-y-3 text-sm mb-6">
                  {p.duration && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-white/40">
                        <Clock className="h-3.5 w-3.5" /> Duration
                      </span>
                      <span className="text-white font-medium text-xs">{p.duration.split("(")[0]?.trim()}</span>
                    </div>
                  )}
                  {p.capacity && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-white/40">
                        <Users className="h-3.5 w-3.5" /> Capacity
                      </span>
                      <span className="text-white font-medium text-xs">{p.capacity}</span>
                    </div>
                  )}
                  {p.location && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-white/40">
                        <MapPin className="h-3.5 w-3.5" /> Location
                      </span>
                      <span className="text-white font-medium text-xs text-right max-w-[50%]">{p.location}</span>
                    </div>
                  )}
                  {p.timing && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-white/40">
                        <Calendar className="h-3.5 w-3.5" /> Timing
                      </span>
                      <span className="text-white font-medium text-xs">{p.timing.split("(")[0]?.trim()}</span>
                    </div>
                  )}
                </div>

                {/* CTA buttons */}
                <div className="space-y-3">
                  {isSelfServe ? (
                    <Link
                      href={`/checkout?product=${p.slug}&type=${config.productType}`}
                      className="flex h-12 w-full items-center justify-center rounded-xl bg-lagoon text-sm font-bold text-white transition-all hover:bg-lagoon-600 hover:shadow-lagoon active:scale-[0.98]"
                    >
                      Book Now — {formatINR(p.basePrice)}
                    </Link>
                  ) : (
                    <EnquiryButton
                      productName={p.name}
                      productSlug={p.slug}
                      productType={config.productType}
                      productPrice={p.basePrice}
                      variant="gold"
                      label={config.primaryCtaLabel}
                    />
                  )}
                  <EnquiryButton
                    productName={p.name}
                    productSlug={p.slug}
                    productType={config.productType}
                    productPrice={p.basePrice}
                    label="WhatsApp Enquiry"
                  />
                </div>

                <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-white/30">
                  <Shield className="h-3 w-3 text-lagoon" />
                  Secured by PayU · Free cancellation
                </div>
              </div>

              {/* Social proof */}
              <div className="rounded-xl bg-abyss-light border border-white/[0.06] p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-white/50">
                  <Sparkles className="h-3.5 w-3.5 text-amber" />
                  <span>
                    <strong className="text-white">12 people</strong> booked in the last 24 hours
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MOBILE STICKY CTA ═══ */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border-warm bg-white/95 backdrop-blur-lg p-4 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            {p.originalPrice && (
              <p className="text-[10px] text-gray-400 line-through">{formatINR(p.originalPrice)}</p>
            )}
            <p className="text-lg font-bold text-ink">
              {formatINR(p.basePrice)}
              <span className="text-xs text-gray-400 font-normal ml-1">/{p.priceUnit}</span>
            </p>
          </div>
          {isSelfServe ? (
            <Link
              href={`/checkout?product=${p.slug}&type=${config.productType}`}
              className="flex h-11 items-center justify-center rounded-xl bg-lagoon px-6 text-sm font-bold text-white"
            >
              Book Now
            </Link>
          ) : (
            <EnquiryButton
              productName={p.name}
              productSlug={p.slug}
              productType={config.productType}
              productPrice={p.basePrice}
              variant="outline"
              label="Get Quote"
            />
          )}
          <EnquiryButton
            productName={p.name}
            productSlug={p.slug}
            productType={config.productType}
            productPrice={p.basePrice}
            variant="compact"
          />
        </div>
      </div>
    </div>
  );
}
