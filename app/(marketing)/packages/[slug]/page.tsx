import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getSlugsByType, getProductsByType } from "@/lib/data/db-products";
import { ProductDetailLayout, type ProductTypeConfig } from "@/components/marketing/ProductDetailLayout";

export const dynamic = "force-dynamic";

const CONFIG: ProductTypeConfig = {
  typeLabel: "Tour Package",
  featuredLabel: "Best Seller",
  categoryHref: "/packages",
  categoryLabel: "All Packages",
  productType: "package",
  similarLabel: "Similar Packages",
  primaryCtaLabel: "Get Custom Quote",
  overviewLabel: "Overview",
  featuresLabel: "Key Details",
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Package Not Found" };
  return { title: p.name, description: p.shortDesc };
}

export async function generateStaticParams() {
  try {
    const slugs = await getSlugsByType("package");
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export const dynamicParams = true;

export default async function PackageDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) notFound();

  const allOfType = await getProductsByType("package");
  const similarProducts = allOfType.filter((x) => x.slug !== slug).slice(0, 3);

  return <ProductDetailLayout product={p} similarProducts={similarProducts} config={CONFIG} />;
}
