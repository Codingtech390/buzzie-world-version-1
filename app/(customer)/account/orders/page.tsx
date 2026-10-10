import type { Metadata } from "next";

import OrderList from "@/components/account/OrderList";
import { requireCustomer } from "@/lib/auth";
import { getCustomerOrders } from "@/services/customer-order.service";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View your BuzzieWorld order history.",
};

export default async function AccountOrdersPage() {
  const session = await requireCustomer();

  const orders = await getCustomerOrders(session.user.id);

  return (
    <div className="space-y-5">
      <div>
        <p className="font-[var(--font-poppins-brand)] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9A91AC]">
          Orders
        </p>

        <h2 className="mt-1 font-playpen text-xl font-bold text-[#303746]">
          My orders
        </h2>

        <p className="mt-1.5 max-w-2xl font-[var(--font-roboto)] text-xs leading-5 text-[#7B8494]">
          Track your purchases, payment status, delivery progress, and order details.
        </p>
      </div>

      <OrderList initialOrders={orders} />
    </div>
  );
}
