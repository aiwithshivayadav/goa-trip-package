import { NextRequest, NextResponse } from "next/server";

interface GenerateRequest {
  name: string;
  type: string;
  location?: string;
  duration?: string;
  capacity?: string;
  basePrice?: number;
  priceUnit?: string;
  existingShortDesc?: string;
}

const typeContext: Record<string, { category: string; vibe: string; activities: string[]; sellPoints: string[] }> = {
  cruise: {
    category: "cruise experience",
    vibe: "luxurious river cruise on the Mandovi",
    activities: ["live DJ music", "unlimited drinks", "multi-cuisine buffet dinner", "dance floor", "panoramic river views", "photo opportunities", "welcome drinks"],
    sellPoints: ["Mandovi River panorama", "Goan sunset views", "live entertainment", "all-inclusive dining"],
  },
  yacht: {
    category: "private yacht charter",
    vibe: "exclusive private yacht on Goan waters",
    activities: ["private deck", "customizable music", "BYOB or catered bar", "swimming stops", "dolphin spotting", "sunset sailing", "island hopping"],
    sellPoints: ["complete privacy", "customizable experience", "premium vessel", "Arabian Sea views"],
  },
  activity: {
    category: "adventure activity",
    vibe: "thrilling Goan adventure",
    activities: ["safety briefing", "professional instructors", "equipment provided", "photo/video package", "insurance covered"],
    sellPoints: ["certified instructors", "top-grade equipment", "Instagram-worthy moments", "adrenaline rush"],
  },
  hotel: {
    category: "hotel stay",
    vibe: "comfortable Goan accommodation",
    activities: ["room service", "Wi-Fi", "breakfast", "pool access", "concierge", "airport transfer"],
    sellPoints: ["prime location", "modern amenities", "24/7 service", "beach proximity"],
  },
  package_tour: {
    category: "holiday package",
    vibe: "complete Goa holiday experience",
    activities: ["airport pickup", "sightseeing tours", "cruise dinner", "beach activities", "hotel stays", "all transfers"],
    sellPoints: ["all-inclusive itinerary", "no hidden costs", "curated experiences", "24/7 trip support"],
  },
  party: {
    category: "party experience",
    vibe: "unforgettable Goan party",
    activities: ["DJ/live music", "unlimited drinks", "dance floor", "themed decor", "VIP sections", "party favors"],
    sellPoints: ["Goa's #1 party venue", "themed nights", "premium sound system", "celebrity DJ lineups"],
  },
  combo: {
    category: "combo package",
    vibe: "best-of-Goa combination",
    activities: ["mixed experiences", "cruise + activities", "hotel + sightseeing", "flexible scheduling"],
    sellPoints: ["bundled savings", "curated combination", "one booking for everything", "best value"],
  },
  transfer: {
    category: "transfer service",
    vibe: "comfortable Goan transport",
    activities: ["airport pickup", "AC vehicle", "professional driver", "door-to-door service"],
    sellPoints: ["on-time guarantee", "clean AC vehicles", "experienced local drivers", "fixed pricing"],
  },
};

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

function generateShortDesc(input: GenerateRequest): string {
  const ctx = (typeContext[input.type] || typeContext.package_tour)!;
  const location = input.location || "Goa";
  const nameWords = input.name.toLowerCase();

  const templates = [
    `Experience the best of ${location} with this ${ctx.vibe}. ${pickRandom(ctx.sellPoints, 2).join(" and ")} included.`,
    `A premium ${ctx.category} in ${location} featuring ${pickRandom(ctx.activities, 2).join(" and ")}. Perfect for couples, families, and groups.`,
    `Discover ${location}'s finest ${ctx.category} — ${pickRandom(ctx.sellPoints, 2).join(", ")}. Book now for an unforgettable experience.`,
    `Your ultimate ${ctx.category} in ${location}. Enjoy ${pickRandom(ctx.activities, 3).join(", ")} on this hand-picked experience.`,
  ];

  if (nameWords.includes("sunset")) {
    return `Watch the golden Goan sunset from the deck of a premium cruise. This ${ctx.category} combines ${pickRandom(ctx.activities, 2).join(" and ")} for a magical evening on the Mandovi River.`;
  }
  if (nameWords.includes("night") || nameWords.includes("party")) {
    return `Goa's most electrifying ${ctx.category} awaits. Dance under the stars with ${pickRandom(ctx.activities, 2).join(", ")} on this legendary night experience.`;
  }
  if (nameWords.includes("honeymoon") || nameWords.includes("couple")) {
    return `A romantic ${ctx.category} designed for couples in ${location}. Enjoy ${pickRandom(ctx.activities, 2).join(" and ")} in an intimate setting.`;
  }

  return templates[Math.floor(Math.random() * templates.length)] ?? templates[0]!;
}

