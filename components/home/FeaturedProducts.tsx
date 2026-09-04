"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import type { StorefrontProduct } from "@/types/storefront";

import ProductCard from "@/components/product/ProductCard";

import Reveal from "./Reveal";

interface FeaturedProductsProps {
  products: StorefrontProduct[];
}

const featuredSlides = [
  {
    image: "/images/products/featured-top/feel-1.png",
    alt: "Featured BuzzieWorld games, books and learning products",
    eyebrow: "BUZZIEWORLD FAVOURITES",
    title: "Emoji's were actually fun. We just didn't stop guessing !",
    description: "Kiara and Sanaya",
    age: "10 Years and & 7 Years",
  },

  {
    image: "/images/products/featured-top/feel-2.png",
    alt: "More featured BuzzieWorld games, books and learning products",
    eyebrow: "BUZZIEWORLD FAVOURITES",
    title: "She just couldn't stop playing!",
    description: "Puja and Shivani",
    age: "6 Years and & 7 Years",
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
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slideCount);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [slideCount]);

  function previousSlide() {
    setActiveSlide((current) => (current - 1 + slideCount) % slideCount);
  }

  function nextSlide() {
    setActiveSlide((current) => (current + 1) % slideCount);
  }

  const slide = featuredSlides[activeSlide];

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
        <div className="relative w-full">
          {/* ============================================================
              SLIDE IMAGES
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
                width={1920}
                height={700}
                priority={index === 0}
                quality={90}
                sizes="100vw"
                className="
                  block
                  h-auto
                  w-full
                  max-w-none
                  object-contain
                  object-center
                "
              />
            </div>
          ))}
          {/* ============================================================
              NATURAL IMAGE-SIZE LAYER

              Keeps the carousel at the exact 1920:700 aspect ratio.
              This prevents fixed-height cropping while the active slide
              remains absolutely positioned above it.
              ============================================================ */}

          <Image
            src={slide.image}
            alt=""
            aria-hidden="true"
            width={1920}
            height={700}
            quality={1}
            sizes="100vw"
            className="
              pointer-events-none
              invisible
              block
              h-auto
              w-full
              select-none
            "
          />

          {/* ============================================================
    RIGHT CONTENT — TEXT / CTA
    ============================================================ */}

          <div
            className="
    absolute
    inset-y-0
    right-0
    z-20
    flex
    w-full
    items-center
    justify-end
    px-6
    py-8
    sm:w-[58%]
    sm:px-9
    sm:py-10
    md:w-[54%]
    md:px-11
    lg:w-[50%]
    lg:px-12
    lg:py-12
    xl:w-[48%]
    xl:px-32
    2xl:px-20
  "
          >
            <div
              className="
      w-full
      max-w-[470px]
      text-left
    "
            >
              {/* ==========================================================
        EYEBROW
        ========================================================== */}

              <div
                className="
        mb-3
        flex
        items-center
        gap-2
        sm:mb-3.5
        lg:mb-4
      "
              >
                <span
                  aria-hidden="true"
                  className="
          size-1.5
          shrink-0
          rounded-full
          bg-white
          sm:size-2
        "
                />

                <p
                  className="
          font-[var(--font-poppins)]
          text-[7px]
          font-black
          uppercase
          tracking-[0.19em]
          text-white/90
          sm:text-[8px]
          lg:text-[9px]
        "
                >
                  {slide.eyebrow}
                </p>
              </div>

              {/* ==========================================================
        HEADING
        ========================================================== */}

              <h2
                className="
        max-w-[440px]
        font-[var(--font-roboto)]
        text-[26px]
        font-black
        leading-[0.94]
        tracking-[-0.044em]
        text-white
        drop-shadow-[0_2px_10px_rgba(30,20,45,0.18)]
        sm:text-[28px]
        md:text-[28px]
        lg:text-[28px]
        xl:text-[32px]
      "
              >
                {slide.title}
              </h2>

              {/* ==========================================================
        DESCRIPTION
        ========================================================== */}

              <p
                className="
        mt-3
        max-w-[410px]
        font-[var(--font-poppins)]
        text-[9px]
        leading-[1.55]
        text-white/90
        drop-shadow-[0_1px_5px_rgba(30,20,45,0.16)]
        sm:mt-3.5
        sm:text-[10px]
        md:text-[11px]
        xl:text-[14px]
        lg:mt-4
        lg:text-[12px]
        lg:leading-[1.6]
        xl:mt-8
      "
              >
                {slide.description}
              </p>

              {/* ==========================================================
        AGE / SECONDARY TEXT
        ========================================================== */}

              <p
                className="
        mt-8
        max-w-[410px]
        font-[var(--font-poppins)]
        text-[9px]
        leading-[1.5]
        text-white/80
        drop-shadow-[0_1px_5px_rgba(30,20,45,0.14)]
        sm:mt-2.5
        sm:text-[10px]
        md:text-[11px]
        lg:text-[14px]
      "
              >
                {slide.age}
              </p>

              {/* ==========================================================
        CTA
        ========================================================== */}

              {activeProduct ? (
                <div
                  className="
          mt-5
          sm:mt-5
          lg:mt-6
        "
                >
                  <Link
                    href={`/products/${activeProduct.slug}`}
                    className="
    group/button
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
  "
                  >
                    <span className="!text-white">Buy Product</span>

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
        group-hover/button:translate-x-1

        sm:size-4
      "
                        strokeWidth={2.5}
                      />
                    </span>
                  </Link>
                </div>
              ) : null}

              {/* ==========================================================
        SLIDE INDICATORS
        ========================================================== */}

              <div
                className="
        mt-4
        flex
        items-center
        gap-1.5
        sm:mt-5
      "
              >
                {featuredSlides.map((item, index) => (
                  <button
                    key={item.image}
                    type="button"
                    aria-label={`Go to featured slide ${index + 1}`}
                    aria-current={activeSlide === index}
                    onClick={() => setActiveSlide(index)}
                    className={`
            h-[3px]
            rounded-full
            transition-all
            duration-300
            ${activeSlide === index ? "w-8 bg-white sm:w-10" : "w-3 bg-white/45 hover:bg-white/75"}
          `}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ============================================================
              PREVIOUS BUTTON
              ============================================================ */}

          <button
            type="button"
            onClick={previousSlide}
            aria-label="Previous featured slide"
            className="
              absolute
              left-3
              top-1/2
              z-30
              flex
              size-8
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/80
              bg-white/90
              text-[#24385E]
              shadow-[0_6px_18px_rgba(30,30,50,0.14)]
              backdrop-blur-sm
              transition-all
              duration-200
              hover:scale-105
              hover:bg-white
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#E83D59]
              focus-visible:ring-offset-2
              sm:left-4
              sm:size-9
              lg:left-5
            "
          >
            <ArrowLeft className="size-3.5 sm:size-4" strokeWidth={2.2} />
          </button>

          {/* ============================================================
              NEXT BUTTON
              ============================================================ */}

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next featured slide"
            className="
              absolute
              right-3
              top-1/2
              z-30
              flex
              size-8
              -translate-y-1/2
              items-center
              justify-center
              rounded-full
              border
              border-white/80
              bg-white/90
              text-[#24385E]
              shadow-[0_6px_18px_rgba(30,30,50,0.14)]
              backdrop-blur-sm
              transition-all
              duration-200
              hover:scale-105
              hover:bg-white
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#E83D59]
              focus-visible:ring-offset-2
              sm:right-4
              sm:size-9
              lg:right-5
            "
          >
            <ArrowRight className="size-3.5 sm:size-4" strokeWidth={2.2} />
          </button>
        </div>
      </section>
    </Reveal>
  );
}

/* ==========================================================================
   MYTHOLOGY SERIES
   ========================================================================== */

function MythologySeriesSection({
  products,
}: {
  products: StorefrontProduct[];
}) {
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
      text-balance
      text-center
      font-[var(--font-roboto)]
      text-[clamp(2.3rem,6vw,5rem)]
      font-black
      uppercase
      leading-[0.9]
      tracking-[-0.06em]
      text-[#24385E]
    "
        >
          Buzzie Special
          <br />
          <span className="text-[#E83D59]">Mythology Series</span>
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
        xl:max-w-[720px]
        xl:text-[14px]
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
            text-balance
            font-[var(--font-roboto)]
            text-[clamp(2.3rem,6vw,5rem)]
            font-black
            leading-[0.9]
            tracking-[-0.06em]
            text-[#24385E]
          "
        >
          Buzzie
          <br />
          <span className="text-[#E83D59]">Geography Edition</span>
        </h2>

        {/* ================================================================
    DESCRIPTION
    ================================================================ */}

        <div className="mx-auto flex w-full justify-center">
          <p
            className="
              mt-8
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
              xl:max-w-[720px]
              xl:text-[14px]
    "
          >
            Explore the world through playful discoveries, fascinating places and fun learning
            adventures made for curious little minds.
          </p>
        </div>
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
            src="/images/hero/Buzzie-geography.png"
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
          <span className="!text-white">Check Geography Products</span>

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

      {/* ================================================================
          BOTTOM SPACING / DECORATIVE DETAIL
          ================================================================ */}

      <div
        aria-hidden="true"
        className="
          mx-auto
          mt-10
          flex
          items-center
          justify-center
          gap-1.5
          sm:mt-12
        "
      >
        <span className="h-[3px] w-8 rounded-full bg-[#E83D59]" />
        <span className="h-[3px] w-3 rounded-full bg-[#F5C84B]" />
        <span className="h-[3px] w-3 rounded-full bg-[#8B6BD9]" />
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
                text-center
                font-[var(--font-roboto)]
                text-[40px]
                font-black
                leading-[0.94]
                tracking-[-0.055em]
                text-[#111111]

                sm:mt-6
                sm:text-[50px]

                lg:mt-6
                lg:text-[60px]

                xl:text-[66px]
              "
            >
              What Buzzie Day <span className="text-[#E72D5A]">Feels like</span>
            </h2>

            {/* Description */}
            <p
              className="
                mx-auto
                mt-6
                w-full
                max-w-[650px]
                px-4
                text-center
                font-[var(--font-poppins)]
                text-[13px]
                leading-6
                text-[#687489]

                sm:mt-7
                sm:px-0
                sm:text-[14px]
                sm:leading-7

                lg:mt-8
                lg:max-w-[700px]
                lg:text-[15px]
                lg:leading-7
              "
            >
              Our favourites, picked for curious minds and unforgettable playtime.
            </p>
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

        {/* =========================================================
            PRODUCTS SECTION HEADER
           ========================================================= */}

        <Reveal>
          <div
            className="
              mt-12
              flex
              w-full
              flex-col
              gap-6

              sm:mt-14

              lg:mt-16
              lg:flex-row
              lg:items-end
              lg:justify-between
              lg:gap-8
            "
          >
            {/* Heading */}
            <div className="min-w-0">
              <div
                className="
                  flex
                  items-center
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
                    tracking-[0.18em]
                    text-[#E72D5A]

                    sm:text-[10px]

                    lg:text-[11px]
                  "
                >
                  Handpicked favourites
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

              <h3
                className="
                  mt-4
                  font-[var(--font-roboto)]
                  text-[34px]
                  font-black
                  leading-[0.94]
                  tracking-[-0.055em]
                  text-[#111111]

                  sm:text-[42px]

                  lg:text-[48px]
                "
              >
                Pick your favourite.
              </h3>
            </div>

            {/* =====================================================
                VIEW ALL PRODUCTS BUTTON
               ===================================================== */}

            <Link
              href="/shop"
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
              <span className="!text-white">View all products</span>

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
        </Reveal>

        {/* =========================================================
            PRODUCT GRID
           ========================================================= */}

        <div
          className="
            mt-9
            grid
            grid-cols-2
            gap-x-3
            gap-y-9

            sm:mt-10
            sm:grid-cols-2
            sm:gap-x-5
            sm:gap-y-11

            lg:mt-11
            lg:grid-cols-4
            lg:gap-x-6
            lg:gap-y-12

            xl:gap-x-7
          "
        >
          {products.slice(0, 8).map((product, index) => (
            <Reveal key={product._id} delay={index * 0.035}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>


      </div>
    </section>
  );
}
