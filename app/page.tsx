import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { WhyChooseUs } from "@/components/marketing/WhyChooseUs";
import { OffersStrip } from "@/components/marketing/OffersStrip";
import { ProductCard } from "@/components/marketing/ProductCard";
import { cruises, yachts, packages, activities, hotels } from "@/lib/data/products";
import { Anchor, Sailboat, Waves, Mountain, Hotel, PartyPopper, ArrowRight, Star, Shield, Headphones, Users, MapPin, Bike, Ship, Palmtree, Camera, Globe, Gem, Clock, Search, ChevronRight, Calendar } from "lucide-react";

/**
 * Homepage — rebuilt to match goatrippackage.com section flow
 * Hero → WhyChooseUs → Quick Find → Cruises → Yachts → Packages →
 * Activities → Popular Destinations → Offers → How It Works →
 * Testimonials → CTA → Footer
 */

// Quick find shortcuts (from goatrippackage.com)
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

// Popular destinations (from goatrippackage.com)
const destinations = [
  { name: "Calangute & Baga", count: 24, desc: "Beach belt, nightlife, water sports", image: "https://goatrippackage.com/wp-content/uploads/2026/05/North-Goa-Tour-3.jpg" },
  { name: "Panaji & Old Goa", count: 18, desc: "Heritage, churches, river cruises", image: "https://goatrippackage.com/wp-content/uploads/2026/05/South-Goa-Tour-4.jpg" },
  { name: "Palolem & South Goa", count: 15, desc: "Quiet beaches, yoga, kayaking", image: "https://goatrippackage.com/wp-content/uploads/2026/05/kayaking-02-800x600.jpg" },
  { name: "Anjuna & Vagator", count: 12, desc: "Trance parties, flea market, cliffs", image: "https://goatrippackage.com/wp-content/uploads/2026/05/Sunset-800x600.jpeg" },
  { name: "Grand Island", count: 8, desc: "Scuba, snorkelling, boat trips", image: "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=800&q=80&auto=format&fit=crop" },
  { name: "Dudhsagar Falls", count: 6, desc: "Waterfall trek, spice plantation", image: "https://goatrippackage.com/wp-content/uploads/2026/05/Dudh-7.jpg" },
];

// How it works steps
const steps = [
  { step: 1, title: "Browse Experiences", desc: "Explore 100+ curated packages, cruises, yachts & activities", icon: Search },
  { step: 2, title: "Personalise Your Trip", desc: "Pick dates, choose add-ons, or request a custom quote", icon: Calendar },
  { step: 3, title: "Pay Securely", desc: "PayU encrypted payment — full or 25% advance", icon: Shield },
  { step: 4, title: "Enjoy Goa!", desc: "WhatsApp confirmation, pickup details & 24/7 support", icon: Palmtree },
];

const stats = [
  { value: "10,000+", label: "Happy Travellers" },
  { value: "4.8", label: "Average Rating" },
  { value: "50+", label: "Curated Experiences" },
  { value: "9 Years", label: "In Goa" },
];

