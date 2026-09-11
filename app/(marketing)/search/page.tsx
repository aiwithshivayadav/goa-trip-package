import { getAllProducts } from "@/lib/data/db-products";
import SearchClient from "./SearchClient";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const products = await getAllProducts();
  return <SearchClient products={products} />;
}
