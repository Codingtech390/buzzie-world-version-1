import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Palette,
  Sparkles,
  Telescope,
} from "lucide-react";

import type { StorefrontSelector } from "@/types/storefront";

import Reveal from "./Reveal";

interface CollectionShowcaseProps {
  collections: StorefrontSelector[];
}

const collectionIcons = [Compass, Palette, Telescope] as const;

const collectionColors = [
  "#3F7DFF",
  "#F56B9A",
  "#79D45C",
] as const;

export default function CollectionShowcase({
  collections,
}: CollectionShowcaseProps) {
  if (collections.length === 0) {
    return null;
  }

  const visibleCollections = collections.slice(0, 3);

  return (
    <section className="section relative overflow-hidden bg-[#FFFDF9]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-10rem] top-[-8rem] size-80 rounded-full bg-[#F8C83B]/7 blur-3xl"
      />

      <div className="container relative">
        <Reveal>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3F7DFF]">
                Curated little worlds
              </p>

              <h2 className="mt-3 font-[var(--font-roboto)] text-[clamp(2rem,4vw,3.3rem)] font-black leading-[1] tracking-[-0.045em] text-[#27344A]">
                Collections with a little character.
              </h2>

              <p className="mt-4 text-sm leading-6 text-[#687489] sm:text-base">
                Explore the themes currently shaping the BuzzieWorld catalog.
              </p>
            </div>

            <Link
              href="/shop"
              className="group inline-flex min-h-10 items-center gap-2 text-sm font-bold text-[#3F7DFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
            >
              View all
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {visibleCollections.map((collection, index) => {
            const Icon =
              collectionIcons[index % collectionIcons.length] ?? Compass;

            const color =
              collectionColors[index % collectionColors.length] ?? "#3F7DFF";

            const large = index === 0;

            return (
              <Reveal
                key={collection._id}
                delay={index * 0.05}
              >
                <Link
                  href={`/shop?collection=${encodeURIComponent(collection._id)}`}
                  className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-4"
                >
                  <article
                    className={[
                      "relative h-full min-h-[300px] overflow-hidden rounded-[32px] border border-[#EEDDBB]/65 bg-white shadow-[0_15px_42px_rgba(39,52,74,0.055)]",
                      "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      "group-hover:-translate-y-1.5 group-hover:shadow-[0_28px_60px_rgba(39,52,74,0.1)]",
                      large ? "lg:min-h-[390px]" : "",
                    ].join(" ")}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(circle at 78% 18%, ${color}1d, transparent 30%), linear-gradient(145deg,#FFFFFF 0%,#FFF8EC 100%)`,
                      }}
                    />

                    <div
                      aria-hidden="true"
                      className="absolute right-[-4rem] top-[-4rem] size-52 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-125"
                      style={{ backgroundColor: `${color}18` }}
                    />

                    <div
                      aria-hidden="true"
                      className="absolute bottom-[-5rem] left-[-4rem] size-52 rounded-full blur-3xl"
                      style={{ backgroundColor: `${color}10` }}
                    />

                    <div className="absolute right-7 top-7 flex size-16 items-center justify-center rounded-[22px] border border-white bg-white/85 shadow-[0_16px_30px_rgba(39,52,74,0.08)] backdrop-blur transition-transform duration-500 group-hover:-rotate-3 group-hover:scale-105">
                      <Icon
                        className="size-7"
                        style={{ color }}
                        strokeWidth={1.7}
                      />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                      <div className="flex items-center gap-2">
                        <Sparkles
                          className="size-3.5"
                          style={{ color }}
                        />

                        <p
                          className="text-[0.61rem] font-bold uppercase tracking-[0.16em]"
                          style={{ color }}
                        >
                          Collection
                        </p>
                      </div>

                      <h3 className="mt-2 max-w-[16rem] font-[var(--font-roboto)] text-2xl font-black tracking-[-0.035em] text-[#27344A] sm:text-3xl">
                        {collection.name}
                      </h3>

                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#526075]">
                        Explore collection

                        <span className="flex size-7 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300 group-hover:translate-x-1">
                          <ArrowRight className="size-3.5" />
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
