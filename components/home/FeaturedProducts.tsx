import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { StorefrontProduct } from "@/types/storefront";

import ProductCard from "@/components/product/ProductCard";

import Reveal from "./Reveal";

interface FeaturedProductsProps {
  products: StorefrontProduct[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="section-tight bg-white">
      <div className="container">
        <Reveal>
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3F7DFF]">
                Handpicked for little explorers
              </p>

              <h2 className="mt-3 font-[var(--font-roboto)] text-3xl font-black tracking-[-0.04em] text-[#27344A] sm:text-4xl">
                Featured favourites
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#687489] sm:text-base">
                A playful mix of products currently highlighted in the BuzzieWorld catalog.
              </p>
            </div>

            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 text-sm font-bold text-[#3F7DFF] transition-colors hover:text-[#2A62D8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
            >
              View all products
              <ArrowRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-1"
                strokeWidth={2.1}
              />
            </Link>
          </div>
        </Reveal>

        <div className="mt-9 grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {products.slice(0, 8).map((product, index) => (
            <Reveal key={product._id} delay={index * 0.035}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
