import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Users, Star, Shield, Clock, Award, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Goa Trip Package — Goa's #1 trip planner since 2017. 10,000+ happy travellers, 50+ curated experiences, 9 years of local expertise.",
};

const milestones = [
  { year: "2017", title: "Founded in Goa", desc: "Started with 3 cruise partnerships and a dream to make Goa accessible to every Indian traveller." },
  { year: "2019", title: "1,000 Guests Served", desc: "Expanded to packages, yachts, and water activities. Launched partyyachtgoa.com." },
  { year: "2021", title: "Digital Transformation", desc: "Built online booking system, integrated PayU payments, and launched WhatsApp-first customer service." },
  { year: "2023", title: "5,000+ Happy Travellers", desc: "Launched royalcruisegoa.com. Added 50+ hotels to our network. 4.8★ average rating." },
  { year: "2026", title: "10,000+ & Counting", desc: "39 packages, 13 cruises, 23 yachts, 18 activities, 50 hotels. Goa's most comprehensive trip planner." },
];

const values = [
  { icon: Heart, title: "Customer First", desc: "Every decision starts with 'will this make the traveller's experience better?'" },
  { icon: Shield, title: "Trust & Transparency", desc: "No hidden charges, clear inclusions/exclusions, and 100% secure payments." },
  { icon: Star, title: "Quality Over Quantity", desc: "We handpick every hotel, cruise, and activity. If we wouldn't book it, we don't sell it." },
  { icon: Clock, title: "24/7 Availability", desc: "WhatsApp, phone, and email — we're reachable any time, any day." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-cosmic-scene py-20 text-center md:py-28">
        <div className="bg-stars absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <p className="text-sm uppercase tracking-[0.15em] text-gold mb-3">Our Story</p>
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">
            About <span className="text-gold-gradient">Goa Trip Package</span>
          </h1>
          <p className="mt-4 text-lg text-text-muted max-w-lg mx-auto">
            Goa&apos;s #1 trip planner since 2017. We don&apos;t just book trips — we craft experiences.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border-gold/40 bg-cosmic-900/50 py-8">
        <div className="mx-auto max-w-5xl px-4 md:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 text-center">
            <div><p className="text-2xl font-bold text-white">10,000+</p><p className="text-xs text-text-muted mt-0.5">Happy Travellers</p></div>
            <div><p className="text-2xl font-bold text-white">4.8★</p><p className="text-xs text-text-muted mt-0.5">Average Rating</p></div>
            <div><p className="text-2xl font-bold text-white">50+</p><p className="text-xs text-text-muted mt-0.5">Curated Experiences</p></div>
            <div><p className="text-2xl font-bold text-white">9 Years</p><p className="text-xs text-text-muted mt-0.5">Operating in Goa</p></div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-8">
        <div className="glass-card rounded-2xl p-8 md:p-12">
          <h2 className="font-display text-2xl font-bold text-white mb-6">
            From a WhatsApp Number to Goa&apos;s <span className="text-gold">Largest Trip Platform</span>
          </h2>
          <div className="space-y-4 text-sm text-text-muted leading-relaxed">
            <p>
              In 2017, Shivendra Yadav started Goa Trip Package with a simple idea: make Goa&apos;s best experiences accessible to every Indian traveller — without the middleman markup. It began with 3 cruise partnerships and a WhatsApp number.
            </p>
            <p>
              Today, we&apos;re Goa&apos;s most comprehensive trip planner with 39 curated packages, 13 river cruises, 23 luxury yachts, 18 adventure activities, and partnerships with 50+ handpicked hotels. From ₹399 dolphin cruises to ₹50,000 mega yacht events — we cover the full spectrum.
            </p>
            <p>
              What hasn&apos;t changed: every booking still gets personal attention. We don&apos;t use chatbots. We don&apos;t auto-assign agents. Your dedicated planner knows Goa like a local because they are one.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-cosmic-900/30 border-y border-border-gold/20">
        <div className="mx-auto max-w-3xl px-4 md:px-8">
          <h2 className="font-display text-2xl font-bold text-white text-center mb-12">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border-gold/30 md:left-1/2" />
            {milestones.map((m, i) => (
              <div key={m.year} className={`relative flex gap-6 mb-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                <div className="w-8 shrink-0 flex flex-col items-center md:w-1/2 md:items-end md:pr-8">
                  {i % 2 === 0 && <div className="hidden md:block text-right"><p className="text-sm font-bold text-gold">{m.year}</p><p className="text-sm font-medium text-white mt-1">{m.title}</p><p className="text-xs text-text-muted mt-1">{m.desc}</p></div>}
                  {i % 2 !== 0 && <div className="hidden md:block text-left"><p className="text-sm font-bold text-gold">{m.year}</p><p className="text-sm font-medium text-white mt-1">{m.title}</p><p className="text-xs text-text-muted mt-1">{m.desc}</p></div>}
                </div>
                <div className="absolute left-2 md:left-1/2 md:-translate-x-1/2 h-5 w-5 rounded-full bg-gold/20 border-2 border-gold flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-gold" />
                </div>
                <div className="flex-1 pl-8 md:w-1/2 md:pl-8 md:hidden">
                  <p className="text-sm font-bold text-gold">{m.year}</p>
                  <p className="text-sm font-medium text-white mt-1">{m.title}</p>
                  <p className="text-xs text-text-muted mt-1">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-8">
        <h2 className="font-display text-2xl font-bold text-white text-center mb-10">What We Stand For</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="glass-card rounded-xl p-6">
                <Icon className="h-6 w-6 text-gold mb-3" />
                <h3 className="text-sm font-bold text-white mb-1">{v.title}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border-gold/20 bg-cosmic-900/30 py-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-display text-2xl font-bold text-white">Ready to Plan Your Goa Trip?</h2>
          <p className="mt-3 text-sm text-text-muted">Our team responds within 30 minutes on WhatsApp.</p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/custom-trip" className="inline-flex h-11 items-center justify-center rounded-full bg-gold-gradient px-6 text-sm font-bold text-cosmic-950">
              Get Free Quote
            </Link>
            <a href="https://wa.me/919890830249" className="inline-flex h-11 items-center justify-center rounded-full border border-border-gold px-6 text-sm text-gold">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
