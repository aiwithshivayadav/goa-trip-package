"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519101739220-83f6a14852ca?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1652820330085-82a0c2b88d78?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1642922835816-e2ac68db5c42?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1672841828271-54340a6fbcd3?w=1920&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1672841828478-2fad29c8fa25?w=1920&q=80&auto=format&fit=crop",
];

export function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0">
      {slides.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
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
      ))}
      <div className="absolute inset-0 bg-abyss/10 md:bg-abyss/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-abyss/60 via-abyss/5 to-transparent md:from-abyss/75 md:via-abyss/15" />
    </div>
  );
}
