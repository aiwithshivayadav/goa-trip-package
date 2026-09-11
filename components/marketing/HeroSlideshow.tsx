"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519101739220-83f6a14852ca?w=1920&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1652820330085-82a0c2b88d78?w=1920&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1642922835816-e2ac68db5c42?w=1920&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1672841828271-54340a6fbcd3?w=1920&q=85&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1672841828478-2fad29c8fa25?w=1920&q=85&auto=format&fit=crop",
];

const kbAnimations = [
  "kb-zoom-right 8s ease-in-out forwards",
  "kb-zoom-left 8s ease-in-out forwards",
  "kb-zoom-center 8s ease-in-out forwards",
];

export function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0">
      {slides.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <div
            className="absolute inset-0"
            style={{
              animation: i === current
                ? kbAnimations[i % kbAnimations.length]
                : "none",
            }}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        </div>
      ))}
      <div className="absolute inset-0 bg-abyss/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-abyss/90 via-abyss/25 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-abyss/50 via-transparent to-transparent" />
    </div>
  );
}
