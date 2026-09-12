import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { ProductCard } from "@/components/marketing/ProductCard";
import { ScrollReveal } from "@/components/marketing/ScrollReveal";
import { AnimatedCounter } from "@/components/marketing/AnimatedCounter";
import { getCruises, getYachts, getPackages, getActivities } from "@/lib/data/db-products";

export const dynamic = "force-dynamic";
import { HeroSlideshow } from "@/components/marketing/HeroSlideshow";
import {
  ArrowRight,
  Star,
  Shield,
  Headphones,
  Search,
  ChevronRight,
  Calendar,
  Award,
  Clock,
  Heart,
  Anchor,
  IndianRupee,
  Sparkles,
  MapPin,
  Users,
  Compass,
} from "lucide-react";

const quickFinds = [
  { href: "/cruises/sunset-dinner-cruise", label: "Sunset Cruise", icon: "🌅" },
  { href: "/yachts/maxum-luxury-yacht", label: "Private Yacht", icon: "🛥️" },
  { href: "/packages/goa-honeymoon-classic-3n4d", label: "Honeymoon Pkg", icon: "💑" },
  { href: "/activities/watersports-combo-5in1", label: "Water Sports", icon: "🏄" },
  { href: "/packages/goa-group-trip-bachelor-3n4d", label: "Group Package", icon: "👥" },
  { href: "/parties", label: "Bachelor Party", icon: "🎉" },
  { href: "/activities/scuba-diving-grande-island", label: "Scuba Diving", icon: "🤿" },
  { href: "/hotels", label: "Hotels & Villas", icon: "🏨" },
];

const destinations = [
  { name: "Calangute & Baga", count: 24, desc: "Beach belt, nightlife, water sports", image: "https://goatrippackage.com/wp-content/uploads/2026/05/North-Goa-Tour-3.jpg" },
  { name: "Panaji & Old Goa", count: 18, desc: "Heritage, churches, river cruises", image: "https://goatrippackage.com/wp-content/uploads/2026/05/South-Goa-Tour-4.jpg" },
  { name: "Palolem & South Goa", count: 15, desc: "Quiet beaches, yoga, kayaking", image: "https://goatrippackage.com/wp-content/uploads/2026/05/kayaking-02-800x600.jpg" },
  { name: "Anjuna & Vagator", count: 12, desc: "Trance parties, flea market, cliffs", image: "https://goatrippackage.com/wp-content/uploads/2026/05/Sunset-800x600.jpeg" },
  { name: "Grand Island", count: 8, desc: "Scuba, snorkelling, boat trips", image: "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=800&q=80&auto=format&fit=crop" },
  { name: "Dudhsagar Falls", count: 6, desc: "Waterfall trek, spice plantation", image: "https://goatrippackage.com/wp-content/uploads/2026/05/Dudh-7.jpg" },
];

const steps = [
  { step: 1, title: "Browse Experiences", desc: "Explore 100+ curated packages, cruises, yachts & activities", icon: Search },
  { step: 2, title: "Personalise Your Trip", desc: "Pick dates, choose add-ons, or request a custom quote", icon: Calendar },
  { step: 3, title: "Pay Securely", desc: "PayU encrypted payment — full or 25% advance", icon: Shield },
  { step: 4, title: "Enjoy Goa!", desc: "WhatsApp confirmation, pickup details & 24/7 support", icon: Heart },
];

const stats = [
  { value: "10,000+", label: "Happy Travellers", icon: Users },
  { value: "4.8", label: "Google Rating", icon: Star },
  { value: "100+", label: "Experiences", icon: Compass },
  { value: "9 Years", label: "In Goa", icon: Award },
];

