/**
 * Seed script — imports all hardcoded products into the database.
 * Run: npx tsx prisma/seed-products.ts
 */
import { PrismaClient } from "@prisma/client";
import { allProducts } from "../lib/data/products";

const prisma = new PrismaClient();

const typeMap: Record<string, string> = {
  package: "package_tour",
  cruise: "cruise",
  yacht: "yacht",
  activity: "activity",
  hotel: "hotel",
  party: "party",
};

async function main() {
  console.log(`Seeding ${allProducts.length} products...`);

  for (const p of allProducts) {
    const dbType = typeMap[p.type] ?? p.type;

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        type: dbType as any,
        name: p.name,
        shortDesc: p.shortDesc,
        longDescMd: p.longDesc ?? null,
        basePrice: p.basePrice,
        originalPrice: p.originalPrice ?? null,
        priceUnit: p.priceUnit,
        duration: p.duration ?? null,
        durationDays: p.durationDays ?? null,
        capacity: p.capacity ?? null,
        location: p.location ?? null,
        rating: p.rating ?? null,
        reviewCount: p.reviewCount ?? null,
        imageUrl: p.imageUrl ?? null,
        imagesJson: p.images ? JSON.stringify(p.images) : null,
        inclusionsJson: p.inclusions ? JSON.stringify(p.inclusions) : null,
        exclusionsJson: p.exclusions ? JSON.stringify(p.exclusions) : null,
        highlightsJson: p.highlights ? JSON.stringify(p.highlights) : null,
        itineraryJson: p.itinerary ? JSON.stringify(p.itinerary) : null,
        faqJson: p.faq ? JSON.stringify(p.faq) : null,
        keyFeaturesJson: p.keyFeatures ? JSON.stringify(p.keyFeatures) : null,
        meetingPoint: p.meetingPoint ?? null,
        timing: p.timing ?? null,
        whatToBringJson: p.whatToBring ? JSON.stringify(p.whatToBring) : null,
        cancellationPolicy: p.cancellationPolicy ?? null,
        isFeatured: p.isFeatured ?? false,
        isSelfServe: p.isSelfServe ?? false,
        isQuoteLed: p.isQuoteLed ?? true,
        status: "active",
      },
      create: {
        slug: p.slug,
        type: dbType as any,
        name: p.name,
        shortDesc: p.shortDesc,
        longDescMd: p.longDesc ?? null,
        basePrice: p.basePrice,
        originalPrice: p.originalPrice ?? null,
        priceUnit: p.priceUnit,
        duration: p.duration ?? null,
        durationDays: p.durationDays ?? null,
        capacity: p.capacity ?? null,
        location: p.location ?? null,
        rating: p.rating ?? null,
        reviewCount: p.reviewCount ?? null,
        imageUrl: p.imageUrl ?? null,
        imagesJson: p.images ? JSON.stringify(p.images) : null,
        inclusionsJson: p.inclusions ? JSON.stringify(p.inclusions) : null,
        exclusionsJson: p.exclusions ? JSON.stringify(p.exclusions) : null,
        highlightsJson: p.highlights ? JSON.stringify(p.highlights) : null,
        itineraryJson: p.itinerary ? JSON.stringify(p.itinerary) : null,
        faqJson: p.faq ? JSON.stringify(p.faq) : null,
        keyFeaturesJson: p.keyFeatures ? JSON.stringify(p.keyFeatures) : null,
        meetingPoint: p.meetingPoint ?? null,
        timing: p.timing ?? null,
        whatToBringJson: p.whatToBring ? JSON.stringify(p.whatToBring) : null,
        cancellationPolicy: p.cancellationPolicy ?? null,
        isFeatured: p.isFeatured ?? false,
        isSelfServe: p.isSelfServe ?? false,
        isQuoteLed: p.isQuoteLed ?? true,
        status: "active",
      },
    });

    console.log(`  ✓ ${p.type}/${p.slug}`);
  }

  const count = await prisma.product.count();
  console.log(`\nDone. ${count} products in database.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
