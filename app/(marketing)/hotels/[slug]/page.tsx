import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Users, MapPin, Star, Check, X, ArrowLeft, Shield, Zap, Calendar, ChevronDown, HelpCircle, Info } from "lucide-react";
import { hotels } from "@/lib/data/products";
import { formatINR } from "@/lib/utils";
import { ImageGallery } from "@/components/marketing/ImageGallery";
import { EnquiryButton } from "@/components/booking/EnquiryButton";
import { ProductCard } from "@/components/marketing/ProductCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const p = hotels.find((h) => h.slug === slug);
  if (!p) return { title: "Hotel Not Found" };
  return { title: p.name, description: p.shortDesc };
}

export async function generateStaticParams() {
  return hotels.map((h) => ({ slug: h.slug }));
}

export default async function HotelDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const p = hotels.find((h) => h.slug === slug);
  if (!p) notFound();

  const galleryImages = p.images?.length ? p.images : (p.imageUrl ? [p.imageUrl] : []);
  const similarHotels = hotels.filter((h) => h.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 pt-4 md:px-8">
        <Link href="/hotels" className="inline-flex items-center gap-2 text-xs text-text-muted hover:text-gold transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> All Hotels
        </Link>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <ImageGallery images={galleryImages} alt={p.name} />

            <div className="lg:hidden">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-md bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold uppercase tracking-wider">Hotel</span>
                {p.isFeatured && <span className="rounded-md bg-gold-gradient px-2 py-0.5 text-[10px] font-bold text-cosmic-950">Top Pick</span>}
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

            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-1.5 rounded-lg bg-surface border border-border-gold/30 px-3 py-2 text-xs text-text-muted"><Shield className="h-3.5 w-3.5 text-green-400" /> Free Cancellation</span>
              <span className="flex items-center gap-1.5 rounded-lg bg-surface border border-border-gold/30 px-3 py-2 text-xs text-text-muted"><Zap className="h-3.5 w-3.5 text-gold" /> Best Rate Guaranteed</span>
              <span className="flex items-center gap-1.5 rounded-lg bg-surface border border-border-gold/30 px-3 py-2 text-xs text-text-muted"><Shield className="h-3.5 w-3.5 text-blue-400" /> Verified Property</span>
            </div>

            {p.longDesc && (
              <div>
                <h2 className="text-lg font-bold text-white mb-3">About This Hotel</h2>
                <p className="text-sm text-text-muted leading-relaxed">{p.longDesc}</p>
              </div>
            )}

            {p.keyFeatures && p.keyFeatures.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-3">Property Details</h2>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {p.keyFeatures.map((f) => (
                    <div key={f.label} className="glass-card rounded-lg p-3 flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/10"><Info className="h-4 w-4 text-gold" /></div>
                      <div>
                        <p className="text-[10px] text-text-dim uppercase tracking-wider">{f.label}</p>
                        <p className="text-sm font-medium text-white">{f.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

            {p.inclusions && (
              <div className="glass-card rounded-xl p-5">
                <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Check className="h-4 w-4 text-green-400" /> Amenities & Facilities</h2>
                <div className="grid gap-2 sm:grid-cols-2">
                  {p.inclusions.map((item) => (
                    <span key={item} className="flex items-center gap-2 text-xs text-text-muted"><Check className="h-3.5 w-3.5 shrink-0 text-green-400" />{item}</span>
                  ))}
                </div>
              </div>
            )}

            {p.faq && p.faq.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><HelpCircle className="h-5 w-5 text-gold" /> FAQs</h2>
                <div className="space-y-2">
                  {p.faq.map((item) => (
                    <details key={item.q} className="glass-card rounded-xl group">
                      <summary className="flex items-center justify-between px-5 py-4 text-sm font-medium text-white cursor-pointer list-none">{item.q}<ChevronDown className="h-4 w-4 text-gold shrink-0 transition-transform group-open:rotate-180" /></summary>
                      <div className="px-5 pb-4 border-t border-border-gold/20 pt-3"><p className="text-sm text-text-muted leading-relaxed">{item.a}</p></div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {similarHotels.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white mb-4">Similar Hotels</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {similarHotels.map((s) => (
                    <ProductCard key={s.slug} slug={s.slug} type={s.type} name={s.name} basePrice={s.basePrice} priceUnit={s.priceUnit} location={s.location} rating={s.rating} imageUrl={s.imageUrl} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky pricing card */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-md bg-gold/15 px-2 py-0.5 text-[10px] font-bold text-gold uppercase tracking-wider">Hotel</span>
                  {p.isFeatured && <span className="rounded-md bg-gold-gradient px-2 py-0.5 text-[10px] font-bold text-cosmic-950">Top Pick</span>}
                </div>
                <h1 className="font-display text-2xl font-bold text-white">{p.name}</h1>
                {p.rating && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="flex items-center gap-1 rounded bg-green-500/20 px-2 py-0.5 text-sm font-bold text-green-400"><Star className="h-3.5 w-3.5 fill-green-400" /> {p.rating}</span>
                    {p.reviewCount && <span className="text-xs text-text-muted">({p.reviewCount}+ reviews)</span>}
                  </div>
                )}
                {p.location && <p className="mt-2 text-sm text-text-muted flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-gold" /> {p.location}</p>}
                <p className="mt-2 text-sm text-text-muted">{p.shortDesc}</p>
              </div>

              <div className="glass-card rounded-2xl p-6">
                <div className="text-center mb-4">
                  <p className="text-xs text-text-muted">Starting from</p>
                  <span className="text-3xl font-bold text-white">{formatINR(p.basePrice)}</span>
                  <p className="text-xs text-text-dim mt-0.5">/ {p.priceUnit}</p>
                </div>
                <div className="gold-divider my-4" />
                <div className="space-y-3">
                  <EnquiryButton productName={p.name} productSlug={p.slug} productType="hotel" productPrice={p.basePrice} variant="gold" label="Check Availability" />
                  <EnquiryButton productName={p.name} productSlug={p.slug} productType="hotel" productPrice={p.basePrice} label="WhatsApp Enquiry" />
                </div>
                <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-text-dim"><Shield className="h-3 w-3 text-gold" /> Best rate guaranteed · Free cancellation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border-gold bg-cosmic-950/95 backdrop-blur-lg p-4 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-lg font-bold text-white">{formatINR(p.basePrice)}<span className="text-xs text-text-dim font-normal ml-1">/{p.priceUnit}</span></p>
          </div>
          <EnquiryButton productName={p.name} productSlug={p.slug} productType="hotel" productPrice={p.basePrice} variant="outline" label="Check Availability" />
          <EnquiryButton productName={p.name} productSlug={p.slug} productType="hotel" productPrice={p.basePrice} variant="compact" />
        </div>
      </div>
    </div>
  );
}