const testimonials = [
  { name: "Priya & Rahul", location: "Mumbai", text: "The team handled every detail — from airport pickup to the candlelight dinner on our last night. Absolutely magical honeymoon!", rating: 5 },
  { name: "Arjun's Group", location: "Bangalore", text: "Bachelor trip sorted in 30 minutes flat. Quote came on WhatsApp, paid online, yacht was ready on time. Will book again.", rating: 5 },
  { name: "The Sharma Family", location: "Delhi", text: "Family-friendly activities, great hotel recommendations, and the cruise was a hit with the kids. Hassle-free from start to finish.", rating: 5 },
  { name: "Sneha & Amit", location: "Pune", text: "Private yacht sunset was the highlight of our anniversary trip. The crew went above and beyond. Premium experience at fair pricing.", rating: 5 },
  { name: "Vikram's Corporate Team", location: "Hyderabad", text: "Corporate offsite perfectly organized — conference room, beach games, gala dinner. 20 people, zero complaints. Booking again next quarter.", rating: 5 },
  { name: "Meera", location: "Chennai", text: "Solo trip to Goa was stress-free thanks to their planning. Scuba diving at Grande Island was life-changing. Thank you GTP!", rating: 5 },
];

const whyUs = [
  { icon: Award, title: "Verified & Trusted", desc: "9 years in Goa. 10,000+ travellers. 4.8-star average rating on Google." },
  { icon: Shield, title: "Secure Payments", desc: "PayU-encrypted checkout with full or 25% advance. Zero-risk booking." },
  { icon: Headphones, title: "24/7 Concierge", desc: "Dedicated WhatsApp support from booking to drop-off. Real humans, always." },
  { icon: Clock, title: "30-Min Custom Quotes", desc: "Tell us your dates and budget — get a tailored itinerary within 30 minutes." },
];

const trustBadges = [
  { icon: IndianRupee, label: "Best Price Guarantee" },
  { icon: Shield, label: "100% Secure Payments" },
  { icon: Clock, label: "Instant Confirmation" },
  { icon: Headphones, label: "24/7 Support" },
  { icon: Sparkles, label: "Curated by Experts" },
];

function WaveDivider({ from, to }: { from: string; to: string }) {
  return (
    <div className="relative -mt-px">
      <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-8 md:h-12 block" preserveAspectRatio="none">
        <path d="M0 48V24C240 0 480 0 720 24C960 48 1200 48 1440 24V48H0Z" fill={to} />
      </svg>
    </div>
  );
}

