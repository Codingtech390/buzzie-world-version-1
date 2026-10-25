import type { Metadata } from "next";

import AccountPreferences from "@/components/account/AccountPreferences";
import DeleteAccountDialog from "@/components/account/DeleteAccountDialog";
import PasswordForm from "@/components/account/PasswordForm";
import { requireCustomer } from "@/lib/auth";
import { getCustomerSettings } from "@/services/customer-settings.service";

export const metadata: Metadata = {
  title: "Account Settings | BuzzieWorld",
  description: "Manage your BuzzieWorld password, account preferences and account security.",
};

export default async function AccountSettingsPage() {
  const session = await requireCustomer();

  const settings = await getCustomerSettings(session.user.id);

  if (!settings) {
    return null;
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="font-[var(--font-poppins-brand)] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9A91AC]">
          Settings
        </p>

        <h2 className="mt-1 font-playpen text-xl font-bold text-[#303746]">
          Account settings
        </h2>

        <p className="mt-1.5 max-w-2xl font-[var(--font-poppins-brand)] text-xs leading-5 text-[#7B8494]">
          Manage your password, communication preferences and account security.
        </p>
      </div>

      <div className="grid gap-5">
        <PasswordForm hasPassword={settings.hasPassword} />

        <AccountPreferences />

        <DeleteAccountDialog />
      </div>
    </div>
  );
}
