"use client";
import { useState, useRef, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { Heart, ShoppingCart } from "lucide-react";

import type { StorefrontProduct } from "@/types/storefront";
import Reveal from "./Reveal";

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

interface BenefitsStripProps {
  bestsellingProducts?: StorefrontProduct[];
}

/* -------------------------------------------------------------------------- */
/*                                  ASSETS                                    */
/* -------------------------------------------------------------------------- */

const THEMED_STAR = "/images/hero/themed-icons/themed-star-red.png";

/* -------------------------------------------------------------------------- */
/*                               MARQUEE                                      */
/* -------------------------------------------------------------------------- */

const MARQUEE_TEXT =
  "BuzzieWorld - Your Daily Dose of Vitamin L - Where Learning Meets Fun - BuzzieWorld - Your Daily Dose of Vitamin L - Where Learning Meets Fun - BuzzieWorld";
/* -------------------------------------------------------------------------- */
/*                               SHOP BY AGE                                   */
/* -------------------------------------------------------------------------- */

const ageGroups = [
  {
    age: "1–3 YEARS",
    title: "Early Explorers",
    description: "Simple, safe play for little learners.",
    slug: "1-3-years",
    image: "/images/shop-by-age/0-3-removebg-preview.png",
    tone: "#F8D8E5",
    accent: "#E72D5A",
  },
  {
    age: "3–6 YEARS",
    title: "Play & Discover",
    description: "Hands-on fun that sparks imagination.",
    slug: "3-6-years",
    image: "/images/shop-by-age/3+-removebg-preview.png",
    tone: "#F8E5B7",
    accent: "#E99A25",
  },
  {
    age: "6–9 YEARS",
    title: "Learn & Grow",
    description: "Build skills through curiosity and play.",
    slug: "6-9-years",
    image: "/images/shop-by-age/6+-removebg-preview.png",
    tone: "#D9E9B8",
    accent: "#6CA83A",
  },
  {
    age: "9–15 YEARS",
    title: "Think & Master",
    description: "Challenges for curious, growing minds.",
    slug: "9-15-years",
    image: "/images/shop-by-age/8+-removebg-preview.png",
    tone: "#DCD2F3",
    accent: "#7550A5",
  },
] as const;

/* -------------------------------------------------------------------------- */
/*                              MOTION CONFIG                                 */
/* -------------------------------------------------------------------------- */

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* -------------------------------------------------------------------------- */
/*                              DECORATIVE STAR                               */
/* -------------------------------------------------------------------------- */

function DecorativeStar({ className = "", size = 20 }: { className?: string; size?: number }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-[1] ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <Image
        src={THEMED_STAR}
        alt=""
        width={60}
        height={60}
        className="h-full w-full object-contain"
      />
    </div>
  );
}

// Marquee

