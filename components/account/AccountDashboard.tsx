import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, MapPin, UserRound } from "lucide-react";

import AccountStatCard from "@/components/account/AccountStatCard";
import type { AccountUser } from "@/types/customer-account";

interface AccountDashboardProps {
  user: AccountUser;
}

function formatMemberSince(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function AccountDashboard({ user }: AccountDashboardProps) {
  const profileComplete = Boolean(user.name.trim() && user.email.trim());
  const contactReady = Boolean(user.phone?.trim());

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-[30px] border border-[#E6E0EF] bg-white shadow-[0_18px_60px_rgba(82,68,112,0.06)]">
        <div className="relative px-5 py-6 sm:px-7 sm:py-7">
          <div className="absolute -right-20 -top-24 size-64 rounded-full bg-[#F1EAF9] blur-2xl" />
          <div className="absolute -bottom-24 left-1/3 size-48 rounded-full bg-[#FFF1D8] blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3EEF9] px-3 py-1.5 font-playpen text-[10px] font-semibold text-[#6B5A97]">
                <CheckCircle2 className="size-3.5" strokeWidth={2} />
                Customer account ready
              </span>

              <h2 className="mt-4 font-playpen text-xl font-bold tracking-[-0.02em] text-[#303746] sm:text-2xl">
                Everything you need, in one little corner of the kingdom.
              </h2>

              <p className="mt-2 max-w-xl font-[var(--font-poppins-brand)] text-xs leading-5 text-[#7B8494] sm:text-[13px]">
                Your account foundation is ready. Update your profile now, while orders, wishlist,
                addresses and reviews continue to plug into the same account shell.
              </p>
            </div>

            <Link
              href="/account/profile"
              className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-[#A092CD] px-5 py-3 font-[var(--font-poppins-brand)] text-[11px] font-semibold !text-white shadow-[0_12px_28px_rgba(160,146,205,0.28)] transition-transform hover:-translate-y-0.5"
            >
              <span className="!text-white">Manage profile</span>
              <ArrowRight className="size-3.5 !text-white" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AccountStatCard
          icon={UserRound}
          label="Profile"
          value={profileComplete ? "Ready" : "Incomplete"}
          description={
            contactReady
              ? "Your basic contact details are filled in."
              : "Add a phone number when you are ready."
          }
        />

        <AccountStatCard
          icon={MapPin}
          label="Saved addresses"
          value={String(user.addressCount)}
          description={
            user.addressCount > 0
              ? "Saved delivery addresses on your account."
              : "No delivery address has been saved yet."
          }
        />

        <AccountStatCard
          icon={CalendarDays}
          label="Member since"
          value={formatMemberSince(user.createdAt)}
          description="Your BuzzieWorld customer account creation date."
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[26px] border border-[#E9E4F1] bg-white p-5 shadow-[0_12px_40px_rgba(82,68,112,0.05)] sm:p-6">
          <div>
            <p className="font-[var(--font-poppins-brand)] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9A91AC]">
              Quick actions
            </p>

            <h3 className="mt-1 font-playpen text-base font-bold text-[#303746]">
              Keep your account ready
            </h3>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link
              href="/account/profile"
              className="group rounded-2xl border border-[#EEEAF4] bg-[#FCFBFE] p-4 transition-colors hover:border-[#D9D0E8] hover:bg-[#F8F5FC]"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-[#F1EBF8] text-[#6B5A97]">
                <UserRound className="size-4" strokeWidth={1.9} />
              </span>

              <p className="mt-3 font-[var(--font-poppins-brand)] text-xs font-semibold text-[#3E4655]">
                Update profile
              </p>

              <p className="mt-1 font-[var(--font-poppins-brand)] text-[10px] leading-4 text-[#8A92A0]">
                Keep your name and phone details current.
              </p>

              <ArrowRight className="mt-3 size-4 text-[#A092CD] transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/account/addresses"
              className="group rounded-2xl border border-[#EEEAF4] bg-[#FCFBFE] p-4 transition-colors hover:border-[#D9D0E8] hover:bg-[#F8F5FC]"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-[#FFF4E6] text-[#B7762A]">
                <MapPin className="size-4" strokeWidth={1.9} />
              </span>

              <p className="mt-3 font-[var(--font-poppins-brand)] text-xs font-semibold text-[#3E4655]">
                Manage addresses
              </p>

              <p className="mt-1 font-[var(--font-poppins-brand)] text-[10px] leading-4 text-[#8A92A0]">
                Your saved delivery addresses live here.
              </p>

              <ArrowRight className="mt-3 size-4 text-[#A092CD] transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="rounded-[26px] border border-[#E9E4F1] bg-[#F7F4FB] p-5 sm:p-6">
          <p className="font-[var(--font-poppins-brand)] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8E849F]">
            Account roadmap
          </p>

          <h3 className="mt-1 font-playpen text-base font-bold text-[#303746]">
            Your account will grow from this foundation.
          </h3>

          <div className="mt-5 space-y-3">
            {[
              ["Profile", "Available now"],
              ["Addresses", "Next customer module"],
              ["Orders", "Next customer module"],
              ["Wishlist", "Next customer module"],
              ["Reviews", "Next customer module"],
            ].map(([label, status]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 rounded-2xl bg-white/75 px-4 py-3"
              >
                <span className="font-[var(--font-poppins-brand)] text-[11px] font-semibold text-[#4D5564]">
                  {label}
                </span>

                <span className="font-[var(--font-poppins-brand)] text-[9px] font-semibold uppercase tracking-[0.08em] text-[#9A91AC]">
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
