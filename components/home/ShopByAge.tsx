"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { StorefrontProduct } from "@/types/storefront";
import Reveal from "./Reveal";

interface ShopByAgeProps {
  products: StorefrontProduct[];
}

/* ============================================================================
   BUZZIE FAVORITES
   ============================================================================ */

function BuzzieFavorites({ products }: { products: StorefrontProduct[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const favorites = products.slice(0, 3);

  /* --------------------------------------------------------------------------
     AUTO ROTATE
     -------------------------------------------------------------------------- */

  useEffect(() => {
    if (favorites.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % favorites.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [favorites.length]);

  if (!favorites.length) return null;

  const product = favorites[activeIndex % favorites.length];
  const productImage = product.images?.[0]?.url;

  /* ============================================================================
     PRODUCT DATA
     ============================================================================ */

  const ageLabel = (() => {
    const ageRange = product.ageRange;

    if (!ageRange) return "All Ages";

    if (ageRange.min !== undefined && ageRange.max !== undefined) {
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
    product.stock > 0 ? `${product.stock.toLocaleString("en-IN")} Pieces` : "Out of Stock";

  const featuredLabel = product.featured ? "Featured" : "Our Pick";

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
      {/* ======================================================================
          SECTION HEADING
      ======================================================================= */}

      <Reveal>
        <div
          className="
            relative
            z-50
            flex
            flex-col
            items-center
            text-center
          "
        >
          {/* EYEBROW */}

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
              aria-hidden="true"
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
                font-[var(--font-poppins-brand)]
                text-[8px]
                font-black
                uppercase
                tracking-[0.18em]
                text-[#E83D59]
                sm:text-[10px]
                xl:text-[12px]
              "
            >
              Latest &amp; Trending
            </span>

            <span
              aria-hidden="true"
              className="
                size-1.5
                rounded-full
                bg-[#E83D59]
              "
            />
          </div>

          {/* MAIN HEADING */}

          <h2
            className="
              m-0
              mx-auto
              w-full
              max-w-[850px]
              px-4
              font-[var(--font-poppins-brand)]
              text-[clamp(3.4rem,11vw,5.8rem)]
              font-bold
              uppercase
              leading-[0.82]
              tracking-[-0.025em]
              text-[#111111]
              sm:px-6
            "
          >
            Buzzie <span className="text-[#E83D59]">Favorite</span>
          </h2>

          {/* HEADING ACCENT */}

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
            <span
              aria-hidden="true"
              className="
                h-[2px]
                w-8
                rounded-full
                bg-[#C391EE]
              "
            />

            <span
              aria-hidden="true"
              className="
                h-[2px]
                w-2.5
                rounded-full
                bg-[#E72D5A]
              "
            />

            <span
              aria-hidden="true"
              className="
                h-[2px]
                w-1.5
                rounded-full
                bg-[#F5B5C5]
              "
            />
          </div>
        </div>
      </Reveal>

      {/* ======================================================================
          COMPLETE BUZZIE FAVORITE VISUAL

          MOBILE:
            TOP 48%    = CASTLE
            BOTTOM 52% = BEIGE BACKGROUND

          DESKTOP:
            LEFT 50%   = CASTLE
            RIGHT 50%  = BEIGE BACKGROUND

          IMPORTANT:
          The castle is the actual background layer.
          It is NOT inside the heading container.
      ======================================================================= */}

      <div
        className="
          relative
          z-10
          mx-auto
          mt-7
          w-full
          px-2

          sm:mt-8
          sm:px-3

          lg:mt-9
          lg:px-4

          xl:px-5
        "
      >
        <div
          className="
            relative
            isolate
            mx-auto
            w-full
            max-w-[1500px]
            overflow-hidden
            rounded-[14px]
            bg-[#F8F5F2]
            shadow-[0_10px_35px_rgba(30,25,45,0.07)]

            h-[820px]

            sm:h-[900px]

            md:h-[980px]

            lg:h-[78vh]
            lg:min-h-[700px]
            lg:max-h-[850px]

            xl:h-[80vh]
            xl:min-h-[720px]
            xl:max-h-[900px]

            2xl:h-[82vh]
            2xl:min-h-[740px]
            2xl:max-h-[920px]
          "
        >
          {/* ==================================================================
              LEFT / TOP CASTLE BACKGROUND

              MOBILE:
                complete top section

              DESKTOP:
                complete left half
          =================================================================== */}

          <div
            aria-hidden="true"
            className="
    pointer-events-none
    absolute
    left-0
    top-0
    z-0
    h-[48%]
    w-full
    overflow-hidden
    bg-[#F6E9E6]

    lg:inset-y-0
    lg:h-full
    lg:w-1/2
  "
          >
            {/* Castle image */}
            <img
              src="/images/backgrounds/castle-new.png"
              alt=""
              aria-hidden="true"
              draggable={false}
              className="
      absolute
      inset-0
      block
      h-full
      w-full
      select-none
      object-cover
      object-center
    "
            />

            {/* Dark overlay */}
            <div
              className="
      absolute
      inset-0
      bg-[#111111]/55
    "
            />
          </div>

          {/* ==================================================================
              RIGHT / BOTTOM BEIGE BACKGROUND

              MOBILE:
                complete bottom section

              DESKTOP:
                complete right half
          =================================================================== */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              bottom-0
              left-0
              z-0
              h-[52%]
              w-full
              overflow-hidden
              bg-[#EFE0C1]
              bg-[url('/images/hero/homepage-background-1.png')]
              bg-cover
              bg-center
              bg-no-repeat

              lg:inset-y-0
              lg:left-auto
              lg:right-0
              lg:h-full
              lg:w-1/2
            "
          />

          {/* ==================================================================
              CENTER SEAM

              MOBILE:
                horizontal

              DESKTOP:
                vertical
          =================================================================== */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-0
              top-[48%]
              z-[2]
              h-px
              w-full
              bg-white/15

              lg:left-1/2
              lg:top-0
              lg:h-full
              lg:w-px
              lg:-translate-x-1/2
            "
          />

          {/* ==================================================================
              LEFT / TOP HEADING

              The castle is underneath this layer.

              MOBILE:
                centered at bottom of castle area

              DESKTOP:
                vertically centered inside left half
          =================================================================== */}

          <div
            className="
    absolute
    left-0
    top-0
    z-20
    flex
    h-[48%]
    w-full
    items-end
    justify-center
    px-7
    pb-7
    text-center

    max-sm:items-center
    max-sm:justify-center
    max-sm:pb-0

    sm:px-10
    sm:pb-9

    md:px-14
    md:pb-10

    lg:h-full
    lg:w-1/2
    lg:items-center
    lg:justify-start
    lg:px-10
    lg:pr-14
    lg:pb-0
    lg:text-left

    xl:px-12
    xl:pr-16
  "
          >
            <h3
              className="
                m-0
                w-full
                max-w-[500px]
                font-[var(--font-playpen-sans)]
                text-[clamp(2.7rem,7vw,5.2rem)]
                font-bold
                leading-[0.86]
                tracking-[-0.035em]
                text-white

                sm:max-w-[560px]

                lg:text-[clamp(3rem,5vw,5.2rem)]
              "
            >
              Your Daily Dose of <span className="text-[#FFD54F]">Vitamin L</span>
            </h3>
          </div>

          {/* ==================================================================
              PRODUCT COMPOSITION

              MOBILE:
                centered in lower beige section

              DESKTOP:
                crosses the center seam
          =================================================================== */}

          <div
            className="
              absolute
              left-1/2
              top-[69%]
              z-40
              flex
              h-[50%]
              w-full
              -translate-x-1/2
              -translate-y-1/2
              items-center
              justify-center

              sm:top-[70%]
              sm:h-[52%]

              md:top-[71%]
              md:h-[54%]

              lg:left-1/2
              lg:top-1/2
              lg:h-full
              lg:w-[62%]
              lg:-translate-x-[15%]
              lg:-translate-y-1/2

              xl:w-[61%]
              xl:-translate-x-[14%]

              2xl:w-[60%]
              2xl:-translate-x-[13%]
            "
          >
            {/* ==================================================================
                RAW 3D PRODUCT CARD
            =================================================================== */}

            <div
              key={product._id}
              className="
                relative
                z-20
                w-[54%]
                min-w-0
                max-w-[390px]
                -translate-x-[5%]
                rotate-[-2deg]
                transition-all
                duration-500

                max-sm:w-[75%]
                max-sm:max-w-[430px]
                max-sm:mr-[10%]
                max-sm:mt-

                sm:w-[51%]
                sm:max-w-[430px]
                sm:-translate-x-[5%]

                md:w-[47%]
                md:max-w-[470px]

                lg:w-[74%]
                lg:max-w-[510px]
                lg:-translate-x-[2%]

                xl:w-[75%]
                xl:max-w-[530px]
                xl:ml-[-250px]
              "
            >
              {/* ==============================================================
                  RAW CARD ARTWORK
              ============================================================== */}

              <img
                src="/images/products/card-buzzie-fav-raw-2.png"
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

              {/* ==============================================================
                  BACKEND PRODUCT IMAGE
              ============================================================== */}

              <div
                className="
                p-5
                mr-5
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
                      font-[var(--font-poppins-brand)]
                      text-sm
                      font-bold
                      text-[#24385E]
                    "
                  >
                    {product.name}
                  </div>
                )}
              </div>

              {/* ==============================================================
                  PRODUCT NAME
              ============================================================== */}

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
                  p-3
                  max-sm:-mt-7
                  -mt-14
                    line-clamp-2
                    max-w-full
                    rotate-[-3deg]
                    font-[var(--font-poppins-brand)]
                    text-[clamp(0.72rem,2.5vw,2.04rem)]
                    font-extrabold
                    leading-[0.95]
                    tracking-[-0.035em]
                    text-white
                    drop-shadow-[0_3px_4px_rgba(90,20,35,0.28)]


                    sm:text-[clamp(0.85rem,2.1vw,2.04rem)]

                    xl:text-[clamp(1.05rem,2.25vw,1.50rem)]
                  "
                >
                  {product.name}
                </span>
              </div>
            </div>

            {/* ==================================================================
                RIGHT-SIDE BUTTONS

                WIDTH IS PRESERVED.

                The visual height is increased using scale-y only, so the
                buttons become taller without making the right column wider.

                Longer text gets a narrower inner content area so it can
                naturally wrap into two lines.
            =================================================================== */}

            <div
              className="
                absolute
                right-[5%]
                top-1/2
                z-50
                flex
                w-[20%]
                max-w-[125px]
                -translate-y-1/2
                flex-col
                items-center
                gap-0

                max-sm:right-2
                max-sm:gap-2

                sm:right-[7%]
                sm:w-[19%]
                sm:max-w-[135px]

                md:right-[8%]
                md:w-[18%]
                md:max-w-[145px]

                lg:right-0
                lg:w-[22%]
                lg:max-w-[150px]

                xl:right-[24%]
                xl:gap-5
                xl:max-w-[125px]
              "
            >
              {/* ==============================================================
                  AGE
              ============================================================== */}

              <Link
                href={`/products/${product.slug}`}
                aria-label={`View ${product.name} — ${ageLabel}`}
                className="
                  group
                  relative
                  z-40
                  block
                  w-full
                  origin-center
                  scale-y-[1.22]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:scale-[1.03]
                  hover:scale-y-[1.26]
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
                    px-[3%]
                    text-center
                    font-[var(--font-playpen-sans)]
                    text-[clamp(0.38rem,1.7vw,0.82rem)]
                    font-bold
                    leading-[0.9]
                    tracking-[-0.02em]
                    text-[#17365F]
                  "
                >
                  <span
                    className="
                      block
                      max-w-[62%]
                      text-balance
                    "
                  >
                    {ageLabel}
                  </span>
                </span>
              </Link>

              {/* ==============================================================
                  STOCK
              ============================================================== */}

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
                  origin-center
                  scale-y-[1.22]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:scale-[1.03]
                  hover:scale-y-[1.26]
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
                    px-[3%]
                    text-center
                    font-[var(--font-playpen-sans)]
                    text-[clamp(0.34rem,1.6vw,0.76rem)]
                    font-bold
                    leading-[0.9]
                    tracking-[-0.02em]
                    text-[#125C2A]
                  "
                >
                  <span
                    className="
                      block
                      max-w-[58%]
                      text-balance
                    "
                  >
                    {stockLabel}
                  </span>
                </span>
              </Link>

              {/* ==============================================================
                  FEATURED
              ============================================================== */}

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
                  origin-center
                  scale-y-[1.22]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:scale-[1.03]
                  hover:scale-y-[1.26]
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
                    px-[3%]
                    text-center
                    font-[var(--font-playpen-sans)]
                    text-[clamp(0.38rem,1.7vw,0.82rem)]
                    font-bold
                    leading-[0.9]
                    tracking-[-0.02em]
                    text-[#B90D45]
                  "
                >
                  <span
                    className="
                      block
                      max-w-[62%]
                      text-balance
                    "
                  >
                    {featuredLabel}
                  </span>
                </span>
              </Link>

              {/* ==============================================================
                  WATCH DEMO
              ============================================================== */}

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
                  origin-center
                  scale-y-[1.22]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:scale-[1.03]
                  hover:scale-y-[1.26]
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
                    px-[3%]
                    text-center
                    font-[var(--font-playpen-sans)]
                    text-[clamp(0.36rem,1.65vw,0.78rem)]
                    font-bold
                    leading-[0.9]
                    tracking-[-0.02em]
                    text-[#2E2188]
                  "
                >
                  <span
                    className="
                      block
                      max-w-[58%]
                      text-balance
                    "
                  >
                    Watch Demo
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   MAIN COMPONENT
   ============================================================================ */

export default function ShopByAge({ products }: ShopByAgeProps) {
  return (
    <section
      className="
        relative
        isolate
        w-full
        overflow-hidden
        bg-white
        py-0
      "
    >
      <BuzzieFavorites products={products} />
    </section>
  );
}
