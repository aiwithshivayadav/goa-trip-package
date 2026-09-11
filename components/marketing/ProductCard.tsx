import Image from "next/image";
import Link from "next/link";
import { Users, MapPin, Star, Check, Zap } from "lucide-react";
import { cn, formatINR } from "@/lib/utils";

interface ProductCardProps {
  slug: string;
  type: "package" | "cruise" | "yacht" | "activity" | "hotel" | "party";
  name: string;
  shortDesc?: string;
  imageUrl?: string;
  basePrice: number;
  originalPrice?: number;
  priceUnit?: string;
  duration?: string;
  capacity?: string;
  location?: string;
  rating?: number;
  isFeatured?: boolean;
  isSelfServe?: boolean;
  inclusions?: string[];
  highlights?: string[];
  bookingsToday?: number;
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

export function ProductCard({
  slug,
  type,
  name,
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
  const bookedCount = bookingsToday ?? 0;

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-border-warm transition-all duration-300",
        "hover:shadow-elevated hover:-translate-y-1",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-lagoon-50 via-ground to-amber-50" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Top-left badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {isFeatured && (
            <span className="rounded-md bg-amber px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
              Best Seller
            </span>
          )}
          {discount && (
            <span className="rounded-md bg-emerald-500 px-2.5 py-1 text-[10px] font-bold text-white">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Duration badge top-right */}
        {duration && (
          <span className="absolute right-3 top-3 rounded-md bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-ink">
            {duration.split("(")[0]?.trim()}
          </span>
        )}

        {/* Social proof */}
        {bookedCount > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-black/60 backdrop-blur-sm px-2.5 py-1">
            <Zap className="h-3 w-3 text-amber fill-amber" />
            <span className="text-[10px] font-medium text-white">{bookedCount} booked today</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Type + rating */}
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-medium uppercase tracking-wider text-lagoon">
            {typeLabels[type]}
          </span>
          {rating && (
            <span className="flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[11px] font-bold text-amber-600">
              <Star className="h-3 w-3 fill-amber-600" /> {rating}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-bold text-ink leading-snug line-clamp-2 group-hover:text-lagoon transition-colors">
          {name}
        </h3>

        {/* Location + capacity */}
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-400">
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

        {/* Inclusions */}
        {inclusions && inclusions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
            {inclusions.slice(0, 3).map((item) => (
              <span key={item} className="flex items-center gap-1 text-[11px] text-gray-500">
                <span className="h-1 w-1 rounded-full bg-gray-300 shrink-0" />
                {item.length > 25 ? item.slice(0, 25) + "..." : item}
              </span>
            ))}
            {inclusions.length > 3 && (
              <span className="text-[11px] text-lagoon font-medium">+{inclusions.length - 3} more</span>
            )}
          </div>
        )}

        {/* Green highlights */}
        {highlights && highlights.length > 0 && (
          <div className="mt-2 space-y-0.5">
            {highlights.slice(0, 2).map((h) => (
              <span key={h} className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                <Check className="h-3 w-3 shrink-0" /> {h}
              </span>
            ))}
          </div>
        )}

        {/* Pricing — pushed to bottom */}
        <div className="mt-auto pt-3">
          <div className="border-t border-border-warm pt-3">
            {emiAmount && (
              <div className="mb-1.5 rounded bg-lagoon-50 px-2 py-1 text-[10px] text-gray-500 inline-block">
                No Cost EMI at <span className="font-bold text-ink">{formatINR(emiAmount)}</span>/month
              </div>
            )}

            <div className="flex items-end justify-between">
              <div>
                {originalPrice && (
                  <span className="text-xs text-gray-400 line-through mr-1.5">
                    {formatINR(originalPrice)}
                  </span>
                )}
                <span className="text-xl font-bold text-ink">
                  {formatINR(basePrice)}
                </span>
                <span className="text-[11px] text-gray-400 ml-1">/{priceUnit}</span>
              </div>

              {isSelfServe ? (
                <span className="rounded-lg bg-lagoon px-3.5 py-1.5 text-[11px] font-bold text-white transition-all group-hover:bg-lagoon-600 group-hover:shadow-lagoon">
                  Book Now
                </span>
              ) : bookDeposit ? (
                <span className="rounded-lg border border-lagoon/40 bg-lagoon-50 px-3 py-1.5 text-[11px] font-bold text-lagoon transition-colors group-hover:bg-lagoon group-hover:text-white">
                  Book @ {formatINR(bookDeposit)}
                </span>
              ) : (
                <span className="text-[11px] font-medium text-lagoon group-hover:text-lagoon-600 transition-colors">
                  View Details &rarr;
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
