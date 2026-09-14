"use client";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { StorefrontProduct } from "@/types/storefront";

import Reveal from "./Reveal";

interface FeaturedProductsProps {
  products: StorefrontProduct[];
}

const featuredSlides = [
  {
    image: "/images/products/featured-top/day-feel-1.png",
    alt: "BuzzieWorld day feel — featured customer experience",
  },
  {
    image: "/images/products/featured-top/day-feel-2.png",
    alt: "BuzzieWorld day feel — kids playing and learning",
  },
  {
    image: "/images/products/featured-top/day-feel-3.png",
    alt: "BuzzieWorld day feel — featured customer experience",
  },
  {
    image: "/images/products/featured-top/day-feel-4.png",
    alt: "BuzzieWorld day feel — featured customer experience",
  },
  {
    image: "/images/products/featured-top/day-feel-5.png",
    alt: "BuzzieWorld day feel — featured customer experience",
  },
  {
    image: "/images/products/featured-top/day-feel-6.png",
    alt: "BuzzieWorld day feel — featured customer experience",
  },
  {
    image: "/images/products/featured-top/day-feel-7.png",
    alt: "BuzzieWorld day feel — featured customer experience",
  },

];

interface FeaturedProductsCarouselProps {
  products: StorefrontProduct[];
}

