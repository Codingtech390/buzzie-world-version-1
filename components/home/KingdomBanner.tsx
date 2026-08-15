import Link from "next/link";
import { ArrowRight, Cloud, Sparkles, Stars, WandSparkles } from "lucide-react";

import Reveal from "./Reveal";

export default function KingdomBanner() {
  return (
    <section className="relative overflow-hidden bg-[#27344A] py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(63,125,255,0.35),transparent_28%),radial-gradient(circle_at_83%_20%,rgba(248,200,59,0.23),transparent_24%),radial-gradient(circle_at_70%_90%,rgba(121,212,92,0.18),transparent_30%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[7%] top-12 text-[#F8C83B] opacity-80"
      >
        <Stars className="size-8 rotate-12" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[10%] top-20 text-white/50"
      >
        <Cloud className="size-16" strokeWidth={1.2} />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-12 left-[18%] text-[#79D45C]/60"
      >
        <Sparkles className="size-9" />
      </div>

      <div className="container relative">
        <Reveal>
          <div className="relative overflow-hidden rounded-[38px] border border-white/10 bg-white/[0.055] px-6 py-12 shadow-[0_30px_80px_rgba(0,0,0,0.18)] backdrop-blur-[6px] sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 size-48 rounded-full border border-[#F8C83B]/20 bg-[#F8C83B]/8 blur-2xl"
            />

            <div
              aria-hidden="true"
              className="absolute -bottom-24 -left-24 size-64 rounded-full border border-[#3F7DFF]/20 bg-[#3F7DFF]/10 blur-3xl"
            />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white/70">
                  <WandSparkles className="size-3.5 text-[#F8C83B]" />A little BuzzieWorld magic
                </div>

                <h2 className="mt-6 font-[var(--font-roboto)] text-[clamp(2.25rem,5.5vw,4.7rem)] font-black leading-[0.96] tracking-[-0.05em] text-white">
                  Make room for
                  <span className="text-[#F8C83B]"> bigger wonder.</span>
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                  Childhood is full of tiny moments that become big memories. Fill those moments
                  with things worth discovering, creating and keeping.
                </p>

                <Link
                  href="/about"
                  className="group mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-[#27344A] shadow-[0_15px_35px_rgba(0,0,0,0.13)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#FFF8EC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F8C83B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#27344A]"
                >
                  Discover our story
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={2.1}
                  />
                </Link>
              </div>

              <div
                aria-hidden="true"
                className="relative mx-auto flex aspect-square w-full max-w-[260px] items-center justify-center lg:mr-6 lg:max-w-[320px]"
              >
                <div className="absolute inset-[12%] rounded-[34%_46%_38%_42%] border border-white/10 bg-white/5 backdrop-blur-sm" />

                <div className="absolute inset-[23%] flex items-center justify-center rounded-[30px] bg-[linear-gradient(145deg,#3F7DFF,#79D45C)] shadow-[0_30px_60px_rgba(63,125,255,0.25)]">
                  <Sparkles className="size-14 text-white" strokeWidth={1.5} />
                </div>

                <div className="absolute left-[8%] top-[24%] flex size-12 rotate-[-12deg] items-center justify-center rounded-[16px] bg-[#F8C83B] text-[#5B4300] shadow-[0_12px_25px_rgba(248,200,59,0.18)]">
                  <Stars className="size-5" />
                </div>

                <div className="absolute bottom-[15%] right-[5%] flex size-14 rotate-6 items-center justify-center rounded-[18px] bg-[#F56B9A] text-white shadow-[0_15px_30px_rgba(245,107,154,0.18)]">
                  <span className="text-2xl font-black">+</span>
                </div>

                <div className="absolute right-[14%] top-[8%] size-5 rounded-full bg-white/80" />
                <div className="absolute bottom-[10%] left-[12%] size-3 rounded-full bg-[#79D45C]" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
