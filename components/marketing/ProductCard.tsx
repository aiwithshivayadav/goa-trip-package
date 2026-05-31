import Image from "next/image";
import Link from "next/link";
import { Clock, Users, MapPin, Star } from "lucide-react";
import { cn, formatINR } from "@/lib/utils";

interface ProductCardProps {
  slug: string;
  type: "package" | "cruise" | "yacht" | "activity" | "hotel" | "party";
  name: string;
  shortDesc?: string;
  imageUrl?: string;
  basePrice: number;
  priceUnit?: string;
  duration?: string;
  capacity?: string;
  location?: string;
  rating?: number;
  isFeatured?: boolean;
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

/**
 * ProductCard — the workhorse card used across all listing pages
 * Features: 2:1 hero image, gold accent on hover, 3D tilt feel via shadow
 */
export function ProductCard({
  slug,
  type,
  name,
  shortDesc,
  imageUrl,
  basePrice,
  priceUnit = "per person",
  duration,
  capacity,
  location,
  rating,
  isFeatured = false,
  className,
}: ProductCardProps) {
  const href = `${typeRouteMap[type] || "/packages"}/${slug}`;

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border-gold bg-cosmic-900 transition-all duration-300",
        "hover:border-gold/50 hover:shadow-gold hover:-translate-y-1",
        className
      )}
    >
      {/* Image (2:1 ratio) */}
      <div className="relative aspect-[2/1] w-full overflow-hidden bg-cosmic-800">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          // Gradient placeholder when no image
          <div className="absolute inset-0 bg-gradient-to-br from-cosmic-800 via-cosmic-900 to-gold-800/20" />
        )}

        {/* Featured badge */}
        {isFeatured && (
          <div className="absolute left-3 top-3 rounded-full bg-gold-gradient px-3 py-1 text-xs font-bold text-cosmic-950">
            Featured
          </div>
        )}

        {/* Type badge */}
        <div className="absolute right-3 top-3 rounded-full bg-cosmic-950/80 backdrop-blur-sm px-3 py-1 text-xs font-medium text-text-muted capitalize">
          {type}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Title */}
        <h3 className="text-base font-bold text-white line-clamp-2 group-hover:text-gold transition-colors">
          {name}
        </h3>

        {/* Description */}
        {shortDesc && (
          <p className="mt-2 text-sm text-text-muted line-clamp-2">
            {shortDesc}
          </p>
        )}

        {/* Meta row */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-text-dim">
          {duration && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {duration}
            </span>
          )}
          {capacity && (
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" /> {capacity}
            </span>
          )}
          {location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {location}
            </span>
          )}
          {rating && (
            <span className="flex items-center gap-1 text-gold">
              <Star className="h-3 w-3 fill-gold" /> {rating}
            </span>
          )}
        </div>

        {/* Price row — pushes to bottom */}
        <div className="mt-auto pt-4">
          <div className="flex items-baseline justify-between border-t border-border-gold pt-4">
            <div>
              <span className="text-lg font-bold text-white">
                {formatINR(basePrice)}
              </span>
              <span className="ml-1 text-xs text-text-dim">/ {priceUnit}</span>
            </div>
            <span className="text-xs font-medium text-gold group-hover:text-gold-200 transition-colors">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
