/**
 * Product data — hardcoded for Phase B (will move to DB in Phase E)
 * Sourced from goatrippackage.com WordPress CPTs + PRD §3.1
 */

export interface ProductData {
  slug: string;
  type: "package" | "cruise" | "yacht" | "activity" | "hotel" | "party";
  name: string;
  shortDesc: string;
  basePrice: number;
  priceUnit: string;
  duration?: string;
  durationDays?: number;
  capacity?: string;
  location?: string;
  rating?: number;
  isFeatured?: boolean;
  isSelfServe?: boolean;
  isQuoteLed?: boolean;
  imageUrl?: string;
  inclusions?: string[];
  exclusions?: string[];
  itinerary?: { day: number; title: string; description: string }[];
}

// ═══════════════════════════════════════════════════════════════
// PACKAGES (30+)
// ═══════════════════════════════════════════════════════════════
export const packages: ProductData[] = [
  {
    slug: "goa-honeymoon-classic-3n4d",
    type: "package",
    name: "Goa Honeymoon Classic — 3N/4D",
    shortDesc: "Romantic beaches, sunset cruise, candlelight dinner, and private transfers for newlyweds.",
    basePrice: 12999,
    priceUnit: "per couple",
    duration: "3N / 4D",
    durationDays: 4,
    location: "North & South Goa",
    rating: 4.9,
    isFeatured: true,
    isQuoteLed: true,
    imageUrl: "https://goatrippackage.com/wp-content/uploads/2026/05/08-honeymoon-standard-featured-800x600.jpg",
    inclusions: ["3-star hotel (AC room)", "Breakfast daily", "Airport pickup & drop", "Sunset cruise for 2", "Candlelight dinner", "North Goa sightseeing", "South Goa sightseeing"],
    exclusions: ["Flights", "Lunch & dinner (except candlelight)", "Water activities", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Arrival & Beach Evening", description: "Airport pickup, hotel check-in, evening at Calangute/Baga beach, dinner at a beach shack." },
      { day: 2, title: "North Goa Sightseeing", description: "Fort Aguada, Vagator, Anjuna flea market, Chapora Fort, sunset at Ozran beach." },
      { day: 3, title: "Sunset Cruise & Candlelight Dinner", description: "Morning free, afternoon Mandovi River cruise, evening candlelight dinner at a premium restaurant." },
      { day: 4, title: "South Goa & Departure", description: "Old Goa churches, Miramar beach, Dona Paula viewpoint, airport drop." },
    ],
  },
  {
    slug: "goa-honeymoon-premium-4n5d",
    type: "package",
    name: "Goa Honeymoon Premium — 4N/5D",
    shortDesc: "5-star stay, private yacht, spa session, and curated experiences for the perfect honeymoon.",
    basePrice: 29999,
    priceUnit: "per couple",
    duration: "4N / 5D",
    durationDays: 5,
    location: "North & South Goa",
    rating: 5.0,
    isFeatured: true,
    isQuoteLed: true,
    imageUrl: "https://goatrippackage.com/wp-content/uploads/2026/05/09-premium-honeymoon-featured-800x600.jpg",
    inclusions: ["5-star resort (sea-view room)", "All meals (MAP)", "Private airport transfers", "Private yacht (2 hrs)", "Couple spa session", "Sunset cruise premium", "South Goa heritage tour", "Candlelight dinner on beach"],
    exclusions: ["Flights", "Water activities", "Personal shopping", "Tips"],
  },
  {
    slug: "goa-family-fun-3n4d",
    type: "package",
    name: "Goa Family Fun — 3N/4D",
    shortDesc: "Kid-friendly beaches, dolphin trip, spice plantation, and sightseeing for the whole family.",
    basePrice: 8999,
    priceUnit: "per person",
    duration: "3N / 4D",
    durationDays: 4,
    location: "North & South Goa",
    rating: 4.8,
    isQuoteLed: true,
    imageUrl: "https://goatrippackage.com/wp-content/uploads/2026/05/14-family-premium-featured-800x600.jpg",
    inclusions: ["3-star family hotel", "Breakfast daily", "Airport transfers", "Dolphin sightseeing", "Spice plantation visit", "North & South Goa tour"],
    exclusions: ["Flights", "Lunch & dinner", "Water sports", "Personal expenses"],
  },
  {
    slug: "goa-group-trip-bachelor-3n4d",
    type: "package",
    name: "Goa Bachelor Group — 3N/4D",
    shortDesc: "Party cruise, nightclub entry, beach hopping, and all-boys adventures in Goa.",
    basePrice: 5999,
    priceUnit: "per person",
    duration: "3N / 4D",
    durationDays: 4,
    location: "North Goa",
    rating: 4.7,
    isFeatured: true,
    isQuoteLed: true,
    imageUrl: "https://goatrippackage.com/wp-content/uploads/2026/05/05-group-departure-featured-800x600.jpg",
    inclusions: ["Hostel/hotel (AC room)", "Party cruise ticket", "Tito's + Club Cubana entry", "North Goa sightseeing", "Bike rental (1 day)", "Airport pickup"],
    exclusions: ["Flights", "Meals", "Drinks at clubs", "Personal expenses"],
  },
  {
    slug: "goa-corporate-offsite-2n3d",
    type: "package",
    name: "Corporate Offsite — 2N/3D",
    shortDesc: "Team building, conference setup, beach games, and networking dinner for corporate groups.",
    basePrice: 7499,
    priceUnit: "per person",
    duration: "2N / 3D",
    durationDays: 3,
    location: "North Goa",
    rating: 4.6,
    isQuoteLed: true,
    imageUrl: "https://goatrippackage.com/wp-content/uploads/2026/05/13-complete-explorer-featured-800x600.jpg",
    inclusions: ["4-star resort", "Conference room (AV setup)", "All meals", "Team building activities", "Beach games session", "Gala dinner", "Airport transfers"],
    exclusions: ["Flights", "Alcohol", "Personal expenses"],
  },
  {
    slug: "goa-budget-backpacker-2n3d",
    type: "package",
    name: "Budget Backpacker — 2N/3D",
    shortDesc: "Hostels, bike rental, beach vibes, and local food — maximum Goa at minimum cost.",
    basePrice: 3499,
    priceUnit: "per person",
    duration: "2N / 3D",
    durationDays: 3,
    location: "North Goa",
    rating: 4.5,
    isQuoteLed: true,
    imageUrl: "https://goatrippackage.com/wp-content/uploads/2026/05/10-adventure-culture-featured-800x600.jpg",
    inclusions: ["Hostel bed (AC dorm)", "Bike rental (2 days)", "North Goa map guide", "Airport pickup"],
    exclusions: ["Flights", "Meals", "Activities", "Personal expenses"],
  },
];

