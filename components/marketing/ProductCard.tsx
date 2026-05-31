import Image from "next/image";
import Link from "next/link";
import { Clock, Users, MapPin, Star, Check, Zap } from "lucide-react";
import { cn, formatINR } from "@/lib/utils";

interface ProductCardProps {
  slug: string;
  type: "package" | "cruise" | "yacht" | "activity" | "hotel" | "party";
  name: string;
  shortDesc?: string;
  imageUrl?: string;
  basePrice: number;
  originalPrice?: number; // For strikethrough was/now
  priceUnit?: string;
  duration?: string;
  capacity?: string;
  location?: string;
  rating?: number;
  isFeatured?: boolean;
  isSelfServe?: boolean;
  inclusions?: string[];
  highlights?: string[]; // Green highlighted special experiences
  bookingsToday?: number; // Social proof: "X booked today"
  className?: string;
}

const typeRouteMap: Record<string, string> = {
  package: "/packages",
  cruise: "/cruises",
  yacht: "/yachts",
  activity: "/activities",
  hotel: "/hotels",
  party: "/parties",
};

const typeLabels: Record<string, string> = {
  package: "Tour Package",
  cruise: "Cruise",
  yacht: "Yacht",
  activity: "Activity",
  hotel: "Hotel",
  party: "Party",
};

/**
 * ProductCard v2 — Inspired by MakeMyTrip card density + EaseMyTrip trust cues
 * Shows: image, duration badge, title, inclusions preview, green highlights,
 * was/now pricing, EMI mention, "Book @ ₹X" low anchor, social proof
 */
export function ProductCard({
  slug,
  type,
  name,
  shortDesc,
  imageUrl,
  basePrice,
  originalPrice,
  priceUnit = "per person",
  duration,
  capacity,
  location,
  rating,
  isFeatured = false,
  isSelfServe = false,
  inclusions,
  highlights,
  bookingsToday,
  className,
}: ProductCardProps) {
  const href = `${typeRouteMap[type] || "/packages"}/${slug}`;
  const discount = originalPrice
    ? Math.round(((originalPrice - basePrice) / originalPrice) * 100)
    : null;
  const emiAmount = basePrice > 3000 ? Math.round(basePrice / 3) : null;
  const bookDeposit = basePrice > 2000 ? Math.min(2000, Math.round(basePrice * 0.25)) : null;

  // Simulated social proof (will come from DB later)
  const bookedCount = bookingsToday || (isFeatured ? Math.floor(Math.random() * 15) + 8 : 0);

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border-gold/50 bg-cosmic-900/80 transition-all duration-300",
        "hover:border-gold/60 hover:shadow-gold hover:-translate-y-1",
        className
      )}
    >
      {/* Image section */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-cosmic-800">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-cosmic-800 via-cosmic-900 to-gold-800/20" />
        )}

        {/* Gradient overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-cosmic-950/70 via-transparent to-transparent" />

        {/* Top-left badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {isFeatured && (
            <span className="rounded-md bg-gold-gradient px-2.5 py-1 text-[10px] font-bold text-cosmic-950 uppercase tracking-wider">
              Best Seller
            </span>
          )}
          {discount && (
            <span className="rounded-md bg-green-500/90 px-2.5 py-1 text-[10px] font-bold text-white">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Duration badge (top-right, MMT-style pill) */}
        {duration && (
          <span className="absolute right-3 top-3 rounded-md border border-white/30 bg-cosmic-950/70 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-white">
            {duration.split("(")[0]?.trim()}
          </span>
        )}

        {/* Bottom-left: social proof */}
        {bookedCount > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-cosmic-950/80 backdrop-blur-sm px-2.5 py-1">
            <Zap className="h-3 w-3 text-gold fill-gold" />
            <span className="text-[10px] font-medium text-white">{bookedCount} booked today</span>
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="flex flex-1 flex-col p-4">
        {/* Type label + rating */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-gold/70">
            {typeLabels[type]}
          </span>
          {rating && (
            <span className="flex items-center gap-1 rounded bg-green-500/20 px-1.5 py-0.5 text-[11px] font-bold text-green-400">
              <Star className="h-3 w-3 fill-green-400" /> {rating}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-bold text-white leading-snug line-clamp-2 group-hover:text-gold transition-colors">
          {name}
        </h3>

        {/* Location + meta */}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-dim">
          {location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {location}
            </span>
          )}
          {capacity && (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" /> {capacity}
            </span>
          )}
        </div>

        {/* Inclusions preview (bullet list, MMT-style) */}
        {inclusions && inclusions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
            {inclusions.slice(0, 3).map((item) => (
              <span key={item} className="flex items-center gap-1 text-[11px] text-text-muted">
                <span className="h-1 w-1 rounded-full bg-text-dim shrink-0" />
                {item.length > 25 ? item.slice(0, 25) + "..." : item}
              </span>
            ))}
            {inclusions.length > 3 && (
              <span className="text-[11px] text-gold">+{inclusions.length - 3} more</span>
            )}
          </div>
        )}

        {/* Green highlighted experiences */}
        {highlights && highlights.length > 0 && (
          <div className="mt-2 space-y-0.5">
            {highlights.slice(0, 2).map((h) => (
              <span key={h} className="flex items-center gap-1 text-[11px] font-medium text-green-400">
                <Check className="h-3 w-3 shrink-0" /> {h}
              </span>
            ))}
          </div>
        )}

        {/* Pricing section — pushes to bottom */}
        <div className="mt-auto pt-3">
          <div className="border-t border-border-gold/40 pt-3">
            {/* EMI mention */}
            {emiAmount && (
              <div className="mb-1.5 rounded bg-surface px-2 py-1 text-[10px] text-text-dim inline-block">
                No Cost EMI at <span className="font-bold text-white">{formatINR(emiAmount)}</span>/month
              </div>
            )}

            {/* Price row */}
            <div className="flex items-end justify-between">
              <div>
                {originalPrice && (
                  <span className="text-xs text-text-dim line-through mr-1.5">
                    {formatINR(originalPrice)}
                  </span>
                )}
                <span className="text-xl font-bold text-white">
                  {formatINR(basePrice)}
                </span>
                <span className="text-[11px] text-text-dim ml-1">/{priceUnit}</span>
              </div>

              {/* CTA */}
              {isSelfServe ? (
                <span className="rounded-lg bg-gold-gradient px-3 py-1.5 text-[11px] font-bold text-cosmic-950 transition-transform group-hover:scale-105">
                  Book Now
                </span>
              ) : bookDeposit ? (
                <span className="rounded-lg border border-gold/60 bg-gold/10 px-3 py-1.5 text-[11px] font-bold text-gold transition-colors group-hover:bg-gold/20">
                  Book @ {formatINR(bookDeposit)}
                </span>
              ) : (
                <span className="text-[11px] font-medium text-gold group-hover:text-gold-200 transition-colors">
                  View Details →
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
