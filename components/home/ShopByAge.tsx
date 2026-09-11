"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CirclePlay,
  Eye,
  ExternalLink,
  Heart,
  Info,
  Play,
  ShoppingBag,
  Star,
} from "lucide-react";
import type { StorefrontProduct } from "@/types/storefront";
import Reveal from "./Reveal";

interface ShopByAgeProps {
  products: StorefrontProduct[];
}

/* ==========================================================================
   BUZZIE FAVORITES
   ========================================================================== */

function BuzzieFavorites({ products }: { products: StorefrontProduct[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const favorites = products.slice(0, 3);

  useEffect(() => {
    if (favorites.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % favorites.length);
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [favorites.length]);

  if (!favorites.length) {
    return null;
  }

  const product = favorites[activeIndex % favorites.length];

  const productImage = product.images?.[0]?.url;

  /* ==========================================================================
     PRODUCT DATA
     ========================================================================== */

  const ageLabel = (() => {
    const ageRange = product.ageRange;

    if (!ageRange) {
      return "All Ages";
    }

    if (
      ageRange.min !== undefined &&
      ageRange.max !== undefined
    ) {
      return `Ages ${ageRange.min}–${ageRange.max}`;
    }

    if (ageRange.min !== undefined) {
      return `Ages ${ageRange.min}+`;
    }

    if (ageRange.max !== undefined) {
      return `Up to ${ageRange.max}`;
    }

    return "All Ages";
  })();


  const stockLabel =
    product.stock > 0
      ? `${product.stock.toLocaleString("en-IN")} Pieces`
      : "Out of Stock";


  const featuredLabel = product.featured
    ? "Featured"
    : "Our Pick";

  return (
    <section
      className="
        relative
        isolate
        mb-14
        overflow-hidden
        bg-[#F8F5F2]
        sm:mb-18
        lg:mb-20
      "
    >
      {/* ================================================================
          OVERALL SECTION BACKGROUND
          ================================================================ */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          bg-[url('/images/hero/hero-bg-1.png')]
          bg-cover
          bg-center
          bg-no-repeat
        "
      />

      {/* Very light overlay */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          -z-[5]
          bg-white/[0.035]
        "
      />

      {/* ================================================================
          SECTION HEADING
          ================================================================ */}

      <Reveal>
        <div
          className="
            relative
            z-20
            mt-8
            flex
            flex-col
            items-center
            text-center
          "
        >
          <div
            className="
              mx-auto
              mb-4
              flex
              items-center
              justify-center
              gap-2
              sm:mb-5
            "
          >
            <span
              className="
                h-[2px]
                w-7
                rounded-full
                bg-[#E72D5A]
                sm:w-8
              "
            />

            <span
              className="
                font-[var(--font-poppins)]
                text-[8px]
                font-black
                uppercase
                tracking-[0.18em]
                text-[#E72D5A]
                sm:text-[10px]
                xl:text-[12px]
              "
            >
              Latest &amp; Trending
            </span>

            <span className="size-1.5 rounded-full bg-[#F59A23]" />
          </div>

          <h2
            className="
    m-0
    mx-auto
    w-full
    max-w-[700px]
    font-[var(--font-poppins-brand)]
    text-[clamp(3.4rem,11vw,5.8rem)]
    font-bold
    uppercase
    leading-[0.82]
    tracking-[-0.025em]
    text-[#111111]
  "
          >
            Buzzie <span className="text-[#FF5558]">Favorite</span>
          </h2>

          <div
            className="
              mx-auto
              mt-5
              flex
              items-center
              justify-center
              gap-1.5
              sm:mt-6
            "
          >
            <span className="h-[2px] w-8 rounded-full bg-[#C391EE]" />
            <span className="h-[2px] w-2.5 rounded-full bg-[#E72D5A]" />
            <span className="h-[2px] w-1.5 rounded-full bg-[#F5B5C5]" />
          </div>
        </div>
      </Reveal>

      {/* ================================================================
          MAIN CONTENT
          ================================================================ */}

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1440px]
          px-4
          pt-5
          pb-2
          sm:px-6
          sm:pt-7
          sm:pb-3
          lg:px-10
          lg:pt-8
          lg:pb-4
          xl:px-14
          2xl:px-16
        "
      >
        <div
          className="
            grid
            min-h-0
            grid-cols-1
            items-center
            gap-4
            sm:gap-6
            lg:min-h-[500px]
            lg:grid-cols-[0.88fr_1.12fr]
            lg:gap-4
            xl:min-h-[530px]
            xl:grid-cols-[0.86fr_1.14fr]
          "
        >
          {/* ============================================================
              LEFT — COPY
              ============================================================ */}

          <div
            className="
    relative
    z-30
    flex
    flex-col
    justify-center
    px-5
    py-8
    text-center
    sm:px-8
    sm:py-10
    lg:px-0
    lg:pl-8
    lg:pr-6
    lg:text-left
    xl:pl-12
    xl:pr-10
  "
          >
            {/* Product Name */}
            <h3
              className="
      m-0
      max-w-[620px]
      font-[var(--font-poppins-brand)]
      text-[clamp(2.2rem,5vw,4.5rem)]
      font-bold
      leading-[0.94]
      tracking-[-0.035em]
      text-[#24385E]
    "
            >
              {product.name}
            </h3>

            {/* Product Description */}
            <p
              className="
      mx-auto
      mt-8
      max-w-[520px]
      font-[var(--font-poppins-brand)]
      text-[13px]
      font-medium
      leading-[1.65]
      tracking-[-0.01em]
      text-[#58647A]
      sm:mt-6
      sm:text-[14px]
      lg:mx-0
      lg:mt-6
      lg:max-w-[500px]
      lg:text-[15px]
      lg:leading-[1.65]
      lg:mt-5
    "
            >
              {product.description}
            </p>

            {/* CTA + Price */}
            <div
              className="
      mt-7
      flex
      flex-col
      items-center
      gap-4
      sm:mt-8
      sm:flex-row
      sm:items-center
      sm:justify-center
      lg:justify-start
    "
            >
              {/* Themed CTA */}
              <Link
                href={`/products/${product.slug}`}
                className="
        group
        inline-flex
        min-h-[50px]
        items-center
        justify-center
        gap-2.5
        rounded-full
        bg-[#C391EE]
        px-7
        font-[var(--font-poppins-brand)]
        text-[14px]
        font-bold
        leading-none
        text-white
        shadow-[0_12px_28px_rgba(195,145,238,0.28)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:bg-[#E83D59]
        hover:text-white
        hover:shadow-[0_14px_30px_rgba(232,61,89,0.22)]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#E83D59]
        focus-visible:ring-offset-2
        sm:min-h-[54px]
        sm:px-8
        sm:text-[15px]
      "
              >
                Discover Product
                <ArrowRight
                  className="
          size-4
          transition-transform
          duration-300
          group-hover:translate-x-1
          sm:size-[18px]
        "
                />
              </Link>

              {/* Price */}
              <div
                className="
        flex
        items-baseline
        gap-2
        font-[var(--font-poppins-brand)]
      "
              >
                <span
                  className="
          text-[20px]
          font-bold
          leading-none
          tracking-[-0.025em]
          text-[#24385E]
          sm:text-[22px]
        "
                >
                  ₹{product.price.toLocaleString("en-IN")}
                </span>

                {product.compareAtPrice && product.compareAtPrice > product.price ? (
                  <span
                    className="
            font-[var(--font-poppins-brand)]
            text-[12px]
            font-medium
            leading-none
            text-[#8A91A0]
            line-through
            sm:text-[13px]
          "
                  >
                    ₹{product.compareAtPrice.toLocaleString("en-IN")}
                  </span>
                ) : null}
              </div>
            </div>

            {/* Carousel Indicators */}
            {favorites.length > 1 ? (
              <div
                className="
        mt-7
        flex
        items-center
        justify-center
        gap-1.5
        lg:justify-start
      "
              >
                {favorites.map((item, index) => (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show ${item.name}`}
                    aria-current={activeIndex === index}
                    className={`
            h-[4px]
            rounded-full
            transition-all
            duration-300
            ${
              activeIndex === index
                ? "w-9 bg-[#E83D59]"
                : "w-4 bg-[#24385E]/20 hover:bg-[#24385E]/40"
            }
          `}
                  />
                ))}
              </div>
            ) : null}

            {/* Supporting Line */}
            <div
              className="
      mt-6
      flex
      items-center
      justify-center
      gap-2
      font-[var(--font-poppins-brand)]
      text-[10px]
      font-medium
      leading-none
      text-[#687489]
      lg:justify-start
      lg:text-[11px]
    "
            >
              <span className="size-1.5 rounded-full bg-[#65C9DC]" />
              Made for little curious minds
            </div>
          </div>

          {/* ============================================================
              RIGHT — PRODUCT CARD + BUTTONS
              ============================================================ */}

          <div
            className="
              relative
              flex
              min-h-[260px]
              items-center
              justify-center
              sm:min-h-[330px]
              md:min-h-[410px]
              lg:min-h-[500px]
              xl:min-h-[560px]
            "
          >
            {/* ==========================================================
                3D PRODUCT CARD
                ========================================================== */}

            <div
              key={product._id}
              className="
                relative
                z-20
                w-[58%]
                min-w-0
                max-w-[372px]
                -translate-x-[4%]
                rotate-[-2deg]
                transition-all
                duration-500
                sm:w-[60%]
                sm:-translate-x-[3%]
                md:w-[60%]
                md:-translate-x-[2%]
                lg:w-[60%]
                lg:translate-x-0
              "
            >
              {/* ========================================================
                  RAW 3D CARD
                  ======================================================== */}

              <img
                src="/images/products/card-buzzie-fav-raw.png"
                alt=""
                aria-hidden="true"
                className="
                  relative
                  z-0
                  block
                  h-auto
                  w-full
                  select-none
                  object-contain
                "
                draggable={false}
              />

              {/* ========================================================
                  PRODUCT IMAGE FROM BACKEND
                  ======================================================== */}

              <div
                className="
                  absolute
                  inset-x-[9%]
                  top-[10%]
                  z-10
                  flex
                  h-[66%]
                  items-center
                  justify-center
                "
              >
                {productImage ? (
                  <img
                    src={productImage}
                    alt={product.images?.[0]?.alt || product.name}
                    className="
                      block
                      max-h-full
                      max-w-[88%]
                      object-contain
                      drop-shadow-[0_18px_22px_rgba(20,30,55,0.28)]
                      transition-transform
                      duration-500
                    "
                    draggable={false}
                  />
                ) : (
                  <div
                    className="
                      flex
                      h-[55%]
                      w-[65%]
                      items-center
                      justify-center
                      rounded-2xl
                      bg-white/20
                      px-5
                      text-center
                      font-[var(--font-poppins)]
                      text-sm
                      font-bold
                      text-[#24385E]
                    "
                  >
                    {product.name}
                  </div>
                )}
              </div>

              {/* ========================================================
                  PRODUCT NAME
                  SLIGHTLY TILTED
                  ======================================================== */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-x-[17%]
                  bottom-[8.2%]
                  z-20
                  flex
                  h-[15.5%]
                  items-center
                  justify-center
                  px-[7%]
                  text-center
                "
              >
                <span
                  className="
                  mt-5
                    line-clamp-2
                    max-w-full
                    rotate-[-3deg]
                    font-[var(--font-poppins)]
                    text-[clamp(0.78rem,2.5vw,2.04rem)]
                    font-extrabold
                    leading-[0.95]
                    tracking-[-0.035em]
                    text-white
                    drop-shadow-[0_3px_4px_rgba(90,20,35,0.28)]
                    sm:text-[clamp(0.95rem,2.25vw,2.04rem)]
                    xl:text-[clamp(1.05rem,2.25vw,1.50rem)]
                  "
                >
                  {product.name}
                </span>
              </div>
            </div>

            {/* ==========================================================
                RIGHT-SIDE BUTTONS

                SAME VERTICAL STACK AT ALL BREAKPOINTS.

                There is deliberately NO:
                  hidden
                  lg:flex

                Therefore the buttons remain visible on mobile.
                ========================================================== */}

            <div
              className="
              gap-4
              max-sm:gap-3
                absolute
                right-[1%]
                top-1/2
                z-40
                flex
                w-[25%]
                max-w-[150px]
                -translate-y-1/2
                flex-col
                items-center
                gap-0
                max-sm:right-[-2%]
                sm:w-[24%]
                md:right-[1%]
                md:w-[23%]
                lg:right-[-1%]
                lg:w-[22%]
                lg:max-w-[150px]
                xl:right-[1%]
              "
            >
              {/* ========================================================
                  YELLOW — AGE
                  ======================================================== */}

              <Link
                href={`/products/${product.slug}`}
                aria-label={`View ${product.name} — ${ageLabel}`}
                className="
                  group
                  relative
                  z-40
                  block
                  w-full
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:scale-[1.03]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#E83D59]
                  focus-visible:ring-offset-2
                "
              >
                <img
                  src="/images/buttons/right-yellow.png"
                  alt=""
                  aria-hidden="true"
                  className="
                    block
                    h-auto
                    w-full
                    select-none
                    object-contain
                  "
                  draggable={false}
                />

                <span
                  className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    left-[31%]
                    right-[7%]
                    flex
                    items-center
                    justify-center
                    px-[4%]
                    text-center
                    font-[var(--font-poppins)]
                    text-[clamp(0.42rem,1.9vw,0.82rem)]
                    font-extrabold
                    leading-[1]
                    tracking-[-0.025em]
                    text-[#17365F]
                    transition-transform
                    duration-300
                    group-hover:scale-[1.03]
                  "
                >
                  {ageLabel}
                </span>
              </Link>

              {/* ========================================================
                  GREEN — STOCK
                  ======================================================== */}

              <Link
                href={`/products/${product.slug}`}
                aria-label={`View ${product.name} — ${stockLabel}`}
                className="
                  group
                  relative
                  z-30
                  -mt-[3%]
                  block
                  w-full
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:scale-[1.03]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#E83D59]
                  focus-visible:ring-offset-2
                "
              >
                <img
                  src="/images/buttons/right-green.png"
                  alt=""
                  aria-hidden="true"
                  className="
                    block
                    h-auto
                    w-full
                    select-none
                    object-contain
                  "
                  draggable={false}
                />

                <span
                  className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    left-[31%]
                    right-[7%]
                    flex
                    items-center
                    justify-center
                    px-[4%]
                    text-center
                    font-[var(--font-poppins)]
                    text-[clamp(0.38rem,1.75vw,0.76rem)]
                    font-extrabold
                    leading-[0.95]
                    tracking-[-0.025em]
                    text-[#125C2A]
                    transition-transform
                    duration-300
                    group-hover:scale-[1.03]
                  "
                >
                  {stockLabel}
                </span>
              </Link>

              {/* ========================================================
                  PINK — FEATURED
                  ======================================================== */}

              <Link
                href={`/products/${product.slug}`}
                aria-label={`View ${product.name} — ${featuredLabel}`}
                className="
                  group
                  relative
                  z-20
                  -mt-[3%]
                  block
                  w-full
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:scale-[1.03]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#E83D59]
                  focus-visible:ring-offset-2
                "
              >
                <img
                  src="/images/buttons/right-pink.png"
                  alt=""
                  aria-hidden="true"
                  className="
                    block
                    h-auto
                    w-full
                    select-none
                    object-contain
                  "
                  draggable={false}
                />

                <span
                  className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    left-[31%]
                    right-[7%]
                    flex
                    items-center
                    justify-center
                    px-[4%]
                    text-center
                    font-[var(--font-poppins)]
                    text-[clamp(0.42rem,1.9vw,0.82rem)]
                    font-extrabold
                    leading-[1]
                    tracking-[-0.025em]
                    text-[#B90D45]
                    transition-transform
                    duration-300
                    group-hover:scale-[1.03]
                  "
                >
                  {featuredLabel}
                </span>
              </Link>

              {/* ========================================================
                  BLUE — WATCH DEMO
                  ======================================================== */}

              <Link
                href={`/products/${product.slug}`}
                aria-label={`Watch demo for ${product.name}`}
                className="
                  group
                  relative
                  z-10
                  -mt-[3%]
                  block
                  w-full
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:scale-[1.03]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#E83D59]
                  focus-visible:ring-offset-2
                "
              >
                <img
                  src="/images/buttons/right-blue.png"
                  alt=""
                  aria-hidden="true"
                  className="
                    block
                    h-auto
                    w-full
                    select-none
                    object-contain
                  "
                  draggable={false}
                />

                <span
                  className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    left-[31%]
                    right-[7%]
                    flex
                    items-center
                    justify-center
                    px-[4%]
                    text-center
                    font-[var(--font-poppins)]
                    text-[clamp(0.4rem,1.8vw,0.78rem)]
                    font-extrabold
                    leading-[0.9]
                    tracking-[-0.025em]
                    text-[#2E2188]
                    transition-transform
                    duration-300
                    group-hover:scale-[1.03]
                  "
                >
                  Watch Demo
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================
          BENEFITS ARTWORK
          ================================================================ */}

      <Reveal delay={0.12}>
        <div
          className="
            relative
            mx-auto
            mt-0
            w-full
            max-w-[1150px]
            overflow-hidden
            sm:mt-1
            lg:mt-2
          "
        >
          <img
            src="/images/benefits-vectors/squiggly-images-1.png"
            alt=""
            aria-hidden="true"
            className="
              mx-auto
              block
              h-auto
              w-full
              max-w-[1000px]
              object-contain
            "
          />
        </div>
      </Reveal>
    </section>
  );
}
/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */

export default function ShopByAge({ products }: ShopByAgeProps) {
  return (
    <section
      className="
        relative
        isolate
        overflow-hidden
        bg-white
        py-8
        sm:py-12
        lg:py-16
      "
    >
      <BuzzieFavorites products={products} />


    </section>
  );
}