function BrandMarquee() {
  return (
    <div
      className="
        relative
        w-full
        overflow-hidden
        border-y
        border-[#9E8BCB]/30
        bg-[#A99AD2]
        py-[9px]
        sm:py-[10px]
        xl:py-[18px]
      "
      aria-label={MARQUEE_TEXT}
    >
      <div className="buzzieworld-marquee flex w-max">
        <div className="flex shrink-0 items-center">
          <span
            className="
              whitespace-nowrap
              px-5
              font-[var(--font-poppins-brand)]
              text-[15px]
              font-bold
              tracking-[0.12em]
              text-white
            "
          >
            {MARQUEE_TEXT}
          </span>

          <span
            aria-hidden="true"
            className="
              px-5
              text-[10px]
              font-black
              text-white/70
            "
          >
            •
          </span>
        </div>

        <div className="flex shrink-0 items-center" aria-hidden="true">
          <span
            className="
              whitespace-nowrap
              px-5
              font-[var(--font-poppins-brand)]
              text-[15px]
              font-bold
              tracking-[0.12em]
              text-white
            "
          >
            {MARQUEE_TEXT}
          </span>

          <span
            className="
              px-5
              text-[10px]
              font-black
              text-white/70
            "
          >
            •
          </span>
        </div>
      </div>
    </div>
  );
}
/* -------------------------------------------------------------------------- */
/*                            PRODUCT IMAGE                                    */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                            PRODUCT ARC CARD                                */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                            PRODUCT CAROUSEL CARD                            */
/* -------------------------------------------------------------------------- */

function ProductArcCard({ product }: { product: StorefrontProduct }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const image = product.images?.[0]?.url;

  const imageAlt = product.images?.[0]?.alt || product.name || "BuzzieWorld product";

  const hasDiscount =
    typeof product.compareAtPrice === "number" && product.compareAtPrice > product.price;

  const discount = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const description =
    product.shortDescription || product.description || "A fun pick for curious young minds.";

  const toggleWishlist = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setIsWishlisted((current) => !current);
  };

  return (
    <motion.article variants={cardVariants} className="group min-w-0 w-full">
      <Link
        href={`/products/${product.slug}`}
        aria-label={`View ${product.name}`}
        className="
          block
          w-full
          overflow-hidden
          rounded-[28px]
          bg-white
          shadow-[0_8px_28px_rgba(38,52,81,0.06)]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-[0_14px_38px_rgba(38,52,81,0.11)]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#A99AD2]
          focus-visible:ring-offset-2
          sm:rounded-[30px]
        "
      >
        {/* ------------------------------------------------------------------ */}
        {/* PRODUCT IMAGE                                                      */}
        {/* ------------------------------------------------------------------ */}

        <div
          className="
            relative
            aspect-[1.08/1]
            w-full
            overflow-hidden
            rounded-[50%_50%_0_0]
            bg-[#EEEAF7]
          "
        >
          {/* Purple arc background */}

          <div
            aria-hidden="true"
            className="
              absolute
              inset-0
              bg-[#A99AD2]
            "
          />

          {/* Soft image background */}

          <div
            aria-hidden="true"
            className="
              absolute
              inset-x-0
              bottom-0
              top-[8%]
              rounded-[50%_50%_0_0]
              bg-[#F8F6FB]
            "
          />

          {/* Product image */}

          {image ? (
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="
                (max-width: 639px) 44vw,
                (max-width: 1023px) 44vw,
                (max-width: 1279px) 23vw,
                22vw
              "
              className="
                relative
                z-10
                object-contain
                p-3
                transition-transform
                duration-700
                ease-[cubic-bezier(0.22,1,0.36,1)]
                group-hover:scale-[1.045]
                sm:p-4
              "
            />
          ) : (
            <div
              className="
                absolute
                inset-0
                z-10
                flex
                items-center
                justify-center
                font-[var(--font-poppins-brand)]
                text-xs
                font-bold
                text-[#7A6A91]
              "
            >
              Buzzie Product
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* PRODUCT INFORMATION                                                */}
        {/* ------------------------------------------------------------------ */}

        <div
          className="
            px-4
            pb-4
            pt-3
            sm:px-5
            sm:pb-5
            sm:pt-3.5
          "
        >
          {/* Badges */}

          <div
            className="
              mb-2.5
              flex
              min-h-[22px]
              items-center
              gap-1.5
            "
          >
            {product.featured && (
              <span
                className="
                  inline-flex
                  items-center
                  rounded-full
                  bg-[#F04461]
                  px-2.5
                  py-1
                  font-[var(--font-poppins-brand)]
                  text-[12px]
                  font-extrabold

                  leading-none
                  tracking-[0.01em]
                  text-white
                  sm:text-[9px]
                  lg:text-[12px]
                "
              >
                Bestseller
              </span>
            )}

            {discount > 0 && (
              <span
                className="
                  inline-flex
                  items-center
                  rounded-full
                  bg-[#18243D]
                  px-2.5
                  py-1
                  font-[var(--font-poppins-brand)]
                  text-[8px]
                  font-extrabold
                  leading-none
                  tracking-[0.01em]
                  text-white
                  sm:text-[10px]
                  lg:text-[12px]
                "
              >
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Product name */}

          <h3
            className="
            text-center
              line-clamp-1
              min-h-[18px]
              font-[var(--font-poppins-brand)]
              text-[22px]
              font-bold
              leading-none
              tracking-[0.01em]
              text-[#263451]
              sm:text-[20px]
              lg:text-[22px]

            "
          >
            {product.name}
          </h3>

          {/* Description */}

          <p
            className="
            text-center
              mt-4
              line-clamp-2
              min-h-[34px]
              font-[var(--font-poppins-brand)]
              text-[12px]
              font-semibold
              capitalize
              leading-[1.45]
              tracking-[0.01em]
              text-[#8991A2]
              sm:min-h-[38px]
              sm:text-[10px]
              lg:text-[12px]
              lg:mt-4
            "
          >
            {description}
          </p>

          {/* Price */}

          <div
            className="
              mt-3
              flex
              items-end
              justify-between
              gap-2
              sm:mt-3.5
            "
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span
                  className="
                    font-[var(--font-poppins-brand)]
                    text-[17px]
                    font-extrabold
                    leading-none
                    text-[#263451]
                    sm:text-[18px]
                  "
                >
                  ₹{product.price.toLocaleString("en-IN")}
                </span>

                {hasDiscount && (
                  <span
                    className="
                      font-[var(--font-poppins-brand)]
                      text-[9px]
                      font-medium
                      leading-none
                      text-[#9BA2AF]
                      line-through
                      sm:text-[10px]
                    "
                  >
                    ₹{product.compareAtPrice!.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {discount > 0 && (
                <span
                  className="
                    mt-1
                    block
                    font-[var(--font-poppins-brand)]
                    text-[7px]
                    font-bold
                    uppercase
                    leading-none
                    text-[#F04461]
                    sm:text-[8px]
                  "
                >
                  Save {discount}%
                </span>
              )}
            </div>
          </div>

          {/* Add to cart + wishlist */}

          <div
            className="
              mt-3
              flex
              items-center
              gap-2
              sm:mt-3.5
            "
          >
            <span
              className="
                flex
                min-w-0
                flex-1
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#A99AD2]
                px-3
                py-2.5
                font-[var(--font-poppins-brand)]
                text-[10px]
                font-extrabold
                uppercase
                leading-none
                text-white
                shadow-[0_6px_16px_rgba(169,154,210,0.28)]
                transition-all
                duration-300
                group-hover:bg-[#927FC5]
                sm:py-3
                sm:text-[11px]
              "
            >
              <ShoppingCart aria-hidden="true" className="size-4 shrink-0" strokeWidth={2.2} />

              <span className="truncate">Add to Cart</span>
            </span>

            <button
              type="button"
              aria-label={
                isWishlisted
                  ? `Remove ${product.name} from wishlist`
                  : `Add ${product.name} to wishlist`
              }
              aria-pressed={isWishlisted}
              onClick={toggleWishlist}
              className="
                flex
                size-10
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-[#E6E0EE]
                bg-[#FAF8FC]
                text-[#263451]
                transition-all
                duration-200
                hover:border-[#A99AD2]
                hover:bg-[#F2EEF9]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#A99AD2]
                sm:size-10.5
              "
            >
              <Heart
                aria-hidden="true"
                className="
                  size-4
                  transition-all
                  duration-200
                "
                fill={isWishlisted ? "currentColor" : "none"}
              />
            </button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
/* -------------------------------------------------------------------------- */
/*                            AGE IMAGE                                       */
/* -------------------------------------------------------------------------- */

function AgeImage({ age }: { age: (typeof ageGroups)[number] }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      transition={{
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="min-w-0"
    >
      <Link
        href={`/shop/age/${age.slug}`}
        aria-label={`Shop products for ${age.age}`}
        className="
          group
          relative
          block
          w-full
          overflow-visible
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#E72D5A]
          focus-visible:ring-offset-2
        "
      >
        <Image
          src={age.image}
          alt={age.age}
          width={800}
          height={800}
          sizes="
            (max-width: 639px) 44vw,
            (max-width: 1023px) 30vw,
            23vw
          "
          className="
            block
            h-auto
            w-full
            object-contain
            mix-blend-darken
            transition-transform
            duration-500
            ease-[cubic-bezier(0.22,1,0.36,1)]
            group-hover:scale-[1.045]
          "
        />
      </Link>
    </motion.div>
  );
}
/* -------------------------------------------------------------------------- */
/*                            PRODUCT CAROUSEL                                 */
/* -------------------------------------------------------------------------- */

function ProductCarousel({ products }: { products: StorefrontProduct[] }) {
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const desktopVisibleCount = Math.min(products.length, 4);
  const mobileVisibleCount = Math.min(products.length, 2);

  const getCarouselCardClass = () => {
    const classes = ["snap-start", "shrink-0"];

    if (mobileVisibleCount <= 1) {
      classes.push("w-full", "min-w-full");
    } else {
      classes.push(
        "w-[calc((100%_-_16px)/2)]",
        "min-w-[calc((100%_-_16px)/2)]",
        "sm:w-[calc((100%_-_20px)/2)]",
        "sm:min-w-[calc((100%_-_20px)/2)]",
      );
    }

    if (desktopVisibleCount <= 1) {
      classes.push("lg:w-full", "lg:min-w-full");
      classes.push("xl:w-full", "xl:min-w-full");
    } else if (desktopVisibleCount === 2) {
      classes.push(
        "lg:w-[calc((100%_-_24px)/2)]",
        "lg:min-w-[calc((100%_-_24px)/2)]",
        "xl:w-[calc((100%_-_28px)/2)]",
        "xl:min-w-[calc((100%_-_28px)/2)]",
      );
    } else if (desktopVisibleCount === 3) {
      classes.push(
        "lg:w-[calc((100%_-_48px)/3)]",
        "lg:min-w-[calc((100%_-_48px)/3)]",
        "xl:w-[calc((100%_-_56px)/3)]",
        "xl:min-w-[calc((100%_-_56px)/3)]",
      );
    } else {
      classes.push(
        "lg:w-[calc((100%_-_72px)/4)]",
        "lg:min-w-[calc((100%_-_72px)/4)]",
        "xl:w-[calc((100%_-_84px)/4)]",
        "xl:min-w-[calc((100%_-_84px)/4)]",
      );
    }

    return classes.join(" ");
  };

  useEffect(() => {
    const container = carouselRef.current;

    if (!container || products.length <= 2) {
      return;
    }

    let intervalId: ReturnType<typeof setInterval> | null = null;
    let restartTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const stopAutoPlay = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const advance = () => {
      if (!container) return;

      const firstCard = container.querySelector<HTMLElement>("[data-product-card]");

      if (!firstCard) return;

      const cardWidth = firstCard.getBoundingClientRect().width;
      const styles = window.getComputedStyle(container);
      const gap = parseFloat(styles.columnGap || styles.gap || "0");
      const step = cardWidth + gap;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (maxScroll <= 4) {
        return;
      }

      const current = container.scrollLeft;
      const next = current + step;

      if (next >= maxScroll - 4) {
        container.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        container.scrollTo({
          left: next,
          behavior: "smooth",
        });
      }
    };

    const startAutoPlay = () => {
      stopAutoPlay();
      intervalId = setInterval(advance, 4500);
    };

    const handleTouchStart = () => {
      stopAutoPlay();

      if (restartTimeoutId) {
        clearTimeout(restartTimeoutId);
      }

      restartTimeoutId = setTimeout(() => {
        startAutoPlay();
      }, 5000);
    };

    startAutoPlay();

    container.addEventListener("mouseenter", stopAutoPlay);
    container.addEventListener("mouseleave", startAutoPlay);
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });

    return () => {
      stopAutoPlay();

      if (restartTimeoutId) {
        clearTimeout(restartTimeoutId);
      }

      container.removeEventListener("mouseenter", stopAutoPlay);
      container.removeEventListener("mouseleave", startAutoPlay);
      container.removeEventListener("touchstart", handleTouchStart);
    };
  }, [products.length]);

  return (
    <div className="relative mt-12">
      <motion.div
        ref={carouselRef}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.12,
        }}
        aria-label="Featured BuzzieWorld products"
        className="
          flex
          snap-x
          snap-mandatory
          gap-4
          overflow-x-auto
          overscroll-x-contain
          pb-5
          scrollbar-none
          sm:gap-5
          lg:gap-6
          xl:gap-7
        "
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {products.map((product) => (
          <div key={product._id} data-product-card className={getCarouselCardClass()}>
            <ProductArcCard product={product} />
          </div>
        ))}
      </motion.div>

      {products.length > mobileVisibleCount && (
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            mt-1
            flex
            items-center
            justify-center
            gap-1.5
            lg:hidden
          "
        >
          <span className="h-1 w-5 rounded-full bg-[#A99AD2]" />
          <span className="size-1 rounded-full bg-[#D9D1E8]" />
          <span className="size-1 rounded-full bg-[#D9D1E8]" />
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            MAIN COMPONENT                                  */
/* -------------------------------------------------------------------------- */

export default function BenefitsStrip({ bestsellingProducts = [] }: BenefitsStripProps) {
  const products = bestsellingProducts.slice(0, 12);

  return (
    <section
      className="
        relative
        z-10
        overflow-hidden
        bg-[#FFFFFF]
        pb-12
        pt-0
        sm:pb-16
        lg:pb-20
      "
    >
      {/* ================================================================== */}
      {/* MARQUEE                                                           */}
      {/* ================================================================== */}

      <BrandMarquee />

      <div
        className="
          mx-auto
          w-full
          max-w-[1380px]
          px-4
          sm:px-6
          lg:px-8
          xl:px-10
        "
      >
        {/* ================================================================ */}
        {/* BUZZIE PRODUCTS                                                 */}
        {/* ================================================================ */}

        <Reveal>
          <div
            className="
              relative
              pt-8
              sm:pt-10
              lg:pt-12
            "
          >
            {/* Decorative stars */}
            <DecorativeStar
              className="
                left-[3%]
                top-[15%]
                rotate-[-8deg]
                opacity-35
                sm:left-[5%]
              "
              size={16}
            />
            <DecorativeStar
              className="
                right-[4%]
                top-[20%]
                rotate-[12deg]
                opacity-30
              "
              size={14}
            />
            {/* ------------------------------------------------------------ */}
            {/* HEADING                                                      */}
            {/* ------------------------------------------------------------ */}
            <div
              className="
    relative
    z-20
    flex
    flex-col
    items-center
    text-center
  "
            >
              {/* Eyebrow */}
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
        font-[var(--font-poppins-brand)]
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

              {/* ---------------------------------------------------------- */}
              {/* MAIN HEADING + ARROW                                       */}
              {/* ---------------------------------------------------------- */}

              <div
                className="
      flex
      w-full
      items-end
      justify-center
    "
              >
                <h2
                  className="
        m-0
        font-[var(--font-poppins-brand)]
        text-[clamp(3.4rem,11vw,5.8rem)]
        font-bold
        uppercase
        leading-[0.82]
        tracking-[-0.025em]
        text-[#111111]
      "
                >
                  Buzzie <span className="text-[#FF5558]">Products</span>
                </h2>

                {/* Arrow */}
                <div
                  aria-hidden="true"
                  className="
        ml-3
        mb-[-2px]
        shrink-0
        sm:ml-3.5
        sm:mb-[-1px]
      "
                >
                  <svg
                    width="76"
                    height="64"
                    viewBox="0 0 92 76"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-auto w-[54px] sm:w-[66px] lg:w-[76px]"
                  >
                    <path
                      d="
            M7 10
            C17 5 28 5 38 8
            C51 11 62 19 68 30
            C74 41 75 53 72 64
          "
                      stroke="#FF5558"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <path
                      d="
            M61 55
            C65 59 68 62 72 66
            C75 62 78 58 81 54
          "
                      stroke="#FF5558"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {products.length > 0 ? (
              <ProductCarousel products={products} />
            ) : (
              <div
                className="
      mx-auto
      mt-6
      max-w-[900px]
      rounded-[28px]
      bg-white
      px-6
      py-12
      text-center
      shadow-[0_10px_40px_rgba(23,33,61,0.04)]
    "
              >
                <p
                  className="
        font-[var(--font-poppins-brand)]
        text-sm
        font-semibold
        text-[#687489]
      "
                >
                  Our little collection is getting ready.
                </p>
              </div>
            )}
          </div>
        </Reveal>

        {/* ================================================================ */}
        {/* SHOP BY AGE                                                     */}
        {/* ================================================================ */}

        <Reveal>
          <div
            className="
              relative
              mt-14
              px-0
              py-7
              sm:mt-18
              sm:py-9
              lg:mt-22
              lg:py-11
            "
          >
            {/* ------------------------------------------------------------ */}
            {/* SHOP BY AGE HEADING                                          */}
            {/* ------------------------------------------------------------ */}

            <div
              className="
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
                    font-[var(--font-poppins-brand)]
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.18em]
                    text-[#E72D5A]
                    sm:text-[10px]
                    xl:text-[12px]
                  "
                >
                  Find their next
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
                Shop By <span className="text-[#FF5558]">Age</span>
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

            {/* ------------------------------------------------------------ */}
            {/* AGE IMAGES                                                   */}
            {/* ------------------------------------------------------------ */}

            <div
              className="
                relative
                z-30
                mt-7
                sm:mt-8
                lg:mt-9
                xl:mt-10

              "
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.12,
                }}
                className="
                  grid
                  grid-cols-2
                  gap-4
                  sm:grid-cols-2
                  sm:gap-5
                  lg:grid-cols-4
                  lg:gap-5
                  xl:gap-6

                "
              >
                {ageGroups.map((age) => (
                  <AgeImage key={age.slug} age={age} />
                ))}
              </motion.div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
