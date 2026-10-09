"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ACCOUNT_NAVIGATION } from "@/components/account/account-navigation";

function isActivePath(pathname: string, href: string) {
  if (href === "/account") {
    return pathname === "/account";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AccountMobileNav() {
  const pathname = usePathname();

  return (
    <div className="mb-5 overflow-x-auto pb-1 lg:hidden">
      <nav
        aria-label="Mobile account navigation"
        className="flex min-w-max gap-2 rounded-[22px] border border-[#E7E1F0] bg-white p-2 shadow-[0_12px_35px_rgba(82,68,112,0.06)]"
      >
        {ACCOUNT_NAVIGATION.map((item) => {
          const active = isActivePath(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-2xl px-3.5 py-2.5 font-[var(--font-poppins-brand)] text-[11px] font-semibold transition-colors ${
                active ? "bg-[#A092CD] text-white" : "text-[#667085] hover:bg-[#F6F3FA]"
              }`}
            >
              <Icon className="size-4" strokeWidth={1.9} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
