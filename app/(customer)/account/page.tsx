import type { Metadata } from "next";

import AccountDashboard from "@/components/account/AccountDashboard";
import { requireCustomer } from "@/lib/auth";
import { getCustomerProfile } from "@/services/customer-account.service";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your BuzzieWorld customer account.",
};

export default async function AccountPage() {
  const session = await requireCustomer();
  const profile = await getCustomerProfile(session.user.id);

  if (!profile) {
    return null;
  }

  return <AccountDashboard user={profile} />;
}
