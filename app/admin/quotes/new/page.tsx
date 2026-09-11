import { getAllProducts } from "@/lib/data/db-products";
import QuoteBuilder from "./QuoteBuilder";

export default async function NewQuotePage() {
  const allProducts = await getAllProducts();
  return <QuoteBuilder allProducts={allProducts} />;
}
