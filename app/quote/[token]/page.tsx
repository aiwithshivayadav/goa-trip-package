import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatINR, formatDate } from "@/lib/utils";
import { QuoteActions } from "./quote-actions";

export const dynamic = "force-dynamic";

interface QuotePageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: QuotePageProps): Promise<Metadata> {
  const { token } = await params;

  const quote = await db.quote.findUnique({
    where: { publicToken: token },
    select: { title: true, quoteCode: true, totalPrice: true },
  });

  const title = quote ? `${quote.title} — ${quote.quoteCode}` : "Quote Not Found";
  const description = quote
    ? `Your personalised Goa trip: ${quote.title}. View itinerary, pricing & book instantly.`
    : "View your personalised Goa trip itinerary and book with one click.";

  return {
    title,
    description,
    robots: { index: false, follow: false },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Goa Trip Package",
      images: [{ url: "/og-quote.jpg", width: 1200, height: 630, alt: "Goa Trip Package Quote" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/* ── Helpers ── */

interface ItineraryItem {
  id?: string;
  name?: string;
  price?: number;
  type?: string;
  imageUrl?: string;
  duration?: string;
  location?: string;
  shortDesc?: string;
}

interface ItineraryDay {
  day?: number;
  title?: string;
  items?: ItineraryItem[];
  activities?: string[] | { name?: string; time?: string; description?: string }[];
  description?: string;
  meals?: string[];
  accommodation?: string;
}

function parseItems(json: string): ItineraryDay[] {
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

/* ── Page ── */

export default async function QuotePage({ params }: QuotePageProps) {
  const { token } = await params;

  if (!token || token.length < 10) {
    notFound();
  }

  const quote = await db.quote.findUnique({
    where: { publicToken: token },
    include: { customer: true },
  });

  if (!quote) {
    return <QuoteNotFound />;
  }

  // Track view (fire and forget — don't block render)
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

  const totalPrice = toNumber(quote.totalPrice);
  const discountAmount = toNumber(quote.discountAmount);
  const gstAmount = toNumber(quote.gstAmount);
  const advancePercent = quote.advancePercent;
  const subtotal = totalPrice - gstAmount;
  const advanceAmount = Math.round((totalPrice * advancePercent) / 100);

  const validUntil = new Date(quote.validUntil);
  const daysLeft = daysUntil(validUntil);
  const isExpired = daysLeft < 0;
  const isNearExpiry = daysLeft >= 0 && daysLeft <= 3;

  const items = parseItems(quote.itemsJson);
  const customerName = quote.customer?.name || "Traveller";
  const firstName = customerName.split(" ")[0];

  const waMessage = `Hi, I have a question about my quote ${quote.quoteCode}`;
  const whatsappUrl = `https://wa.me/919890830249?text=${encodeURIComponent(waMessage)}`;

  return (
    <>
      {/* Print styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              .no-print, .no-print * { display: none !important; }
              body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .quote-page { padding: 0 !important; }
              .quote-card { box-shadow: none !important; border: 1px solid #e5e7eb !important; }
              .quote-header { background: #0B1D26 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          `,
        }}
      />

      <div className="quote-page min-h-screen bg-[#F7F6F3]">
        {/* Header bar */}
        <header className="quote-header bg-[#0B1D26] px-4 py-4">
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.svg"
                alt="Goa Trip Package"
                className="h-8 w-auto brightness-0 invert"
              />
            </div>
            <div className="text-right">
              <p className="text-xs font-medium tracking-wide text-white/60">
                QUOTE
              </p>
              <p className="font-mono text-sm font-semibold text-[#C68B3F]">
                {quote.quoteCode}
              </p>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-4 py-6 sm:py-10">
          {/* Status banners */}
          {isExpired && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-center">
              <p className="text-sm font-semibold text-red-700">This quote expired on {formatDate(validUntil)}</p>
              <p className="mt-1 text-xs text-red-500">
                Contact us on WhatsApp for a revised quote.
              </p>
            </div>
          )}

          {isNearExpiry && !isExpired && (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-center">
              <p className="text-sm font-semibold text-amber-700">
                {daysLeft === 0
                  ? "This quote expires today!"
                  : `This quote expires in ${daysLeft} day${daysLeft > 1 ? "s" : ""}`}
              </p>
            </div>
          )}

          {/* Main card */}
          <div className="quote-card overflow-hidden rounded-2xl bg-white shadow-[0_4px_24px_rgba(11,29,38,0.08)]">
            {/* Greeting + title */}
            <div className="border-b border-gray-100 px-6 py-6 sm:px-8">
              <p className="text-sm text-gray-500">
                Prepared for
              </p>
              <h1 className="mt-1 font-[family-name:var(--font-cormorant)] text-2xl font-bold text-[#0B1D26] sm:text-3xl">
                {firstName}, here&apos;s your Goa experience
              </h1>
              <h2 className="mt-2 text-lg font-semibold text-[#1A8E7D]">
                {quote.title}
              </h2>
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-400">
                <span>Created {formatDate(quote.createdAt)}</span>
                <span>
                  Valid until{" "}
                  <span className={isExpired ? "text-red-500 font-medium" : isNearExpiry ? "text-amber-600 font-medium" : ""}>
                    {formatDate(validUntil)}
                  </span>
                </span>
              </div>
            </div>

            {/* Itinerary */}
            {items.length > 0 && (
              <div className="border-b border-gray-100 px-6 py-6 sm:px-8">
                <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C68B3F]">
                  <ItineraryIcon />
                  Itinerary
                </h3>
                <div className="space-y-6">
                  {items.map((day, i) => (
                    <div key={i} className="relative pl-7">
                      {/* Timeline dot + line */}
                      <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-[#1A8E7D] bg-white" />
                      {i < items.length - 1 && (
                        <div className="absolute left-[7px] top-5 h-[calc(100%+4px)] w-0.5 bg-[#1A8E7D]/15" />
                      )}

                      <p className="text-sm font-bold text-[#0B1D26]">
                        {day.day ? `Day ${day.day}` : `Day ${i + 1}`}
                        {day.title ? ` — ${day.title}` : ""}
                      </p>

                      {day.description && (
                        <p className="mt-1 text-sm text-gray-500">{day.description}</p>
                      )}

                      {/* Product items with images */}
                      {day.items && day.items.length > 0 && (
                        <div className="mt-3 space-y-3">
                          {day.items.map((item, j) => (
                            <div key={j} className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                              {item.imageUrl && (
                                <div className="h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={item.imageUrl}
                                    alt={item.name || ""}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-[#0B1D26]">{item.name}</p>
                                {item.shortDesc && (
                                  <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{item.shortDesc}</p>
                                )}
                                <div className="mt-1 flex flex-wrap gap-2 text-[10px] text-gray-400">
                                  {item.duration && <span>{item.duration}</span>}
                                  {item.location && <span>{item.duration ? "·" : ""} {item.location}</span>}
                                  {item.type && (
                                    <span className="rounded bg-[#1A8E7D]/10 px-1.5 py-0.5 font-medium capitalize text-[#1A8E7D]">
                                      {item.type}
                                    </span>
                                  )}
                                </div>
                              </div>
                              {item.price !== undefined && item.price > 0 && (
                                <div className="flex-shrink-0 text-right">
                                  <p className="text-sm font-bold text-[#0B1D26]">{formatINR(item.price)}</p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Activities (legacy format) */}
                      {day.activities && day.activities.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {day.activities.map((activity, j) => {
                            const actText =
                              typeof activity === "string"
                                ? activity
                                : activity.name || activity.description || "";
                            const actTime =
                              typeof activity === "object" && activity.time
                                ? activity.time
                                : null;
                            return (
                              <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[#C68B3F]" />
                                <span>
                                  {actTime && (
                                    <span className="mr-1.5 font-medium text-gray-700">
                                      {actTime}
                                    </span>
                                  )}
                                  {actText}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      )}

                      {/* Meals */}
                      {day.meals && day.meals.length > 0 && (
                        <p className="mt-2 text-xs text-gray-400">
                          Meals: {day.meals.join(", ")}
                        </p>
                      )}

                      {/* Accommodation */}
                      {day.accommodation && (
                        <p className="mt-1 text-xs text-gray-400">
                          Stay: {day.accommodation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing */}
            <div className="border-b border-gray-100 px-6 py-6 sm:px-8">
              <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C68B3F]">
                <PricingIcon />
                Pricing
              </h3>
              <div className="space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-700">{formatINR(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      Discount
                      {quote.discountCode && (
                        <span className="ml-1.5 inline-block rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-600">
                          {quote.discountCode}
                        </span>
                      )}
                    </span>
                    <span className="font-medium text-emerald-600">
                      -{formatINR(discountAmount)}
                    </span>
                  </div>
                )}

                {gstAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">GST</span>
                    <span className="font-medium text-gray-700">{formatINR(gstAmount)}</span>
                  </div>
                )}

                <div className="section-divider" />

                <div className="flex justify-between pt-1">
                  <span className="text-base font-bold text-[#0B1D26]">Total</span>
                  <span className="text-xl font-bold text-[#0B1D26]">
                    {formatINR(totalPrice)}
                  </span>
                </div>

                {advancePercent > 0 && advancePercent < 100 && (
                  <div className="mt-3 rounded-lg bg-[#1A8E7D]/5 px-4 py-3">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-[#1A8E7D]">
                        Advance ({advancePercent}%)
                      </span>
                      <span className="font-bold text-[#1A8E7D]">
                        {formatINR(advanceAmount)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                      Balance of {formatINR(totalPrice - advanceAmount)} payable before travel
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Terms */}
            {quote.termsMarkdown && (
              <div className="border-b border-gray-100 px-6 py-6 sm:px-8">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C68B3F]">
                  <TermsIcon />
                  Terms & Conditions
                </h3>
                <div className="prose prose-sm max-w-none text-gray-500">
                  {quote.termsMarkdown.split("\n").map((line, i) => {
                    const trimmed = line.trim();
                    if (!trimmed) return <br key={i} />;
                    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                      return (
                        <p key={i} className="mb-1 flex items-start gap-2">
                          <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-gray-300" />
                          <span>{trimmed.slice(2)}</span>
                        </p>
                      );
                    }
                    if (trimmed.startsWith("# ")) {
                      return (
                        <p key={i} className="mb-1 mt-3 font-semibold text-gray-700">
                          {trimmed.slice(2)}
                        </p>
                      );
                    }
                    return <p key={i} className="mb-1">{trimmed}</p>;
                  })}
                </div>
              </div>
            )}

            {/* Why Book With Us */}
            <div className="border-b border-gray-100 px-6 py-6 sm:px-8">
              <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C68B3F]">
                <TrustIcon />
                Why Book With Us
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-2.5 rounded-lg bg-[#1A8E7D]/5 p-3">
                  <span className="mt-0.5 text-lg">&#9989;</span>
                  <div>
                    <p className="text-xs font-semibold text-[#0B1D26]">Verified Operator</p>
                    <p className="text-[10px] text-gray-500">Government registered & insured</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-lg bg-[#1A8E7D]/5 p-3">
                  <span className="mt-0.5 text-lg">&#128274;</span>
                  <div>
                    <p className="text-xs font-semibold text-[#0B1D26]">Secure Payments</p>
                    <p className="text-[10px] text-gray-500">PayU secured gateway</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-lg bg-[#1A8E7D]/5 p-3">
                  <span className="mt-0.5 text-lg">&#9733;</span>
                  <div>
                    <p className="text-xs font-semibold text-[#0B1D26]">500+ Happy Trips</p>
                    <p className="text-[10px] text-gray-500">Rated 4.8/5 by travellers</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-lg bg-[#1A8E7D]/5 p-3">
                  <span className="mt-0.5 text-lg">&#128222;</span>
                  <div>
                    <p className="text-xs font-semibold text-[#0B1D26]">24/7 Support</p>
                    <p className="text-[10px] text-gray-500">WhatsApp & phone support</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Countdown timer for near-expiry */}
            {isNearExpiry && !isExpired && (
              <div className="border-b border-gray-100 px-6 py-4 sm:px-8">
                <div className="flex items-center justify-center gap-2 rounded-lg bg-amber-50 px-4 py-3 text-center">
                  <span className="text-lg">&#9200;</span>
                  <p className="text-sm font-semibold text-amber-700">
                    {daysLeft === 0
                      ? "Offer expires today — book now to lock in this price!"
                      : `Only ${daysLeft} day${daysLeft > 1 ? "s" : ""} left — prices may change after expiry`}
                  </p>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div id="quote-actions" className="px-6 py-6 sm:px-8 no-print">
              <QuoteActions
                token={token}
                status={quote.status}
                isExpired={isExpired}
                advancePercent={advancePercent}
                advanceAmount={formatINR(advanceAmount)}
                whatsappUrl={whatsappUrl}
              />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-8 space-y-2 text-center text-xs text-gray-400">
            <p>
              Questions? Call{" "}
              <a href="tel:+919890830249" className="text-[#1A8E7D] underline underline-offset-2">
                +91 98908 30249
              </a>
              {" "}or{" "}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366] underline underline-offset-2"
              >
                WhatsApp us
              </a>
            </p>
            <p className="text-gray-300">
              Dream Tour Planner OPC Pvt Ltd &middot; Goa, India
            </p>
          </footer>
        </main>

        {/* Mobile sticky CTA */}
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 p-3 backdrop-blur-lg sm:hidden no-print">
          <div className="mx-auto flex max-w-2xl gap-2">
            {!isExpired && !["accepted", "declined", "converted", "expired"].includes(quote.status) && (
              <a
                href="#quote-actions"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#1A8E7D] py-3 text-sm font-bold text-white"
              >
                Accept Quote
              </a>
            )}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#25D366] text-[#25D366]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Not-found fallback ── */

function QuoteNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F6F3] px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <h1 className="font-[family-name:var(--font-cormorant)] text-2xl font-bold text-[#0B1D26]">
          Quote Not Found
        </h1>
        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
          This quote link may have expired or is no longer available.
          Please check the link or contact us for assistance.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="https://wa.me/919890830249?text=Hi%2C+I+have+a+question+about+a+quote"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#20bd5a]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp Us
          </a>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border-2 border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── Section heading icons (inline SVG) ── */

function ItineraryIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function PricingIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
    </svg>
  );
}

function TrustIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function TermsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
