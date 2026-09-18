"use client";

import Link from "next/link";
import Image from "next/image";
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

        {/* ================================================================
        BANNER IMAGE
        ================================================================ */}

    <div
      className="
        relative
        w-full
        overflow-hidden
      "
    >
      <Image
        src="/images/backgrounds/insta-video-banner.png"
        alt="BuzzieWorld"
        width={1920}
        height={700}
        priority
        quality={90}
        sizes="100vw"
        className="
          block
          h-auto
          w-full
          max-w-none
          object-contain
        "
      />
    </div>










      {/* =========================================================================
          MAIN RESPONSIVE LAYOUT

          Mobile:
          - Copy first
          - Artwork below
          - Comfortable horizontal padding
          - Artwork contained so it does not overflow

          Desktop:
          - 25% copy
          - 75% artwork
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
        ======================================================================= */}

        <div
          className="
            order-1
            flex
            w-full
            flex-col
            items-center
            justify-center
            px-5
            text-center
            sm:px-8
            md:px-12
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
              sm:max-w-[460px]
              lg:max-w-[360px]
            "
          >
            {/* Main copy */}

            <h2
              className="
                m-0
                w-full
                text-balance
                font-[var(--font-poppins-brand)]
                text-[clamp(2.45rem,11vw,4rem)]
                font-bold
                leading-[0.88]
                tracking-[-0.035em]
                text-[#111111]
                sm:text-[clamp(3rem,7vw,4rem)]
                lg:text-[clamp(3.2rem,4vw,4rem)]
              "
            >
              Looking for <span className="text-[#E83D59]">return gifts?</span>
            </h2>

            {/* CTA */}

            <div
              className="
    mt-5
    flex
    justify-center
    sm:mt-6
    lg:mt-8
    lg:justify-start
  "
            >
              <Link
                href="/return-gifts"
                className="
      group
      inline-flex
      min-h-[46px]
      max-w-full
      items-center
      justify-center
      gap-2
      rounded-full
      bg-[#C391EE]
      px-5
      font-[var(--font-poppins-brand)]
      text-[12px]
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
      sm:min-h-[50px]
      sm:gap-2.5
      sm:px-6
      sm:text-[13px]
      lg:min-h-[50px]
      lg:px-6
      lg:text-[13px]
      xl:min-h-[54px]
      xl:px-7
      xl:text-[14px]
    "
              >
                <span className="text-white">Explore return gifts</span>

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
                  <ArrowRight className="size-3.5 text-white sm:size-4" strokeWidth={2.5} />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* =======================================================================
            RIGHT — RETURN GIFT ARTWORK
        ======================================================================= */}

        <div
          className="
            order-2
            relative
            mt-7
            w-full
            overflow-hidden
            sm:mt-8
            lg:mt-0
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
                mx-auto
                block
                h-auto
                w-full
                max-w-[680px]
                select-none
                object-contain
                transition-transform
                duration-500
                group-hover:scale-[1.01]

                sm:max-w-[820px]

                md:max-w-[980px]

                lg:mx-0
                lg:max-w-none
              "
              draggable={false}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
