import type { ReactNode } from "react";

import AccountHeader from "@/components/account/AccountHeader";
import AccountMobileNav from "@/components/account/AccountMobileNav";
import AccountSidebar from "@/components/account/AccountSidebar";
import type { AccountUser } from "@/types/customer-account";

interface AccountShellProps {
  user: AccountUser;
  children: ReactNode;
}

export default function AccountShell({ user, children }: AccountShellProps) {
  return (
    <main className="min-h-screen bg-[#FBFAFD] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
      <div className="mx-auto flex w-full max-w-[1440px] gap-6 xl:gap-8">
        <AccountSidebar user={user} />

        <section className="min-w-0 flex-1">
          <AccountHeader user={user} />
          <AccountMobileNav />
          {children}
        </section>
      </div>
    </main>
  );
}
