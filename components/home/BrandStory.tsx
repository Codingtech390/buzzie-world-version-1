import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Sparkles,
  WandSparkles,
} from "lucide-react";

import type { StorefrontProduct } from "@/types/storefront";

import { siteConfig } from "@/config/site";

import Reveal from "./Reveal";

interface BrandStoryProps {
  products: StorefrontProduct[];
}

export default function BrandStory({ products }: BrandStoryProps) {
  const storyProducts = products.filter((product) =>
    product.images?.some((image) => image.url),
  );

  const leftProduct = storyProducts[0];
  const rightProduct = storyProducts[1];

  const leftImage = leftProduct?.images?.find((image) => image.url)?.url;
  const rightImage = rightProduct?.images?.find((image) => image.url)?.url;

  return (
    <section className="section relative overflow-hidden bg-[#FFF8EC]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-12rem] top-[-8rem] size-96 rounded-full bg-[#F8C83B]/10 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10rem] bottom-[-8rem] size-96 rounded-full bg-[#3F7DFF]/8 blur-3xl"
      />

      <div className="container relative">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal>
            <div className="relative mx-auto w-full max-w-[580px]">
              <div className="relative aspect-square">
                <div
                  aria-hidden="true"
                  className="absolute left-[3%] top-[12%] h-[65%] w-[58%] rotate-[-7deg] rounded-[35px] bg-[#F8C83B]/25 blur-xl"
                />

                <div
                  aria-hidden="true"
                  className="absolute bottom-[8%] right-[3%] h-[65%] w-[55%] rotate-[7deg] rounded-[35px] bg-[#3F7DFF]/12 blur-xl"
                />

                <div className="absolute left-[6%] top-[8%] w-[57%] rotate-[-5deg] overflow-hidden rounded-[34px] border border-white bg-white p-2 shadow-[0_28px_65px_rgba(39,52,74,0.11)] transition-transform duration-500 hover:-rotate-3">
                  <div className="relative aspect-[0.9] overflow-hidden rounded-[27px] bg-white">
                    {leftImage ? (
                      <Image
                        src={leftImage}
                        alt={leftProduct?.name || "BuzzieWorld product"}
                        fill
                        sizes="(max-width: 1023px) 48vw, 30vw"
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#FFFDF9]">
                        <Sparkles className="size-10 text-[#3F7DFF]" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="absolute bottom-[4%] right-[4%] w-[57%] rotate-[6deg] overflow-hidden rounded-[34px] border border-white bg-white p-2 shadow-[0_28px_65px_rgba(39,52,74,0.11)] transition-transform duration-500 hover:rotate-3">
                  <div className="relative aspect-[0.9] overflow-hidden rounded-[27px] bg-[#FFF8EC]">
                    {rightImage ? (
                      <Image
                        src={rightImage}
                        alt={rightProduct?.name || "BuzzieWorld product"}
                        fill
                        sizes="(max-width: 1023px) 48vw, 30vw"
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#FFF8EC]">
                        <Heart className="size-10 text-[#F56B9A]" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="absolute right-[10%] top-[5%] flex size-16 items-center justify-center rounded-full bg-[#79D45C] text-white shadow-[0_16px_35px_rgba(121,212,92,0.24)] sm:size-20">
                  <Heart className="size-7 fill-current" />
                </div>

                <div
                  aria-hidden="true"
                  className="absolute bottom-[11%] left-[3%] flex size-12 items-center justify-center rounded-[17px] bg-white text-[#3F7DFF] shadow-[0_15px_30px_rgba(39,52,74,0.08)]"
                >
                  <Sparkles className="size-5" />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#3F7DFF] shadow-sm">
                <WandSparkles className="size-3.5" />
                The BuzzieWorld idea
              </div>

              <h2 className="mt-5 font-[var(--font-roboto)] text-[clamp(2.4rem,5vw,4.8rem)] font-black leading-[0.94] tracking-[-0.055em] text-[#27344A]">
                More than things to play with.
              </h2>

              <p className="mt-6 text-base leading-8 text-[#687489] sm:text-lg">
                {siteConfig.description} We believe the best childhood
                products do more than fill a shelf — they create an invitation
                to imagine, make, discover and share.
              </p>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[#687489]">
                That is why BuzzieWorld is being shaped as a place families
                can return to whenever they are looking for the next tiny spark
                of curiosity.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  "Play with purpose",
                  "Discover together",
                  "Choose with confidence",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white bg-white/65 p-4 shadow-sm"
                  >
                    <span className="flex size-7 items-center justify-center rounded-full bg-[#3F7DFF]/10 text-[#3F7DFF]">
                      <Sparkles className="size-3.5" />
                    </span>

                    <p className="mt-3 text-xs font-bold leading-5 text-[#526075]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/about"
                className="group mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#27344A] px-6 text-sm font-bold text-white shadow-[0_15px_30px_rgba(39,52,74,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1D2739] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
              >
                Discover BuzzieWorld
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
