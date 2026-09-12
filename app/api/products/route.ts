import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/products — List all products (admin)
 * POST /api/products — Create a new product (admin)
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (status) where.status = status;

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy: { sortOrder: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, page, limit });
  } catch (error) {
    console.error("[Products API] GET error:", error);
    return NextResponse.json({ products: [], total: 0 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const product = await db.product.create({
      data: {
        slug: body.slug,
        type: body.type || "package_tour",
        name: body.name,
        shortDesc: body.shortDesc || null,
        longDescMd: body.longDesc || null,
        basePrice: parseFloat(body.basePrice) || 0,
        originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : null,
        priceUnit: body.priceUnit || "per_person",
        duration: body.duration || null,
        durationHrs: body.durationHrs ? parseFloat(body.durationHrs) : null,
        durationDays: body.durationDays ? parseInt(body.durationDays) : null,
        capacity: body.capacity || null,
        capacityMin: body.capacityMin ? parseInt(body.capacityMin) : null,
        capacityMax: body.capacityMax ? parseInt(body.capacityMax) : null,
        location: body.location || null,
        rating: body.rating ? parseFloat(body.rating) : null,
        reviewCount: body.reviewCount ? parseInt(body.reviewCount) : null,
        imageUrl: body.imageUrl || null,
        meetingPoint: body.meetingPoint || null,
        timing: body.timing || null,
        cancellationPolicy: body.cancellationPolicy || null,
        imagesJson: body.images ? JSON.stringify(body.images) : null,
        inclusionsJson: body.inclusions ? JSON.stringify(body.inclusions) : null,
        exclusionsJson: body.exclusions ? JSON.stringify(body.exclusions) : null,
        highlightsJson: body.highlights ? JSON.stringify(body.highlights) : null,
        keyFeaturesJson: body.keyFeatures ? JSON.stringify(body.keyFeatures) : null,
        whatToBringJson: body.whatToBring ? JSON.stringify(body.whatToBring) : null,
        itineraryJson: body.itinerary ? JSON.stringify(body.itinerary) : null,
        faqJson: body.faq ? JSON.stringify(body.faq) : null,
        status: body.status || "active",
        isFeatured: body.isFeatured || false,
        isSelfServe: body.isSelfServe || false,
        isQuoteLed: body.isQuoteLed !== false,
        sortOrder: body.sortOrder || 0,
        brand: body.brand || "goatrippackage",
        seoTitle: body.seoTitle || null,
        seoDescription: body.seoDescription || null,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("[Products API] POST error:", error);
    const message = error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
