import type { Metadata } from "next";
import { getPackages } from "@/lib/data/db-products";
import { CategoryListingLayout, type CategoryConfig } from "@/components/marketing/CategoryListingLayout";

export const dynamic = "force-dynamic";

const CONFIG: CategoryConfig = {
  eyebrow: "Curated Experiences",
  titleMain: "Goa Tour",
  titleAccent: "Packages",
  subtitle: "Honeymoon, family, group, bachelor, corporate — handcrafted itineraries for every kind of traveller.",
  categoryLabel: "All Packages",
  gradientAngle: "30% 80%",
};

export const metadata: Metadata = {
  title: "Goa Tour Packages — Honeymoon, Family, Group, Corporate",
  description:
    "30+ curated Goa tour packages starting ₹3,499/person. Honeymoon, family, bachelor group, corporate offsite. Book with confidence — 1,200+ happy guests.",
};

export default async function PackagesPage() {
  const packages = await getPackages();
  return <CategoryListingLayout products={packages} config={CONFIG} />;
}
