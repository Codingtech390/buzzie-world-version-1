import Link from "next/link";
import { ArrowUpRight, Blocks, BookOpen, Palette, Sparkles, ToyBrick } from "lucide-react";

import type { StorefrontSelector } from "@/types/storefront";

import Reveal from "./Reveal";

interface CategoryShowcaseProps {
  categories: StorefrontSelector[];
}

const categoryVisuals = [
  {
    icon: ToyBrick,
    background: "#EEF4FF",
    foreground: "#3F7DFF",
  },
  {
    icon: BookOpen,
    background: "#FFF8E8",
    foreground: "#B78100",
  },
  {
    icon: Blocks,
    background: "#EFFBEA",
    foreground: "#4D9A38",
  },
  {
    icon: Palette,
    background: "#FFF0F5",
    foreground: "#C44770",
  },
  {
    icon: Sparkles,
    background: "#F3EEFF",
    foreground: "#7F61C2",
  },
] as const;

export default function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="section relative overflow-hidden bg-[#FFF8EC]">
      {/* ================================================================
          DECORATIVE BACKGROUND
         ================================================================ */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-[-12rem]
          top-[-8rem]
          size-[32rem]
          rounded-full
          bg-[#F8C83B]/10
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-[-10rem]
          left-[-12rem]
          size-[28rem]
          rounded-full
          bg-[#E72D5A]/5
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          size-[20rem]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/50
          blur-3xl
        "
      />

      <div className="container relative">
        {/* ================================================================
            SECTION HEADING
           ================================================================ */}

        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.18em]
                text-[#E72D5A]
                sm:text-sm
              "
            >
              Explore the kingdom
            </p>

            <h2
              className="
                mt-4
                font-[var(--font-roboto)]
                text-[clamp(2.3rem,5vw,4rem)]
                font-black
                leading-[0.95]
                tracking-[-0.05em]
                text-[#27344A]
              "
            >
              Find their kind of fun
            </h2>

            <p
              className="
                mx-auto
                mt-5
                max-w-xl
                text-sm
                leading-6
                text-[#687489]
                sm:text-base
                sm:leading-7
              "
            >
              From creative play to quiet discovery, every corner has something worth exploring.
            </p>
          </div>
        </Reveal>

        {/* ================================================================
            CATEGORY CARDS
           ================================================================ */}

        <div
          className="
            mt-10
            grid
            gap-4
            sm:grid-cols-2
            sm:gap-5
            lg:mt-12
            lg:grid-cols-6
          "
        >
          {categories.slice(0, 5).map((category, index) => {
            const visual = categoryVisuals[index % categoryVisuals.length] ?? categoryVisuals[0];

            const Icon = visual.icon;

            const large = index === 0;

            return (
              <Reveal
                key={category._id}
                delay={index * 0.045}
                className={large ? "sm:col-span-2 lg:col-span-3" : "lg:col-span-1.5"}
              >
                <Link
                  href={`/shop?category=${encodeURIComponent(category._id)}`}
                  className="
                    group
                    block
                    h-full
                    rounded-[30px]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#E72D5A]
                    focus-visible:ring-offset-4
                  "
                >
                  <article
                    className={[
                      "relative h-full min-h-[245px] overflow-hidden rounded-[30px]",
                      "border border-[#EEDDBB]/70 bg-white",
                      "shadow-[0_15px_40px_rgba(39,52,74,0.055)]",
                      "transition-all duration-500",
                      "ease-[cubic-bezier(0.22,1,0.36,1)]",
                      "group-hover:-translate-y-1.5",
                      "group-hover:shadow-[0_28px_60px_rgba(39,52,74,0.1)]",
                      large ? "lg:min-h-[330px]" : "",
                    ].join(" ")}
                  >
                    {/* ----------------------------------------------------
                        CARD GRADIENT
                       ---------------------------------------------------- */}

                    <div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(circle at 82% 16%, ${visual.foreground}18, transparent 30%), linear-gradient(145deg, #ffffff 0%, ${visual.background} 100%)`,
                      }}
                    />

                    {/* ----------------------------------------------------
                        TOP RIGHT LIGHT
                       ---------------------------------------------------- */}

                    <div
                      aria-hidden="true"
                      className="
                        absolute
                        -right-12
                        -top-12
                        size-40
                        rounded-full
                        bg-white/70
                        blur-2xl
                        transition-transform
                        duration-700
                        group-hover:scale-125
                      "
                    />

                    {/* ----------------------------------------------------
                        BOTTOM COLOR BLOB
                       ---------------------------------------------------- */}

                    <div
                      aria-hidden="true"
                      className="
                        absolute
                        bottom-[-5rem]
                        left-[-2rem]
                        size-44
                        rounded-full
                        opacity-50
                        blur-3xl
                      "
                      style={{
                        backgroundColor: visual.foreground,
                      }}
                    />

                    {/* ----------------------------------------------------
                        ICON
                       ---------------------------------------------------- */}

                    <div
                      className="
                        absolute
                        right-6
                        top-6
                        flex
                        size-16
                        items-center
                        justify-center
                        rounded-[22px]
                        border
                        border-white/80
                        bg-white/80
                        shadow-[0_14px_30px_rgba(39,52,74,0.07)]
                        backdrop-blur
                        transition-all
                        duration-500
                        group-hover:-rotate-3
                        group-hover:scale-105
                      "
                    >
                      <Icon
                        className="size-7"
                        style={{
                          color: visual.foreground,
                        }}
                        strokeWidth={1.7}
                      />
                    </div>

                    {/* ----------------------------------------------------
                        CONTENT
                       ---------------------------------------------------- */}

                    <div
                      className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        p-6
                        sm:p-7
                      "
                    >
                      <div className="flex items-center gap-2">
                        <span
                          aria-hidden="true"
                          className="size-1.5 rounded-full"
                          style={{
                            backgroundColor: visual.foreground,
                          }}
                        />

                        <p
                          className="
                            text-[0.61rem]
                            font-black
                            uppercase
                            tracking-[0.16em]
                          "
                          style={{
                            color: visual.foreground,
                          }}
                        >
                          BuzzieWorld
                        </p>
                      </div>

                      <h3
                        className="
                          mt-2
                          max-w-[15rem]
                          font-[var(--font-roboto)]
                          text-2xl
                          font-black
                          leading-tight
                          tracking-[-0.035em]
                          text-[#27344A]
                          sm:text-[1.7rem]
                        "
                      >
                        {category.name}
                      </h3>

                      {/* --------------------------------------------------
                          CATEGORY CTA
                         -------------------------------------------------- */}

                      <span
                        className="
                          mt-5
                          inline-flex
                          items-center
                          gap-2
                          text-sm
                          font-bold
                          text-[#526075]
                        "
                      >
                        Explore category
                        <span
                          className="
                            flex
                            size-7
                            items-center
                            justify-center
                            rounded-full
                            bg-white
                            shadow-sm
                            transition-transform
                            duration-300
                            group-hover:translate-x-1
                          "
                        >
                          <ArrowUpRight className="size-3.5" />
                        </span>
                      </span>
                    </div>
                  </article>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
