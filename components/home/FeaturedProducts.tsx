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
    left-[calc(50%-50vw)]
    mt-6
    w-screen
    max-w-none
    overflow-hidden
    bg-transparent
    sm:mt-8
    lg:mt-10
        "
      >

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

          {/* Buy now */}
          {activeProduct ? (
            <div
              className="
                absolute
                bottom-[3.5%]
                left-1/2
                -translate-x-1/2
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
  bg-[#FFD54F]
  px-4
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
  sm:px-5
  sm:text-[9px]

  md:min-h-[40px]
  md:px-6
  md:text-[10px]

  lg:min-h-[44px]
  lg:gap-2
  lg:px-7
  lg:text-[11px]

  xl:min-h-[66px]
  xl:px-16
  xl:text-[18px]
"
              >
                <span className="text-black">Buy now</span>

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
                      text-black
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

              Replaced by the Buy Now CTA above. The CTA now occupies the
              bottom-center position of the artwork on every breakpoint.
          ================================================================== */}
        </div>
      </section>
    </Reveal>
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
        bg-[#FFFDFC]
        py-8
        sm:py-10
        lg:py-12
        xl:py-14
      "
    >
      {/* =========================================================
          FULL-SCREEN FEATURED AREA
          Heading + Carousel only
         ========================================================= */}

      <div className="w-full">
        {/* =========================================================
            TOP TEASING HEADING
           ========================================================= */}

        <Reveal>
          <div
            className="
              flex
              w-full
              items-center
              justify-center
              bg-[#C391EE]
              px-4
              py-8
              text-center
              sm:px-8
              sm:py-10
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
                text-[clamp(2.4rem,7vw,5.8rem)]
                font-bold
                uppercase
                leading-[0.84]
                tracking-[-0.035em]
                text-[#111111]
              "
            >
              What Buzzie Day
              <br className="sm:hidden" /> <span className="text-white">Feels like</span>
            </h2>
          </div>
        </Reveal>

        {/* =========================================================
            FULL-SCREEN FEATURED PRODUCTS CAROUSEL
           ========================================================= */}

        <FeaturedProductsCarousel products={products} />
      </div>

      {/* =========================================================
          EVERYTHING BELOW RETURNS TO NORMAL CONTAINER WIDTH
         ========================================================= */}


    </section>
  );
}