// ═══════════════════════════════════════════════════════════════
// CRUISES (12)
// ═══════════════════════════════════════════════════════════════
export const cruises: ProductData[] = [
  {
    slug: "royal-cruise-night-party",
    type: "cruise",
    name: "Royal Cruise — Floating Night Party",
    shortDesc: "Goa's most premium floating night party. Live DJ, premium bar, 2 drink coupons, tequila shots & dinner buffet.",
    basePrice: 2000,
    priceUnit: "per person",
    duration: "3 hrs (8:30–11:30 PM)",
    capacity: "200 guests",
    location: "Mandovi River, Panjim",
    rating: 4.9,
    isFeatured: true,
    isSelfServe: true,
    isQuoteLed: true,
    imageUrl: "https://goatrippackage.com/wp-content/uploads/2026/05/Royal-cruise-photos-3.png",
    inclusions: ["Live DJ performance", "2 drink coupons (IMFL/beer)", "Tequila shots", "Full dinner buffet", "Royal interiors & lighting", "Dance floor"],
    exclusions: ["Extra drinks beyond 2 coupons", "Camera/photography charges", "Transportation to jetty"],
  },
  {
    slug: "sunset-dinner-cruise",
    type: "cruise",
    name: "Sunset Dinner Cruise",
    shortDesc: "Watch the golden Goa sunset over the Mandovi with live music and a lavish dinner buffet.",
    basePrice: 1200,
    priceUnit: "per person",
    duration: "2 hrs (6:00–8:00 PM)",
    capacity: "150 guests",
    location: "Mandovi River, Panjim",
    rating: 4.8,
    isFeatured: true,
    isSelfServe: true,
    imageUrl: "https://goatrippackage.com/wp-content/uploads/2026/05/Sunset-800x600.jpeg",
    inclusions: ["Sunset views", "Live Goan music", "Dinner buffet", "Welcome drink", "DJ music"],
    exclusions: ["Alcohol (available for purchase)", "Transportation"],
  },
  {
    slug: "dolphin-sightseeing-cruise",
    type: "cruise",
    name: "Dolphin Sightseeing Cruise",
    shortDesc: "Morning cruise to spot dolphins in their natural habitat. Perfect for families and nature lovers.",
    basePrice: 399,
    priceUnit: "per person",
    duration: "1 hr (7:00–8:00 AM)",
    capacity: "30 guests",
    location: "Sinquerim Beach",
    rating: 4.6,
    isSelfServe: true,
    imageUrl: "https://goatrippackage.com/wp-content/uploads/2026/05/dolphin-02-800x600.jpg",
    inclusions: ["Dolphin spotting", "Life jackets", "Guide commentary", "Fort Aguada views"],
    exclusions: ["Breakfast", "Transportation", "Photos"],
  },
  {
    slug: "premium-party-cruise",
    type: "cruise",
    name: "Premium Party Cruise",
    shortDesc: "High-energy party cruise with international DJ, premium spirits, and unlimited dance floor.",
    basePrice: 1500,
    priceUnit: "per person",
    duration: "2.5 hrs (9:00–11:30 PM)",
    capacity: "180 guests",
    location: "Mandovi River, Panjim",
    rating: 4.7,
    isSelfServe: true,
    imageUrl: "https://goatrippackage.com/wp-content/uploads/2026/05/Princesa-2-800x600.jpg",
    inclusions: ["International DJ", "1 premium drink", "Snacks platter", "Dance floor", "LED lighting"],
    exclusions: ["Dinner", "Extra drinks", "Transportation"],
  },
  {
    slug: "private-dinner-cruise",
    type: "cruise",
    name: "Private Dinner Cruise",
    shortDesc: "Exclusive private cruise for couples or small groups. Personalized menu, champagne, and river views.",
    basePrice: 15000,
    priceUnit: "per booking",
    duration: "2 hrs",
    capacity: "2–10 guests",
    location: "Mandovi River, Panjim",
    rating: 5.0,
    isQuoteLed: true,
    imageUrl: "https://goatrippackage.com/wp-content/uploads/2026/05/coral-queen-cruise-2-800x600.jpg",
    inclusions: ["Private boat", "Personalized menu", "Champagne/wine", "Decoration", "Music system"],
    exclusions: ["Transportation", "Cake (add-on available)"],
  },
];

