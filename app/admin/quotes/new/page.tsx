import { getAllProducts } from "@/lib/data/db-products";
import QuoteBuilder from "./QuoteBuilder";

export const dynamic = "force-dynamic";

export default async function NewQuotePage() {
  const allProducts = await getAllProducts();
  return <QuoteBuilder allProducts={allProducts} />;
}
