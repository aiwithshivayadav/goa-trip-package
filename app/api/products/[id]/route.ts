import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * GET /api/products/[id] — Get single product
 * PATCH /api/products/[id] — Update product
 * DELETE /api/products/[id] — Delete product
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("[Products API] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);
    const body = await request.json();

    const updateData: Record<string, unknown> = {};

    // Only update fields that are provided
    if (body.name !== undefined) updateData.name = body.name;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.shortDesc !== undefined) updateData.shortDesc = body.shortDesc;
    if (body.longDesc !== undefined) updateData.longDescMd = body.longDesc;
    if (body.basePrice !== undefined) updateData.basePrice = parseFloat(body.basePrice);
    if (body.priceUnit !== undefined) updateData.priceUnit = body.priceUnit;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured;
    if (body.isSelfServe !== undefined) updateData.isSelfServe = body.isSelfServe;
    if (body.isQuoteLed !== undefined) updateData.isQuoteLed = body.isQuoteLed;
    if (body.images !== undefined) updateData.imagesJson = JSON.stringify(body.images);
    if (body.inclusions !== undefined) updateData.inclusionsJson = JSON.stringify(body.inclusions);
    if (body.exclusions !== undefined) updateData.exclusionsJson = JSON.stringify(body.exclusions);
    if (body.itinerary !== undefined) updateData.itineraryJson = JSON.stringify(body.itinerary);
    if (body.faq !== undefined) updateData.faqJson = JSON.stringify(body.faq);

    const product = await db.product.update({
      where: { id: productId },
      data: updateData,
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("[Products API] PATCH error:", error);
    const message = error instanceof Error ? error.message : "Failed to update product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    await db.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Products API] DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
