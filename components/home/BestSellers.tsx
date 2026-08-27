import Link from "next/link";
import { ArrowRight, Compass, Sparkles } from "lucide-react";

import type { StorefrontProduct } from "@/types/storefront";

import ProductCard from "@/components/product/ProductCard";

import Reveal from "./Reveal";

interface BestSellersProps {
  products: StorefrontProduct[];
  featuredProducts: StorefrontProduct[];
}

export default function BestSellers({
  products,
  featuredProducts,
}: BestSellersProps) {
  const mergedProducts = Array.from(
    new Map(
      [...featuredProducts, ...products].map((product) => [
        product._id,
        product,
      ]),
    ).values(),
  ).slice(0, 8);

  if (mergedProducts.length === 0) {
    return null;
  }

  return (
    <section className="section-tight relative overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 bottom-[-10rem] size-80 rounded-full bg-[#79D45C]/7 blur-3xl"
      />

      <div className="container relative">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#79D45C]/10 px-3 py-1.5 text-xs font-bold text-[#4D9A38]">
                <Compass className="size-3.5" />
                Fresh from the kingdom
              </div>

              <h2 className="mt-4 font-[var(--font-roboto)] text-[clamp(2rem,4vw,3.3rem)] font-black leading-[1] tracking-[-0.045em] text-[#27344A]">
                More to explore
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-[#687489] sm:text-base">
                Discover more from the current BuzzieWorld catalog.
              </p>
            </div>

            <Link
              href="/shop"
              className="group inline-flex min-h-10 shrink-0 items-center gap-2 text-sm font-bold text-[#3F7DFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
            >
              Discover more
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-7 flex items-center gap-2 rounded-2xl border border-[#EEDDBB]/60 bg-[#FFF8EC]/60 px-4 py-3 text-xs leading-5 text-[#687489]">
            <Sparkles className="size-4 shrink-0 text-[#F8C83B]" />
            This section reflects featured and newest catalog products. It does
            not claim sales-ranked bestseller data.
          </div>
        </Reveal>

        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {mergedProducts.map((product, index) => (
            <Reveal key={product._id} delay={index * 0.035}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