// ═══════════════════════════════════════════════════════════════
// YACHTS (14) — sample of 6
// ═══════════════════════════════════════════════════════════════
export const yachts: ProductData[] = [
  {
    slug: "maxum-luxury-yacht",
    type: "yacht",
    name: "Maxum Luxury Yacht",
    shortDesc: "32-ft premium yacht with sun deck, music system, and full crew. Perfect for celebrations.",
    basePrice: 12000,
    priceUnit: "per hour",
    duration: "Min 2 hrs",
    capacity: "12 guests",
    location: "Panjim Jetty",
    rating: 4.9,
    isFeatured: true,
    isSelfServe: true,
    isQuoteLed: true,
    imageUrl: "https://goatrippackage.com/wp-content/uploads/2026/05/Fun-Liner-1-800x600.jpeg",
    inclusions: ["Professional crew", "Life jackets", "Music system", "Ice box", "Sun deck access"],
    exclusions: ["Food & beverages", "Decorations (add-on)", "Fishing equipment"],
  },
  {
    slug: "manta-ray-party-yacht",
    type: "yacht",
    name: "Manta Ray — Party Yacht",
    shortDesc: "40-ft party yacht with LED lights, DJ console, and open bar setup. Built for celebrations.",
    basePrice: 18000,
    priceUnit: "per hour",
    duration: "Min 3 hrs",
    capacity: "20 guests",
    location: "Panjim Jetty",
    rating: 4.8,
    isFeatured: true,
    isQuoteLed: true,
    imageUrl: "https://goatrippackage.com/wp-content/uploads/2026/05/Manta-Ray-1-800x600.jpeg",
    inclusions: ["DJ console + speakers", "LED party lights", "Crew (captain + 2)", "Life jackets", "Ice box + glasses"],
    exclusions: ["Alcohol", "Food", "Decorations"],
  },
  {
    slug: "phoenix-sailing-yacht",
    type: "yacht",
    name: "Phoenix Sailing Yacht",
    shortDesc: "28-ft sailing yacht for intimate trips. Feel the wind as you sail along the Goa coast.",
    basePrice: 7000,
    priceUnit: "per hour",
    duration: "Min 1 hr",
    capacity: "6 guests",
    location: "Dona Paula",
    rating: 4.7,
    isSelfServe: true,
    imageUrl: "https://goatrippackage.com/wp-content/uploads/2026/05/Sean-Ray-2-800x600.jpeg",
    inclusions: ["Sailing experience", "Captain", "Life jackets", "Soft drinks"],
    exclusions: ["Food", "Fishing", "Photography"],
  },
  {
    slug: "polaris-mega-yacht",
    type: "yacht",
    name: "Polaris Mega Yacht",
    shortDesc: "55-ft mega yacht for corporate events and large parties. Multiple decks, bar, and catering setup.",
    basePrice: 50000,
    priceUnit: "per event",
    duration: "4 hrs",
    capacity: "50 guests",
    location: "Panjim Jetty",
    rating: 5.0,
    isQuoteLed: true,
    imageUrl: "https://goatrippackage.com/wp-content/uploads/2026/05/Polaris-1-800x600.jpeg",
    inclusions: ["Multiple decks", "Professional crew (5)", "Bar setup", "DJ area", "Catering coordination", "Decorations coordination"],
    exclusions: ["Food & beverages", "DJ", "Decorations"],
  },
];

