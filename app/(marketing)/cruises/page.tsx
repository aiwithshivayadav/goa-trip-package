import type { Metadata } from "next";
import { getCruises } from "@/lib/data/db-products";
import { CategoryListingLayout, type CategoryConfig } from "@/components/marketing/CategoryListingLayout";

export const dynamic = "force-dynamic";

const CONFIG: CategoryConfig = {
  eyebrow: "On the Mandovi",
  titleMain: "Goa",
  titleAccent: "Cruises",
  subtitle: "Sunset dinners, night parties, dolphin sightseeing, private charters — unforgettable evenings on the river.",
  categoryLabel: "All Cruises",
  gradientAngle: "70% 20%",
};

export const metadata: Metadata = {
  title: "Goa Cruises — Sunset, Dinner, Party, Dolphin, Private",
  description:
    "12 premium Goa cruises on the Mandovi River. Sunset dinner, night party, dolphin sightseeing, private charter. Starting ₹399. Book online instantly.",
};

export default async function CruisesPage() {
  const cruises = await getCruises();
  return <CategoryListingLayout products={cruises} config={CONFIG} />;
}
