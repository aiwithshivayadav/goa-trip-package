import type { Metadata } from "next";
import { getYachts } from "@/lib/data/db-products";
import { CategoryListingLayout, type CategoryConfig } from "@/components/marketing/CategoryListingLayout";

export const dynamic = "force-dynamic";

const CONFIG: CategoryConfig = {
  eyebrow: "Private Luxury",
  titleMain: "Yacht",
  titleAccent: "Charter",
  subtitle: "Luxury yachts for birthdays, bachelorettes, corporate events, and romantic sunsets on the Arabian Sea.",
  categoryLabel: "All Yachts",
  gradientAngle: "80% 30%",
};

export const metadata: Metadata = {
  title: "Yacht Charter Goa — Luxury Yachts for Parties & Celebrations",
  description:
    "14 luxury yachts in Goa — parties, birthdays, corporate events, romantic getaways. Starting ₹7,000/hour. Professional crew included.",
};

export default async function YachtsPage() {
  const yachts = await getYachts();
  return <CategoryListingLayout products={yachts} config={CONFIG} />;
}
