import { redirect } from "next/navigation";

import CheckoutClient from "@/components/checkout/CheckoutClient";
import { getAuthenticatedApiSession } from "@/lib/auth";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Checkout",
  description: "Complete your BuzzieWorld order securely.",
  path: "/checkout",
  noIndex: true,
});
export default async function CheckoutPage() {
  const session = await getAuthenticatedApiSession();

  if (!session || session.user.role !== "customer") {
    redirect("/login?callbackUrl=%2Fcheckout");
  }

  return <CheckoutClient />;
}
