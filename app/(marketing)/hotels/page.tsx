import type { Metadata } from "next";
import { getHotels } from "@/lib/data/db-products";
import { CategoryListingLayout, type CategoryConfig } from "@/components/marketing/CategoryListingLayout";

export const dynamic = "force-dynamic";

const CONFIG: CategoryConfig = {
  eyebrow: "Handpicked Stays",
  titleMain: "Goa",
  titleAccent: "Hotels",
  subtitle: "From boutique beach villas to 5-star luxury resorts — handpicked properties at the best rates.",
  categoryLabel: "All Hotels",
  gradientAngle: "30% 30%",
};

export const metadata: Metadata = {
  title: "Hotels in Goa — Luxury Resorts to Budget Stays",
  description:
    "Handpicked Goa hotels — The Leela, W Goa, Resort Rio, Crown. 5-star luxury to budget-friendly. Best rates guaranteed through Goa Trip Package.",
};

export default async function HotelsPage() {
  const hotels = await getHotels();
  return <CategoryListingLayout products={hotels} config={CONFIG} />;
}
