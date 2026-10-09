import CartClient from "@/components/cart/CartClient";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Shopping Cart",
  description: "Review the products in your BuzzieWorld shopping cart.",
  path: "/cart",
  noIndex: true,
});
export default function CartPage() {
  return <CartClient />;
}
