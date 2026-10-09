import type { Metadata } from "next";

import ProfileForm from "@/components/account/ProfileForm";
import { requireCustomer } from "@/lib/auth";
import { getCustomerProfile } from "@/services/customer-account.service";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your BuzzieWorld profile details.",
};

export default async function AccountProfilePage() {
  const session = await requireCustomer();
  const profile = await getCustomerProfile(session.user.id);

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="font-[var(--font-poppins-brand)] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9A91AC]">
          Profile
        </p>

        <h2 className="mt-1 font-[var(--font-poppins-brand)] text-xl font-bold text-[#303746]">
          Personal information
        </h2>

        <p className="mt-1.5 max-w-2xl font-[var(--font-poppins-brand)] text-xs leading-5 text-[#7B8494]">
          Manage the customer information used across your BuzzieWorld account.
        </p>
      </div>

      <ProfileForm initialProfile={profile} />
    </div>
  );
}