// ═══════════════════════════════════════════════════════════════
// ACTIVITIES (15+) — sample of 8
// ═══════════════════════════════════════════════════════════════
export const activities: ProductData[] = [
  {
    slug: "scuba-diving-grande-island",
    type: "activity",
    name: "Scuba Diving — Grande Island",
    shortDesc: "Dive 10-12m deep at Grande Island. No experience needed — full training included.",
    basePrice: 3500,
    priceUnit: "per person",
    duration: "3–4 hrs (incl. boat ride)",
    location: "Grande Island",
    rating: 4.8,
    isFeatured: true,
    isSelfServe: true,
    imageUrl: "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=800&q=80&auto=format&fit=crop",
    inclusions: ["Training session", "Dive equipment", "Boat ride", "Underwater photos", "Light snacks"],
    exclusions: ["Transportation to base", "Video (add-on ₹500)"],
  },
  {
    slug: "parasailing-calangute",
    type: "activity",
    name: "Parasailing",
    shortDesc: "Soar 80-100m above the Arabian Sea. Thrilling views of the Goa coastline.",
    basePrice: 800,
    priceUnit: "per person",
    duration: "10-15 min (flight time)",
    location: "Calangute Beach",
    rating: 4.6,
    isSelfServe: true,
    inclusions: ["Safety gear", "Boat ride", "Parasail flight", "Life jacket"],
    exclusions: ["Photos/video (₹300)", "Transportation"],
  },
  {
    slug: "bungee-jumping-goa",
    type: "activity",
    name: "Bungee Jumping",
    shortDesc: "55m jump from a crane platform. India's only coastal bungee jump with beach views.",
    basePrice: 3000,
    priceUnit: "per person",
    duration: "30 min (incl. prep)",
    location: "Anjuna",
    rating: 4.7,
    isSelfServe: true,
    inclusions: ["Safety briefing", "Jump gear", "Certificate", "Video recording"],
    exclusions: ["Transportation", "Extra jumps"],
  },
  {
    slug: "kayaking-sal-backwaters",
    type: "activity",
    name: "Kayaking — Sal Backwaters",
    shortDesc: "Paddle through mangroves and backwaters. Spot kingfishers, eagles, and otters.",
    basePrice: 1200,
    priceUnit: "per person",
    duration: "2 hrs",
    location: "Sal Backwaters, South Goa",
    rating: 4.9,
    isSelfServe: true,
    imageUrl: "https://goatrippackage.com/wp-content/uploads/2026/05/kayaking-02-800x600.jpg",
    inclusions: ["Kayak + paddle", "Life jacket", "Guide", "Snacks + water"],
    exclusions: ["Transportation", "Camera waterproof cover"],
  },
  {
    slug: "helicopter-ride-goa",
    type: "activity",
    name: "Helicopter Ride",
    shortDesc: "See Goa from the sky — coastline, churches, forts, and islands in a 10-min aerial tour.",
    basePrice: 4000,
    priceUnit: "per person",
    duration: "10 min (flight time)",
    location: "Dabolim / Mopa",
    rating: 4.5,
    isQuoteLed: true,
    imageUrl: "https://goatrippackage.com/wp-content/uploads/2026/05/helicopter-02-800x600.jpg",
    inclusions: ["Helicopter ride", "Safety briefing", "Window seat guaranteed", "Certificate"],
    exclusions: ["Transportation to helipad", "Photos"],
  },
  {
    slug: "jet-ski-ride",
    type: "activity",
    name: "Jet Ski Ride",
    shortDesc: "High-speed jet ski ride along the coast. Feel the adrenaline rush on the Arabian Sea.",
    basePrice: 600,
    priceUnit: "per person",
    duration: "10 min",
    location: "Calangute / Baga Beach",
    rating: 4.4,
    isSelfServe: true,
    inclusions: ["Jet ski ride", "Safety gear", "Instructor"],
    exclusions: ["Photos", "Transportation"],
  },
  {
    slug: "watersports-combo-5in1",
    type: "activity",
    name: "Watersports Combo — 5 in 1",
    shortDesc: "Parasailing + jet ski + banana ride + bumper ride + speed boat. The ultimate beach day.",
    basePrice: 1800,
    priceUnit: "per person",
    duration: "2–3 hrs",
    location: "Calangute Beach",
    rating: 4.7,
    isFeatured: true,
    isSelfServe: true,
    imageUrl: "https://goatrippackage.com/wp-content/uploads/2026/05/hot-air-balloon-02-800x600.jpg",
    inclusions: ["5 activities", "Safety gear", "Life jackets", "Photos (basic)"],
    exclusions: ["HD video (₹500)", "Transportation", "Food"],
  },
];

