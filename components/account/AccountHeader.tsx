import Link from "next/link";
import { ArrowUpRight, ShoppingBag } from "lucide-react";

import type { AccountUser } from "@/types/customer-account";

interface AccountHeaderProps {
  user: AccountUser;
}

export default function AccountHeader({ user }: AccountHeaderProps) {
  return (
    <header className="mb-6 flex flex-col gap-4 border-b border-[#ECE8F2] pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="font-[var(--font-poppins-brand)] text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9A91AC]">
          BuzzieWorld Account
        </p>

        <h1 className="mt-1 font-[var(--font-poppins-brand)] text-2xl font-bold tracking-[-0.02em] text-[#303746] sm:text-[28px]">
          Welcome back, {user.name.split(" ")[0] || "there"}.
        </h1>

        <p className="mt-1.5 max-w-2xl font-[var(--font-poppins-brand)] text-xs leading-5 text-[#7B8494] sm:text-[13px]">
          Manage your personal details and keep your BuzzieWorld account ready for your next
          adventure.
        </p>
      </div>

      <Link
        href="/products"
        className="inline-flex w-fit items-center gap-2 rounded-full bg-[#A092CD] px-4 py-2.5 font-[var(--font-poppins-brand)] text-[11px] font-semibold text-white shadow-[0_10px_24px_rgba(160,146,205,0.28)] transition-transform hover:-translate-y-0.5"
      >
        <ShoppingBag className="size-4" strokeWidth={1.9} />
        Continue shopping
        <ArrowUpRight className="size-3.5" strokeWidth={2} />
      </Link>
    </header>
  );
}
