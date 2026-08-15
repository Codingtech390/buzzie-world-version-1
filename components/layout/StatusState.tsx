import { AlertCircle, ArrowRight, Boxes, LoaderCircle, RotateCcw } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type StatusStateVariant = "loading" | "empty" | "error";

interface StatusStateProps {
  variant: StatusStateVariant;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  children?: ReactNode;
}

const defaults: Record<
  StatusStateVariant,
  {
    title: string;
    description: string;
  }
> = {
  loading: {
    title: "Preparing your BuzzieWorld experience",
    description: "Just a moment while everything comes together.",
  },
  empty: {
    title: "Nothing here yet",
    description: "There is nothing to show right now. Explore another part of BuzzieWorld.",
  },
  error: {
    title: "Something went wrong",
    description: "We couldn't load this experience correctly. Please try again.",
  },
};

export default function StatusState({
  variant,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  children,
}: StatusStateProps) {
  const content = defaults[variant];

  const Icon = variant === "loading" ? LoaderCircle : variant === "empty" ? Boxes : AlertCircle;

  const resolvedTitle = title ?? content.title;
  const resolvedDescription = description ?? content.description;

  return (
    <section
      aria-live={variant === "loading" ? "polite" : "assertive"}
      className="flex min-h-[55vh] items-center justify-center px-4 py-16 sm:px-6"
    >
      <div className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-[#EEDDBB]/75 bg-white/85 px-6 py-10 text-center shadow-[0_24px_60px_rgba(39,52,74,0.08)] backdrop-blur sm:px-10 sm:py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 size-44 rounded-full bg-[#3F7DFF]/8 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -left-20 size-48 rounded-full bg-[#F8C83B]/10 blur-3xl"
        />

        <div className="relative mx-auto flex size-16 items-center justify-center rounded-[22px] bg-[#FFF8EC] text-[#3F7DFF]">
          <Icon
            className={variant === "loading" ? "size-7 animate-spin" : "size-7"}
            strokeWidth={variant === "loading" ? 1.8 : 1.9}
          />
        </div>

        <h1 className="relative mt-6 font-[var(--font-roboto)] text-2xl font-black tracking-[-0.035em] text-[#27344A] sm:text-3xl">
          {resolvedTitle}
        </h1>

        <p className="relative mx-auto mt-3 max-w-md text-sm leading-6 text-[#687489] sm:text-[0.95rem]">
          {resolvedDescription}
        </p>

        {children ? <div className="relative mt-5">{children}</div> : null}

        {onAction ? (
          <button
            type="button"
            onClick={onAction}
            className="relative mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#3F7DFF] px-5 text-sm font-bold text-white shadow-[0_12px_26px_rgba(63,125,255,0.2)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
          >
            <RotateCcw className="size-4" strokeWidth={2} />
            {actionLabel ?? "Try again"}
          </button>
        ) : actionHref ? (
          <Link
            href={actionHref}
            className="relative mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#3F7DFF] px-5 text-sm font-bold text-white shadow-[0_12px_26px_rgba(63,125,255,0.2)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
          >
            {actionLabel ?? "Continue"}
            <ArrowRight className="size-4" strokeWidth={2} />
          </Link>
        ) : null}
      </div>
    </section>
  );
}
