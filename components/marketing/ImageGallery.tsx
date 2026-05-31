"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

/**
 * Image Gallery — hero image + thumbnails + lightbox
 * Inspired by Thrillophilia / goatrippackage.com product pages
 */
export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images.length) return null;

  function goTo(index: number) {
    setActiveIndex((index + images.length) % images.length);
  }

  return (
    <>
      {/* Main gallery */}
      <div className="space-y-3">
        {/* Hero image */}
        <div
          className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-cosmic-800 cursor-pointer group"
          onClick={() => setLightboxOpen(true)}
        >
          <Image
            src={images[activeIndex] || ""}
            alt={`${alt} — photo ${activeIndex + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={activeIndex === 0}
          />
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {/* Photo count badge */}
          <div className="absolute bottom-3 right-3 rounded-lg bg-cosmic-950/80 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white">
            {activeIndex + 1} / {images.length}
          </div>
          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goTo(activeIndex - 1); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-cosmic-950/60 backdrop-blur-sm text-white hover:bg-cosmic-950/80 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goTo(activeIndex + 1); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-cosmic-950/60 backdrop-blur-sm text-white hover:bg-cosmic-950/80 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg transition-all",
                  i === activeIndex
                    ? "ring-2 ring-gold ring-offset-2 ring-offset-cosmic-950"
                    : "opacity-60 hover:opacity-100"
                )}
              >
                <Image src={img} alt={`Thumbnail ${i + 1}`} fill sizes="96px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95" onClick={() => setLightboxOpen(false)}>
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative w-full max-w-5xl mx-4 aspect-[16/10]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[activeIndex] || ""}
              alt={`${alt} — full size`}
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
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goTo(activeIndex + 1); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Bottom thumbnails in lightbox */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  i === activeIndex ? "bg-gold w-6" : "bg-white/40 hover:bg-white/70"
                )}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
