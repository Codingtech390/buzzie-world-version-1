import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

import type { StorefrontProduct } from "@/types/storefront";

import Reveal from "./Reveal";

interface ShopByAgeProps {
  products: StorefrontProduct[];
}

interface AgeBand {
  label: string;
  title: string;
  min: number;
  max: number;
  accent: string;
  surface: string;
}

const ageBands: AgeBand[] = [
  {
    label: "1–3",
    title: "Tiny explorers",
    min: 1,
    max: 3,
    accent: "#F56B9A",
    surface: "#FFF2F6",
  },
  {
    label: "3–6",
    title: "Curious creators",
    min: 3,
    max: 6,
    accent: "#F8C83B",
    surface: "#FFF9E8",
  },
  {
    label: "6–9",
    title: "Big imaginations",
    min: 6,
    max: 9,
    accent: "#79D45C",
    surface: "#F4FBF0",
  },
  {
    label: "9–15",
    title: "Bold discoverers",
    min: 9,
    max: 15,
    accent: "#3F7DFF",
    surface: "#F1F5FF",
  },
];

function getMatchingProduct(
  products: StorefrontProduct[],
  min: number,
  max: number,
): StorefrontProduct | undefined {
  return products.find((product) => {
    const productMin = product.ageRange?.min ?? 0;
    const productMax = product.ageRange?.max ?? 99;

    return productMin <= max && productMax >= min;
  });
}

export default function ShopByAge({ products }: ShopByAgeProps) {
  return (
    <section className="section relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-8rem] top-20 size-64 rounded-full bg-[#3F7DFF]/5 blur-3xl"
      />

      <div className="container relative">
        <Reveal>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3F7DFF]">
                Find their next adventure
              </p>

              <h2 className="mt-3 font-[var(--font-roboto)] text-3xl font-black tracking-[-0.04em] text-[#27344A] sm:text-4xl lg:text-5xl">
                Shop by age
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#687489] sm:text-base">
                Start with their stage, then let curiosity take the lead.
              </p>
            </div>

            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 text-sm font-bold text-[#3F7DFF] transition-colors hover:text-[#2A62D8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
            >
              Explore everything
              <ArrowUpRight
                className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={2.1}
              />
            </Link>
          </div>
        </Reveal>

        <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {ageBands.map((band, index) => {
            const product = getMatchingProduct(products, band.min, band.max);
            const image = product?.images?.[0]?.url;
            const imageAlt = product?.images?.[0]?.alt || product?.name;

            return (
              <Reveal key={band.label} delay={index * 0.04}>
                <Link
                  href="/shop"
                  className="group relative block h-full overflow-hidden rounded-[28px] border border-[#EEDDBB]/55 bg-white p-2 shadow-[0_12px_35px_rgba(39,52,74,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_45px_rgba(39,52,74,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
                >
                  <div
                    className="relative aspect-square overflow-hidden rounded-[22px]"
                    style={{ backgroundColor: band.surface }}
                  >
                    <div
                      aria-hidden="true"
                      className="absolute -right-8 -top-8 size-28 rounded-full opacity-70 blur-2xl"
                      style={{ backgroundColor: band.accent }}
                    />

                    {image ? (
                      <Image
                        src={image}
                        alt={imageAlt || `${band.label} age collection`}
                        fill
                        sizes="(max-width: 639px) 45vw, (max-width: 1023px) 30vw, 24vw"
                        className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Sparkles className="size-12 opacity-60" style={{ color: band.accent }} />
                      </div>
                    )}

                    <div className="absolute bottom-3 left-3 rounded-full bg-white/88 px-3 py-1.5 text-xs font-black shadow-sm backdrop-blur">
                      {band.label} yrs
                    </div>
                  </div>

                  <div className="px-2 pb-2 pt-4">
                    <p
                      className="text-[0.62rem] font-bold uppercase tracking-[0.16em]"
                      style={{ color: band.accent }}
                    >
                      Explore
                    </p>

                    <h3 className="mt-1 font-[var(--font-roboto)] text-base font-black tracking-[-0.025em] text-[#27344A] sm:text-lg">
                      {band.title}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
