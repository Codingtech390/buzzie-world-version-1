import type { Metadata } from "next";
import { notFound } from "next/navigation";

import OrderDetails from "@/components/account/OrderDetails";
import { requireCustomer } from "@/lib/auth";
import { getCustomerOrder } from "@/services/customer-order.service";

export const metadata: Metadata = {
  title: "Order Details",
  description: "View your BuzzieWorld order details.",
};

interface CustomerOrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CustomerOrderDetailsPage({
  params,
}: CustomerOrderDetailsPageProps) {
  const session = await requireCustomer();
  const { id } = await params;

  const order = await getCustomerOrder(session.user.id, id);

  if (!order) {
    notFound();
  }

  return <OrderDetails order={order} />;
}
