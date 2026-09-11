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
  {
    image: "/images/products/featured-top/day-feel-8.png",
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

  useEffect(() => {
    if (slideCount <= 1) return;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slideCount);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [slideCount]);

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
        <div
          className="
            relative
            w-full
            overflow-hidden
            aspect-[16/9]
          "
        >
          {/* ============================================================
              FULL-WIDTH ARTWORK

              The supplied day-feel artwork already contains the photo,
              testimonial copy, decorative artwork and product artwork.
              Nothing is recreated in HTML.
              ============================================================ */}

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
                  object-cover
                  object-center
                  select-none
                "
              />
            </div>
          ))}

          {/* ============================================================
              BUY NOW CTA

              Positioned over the decorative arrow area on the left side
              of the supplied artwork. The image remains untouched.
              ============================================================ */}

          {activeProduct ? (
            <div
              className="
                absolute
                left-[4.5%]
                top-[28%]
                z-30
                -translate-y-1/2
              "
            >
              <Link
                href={`/products/${activeProduct.slug}`}
                aria-label={`Buy ${activeProduct.name} now`}
                className="
                  group/button
                  inline-flex
                  min-h-[38px]
                  items-center
                  justify-center
                  gap-1.5
                  rounded-full
                  bg-[#C391EE]
                  px-4
                  font-[var(--font-poppins-brand)]
                  text-[10px]
                  font-bold
                  leading-none
                  text-white
                  shadow-[0_8px_20px_rgba(40,25,65,0.24)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#E72D5A]
                  hover:shadow-[0_10px_24px_rgba(40,25,65,0.30)]
                  active:translate-y-0
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-transparent
                  max-sm:mt-60
                  max-sm:min-h-[28px]
                  sm:min-h-[44px]
                  sm:gap-2
                  sm:px-5
                  sm:text-[12px]
                  md:min-h-[48px]
                  md:px-6
                  md:text-[13px]
                  lg:min-h-[52px]
                  lg:px-7
                  lg:text-[14px]
                  xl:min-h-[46px]
                  xl:px-8
                  xl:text-[15px]
                  xl:mt-90
                "
              >
                <span className="text-white">Buy now</span>

                <span
                  aria-hidden="true"
                  className="
                    flex
                    size-5
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white/20
                    sm:size-6
                    lg:size-7
                  "
                >
                  <ArrowRight
                    className="
                      size-3
                      text-white
                      transition-transform
                      duration-300
                      group-hover/button:translate-x-0.5
                      sm:size-3.5
                      lg:size-4
                    "
                    strokeWidth={2.5}
                  />
                </span>
              </Link>
            </div>
          ) : null}

          {/* ============================================================
              CAROUSEL INDICATORS

              Kept deliberately minimal because the artwork contains all
              visual storytelling and text.
              ============================================================ */}

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
                px-2.5
                py-1.5
                backdrop-blur-[2px]
                sm:gap-2
                sm:px-3
                sm:py-2
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
                        ? "w-6 bg-white sm:w-8"
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

/* ==========================================================================
   MYTHOLOGY SERIES
   ========================================================================== */

function MythologySeriesSection({ products }: { products: StorefrontProduct[] }) {
  const mythologyProducts = products.slice(0, 3);

  return (
    <section
      className="
        relative
        isolate
        w-full
        overflow-hidden
        bg-[#FFFFFF]
        py-12
        sm:py-16
        lg:py-20
        xl:py-24
      "
    >
      {/* ================================================================
    HEADING
    ================================================================ */}

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
        {/* ================================================================
      EYEBROW
      ================================================================ */}

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

        {/* ================================================================
      MAIN HEADING
      ================================================================ */}

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
          Buzzie Special <span className="text-[#E83D59]">Mythology Series</span>
        </h2>
        {/* ================================================================
      DESCRIPTION
      ================================================================ */}

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
            Games and kits designed for kids to walk them through tales of Krishna, Ram, Mahabharata
            and Indian mythology in a fun way.
          </p>
        </div>
      </div>

      {/* ================================================================
          MAIN ARTWORK
          ================================================================ */}

      <div
        className="
          relative
          mx-auto
          mt-5
          min-h-[380px]
          w-full
          max-w-[1450px]
          sm:mt-7
          sm:min-h-[450px]
          lg:min-h-[525px]
          xl:min-h-[560px]
        "
      >
        {/* ==============================================================
            DECORATIVE PURPLE CIRCLE
            ============================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-[31%]
            top-[-18px]
            z-0
            size-[90px]
            rounded-full
            bg-[#8055D6]
            opacity-90
            sm:left-[34%]
            sm:size-[120px]
            lg:size-[150px]
          "
        />

        {/* ==============================================================
            REAL TRANSPARENT BLUE BLOB IMAGE

            IMPORTANT:
            No CSS blob is created here.
            This is the actual supplied transparent PNG.
            ============================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-[1%]
            right-[-3%]
            z-0
            w-[82%]
            sm:bottom-[2%]
            sm:right-[-2%]
            max-sm:w-[80%]
            sm:w-[80%]
            lg:bottom-[3%]
            lg:right-0
            lg:w-[78%]
            xl:w-[76%]
          "
        >
          <img
            src="/images/hero/big-blue-blob.png"
            alt=""
            className="
              block
              h-auto
              w-full
              select-none
              object-contain
            "
          />
        </div>

        {/* ==============================================================
            LEFT CHARACTER AREA
            ============================================================== */}

        <div
          className="
            absolute
            bottom-0
            left-0
            z-20
            flex
            w-[38%]
            items-end
            justify-center
            sm:w-[37%]
            lg:w-[34%]
          "
        >
          {/* Character backdrop */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              bottom-[8%]
              left-[25%]
              h-[225px]
              w-[145px]
              rounded-full
              bg-[#A36AD7]
              opacity-90
              sm:h-[280px]
              sm:w-[180px]
              lg:h-[350px]
              lg:w-[225px]
            "
          />

          {/* Character */}

          <div
            className="
              relative
              z-20
              flex
              w-[90%]
              max-w-[245px]
              items-end
              justify-center
              sm:w-[84%]
              sm:max-w-[290px]
              lg:w-[86%]
              lg:max-w-[300px]
              xl:max-w-[320px]

            "
          >
            <img
              src="/images/hero/YOUR-MYTHOLOGY-CHARACTER-1.png"
              alt="Mythology character"
              className="
                block
                h-auto
                w-full
                object-contain
                drop-shadow-[0_18px_20px_rgba(20,20,40,0.22)]
              "
            />
          </div>
        </div>

        {/* ==============================================================
            PRODUCTS — DISPLAYED ON TOP OF THE REAL BLOB
            ============================================================== */}

        <div
          className="
            absolute
            bottom-[5%]
            right-[3%]
            z-20
            flex
            h-[245px]
            w-[65%]
            items-center
            justify-center
            sm:bottom-[6%]
            sm:h-[315px]
            sm:w-[66%]
            lg:bottom-[7%]
            lg:h-[385px]
            lg:w-[67%]
            xl:h-[420px]
          "
        >
          {mythologyProducts.map((product, index) => {
            const productImage = product.images?.[0]?.url;

            if (!productImage) {
              return null;
            }

            return (
              <Link
                key={product._id}
                href={`/products/${product.slug}`}
                aria-label={`View ${product.name}`}
                className={`

                  mt-12
                  max-sm:mb-8
                  group
                  absolute
                  flex
                  items-center
                  justify-center
                  transition-transform
                  duration-500
                  hover:z-50
                  hover:scale-[1.05]


                  ${
                    index === 0
                      ? `
                        left-[1%]
                        top-[14%]
                        z-10
                        w-[43%]
                        -rotate-[7deg]
                        sm:left-[2%]
                        sm:w-[41%]
                        lg:w-[40%]
                      `
                      : index === 1
                        ? `
                          left-[28%]
                          top-[23%]
                          z-20
                          w-[48%]
                          rotate-[1deg]
                          sm:left-[27%]
                          sm:w-[45%]
                          lg:w-[43%]
                        `
                        : `
                          right-[0%]
                          top-[7%]
                          z-30
                          w-[42%]
                          rotate-[7deg]
                          sm:w-[40%]
                          lg:w-[38%]
                        `
                  }
                `}
              >
                <img
                  src={productImage}
                  alt={product.images?.[0]?.alt || product.name}
                  className="

                    block
                    h-auto
                    w-full
                    object-contain
                    drop-shadow-[0_18px_18px_rgba(15,25,65,0.28)]
                    transition-all
                    duration-500
                    group-hover:drop-shadow-[0_24px_24px_rgba(15,25,65,0.34)]
                    sm:max-h-[285px]
                    lg:max-h-[355px]
                    xl:max-h-[235px]
                  "
                />
              </Link>


            );
          })}
        </div>

        {/* ==============================================================
            DECORATIVE STARS
            ============================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-[7%]
            right-[8%]
            z-40
            text-[34px]
            leading-none
            text-[#FFD43B]
            drop-shadow-sm
            sm:text-[46px]
            lg:text-[58px]
          "
        >
          ★
        </div>

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-[18%]
            right-[15%]
            z-40
            text-[21px]
            leading-none
            text-white
            sm:text-[27px]
            lg:text-[34px]
          "
        >
          ✦
        </div>
      </div>

           {/* ================================================================
          EXPLORE MORE CTA
          ================================================================ */}
      <div
        className="
          relative
          z-30
          mt-5
          flex
          justify-center
          px-4
          sm:mt-7
          lg:mt-9
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
          <span className="text-white">Explore More Mythology Products</span>

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

      {/* ================================================================
          MOBILE INDICATORS
          ================================================================ */}

      <div
        className="
          relative
          z-30
          mx-auto
          mt-5
          flex
          w-full
          max-w-[900px]
          items-center
          justify-center
          gap-2
          px-5
          sm:mt-7
          lg:hidden
        "
      >
        <span className="h-[3px] w-8 rounded-full bg-[#D51B63]" />
        <span className="h-[3px] w-3 rounded-full bg-[#8060C9]" />
        <span className="h-[3px] w-3 rounded-full bg-[#F2B83B]" />
      </div>
    </section>
  );
}

/* ==========================================================================
   BUZZIE GEOGRAPHY EDITION
   ========================================================================== */

function GeographySection() {
  return (
    <section
      className="
        relative
        isolate
        w-full
        overflow-hidden
        bg-white
        pb-16
        pt-16
        sm:pb-20
        sm:pt-20
        lg:pb-28
        lg:pt-24
        xl:pb-32
        xl:pt-28
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
          mt-8
          flex
          w-full
          max-w-[1500px]
          items-center
          justify-center
          px-3
          sm:mt-10
          sm:px-6
          lg:mt-12
          lg:px-10
          xl:mt-14
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
            src="/images/hero/Buzzie-geography-1.png"
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
          mt-7
          flex
          justify-center
          sm:mt-8
          lg:mt-10
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
          <span className="!text-white">Explore more Geography Products</span>

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
              max-w-[900px]
              flex-col
              items-center
              text-center
            "
          >
            {/* Eyebrow */}
            <div
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
              "
            >
              <span
                aria-hidden="true"
                className="
                  h-[2px]
                  w-7
                  shrink-0
                  rounded-full
                  bg-[#E72D5A]
                  sm:w-9
                "
              />

              <p
                className="
                  font-[var(--font-poppins)]
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.2em]
                  text-[#E72D5A]
                  sm:text-[10px]
                  lg:text-[11px]
                "
              >
                A little something special
              </p>

              <span
                aria-hidden="true"
                className="
                  size-1.5
                  shrink-0
                  rounded-full
                  bg-[#F59A23]
                "
              />
            </div>

            {/* Main Heading */}
            <h2
              className="
    mx-auto
    mt-5
    w-full
    max-w-[800px]
    text-center
    font-[var(--font-poppins-brand)]
    text-[clamp(3.4rem,11vw,5.8rem)]
    font-bold
    uppercase
    leading-[0.82]
    tracking-[-0.025em]
    text-[#111111]

    sm:mt-6

    lg:mt-6
  "
            >
              What Buzzie Day <span className="text-[#E72D5A]">Feels like</span>
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
