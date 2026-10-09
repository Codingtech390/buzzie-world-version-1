import type { LucideIcon } from "lucide-react";

interface AccountStatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  description: string;
}

export default function AccountStatCard({
  icon: Icon,
  label,
  value,
  description,
}: AccountStatCardProps) {
  return (
    <article className="rounded-[24px] border border-[#E9E4F1] bg-white p-4 shadow-[0_12px_40px_rgba(82,68,112,0.05)] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-10 items-center justify-center rounded-2xl bg-[#F2EDF9] text-[#6B5A97]">
          <Icon className="size-[18px]" strokeWidth={1.9} />
        </span>

        <span className="rounded-full bg-[#F8F6FB] px-2.5 py-1 font-[var(--font-poppins-brand)] text-[9px] font-semibold uppercase tracking-[0.12em] text-[#9A91AC]">
          Account
        </span>
      </div>

      <p className="mt-5 font-[var(--font-poppins-brand)] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9A91AC]">
        {label}
      </p>

      <p className="mt-1 font-[var(--font-poppins-brand)] text-lg font-bold text-[#303746]">
        {value}
      </p>

      <p className="mt-1 font-[var(--font-poppins-brand)] text-[11px] leading-4 text-[#8A92A0]">
        {description}
      </p>
    </article>
  );
}
