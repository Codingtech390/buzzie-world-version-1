import type { Metadata } from "next";

import WishlistClient from "@/components/account/WishlistClient";

export const metadata: Metadata = {
  title: "My Wishlist | BuzzieWorld",
  description: "Save your favourite BuzzieWorld toys, games and learning products for later.",
};

export default function WishlistPage() {
  return <WishlistClient />;
}