// ═══════════════════════════════════════════════════════════════
// HOTELS (10+) — sample of 5
// ═══════════════════════════════════════════════════════════════
export const hotels: ProductData[] = [
  {
    slug: "the-leela-goa",
    type: "hotel",
    name: "The Leela Goa",
    shortDesc: "5-star luxury resort on Mobor Beach. Lagoon pool, Ayurvedic spa, and private beach access.",
    basePrice: 18000,
    priceUnit: "per night",
    location: "Cavelossim, South Goa",
    rating: 4.9,
    isFeatured: true,
    isQuoteLed: true,
    imageUrl: "https://goatrippackage.com/wp-content/uploads/2026/05/16-ultra-luxury-featured-800x600.jpg",
  },
  {
    slug: "w-goa",
    type: "hotel",
    name: "W Goa",
    shortDesc: "Ultra-modern 5-star with infinity pool, rooftop bar, and direct Vagator Beach access.",
    basePrice: 22000,
    priceUnit: "per night",
    location: "Vagator, North Goa",
    rating: 4.8,
    isQuoteLed: true,
    imageUrl: "https://goatrippackage.com/wp-content/uploads/2026/05/12-premium-experience-featured-800x600.jpg",
  },
  {
    slug: "resort-rio",
    type: "hotel",
    name: "Resort Rio",
    shortDesc: "4-star riverside resort with water park, multiple pools, and family-friendly amenities.",
    basePrice: 6500,
    priceUnit: "per night",
    location: "Arpora, North Goa",
    rating: 4.5,
    isQuoteLed: true,
    imageUrl: "https://goatrippackage.com/wp-content/uploads/2026/05/beach-resort-01-800x600.jpg",
  },
  {
    slug: "crown-goa",
    type: "hotel",
    name: "Crown Goa",
    shortDesc: "4-star resort in Panjim with casino access, pool bar, and harbour views.",
    basePrice: 5000,
    priceUnit: "per night",
    location: "Panjim, Central Goa",
    rating: 4.4,
    isQuoteLed: true,
    imageUrl: "https://goatrippackage.com/wp-content/uploads/2026/05/beach-resort-02-800x600.jpg",
  },
  {
    slug: "calangute-plaza",
    type: "hotel",
    name: "Hotel Calangute Plaza",
    shortDesc: "Budget-friendly hotel steps from Calangute Beach. Clean rooms, rooftop restaurant.",
    basePrice: 2500,
    priceUnit: "per night",
    location: "Calangute, North Goa",
    rating: 4.2,
    isQuoteLed: true,
    imageUrl: "https://goatrippackage.com/wp-content/uploads/2026/05/49-villa-yarina-800x600.jpg",
  },
];

// ═══════════════════════════════════════════════════════════════
// ALL PRODUCTS (combined for search / featured sections)
// ═══════════════════════════════════════════════════════════════
export const allProducts: ProductData[] = [
  ...packages,
  ...cruises,
  ...yachts,
  ...activities,
  ...hotels,
];

/**
 * Get products by type
 */
export function getProductsByType(type: ProductData["type"]): ProductData[] {
  return allProducts.filter((p) => p.type === type);
}

/**
 * Get a single product by slug
 */
export function getProductBySlug(slug: string): ProductData | undefined {
  return allProducts.find((p) => p.slug === slug);
}

/**
 * Get featured products
 */
export function getFeaturedProducts(limit = 6): ProductData[] {
  return allProducts.filter((p) => p.isFeatured).slice(0, limit);
}
