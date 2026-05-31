import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, MapPin, Star, Check, X, ArrowLeft } from "lucide-react";
import { activities } from "@/lib/data/products";
import { formatINR } from "@/lib/utils";
import { EnquiryButton } from "@/components/booking/EnquiryButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const activity = activities.find((a) => a.slug === slug);
  if (!activity) return { title: "Activity Not Found" };
  return { title: activity.name, description: activity.shortDesc };
}

export async function generateStaticParams() {
  return activities.map((a) => ({ slug: a.slug }));
}

export default async function ActivityDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const activity = activities.find((a) => a.slug === slug);
  if (!activity) notFound();

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <section className="relative bg-cosmic-scene py-16 md:py-24">
        <div className="bg-stars absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8">
          <Link href="/activities" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-gold transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" /> All Activities
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold mb-4">
                {activity.isFeatured && <Star className="h-3 w-3 fill-gold" />}
                Adventure Activity
              </div>
              <h1 className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">{activity.name}</h1>
              <p className="mt-4 text-lg text-text-muted max-w-2xl">{activity.shortDesc}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-text-muted">
                {activity.duration && <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-gold" /> {activity.duration}</span>}
                {activity.location && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-gold" /> {activity.location}</span>}
                {activity.rating && <span className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-gold text-gold" /> {activity.rating} / 5</span>}
              </div>
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="glass-card rounded-2xl p-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-text-muted">Price</p>
                  <p className="mt-1 text-3xl font-bold text-white">{formatINR(activity.basePrice)}</p>
                  <p className="text-sm text-text-dim">/ {activity.priceUnit}</p>
                </div>
                <div className="gold-divider my-4" />
                <div className="space-y-2 text-sm mb-6">
                  {activity.duration && <div className="flex justify-between"><span className="text-text-muted">Duration</span><span className="text-white font-medium">{activity.duration}</span></div>}
                  <div className="flex justify-between"><span className="text-text-muted">Booking</span><span className="text-white font-medium">Instant</span></div>
                </div>
                <div className="space-y-3">
                  <Link href={`/checkout?product=${activity.slug}&type=activity`} className="flex h-12 w-full items-center justify-center rounded-xl bg-gold-gradient text-sm font-bold text-cosmic-950 transition-transform hover:scale-[1.02] active:scale-[0.98]">
                    Book Now — {formatINR(activity.basePrice)}
                  </Link>
                  <EnquiryButton productName={activity.name} productSlug={activity.slug} productType="activity" productPrice={activity.basePrice} label="WhatsApp Enquiry" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:max-w-2xl">
          {activity.inclusions && (
            <div>
              <h2 className="font-display text-xl font-bold text-white mb-4"><Check className="inline h-5 w-5 text-green-400 mr-2" />Included</h2>
              <ul className="space-y-2">{activity.inclusions.map((i) => <li key={i} className="flex items-start gap-2 text-sm text-text-muted"><Check className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />{i}</li>)}</ul>
            </div>
          )}
          {activity.exclusions && (
            <div>
              <h2 className="font-display text-xl font-bold text-white mb-4"><X className="inline h-5 w-5 text-rose mr-2" />Not Included</h2>
              <ul className="space-y-2">{activity.exclusions.map((i) => <li key={i} className="flex items-start gap-2 text-sm text-text-muted"><X className="mt-0.5 h-4 w-4 shrink-0 text-rose" />{i}</li>)}</ul>
            </div>
          )}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border-gold bg-cosmic-950/95 backdrop-blur-lg p-4 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1"><p className="text-xs text-text-dim">Price</p><p className="text-lg font-bold text-white">{formatINR(activity.basePrice)}</p></div>
          <Link href={`/checkout?product=${activity.slug}&type=activity`} className="flex h-11 items-center justify-center rounded-xl bg-gold-gradient px-6 text-sm font-bold text-cosmic-950">Book Now</Link>
          <EnquiryButton productName={activity.name} productSlug={activity.slug} productType="activity" productPrice={activity.basePrice} variant="compact" />
        </div>
      </div>
    </div>
  );
}
