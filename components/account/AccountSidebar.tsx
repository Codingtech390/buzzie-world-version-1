"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

import { useRouter } from "next/navigation";
import { notify } from "@/lib/notifications";

import { ACCOUNT_NAVIGATION, ACCOUNT_STORE_LINK } from "@/components/account/account-navigation";
import type { AccountUser } from "@/types/customer-account";

interface AccountSidebarProps {
  user: AccountUser;
}

function isActivePath(pathname: string, href: string) {
  if (href === "/account") {
    return pathname === "/account";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AccountSidebar({ user }: AccountSidebarProps) {
  const pathname = usePathname();

  const router = useRouter();

  const initials = user.name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleLogout() {
    try {
      await signOut({ redirect: false });

      notify.success("You have been signed out.");
      router.replace("/");
      router.refresh();
    } catch (error) {
      notify.error(error, "Unable to sign out. Please try again.");
    }
  }

  return (
    <aside className="hidden w-[270px] shrink-0 lg:block">
      <div className="sticky top-6 overflow-hidden rounded-[28px] border border-[#E7E1F0] bg-white shadow-[0_18px_60px_rgba(82,68,112,0.08)]">
        <div className="bg-[#A092CD] px-5 py-6 text-white">
          <div className="flex items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/90 text-sm font-bold text-[#5F4C8C] shadow-sm">
              {initials || "BW"}
            </div>

            <div className="min-w-0">
              <p className="font-[var(--font-poppins-brand)] text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">
                My Account
              </p>
              <p className="mt-0.5 truncate font-[var(--font-poppins-brand)] text-sm font-semibold">
                {user.name}
              </p>
            </div>
          </div>
        </div>

        <nav aria-label="Account navigation" className="p-3">
          <div className="space-y-1">
            {ACCOUNT_NAVIGATION.map((item) => {
              const active = isActivePath(pathname, item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors ${
                    active
                      ? "bg-[#F2EDF9] text-[#5F4C8C]"
                      : "text-[#667085] hover:bg-[#F8F6FB] hover:text-[#3F4654]"
                  }`}
                >
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                      active
                        ? "bg-[#A092CD] text-white"
                        : "bg-[#F7F5FA] text-[#7B8494] group-hover:bg-white"
                    }`}
                  >
                    <Icon className="size-[17px]" strokeWidth={1.9} />
                  </span>

                  <span className="min-w-0">
                    <span className="block font-[var(--font-playpen)] text-[13px] font-semibold">
                      {item.label}
                    </span>
                    <span className="mt-0.5 block truncate font-[var(--font-poppins-brand)] text-[12px] text-current/60">
                      {item.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="my-3 h-px bg-[#EEEAF4]" />

          <Link
            href={ACCOUNT_STORE_LINK.href}
            className="flex items-center gap-3 rounded-2xl px-3 py-3 text-[#667085] transition-colors hover:bg-[#F8F6FB] hover:text-[#3F4654]"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#F7F5FA]">
              <ACCOUNT_STORE_LINK.icon className="size-[17px]" strokeWidth={1.9} />
            </span>

            <span>
              <span className="block font-[var(--font-poppins-brand)] text-[13px] font-semibold">
                {ACCOUNT_STORE_LINK.label}
              </span>
              <span className="mt-0.5 block font-[var(--font-poppins-brand)] text-[10px] text-[#98A0AE]">
                {ACCOUNT_STORE_LINK.description}
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => void handleLogout()}
            className="mt-1 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-[#A04D61] transition-colors hover:bg-[#FFF2F5]"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF5F7]">
              <LogOut className="size-[17px]" strokeWidth={1.9} />
            </span>

            <span>
              <span className="block font-[var(--font-poppins-brand)] text-[13px] font-semibold">
                Sign out
              </span>
              <span className="mt-0.5 block font-[var(--font-poppins-brand)] text-[10px] text-[#C18795]">
                Leave your account
              </span>
            </span>
          </button>
        </nav>
      </div>
    </aside>
  );
}
