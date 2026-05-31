"use client";

import { useState } from "react";
import { ChevronDown, Search, MessageCircle, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  { category: "Booking", items: [
    { q: "How do I book a package or cruise?", a: "Browse our catalog, click 'Book Now' for instant booking or 'Get Custom Quote' for a personalised itinerary. You can also WhatsApp us at +91 98908 30249 and our planner will handle everything." },
    { q: "Can I customise my package?", a: "Absolutely! Use our 'Plan Custom Trip' page or tell us what you want on WhatsApp. Our planner builds a day-wise itinerary and shares a quote link within 30 minutes." },
    { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, UPI, net banking, and wallets through PayU (256-bit encrypted). You can also pay via bank transfer for large bookings." },
    { q: "Can I pay in instalments?", a: "Yes! You can pay 25% advance to confirm your booking and the balance before your travel date. We send payment reminders via WhatsApp." },
    { q: "Do I get a confirmation after booking?", a: "Yes — instant confirmation on WhatsApp + email with your booking ID, PDF voucher, and all details. You can track your booking anytime at /my-booking." },
  ]},
  { category: "Cancellation & Refund", items: [
    { q: "What is your cancellation policy?", a: "Free cancellation up to 48 hours before the experience. 25% cancellation fee within 48 hours. No refund for no-shows. Some premium experiences may have different policies — check the product page for details." },
    { q: "How do I cancel my booking?", a: "WhatsApp us at +91 98908 30249 with your booking ID, or email info@goatrippackage.com. Cancellations are processed within 2 hours during business hours." },
    { q: "How long does a refund take?", a: "Refunds are initiated within 24 hours of cancellation approval. PayU refunds take 5-7 business days to reflect. Bank transfers take 3-5 business days." },
  ]},
  { category: "Travel & Experience", items: [
    { q: "What should I carry for water activities?", a: "Swimwear, towel, sunscreen (reef-safe), a change of clothes, and waterproof phone cover. All safety equipment (life jackets, helmets, etc.) is provided." },
    { q: "Are your cruises/yachts safe for children?", a: "Yes! All our vessels are certified, have life jackets for all sizes, and trained crew. Family-specific cruises like Dolphin Sightseeing are especially kid-friendly." },
    { q: "Do you provide airport pickup?", a: "Yes — included in most packages. For standalone bookings, airport transfers can be added at ₹800–₹2,500 depending on distance." },
    { q: "What happens if it rains on my activity day?", a: "Water activities may be rescheduled for safety. Cruises operate in light rain. We'll notify you and reschedule free of charge, or offer a full refund." },
  ]},
  { category: "Account & Support", items: [
    { q: "How do I track my booking?", a: "Visit /my-booking, enter your booking ID and phone number. You can see all details, payment history, and download your voucher." },
    { q: "What are your support hours?", a: "WhatsApp: 24/7 (avg response 15 min). Phone: 8 AM–11 PM IST. Email: response within 4 hours during business days." },
    { q: "Can I book for a group?", a: "Yes! We handle groups of 2 to 200+. For groups over 10, we offer special pricing. Contact us for a custom group quote." },
  ]},
];

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [openItem, setOpenItem] = useState<string | null>(null);

  const filteredFaqs = search
    ? faqs.map((cat) => ({ ...cat, items: cat.items.filter((i) => i.q.toLowerCase().includes(search.toLowerCase()) || i.a.toLowerCase().includes(search.toLowerCase())) })).filter((cat) => cat.items.length > 0)
    : faqs;

  return (
    <div className="min-h-screen">
      <section className="relative bg-cosmic-scene py-20 text-center md:py-28">
        <div className="bg-stars absolute inset-0" />
        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <p className="text-sm uppercase tracking-[0.15em] text-gold mb-3">Support</p>
          <h1 className="font-display text-4xl font-bold text-white md:text-5xl">Help & <span className="text-gold-gradient">FAQ</span></h1>
          <div className="relative mt-8 max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-dim" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for answers..." className="w-full h-12 rounded-xl bg-surface border border-border-gold pl-12 pr-4 text-white placeholder:text-text-dim focus:border-gold focus:ring-1 focus:ring-gold transition-colors" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 md:px-8">
        {filteredFaqs.map((cat) => (
          <div key={cat.category} className="mb-8">
            <h2 className="text-sm font-bold text-gold uppercase tracking-wider mb-4">{cat.category}</h2>
            <div className="space-y-2">
              {cat.items.map((item) => {
                const key = `${cat.category}-${item.q}`;
                const isOpen = openItem === key;
                return (
                  <div key={key} className="glass-card rounded-xl overflow-hidden">
                    <button onClick={() => setOpenItem(isOpen ? null : key)} className="flex w-full items-center justify-between px-5 py-4 text-left">
                      <span className="text-sm font-medium text-white pr-4">{item.q}</span>
                      <ChevronDown className={cn("h-4 w-4 text-gold shrink-0 transition-transform", isOpen && "rotate-180")} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 border-t border-border-gold/20 pt-3">
                        <p className="text-sm text-text-muted leading-relaxed">{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-muted mb-4">No results found for &ldquo;{search}&rdquo;</p>
            <a href="https://wa.me/919890830249" className="text-sm text-gold hover:text-gold-200">Ask us on WhatsApp →</a>
          </div>
        )}
      </section>

      {/* Still need help? */}
      <section className="border-t border-border-gold/20 bg-cosmic-900/30 py-12">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-lg font-bold text-white mb-6">Still need help?</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <a href="https://wa.me/919890830249" className="glass-card rounded-xl p-5 text-center hover:border-gold/50 transition-all">
              <MessageCircle className="h-6 w-6 text-gold mx-auto mb-2" />
              <p className="text-sm font-medium text-white">WhatsApp</p>
              <p className="text-xs text-text-dim mt-0.5">Avg. 15 min response</p>
            </a>
            <a href="tel:+919890830249" className="glass-card rounded-xl p-5 text-center hover:border-gold/50 transition-all">
              <Phone className="h-6 w-6 text-gold mx-auto mb-2" />
              <p className="text-sm font-medium text-white">Call Us</p>
              <p className="text-xs text-text-dim mt-0.5">8 AM — 11 PM IST</p>
            </a>
            <a href="mailto:info@goatrippackage.com" className="glass-card rounded-xl p-5 text-center hover:border-gold/50 transition-all">
              <Mail className="h-6 w-6 text-gold mx-auto mb-2" />
              <p className="text-sm font-medium text-white">Email</p>
              <p className="text-xs text-text-dim mt-0.5">Within 4 hours</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
