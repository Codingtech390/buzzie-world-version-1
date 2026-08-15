import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Compass, Palette, Telescope } from "lucide-react";

import type { StorefrontSelector } from "@/types/storefront";

import Reveal from "./Reveal";

interface CollectionShowcaseProps {
  collections: StorefrontSelector[];
}

const collectionIcons = [Compass, Palette, Telescope] as const;

const collectionColors = ["#3F7DFF", "#F56B9A", "#79D45C"] as const;

export default function CollectionShowcase({ collections }: CollectionShowcaseProps) {
  if (collections.length === 0) {
    return null;
  }

  const visibleCollections = collections.slice(0, 3);

  return (
    <section className="section bg-[#FFFDF9]">
      <div className="container">
        <Reveal>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#3F7DFF]">
                Curated little worlds
              </p>

              <h2 className="mt-3 font-[var(--font-roboto)] text-3xl font-black tracking-[-0.04em] text-[#27344A] sm:text-4xl lg:text-5xl">
                Featured collections
              </h2>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#3F7DFF] transition-colors hover:text-[#2A62D8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
            >
              View all
              <ArrowUpRight className="size-4" strokeWidth={2.1} />
            </Link>
          </div>
        </Reveal>

        <div className="mt-9 grid gap-4 lg:grid-cols-[1.35fr_0.85fr]">
          {visibleCollections.map((collection, index) => {
            const Icon = collectionIcons[index % collectionIcons.length] ?? Compass;
            const color = collectionColors[index % collectionColors.length] ?? "#3F7DFF";

            const isLarge = index === 0;

            return (
              <Reveal
                key={collection._id}
                delay={index * 0.05}
                className={isLarge ? undefined : "lg:last:col-start-2"}
              >
                <Link
                  href={`/shop?collection=${encodeURIComponent(collection._id)}`}
                  className="group block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
                >
                  <article
                    className={[
                      "relative h-full min-h-[250px] overflow-hidden rounded-[32px] border border-[#EEDDBB]/65 bg-white shadow-[0_14px_40px_rgba(39,52,74,0.06)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_24px_55px_rgba(39,52,74,0.1)]",
                      isLarge ? "lg:min-h-[390px]" : "",
                    ].join(" ")}
                  >
                    {collection.image ? (
                      <Image
                        src={collection.image}
                        alt={collection.name}
                        fill
                        sizes={
                          isLarge
                            ? "(max-width: 1023px) 100vw, 60vw"
                            : "(max-width: 1023px) 100vw, 40vw"
                        }
                        className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `radial-gradient(circle at 80% 18%, ${color}25, transparent 30%), linear-gradient(145deg, #ffffff 0%, #fff8ec 100%)`,
                        }}
                      >
                        <div className="absolute right-[10%] top-[12%] flex size-20 items-center justify-center rounded-[26px] bg-white shadow-[0_20px_40px_rgba(39,52,74,0.09)] sm:size-24">
                          <Icon className="size-9 sm:size-10" style={{ color }} strokeWidth={1.6} />
                        </div>

                        <div
                          aria-hidden="true"
                          className="absolute bottom-[-15%] right-[-4%] size-52 rounded-full blur-3xl"
                          style={{ backgroundColor: `${color}18` }}
                        />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#27344A]/75 via-[#27344A]/15 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-white/65">
                        Collection
                      </p>

                      <h3 className="mt-2 font-[var(--font-roboto)] text-2xl font-black tracking-[-0.035em] text-white sm:text-3xl">
                        {collection.name}
                      </h3>

                      {collection.description ? (
                        <p className="mt-2 max-w-lg text-sm leading-6 text-white/75">
                          {collection.description}
                        </p>
                      ) : null}

                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white">
                        Explore collection
                        <span className="flex size-7 items-center justify-center rounded-full bg-white/15">
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
