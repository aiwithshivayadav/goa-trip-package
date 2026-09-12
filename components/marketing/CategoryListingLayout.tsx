import { Shield, IndianRupee, Clock, Headphones, Sparkles } from "lucide-react";
import { ProductListingFilters } from "./ProductListingFilters";
import { ScrollReveal } from "./ScrollReveal";
import type { ProductData } from "@/lib/data/db-products";

export interface CategoryConfig {
  eyebrow: string;
  titleMain: string;
  titleAccent: string;
  subtitle: string;
  categoryLabel: string;
  gradientAngle?: string;
}

interface Props {
  products: ProductData[];
  config: CategoryConfig;
}

const trustBadges = [
  { icon: IndianRupee, label: "Best Price Guarantee" },
  { icon: Shield, label: "100% Secure Payments" },
  { icon: Clock, label: "Instant Confirmation" },
  { icon: Headphones, label: "24/7 Support" },
  { icon: Sparkles, label: "Curated by Experts" },
];

export function CategoryListingLayout({ products, config }: Props) {
  const gradientAngle = config.gradientAngle ?? "70% 20%";

  return (
    <div className="min-h-screen bg-ground">
      {/* ── Cinematic hero ── */}
      <section className="relative overflow-hidden bg-abyss">
        {/* Layered gradient background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at ${gradientAngle}, rgba(26,142,125,0.2), transparent 60%)`,
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(198,139,63,0.08),transparent_50%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-lagoon/30 to-transparent" />
        </div>

        {/* Decorative grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        <div className="relative z-10 mx-auto max-w-5xl px-6 py-20 text-center md:py-28 lg:py-32">
          {/* Eyebrow */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-lagoon/30 bg-lagoon/10 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-lagoon animate-pulse" />
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-lagoon-100">
              {config.eyebrow}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl lg:text-[3.5rem] leading-tight">
            {config.titleMain}{" "}
            <span className="bg-gradient-to-r from-lagoon-100 to-lagoon bg-clip-text text-transparent">
              {config.titleAccent}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-5 max-w-xl text-base text-white/60 md:text-lg leading-relaxed">
            {config.subtitle}
          </p>

          {/* Count badge */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2">
            <span className="text-sm font-bold text-white">{products.length}</span>
            <span className="text-sm text-white/50">experiences available</span>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-8 md:h-10" preserveAspectRatio="none">
            <path d="M0 40V20C240 0 480 0 720 20C960 40 1200 40 1440 20V40H0Z" fill="var(--color-ground)" />
          </svg>
        </div>
      </section>

      {/* ── Trust strip ── */}
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

      {/* ── Product grid ── */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <ScrollReveal>
          <ProductListingFilters products={products} categoryLabel={config.categoryLabel} />
        </ScrollReveal>
      </section>
    </div>
  );
}
