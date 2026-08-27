import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { StorefrontProduct } from "@/types/storefront";

import ProductCard from "@/components/product/ProductCard";

import Reveal from "./Reveal";

interface FeaturedProductsProps {
  products: StorefrontProduct[];
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
              Something they&apos;ll <span className="text-[#E72D5A]">love.</span>
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
            FEATURED PRODUCTS BANNER
           ========================================================= */}

        <Reveal>
          <div
            className="
              relative
              mx-auto
              mt-10
              w-full
              max-w-[1380px]
              overflow-hidden
              rounded-[22px]
              bg-[#F8F3F5]
              shadow-[0_10px_35px_rgba(25,25,25,0.04)]

              sm:mt-12
              sm:rounded-[28px]

              lg:mt-14
              lg:rounded-[34px]
            "
          >
            <Image
              src="/images/banners/featured-products-banner.png"
              alt="Featured BuzzieWorld games, books and learning products"
              width={1920}
              height={700}
              priority
              quality={90}
              sizes="100vw"
              className="
                block
                h-auto
                w-full
                object-cover
              "
            />
          </div>
        </Reveal>

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

{/*
  =========================================================
           FEATURED SECTION — ENDING BANNER
  =========================================================
*/}

<Reveal>
  <div
    className="
      relative
      mx-auto
      mt-12
      w-full
      max-w-[1380px]
      overflow-hidden
      bg-[#F8F3F5]
      shadow-[0_10px_35px_rgba(25,25,25,0.04)]
      sm:mt-14
      lg:mt-16
      xl:mt-14
    "
  >
    <Image
      src="/images/banners/featured-ending-banner-1.png"
      alt="Discover more playful favourites at BuzzieWorld"
      width={1920}
      height={700}
      quality={90}
      sizes="100vw"
      className="
        block
        h-auto
        w-full
        object-cover
      "
    />
  </div>
</Reveal>
      </div>
    </section>
  );
}
