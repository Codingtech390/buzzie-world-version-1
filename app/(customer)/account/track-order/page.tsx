import type { Metadata } from "next";

import TrackOrder from "@/components/account/TrackOrder";

export const metadata: Metadata = {
  title: "Track Order | BuzzieWorld",
  description: "Track your BuzzieWorld order shipment and courier information.",
};

export default function TrackOrderPage() {
  return <TrackOrder />;
}
