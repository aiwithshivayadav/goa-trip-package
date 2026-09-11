import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getSlugsByType, getProductsByType } from "@/lib/data/db-products";
import { ProductDetailLayout, type ProductTypeConfig } from "@/components/marketing/ProductDetailLayout";

export const dynamic = "force-dynamic";

const CONFIG: ProductTypeConfig = {
  typeLabel: "Hotel",
  featuredLabel: "Top Pick",
  categoryHref: "/hotels",
  categoryLabel: "All Hotels",
  productType: "hotel",
  similarLabel: "Similar Hotels",
  primaryCtaLabel: "Check Availability",
  overviewLabel: "About This Hotel",
  featuresLabel: "Property Details",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Hotel Not Found" };
  return { title: p.name, description: p.shortDesc };
}

export async function generateStaticParams() {
  try {
    const slugs = await getSlugsByType("hotel");
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export const dynamicParams = true;

export default async function HotelDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) notFound();

  const allOfType = await getProductsByType("hotel");
  const similarProducts = allOfType.filter((h) => h.slug !== slug).slice(0, 3);

  return <ProductDetailLayout product={p} similarProducts={similarProducts} config={CONFIG} />;
}
