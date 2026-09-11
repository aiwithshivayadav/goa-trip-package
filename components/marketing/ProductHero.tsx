"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, X, Star, MapPin, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductHeroProps {
  images: string[];
  name: string;
  typeLabel: string;
  featuredLabel: string;
  isFeatured?: boolean;
  rating?: number | null;
  reviewCount?: number | null;
  location?: string | null;
  categoryHref: string;
  categoryLabel: string;
}

export function ProductHero({
  images,
  name,
  typeLabel,
  featuredLabel,
  isFeatured,
  rating,
  reviewCount,
  location,
  categoryHref,
  categoryLabel,
}: ProductHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goTo = useCallback(
    (index: number) => setActiveIndex((index + images.length) % images.length),
    [images.length]
  );

  if (!images.length) return null;

  return (
    <>
      <section
        className="relative w-full overflow-hidden cursor-pointer group"
        style={{ height: "clamp(300px, 50vh, 560px)" }}
        onClick={() => setLightboxOpen(true)}
      >
        <Image
          src={images[activeIndex] || ""}
          alt={name}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-[8s] ease-out group-hover:scale-[1.03]"
          priority={activeIndex === 0}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/50 to-abyss/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-abyss/20 to-transparent" />

        <div className="absolute top-0 inset-x-0 z-10 px-4 pt-4 md:px-8">
          <div className="mx-auto max-w-7xl">
            <Link
              href={categoryHref}
              className="inline-flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors backdrop-blur-sm bg-white/5 rounded-full px-3 py-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {categoryLabel}
            </Link>
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goTo(activeIndex - 1); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors md:left-8"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goTo(activeIndex + 1); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors md:right-8"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute top-4 right-4 z-10 rounded-lg bg-black/50 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white md:right-8">
            {activeIndex + 1} / {images.length}
          </div>
        )}

        <div className="absolute bottom-0 inset-x-0 z-10 px-4 pb-6 md:px-8 md:pb-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded-full bg-amber/20 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-amber uppercase tracking-wider border border-amber/30">
                {typeLabel}
              </span>
              {isFeatured && (
                <span className="rounded-full bg-lagoon/20 backdrop-blur-sm px-3 py-1 text-[10px] font-bold text-lagoon-100 uppercase tracking-wider border border-lagoon/30">
                  {featuredLabel}
                </span>
              )}
            </div>

            <h1
              className="font-display text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl max-w-3xl"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
            >
              {name}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              {rating && (
                <span className="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-3 py-1 text-sm text-white border border-white/10">
                  <Star className="h-3.5 w-3.5 fill-amber text-amber" />
                  <span className="font-bold">{rating}</span>
                  {reviewCount && (
                    <span className="text-white/50 text-xs">({reviewCount}+ reviews)</span>
                  )}
                </span>
              )}
              {location && (
                <span className="flex items-center gap-1.5 text-sm text-white/60">
                  <MapPin className="h-3.5 w-3.5" /> {location}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {images.length > 1 && (
        <div className="mx-auto max-w-7xl px-4 md:px-8 mt-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg transition-all",
                  i === activeIndex
                    ? "ring-2 ring-lagoon ring-offset-2 ring-offset-ground"
                    : "opacity-50 hover:opacity-100"
                )}
              >
                <Image src={img} alt={`View ${i + 1}`} fill sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5" />
          </button>

          <div
            className="relative w-full max-w-5xl mx-4 aspect-[16/10]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIndex] || ""}
              alt={`${name} — full size`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goTo(activeIndex - 1); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goTo(activeIndex + 1); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  i === activeIndex ? "bg-lagoon w-6" : "bg-white/40 hover:bg-white/70"
                )}
                aria-label={`View image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