const testimonials = [
  { name: "Priya & Rahul", location: "Mumbai", text: "The team handled every detail — from airport pickup to the candlelight dinner on our last night. Absolutely magical honeymoon!", rating: 5 },
  { name: "Arjun's Group", location: "Bangalore", text: "Bachelor trip sorted in 30 minutes flat. Quote came on WhatsApp, paid online, yacht was ready on time. Will book again.", rating: 5 },
  { name: "The Sharma Family", location: "Delhi", text: "Family-friendly activities, great hotel recommendations, and the cruise was a hit with the kids. Hassle-free from start to finish.", rating: 5 },
  { name: "Sneha & Amit", location: "Pune", text: "Private yacht sunset was the highlight of our anniversary trip. The crew went above and beyond. Premium experience at fair pricing.", rating: 5 },
  { name: "Vikram's Corporate Team", location: "Hyderabad", text: "Corporate offsite perfectly organized — conference room, beach games, gala dinner. 20 people, zero complaints. Booking again next quarter.", rating: 5 },
  { name: "Meera", location: "Chennai", text: "Solo trip to Goa was stress-free thanks to their planning. Scuba diving at Grande Island was life-changing. Thank you GTP!", rating: 5 },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* ═══ HERO ═══ */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 -z-30">
          <Image
            src="https://goatrippackage.com/wp-content/uploads/2026/05/15-luxury-escape-featured-800x600.jpg"
            alt="Luxury Goa beach resort at sunset"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-cosmic-950/80 via-cosmic-950/50 to-cosmic-950/90" />
        <div className="bg-stars absolute inset-0 -z-10 opacity-50" />

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="gold-divider mx-auto mb-4 w-16" />
          <p className="text-xs uppercase tracking-[0.25em] text-gold mb-4 font-medium">
            Goa&apos;s #1 Trip Planner — Since 2017
          </p>

          <h1 className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
            Your Royal
            <span className="text-gold-gradient block mt-1">Goa Experience</span>
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-text-muted md:text-lg">
            Premium packages, cruises, yachts &amp; adventures — crafted for the moments that matter.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/packages"
              className="inline-flex h-12 items-center justify-center rounded-full bg-gold-gradient px-8 text-sm font-bold text-cosmic-950 shadow-gold transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Browse All Packages
            </Link>
            <Link
              href="/custom-trip"
              className="glass-card inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium text-gold transition-all hover:border-gold-400"
            >
              Get Free Custom Quote
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TRUST STRIP (goatrippackage.com stats) ═══ */}
      <section className="border-y border-border-gold/40 bg-cosmic-900/50 py-6">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-white md:text-3xl">{s.value}</p>
                <p className="mt-0.5 text-[11px] text-text-muted uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY CHOOSE US ═══ */}
      <WhyChooseUs />

      {/* ═══ QUICK FIND BAR ═══ */}
      <section className="py-8 bg-cosmic-950">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {quickFinds.map((q) => (
              <Link
                key={q.label}
                href={q.href}
                className="glass-card flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium text-text-muted transition-all hover:text-gold hover:border-gold/50"
              >
                <span className="text-lg">{q.icon}</span>
                {q.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CRUISES SECTION ═══ */}
      <section className="py-14 bg-cosmic-950">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-gold mb-1">Mandovi River</p>
              <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
                Unforgettable Goa <span className="text-gold-gradient">Cruise</span> Experiences
              </h2>
              <p className="mt-1 text-sm text-text-muted">13 cruises — sunset, dinner, party, dolphin, private</p>
            </div>
            <Link href="/cruises" className="hidden sm:flex items-center gap-1 text-sm text-gold hover:text-gold-200 transition-colors">
              View all 13 <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {cruises.slice(0, 4).map((c) => (
              <ProductCard key={c.slug} slug={c.slug} type={c.type} name={c.name} basePrice={c.basePrice} originalPrice={c.originalPrice} priceUnit={c.priceUnit} duration={c.duration} capacity={c.capacity} location={c.location} rating={c.rating} isFeatured={c.isFeatured} isSelfServe={c.isSelfServe} imageUrl={c.imageUrl} inclusions={c.inclusions} highlights={c.highlights} />
            ))}
          </div>
          <Link href="/cruises" className="mt-6 flex items-center justify-center gap-1 text-sm text-gold sm:hidden">
            View all 13 cruises <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ═══ YACHTS SECTION ═══ */}
      <section className="py-14 border-t border-border-gold/20 bg-cosmic-900/30">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-gold mb-1">Private Luxury</p>
              <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
                Sail the Arabian Sea in <span className="text-gold-gradient">Total Privacy</span>
              </h2>
              <p className="mt-1 text-sm text-text-muted">23 yachts — celebrations, romance, corporate events</p>
            </div>
            <Link href="/yachts" className="hidden sm:flex items-center gap-1 text-sm text-gold hover:text-gold-200 transition-colors">
              View all 23 <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {yachts.slice(0, 4).map((y) => (
              <ProductCard key={y.slug} slug={y.slug} type={y.type} name={y.name} basePrice={y.basePrice} priceUnit={y.priceUnit} duration={y.duration} capacity={y.capacity} location={y.location} rating={y.rating} isFeatured={y.isFeatured} isSelfServe={y.isSelfServe} imageUrl={y.imageUrl} inclusions={y.inclusions} />
            ))}
          </div>
          <Link href="/yachts" className="mt-6 flex items-center justify-center gap-1 text-sm text-gold sm:hidden">
            View all 23 yachts <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ═══ PACKAGES SECTION ═══ */}
      <section className="py-14 border-t border-border-gold/20 bg-cosmic-950">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-gold mb-1">All Inclusive</p>
              <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
                Complete Goa Holiday <span className="text-gold-gradient">Packages</span>
              </h2>
              <p className="mt-1 text-sm text-text-muted">39 packages — honeymoon, family, group, bachelor, corporate</p>
            </div>
            <Link href="/packages" className="hidden sm:flex items-center gap-1 text-sm text-gold hover:text-gold-200 transition-colors">
              View all 39 <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {packages.slice(0, 3).map((p) => (
              <ProductCard key={p.slug} slug={p.slug} type={p.type} name={p.name} basePrice={p.basePrice} originalPrice={p.originalPrice} priceUnit={p.priceUnit} duration={p.duration} location={p.location} rating={p.rating} isFeatured={p.isFeatured} imageUrl={p.imageUrl} inclusions={p.inclusions} highlights={p.highlights} />
            ))}
          </div>
          <Link href="/packages" className="mt-6 flex items-center justify-center gap-1 text-sm text-gold sm:hidden">
            View all 39 packages <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ═══ ACTIVITIES SECTION ═══ */}
      <section className="py-14 border-t border-border-gold/20 bg-cosmic-900/30">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-gold mb-1">Thrill & Adventure</p>
              <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
                Dive Into Goa&apos;s Best <span className="text-gold-gradient">Adventures</span>
              </h2>
              <p className="mt-1 text-sm text-text-muted">18 activities — scuba, parasail, bungee, kayak, helicopter</p>
            </div>
            <Link href="/activities" className="hidden sm:flex items-center gap-1 text-sm text-gold hover:text-gold-200 transition-colors">
              View all 18 <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {activities.slice(0, 4).map((a) => (
              <ProductCard key={a.slug} slug={a.slug} type={a.type} name={a.name} basePrice={a.basePrice} priceUnit={a.priceUnit} duration={a.duration} location={a.location} rating={a.rating} isFeatured={a.isFeatured} isSelfServe={a.isSelfServe} imageUrl={a.imageUrl} inclusions={a.inclusions} />
            ))}
          </div>
          <Link href="/activities" className="mt-6 flex items-center justify-center gap-1 text-sm text-gold sm:hidden">
            View all 18 activities <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ═══ POPULAR DESTINATIONS ═══ */}
      <section className="py-14 border-t border-border-gold/20 bg-cosmic-950">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.15em] text-gold mb-1">Explore by Location</p>
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
              Popular <span className="text-gold-gradient">Destinations</span> in Goa
            </h2>
          </div>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {destinations.map((d) => (
              <div key={d.name} className="group relative overflow-hidden rounded-xl aspect-[3/4] cursor-pointer">
                <Image src={d.image} alt={d.name} fill sizes="(max-width: 768px) 50vw, 16vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-cosmic-950/90 via-cosmic-950/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <h3 className="text-sm font-bold text-white">{d.name}</h3>
                  <p className="text-[10px] text-text-muted mt-0.5">{d.desc}</p>
                  <p className="text-[10px] text-gold mt-1 font-medium">{d.count} experiences</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ OFFERS & DEALS ═══ */}
      <OffersStrip />

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-14 border-t border-border-gold/20 bg-cosmic-900/30">
        <div className="mx-auto max-w-4xl px-4 md:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
              How It <span className="text-gold-gradient">Works</span>
            </h2>
            <p className="mt-2 text-sm text-text-muted">Book your Goa experience in 4 simple steps</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 mb-4">
                    <Icon className="h-7 w-7 text-gold" />
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-xs font-bold text-cosmic-950">{s.step}</span>
                    <h3 className="text-sm font-bold text-white">{s.title}</h3>
                  </div>
                  <p className="text-xs text-text-muted">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES GRID ═══ */}
      <section className="py-14 border-t border-border-gold/20 bg-cosmic-950">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center mb-8">
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
              Explore All <span className="text-gold-gradient">Categories</span>
            </h2>
          </div>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
            {[
              { href: "/packages", label: "Packages", count: "39", icon: Mountain },
              { href: "/cruises", label: "Cruises", count: "13", icon: Ship },
              { href: "/yachts", label: "Yachts", count: "23", icon: Anchor },
              { href: "/activities", label: "Activities", count: "18", icon: Waves },
              { href: "/hotels", label: "Hotels", count: "50", icon: Hotel },
              { href: "/parties", label: "Parties", count: "4", icon: PartyPopper },
              { href: "/search?q=combo", label: "Combos", count: "1", icon: Gem },
              { href: "/custom-trip", label: "Custom Trip", count: "", icon: Globe },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="glass-card group flex flex-col items-center gap-2 rounded-xl px-3 py-4 text-center transition-all hover:border-gold/50 hover:-translate-y-0.5"
                >
                  <Icon className="h-5 w-5 text-gold group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-bold text-white">{cat.label}</span>
                  {cat.count && <span className="text-[10px] text-text-dim">{cat.count}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-14 border-t border-border-gold/20 bg-cosmic-900/30">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
              Verified <span className="text-gold-gradient">Reviews</span>
            </h2>
            <p className="mt-2 text-sm text-text-muted">From our 10,000+ happy travellers</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card rounded-xl p-5">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-sm text-text-muted leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-gold">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-[11px] text-text-dim">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 -z-20">
          <Image
            src="https://goatrippackage.com/wp-content/uploads/2026/05/Sunset-800x600.jpeg"
            alt="Goa sunset cruise"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-cosmic-950/85" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            Ready for an Unforgettable
            <span className="text-gold-gradient block mt-1">Goa Adventure?</span>
          </h2>
          <p className="mt-4 text-text-muted text-base max-w-md mx-auto">
            Tell us what you want. Our planners craft your perfect itinerary and share a quote within 30 minutes on WhatsApp.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/custom-trip"
              className="inline-flex h-12 items-center justify-center rounded-full bg-gold-gradient px-8 text-sm font-bold text-cosmic-950 shadow-gold transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Free Custom Quote
            </Link>
            <a
              href="https://wa.me/919890830249?text=Hi%2C%20I%20want%20to%20plan%20a%20Goa%20trip"
              className="glass-card inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium text-gold"
            >
              WhatsApp Us Directly
            </a>
          </div>
        </div>
      </section>

      <Footer />

      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/919890830249?text=Hi%2C%20I%27m%20interested%20in%20Goa%20Trip%20Package"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-110 active:scale-95 md:bottom-8 md:right-8"
        aria-label="Chat on WhatsApp"
      >
        <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
