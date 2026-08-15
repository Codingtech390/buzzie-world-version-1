import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Sparkles } from "lucide-react";

import type { StorefrontProduct } from "@/types/storefront";
import { siteConfig } from "@/config/site";

import Reveal from "./Reveal";

interface BrandStoryProps {
  products: StorefrontProduct[];
}

export default function BrandStory({ products }: BrandStoryProps) {
  const storyProducts = products.filter(
    (product) => product.images?.[0]?.url,
  );

  const leftImage = storyProducts[0]?.images?.[0]?.url;
  const rightImage = storyProducts[1]?.images?.[0]?.url;

  return (
    <section className="section overflow-hidden bg-[#FFF8EC]">
      <div className="container">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal>
            <div className="relative mx-auto w-full max-w-[600px]">
              <div className="relative aspect-[0.96]">
                <div
                  aria-hidden="true"
                  className="absolute left-[4%] top-[10%] h-[68%] w-[58%] rotate-[-7deg] rounded-[34px] bg-[#F8C83B]/25 blur-xl"
                />

                <div
                  aria-hidden="true"
                  className="absolute bottom-[8%] right-[4%] h-[68%] w-[55%] rotate-[8deg] rounded-[34px] bg-[#3F7DFF]/10 blur-xl"
                />

                <div className="absolute left-[7%] top-[7%] w-[58%] rotate-[-5deg] overflow-hidden rounded-[34px] border border-white bg-white p-2 shadow-[0_25px_55px_rgba(39,52,74,0.1)]">
                  <div className="relative aspect-[0.9] overflow-hidden rounded-[28px] bg-white">
                    {leftImage ? (
                      <Image
                        src={leftImage}
                        alt={storyProducts[0]?.name || "BuzzieWorld product"}
                        fill
                        sizes="(max-width: 1023px) 48vw, 30vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-white">
                        <Sparkles className="size-10 text-[#3F7DFF]" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="absolute bottom-[4%] right-[4%] w-[58%] rotate-[6deg] overflow-hidden rounded-[34px] border border-white bg-white p-2 shadow-[0_25px_55px_rgba(39,52,74,0.1)]">
                  <div className="relative aspect-[0.9] overflow-hidden rounded-[28px] bg-[#FFF8EC]">
                    {rightImage ? (
                      <Image
                        src={rightImage}
                        alt={storyProducts[1]?.name || "BuzzieWorld product"}
                        fill
                        sizes="(max-width: 1023px) 48vw, 30vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[#FFF8EC]">
                        <Heart className="size-10 text-[#F56B9A]" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="absolute right-[11%] top-[5%] flex size-16 items-center justify-center rounded-full bg-[#79D45C] text-white shadow-[0_14px_30px_rgba(121,212,92,0.24)] sm:size-20">
                  <Heart className="size-7 fill-current" />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3F7DFF]">
                The BuzzieWorld idea
              </p>

              <h2 className="mt-4 font-[var(--font-roboto)] text-[clamp(2.3rem,5vw,4.7rem)] font-black leading-[0.98] tracking-[-0.05em] text-[#27344A]">
                More than things to play with.
              </h2>

              <p className="mt-6 text-base leading-8 text-[#687489] sm:text-lg">
                {siteConfig.description} We believe the best childhood
                products do more than fill a shelf — they create an invitation
                to imagine, make, discover and share.
              </p>

              <p className="mt-4 text-sm leading-7 text-[#687489]">
                That is why BuzzieWorld is being shaped as a place families
                can return to whenever they are looking for the next tiny spark
                of curiosity.
              </p>

              <Link
                href="/about"
                className="group mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#27344A] px-6 text-sm font-bold text-white shadow-[0_15px_30px_rgba(39,52,74,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1D2739] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
              >
                Discover BuzzieWorld
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2.1}
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
