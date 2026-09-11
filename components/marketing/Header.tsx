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
          ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_0_#E8E6E1]"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-lagoon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12c2-4 6-7 10-7s8 3 10 7" />
              <path d="M2 16c2-4 6-7 10-7s8 3 10 7" />
            </svg>
          </span>
          <span
            className={cn(
              "font-display text-[20px] font-bold leading-tight tracking-tight transition-colors",
              scrolled ? "text-ink" : "text-white"
            )}
          >
            Goa Trip <span className="text-lagoon">Package</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3.5 py-2 text-[13.5px] font-medium transition-colors",
                scrolled
                  ? "text-gray-600 hover:text-ink hover:bg-lagoon-50"
                  : "text-white/75 hover:text-white hover:bg-white/8"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop right */}
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="tel:+919890830249"
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
              scrolled ? "text-gray-500 hover:text-lagoon" : "text-white/70 hover:text-white"
            )}
          >
            <Phone className="h-4 w-4" />
            <span className="hidden xl:inline">+91 98908 30249</span>
          </a>
          <Link
            href="/custom-trip"
            className="inline-flex h-10 items-center justify-center rounded-full bg-lagoon px-6 text-[13.5px] font-semibold text-white transition-all hover:bg-lagoon-600 hover:-translate-y-px"
          >
            Plan My Trip
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg lg:hidden",
            scrolled ? "text-ink" : "text-white"
          )}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="absolute inset-x-0 top-[72px] border-t border-border-warm bg-white shadow-elevated lg:hidden">
          <nav className="mx-auto max-w-7xl px-5 py-6">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 text-base font-medium text-gray-600 transition-colors hover:text-ink hover:bg-lagoon-50"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="section-divider my-4" />

            <div className="flex flex-col gap-3">
              <a
                href="tel:+919890830249"
                className="flex items-center justify-center gap-2 rounded-lg border border-border-warm px-4 py-3 text-sm text-gray-600"
              >
                <Phone className="h-4 w-4" />
                +91 98908 30249
              </a>
              <Link
                href="/custom-trip"
                onClick={() => setMobileOpen(false)}
                className="flex h-12 items-center justify-center rounded-full bg-lagoon text-sm font-semibold text-white"
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
