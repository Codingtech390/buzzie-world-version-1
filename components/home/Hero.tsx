"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Play,
  Search,
  Star,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

/* ==========================================================================
   TYPES
========================================================================== */

interface HeroProduct {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  price?: number;
  compareAtPrice?: number;
  rating?: number;
  reviewCount?: number;
}

interface HeroProps {
  products: HeroProduct[];
}
interface ProductsResponse {
  success?: boolean;
  products?: HeroProduct[];
  data?: {
    products?: HeroProduct[];
  };
}

interface HeroSlide {
  id: string;
  productName: string;
  title: string;
  highlight?: string;
  description: string;
  image: string;
  imageAlt: string;
  href: string;
  price?: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
}

/* ==========================================================================
   BRAND PALETTE
==========================================================================

   BuzzieWorld logo-derived palette:

   Primary     Sky Blue   #4ED3F6
   Secondary   Lavender   #C391EE
   Accent      Crimson    #E83D59
   Neutral     Navy       #26345C
========================================================================== */

const BRAND = {
  sky: "#4ED3F6",
  skyBorder: "#33BCDF",

  lavender: "#C391EE",
  lavenderBorder: "#B074E4",

  crimson: "#E83D59",
  crimsonBorder: "#D32B47",

  navy: "#26345C",
};

/* ==========================================================================
   HERO COPY
========================================================================== */

const HERO_COPY = [
  {
    title: "Big ideas begin with",
    highlight: "little hands.",
    description:
      "A hands-on science activity kit that introduces children to exciting experiments and scientific thinking.",
  },
  {
    title: "Little adventures",
    highlight: "start here.",
    description:
      "A creative art set with colorful materials designed to let children draw, paint and create their own masterpieces.",
  },
  {
    title: "Play. Imagine.",
    highlight: "Discover.",
    description:
      "Colorful magnetic building blocks designed to encourage creativity, spatial thinking and imaginative play.",
  },
];

/* ==========================================================================
   HERO ASSETS
========================================================================== */

const THEME = {
  /*
   * Optimized version of the original 1536x1024 hero artwork.
   */
  background: "/images/hero/hero-bg.webp",

  /*
   * Original paper composition.
   * This remains above the background and behind the product.
   */
  paper: "/images/hero/home-paper.png",

  /*
   * Existing product artwork.
   * Product metadata still comes from the backend.
   */
  products: [
    "/images/products/car-logo-1.png",
    "/images/products/logo-lblitz-1.png",
    "/images/products/brain-binder-1.png",
  ],

  /*
   * Existing themed buttons.
   */
  buttons: {
    blue: "/images/hero/themed-buttons/themed-blue-button.png",
    yellow:
      "/images/hero/themed-buttons/themed-yellow-button.png",
    red: "/images/hero/themed-buttons/themed-red-button.png",
    violet:
      "/images/hero/themed-buttons/themed-violet-button.png",
  },

  /*
   * Existing themed navigation icons.
   */
  icons: {
    leftArrow:
      "/images/hero/themed-icons/themed-left-arrow.png",
    rightArrow:
      "/images/hero/themed-icons/themed-right-arrow.png",
    star:
      "/images/hero/themed-icons/themed-star-red.png",
    moon:
      "/images/hero/themed-icons/themed-moon.png",
  },
};

/* ==========================================================================
   HELPERS
========================================================================== */

function getProducts(
  payload: ProductsResponse,
): HeroProduct[] {
  if (Array.isArray(payload.products)) {
    return payload.products;
  }

  if (Array.isArray(payload.data?.products)) {
    return payload.data.products;
  }

  return [];
}

function createSlides(
  products: HeroProduct[],
): HeroSlide[] {
  return products
    .slice(0, THEME.products.length)
    .map((product, index) => {
      const copy =
        HERO_COPY[index % HERO_COPY.length];

      return {
        id: product._id,
        productName: product.name,
        title: copy.title,
        highlight: copy.highlight,
        description:
          product.description?.trim() ||
          copy.description,
        image: THEME.products[index],
        imageAlt: product.name,
        href: `/products/${
          product.slug ?? product._id
        }`,
        price: product.price,
        compareAtPrice:
          product.compareAtPrice,
        rating: product.rating ?? 4.8,
        reviewCount:
          product.reviewCount ?? 0,
      };
    });
}

