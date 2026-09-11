"use client";

import { useState } from "react";
import { Star, ThumbsUp, ChevronDown } from "lucide-react";

interface Review {
  name: string;
  initial: string;
  rating: number;
  date: string;
  text: string;
  helpful?: number;
}

const REVIEWS: Review[] = [
  {
    name: "Priya Sharma",
    initial: "PS",
    rating: 5,
    date: "2 weeks ago",
    text: "Amazing dinner cruise experience on the Princesa! The sunset views were breathtaking and the food was delicious. Staff was very friendly and helpful. Highly recommend for couples and families.",
    helpful: 14,
  },
  {
    name: "Rahul Mehta",
    initial: "RM",
    rating: 5,
    date: "1 month ago",
    text: "Best cruise experience in Goa! We booked the Royal cruise for our anniversary and it exceeded all expectations. The DJ, unlimited drinks, and the Mandovi river views made it unforgettable.",
    helpful: 22,
  },
  {
    name: "Ananya Desai",
    initial: "AD",
    rating: 4,
    date: "3 weeks ago",
    text: "Had a wonderful time on the party yacht. The music was great and the crew was very professional. Only giving 4 stars because it was a bit crowded on a Saturday. Book on weekdays if possible!",
    helpful: 8,
  },
  {
    name: "Vikram Singh",
    initial: "VS",
    rating: 5,
    date: "2 months ago",
    text: "Booked the Goa trip package through GoaTripPackage and everything was perfectly organized. Hotel pickup, cruise booking, water activities — all handled seamlessly. Great value for money!",
    helpful: 31,
  },
  {
    name: "Meera Patel",
    initial: "MP",
    rating: 5,
    date: "1 week ago",
    text: "The sunset cruise was magical! Perfect weather, great food, and the team went above and beyond. The booking process was super smooth and the WhatsApp support was very responsive.",
    helpful: 6,
  },
  {
    name: "Arjun Nair",
    initial: "AN",
    rating: 5,
    date: "3 months ago",
    text: "We organized a corporate team outing and it was one of the best events we've had. The team accommodated all our requests and the cruise was spectacular. Will definitely book again!",
    helpful: 19,
  },
];

const OVERALL = {
  rating: 4.8,
  total: 1247,
  distribution: [
    { stars: 5, pct: 78 },
    { stars: 4, pct: 15 },
    { stars: 3, pct: 4 },
    { stars: 2, pct: 2 },
    { stars: 1, pct: 1 },
  ],
};

function Stars({ count, size = 14 }: { count: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={
            i < count
              ? "fill-amber text-amber"
              : "fill-none text-gray-300"
          }
        />
      ))}
    </span>
  );
}

export function GoogleReviews() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? REVIEWS : REVIEWS.slice(0, 3);

  return (
    <div>
      <h2 className="text-lg font-bold text-ink mb-5 flex items-center gap-2">
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Google Reviews
      </h2>

      <div className="rounded-xl border border-border-warm bg-white p-5 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <div className="text-center sm:text-left shrink-0">
            <p className="text-4xl font-bold text-ink">{OVERALL.rating}</p>
            <Stars count={Math.round(OVERALL.rating)} size={16} />
            <p className="text-xs text-gray-400 mt-1">{OVERALL.total.toLocaleString()} reviews</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {OVERALL.distribution.map((d) => (
              <div key={d.stars} className="flex items-center gap-2 text-xs">
                <span className="w-3 text-gray-400 text-right">{d.stars}</span>
                <Star className="h-3 w-3 fill-amber text-amber" />
                <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
                <span className="w-8 text-gray-400 text-right">{d.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {visible.map((r) => (
          <div key={r.name} className="rounded-xl border border-border-warm bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lagoon-50 text-xs font-bold text-lagoon">
                {r.initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-ink">{r.name}</p>
                  <span className="text-[10px] text-gray-400 shrink-0 ml-2">{r.date}</span>
                </div>
                <Stars count={r.rating} size={12} />
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{r.text}</p>
                {r.helpful != null && r.helpful > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400">
                    <ThumbsUp className="h-3 w-3" /> {r.helpful} found this helpful
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {REVIEWS.length > 3 && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-border-warm bg-ground py-2.5 text-xs font-medium text-lagoon transition-colors hover:border-lagoon/40"
        >
          {showAll ? "Show less" : `Show all ${REVIEWS.length} reviews`}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAll ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
}
