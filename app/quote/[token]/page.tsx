import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatINR, formatDate } from "@/lib/utils";
import { QuoteActions } from "./quote-actions";

export const dynamic = "force-dynamic";

interface QuotePageProps {
  params: Promise<{ token: string }>;
}

/* ── Types ── */

interface QuoteItem {
  id?: string;
  name: string;
  price?: number;
  type?: string;
  imageUrl?: string;
  duration?: string;
  location?: string;
  shortDesc?: string;
}

interface QuoteDay {
  day?: number;
  title?: string;
  description?: string;
  items?: QuoteItem[];
  activities?: (string | { name?: string; time?: string; description?: string })[];
  meals?: string[];
  accommodation?: string;
}

interface ProductInfo {
  imageUrl: string | null;
  shortDesc: string | null;
  duration: string | null;
  location: string | null;
  rating: number | null;
}

/* ── Helpers ── */

function parseDays(json: string): QuoteDay[] {
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}

function daysUntil(date: Date): number {
  const now = new Date();
  return Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function toNumber(val: unknown): number {
  if (typeof val === "number") return val;
  if (typeof val === "string") return parseFloat(val) || 0;
  if (val && typeof val === "object" && "toNumber" in val) {
    return (val as { toNumber(): number }).toNumber();
  }
  return Number(val) || 0;
}

const typeGradients: Record<string, { from: string; to: string }> = {
  cruise:   { from: "#1A8E7D", to: "#0E6B5E" },
  yacht:    { from: "#0E7490", to: "#155E75" },
  activity: { from: "#059669", to: "#047857" },
  hotel:    { from: "#B45309", to: "#92400E" },
  package:  { from: "#7C3AED", to: "#6D28D9" },
  party:    { from: "#DB2777", to: "#BE185D" },
};

/* ══════════════════════════════════════════════════════════════════
   OG Metadata
   ══════════════════════════════════════════════════════════════════ */

export async function generateMetadata({ params }: QuotePageProps): Promise<Metadata> {
  const { token } = await params;

  const quote = await db.quote.findUnique({
    where: { publicToken: token },
    select: { title: true, quoteCode: true, totalPrice: true, itemsJson: true },
  });

  if (!quote) {
    return { title: "Quote Not Found", robots: { index: false, follow: false } };
  }

  const totalPrice = toNumber(quote.totalPrice);
  const days = parseDays(quote.itemsJson);
  const allItemNames = days.flatMap((d) => (d.items || []).map((i) => i.name));
  const itemCount =
    allItemNames.length ||
    days.reduce((sum, d) => sum + (d.activities?.length || 0), 0);
  const dayCount = days.length;

  let ogImage: string | undefined;
  if (allItemNames.length > 0) {
    const hit = await db.product.findFirst({
      where: { name: { in: allItemNames }, imageUrl: { not: null } },
      select: { imageUrl: true },
    });
    ogImage = hit?.imageUrl ?? undefined;
  }

  const description =
    itemCount > 0
      ? `${formatINR(totalPrice)} for ${itemCount} experience${itemCount !== 1 ? "s" : ""} across ${dayCount} day${dayCount !== 1 ? "s" : ""} in Goa`
      : `Your personalised Goa trip itinerary — ${formatINR(totalPrice)}`;

  return {
    title: `${quote.title} — Goa Trip Package`,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title: `${quote.title} — Goa Trip Package`,
      description,
      type: "website",
      siteName: "Goa Trip Package",
      ...(ogImage
        ? { images: [{ url: ogImage, width: 1200, height: 630, alt: quote.title }] }
        : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: `${quote.title} — Goa Trip Package`,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

/* ══════════════════════════════════════════════════════════════════
   Page
   ══════════════════════════════════════════════════════════════════ */

export default async function QuotePage({ params }: QuotePageProps) {
  const { token } = await params;
  if (!token || token.length < 10) notFound();

  const quote = await db.quote.findUnique({
    where: { publicToken: token },
    include: { customer: true },
  });
  if (!quote) return <QuoteNotFound />;

  // Track view (fire-and-forget)
  db.quote
    .update({
      where: { id: quote.id },
      data: {
        viewedCount: { increment: 1 },
        viewedFirstAt: quote.viewedFirstAt || new Date(),
        viewedLastAt: new Date(),
        status: quote.status === "sent" ? "viewed" : quote.status,
      },
    })
    .catch((err) => console.error("[Quote View] tracking error:", err));

  // ── Parse itinerary + look up product details from DB ──
  const days = parseDays(quote.itemsJson);
  const allItems = days.flatMap((d) => d.items || []);
  const uniqueNames = [...new Set(allItems.map((i) => i.name))];

  const products =
    uniqueNames.length > 0
      ? await db.product.findMany({
          where: { name: { in: uniqueNames } },
          select: { name: true, imageUrl: true, shortDesc: true, duration: true, location: true, rating: true },
        })
      : [];

  const productMap = new Map<string, ProductInfo>(
    products.map((p) => [
      p.name,
      {
        imageUrl: p.imageUrl,
        shortDesc: p.shortDesc,
        duration: p.duration,
        location: p.location,
        rating: p.rating ? toNumber(p.rating) : null,
      },
    ]),
  );

  // ── Pricing ──
  const totalPrice = toNumber(quote.totalPrice);
  const discountAmount = toNumber(quote.discountAmount);
  const gstAmount = toNumber(quote.gstAmount);
  const advancePercent = quote.advancePercent;
  const subtotal = totalPrice - gstAmount;
  const advanceAmount = Math.round((totalPrice * advancePercent) / 100);

  // ── Validity ──
  const validUntil = new Date(quote.validUntil);
  const daysLeft = daysUntil(validUntil);
  const isExpired = daysLeft < 0;
  const isNearExpiry = daysLeft >= 0 && daysLeft <= 3;

  const createdDate = new Date(quote.createdAt);
  const totalValidDays = Math.max(
    1,
    Math.ceil((validUntil.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)),
  );
  const validityProgress = isExpired
    ? 100
    : Math.min(100, Math.max(0, ((totalValidDays - daysLeft) / totalValidDays) * 100));

  // ── Customer ──
  const customerName = quote.customer?.name || "Traveller";
  const firstName = customerName.split(" ")[0];
  const totalItemCount = allItems.length || days.reduce((sum, d) => sum + (d.activities?.length || 0), 0);

  const waMessage = `Hi, I have a question about my quote ${quote.quoteCode}`;
  const whatsappUrl = `https://wa.me/919890830249?text=${encodeURIComponent(waMessage)}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print, .no-print * { display: none !important; }
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .quote-page { padding: 0 !important; }
          .quote-card { box-shadow: none !important; border: 1px solid #e5e7eb !important; }
          .quote-header { background: #0B1D26 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .product-card img { max-height: 100px !important; }
        }
      `}} />

      <div className="quote-page min-h-screen bg-[#FBFAF8]">
        {/* ─── Header ─── */}
        <header className="quote-header relative overflow-hidden bg-[#0B1D26] px-4 py-5 sm:py-6">
          <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'40\' viewBox=\'0 0 200 40\'%3E%3Cpath d=\'M0 30 Q25 10 50 30 Q75 50 100 30 Q125 10 150 30 Q175 50 200 30\' fill=\'none\' stroke=\'%231A8E7D\' stroke-width=\'1\'/%3E%3C/svg%3E")',
            backgroundSize: "200px 40px",
          }} />
          <div className="relative mx-auto flex max-w-2xl items-center justify-between">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.svg" alt="Goa Trip Package" className="h-8 w-auto brightness-0 invert" />
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Quote</p>
              <p className="font-mono text-sm font-bold text-[#C68B3F]">{quote.quoteCode}</p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
          {/* ─── Expired banner ─── */}
          {isExpired && (
            <div className="mb-5 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-red-700">This quote expired on {formatDate(validUntil)}</p>
                <p className="mt-0.5 text-xs text-red-500">Contact us on WhatsApp for a revised quote.</p>
              </div>
            </div>
          )}

          {/* ═══════════════════ Main card ═══════════════════ */}
          <div className="quote-card overflow-hidden rounded-2xl bg-white shadow-[0_2px_40px_rgba(11,29,38,0.06)]">
            {/* ── Greeting ── */}
            <div className="px-6 py-7 sm:px-8">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-[#1A8E7D]">Prepared for {customerName}</p>
              <h1 className="mt-2 font-[family-name:var(--font-cormorant)] text-2xl font-bold leading-tight text-[#0B1D26] sm:text-3xl">
                {firstName}, here&apos;s your Goa experience
              </h1>
              <h2 className="mt-2 text-lg font-semibold text-[#0B1D26]/70">{quote.title}</h2>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <StatPill icon={<SvgCalendar />} label={`${days.length} Day${days.length !== 1 ? "s" : ""}`} />
                {totalItemCount > 0 && <StatPill icon={<SvgCompass />} label={`${totalItemCount} Experience${totalItemCount !== 1 ? "s" : ""}`} />}
                <StatPill
                  icon={<SvgClock />}
                  label={`Valid till ${formatDate(validUntil)}`}
                  variant={isExpired ? "expired" : isNearExpiry ? "urgent" : "default"}
                />
              </div>
            </div>

            <GradientLine />

            {/* ── Itinerary ── */}
            {days.length > 0 && (
              <>
                <div className="px-6 py-7 sm:px-8">
                  <Heading icon={<SvgCalendar />} text="Your Itinerary" />

                  <div className="mt-6 space-y-8">
                    {days.map((day, i) => {
                      const dayNum = day.day || i + 1;
                      return (
                        <div key={i}>
                          <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1A8E7D] text-xs font-bold text-white shadow-sm shadow-[#1A8E7D]/20">{dayNum}</div>
                            <div>
                              <p className="text-sm font-bold text-[#0B1D26]">Day {dayNum}</p>
                              {day.title && <p className="text-xs text-[#0B1D26]/50">{day.title}</p>}
                            </div>
                          </div>

                          {day.description && <p className="mb-4 pl-12 text-sm text-gray-500">{day.description}</p>}

                          {/* Product cards */}
                          {day.items && day.items.length > 0 && (
                            <div className="space-y-3 pl-3 sm:pl-12">
                              {day.items.map((item, j) => {
                                const product = productMap.get(item.name);
                                const imageUrl = item.imageUrl || product?.imageUrl || null;
                                const shortDesc = item.shortDesc || product?.shortDesc || null;
                                const duration = item.duration || product?.duration || null;
                                const location = item.location || product?.location || null;
                                const itemType = item.type || "package";
                                const gradient = typeGradients[itemType] ?? { from: "#7C3AED", to: "#6D28D9" };

                                return (
                                  <div key={item.id || j} className="product-card overflow-hidden rounded-xl border border-gray-100 bg-[#FBFAF8] transition-shadow hover:shadow-md">
                                    <div className="flex flex-col sm:flex-row">
                                      <div className="relative h-40 w-full flex-shrink-0 overflow-hidden sm:h-auto sm:w-32">
                                        {imageUrl ? (
                                          /* eslint-disable-next-line @next/next/no-img-element */
                                          <img src={imageUrl} alt={item.name} className="h-full w-full object-cover" />
                                        ) : (
                                          <div className="flex h-full min-h-[80px] w-full items-center justify-center" style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}>
                                            <TypeIcon type={itemType} />
                                          </div>
                                        )}
                                        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#0B1D26]/60 backdrop-blur-sm">{itemType}</span>
                                      </div>
                                      <div className="flex flex-1 flex-col justify-between p-4">
                                        <div>
                                          <h4 className="text-sm font-bold leading-snug text-[#0B1D26]">{item.name}</h4>
                                          {(duration || location) && (
                                            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                                              {duration && <span className="flex items-center gap-1"><SvgClockSm />{duration}</span>}
                                              {location && <span className="flex items-center gap-1"><SvgPin />{location}</span>}
                                            </div>
                                          )}
                                          {shortDesc && <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500">{shortDesc}</p>}
                                        </div>
                                        {item.price != null && (
                                          <p className="mt-3 text-base font-bold text-[#C68B3F]">
                                            {formatINR(item.price)}
                                            <span className="ml-1 text-[10px] font-normal text-gray-400">per person</span>
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Legacy activities */}
                          {day.activities && day.activities.length > 0 && (
                            <ul className="space-y-1.5 pl-12">
                              {day.activities.map((activity, j) => {
                                const actText = typeof activity === "string" ? activity : activity.name || activity.description || "";
                                const actTime = typeof activity === "object" && activity.time ? activity.time : null;
                                return (
                                  <li key={j} className="flex items-start gap-2.5 text-sm text-gray-600">
                                    <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#C68B3F]" />
                                    <span>{actTime && <span className="mr-1.5 font-semibold text-[#0B1D26]">{actTime}</span>}{actText}</span>
                                  </li>
                                );
                              })}
                            </ul>
                          )}

                          {day.meals && day.meals.length > 0 && (
                            <p className="mt-3 pl-12 text-xs text-gray-400"><span className="font-medium text-gray-500">Meals:</span> {day.meals.join(", ")}</p>
                          )}
                          {day.accommodation && (
                            <p className="mt-1 pl-12 text-xs text-gray-400"><span className="font-medium text-gray-500">Stay:</span> {day.accommodation}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <GradientLine />
              </>
            )}

            {/* ── Pricing ── */}
            <div className="px-6 py-7 sm:px-8">
              <Heading icon={<SvgDollar />} text="Pricing" />
              <div className="mt-4 space-y-3">
                <Row label="Subtotal" value={formatINR(subtotal)} />
                {discountAmount > 0 && (
                  <Row
                    label={<>Discount{quote.discountCode && <span className="ml-1.5 inline-block rounded-md bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-600">{quote.discountCode}</span>}</>}
                    value={`-${formatINR(discountAmount)}`}
                    valueClass="text-emerald-600"
                  />
                )}
                {gstAmount > 0 && <Row label="GST" value={formatINR(gstAmount)} />}
                <div className="section-divider" />
                <div className="flex items-baseline justify-between pt-1">
                  <span className="text-base font-bold text-[#0B1D26]">Total</span>
                  <span className="text-2xl font-bold text-[#0B1D26]">{formatINR(totalPrice)}</span>
                </div>
                {advancePercent > 0 && advancePercent < 100 && (
                  <div className="mt-4 overflow-hidden rounded-xl border border-[#1A8E7D]/15 bg-gradient-to-r from-[#1A8E7D]/[0.04] to-[#1A8E7D]/[0.08]">
                    <div className="px-4 py-3.5">
                      <div className="flex justify-between">
                        <span className="text-sm font-semibold text-[#1A8E7D]">Pay now ({advancePercent}%)</span>
                        <span className="text-lg font-bold text-[#1A8E7D]">{formatINR(advanceAmount)}</span>
                      </div>
                      <p className="mt-1 text-xs text-[#0B1D26]/40">Balance of {formatINR(totalPrice - advanceAmount)} payable before travel</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <GradientLine />

            {/* ── Validity countdown ── */}
            {!isExpired && (
              <>
                <div className="px-6 py-5 sm:px-8">
                  <div className={`overflow-hidden rounded-xl border ${isNearExpiry ? "border-amber-200 bg-amber-50/50" : "border-[#1A8E7D]/10 bg-[#1A8E7D]/[0.03]"}`}>
                    <div className="px-4 py-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isNearExpiry ? "bg-amber-100" : "bg-[#1A8E7D]/10"}`}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={isNearExpiry ? "#B45309" : "#1A8E7D"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${isNearExpiry ? "text-amber-700" : "text-[#0B1D26]"}`}>
                              {daysLeft === 0 ? "Expires today!" : `Valid for ${daysLeft} more day${daysLeft !== 1 ? "s" : ""}`}
                            </p>
                            <p className="text-[10px] text-gray-400">Quote valid until {formatDate(validUntil)}</p>
                          </div>
                        </div>
                        {isNearExpiry && <span className="flex-shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">Expiring soon</span>}
                      </div>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className={`h-full rounded-full ${isNearExpiry ? "bg-gradient-to-r from-amber-400 to-amber-500" : "bg-gradient-to-r from-[#1A8E7D] to-[#1A8E7D]/70"}`}
                          style={{ width: `${validityProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <GradientLine />
              </>
            )}

            {/* ── Trust badges ── */}
            <div className="px-6 py-5 sm:px-8 no-print">
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <Badge icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="#1A8E7D" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>} text="500+ Happy Travellers" />
                <Badge icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1A8E7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>} text="Goa's Trusted Tour Partner" />
                <Badge icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1A8E7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 102.13-9.36L1 10" /></svg>} text="Free Cancellation 48h" />
                <Badge icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1A8E7D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>} text="24/7 WhatsApp Support" />
              </div>
            </div>

            {/* ── Why Book With Us ── */}
            <div className="px-6 py-5 sm:px-8 no-print">
              <Heading icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.42 4.58a5.4 5.4 0 00-7.65 0l-.77.78-.77-.78a5.4 5.4 0 00-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" /></svg>} text="Why Book With Us" />
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <WhyCard
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A8E7D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><path d="M15 10.5a2.5 2.5 0 00-2.5-2.5H11a2.5 2.5 0 000 5h2a2.5 2.5 0 010 5h-1.5a2.5 2.5 0 01-2.5-2.5" /></svg>}
                  title="Best Price Guarantee"
                  desc="We match any lower price you find for the same experience"
                />
                <WhyCard
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A8E7D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>}
                  title="Handpicked Experiences"
                  desc="Every activity personally verified by our team in Goa"
                />
                <WhyCard
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A8E7D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
                  title="Hassle-Free Travel"
                  desc="Pickup, drop, and everything in between — we handle it all"
                />
              </div>
            </div>

            <GradientLine />

            {/* ── Terms ── */}
            {quote.termsMarkdown && (
              <>
                <div className="px-6 py-6 sm:px-8">
                  <Heading icon={<SvgDoc />} text="Terms & Conditions" />
                  <div className="mt-3 text-[13px] leading-relaxed text-gray-400">
                    {quote.termsMarkdown.split("\n").map((line, i) => {
                      const t = line.trim();
                      if (!t) return <br key={i} />;
                      if (t.startsWith("- ") || t.startsWith("* ")) return <p key={i} className="mb-1.5 flex items-start gap-2"><span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-300" /><span>{t.slice(2)}</span></p>;
                      if (t.startsWith("# ")) return <p key={i} className="mb-1 mt-3 font-semibold text-gray-600">{t.slice(2)}</p>;
                      return <p key={i} className="mb-1">{t}</p>;
                    })}
                  </div>
                </div>
                <GradientLine />
              </>
            )}

            {/* ── Action buttons ── */}
            <div id="quote-actions" className="px-6 py-7 sm:px-8 no-print">
              <QuoteActions token={token} status={quote.status} isExpired={isExpired} advancePercent={advancePercent} advanceAmount={formatINR(advanceAmount)} whatsappUrl={whatsappUrl} />
            </div>
          </div>

          {/* ── Footer ── */}
          <footer className="mt-10 space-y-3 pb-24 text-center sm:pb-10">
            <p className="text-xs text-gray-400">
              Questions? Call <a href="tel:+919890830249" className="font-medium text-[#1A8E7D] underline underline-offset-2 hover:text-[#157A6C]">+91 98908 30249</a> or{" "}
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-[#25D366] underline underline-offset-2 hover:text-[#20bd5a]">WhatsApp us</a>
            </p>
            <p className="text-[11px] text-gray-300">Dream Tour Planner OPC Pvt Ltd &middot; Goa, India</p>
          </footer>
        </main>

        {/* ─── Mobile sticky CTA ─── */}
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-100 bg-white/95 px-3 pb-[env(safe-area-inset-bottom,0px)] pt-3 backdrop-blur-xl sm:hidden no-print">
          <div className="mx-auto flex max-w-2xl items-center gap-2">
            {!isExpired && !["accepted", "declined", "converted", "expired"].includes(quote.status) ? (
              <>
                <a href="#quote-actions" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1A8E7D] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#1A8E7D]/20">Accept &amp; Book</a>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex h-[50px] w-[50px] items-center justify-center rounded-xl border-2 border-[#25D366] text-[#25D366]" aria-label="WhatsApp us"><WaIcon /></a>
              </>
            ) : (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3.5 text-sm font-bold text-white"><WaIcon /> Chat With Us</a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Not-found fallback
   ══════════════════════════════════════════════════════════════════ */

function QuoteNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FBFAF8] px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        </div>
        <h1 className="font-[family-name:var(--font-cormorant)] text-2xl font-bold text-[#0B1D26]">Quote Not Found</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-500">This quote link may have expired or is no longer available. Please check the link or contact us for assistance.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a href="https://wa.me/919890830249?text=Hi%2C+I+have+a+question+about+a+quote" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#20bd5a]"><WaIcon />WhatsApp Us</a>
          <a href="/" className="inline-flex items-center justify-center rounded-xl border-2 border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50">Go Home</a>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Layout primitives
   ══════════════════════════════════════════════════════════════════ */

function GradientLine() {
  return <div className="mx-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent sm:mx-8" />;
}
function Heading({ icon, text }: { icon: React.ReactNode; text: string }) {
  return <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#C68B3F]">{icon}{text}</h3>;
}
function StatPill({ icon, label, variant = "default" }: { icon: React.ReactNode; label: string; variant?: "default" | "urgent" | "expired" }) {
  const c = { default: "border-gray-100 bg-gray-50/60 text-gray-500", urgent: "border-amber-200 bg-amber-50 text-amber-700", expired: "border-red-200 bg-red-50 text-red-600" };
  return <div className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium ${c[variant]}`}>{icon}{label}</div>;
}
function Row({ label, value, valueClass }: { label: React.ReactNode; value: string; valueClass?: string }) {
  return <div className="flex justify-between text-sm"><span className="text-gray-500">{label}</span><span className={`font-medium ${valueClass || "text-gray-700"}`}>{value}</span></div>;
}
function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-xl border border-gray-100 bg-gray-50/50 px-3 py-3 text-center">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1A8E7D]/10">{icon}</div>
      <p className="text-[10px] font-semibold leading-tight text-[#0B1D26]/60">{text}</p>
    </div>
  );
}
function WhyCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/50 px-4 py-4">
      <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-lg bg-[#1A8E7D]/10">{icon}</div>
      <p className="text-sm font-bold text-[#0B1D26]">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-gray-400">{desc}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SVG helpers
   ══════════════════════════════════════════════════════════════════ */

const S = { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function SvgCalendar() { return <svg {...S}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>; }
function SvgCompass() { return <svg {...S}><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" stroke="none" /></svg>; }
function SvgClock() { return <svg {...S}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>; }
function SvgDollar() { return <svg {...S}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>; }
function SvgDoc() { return <svg {...S}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>; }
function SvgClockSm() { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>; }
function SvgPin() { return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>; }
function WaIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>; }

function TypeIcon({ type }: { type: string }) {
  const s = { width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "rgba(255,255,255,0.6)", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (type) {
    case "cruise": return <svg {...s}><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /><path d="M19.38 20A11.6 11.6 0 0021 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76" /><path d="M19 13V7a2 2 0 00-2-2H7a2 2 0 00-2 2v6" /><line x1="12" y1="1" x2="12" y2="5" /></svg>;
    case "yacht": return <svg {...s}><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /><path d="M9.8 20A11.3 11.3 0 013 14l3-2 6-10 6 10 3 2c-.5 2.5-2 5-4.8 6" /></svg>;
    case "activity": return <svg {...s}><circle cx="12" cy="5" r="3" /><line x1="12" y1="22" x2="12" y2="8" /><path d="M5 12H2a10 10 0 0020 0h-3" /></svg>;
    case "hotel": return <svg {...s}><path d="M18 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2z" /><path d="M9 22v-4h6v4" /><line x1="8" y1="6" x2="8" y2="6" /><line x1="16" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="8" y2="10" /><line x1="16" y1="10" x2="16" y2="10" /></svg>;
    case "party": return <svg {...s}><path d="M5.8 11.3L2 22l10.7-3.79" /><path d="M4 3h.01" /><path d="M22 8h.01" /><path d="M15 2h.01" /><path d="M22 20h.01" /></svg>;
    default: return <svg {...s}><line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>;
  }
}
