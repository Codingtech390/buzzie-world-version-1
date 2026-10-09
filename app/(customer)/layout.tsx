import type { Metadata } from "next";
import { redirect } from "next/navigation";

import AccountShell from "@/components/account/AccountShell";
import { requireCustomer } from "@/lib/auth";
import { getCustomerProfile } from "@/services/customer-account.service";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CustomerLayout({ children }: { children: React.ReactNode }) {
  const session = await requireCustomer();
  const profile = await getCustomerProfile(session.user.id);

  if (!profile) {
    redirect("/login");
  }

  return <AccountShell user={profile}>{children}</AccountShell>;
}
