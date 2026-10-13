import { redirect } from "next/navigation";

import CartClient from "@/components/cart/CartClient";
import { getAuthenticatedApiSession } from "@/lib/auth";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Shopping Cart",
  description: "Review the products in your BuzzieWorld shopping cart.",
  path: "/cart",
  noIndex: true,
});
export default async function CartPage() {
  const session = await getAuthenticatedApiSession();

  if (!session || session.user.role !== "customer") {
    redirect("/login?callbackUrl=%2Fcart");
  }

  return <CartClient />;
}
