import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";

import type { StorefrontProduct } from "@/types/storefront";

import ProductCard from "@/components/product/ProductCard";

import Reveal from "./Reveal";

interface BestSellersProps {
  products: StorefrontProduct[];
  featuredProducts: StorefrontProduct[];
}

export default function BestSellers({ products, featuredProducts }: BestSellersProps) {
  const mergedProducts = Array.from(
    new Map([...featuredProducts, ...products].map((product) => [product._id, product])).values(),
  ).slice(0, 8);

  if (mergedProducts.length === 0) {
    return null;
  }

  return (
    <section className="section-tight bg-white">
      <div className="container">
        <Reveal>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F56B9A]/10 px-3 py-1.5 text-xs font-bold text-[#C44770]">
                <Flame className="size-3.5" strokeWidth={2} />
                Fresh from the kingdom
              </div>

              <h2 className="mt-4 font-[var(--font-roboto)] text-3xl font-black tracking-[-0.04em] text-[#27344A] sm:text-4xl">
                More to explore
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#687489] sm:text-base">
                The current catalog exposes featured and newest products rather than sales-ranked
                bestseller data, so this section highlights more of what is available right now.
              </p>
            </div>

            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 text-sm font-bold text-[#3F7DFF] transition-colors hover:text-[#2A62D8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
            >
              Discover more
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                strokeWidth={2.1}
              />
            </Link>
          </div>
        </Reveal>

        <div className="mt-9 grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
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
