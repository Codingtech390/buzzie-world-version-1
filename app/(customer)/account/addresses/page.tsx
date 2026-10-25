import type { Metadata } from "next";

import AddressList from "@/components/account/AddressList";
import { requireCustomer } from "@/lib/auth";
import { getCustomerAddresses } from "@/services/customer-address.service";
import type { CustomerAddress } from "@/types/customer-address";

export const metadata: Metadata = {
  title: "My Addresses",
  description: "Manage your BuzzieWorld delivery addresses.",
};

export default async function AccountAddressesPage() {
  const session = await requireCustomer();

  let addresses: CustomerAddress[] = [];

  try {
    addresses = await getCustomerAddresses(session.user.id);
  } catch {
    addresses = [];
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="font-[var(--font-poppins-brand)] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9A91AC]">
          Addresses
        </p>

        <h2 className="mt-1 font-playpen text-xl font-bold text-[#303746]">
          My delivery addresses
        </h2>

        <p className="mt-1.5 max-w-2xl font-[var(--font-roboto)] text-xs leading-5 text-[#7B8494]">
          Save and manage the addresses you use for your BuzzieWorld orders.
        </p>
      </div>

      <AddressList initialAddresses={addresses} />
    </div>
  );
}
