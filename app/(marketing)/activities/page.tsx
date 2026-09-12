import type { Metadata } from "next";
import { getActivities } from "@/lib/data/db-products";
import { CategoryListingLayout, type CategoryConfig } from "@/components/marketing/CategoryListingLayout";

export const dynamic = "force-dynamic";

const CONFIG: CategoryConfig = {
  eyebrow: "Thrill & Adventure",
  titleMain: "Adventures &",
  titleAccent: "Activities",
  subtitle: "Scuba, parasail, bungee, kayak, jet ski, helicopter — adrenaline-pumping experiences across Goa.",
  categoryLabel: "All Activities",
  gradientAngle: "50% 50%",
};

export const metadata: Metadata = {
  title: "Water Activities & Adventures in Goa — Scuba, Parasailing, Bungee",
  description:
    "15+ adventure activities in Goa — scuba diving, parasailing, bungee jumping, kayaking, jet ski, helicopter ride. Starting ₹600. Book instantly.",
};

export default async function ActivitiesPage() {
  const activities = await getActivities();
  return <CategoryListingLayout products={activities} config={CONFIG} />;
}
