import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { WhyChooseUs } from "@/components/marketing/WhyChooseUs";
import { OffersStrip } from "@/components/marketing/OffersStrip";
import { Anchor, Sailboat, Waves, Mountain, Hotel, PartyPopper, ArrowRight, Star, Shield, Headphones, Users } from "lucide-react";

/**
 * Homepage — the flagship page
 * Sections: Hero → Featured Cruises → Plan Your Way → Trust Strip →
 *           Featured Experiences → Testimonials → Newsletter → Footer
 */

// Featured cruises with real images from goatrippackage.com
const featuredCruises = [
  { slug: "royal-cruise-night-party", name: "Royal Cruise — Night Party", price: 2000, duration: "3 hrs", image: "https://goatrippackage.com/wp-content/uploads/2026/05/Royal-cruise-photos-3.png" },
  { slug: "sunset-dinner-cruise", name: "Sunset Dinner Cruise", price: 1200, duration: "2 hrs", image: "https://goatrippackage.com/wp-content/uploads/2026/05/Sunset-800x600.jpeg" },
  { slug: "dolphin-sightseeing-cruise", name: "Dolphin Sightseeing Cruise", price: 399, duration: "1 hr", image: "https://goatrippackage.com/wp-content/uploads/2026/05/dolphin-02-800x600.jpg" },
  { slug: "premium-party-cruise", name: "Premium Party Cruise", price: 1500, duration: "2.5 hrs", image: "https://goatrippackage.com/wp-content/uploads/2026/05/Princesa-2-800x600.jpg" },
];

const categories = [
  { href: "/packages", label: "Packages", desc: "30+ curated itineraries", icon: Mountain },
  { href: "/cruises", label: "Cruises", desc: "12 river experiences", icon: Sailboat },
  { href: "/yachts", label: "Yachts", desc: "14 luxury charters", icon: Anchor },
  { href: "/activities", label: "Activities", desc: "15+ adventures", icon: Waves },
  { href: "/hotels", label: "Hotels", desc: "Handpicked stays", icon: Hotel },
  { href: "/parties", label: "Parties", desc: "Premium nightlife", icon: PartyPopper },
];

const stats = [
  { value: "1,200+", label: "Happy Guests", icon: Users },
  { value: "4.9", label: "Average Rating", icon: Star },
  { value: "100%", label: "Secure Payments", icon: Shield },
  { value: "24/7", label: "Concierge Support", icon: Headphones },
];

