import type { Metadata } from "next";

import ReviewList from "@/components/account/ReviewList";

export const metadata: Metadata = {
  title: "My Reviews",
  description: "View and manage your BuzzieWorld product reviews.",
};

export default function AccountReviewsPage() {
  return (
    <div className="space-y-5">
      <div>
        <p className="font-[var(--font-poppins-brand)] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9A91AC]">
          Reviews
        </p>

        <h2 className="mt-1 font-[var(--font-poppins-brand)] text-xl font-bold text-[#303746]">
          My Reviews
        </h2>

        <p className="mt-1.5 max-w-2xl font-[var(--font-poppins-brand)] text-xs leading-5 text-[#7B8494]">
          Share your experience with products you have purchased.
        </p>
      </div>

      <ReviewList />
    </div>
  );
}
