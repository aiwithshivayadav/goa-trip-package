import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Users, MapPin, Star, Check, X, ArrowLeft, Shield, Zap, Calendar, ChevronDown, HelpCircle, Info, Navigation } from "lucide-react";
import { yachts, type ProductData } from "@/lib/data/products";
import { formatINR } from "@/lib/utils";
import { ImageGallery } from "@/components/marketing/ImageGallery";
import { EnquiryButton } from "@/components/booking/EnquiryButton";
import { ProductCard } from "@/components/marketing/ProductCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const p = yachts.find((y) => y.slug === slug);
  if (!p) return { title: "Yacht Not Found" };
  return { title: p.name, description: p.shortDesc };
}

export async function generateStaticParams() {
  return yachts.map((y) => ({ slug: y.slug }));
}

export default async function YachtDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const p = yachts.find((y) => y.slug === slug);
  if (!p) notFound();

  const galleryImages = p.images?.length ? p.images : (p.imageUrl ? [p.imageUrl] : []);
  const similarProducts = yachts.filter((y) => y.slug !== slug).slice(0, 3);
  const isSelfServe = p.isSelfServe;

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 pt-4 md:px-8">
        <Link href="/yachts" className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-gold transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> All Yachts
        </Link>
      </div>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left column (2/3) — gallery + content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <ImageGallery images={galleryImages} alt={p.name} />

            {/* Title + meta (mobile — hidden on desktop where it's in right col) */}
            <div className="lg:hidden">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-md bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold uppercase tracking-wider">Yacht Charter</span>
                {p.isFeatured && <span className="rounded-md bg-gold-gradient px-2 py-0.5 text-[10px] font-bold text-cosmic-950">Best Seller</span>}
              </div>
              <h1 className="font-display text-2xl font-bold text-white">{p.name}</h1>
              {p.rating && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="flex items-center gap-1 rounded bg-green-500/20 px-2 py-0.5 text-sm font-bold text-green-400">
                    <Star className="h-3.5 w-3.5 fill-green-400" /> {p.rating}
                  </span>
                  {p.reviewCount && <span className="text-xs text-text-muted">({p.reviewCount}+ reviews)</span>}
                </div>
              )}
            </div>

            {/* Trust badges row */}
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-1.5 rounded-lg bg-surface border border-border-gold/30 px-3 py-2 text-xs text-text-muted">
                <Shield className="h-3.5 w-3.5 text-green-400" /> Free Cancellation
              </span>
              <span className="flex items-center gap-1.5 rounded-lg bg-surface border border-border-gold/30 px-3 py-2 text-xs text-text-muted">
                <Zap className="h-3.5 w-3.5 text-gold" /> Instant Confirmation
              </span>
              <span className="flex items-center gap-1.5 rounded-lg bg-surface border border-border-gold/30 px-3 py-2 text-xs text-text-muted">
                <Shield className="h-3.5 w-3.5 text-blue-400" /> Best Price Guaranteed
              </span>
            </div>

            {/* Overview / Description */}
            {p.longDesc && (
              <div>
                <h2 className="text-lg font-bold text-white mb-3">Overview</h2>
                <p className="text-sm text-text-muted leading-relaxed">{p.longDesc}</p>
              </div>
            )}

            {/* Key Features / Specs table */}
            {p.keyFeatures && p.keyFeatures.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-3">Key Details</h2>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {p.keyFeatures.map((f) => (
                    <div key={f.label} className="glass-card rounded-lg p-3 flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                        <Info className="h-4 w-4 text-gold" />
                      </div>
                      <div>
                        <p className="text-[10px] text-text-dim uppercase tracking-wider">{f.label}</p>
                        <p className="text-sm font-medium text-white">{f.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Highlights */}
            {p.highlights && p.highlights.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-3">Highlights</h2>
                <div className="space-y-2">
                  {p.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2 rounded-lg bg-green-500/5 border border-green-500/20 px-4 py-2.5">
                      <Check className="h-4 w-4 shrink-0 text-green-400" />
                      <span className="text-sm font-medium text-green-400">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Inclusions / Exclusions */}
            <div className="grid gap-6 sm:grid-cols-2">
              {p.inclusions && (
                <div className="glass-card rounded-xl p-5">
                  <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" /> What&apos;s Included
                  </h2>
                  <ul className="space-y-2">
                    {p.inclusions.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-text-muted">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-400" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {p.exclusions && (
                <div className="glass-card rounded-xl p-5">
                  <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <X className="h-4 w-4 text-rose" /> Not Included
                  </h2>
                  <ul className="space-y-2">
                    {p.exclusions.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-text-muted">
                        <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Itinerary (for packages) */}
            {p.itinerary && p.itinerary.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-4">Day-wise Itinerary</h2>
                <div className="space-y-3">
                  {p.itinerary.map((day) => (
                    <div key={day.day} className="glass-card rounded-xl p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/10 text-sm font-bold text-gold">D{day.day}</div>
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

            {/* Meeting Point */}
            {p.meetingPoint && (
              <div className="glass-card rounded-xl p-5">
                <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-gold" /> Meeting Point
                </h2>
                <p className="text-sm text-text-muted">{p.meetingPoint}</p>
              </div>
            )}

            {/* What to Bring */}
            {p.whatToBring && (
              <div className="glass-card rounded-xl p-5">
                <h2 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4 text-gold" /> What to Bring
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {p.whatToBring.map((item) => (
                    <span key={item} className="rounded-full bg-surface border border-border-gold/30 px-3 py-1 text-xs text-text-muted">{item}</span>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ */}
            {p.faq && p.faq.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-gold" /> Frequently Asked Questions
                </h2>
                <div className="space-y-2">
                  {p.faq.map((item) => (
                    <details key={item.q} className="glass-card rounded-xl group">
                      <summary className="flex items-center justify-between px-5 py-4 text-sm font-medium text-white cursor-pointer list-none">
                        {item.q}
                        <ChevronDown className="h-4 w-4 text-gold shrink-0 transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="px-5 pb-4 border-t border-border-gold/20 pt-3">
                        <p className="text-sm text-text-muted leading-relaxed">{item.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Products */}
            {similarProducts.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-4">Similar Experiences</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {similarProducts.map((s) => (
                    <ProductCard
                      key={s.slug} slug={s.slug} type={s.type} name={s.name}
                      basePrice={s.basePrice} originalPrice={s.originalPrice}
                      priceUnit={s.priceUnit} duration={s.duration} location={s.location}
                      rating={s.rating} imageUrl={s.imageUrl} isSelfServe={s.isSelfServe}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column (1/3) — sticky pricing card */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              {/* Title + rating (desktop only) */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-md bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold uppercase tracking-wider">Yacht Charter</span>
                  {p.isFeatured && <span className="rounded-md bg-gold-gradient px-2 py-0.5 text-[10px] font-bold text-cosmic-950">Best Seller</span>}
                </div>
                <h1 className="font-display text-2xl font-bold text-white">{p.name}</h1>
                {p.rating && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="flex items-center gap-1 rounded bg-green-500/20 px-2 py-0.5 text-sm font-bold text-green-400">
                      <Star className="h-3.5 w-3.5 fill-green-400" /> {p.rating}
                    </span>
                    {p.reviewCount && <span className="text-xs text-text-muted">({p.reviewCount}+ reviews)</span>}
                  </div>
                )}
                <p className="mt-3 text-sm text-text-muted leading-relaxed">{p.shortDesc}</p>
              </div>

              {/* Pricing card */}
              <div className="glass-card rounded-2xl p-6">
                <div className="text-center mb-4">
                  <p className="text-xs text-text-muted">Price</p>
                  <div className="mt-1 flex items-baseline justify-center gap-2">
                    {p.originalPrice && (
                      <span className="text-base text-text-dim line-through">{formatINR(p.originalPrice)}</span>
                    )}
                    <span className="text-3xl font-bold text-white">{formatINR(p.basePrice)}</span>
                  </div>
                  <p className="text-xs text-text-dim mt-0.5">/ {p.priceUnit}</p>
                  {p.originalPrice && (
                    <span className="inline-block mt-1 rounded bg-green-500/20 px-2 py-0.5 text-[10px] font-bold text-green-400">
                      Save {formatINR(p.originalPrice - p.basePrice)} ({Math.round(((p.originalPrice - p.basePrice) / p.originalPrice) * 100)}% OFF)
                    </span>
                  )}
                </div>

                <div className="gold-divider my-4" />

                {/* Quick facts */}
                <div className="space-y-2.5 text-sm mb-5">
                  {p.duration && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-text-muted"><Clock className="h-3.5 w-3.5" /> Duration</span>
                      <span className="text-white font-medium">{p.duration.split("(")[0]?.trim()}</span>
                    </div>
                  )}
                  {p.capacity && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-text-muted"><Users className="h-3.5 w-3.5" /> Capacity</span>
                      <span className="text-white font-medium">{p.capacity}</span>
                    </div>
                  )}
                  {p.location && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-text-muted"><MapPin className="h-3.5 w-3.5" /> Location</span>
                      <span className="text-white font-medium text-right max-w-[50%] text-xs">{p.location}</span>
                    </div>
                  )}
                  {p.timing && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-text-muted"><Calendar className="h-3.5 w-3.5" /> Timing</span>
                      <span className="text-white font-medium text-xs">{p.timing.split("(")[0]?.trim()}</span>
                    </div>
                  )}
                </div>

                {/* CTA buttons */}
                <div className="space-y-3">
                  {isSelfServe ? (
                    <Link
                      href={`/checkout?product=${p.slug}&type=yacht`}
                      className="flex h-12 w-full items-center justify-center rounded-xl bg-gold-gradient text-sm font-bold text-cosmic-950 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Book Now — {formatINR(p.basePrice)}
                    </Link>
                  ) : (
                    <EnquiryButton productName={p.name} productSlug={p.slug} productType="yacht" productPrice={p.basePrice} variant="gold" label="Get Custom Quote" />
                  )}
                  <EnquiryButton productName={p.name} productSlug={p.slug} productType="yacht" productPrice={p.basePrice} label="WhatsApp Enquiry" />
                </div>

                {/* Trust line */}
                <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-text-dim">
                  <Shield className="h-3 w-3 text-gold" />
                  Secured by PayU · Free cancellation
                </div>
              </div>

              {/* Social proof */}
              <div className="glass-card rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs text-text-muted">
                  <Zap className="h-3.5 w-3.5 text-gold fill-gold" />
                  <span><strong className="text-white">12 people</strong> booked in the last 24 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile sticky bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border-gold bg-cosmic-950/95 backdrop-blur-lg p-4 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            {p.originalPrice && <p className="text-[10px] text-text-dim line-through">{formatINR(p.originalPrice)}</p>}
            <p className="text-lg font-bold text-white">{formatINR(p.basePrice)}<span className="text-xs text-text-dim font-normal ml-1">/{p.priceUnit}</span></p>
          </div>
          {isSelfServe ? (
            <Link href={`/checkout?product=${p.slug}&type=yacht`} className="flex h-11 items-center justify-center rounded-xl bg-gold-gradient px-6 text-sm font-bold text-cosmic-950">Book Now</Link>
          ) : (
            <EnquiryButton productName={p.name} productSlug={p.slug} productType="yacht" productPrice={p.basePrice} variant="outline" label="Get Quote" />
          )}
          <EnquiryButton productName={p.name} productSlug={p.slug} productType="yacht" productPrice={p.basePrice} variant="compact" />
        </div>
      </div>
    </div>
  );
}