const testimonials = [
  { name: "Priya & Rahul", location: "Mumbai", text: "Our honeymoon was absolutely magical. The yacht at sunset was the highlight of our trip. Can't recommend enough!", rating: 5 },
  { name: "Arjun Group", location: "Bangalore", text: "Bachelor trip sorted in 30 minutes. Quote came on WhatsApp, paid online, everything was organized perfectly.", rating: 5 },
  { name: "The Sharma Family", location: "Delhi", text: "Family-friendly activities, great hotel recommendations, and the cruise was a hit with the kids. Will book again!", rating: 5 },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* ═══ HERO ═══ */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden pt-20">
        {/* Full-bleed hero image */}
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
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-cosmic-950/80 via-cosmic-950/60 to-cosmic-950/90" />
        <div className="bg-stars absolute inset-0 -z-10 opacity-60" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="gold-divider mx-auto mb-6 w-16" />
          <p className="text-sm uppercase tracking-[0.2em] text-gold mb-6">
            Premium Goa Experiences
          </p>

          <h1 className="font-display text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl">
            Your Royal
            <span className="text-gold-gradient block mt-2">Goa Experience</span>
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-text-muted md:text-xl">
            Packages, cruises, yachts &amp; adventures — crafted for the moments that matter.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/packages"
              className="inline-flex h-13 items-center justify-center rounded-full bg-gold-gradient px-8 text-sm font-bold text-cosmic-950 shadow-gold transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Browse Packages
            </Link>
            <Link
              href="/custom-trip"
              className="glass-card inline-flex h-13 items-center justify-center rounded-full px-8 text-sm font-medium text-gold transition-all hover:border-gold-400"
            >
              Plan Custom Trip
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-8 w-5 rounded-full border-2 border-gold/40 flex items-start justify-center pt-1.5">
            <div className="h-2 w-1 rounded-full bg-gold/60" />
          </div>
        </div>
      </section>

      {/* ═══ WHY CHOOSE US (EaseMyTrip-style benefit strip) ═══ */}
      <WhyChooseUs />

      {/* ═══ FEATURED CRUISES (horizontal scroll) ═══ */}
      <section className="border-y border-border-gold bg-cosmic-900/50 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-white md:text-3xl">
                Featured <span className="text-gold">Cruises</span>
              </h2>
              <p className="mt-1 text-sm text-text-muted">Most popular experiences on the Mandovi</p>
            </div>
            <Link href="/cruises" className="hidden sm:flex items-center gap-1 text-sm text-gold hover:text-gold-200 transition-colors">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {featuredCruises.map((cruise) => (
              <Link
                key={cruise.slug}
                href={`/cruises/${cruise.slug}`}
                className="glass-card group flex-shrink-0 w-72 snap-start rounded-xl overflow-hidden transition-all hover:border-gold/50 hover:shadow-gold"
              >
                {/* Cruise image */}
                <div className="h-36 relative overflow-hidden bg-cosmic-800">
                  {cruise.image && (
                    <Image
                      src={cruise.image}
                      alt={cruise.name}
                      fill
                      sizes="288px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-cosmic-950/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 rounded-full bg-cosmic-950/80 backdrop-blur-sm px-3 py-1 text-xs text-text-muted">
                    {cruise.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white text-sm group-hover:text-gold transition-colors line-clamp-1">
                    {cruise.name}
                  </h3>
                  <p className="mt-2 text-sm">
                    <span className="font-bold text-white">₹{cruise.price.toLocaleString("en-IN")}</span>
                    <span className="text-text-dim ml-1">/ person</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <Link href="/cruises" className="mt-4 flex items-center justify-center gap-1 text-sm text-gold sm:hidden">
            View all cruises <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* ═══ OFFERS & DEALS (EaseMyTrip-style promo codes) ═══ */}
      <OffersStrip />

      {/* ═══ CATEGORIES GRID ═══ */}
      <section className="py-20 bg-cosmic-950">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              Explore <span className="text-gold-gradient">Goa</span>
            </h2>
            <p className="mt-3 text-text-muted">Everything you need for the perfect trip</p>
          </div>

          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="glass-card group flex flex-col items-center gap-3 rounded-xl p-6 text-center transition-all hover:border-gold/50 hover:shadow-gold hover:-translate-y-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold group-hover:bg-gold/20 transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{cat.label}</h3>
                    <p className="mt-0.5 text-xs text-text-dim">{cat.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ TRUST STRIP ═══ */}
      <section className="border-y border-border-gold bg-cosmic-900/30 py-12">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <Icon className="mx-auto h-6 w-6 text-gold mb-2" />
                  <p className="text-2xl font-bold text-white md:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-xs text-text-muted uppercase tracking-wider">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-20 bg-cosmic-950">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
              What Our <span className="text-gold-gradient">Guests</span> Say
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card rounded-xl p-6">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-sm text-text-muted leading-relaxed italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-gold">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-text-dim">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 -z-20">
          <Image
            src="https://goatrippackage.com/wp-content/uploads/2026/05/Sunset-800x600.jpeg"
            alt="Goa sunset cruise experience"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-cosmic-950/85" />
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="gold-divider mx-auto mb-8 w-16" />
          <h2 className="font-display text-3xl font-bold text-white md:text-5xl">
            Ready to Experience
            <span className="text-gold-gradient block mt-1">Royal Goa?</span>
          </h2>
          <p className="mt-4 text-text-muted text-lg max-w-md mx-auto">
            Tell us what you want. Our planners craft your perfect itinerary in 30 minutes.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/custom-trip"
              className="inline-flex h-13 items-center justify-center rounded-full bg-gold-gradient px-8 text-sm font-bold text-cosmic-950 shadow-gold transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Plan My Trip — Free Quote
            </Link>
            <a
              href="https://wa.me/919890830249?text=Hi%2C%20I%20want%20to%20plan%20a%20Goa%20trip"
              className="glass-card inline-flex h-13 items-center justify-center rounded-full px-8 text-sm font-medium text-gold"
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
