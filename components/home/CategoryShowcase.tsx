import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Blocks,
  BookOpen,
  Palette,
  Sparkles,
  ToyBrick,
} from "lucide-react";

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

export default function CategoryShowcase({
  categories,
}: CategoryShowcaseProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="section-tight bg-[#FFF8EC]">
      <div className="container">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3F7DFF]">
              Explore the kingdom
            </p>

            <h2 className="mt-3 font-[var(--font-roboto)] text-3xl font-black tracking-[-0.04em] text-[#27344A] sm:text-4xl">
              Find their kind of fun
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#687489] sm:text-base">
              From creative play to quiet discovery, there is a corner of
              BuzzieWorld waiting to be explored.
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.slice(0, 5).map((category, index) => {
            const visual =
              categoryVisuals[index % categoryVisuals.length] ??
              categoryVisuals[0];

            const Icon = visual.icon;

            return (
              <Reveal
                key={category._id}
                delay={index * 0.04}
                className={
                  index === 0
                    ? "sm:col-span-2 lg:col-span-2"
                    : undefined
                }
              >
                <Link
                  href={`/shop?category=${encodeURIComponent(category._id)}`}
                  className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
                >
                  <article className="relative h-full min-h-[230px] overflow-hidden rounded-[30px] border border-[#EEDDBB]/65 bg-white shadow-[0_14px_40px_rgba(39,52,74,0.06)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_25px_55px_rgba(39,52,74,0.1)]">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 66vw"
                        className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{ backgroundColor: visual.background }}
                      >
                        <div className="absolute -right-10 -top-10 size-44 rounded-full bg-white/55 blur-2xl" />
                        <div className="absolute bottom-0 right-0 size-32 translate-x-8 translate-y-8 rounded-full bg-black/5" />

                        <div className="absolute right-7 top-7 flex size-16 items-center justify-center rounded-[22px] bg-white/78 shadow-[0_14px_28px_rgba(39,52,74,0.08)]">
                          <Icon
                            className="size-7"
                            style={{ color: visual.foreground }}
                            strokeWidth={1.8}
                          />
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#27344A]/72 via-[#27344A]/20 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/70">
                        BuzzieWorld
                      </p>

                      <h3 className="mt-1 max-w-md font-[var(--font-roboto)] text-2xl font-black tracking-[-0.035em] text-white">
                        {category.name}
                      </h3>

                      {category.description ? (
                        <p className="mt-2 max-w-md text-sm leading-5 text-white/75">
                          {category.description}
                        </p>
                      ) : null}

                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white">
                        Explore category
                        <span className="flex size-7 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1">
                          <ArrowUpRight
                            className="size-3.5"
                            strokeWidth={2}
                          />
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
