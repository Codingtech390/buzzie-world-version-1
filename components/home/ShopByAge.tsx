"use client";

import { useState } from "react";
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

  if (!favorites.length) {
    return null;
  }

  const product = favorites[activeIndex];
  const productImage = product.images?.[0]?.url;

  const previous = () => {
    setActiveIndex((current) => (current === 0 ? favorites.length - 1 : current - 1));
  };

  const next = () => {
    setActiveIndex((current) => (current === favorites.length - 1 ? 0 : current + 1));
  };

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
          HERO BACKGROUND
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

      {/* ================================================================
          VERY LIGHT OVERLAY
          Keeps the text readable without washing out hero-bg.png.
          ================================================================ */}

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
            mt-8
            relative
            z-20
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
              Latest & Trending
            </span>

            <span className="size-1.5 rounded-full bg-[#F59A23]" />
          </div>

          <h2
            className="
            uppercase
              mx-auto
              w-full
              max-w-[700px]
              font-[var(--font-roboto)]
              text-[clamp(2.35rem,9vw,4.25rem)]
              font-black
              leading-[0.91]
              tracking-[-0.06em]
              text-[#111111]
              sm:text-[clamp(2.8rem,7vw,4.25rem)]
              lg:text-[clamp(3rem,4.8vw,4.25rem)]
            "
          >
            Buzzie <span className="text-[#E72D5A]">Favorite</span>
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
          MAIN HERO CONTENT
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
              px-2
              py-2
              text-center
              sm:px-5
              sm:py-3
              lg:px-0
              lg:pl-6
              lg:text-left
              xl:pl-10
            "
          >
            {/* Eyebrow */}

            <div
              className="
                flex
                items-center
                justify-center
                gap-2
                lg:justify-start
              "
            >
              <span
                className="
                  size-1.5
                  rounded-full
                  bg-[#E83D59]
                  sm:size-2
                "
              />

              <span
                className="
                  font-[var(--font-poppins)]
                  text-[8px]
                  font-extrabold
                  uppercase
                  tracking-[0.22em]
                  text-[#52627D]
                  sm:text-[9px]
                  lg:text-[10px]
                "
              >
                BUZZIEWORLD
              </span>

              <span
                className="
                  h-px
                  w-6
                  bg-[#52627D]/45
                  sm:w-8
                "
              />
            </div>

            {/* Heading */}

            <h2
              className="
                mt-3
                max-w-[520px]
                font-[var(--font-poppins)]
                text-[clamp(2.35rem,7.5vw,4.75rem)]
                font-extrabold
                leading-[0.91]
                tracking-[-0.065em]
                text-[#24385E]
                lg:mt-5
              "
            >
              Big ideas
              <br />
              begin with
              <br />
              <span className="text-[#E83D59]">little hands.</span>
            </h2>

            {/* Description */}

            <p
              className="
                mx-auto
                mt-4
                max-w-[430px]
                font-[var(--font-roboto)]
                text-[11px]
                leading-[1.65]
                text-[#4E5970]
                sm:text-[12px]
                lg:mx-0
                lg:mt-5
                lg:max-w-[440px]
                lg:text-[13px]
                lg:leading-[1.65]
              "
            >
              A story-led game set introducing children to memorable characters, creatures and
              stories through fun, simple facts and playful matching challenges.
            </p>

            {/* CTA + PRICE */}

            <div
              className="
                mt-5
                flex
                flex-col
                items-center
                gap-4
                sm:flex-row
                sm:justify-center
                lg:justify-start
              "
            >
              <Link
                href={`/products/${product.slug}`}
                className="
                  group
                  inline-flex
                  min-h-[42px]
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-[#C391EE]
                  px-5
                  font-[var(--font-poppins)]
                  text-[10px]
                  font-extrabold
                  text-white
                  shadow-[0_10px_24px_rgba(35,150,180,0.18)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#E83D59]
                  hover:text-white
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#E83D59]
                  focus-visible:ring-offset-2
                  sm:min-h-[44px]
                  sm:px-6
                  sm:text-[11px]
                "
              >
                Discover Product
                <ArrowRight
                  className="
                    size-3.5
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                />
              </Link>

              <div className="text-left">
                <p
                  className="
                    font-[var(--font-poppins)]
                    text-[7px]
                    font-extrabold
                    uppercase
                    tracking-[0.18em]
                    text-[#687489]
                  "
                >
                  FROM
                </p>

                <div className="mt-0.5 flex items-baseline gap-2">
                  <span
                    className="
                      font-[var(--font-poppins)]
                      text-[15px]
                      font-extrabold
                      tracking-[-0.02em]
                      text-[#24385E]
                    "
                  >
                    ₹{product.price.toLocaleString("en-IN")}
                  </span>

                  {product.compareAtPrice && product.compareAtPrice > product.price ? (
                    <span
                      className="
                        font-[var(--font-roboto)]
                        text-[9px]
                        text-[#7B8090]
                        line-through
                      "
                    >
                      ₹{product.compareAtPrice.toLocaleString("en-IN")}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Slider indicator */}

            {favorites.length > 1 ? (
              <div
                className="
                  mt-4
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
                    aria-label={`Show favorite ${index + 1}`}
                    aria-current={activeIndex === index}
                    className={`
                      h-[3px]
                      rounded-full
                      transition-all
                      duration-300
                      ${
                        activeIndex === index
                          ? "w-8 bg-[#E83D59]"
                          : "w-4 bg-[#24385E]/25 hover:bg-[#24385E]/45"
                      }
                    `}
                  />
                ))}
              </div>
            ) : null}

            {/* Small supporting line */}

            <div
              className="
                mt-5
                flex
                items-center
                justify-center
                gap-2
                font-[var(--font-roboto)]
                text-[8px]
                font-medium
                text-[#58647A]
                lg:justify-start
                lg:text-[9px]
              "
            >
              <span className="size-1.5 rounded-full bg-[#65C9DC]" />
              Made for little curious minds
            </div>
          </div>

          {/* ============================================================
              RIGHT — PAPER PRODUCT PRESENTATION
              ============================================================ */}

          <div
            className="
              relative
              flex
              min-h-[285px]
              items-center
              justify-center
              px-1
              max-sm:min-h-[140px]
              md:min-h-[390px]
              lg:min-h-[470px]
              lg:px-0
              xl:min-h-[568px]
            "
          >
            {/* ==========================================================
                NAVIGATION ARROW — LEFT
                ========================================================== */}

            <button
              type="button"
              onClick={previous}
              aria-label="Previous favorite"
              className="
                absolute
                left-0
                top-1/2
                z-50
                flex
                size-8
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-[#24385E]/15
                bg-white/80
                text-[#24385E]
                shadow-[0_6px_18px_rgba(35,45,75,0.12)]
                backdrop-blur-sm
                transition-all
                duration-200
                hover:scale-105
                hover:bg-white
                lg:left-1
                xl:left-1
              "
            >
              <ArrowLeft className="size-4" />
            </button>

            {/* ==========================================================
                PAPER CARD
                ========================================================== */}

            <div
              className="
                relative
                z-20
                flex
                w-[132%]
                max-w-none
                -translate-x-[2%]
                items-center
                justify-center
                rotate-[-2deg]
                transition-transform
                duration-500
                hover:rotate-[-1deg]
                sm:w-[245%]
                sm:-translate-x-[4%]
                md:w-[165%]
                md:-translate-x-[6%]
                lg:w-[192%]
                lg:-translate-x-[8%]
                xl:w-[188%]
                xl:-translate-x-[9%]
              "
            >
              {/* ========================================================
                  PAPER TEXTURE
                  ======================================================== */}

              <img
                src="/images/hero/home-paper.png"
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
              />

              {/* ========================================================
                  PRODUCT
                  ======================================================== */}

              <div
                key={product._id}
                className="
                  absolute
                  inset-[11%]
                  z-10
                  flex
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
                      h-auto
                      max-h-[82%]
                      w-[78%]
                      object-contain
                      drop-shadow-[0_22px_24px_rgba(38,34,55,0.24)]
                      transition-transform
                      duration-500
                      hover:scale-[1.025]
                      sm:w-[80%]
                      md:w-[81%]
                      lg:w-[82%]
                    "
                  />
                ) : (
                  <div
                    className="
                      flex
                      aspect-[4/3]
                      w-[72%]
                      items-center
                      justify-center
                      rounded-2xl
                      bg-white/50
                      font-[var(--font-poppins)]
                      text-sm
                      font-bold
                      text-[#687489]
                      backdrop-blur-sm
                    "
                  >
                    {product.name}
                  </div>
                )}
              </div>
            </div>

            {/* ==========================================================
                NAVIGATION ARROW — RIGHT
                ========================================================== */}

            <button
              type="button"
              onClick={next}
              aria-label="Next favorite"
              className="
                absolute
                right-0
                top-1/2
                z-50
                flex
                size-8
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-[#24385E]/15
                bg-white/80
                text-[#24385E]
                shadow-[0_6px_18px_rgba(35,45,75,0.12)]
                backdrop-blur-sm
                transition-all
                duration-200
                hover:scale-105
                hover:bg-white
                lg:right-1
                xl:right-28
              "
            >
              <ArrowRight className="size-4" />
            </button>

            {/* ==========================================================
                SIDE INFORMATION ICON BUTTONS
                ========================================================== */}

            <div
              className="
                absolute
                right-0
                top-1/2
                z-40
                hidden
                -translate-y-1/2
                flex-col
                lg:flex
                xl:right-[-8px]
              "
            >
              {/* ========================================================
                  OVERVIEW — BLUE
                  ======================================================== */}

              <button
                type="button"
                aria-label="Overview"
                title="Overview"
                onClick={() => {
                  // Add overview interaction here when required.
                }}
                className="
                  group
                  relative
                  z-40
                  flex
                  size-[88px]
                  shrink-0
                  items-center
                  justify-center
                  overflow-visible
                  border-0
                  bg-transparent
                  p-0
                  shadow-none
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:scale-[1.03]
                  active:translate-y-0
                  active:scale-[0.97]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#E83D59]
                  focus-visible:ring-offset-2
                "
              >
                <img
                  src="/images/hero/themed-buttons/themed-blue-button.png"
                  alt=""
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    z-0
                    h-full
                    w-full
                    select-none
                    object-contain
                  "
                />

                <span
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    z-10
                    flex
                    -translate-y-[18px]
                    items-center
                    justify-center
                  "
                >
                  <Eye
                    className="
                      size-[24px]
                      shrink-0
                      text-white
                      drop-shadow-[0_2px_3px_rgba(0,0,0,0.20)]
                      transition-transform
                      duration-200
                      group-hover:scale-105
                    "
                    strokeWidth={1.8}
                  />
                </span>
              </button>

              {/* ========================================================
                  DETAILS — RED
                  ======================================================== */}

              <button
                type="button"
                aria-label="Product details"
                title="Details"
                onClick={() => {
                  // Add details interaction here when required.
                }}
                className="
                  group
                  relative
                  z-30
                  -mt-[26px]
                  flex
                  size-[88px]
                  shrink-0
                  items-center
                  justify-center
                  overflow-visible
                  border-0
                  bg-transparent
                  p-0
                  shadow-none
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:scale-[1.03]
                  active:translate-y-0
                  active:scale-[0.97]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#E83D59]
                  focus-visible:ring-offset-2
                "
              >
                <img
                  src="/images/hero/themed-buttons/themed-red-button.png"
                  alt=""
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    z-0
                    h-full
                    w-full
                    select-none
                    object-contain
                  "
                />

                <span
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    z-10
                    flex
                    -translate-y-[18px]
                    items-center
                    justify-center
                  "
                >
                  <Info
                    className="
                      size-[24px]
                      shrink-0
                      text-white
                      drop-shadow-[0_2px_3px_rgba(0,0,0,0.20)]
                      transition-transform
                      duration-200
                      group-hover:scale-105
                    "
                    strokeWidth={1.9}
                  />
                </span>
              </button>

              {/* ========================================================
                  RATING — VIOLET
                  ======================================================== */}

              <button
                type="button"
                aria-label="Product rating 4.8 out of 5"
                title="Rating: 4.8"
                onClick={() => {
                  // Add reviews interaction here when required.
                }}
                className="
                  group
                  relative
                  z-20
                  -mt-[26px]
                  flex
                  size-[88px]
                  shrink-0
                  items-center
                  justify-center
                  overflow-visible
                  border-0
                  bg-transparent
                  p-0
                  shadow-none
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:scale-[1.03]
                  active:translate-y-0
                  active:scale-[0.97]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#E83D59]
                  focus-visible:ring-offset-2
                "
              >
                <img
                  src="/images/hero/themed-buttons/themed-violet-button.png"
                  alt=""
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    z-0
                    h-full
                    w-full
                    select-none
                    object-contain
                  "
                />

                <span
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    z-10
                    flex
                    -translate-y-[18px]
                    items-center
                    justify-center
                  "
                >
                  <Star
                    className="
                      size-[24px]
                      shrink-0
                      text-white
                      drop-shadow-[0_2px_3px_rgba(0,0,0,0.20)]
                      transition-transform
                      duration-200
                      group-hover:scale-105
                    "
                    strokeWidth={1.8}
                  />
                </span>
              </button>

              {/* ========================================================
                  DEMO / PLAY — YELLOW
                  ======================================================== */}

              <button
                type="button"
                aria-label="Watch product demo"
                title="Watch Demo"
                onClick={() => {
                  // Add demo/video interaction here when required.
                }}
                className="
                  group
                  relative
                  z-10
                  -mt-[26px]
                  flex
                  size-[88px]
                  shrink-0
                  items-center
                  justify-center
                  overflow-visible
                  border-0
                  bg-transparent
                  p-0
                  shadow-none
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:scale-[1.03]
                  active:translate-y-0
                  active:scale-[0.97]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#E83D59]
                  focus-visible:ring-offset-2
                "
              >
                <img
                  src="/images/hero/themed-buttons/themed-yellow-button.png"
                  alt=""
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    z-0
                    h-full
                    w-full
                    select-none
                    object-contain
                  "
                />

                <span
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    z-10
                    flex
                    -translate-y-[18px]
                    items-center
                    justify-center
                  "
                >
                  <CirclePlay
                    className="
                      size-[24px]
                      shrink-0
                      text-white
                      drop-shadow-[0_2px_3px_rgba(0,0,0,0.20)]
                      transition-transform
                      duration-200
                      group-hover:scale-105
                    "
                    strokeWidth={1.8}
                  />
                </span>
              </button>
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
