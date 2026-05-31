"use client";

import { useState } from "react";
import { Tag, Copy, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const offers = [
  {
    code: "GOAFIRST",
    discount: "15% OFF",
    description: "First booking discount — up to ₹2,000 off",
    validTill: "30 Jun 2026",
    color: "from-gold-600 to-gold",
  },
  {
    code: "MONSOON26",
    discount: "20% OFF",
    description: "Monsoon special — all packages, cruises & yachts",
    validTill: "31 Aug 2026",
    color: "from-emerald-600 to-emerald-400",
  },
  {
    code: "GROUP10",
    discount: "₹1,000 OFF",
    description: "Groups of 10+ — flat discount per person",
    validTill: "31 Dec 2026",
    color: "from-violet-600 to-violet-400",
  },
];

export function OffersStrip() {
  const [copied, setCopied] = useState<string | null>(null);

  function copyCode(code: string) {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(code);
      toast.success(`Code ${code} copied!`);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  return (
    <section className="py-10 bg-cosmic-950">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-gold" />
            <h2 className="text-lg font-bold text-white">Offers & Deals</h2>
          </div>
          <span className="text-xs text-text-dim">Limited time</span>
        </div>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {offers.map((offer) => (
            <div
              key={offer.code}
              className="glass-card flex-shrink-0 w-80 rounded-xl overflow-hidden transition-all hover:border-gold/50"
            >
              {/* Gradient header */}
              <div className={`bg-gradient-to-r ${offer.color} px-5 py-3 flex items-center justify-between`}>
                <span className="text-lg font-black text-white">{offer.discount}</span>
                <span className="text-[10px] font-medium text-white/80">Valid till {offer.validTill}</span>
              </div>
              {/* Body */}
              <div className="p-4">
                <p className="text-sm text-text-muted mb-3">{offer.description}</p>
                <div className="flex items-center justify-between">
                  {/* Code pill with copy */}
                  <button
                    onClick={(e) => { e.preventDefault(); copyCode(offer.code); }}
                    className="flex items-center gap-2 rounded-lg border border-dashed border-gold/50 bg-gold/5 px-3 py-1.5 text-xs font-mono font-bold text-gold hover:bg-gold/10 transition-colors"
                  >
                    {offer.code}
                    {copied === offer.code ? (
                      <Check className="h-3 w-3 text-green-400" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                  <span className="text-[11px] text-gold flex items-center gap-1">
                    Apply at checkout <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
