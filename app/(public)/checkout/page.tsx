import CheckoutClient from "@/components/checkout/CheckoutClient";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Checkout",
  description: "Complete your BuzzieWorld order securely.",
  path: "/checkout",
  noIndex: true,
});
export default function CheckoutPage() {
  return <CheckoutClient />;
}
