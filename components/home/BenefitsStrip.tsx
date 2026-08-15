import {
  BadgeCheck,
  CreditCard,
  RefreshCcw,
  Truck,
} from "lucide-react";

import Reveal from "./Reveal";

const benefits = [
  {
    title: "Curated Quality",
    description: "Thoughtful picks for curious young minds.",
    icon: BadgeCheck,
    className: "bg-[#79D45C]/10 text-[#4D9A38]",
  },
  {
    title: "Secure Payments",
    description: "Checkout protected by trusted payment rails.",
    icon: CreditCard,
    className: "bg-[#3F7DFF]/10 text-[#2A62D8]",
  },
  {
    title: "Fast Delivery",
    description: "Little adventures shouldn't have to wait.",
    icon: Truck,
    className: "bg-[#F8C83B]/20 text-[#A67A00]",
  },
  {
    title: "Easy Returns",
    description: "A shopping experience designed for parents.",
    icon: RefreshCcw,
    className: "bg-[#F56B9A]/10 text-[#C44770]",
  },
] as const;

export default function BenefitsStrip() {
  return (
    <section className="relative z-10 -mt-5 sm:-mt-8">
      <div className="container">
        <Reveal>
          <div className="overflow-hidden rounded-[28px] border border-[#EEDDBB]/75 bg-white/92 shadow-[0_18px_45px_rgba(39,52,74,0.09)] backdrop-blur-xl">
            <div className="grid divide-y divide-[#EEDDBB]/65 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className="flex items-center gap-3 px-4 py-4 sm:px-5 sm:py-5"
                  >
                    <span
                      className={`flex size-11 shrink-0 items-center justify-center rounded-[16px] ${benefit.className}`}
                    >
                      <Icon className="size-5" strokeWidth={1.9} />
                    </span>

                    <div className="min-w-0">
                      <h2 className="font-[var(--font-roboto)] text-sm font-black text-[#27344A]">
                        {benefit.title}
                      </h2>

                      <p className="mt-0.5 text-xs leading-5 text-[#687489]">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
