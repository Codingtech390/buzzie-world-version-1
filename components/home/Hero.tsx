import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cloud, Compass, Sparkles, Star, Stars, WandSparkles } from "lucide-react";

import type { StorefrontProduct } from "@/types/storefront";

import Reveal from "./Reveal";

interface HeroProps {
  products: StorefrontProduct[];
}

export default function Hero({ products }: HeroProps) {
  const heroProduct =
    products.find((product) => product.images?.some((image) => Boolean(image.url))) ?? products[0];

  const heroImage = heroProduct?.images?.find((image) => Boolean(image.url))?.url;
  const heroAlt =
    heroProduct?.images?.find((image) => Boolean(image.alt))?.alt ||
    heroProduct?.name ||
    "BuzzieWorld product";

  return (
    <section className="relative isolate overflow-hidden bg-[#FFF8EC]">
      {/* Ambient world */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-16 size-72 rounded-full bg-[#F8C83B]/16 blur-3xl" />
        <div className="absolute right-[-10rem] top-[-5rem] size-[34rem] rounded-full bg-[#3F7DFF]/10 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[34%] size-[30rem] rounded-full bg-[#79D45C]/10 blur-3xl" />

        <div className="absolute left-[7%] top-[16%] animate-float-gently text-[#F8C83B]/75">
          <Stars className="size-7 sm:size-9" />
        </div>

        <div className="absolute right-[7%] top-[23%] hidden text-[#3F7DFF]/30 sm:block">
          <Cloud className="size-20" strokeWidth={1} />
        </div>

        <div className="absolute bottom-[12%] left-[8%] text-[#F56B9A]/30">
          <Sparkles className="size-8" />
        </div>

        <div className="absolute bottom-[16%] right-[15%] text-[#79D45C]/35">
          <Star className="size-5 fill-current" />
        </div>

        <div className="absolute left-[46%] top-[12%] size-2 rounded-full bg-[#3F7DFF]/35" />
        <div className="absolute left-[54%] top-[23%] size-1.5 rounded-full bg-[#F8C83B]/60" />
        <div className="absolute right-[28%] bottom-[23%] size-2 rounded-full bg-[#F56B9A]/35" />
      </div>

      <div className="container relative">
        <div className="grid min-h-[calc(100svh-4.5rem)] items-center gap-12 py-12 sm:py-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8 lg:py-20 xl:min-h-[760px]">
          {/* Copy */}
          <Reveal className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#EEDDBB]/80 bg-white/75 px-3.5 py-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#526075] shadow-[0_10px_30px_rgba(39,52,74,0.06)] backdrop-blur-xl">
              <span className="flex size-5 items-center justify-center rounded-full bg-[#F8C83B]/25">
                <Sparkles className="size-3 text-[#A67A00]" />
              </span>
              A little wonder for every day
            </div>

            <h1 className="mt-6 max-w-3xl font-[var(--font-roboto)] text-[clamp(3rem,7vw,6.5rem)] font-black leading-[0.9] tracking-[-0.065em] text-[#27344A]">
              Where little
              <span className="relative mx-2 inline-block text-[#3F7DFF] sm:mx-3">
                minds
                <span
                  aria-hidden="true"
                  className="absolute -right-3 -top-3 size-3 rounded-full bg-[#F8C83B] shadow-[0_6px_18px_rgba(248,200,59,0.4)] sm:-right-5 sm:-top-4 sm:size-4"
                />
              </span>
              discover
              <span className="mt-1 block text-[#27344A]">bigger wonder.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[0.98rem] leading-7 text-[#687489] sm:text-lg sm:leading-8">
              Toys, books, creative kits and learning adventures chosen to turn ordinary moments
              into stories worth remembering.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#3F7DFF] px-6 text-sm font-bold text-white shadow-[0_18px_36px_rgba(63,125,255,0.23)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#326DE8] hover:shadow-[0_22px_42px_rgba(63,125,255,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
              >
                Explore the Kingdom
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                  strokeWidth={2.2}
                />
              </Link>

              <Link
                href="/shop"
                className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#EEDDBB] bg-white/80 px-6 text-sm font-bold text-[#526075] shadow-[0_10px_28px_rgba(39,52,74,0.05)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#3F7DFF]/20 hover:bg-white hover:text-[#27344A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
              >
                Find a favourite
                <Compass
                  className="size-4 opacity-60 transition-transform duration-300 group-hover:rotate-12"
                  strokeWidth={2}
                />
              </Link>
            </div>

            <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 text-xs font-semibold text-[#687489] sm:grid-cols-2 sm:gap-4 sm:text-sm">
              <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/55 px-3.5 py-3 backdrop-blur">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#79D45C]/15 text-[#4D9A38]">
                  <Star className="size-3.5 fill-current" />
                </span>
                Curiosity-first products
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/55 px-3.5 py-3 backdrop-blur">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#F8C83B]/20 text-[#A67A00]">
                  <WandSparkles className="size-3.5" />
                </span>
                Made for little explorers
              </div>
            </div>
          </Reveal>

          {/* Visual */}
          <Reveal delay={0.08} className="relative mx-auto w-full max-w-[720px] lg:ml-auto">
            <div className="relative aspect-square">
              {/* Back glow */}
              <div
                aria-hidden="true"
                className="absolute inset-[7%] rounded-[32%_42%_30%_44%] bg-[#3F7DFF]/10 blur-3xl"
              />

              {/* Floating frame */}
              <div
                aria-hidden="true"
                className="absolute inset-[7%] rotate-[-4deg] rounded-[30%_42%_34%_40%] border border-white/80 bg-white/45 shadow-[0_35px_90px_rgba(39,52,74,0.09)] backdrop-blur-md"
              />

              <div className="absolute inset-[11%] overflow-hidden rounded-[31%_40%_28%_40%] border border-white/90 bg-white/60 p-3 shadow-[0_35px_85px_rgba(39,52,74,0.13)] backdrop-blur-xl sm:p-5">
                <div className="relative h-full overflow-hidden rounded-[27%_35%_22%_32%] bg-[linear-gradient(145deg,#FFFFFF_0%,#FFF8EC_100%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.75),0_18px_45px_rgba(39,52,74,0.08)]">
                  {/* Inner atmosphere */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(248,200,59,0.2),transparent_22%),radial-gradient(circle_at_84%_16%,rgba(63,125,255,0.14),transparent_25%),radial-gradient(circle_at_72%_78%,rgba(121,212,92,0.13),transparent_24%)]"
                  />

                  {/* Decorative orbital rings */}
                  <div
                    aria-hidden="true"
                    className="absolute left-[8%] top-[13%] size-[42%] rounded-full border border-[#3F7DFF]/10"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute right-[4%] bottom-[11%] size-[30%] rounded-full border border-[#F8C83B]/15"
                  />

                  {heroImage ? (
                    <Image
                      src={heroImage}
                      alt={heroAlt}
                      fill
                      priority
                      sizes="(max-width: 1023px) 90vw, 55vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.025]"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                      <div className="flex size-24 items-center justify-center rounded-[30px] bg-[#3F7DFF]/10 text-[#3F7DFF] shadow-inner">
                        <Sparkles className="size-10" />
                      </div>

                      <p className="mt-5 max-w-xs font-[var(--font-roboto)] text-xl font-black text-[#27344A] sm:text-2xl">
                        Your next little adventure starts here.
                      </p>
                    </div>
                  )}

                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#27344A]/20 via-[#27344A]/5 to-transparent"
                  />

                  {heroProduct ? (
                    <div className="absolute bottom-4 left-4 right-4 rounded-[22px] border border-white/75 bg-white/85 p-3 shadow-[0_18px_38px_rgba(39,52,74,0.12)] backdrop-blur-xl sm:bottom-6 sm:left-6 sm:right-6 sm:p-4">
                      <div className="flex items-end justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[#3F7DFF]">
                            Featured treasure
                          </p>

                          <p className="mt-1 line-clamp-1 font-[var(--font-roboto)] text-sm font-black text-[#27344A] sm:text-base">
                            {heroProduct.name}
                          </p>

                          <p className="mt-1 line-clamp-1 text-xs text-[#687489]">
                            {heroProduct.shortDescription ||
                              "A playful discovery for curious minds."}
                          </p>
                        </div>

                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#FFF8EC] text-[#3F7DFF]">
                          <ArrowRight className="size-4" />
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Floating objects */}
              <div className="absolute left-[1%] top-[18%] flex size-16 animate-float-gently items-center justify-center rounded-[22px] border border-white/90 bg-[#F8C83B] text-[#5B4300] shadow-[0_18px_35px_rgba(248,200,59,0.28)] sm:size-20">
                <Sparkles className="size-7 sm:size-8" />
              </div>

              <div
                aria-hidden="true"
                className="absolute right-[1%] top-[11%] hidden size-20 animate-pulse-soft items-center justify-center rounded-full border border-white/90 bg-[#79D45C] text-white shadow-[0_18px_38px_rgba(121,212,92,0.22)] sm:flex"
              >
                <span className="size-7 rounded-full border-4 border-white/80" />
              </div>

              <div
                aria-hidden="true"
                className="absolute bottom-[7%] right-[2%] flex size-14 rotate-6 items-center justify-center rounded-[20px] border border-white/90 bg-[#F56B9A] text-white shadow-[0_16px_34px_rgba(245,107,154,0.24)] sm:size-16"
              >
                <span className="text-2xl font-black">+</span>
              </div>

              <div
                aria-hidden="true"
                className="absolute bottom-[18%] left-[6%] hidden size-10 -rotate-12 items-center justify-center rounded-[14px] bg-white text-[#3F7DFF] shadow-[0_12px_28px_rgba(39,52,74,0.1)] sm:flex"
              >
                <Stars className="size-5" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