function formatPrice(price?: number) {
  if (typeof price !== "number") {
    return "";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

/* ==========================================================================
   HERO BACKGROUND
==========================================================================

   IMPORTANT:

   - WebP version of the original artwork
   - No overlay
   - No opacity
   - No blur
   - No brightness filter
   - No gradient
   - Loaded with high priority
========================================================================== */

function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        z-0
        overflow-hidden
      "
    >
      <Image
        src={THEME.background}
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={90}
        className="
          h-full
          w-full
          object-cover
          object-[center_15%]
        "
      />
    </div>
  );
}

/* ==========================================================================
   HERO COMPONENT
========================================================================== */

export default function Hero({ products }: HeroProps) {
  const [slides, setSlides] = useState<HeroSlide[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);

  const [direction, setDirection] = useState(1);

  const [loading, setLoading] = useState(true);

  const [paused, setPaused] = useState(false);

  const activeSlide = slides[activeIndex];

  /* ========================================================================
     NEXT SLIDE
  ======================================================================== */

  const nextSlide = useCallback(() => {
    if (slides.length < 2) {
      return;
    }

    setDirection(1);

    setActiveIndex((current) => (current + 1) % slides.length);
  }, [slides.length]);

  /* ========================================================================
     PREVIOUS SLIDE
  ======================================================================== */

  const previousSlide = useCallback(() => {
    if (slides.length < 2) {
      return;
    }

    setDirection(-1);

    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  }, [slides.length]);

  /* ========================================================================
     LOAD FEATURED PRODUCTS
  ======================================================================== */

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);

        const response = await fetch("/api/products?featured=true&limit=5", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load featured products");
        }

        const payload = (await response.json()) as ProductsResponse;

        const products = getProducts(payload);

        const heroSlides = createSlides(products);

        if (!cancelled) {
          setSlides(heroSlides);
          setActiveIndex(0);
        }
      } catch (error) {
        console.error("Hero products error:", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ========================================================================
     AUTOPLAY
  ======================================================================== */

  useEffect(() => {
    if (slides.length < 2 || paused) {
      return;
    }

    const interval = window.setInterval(nextSlide, 6500);

    return () => window.clearInterval(interval);
  }, [slides.length, paused, nextSlide]);

  /* ========================================================================
     LOADING STATE
  ======================================================================== */

  if (loading) {
    return (
      <section
        className="
          relative
          min-h-[500px]
          overflow-hidden
          bg-[#FFFDF9]
          sm:min-h-[540px]
          lg:min-h-[500px]
          xl:min-h-[560px]
        "
      >
        <HeroBackground />

        <div
          className="
            relative
            z-20
            flex
            min-h-[500px]
            items-center
            justify-center
            sm:min-h-[540px]
            lg:min-h-[500px]
            xl:min-h-[560px]
          "
        >
          <div
            className="
              size-9
              animate-spin
              rounded-full
              border-2
              border-[#26345C]/15
              border-t-[#4ED3F6]
            "
          />
        </div>
      </section>
    );
  }

  /* ========================================================================
     FALLBACK STATE
  ======================================================================== */

  if (!activeSlide) {
    return (
      <section
        className="
          relative
          min-h-[500px]
          overflow-hidden
          bg-[#FFFDF9]
          sm:min-h-[540px]
          lg:min-h-[500px]
          xl:min-h-[560px]
        "
      >
        <HeroBackground />

        <div
          className="
            relative
            z-20
            flex
            min-h-[500px]
            items-center
            justify-center
            px-6
            text-center
            sm:min-h-[540px]
            lg:min-h-[500px]
            xl:min-h-[560px]
          "
        >
          <div
            className="
              rounded-2xl
              border
              border-white/80
              bg-white/70
              px-6
              py-4
              shadow-[0_12px_30px_rgba(38,52,92,0.12)]
              backdrop-blur-sm
            "
          >
            <p
              className="
                font-[var(--font-poppins)]
                text-sm
                font-medium
                text-[#26345C]/70
              "
            >
              Featured products are currently unavailable.
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* ========================================================================
     MAIN HERO
  ======================================================================== */

  return (
    <section
      className="
        relative
        isolate
        overflow-hidden
        bg-[#FFFDF9]
        font-[var(--font-poppins)]
      "
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ==================================================================
          BACKGROUND
      =================================================================== */}

      <HeroBackground />

      {/* ==================================================================
          MAIN CONTENT
      =================================================================== */}

      <div
        className="
          relative
          z-20
          mx-auto
          flex
          min-h-[650px]
          w-full
          max-w-[1440px]
          items-center
          px-5
          py-10
          sm:min-h-[680px]
          sm:px-7
          md:px-10
          lg:min-h-[620px]
          lg:px-12
          lg:py-8
          xl:min-h-[650px]
          xl:px-16
          2xl:px-20
        "
      >
        <div
          className="
            grid
            w-full
            grid-cols-1
            items-center
            gap-4
            lg:grid-cols-[44%_56%]
            lg:gap-0
          "
        >
          {/* ==============================================================
              LEFT CONTENT
          =============================================================== */}

          <div
            className="
              relative
              z-50
              flex
              items-center
              lg:min-h-[450px]
              lg:translate-y-[12px]
              lg:pl-4
              xl:translate-y-[16px]
              xl:pl-8
            "
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeSlide.id}
                initial={{
                  opacity: 0,
                  x: direction > 0 ? 24 : -24,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: direction > 0 ? -24 : 24,
                }}
                transition={{
                  duration: 0.48,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  mx-auto
                  w-full
                  max-w-[560px]
                  lg:mx-0
                "
              >
                {/* ======================================================
                    EYEBROW
                ======================================================= */}

                <div
                  className="
                    mb-4
                    flex
                    items-center
                    gap-2
                  "
                >
                  <span
                    className="
                      h-[2px]
                      w-7
                      rounded-full
                      bg-[#4ED3F6]
                      sm:w-9
                    "
                  />

                  <span
                    className="
                      text-[8px]
                      font-extrabold
                      uppercase
                      tracking-[0.25em]
                      text-[#26345C]/70
                      sm:text-[9px]
                      lg:text-[10px]
                    "
                  >
                    BuzzieWorld
                  </span>

                  <span
                    className="
                      size-1.5
                      rounded-full
                      bg-[#E83D59]
                    "
                  />
                </div>

                {/* ======================================================
                    TITLE
                ======================================================= */}

                <h1
                  className="
                    max-w-[570px]
                    font-[var(--font-roboto)]
                    text-[clamp(2.7rem,7vw,4.5rem)]
                    font-black
                    leading-[0.94]
                    tracking-[-0.055em]
                    text-[#26345C]
                    drop-shadow-[0_2px_0_rgba(255,255,255,0.65)]
                    sm:text-[clamp(3.2rem,6vw,4.7rem)]
                    lg:text-[clamp(3rem,4vw,4.25rem)]
                    xl:text-[4.2rem]
                  "
                >
                  {activeSlide.title}{" "}
                  {activeSlide.highlight && (
                    <span className="text-[#E83D59]">{activeSlide.highlight}</span>
                  )}
                </h1>

                {/* ======================================================
                    DESCRIPTION
                ======================================================= */}

                <p
                  className="
                    mt-5
                    max-w-[445px]
                    font-[var(--font-poppins)]
                    text-[0.78rem]
                    font-medium
                    leading-[1.65]
                    text-[#26345C]/75
                    sm:text-sm
                    sm:leading-6
                    lg:text-[0.87rem]
                  "
                >
                  {activeSlide.description}
                </p>

                {/* ======================================================
                    DECORATIVE DIVIDER
                ======================================================= */}

                <div
                  className="
                    my-5
                    flex
                    items-center
                    gap-2
                  "
                >
                  <span
                    className="
                      h-[2px]
                      w-8
                      rounded-full
                      bg-[#4ED3F6]/60
                    "
                  />

                  <span
                    className="
                      size-1.5
                      rounded-full
                      bg-[#C391EE]
                    "
                  />

                  <span
                    className="
                      h-[2px]
                      w-14
                      rounded-full
                      bg-[#26345C]/15
                    "
                  />
                </div>

                {/* ======================================================
                    CTA + PRICE
                ======================================================= */}

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-4
                  "
                >
                  <Link
                    href={activeSlide.href}
                    className="
                      group
                      relative
                      inline-flex
                      min-h-11
                      items-center
                      gap-2
                      overflow-hidden
                      rounded-full
                      border
                      border-[#33BCDF]
                      bg-[#4ED3F6]
                      px-5
                      font-[var(--font-poppins)]
                      text-[10px]
                      font-extrabold
                      text-[#26345C]
                      shadow-[0_8px_22px_rgba(78,211,246,0.28),inset_0_1px_0_rgba(255,255,255,0.55)]
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:bg-[#63D9F7]
                      sm:px-6
                      sm:text-[11px]
                      lg:text-[14px]
                    "
                  >
                    <span
                      className="
                        absolute
                        inset-y-0
                        -left-10
                        w-8
                        rotate-[20deg]
                        bg-white/35
                        blur-sm
                        transition-transform
                        duration-700
                        group-hover:translate-x-[180px]
                      "
                    />

                    <span className="relative">Discover Product</span>

                    <ArrowRight
                      size={14}
                      strokeWidth={2.5}
                      className="
                        relative
                        transition-transform
                        duration-300
                        group-hover:translate-x-0.5
                      "
                    />
                  </Link>

                  {activeSlide.price !== undefined && (
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <div
                        className="
                          h-8
                          w-px
                          bg-[#26345C]/15
                        "
                      />

                      <div>
                        <span
                          className="
                            block
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-[0.14em]
                            text-[#26345C]/45
                            lg:text-[12px]
                          "
                        >
                          From
                        </span>

                        <div
                          className="
                            flex
                            items-baseline
                            gap-1.5
                          "
                        >
                          <span
                            className="
                              font-[var(--font-roboto)]
                              text-base
                              font-extrabold
                              text-[#26345C]
                              lg:text-[16px]
                            "
                          >
                            {formatPrice(activeSlide.price)}
                          </span>

                          {activeSlide.compareAtPrice &&
                            activeSlide.compareAtPrice > activeSlide.price && (
                              <span
                                className="
                                  text-[10px]
                                  font-semibold
                                  text-[#26345C]/40
                                  line-through
                                  lg:text-[12px]
                                "
                              >
                                {formatPrice(activeSlide.compareAtPrice)}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* ======================================================
                    TRUST LINE
                ======================================================= */}

                <div
                  className="
                    mt-4
                    flex
                    items-center
                    gap-2
                    text-[#26345C]/60
                  "
                >
                  <span
                    className="
                      flex
                      size-5
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#4ED3F6]/45
                      bg-white/60
                    "
                  >
                    <span
                      className="
                        size-1.5
                        rounded-full
                        bg-[#4ED3F6]
                      "
                    />
                  </span>

                  <span
                    className="
                      text-[10px]
                      font-bold
                      sm:text-[9px]
                      lg:text-[11px]
                    "
                  >
                    Made for curious little minds
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ==============================================================
              RIGHT PRODUCT COMPOSITION
          =============================================================== */}

          <div
            className="
              relative
              z-40
              mt-3
              min-h-[340px]
              sm:min-h-[390px]
              md:min-h-[420px]
              lg:mt-0
              lg:min-h-[450px]
              xl:min-h-[500px]
            "
          >
            {/* ==========================================================
                PAPER BACKGROUND
            =========================================================== */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                left-[4%]
                right-[4%]
                top-[5%]
                bottom-[2%]
                z-10
                sm:left-[3%]
                sm:right-[3%]
                lg:left-[-2%]
                lg:right-[-2%]
                lg:top-[2%]
                lg:bottom-[-2%]
                xl:left-[-4%]
                xl:right-[-4%]
              "
            >
              <Image
                src={THEME.paper}
                alt=""
                aria-hidden="true"
                width={1200}
                height={900}
                priority
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 55vw, 60vw"
                className="
                  block
                  h-full
                  w-full
                  select-none
                  object-contain
                  object-center
                  drop-shadow-[0_20px_32px_rgba(38,52,92,0.18)]
                "
              />
            </div>

            {/* ==========================================================
                FEATURED PRODUCT
            =========================================================== */}

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeSlide.id}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.94,
                  y: -6,
                }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  absolute
                  inset-0
                  z-30
                "
              >
                <div
                  className="
                    absolute
                    left-[9%]
                    right-[24%]
                    top-[13%]
                    bottom-[11%]
                    flex
                    items-center
                    justify-center
                    sm:left-[9%]
                    sm:right-[23%]
                    sm:top-[11%]
                    sm:bottom-[10%]
                    lg:left-[10%]
                    lg:right-[24%]
                    lg:top-[12%]
                    lg:bottom-[12%]
                    xl:left-[10%]
                    xl:right-[23%]
                    xl:top-[10%]
                    xl:bottom-[10%]
                  "
                >
                  <Image
                    src={activeSlide.image}
                    alt={activeSlide.imageAlt}
                    width={900}
                    height={900}
                    unoptimized
                    sizes="(max-width: 640px) 60vw, (max-width: 1024px) 45vw, 40vw"
                    className="
                      block
                      h-auto
                      max-h-full
                      w-auto
                      max-w-full
                      object-contain
                      drop-shadow-[0_24px_22px_rgba(38,52,92,0.25)]
                      transition-transform
                      duration-500
                      hover:scale-[1.015]
                    "
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* ==========================================================
                SIDE CONTROLS
            =========================================================== */}

            <div
              className="
                absolute
                right-[1%]
                top-[25%]
                z-50
                flex
                w-[72px]
                flex-col
                gap-1.5
                sm:right-[1%]
                sm:w-[82px]
                sm:gap-2
                md:w-[92px]
                lg:right-[3%]
                lg:top-[26%]
                lg:w-[90px]
                xl:right-[2.5%]
                xl:top-[25%]
                xl:w-[96px]
              "
            >
              {/* ========================================================
                  OVERVIEW
              ========================================================= */}

              <button
                type="button"
                className="
                  group
                  relative
                  block
                  w-full
                  transition-transform
                  duration-200
                  hover:scale-105
                  active:scale-95
                "
              >
                <Image
                  src={THEME.buttons.blue}
                  alt=""
                  width={400}
                  height={120}
                  sizes="96px"
                  className="
                    block
                    h-auto
                    w-full
                  "
                />

                <span
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    font-[var(--font-poppins)]
                    text-[6px]
                    font-bold
                    text-white
                    sm:text-[7px]
                    lg:text-[8px]
                  "
                >
                  Overview
                </span>
              </button>

              {/* ========================================================
                  DETAILS
              ========================================================= */}

              <Link
                href={activeSlide.href}
                className="
                  relative
                  block
                  w-full
                  transition-transform
                  duration-200
                  hover:scale-105
                  active:scale-95
                "
              >
                <Image
                  src={THEME.buttons.yellow}
                  alt=""
                  width={400}
                  height={120}
                  sizes="96px"
                  className="
                    block
                    h-auto
                    w-full
                  "
                />

                <span
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    gap-1
                    font-[var(--font-poppins)]
                    text-[6px]
                    font-bold
                    text-[#26324c]
                    sm:text-[7px]
                    lg:text-[8px]
                  "
                >
                  <Search size={8} />
                  Details
                </span>
              </Link>

              {/* ========================================================
                  RATING
              ========================================================= */}

              <div
                className="
                  relative
                  block
                  w-full
                "
              >
                <Image
                  src={THEME.buttons.red}
                  alt=""
                  width={400}
                  height={120}
                  sizes="96px"
                  className="
                    block
                    h-auto
                    w-full
                  "
                />

                <span
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    gap-1
                    font-[var(--font-poppins)]
                    text-[6px]
                    font-bold
                    text-white
                    sm:text-[7px]
                    lg:text-[8px]
                  "
                >
                  <Star size={8} fill="currentColor" />

                  {activeSlide.rating.toFixed(1)}
                </span>
              </div>

              {/* ========================================================
                  DEMO
              ========================================================= */}

              <button
                type="button"
                className="
                  relative
                  block
                  w-full
                  transition-transform
                  duration-200
                  hover:scale-105
                  active:scale-95
                "
              >
                <Image
                  src={THEME.buttons.violet}
                  alt=""
                  width={400}
                  height={120}
                  sizes="96px"
                  className="
                    block
                    h-auto
                    w-full
                  "
                />

                <span
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    gap-1
                    font-[var(--font-poppins)]
                    text-[6px]
                    font-bold
                    text-white
                    sm:text-[7px]
                    lg:text-[8px]
                  "
                >
                  <Play size={8} fill="currentColor" />
                  Demo
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* ================================================================
            DESKTOP PREVIOUS
        ================================================================= */}

        <button
          type="button"
          onClick={previousSlide}
          aria-label="Previous featured product"
          className="
            absolute
            left-[1.2%]
            top-1/2
            z-[100]
            hidden
            -translate-y-1/2
            transition-transform
            duration-200
            hover:scale-110
            active:scale-95
            sm:block
            lg:left-[1.5%]
            xl:left-[1.2%]
          "
        >
          <Image
            src={THEME.icons.leftArrow}
            alt=""
            width={80}
            height={80}
            sizes="44px"
            className="
              h-auto
              w-8
              sm:w-9
              md:w-10
              lg:w-10
              xl:w-11
            "
          />
        </button>

        {/* ================================================================
            DESKTOP NEXT
        ================================================================= */}

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next featured product"
          className="
            absolute
            right-[1.2%]
            top-1/2
            z-[100]
            hidden
            -translate-y-1/2
            transition-transform
            duration-200
            hover:scale-110
            active:scale-95
            sm:block
            lg:right-[1.5%]
            xl:right-[1.2%]
          "
        >
          <Image
            src={THEME.icons.rightArrow}
            alt=""
            width={80}
            height={80}
            sizes="44px"
            className="
              h-auto
              w-8
              sm:w-9
              md:w-10
              lg:w-10
              xl:w-11
            "
          />
        </button>

        {/* ================================================================
            SLIDE INDICATORS
        ================================================================= */}

        <div
          className="
            absolute
            bottom-7
            left-1/2
            z-[120]
            flex
            -translate-x-1/2
            items-center
            gap-2
          "
        >
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1);

                setActiveIndex(index);
              }}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeIndex}
              className="
                  group
                  flex
                  size-4
                  items-center
                  justify-center
                "
            >
              <span
                className={`
                    block
                    rounded-full
                    transition-all
                    duration-300
                    ${
                      index === activeIndex
                        ? "h-2.5 w-2.5 bg-[#E83D59] shadow-[0_0_8px_rgba(232,61,89,0.35)]"
                        : "size-2 bg-[#26345C]/30 group-hover:bg-[#4ED3F6]"
                    }
                  `}
              />
            </button>
          ))}
        </div>

        {/* ================================================================
            MOBILE NAVIGATION
        ================================================================= */}

        <div
          className="
            absolute
            bottom-4
            left-4
            right-4
            z-[130]
            flex
            items-center
            justify-between
            sm:hidden
          "
        >
          <button
            type="button"
            onClick={previousSlide}
            aria-label="Previous featured product"
            className="
              flex
              size-9
              items-center
              justify-center
              rounded-full
              border
              border-white
              bg-white/90
              shadow-lg
              backdrop-blur
            "
          >
            <Image
              src={THEME.icons.leftArrow}
              alt=""
              width={60}
              height={60}
              sizes="24px"
              className="w-6"
            />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next featured product"
            className="
              flex
              size-9
              items-center
              justify-center
              rounded-full
              border
              border-white
              bg-white/90
              shadow-lg
              backdrop-blur
            "
          >
            <Image
              src={THEME.icons.rightArrow}
              alt=""
              width={60}
              height={60}
              sizes="24px"
              className="w-6"
            />
          </button>
        </div>
      </div>

      {/* ==================================================================
          SOFT BOTTOM EDGE
      =================================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-px
          left-[-2%]
          z-[140]
          h-5
          w-[104%]
          rounded-[50%_50%_0_0]
          bg-[#FFFDF9]
        "
      />
    </section>
  );
}