function FeaturedProductsCarousel({ products }: FeaturedProductsCarouselProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  const slideCount = featuredSlides.length;

  const activeProduct = products.length > 0 ? products[activeSlide % products.length] : null;

  /* ========================================================================
     AUTO PLAY
  ======================================================================== */

  useEffect(() => {
    if (slideCount <= 1) return;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slideCount);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [slideCount]);

  /* ========================================================================
     SAFETY
  ======================================================================== */

  useEffect(() => {
    if (activeSlide >= slideCount) {
      setActiveSlide(0);
    }
  }, [activeSlide, slideCount]);

  return (
    <Reveal>
      <section
        className="
          relative
          left-1/2
          mt-8
          w-screen
          -translate-x-1/2
          overflow-hidden
          bg-transparent

          sm:mt-10

          lg:mt-12
        "
      >
        {/* ==================================================================
            RESPONSIVE ARTWORK STAGE

            Mobile:
            slightly taller composition

            Tablet:
            balanced landscape

            Desktop:
            wide 16:9 artwork
        ================================================================== */}

        <div
          className="
            relative
            w-full
            overflow-hidden

            aspect-[4/3]

            sm:aspect-[16/10]

            md:aspect-[16/9]

            lg:aspect-[16/9]
          "
        >
          {/* ==================================================================
              FULL-WIDTH ARTWORK
          ================================================================== */}

          {featuredSlides.map((item, index) => (
            <div
              key={item.image}
              aria-hidden={activeSlide !== index}
              className={`
                absolute
                inset-0
                transition-opacity
                duration-700
                ease-out
                ${activeSlide === index ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"}
              `}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                priority={index === 0}
                quality={90}
                sizes="100vw"
                className="
                  select-none
                  object-cover
                  object-center
                "
              />
            </div>
          ))}

          {/* ==================================================================
              BUY NOW CTA

              IMPORTANT:
              The button is now anchored to the bottom-right.

              No mt-60.
              No mt-90.
              No percentage-based vertical guessing.

              It stays in the same visual position regardless of viewport.
          ================================================================== */}

          {activeProduct ? (
            <div
              className="
                absolute
                bottom-[7%]
                right-[5%]
                z-30
              "
            >
              <Link
                href={`/products/${activeProduct.slug}`}
                aria-label={`Buy ${activeProduct.name} now`}
                className="
                  group/button
                  inline-flex
                  min-h-[30px]
                  items-center
                  justify-center
                  gap-1
                  rounded-full
                  bg-[#C391EE]
                  px-3
                  font-[var(--font-poppins-brand)]
                  text-[8px]
                  font-bold
                  leading-none
                  text-white
                  shadow-[0_6px_16px_rgba(40,25,65,0.22)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#E72D5A]
                  hover:shadow-[0_9px_20px_rgba(40,25,65,0.28)]
                  active:translate-y-0
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-transparent

                  sm:min-h-[36px]
                  sm:gap-1.5
                  sm:px-3.5
                  sm:text-[9px]

                  md:min-h-[40px]
                  md:px-4
                  md:text-[10px]

                  lg:min-h-[44px]
                  lg:gap-2
                  lg:px-5
                  lg:text-[11px]

                  xl:min-h-[46px]
                  xl:px-5.5
                  xl:text-[12px]
                "
              >
                <span className="text-white">Buy now</span>

                <span
                  aria-hidden="true"
                  className="
                    flex
                    size-4
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white/20

                    sm:size-[18px]

                    md:size-5

                    lg:size-[22px]
                  "
                >
                  <ArrowRight
                    className="
                      size-2.5
                      text-white
                      transition-transform
                      duration-300
                      group-hover/button:translate-x-0.5

                      sm:size-3

                      md:size-3.5

                      lg:size-4
                    "
                    strokeWidth={2.5}
                  />
                </span>
              </Link>
            </div>
          ) : null}

          {/* ==================================================================
              CAROUSEL INDICATORS

              Kept at the bottom center and separated from the CTA.
          ================================================================== */}

          {slideCount > 1 ? (
            <div
              className="
                absolute
                bottom-[3.5%]
                left-1/2
                z-30
                flex
                -translate-x-1/2
                items-center
                gap-1.5
                rounded-full
                bg-black/10
                px-2
                py-1
                backdrop-blur-[2px]

                sm:gap-2
                sm:px-2.5
                sm:py-1.5

                md:px-3
                md:py-2
              "
            >
              {featuredSlides.map((item, index) => (
                <button
                  key={item.image}
                  type="button"
                  aria-label={`Show day feel ${index + 1}`}
                  aria-current={activeSlide === index}
                  onClick={() => setActiveSlide(index)}
                  className={`
                    h-[3px]
                    rounded-full
                    transition-all
                    duration-300

                    ${
                      activeSlide === index
                        ? "w-5 bg-white sm:w-7 md:w-8"
                        : "w-2 bg-white/50 hover:bg-white/80 sm:w-2.5"
                    }
                  `}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </Reveal>
  );
}



/* ============================================================================
   MYTHOLOGY SERIES
   ============================================================================ */

export function MythologySeriesSection({
  products: _products,
}: {
  products: StorefrontProduct[];
}) {
  return (
    <section
      aria-label="BuzzieWorld Mythology Series"
      className="
        relative
        isolate
        w-full
        overflow-hidden
        bg-[#FFFFFF]
        pt-8
        pb-8
        sm:pt-10
        sm:pb-10
        lg:pt-12
        lg:pb-12
      "
    >
      {/* =========================================================================
          HEADING
      ========================================================================= */}

      <div
        className="
          relative
          z-30
          mx-auto
          w-full
          max-w-[1100px]
          px-5
          text-center
          sm:px-8
          lg:px-10
        "
      >
        {/* =========================================================================
            EYEBROW
        ========================================================================= */}

        <div
          className="
            mb-3
            flex
            items-center
            justify-center
            gap-2
            sm:mb-4
          "
        >
          <span
            aria-hidden="true"
            className="
              h-[2px]
              w-7
              rounded-full
              bg-[#E83D59]
              sm:w-9
            "
          />

          <p
            className="
              font-[var(--font-poppins)]
              text-[8px]
              font-black
              uppercase
              tracking-[0.2em]
              text-[#E83D59]
              sm:text-[9px]
              lg:text-[10px]
            "
          >
            Games · Stories · Learning
          </p>

          <span
            aria-hidden="true"
            className="
              h-[2px]
              w-7
              rounded-full
              bg-[#E83D59]
              sm:w-9
            "
          />
        </div>

        {/* =========================================================================
            MAIN HEADING
        ========================================================================= */}

        <h2
          className="
            mx-auto
            w-full
            max-w-[950px]
            text-balance
            text-center
            font-[var(--font-poppins-brand)]
            text-[clamp(3.4rem,11vw,5.8rem)]
            font-bold
            uppercase
            leading-[0.82]
            tracking-[-0.025em]
            text-[#111111]
          "
        >
          Buzzie Special{" "}
          <span className="text-[#E83D59]">
            Mythology Series
          </span>
        </h2>

        {/* =========================================================================
            DESCRIPTION
        ========================================================================= */}

        <div className="mx-auto flex w-full justify-center">
          <p
            className="
              mt-4
              w-full
              max-w-[560px]
              text-center
              font-[var(--font-poppins)]
              text-[10px]
              font-medium
              leading-[1.65]
              text-[#687489]
              sm:mt-5
              sm:max-w-[620px]
              sm:text-[11px]
              lg:max-w-[680px]
              lg:text-[13px]
              xl:max-w-[680px]
              xl:text-[16px]
            "
          >
            Games and kits designed for kids to walk them through tales of
            Krishna, Ram, Mahabharata and Indian mythology in a fun way.
          </p>
        </div>
      </div>

      {/* =========================================================================
          COMPLETE MYTHOLOGY ARTWORK

          The artwork already contains:
          - Krishna character
          - Mythology products
          - Purple background shape
          - Blue background shape
          - Decorative elements

          Therefore there is no need to construct those elements separately.
      ========================================================================= */}

      <div
        className="
          relative
          mx-auto
          mt-5
          w-full
          max-w-[1650px]
          px-3
          sm:mt-7
          sm:px-5
          lg:mt-8
          lg:px-6
        "
      >
        <Link
          href="/shop/mythology"
          aria-label="Explore BuzzieWorld Mythology Series"
          className="
            group
            relative
            block
            w-full
            overflow-hidden
            rounded-[12px]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#E83D59]
            focus-visible:ring-offset-4
          "
        >
          <img
            src="/images/hero/mythology.png"
            alt="BuzzieWorld Mythology Series featuring Krishna mythology games and products"
            className="
              block
              h-auto
              w-full
              select-none
              object-contain
              transition-transform
              duration-500
              ease-out
              group-hover:scale-[1.008]
            "
            draggable={false}
          />

          {/* Very subtle hover layer */}
          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              bg-white
              opacity-0
              transition-opacity
              duration-300
              group-hover:opacity-[0.025]
            "
          />
        </Link>
      </div>

      {/* =========================================================================
          EXPLORE CTA
      ========================================================================= */}

      <div
        className="
          relative
          z-30
          mt-5
          flex
          justify-center
          px-4
          sm:mt-7
          lg:mt-8
        "
      >
        <Link
          href="/shop/mythology"
          className="
            group
            inline-flex
            min-h-[48px]
            w-fit
            max-w-full
            items-center
            justify-center
            gap-2.5
            rounded-full
            bg-[#C391EE]
            px-6
            font-[var(--font-poppins-brand)]
            text-[12px]
            font-bold
            leading-none
            text-white
            shadow-[0_10px_24px_rgba(195,145,238,0.25)]
            transition-all
            duration-300
            hover:-translate-y-1
            hover:bg-[#E83D59]
            hover:shadow-[0_14px_30px_rgba(232,61,89,0.22)]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#E83D59]
            focus-visible:ring-offset-2
            sm:min-h-[52px]
            sm:px-7
            sm:text-[13px]
            lg:min-h-[54px]
            lg:px-8
            lg:text-[14px]
          "
        >
          <span className="text-white">
            Explore More Mythology Products
          </span>

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
              sm:size-8
            "
          >
            <ArrowRight
              className="
                size-3.5
                text-white
                transition-transform
                duration-300
                group-hover:translate-x-1
                sm:size-4
              "
              strokeWidth={2.5}
            />
          </span>
        </Link>
      </div>
    </section>
  );
}

/**** ==========================================================================
 *   BUZZIE GEOGRAPHY EDITION
 *   ========================================================================== ****/

function GeographySection() {
  return (
    <section
      className="
        relative
        isolate
        w-full
        overflow-hidden
        bg-white
        pt-8
        pb-8
        sm:pt-10
        sm:pb-10
        lg:pt-12
        lg:pb-12
      "
    >
      {/* ================================================================
          SECTION HEADING
          ================================================================ */}

      <div
        className="
          relative
          z-20
          mx-auto
          w-full
          max-w-[1100px]
          px-5
          text-center
          sm:px-8
          lg:px-10
        "
      >
        {/* EYEBROW */}

        <div
          className="
            mb-3
            flex
            items-center
            justify-center
            gap-2
            sm:mb-4
          "
        >
          <span
            aria-hidden="true"
            className="
              h-[2px]
              w-7
              rounded-full
              bg-[#E83D59]
              sm:w-9
            "
          />

          <p
            className="
              font-[var(--font-poppins)]
              text-[8px]
              font-black
              uppercase
              tracking-[0.2em]
              text-[#E83D59]
              sm:text-[9px]
              lg:text-[10px]
            "
          >
            Explore · Discover · Learn
          </p>

          <span
            aria-hidden="true"
            className="
              h-[2px]
              w-7
              rounded-full
              bg-[#E83D59]
              sm:w-9
            "
          />
        </div>

        {/* HEADING */}

        <h2
          className="
            mx-auto
            w-full
            max-w-[1150px]
            text-balance
            text-center
            font-[var(--font-poppins-brand)]
            text-[clamp(3.4rem,11vw,5.8rem)]
            font-bold
            uppercase
            leading-[0.82]
            tracking-[-0.025em]
            text-[#111111]
          "
        >
          Buzzie <span className="text-[#E83D59]">Geography Edition</span>
        </h2>
      </div>

      {/* ================================================================
          GEOGRAPHY ARTWORK
          ================================================================ */}

      <div
        className="
          relative
          mx-auto
          mt-6
          flex
          w-full
          max-w-[1500px]
          items-center
          justify-center
          px-3
          sm:mt-7
          sm:px-6
          lg:mt-8
          lg:px-10
        "
      >
        {/* ==============================================================
            CLICKABLE BACKGROUND ARTWORK
            ============================================================== */}

        <Link
          href="/shop/geography"
          aria-label="Explore Buzzie Geography Edition products"
          className="
            group
            relative
            block
            w-full
            cursor-pointer
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#E83D59]
            focus-visible:ring-offset-4
          "
        >
          <img
            src="/images/hero/buzzie-geo-background.png"
            alt="Buzzie Geography Edition"
            className="
              mx-auto
              block
              h-auto
              w-full
              max-w-[1450px]
              select-none
              object-contain
              transition-transform
              duration-500
              group-hover:scale-[1.01]
            "
          />

          {/* ============================================================
              SUBTLE HOVER OVERLAY
              ============================================================ */}

          <span
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              bg-white/0
              transition-colors
              duration-300
              group-hover:bg-white/[0.025]
            "
          />
        </Link>
      </div>

      {/* ================================================================
          CTA
          ================================================================ */}

      <div
        className="
          relative
          z-20
          mt-5
          flex
          justify-center
          px-4
          sm:mt-6
          lg:mt-7
        "
      >
        <Link
          href="/shop/geography"
          className="
            group
            inline-flex
            min-h-[48px]
            w-fit
            shrink-0
            items-center
            justify-center
            gap-2.5
            rounded-full
            bg-[#C391EE]
            px-5
            font-[var(--font-poppins)]
            text-[10px]
            font-black
            uppercase
            tracking-[0.07em]
            !text-white
            shadow-[0_10px_24px_rgba(231,45,90,0.20)]
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:bg-[#D92350]
            hover:shadow-[0_14px_32px_rgba(231,45,90,0.28)]
            active:translate-y-0
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#E72D5A]
            focus-visible:ring-offset-3
            sm:min-h-[50px]
            sm:px-6
            sm:text-[11px]
            lg:min-h-[52px]
            lg:px-7
          "
        >
          <span className="!text-white">
            Explore more Geography Products
          </span>

          <span
            className="
              flex
              size-7
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white/20
              sm:size-8
            "
          >
            <ArrowRight
              className="
                size-3.5
                !text-white
                transition-transform
                duration-300
                group-hover:translate-x-1
                sm:size-4
              "
              strokeWidth={2.5}
            />
          </span>
        </Link>
      </div>
    </section>
  );
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-[#FFFDFC]
        py-12
        sm:py-14
        lg:py-18
        xl:py-20
      "
    >
      <div className="container relative w-full">
        {/* =========================================================
            TOP TEASING HEADING
           ========================================================= */}

        <Reveal>
          <div
            className="
    mx-auto
    flex
    w-full
    max-w-[1230px]
    flex-col
    items-center
    justify-center
    bg-[#C391EE]
    px-5
    py-9
    text-center

    sm:px-8
    sm:py-11

    md:px-10
    md:py-12

    lg:px-12
    lg:py-14

    xl:py-16
  "
          >
            <h2
              className="
      m-0
      w-full
      max-w-[1100px]
      font-[var(--font-poppins-brand)]
      text-[3.7rem]
      font-bold
      uppercase
      leading-[0.80]
      tracking-[-0.035em]
      text-[#111111]

      sm:text-[4.5rem]
      sm:leading-[0.82]

      md:text-[5rem]

      lg:text-[5.5rem]
      lg:leading-[0.84]

      xl:text-[5.8rem]
    "
            >
              What Buzzie Day
              <br className="sm:hidden" /> <span className="text-white">Feels like</span>
            </h2>
          </div>
        </Reveal>

        {/* =========================================================
            FEATURED PRODUCTS CAROUSEL
           ========================================================= */}

        <FeaturedProductsCarousel products={products} />

        {/* =========================================================
          MYTHOLOGY SERIES
         ========================================================= */}

        <MythologySeriesSection products={products} />
        <GeographySection />
      </div>
    </section>
  );
}