function generateLongDesc(input: GenerateRequest): string {
  const ctx = (typeContext[input.type] || typeContext.package_tour)!;
  const location = input.location || "Goa";
  const duration = input.duration || "";
  const price = input.basePrice ? `₹${input.basePrice.toLocaleString("en-IN")}` : "";

  let desc = `## ${input.name}\n\n`;
  desc += `Embark on an extraordinary ${ctx.category} in the heart of ${location}. `;
  desc += `This carefully curated experience brings you the best of what ${location} has to offer — `;
  desc += `from ${pickRandom(ctx.activities, 3).join(" to ")}.\n\n`;

  desc += `### What Makes This Special\n\n`;
  desc += ctx.sellPoints.map(p => `- **${p}**`).join("\n") + "\n\n";

  if (duration) {
    desc += `### Duration\n\n${duration} of pure indulgence and unforgettable memories.\n\n`;
  }

  desc += `### Who Is This For?\n\n`;
  desc += `Whether you're celebrating a special occasion, planning a group getaway, or simply looking for the quintessential ${location} experience, `;
  desc += `this ${ctx.category} delivers. Suitable for couples, families, and corporate groups alike.\n\n`;

  if (price) {
    desc += `### Value\n\nStarting at just ${price} ${input.priceUnit || "per person"}, this experience offers exceptional value with premium inclusions that would cost significantly more if booked separately.\n\n`;
  }

  desc += `### Book With Confidence\n\n`;
  desc += `Goa Trip Package ensures a seamless booking experience with instant confirmation, flexible dates, and dedicated trip support. `;
  desc += `WhatsApp us anytime for custom requests or group bookings.`;

  return desc;
}

function generateHighlights(input: GenerateRequest): string[] {
  const ctx = (typeContext[input.type] || typeContext.package_tour)!;
  const nameWords = input.name.toLowerCase();
  const base = [...ctx.sellPoints];

  if (nameWords.includes("sunset")) base.push("Golden hour experience", "Panoramic sunset deck");
  if (nameWords.includes("dinner")) base.push("Multi-cuisine buffet", "Fine dining on water");
  if (nameWords.includes("party") || nameWords.includes("night")) base.push("Live DJ", "Dance floor", "Party until midnight");
  if (nameWords.includes("private") || nameWords.includes("charter")) base.push("Exclusive private booking", "Customizable itinerary");
  if (input.duration) base.push(`${input.duration} experience`);
  if (input.capacity) base.push(`Up to ${input.capacity}`);

  return pickRandom([...new Set(base)], 5);
}

function generateInclusions(input: GenerateRequest): string[] {
  const ctx = (typeContext[input.type] || typeContext.package_tour)!;
  const nameWords = input.name.toLowerCase();

  const inclusions = [...pickRandom(ctx.activities, 4)];

  if (input.type === "cruise" || input.type === "yacht") {
    inclusions.push("Welcome drinks on arrival");
    if (nameWords.includes("dinner")) inclusions.push("Multi-cuisine buffet dinner");
    if (nameWords.includes("party") || nameWords.includes("night")) inclusions.push("Unlimited beverages", "Live DJ performance");
  }
  if (input.type === "package_tour" || input.type === "combo") {
    inclusions.push("All transfers included", "24/7 trip coordinator");
  }
  if (input.type === "activity") {
    inclusions.push("All safety equipment", "Certified instructor");
  }

  return [...new Set(inclusions)].slice(0, 7);
}

function generateExclusions(input: GenerateRequest): string[] {
  const common = ["Personal expenses", "Travel insurance"];
  const byType: Record<string, string[]> = {
    cruise: ["Items not mentioned in inclusions", "Anything beyond the package menu"],
    yacht: ["Fuel surcharge for extended routes", "Additional catering beyond agreed menu"],
    activity: ["Personal photography equipment", "Transportation to venue"],
    hotel: ["Minibar charges", "Laundry services", "Room upgrades"],
    package_tour: ["Flight tickets", "Visa charges", "Entry fees unless mentioned"],
    party: ["VIP table upgrades", "Personal bottle service"],
    combo: ["Flight tickets", "Items not mentioned in inclusions"],
    transfer: ["Toll charges for outstation", "Waiting beyond 30 minutes"],
  };

  return [...common, ...pickRandom((byType[input.type] || byType.package_tour)!, 3)];
}

function generateMetaSEO(input: GenerateRequest): { metaTitle: string; metaDescription: string } {
  const location = input.location || "Goa";
  const price = input.basePrice ? ` from ₹${input.basePrice.toLocaleString("en-IN")}` : "";
  const ctx = (typeContext[input.type] || typeContext.package_tour)!;

  return {
    metaTitle: `${input.name} | Best ${ctx.category.charAt(0).toUpperCase() + ctx.category.slice(1)} in ${location}${price}`,
    metaDescription: `Book ${input.name} in ${location}${price}. ${pickRandom(ctx.sellPoints, 2).join(", ")}. Instant confirmation, flexible dates. Call/WhatsApp for best deals.`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();

    if (!body.name || !body.type) {
      return NextResponse.json({ error: "name and type are required" }, { status: 400 });
    }

    const shortDesc = generateShortDesc(body);
    const longDesc = generateLongDesc(body);
    const highlights = generateHighlights(body);
    const inclusions = generateInclusions(body);
    const exclusions = generateExclusions(body);
    const seo = generateMetaSEO(body);

    return NextResponse.json({
      generated: {
        shortDesc,
        longDesc,
        highlights,
        inclusions,
        exclusions,
        ...seo,
      },
      engine: "template-v1",
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}
