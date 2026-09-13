"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { StorefrontSelector } from "@/types/storefront";

/* ============================================================================
   TYPES
============================================================================ */

interface CollectionShowcaseProps {
  /**
   * Kept in the props so the existing parent component does not need to
   * change. The return-gift section is now a single static artwork.
   */
  collections: StorefrontSelector[];
}

/* ============================================================================
   COMPONENT
============================================================================ */

export default function CollectionShowcase({ collections: _collections }: CollectionShowcaseProps) {
  return (
    <section
      aria-label="BuzzieWorld return gifts"
      className="
        relative
        w-full
        overflow-hidden
        bg-[#FFFDF9]
        pt-8
        pb-8
        sm:pt-10
        sm:pb-10
        lg:pt-12
        lg:pb-12
      "
    >
      {/* =========================================================================
          MAIN TWO-COLUMN LAYOUT

          Desktop:
          - Left 25%  = text + CTA
          - Right 75% = complete return-gift artwork

          Mobile:
          - Text comes first
          - Artwork becomes the second full-width block
      ========================================================================= */}

      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1920px]
          flex-col
          lg:flex-row
          lg:items-center
        "
      >
        {/* =======================================================================
            LEFT — COPY + CTA
            25% DESKTOP / 100% MOBILE
        ======================================================================= */}

        <div
          className="
            order-1
            flex
            w-full
            flex-col
            items-center
            justify-center
            px-6
            text-center
            sm:px-10
            md:px-12
            lg:order-1
            lg:w-[25%]
            lg:flex-[0_0_25%]
            lg:items-start
            lg:px-8
            lg:text-left
            xl:px-10
            2xl:px-14
          "
        >
          <div
            className="
              w-full
              max-w-[360px]
            "
          >
            {/* Main copy */}
            <h2
              className="
                m-0
                w-full
                max-w-[850px]
                text-balance
                font-[var(--font-poppins-brand)]
                text-[clamp(3.4rem,8vw,4rem)]
                font-bold
                leading-[0.82]
                tracking-[-0.025em]
                text-[#111111]
              "
            >
              Looking for <span className="text-[#E83D59]">return gifts?</span>
            </h2>

            {/* CTA */}
            <div
              className="
                mt-6
                sm:mt-7
                lg:mt-8
                text-white
              "
            >
              <Link
                href="/return-gifts"
                className="
                  group
                  inline-flex
                  min-h-[48px]
                  w-fit
                  items-center
                  justify-center
                  gap-2.5
                  rounded-full
                  bg-[#C391EE]
                  px-6
                  font-[var(--font-poppins-brand)]
                  text-[13px]
                  font-bold
                  leading-none
                  text-white
                  no-underline
                  shadow-[0_10px_24px_rgba(195,145,238,0.24)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#E83D59]
                  hover:shadow-[0_14px_30px_rgba(232,61,89,0.20)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#E83D59]
                  focus-visible:ring-offset-3
                  sm:min-h-[52px]
                  sm:px-7
                  sm:text-[14px]
                  lg:min-h-[50px]
                  lg:px-6
                  lg:text-[13px]
                  xl:min-h-[54px]
                  xl:px-7
                  xl:text-[14px]
                "
              >
                <span>Explore return gifts</span>

                <span
                  aria-hidden="true"
                  className="
                    flex
                    size-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white/20
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5
                    sm:size-8
                  "
                >
                  <ArrowRight
                    className="
                      size-3.5
                      text-white
                      sm:size-4
                    "
                    strokeWidth={2.5}
                  />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* =======================================================================
            RIGHT — RETURN GIFT ARTWORK
            75% DESKTOP / 100% MOBILE
        ======================================================================= */}

        <div
          className="
            order-2
            relative
            w-full
            overflow-hidden
            lg:order-2
            lg:w-[75%]
            lg:flex-[0_0_75%]
          "
        >
          <Link
            href="/return-gifts"
            aria-label="Explore BuzzieWorld return gifts"
            className="
              group
              block
              w-full
              cursor-pointer
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#E83D59]
              focus-visible:ring-offset-2
            "
          >
            <img
              src="/images/return-gifts/return-gift.png"
              alt="BuzzieWorld return gifts for kids"
              className="
                block
                h-auto
                w-full
                max-w-none
                select-none
                object-contain
                transition-transform
                duration-500
                group-hover:scale-[1.01]
              "
              draggable={false}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
