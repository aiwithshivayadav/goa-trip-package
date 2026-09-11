import { getAllProducts } from "@/lib/data/db-products";
import SearchClient from "./SearchClient";

export default async function SearchPage() {
  const products = await getAllProducts();
  return <SearchClient products={products} />;
}
