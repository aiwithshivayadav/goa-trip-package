"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/packages", label: "Packages" },
  { href: "/cruises", label: "Cruises" },
  { href: "/yachts", label: "Yachts" },
  { href: "/activities", label: "Activities" },
  { href: "/hotels", label: "Hotels" },
  { href: "/custom-trip", label: "Custom Trip" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-cosmic-950/90 backdrop-blur-xl shadow-[0_1px_0_rgba(201,168,76,0.15)]"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-white">
            Goa Trip <span className="text-gold">Package</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:text-white hover:bg-surface-hover"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="tel:+919890830249"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:text-gold"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden xl:inline">+91 98908 30249</span>
          </a>
          <Link
            href="/custom-trip"
            className="inline-flex h-9 items-center justify-center rounded-full bg-gold-gradient px-5 text-xs font-bold text-cosmic-950 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Plan My Trip
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="absolute inset-x-0 top-16 border-t border-border-gold bg-cosmic-950/98 backdrop-blur-xl lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 py-6">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 text-base font-medium text-text-muted transition-colors hover:text-white hover:bg-surface"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="gold-divider my-4" />

            <div className="flex flex-col gap-3">
              <a
                href="tel:+919890830249"
                className="flex items-center justify-center gap-2 rounded-lg border border-border-gold px-4 py-3 text-sm text-gold"
              >
                <Phone className="h-4 w-4" />
                +91 98908 30249
              </a>
              <Link
                href="/custom-trip"
                onClick={() => setMobileOpen(false)}
                className="flex h-12 items-center justify-center rounded-full bg-gold-gradient text-sm font-bold text-cosmic-950"
              >
                Plan My Trip
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
