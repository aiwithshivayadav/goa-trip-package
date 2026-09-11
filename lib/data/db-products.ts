import { db } from "@/lib/db";
import type { Product } from "@prisma/client";

export interface ProductData {
  slug: string;
  type: "package" | "cruise" | "yacht" | "activity" | "hotel" | "party";
  name: string;
  shortDesc: string;
  longDesc?: string;
  basePrice: number;
  originalPrice?: number;
  priceUnit: string;
  duration?: string;
  durationDays?: number;
  capacity?: string;
  location?: string;
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
  isSelfServe?: boolean;
  isQuoteLed?: boolean;
  imageUrl?: string;
  images?: string[];
  inclusions?: string[];
  exclusions?: string[];
  highlights?: string[];
  keyFeatures?: { icon: string; label: string; value: string }[];
  meetingPoint?: string;
  timing?: string;
  whatToBring?: string[];
  cancellationPolicy?: string;
  itinerary?: { day: number; title: string; description: string }[];
  faq?: { q: string; a: string }[];
}

const typeMap: Record<string, ProductData["type"]> = {
  package_tour: "package",
  cruise: "cruise",
  yacht: "yacht",
  activity: "activity",
  hotel: "hotel",
  party: "party",
};

function parseJson<T>(json: string | null | undefined): T | undefined {
  if (!json) return undefined;
  try {
    return JSON.parse(json) as T;
  } catch {
    return undefined;
  }
}

function toProductData(row: Product): ProductData {
  return {
    slug: row.slug,
    type: typeMap[row.type] ?? (row.type as ProductData["type"]),
    name: row.name,
    shortDesc: row.shortDesc ?? "",
    longDesc: row.longDescMd ?? undefined,
    basePrice: Number(row.basePrice),
    originalPrice: row.originalPrice ? Number(row.originalPrice) : undefined,
    priceUnit: row.priceUnit,
    duration: row.duration ?? undefined,
    durationDays: row.durationDays ?? undefined,
    capacity: row.capacity ?? undefined,
    location: row.location ?? undefined,
    rating: row.rating ? Number(row.rating) : undefined,
    reviewCount: row.reviewCount ?? undefined,
    isFeatured: row.isFeatured,
    isSelfServe: row.isSelfServe,
    isQuoteLed: row.isQuoteLed,
    imageUrl: row.imageUrl ?? undefined,
    images: parseJson<string[]>(row.imagesJson),
    inclusions: parseJson<string[]>(row.inclusionsJson),
    exclusions: parseJson<string[]>(row.exclusionsJson),
    highlights: parseJson<string[]>(row.highlightsJson),
    keyFeatures: parseJson<{ icon: string; label: string; value: string }[]>(
      row.keyFeaturesJson
    ),
    meetingPoint: row.meetingPoint ?? undefined,
    timing: row.timing ?? undefined,
    whatToBring: parseJson<string[]>(row.whatToBringJson),
    cancellationPolicy: row.cancellationPolicy ?? undefined,
    itinerary: parseJson<{ day: number; title: string; description: string }[]>(
      row.itineraryJson
    ),
    faq: parseJson<{ q: string; a: string }[]>(row.faqJson),
  };
}

async function fetchAll(): Promise<ProductData[]> {
  const rows = await db.product.findMany({
    where: { status: "active" },
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
  });
  return rows.map(toProductData);
}

async function fetchByType(
  type: ProductData["type"]
): Promise<ProductData[]> {
  const dbType = Object.entries(typeMap).find(([, v]) => v === type)?.[0] ?? type;
  const rows = await db.product.findMany({
    where: { type: dbType as any, status: "active" },
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
  });
  return rows.map(toProductData);
}

async function fetchBySlug(slug: string): Promise<ProductData | null> {
  const row = await db.product.findUnique({ where: { slug } });
  if (!row || row.status !== "active") return null;
  return toProductData(row);
}

async function fetchFeatured(limit = 6): Promise<ProductData[]> {
  const rows = await db.product.findMany({
    where: { status: "active", isFeatured: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    take: limit,
  });
  return rows.map(toProductData);
}

export async function getPackages() {
  return fetchByType("package");
}
export async function getCruises() {
  return fetchByType("cruise");
}
export async function getYachts() {
  return fetchByType("yacht");
}
export async function getActivities() {
  return fetchByType("activity");
}
export async function getHotels() {
  return fetchByType("hotel");
}
export async function getAllProducts() {
  return fetchAll();
}
export async function getProductBySlug(slug: string) {
  return fetchBySlug(slug);
}
export async function getProductsByType(type: ProductData["type"]) {
  return fetchByType(type);
}
export async function getFeaturedProducts(limit = 6) {
  return fetchFeatured(limit);
}

export async function getAllSlugs(): Promise<string[]> {
  const rows = await db.product.findMany({
    where: { status: "active" },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function getSlugsByType(
  type: ProductData["type"]
): Promise<string[]> {
  const dbType = Object.entries(typeMap).find(([, v]) => v === type)?.[0] ?? type;
  const rows = await db.product.findMany({
    where: { type: dbType as any, status: "active" },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}