export default async function HomePage() {
  let cruises: Awaited<ReturnType<typeof getCruises>> = [];
  let yachts: Awaited<ReturnType<typeof getYachts>> = [];
  let packages: Awaited<ReturnType<typeof getPackages>> = [];
  let activities: Awaited<ReturnType<typeof getActivities>> = [];
  try {
    [cruises, yachts, packages, activities] = await Promise.all([
      getCruises(),
      getYachts(),
      getPackages(),
      getActivities(),
    ]);
  } catch {
    // DB unavailable at build time
  }

  return (
    <div className="flex min-h-screen flex-col bg-ground">
      <Header />

      {/* ═══ HERO — cinematic Ken Burns with layered overlays ═══ */}
      <section className="relative flex min-h-screen items-end overflow-hidden">
        <HeroSlideshow />

        {/* Decorative grid overlay */}
        <div className="absolute inset-0 z-[1] opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        {/* Radial accent glow */}
        <div className="absolute inset-0 z-[1]" style={{
          background: 'radial-gradient(ellipse at 70% 20%, rgba(26,142,125,0.12), transparent 60%)',
        }} />
        <div className="absolute inset-0 z-[1]" style={{
          background: 'radial-gradient(ellipse at 20% 80%, rgba(198,139,63,0.06), transparent 50%)',
        }} />

        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 pb-40 pt-32 md:px-8 md:pb-48">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-lagoon animate-pulse" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-lagoon-100">
              Goa&apos;s #1 Trip Planner — Since 2017
            </span>
          </div>

          <h1
            className="font-display text-[clamp(42px,6vw,80px)] font-bold leading-[1.05] text-white max-w-2xl"
            style={{ textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}
          >
            Unforgettable
            <br />
            <span className="bg-gradient-to-r from-lagoon-100 to-lagoon bg-clip-text text-transparent">
              Goa Experiences
            </span>
          </h1>

          <p
            className="mt-6 max-w-lg text-base leading-relaxed text-white/60 md:text-lg"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.3)" }}
          >
            Premium packages, cruises, yachts &amp; adventures — crafted for
            the moments that matter.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/packages"
              className="inline-flex h-12 items-center justify-center rounded-full bg-lagoon px-10 text-sm font-semibold text-white shadow-lagoon transition-all hover:bg-lagoon-600 hover:-translate-y-0.5 active:translate-y-0"
            >
              Browse All Packages
            </Link>
            <Link
              href="/custom-trip"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/20 bg-white/8 px-10 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/15"
            >
              Get Free Custom Quote
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickFinds.slice(0, 6).map((q) => (
              <Link
                key={q.label}
                href={q.href}
                className="flex shrink-0 items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-[13px] font-medium text-white/70 backdrop-blur-sm transition-all hover:bg-white/10 hover:text-white hover:border-white/20"
              >
                <span className="text-base">{q.icon}</span>
                {q.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom wave transition to stats strip */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-8 md:h-12 block" preserveAspectRatio="none">
            <path d="M0 48V24C240 0 480 0 720 24C960 48 1200 48 1440 24V48H0Z" fill="var(--color-abyss)" />
          </svg>
        </div>
      </section>

      {/* ═══ STATS — abyss strip with glassmorphism cards ═══ */}
      <section className="relative bg-abyss overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(26,142,125,0.08), transparent 60%)',
        }} />
        <div className="relative mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-12">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex flex-col items-center gap-2 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm px-4 py-5 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lagoon/15">
                    <Icon className="h-5 w-5 text-lagoon" />
                  </div>
                  <p className="text-2xl font-bold text-white md:text-3xl">
                    <AnimatedCounter value={s.value} />
                  </p>
                  <p className="text-[11px] text-white/40 uppercase tracking-wider">
                    {s.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lagoon/20 to-transparent" />
      </section>

      {/* ═══ TRUST STRIP ═══ */}
      <section className="border-b border-border-warm bg-ground">
        <div className="mx-auto max-w-7xl px-4 py-5 md:px-8">
          <div className="flex items-center justify-center gap-6 overflow-x-auto scrollbar-hide md:gap-10">
            {trustBadges.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.label} className="flex shrink-0 items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lagoon-50">
                    <Icon className="h-4 w-4 text-lagoon" />
                  </div>
                  <span className="text-xs font-semibold text-ink whitespace-nowrap">{b.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ WHY GOA TRIP PACKAGE ═══ */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-lagoon/20 bg-lagoon/5 px-4 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-lagoon animate-pulse" />
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-lagoon">
                  Why Goa Trip Package
                </span>
              </div>
              <h2 className="font-display text-3xl font-bold text-ink md:text-5xl">
                Trusted by 10,000+{" "}
                <span className="bg-gradient-to-r from-lagoon to-lagoon-700 bg-clip-text text-transparent">
                  Travellers
                </span>
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyUs.map((item, i) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={item.title} delay={i * 100}>
                  <div className="group rounded-2xl bg-ground border border-border-warm p-6 transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 hover:border-lagoon/20">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lagoon/10 mb-4 transition-colors group-hover:bg-lagoon/15">
                      <Icon className="h-6 w-6 text-lagoon" />
                    </div>
                    <h3 className="text-base font-bold text-ink mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ CRUISES ═══ */}
      <section className="relative bg-ground overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 80% 20%, rgba(26,142,125,0.04), transparent 50%)',
        }} />
        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber/20 bg-amber/5 px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber animate-pulse" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-amber">
                    Mandovi River
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold text-ink md:text-4xl">
                  Unforgettable Cruise{" "}
                  <span className="bg-gradient-to-r from-lagoon to-lagoon-700 bg-clip-text text-transparent">
                    Experiences
                  </span>
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  {cruises.length} cruises — sunset, dinner, party, dolphin, private
                </p>
              </div>
              <Link
                href="/cruises"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-lagoon hover:text-lagoon-600 transition-colors"
              >
                View all {cruises.length} <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cruises.slice(0, 4).map((c, i) => (
              <ScrollReveal key={c.slug} delay={i * 80}>
                <ProductCard
                  slug={c.slug}
                  type={c.type}
                  name={c.name}
                  basePrice={c.basePrice}
                  originalPrice={c.originalPrice}
                  priceUnit={c.priceUnit}
                  duration={c.duration}
                  capacity={c.capacity}
                  location={c.location}
                  rating={c.rating}
                  isFeatured={c.isFeatured}
                  isSelfServe={c.isSelfServe}
                  imageUrl={c.imageUrl}
                  inclusions={c.inclusions}
                  highlights={c.highlights}
                />
              </ScrollReveal>
            ))}
          </div>
          <Link
            href="/cruises"
            className="mt-6 flex items-center justify-center gap-1 text-sm font-medium text-lagoon sm:hidden"
          >
            View all {cruises.length} cruises <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ═══ IMMERSIVE BREAK — full-bleed cinematic ═══ */}
      <section className="relative py-28 overflow-hidden md:py-36">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=85&auto=format&fit=crop"
            alt="Yacht on the Arabian Sea"
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "center 40%" }}
          />
        </div>
        <div className="absolute inset-0 bg-abyss/65" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(26,142,125,0.1), transparent 60%)',
        }} />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <ScrollReveal>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
              <Anchor className="h-3.5 w-3.5 text-amber/70" />
              <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-amber/70">
                Arabian Sea
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold text-white md:text-5xl leading-tight">
              Where Every Sunset
              <br />
              <span className="bg-gradient-to-r from-lagoon-100 to-lagoon bg-clip-text text-transparent">
                Tells a Story
              </span>
            </h2>
            <p className="mt-4 text-white/50 text-base max-w-md mx-auto">
              From intimate yacht charters to celebration cruises — your Arabian
              Sea moment awaits.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ YACHTS — dark cinematic section ═══ */}
      <section className="relative bg-abyss overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 20% 30%, rgba(26,142,125,0.1), transparent 50%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 80% 80%, rgba(198,139,63,0.06), transparent 50%)',
        }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-lagoon/30 bg-lagoon/10 px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-lagoon animate-pulse" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-lagoon-100">
                    Private Luxury
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold text-white md:text-4xl">
                  Sail in Total{" "}
                  <span className="bg-gradient-to-r from-lagoon-100 to-lagoon bg-clip-text text-transparent">
                    Privacy
                  </span>
                </h2>
                <p className="mt-2 text-sm text-white/40">
                  {yachts.length} yachts — celebrations, romance, corporate events
                </p>
              </div>
              <Link
                href="/yachts"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-lagoon hover:text-lagoon-100 transition-colors"
              >
                View all {yachts.length} <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {yachts.slice(0, 4).map((y, i) => (
              <ScrollReveal key={y.slug} delay={i * 80}>
                <ProductCard
                  slug={y.slug}
                  type={y.type}
                  name={y.name}
                  basePrice={y.basePrice}
                  priceUnit={y.priceUnit}
                  duration={y.duration}
                  capacity={y.capacity}
                  location={y.location}
                  rating={y.rating}
                  isFeatured={y.isFeatured}
                  isSelfServe={y.isSelfServe}
                  imageUrl={y.imageUrl}
                  inclusions={y.inclusions}
                />
              </ScrollReveal>
            ))}
          </div>
          <Link
            href="/yachts"
            className="mt-6 flex items-center justify-center gap-1 text-sm font-medium text-lagoon sm:hidden"
          >
            View all {yachts.length} yachts <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        {/* Wave transition to white */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-8 md:h-10" preserveAspectRatio="none">
            <path d="M0 40V20C240 0 480 0 720 20C960 40 1200 40 1440 20V40H0Z" fill="var(--color-ground)" />
          </svg>
        </div>
      </section>

      {/* ═══ PACKAGES ═══ */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 30% 80%, rgba(198,139,63,0.04), transparent 50%)',
        }} />
        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber/20 bg-amber/5 px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber animate-pulse" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-amber">
                    All Inclusive
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold text-ink md:text-4xl">
                  Complete Goa Holiday{" "}
                  <span className="bg-gradient-to-r from-lagoon to-lagoon-700 bg-clip-text text-transparent">
                    Packages
                  </span>
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  {packages.length} packages — honeymoon, family, group, bachelor, corporate
                </p>
              </div>
              <Link
                href="/packages"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-lagoon hover:text-lagoon-600 transition-colors"
              >
                View all {packages.length} <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {packages.slice(0, 3).map((p, i) => (
              <ScrollReveal key={p.slug} delay={i * 80}>
                <ProductCard
                  slug={p.slug}
                  type={p.type}
                  name={p.name}
                  basePrice={p.basePrice}
                  originalPrice={p.originalPrice}
                  priceUnit={p.priceUnit}
                  duration={p.duration}
                  location={p.location}
                  rating={p.rating}
                  isFeatured={p.isFeatured}
                  imageUrl={p.imageUrl}
                  inclusions={p.inclusions}
                  highlights={p.highlights}
                />
              </ScrollReveal>
            ))}
          </div>
          <Link
            href="/packages"
            className="mt-6 flex items-center justify-center gap-1 text-sm font-medium text-lagoon sm:hidden"
          >
            View all {packages.length} packages <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ═══ ACTIVITIES ═══ */}
      <section className="relative bg-ground overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 60% 30%, rgba(26,142,125,0.04), transparent 50%)',
        }} />
        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-lagoon/20 bg-lagoon/5 px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-lagoon animate-pulse" />
                  <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-lagoon">
                    Thrill &amp; Adventure
                  </span>
                </div>
                <h2 className="font-display text-2xl font-bold text-ink md:text-4xl">
                  Dive Into Goa&apos;s Best{" "}
                  <span className="bg-gradient-to-r from-lagoon to-lagoon-700 bg-clip-text text-transparent">
                    Adventures
                  </span>
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  {activities.length} activities — scuba, parasail, bungee, kayak, helicopter
                </p>
              </div>
              <Link
                href="/activities"
                className="hidden sm:flex items-center gap-1 text-sm font-medium text-lagoon hover:text-lagoon-600 transition-colors"
              >
                View all {activities.length} <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {activities.slice(0, 4).map((a, i) => (
              <ScrollReveal key={a.slug} delay={i * 80}>
                <ProductCard
                  slug={a.slug}
                  type={a.type}
                  name={a.name}
                  basePrice={a.basePrice}
                  priceUnit={a.priceUnit}
                  duration={a.duration}
                  location={a.location}
                  rating={a.rating}
                  isFeatured={a.isFeatured}
                  isSelfServe={a.isSelfServe}
                  imageUrl={a.imageUrl}
                  inclusions={a.inclusions}
                />
              </ScrollReveal>
            ))}
          </div>
          <Link
            href="/activities"
            className="mt-6 flex items-center justify-center gap-1 text-sm font-medium text-lagoon sm:hidden"
          >
            View all {activities.length} activities <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ═══ POPULAR DESTINATIONS ═══ */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 80%, rgba(198,139,63,0.04), transparent 50%)',
        }} />
        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber/20 bg-amber/5 px-4 py-1.5">
                <MapPin className="h-3.5 w-3.5 text-amber" />
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-amber">
                  Explore by Location
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold text-ink md:text-4xl">
                Popular Destinations in{" "}
                <span className="bg-gradient-to-r from-lagoon to-lagoon-700 bg-clip-text text-transparent">
                  Goa
                </span>
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {destinations.map((d, i) => (
              <ScrollReveal key={d.name} delay={i * 60}>
                <div className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer">
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 16vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-abyss/90 via-abyss/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <h3 className="text-sm font-bold text-white">{d.name}</h3>
                    <p className="text-[10px] text-white/60 mt-0.5">
                      {d.desc}
                    </p>
                    <p className="text-[10px] text-lagoon mt-1 font-medium">
                      {d.count} experiences
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS — cinematic dark section ═══ */}
      <section className="relative bg-abyss overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(26,142,125,0.1), transparent 50%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 70% 80%, rgba(198,139,63,0.06), transparent 50%)',
        }} />
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-lagoon/30 bg-lagoon/10 px-4 py-1.5">
                <Star className="h-3.5 w-3.5 text-lagoon fill-lagoon" />
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-lagoon-100">
                  What Travellers Say
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold text-white md:text-4xl">
                Verified{" "}
                <span className="bg-gradient-to-r from-lagoon-100 to-lagoon bg-clip-text text-transparent">
                  Reviews
                </span>
              </h2>
              <p className="mt-2 text-sm text-white/40">
                From our 10,000+ happy travellers
              </p>
            </div>
          </ScrollReveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.name} delay={i * 80}>
                <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm p-6 transition-all duration-300 hover:bg-white/[0.07] hover:border-lagoon/20">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="h-3.5 w-3.5 fill-amber text-amber"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-white/60 leading-relaxed">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-lagoon/15 flex items-center justify-center">
                      <span className="text-xs font-bold text-lagoon">
                        {t.name[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {t.name}
                      </p>
                      <p className="text-[11px] text-white/40">{t.location}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
        {/* Wave to ground */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-8 md:h-10" preserveAspectRatio="none">
            <path d="M0 40V20C240 0 480 0 720 20C960 40 1200 40 1440 20V40H0Z" fill="var(--color-ground)" />
          </svg>
        </div>
      </section>

      {/* ═══ HOW IT WORKS — connected timeline ═══ */}
      <section className="relative bg-ground overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(26,142,125,0.03), transparent 50%)',
        }} />
        <div className="relative mx-auto max-w-4xl px-5 py-20 md:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-lagoon/20 bg-lagoon/5 px-4 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-lagoon animate-pulse" />
                <span className="text-xs font-medium uppercase tracking-[0.15em] text-lagoon">
                  Simple Process
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold text-ink md:text-4xl">
                How It{" "}
                <span className="bg-gradient-to-r from-lagoon to-lagoon-700 bg-clip-text text-transparent">
                  Works
                </span>
              </h2>
              <p className="mt-2 text-sm text-gray-400">
                Book your Goa experience in 4 simple steps
              </p>
            </div>
          </ScrollReveal>
          <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Connecting line (desktop only) */}
            <div className="absolute top-7 left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-px bg-gradient-to-r from-lagoon/20 via-lagoon/40 to-lagoon/20 hidden lg:block" />
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <ScrollReveal key={s.step} delay={i * 100}>
                  <div className="relative text-center">
                    <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-border-warm shadow-soft mb-4">
                      <Icon className="h-6 w-6 text-lagoon" />
                      <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-lagoon text-[10px] font-bold text-white shadow-lagoon">
                        {s.step}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-ink mb-1">{s.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA — cinematic with layered gradients ═══ */}
      <section className="relative py-24 overflow-hidden md:py-32">
        <div className="absolute inset-0 bg-abyss" />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(26,142,125,0.15), transparent 50%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 20% 80%, rgba(198,139,63,0.08), transparent 50%)',
        }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lagoon/30 to-transparent" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <ScrollReveal>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-lagoon/30 bg-lagoon/10 px-4 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-lagoon animate-pulse" />
              <span className="text-xs font-medium uppercase tracking-[0.15em] text-lagoon-100">
                Start Planning
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold text-white md:text-5xl">
              Ready for an Unforgettable
              <span className="block mt-2 bg-gradient-to-r from-lagoon-100 to-lagoon bg-clip-text text-transparent">
                Goa Adventure?
              </span>
            </h2>
            <p className="mt-5 text-white/50 text-base max-w-md mx-auto">
              Tell us what you want. Our planners craft your perfect itinerary
              and share a quote within 30 minutes on WhatsApp.
            </p>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/custom-trip"
                className="inline-flex h-12 items-center justify-center rounded-full bg-lagoon px-10 text-sm font-semibold text-white shadow-lagoon transition-all hover:bg-lagoon-600 hover:-translate-y-0.5"
              >
                Get Free Custom Quote
              </Link>
              <a
                href="https://wa.me/919890830249?text=Hi%2C%20I%20want%20to%20plan%20a%20Goa%20trip"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/6 px-10 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/12"
              >
                WhatsApp Us Directly
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/919890830249?text=Hi%2C%20I%27m%20interested%20in%20Goa%20Trip%20Package"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-110 active:scale-95 md:bottom-8 md:right-8"
        aria-label="Chat on WhatsApp"
      >
        <svg
          className="h-7 w-7 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}
