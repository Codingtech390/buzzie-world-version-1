"use client";

import { RefreshCcw } from "lucide-react";

interface AccountErrorProps {
  reset: () => void;
}

export default function AccountError({ reset }: AccountErrorProps) {
  return (
    <div className="rounded-[28px] border border-[#E9E4F1] bg-white px-6 py-12 text-center shadow-[0_12px_40px_rgba(82,68,112,0.05)]">
      <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#F3EEF9] text-[#6B5A97]">
        <RefreshCcw className="size-5" strokeWidth={1.9} />
      </div>

      <h2 className="mt-4 font-[var(--font-poppins-brand)] text-lg font-bold text-[#303746]">
        We could not load this account page.
      </h2>

      <p className="mx-auto mt-2 max-w-md font-[var(--font-poppins-brand)] text-xs leading-5 text-[#7B8494]">
        Please try again. Your account data has not been changed by this error.
      </p>

      <button
        type="button"
        onClick={() => reset()}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#A092CD] px-5 py-2.5 font-[var(--font-poppins-brand)] text-[11px] font-semibold text-white"
      >
        <RefreshCcw className="size-3.5" strokeWidth={2} />
        Try again
      </button>
    </div>
  );
}
