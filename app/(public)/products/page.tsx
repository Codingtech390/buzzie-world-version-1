import { redirect } from "next/navigation";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "All Products",
  description: "Browse all BuzzieWorld toys, games, books and educational products.",
  path: "/products",
});
export default function ProductsPage() {
  redirect("/shop");
}
