import { Shield, IndianRupee, Clock, Headphones, Sparkles } from "lucide-react";

const benefits = [
  { icon: IndianRupee, title: "Best Price Guarantee", desc: "Lowest prices or we match it" },
  { icon: Shield, title: "100% Secure", desc: "PayU encrypted payments" },
  { icon: Clock, title: "Instant Confirmation", desc: "Booking confirmed in minutes" },
  { icon: Headphones, title: "24/7 Support", desc: "WhatsApp + phone support" },
  { icon: Sparkles, title: "Curated Experiences", desc: "Handpicked by local experts" },
];

export function WhyChooseUs() {
  return (
    <section className="border-y border-border-warm bg-ground py-8">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex items-center justify-center gap-6 overflow-x-auto scrollbar-hide md:gap-10">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="flex shrink-0 items-center gap-3 py-1"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-lagoon-50">
                  <Icon className="h-5 w-5 text-lagoon" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-ink whitespace-nowrap">{b.title}</p>
                  <p className="text-[10px] text-gray-400 whitespace-nowrap">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
