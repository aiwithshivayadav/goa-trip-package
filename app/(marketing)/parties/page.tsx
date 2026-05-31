import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { WhyChooseUs } from "@/components/marketing/WhyChooseUs";
import { MapPin, Users, Star, ArrowRight } from "lucide-react";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Goa Parties — Nightlife, Casino, Yacht Party, Bachelorette",
  description:
    "4 premium party experiences in Goa — Tito's Lane nightlife, Deltin Royale casino, birthday yacht party, bachelorette yacht party. Book now.",
};

const parties = [
  {
    slug: "titos-lane-night-baga",
    name: "Tito's Lane Night — Baga",
    desc: "Experience Goa's legendary nightlife strip. Club hopping at Tito's, Mambo's, and Cape Town Cafe with VIP entry.",
    price: 1499,
    priceUnit: "per person",
    image: "https://goatrippackage.com/wp-content/uploads/2026/05/Royal-cruise-photos-3.png",
    location: "Baga, North Goa",
    capacity: "2-20 guests",
    rating: 4.6,
  },
  {
    slug: "deltin-royale-casino-floating-casino-pass",
    name: "Deltin Royale Casino — Floating Casino Pass",
    desc: "Asia's largest offshore casino. Unlimited gaming, live entertainment, premium buffet dinner & drinks included.",
    price: 3500,
    priceUnit: "per person",
    image: "https://goatrippackage.com/wp-content/uploads/2026/05/Princesa-2-800x600.jpg",
    location: "Mandovi River, Panjim",
    capacity: "1-10 guests",
    rating: 4.8,
  },
  {
    slug: "birthday-on-a-yacht-goa",
    name: "Birthday on a Yacht",
    desc: "Celebrate your birthday on a private yacht. Cake, decorations, DJ, photography & catering coordination included.",
    price: 25000,
    priceUnit: "per event",
    image: "https://goatrippackage.com/wp-content/uploads/2026/05/Manta-Ray-1-800x600.jpeg",
    location: "Panjim Jetty",
    capacity: "8-25 guests",
    rating: 4.9,
  },
  {
    slug: "bachelorette-bachelor-yacht-party-goa",
    name: "Bachelor/ette Yacht Party",
    desc: "The ultimate pre-wedding celebration on water. Private yacht, DJ, bar setup, decorations & photographer.",
    price: 30000,
    priceUnit: "per event",
    image: "https://goatrippackage.com/wp-content/uploads/2026/05/Fun-Liner-1-800x600.jpeg",
    location: "Panjim Jetty",
    capacity: "10-30 guests",
    rating: 5.0,
  },
];

export default function PartiesPage() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-cosmic-scene py-16 text-center md:py-24">
        <div className="bg-stars absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <p className="text-sm uppercase tracking-[0.15em] text-gold mb-3">Premium Nightlife</p>
          <h1 className="font-display text-3xl font-bold text-white md:text-5xl lg:text-6xl">
            Goa <span className="text-gold-gradient">Parties</span>
          </h1>
          <p className="mt-4 text-lg text-text-muted max-w-lg mx-auto">
            Nightlife, casino, yacht birthday, bachelorette — {parties.length} premium experiences.
          </p>
        </div>
      </section>

      <WhyChooseUs />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="mb-6">
          <p className="text-sm text-text-muted">
            <span className="text-white font-bold">ALL PARTIES</span>
            <span className="text-gold ml-1">({parties.length})</span>
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {parties.map((party) => (
            <Link
              key={party.slug}
              href={`/custom-trip?package=${party.slug}`}
              className="group glass-card rounded-2xl overflow-hidden transition-all hover:border-gold/50 hover:shadow-gold hover:-translate-y-1"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 h-48 sm:h-auto shrink-0 overflow-hidden">
                  <Image src={party.image} alt={party.name} fill sizes="(max-width: 640px) 100vw, 192px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-cosmic-950/30 sm:block hidden" />
                </div>
                <div className="flex-1 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-gold/70">Party</span>
                    <span className="flex items-center gap-1 rounded bg-green-500/20 px-1.5 py-0.5 text-[11px] font-bold text-green-400">
                      <Star className="h-3 w-3 fill-green-400" /> {party.rating}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-gold transition-colors">{party.name}</h3>
                  <p className="mt-1.5 text-sm text-text-muted line-clamp-2">{party.desc}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-text-dim">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {party.location}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {party.capacity}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border-gold/30 pt-3">
                    <div>
                      <span className="text-xl font-bold text-white">{formatINR(party.price)}</span>
                      <span className="text-[11px] text-text-dim ml-1">/ {party.priceUnit}</span>
                    </div>
                    <span className="rounded-lg border border-gold/60 bg-gold/10 px-3 py-1.5 text-[11px] font-bold text-gold group-hover:bg-gold/20 transition-colors">
                      Enquire Now <ArrowRight className="inline h-3 w-3 ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
