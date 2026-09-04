"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

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
  "BUZZIEWORLD - YOUR DAILY DOSE OF VITAMIN L - WHERE LEARNING MEETS FUN - BUZZIEWORLD - YOUR DAILY DOSE OF VITAMIN L - WHERE LEARNING ME";

/* -------------------------------------------------------------------------- */
/*                               SHOP BY AGE                                   */
/* -------------------------------------------------------------------------- */

const ageGroups = [
  {
    age: "1–3 YEARS",
    title: "Early Explorers",
    description: "Simple, safe play for little learners.",
    slug: "1-3-years",
    image: "/images/shop-by-age/0-3-1.png",
    tone: "#F8D8E5",
    accent: "#E72D5A",
  },
  {
    age: "3–6 YEARS",
    title: "Play & Discover",
    description: "Hands-on fun that sparks imagination.",
    slug: "3-6-years",
    image: "/images/shop-by-age/3+.png",
    tone: "#F8E5B7",
    accent: "#E99A25",
  },
  {
    age: "6–9 YEARS",
    title: "Learn & Grow",
    description: "Build skills through curiosity and play.",
    slug: "6-9-years",
    image: "/images/shop-by-age/6+.png",
    tone: "#D9E9B8",
    accent: "#6CA83A",
  },
  {
    age: "9–15 YEARS",
    title: "Think & Master",
    description: "Challenges for curious, growing minds.",
    slug: "9-15-years",
    image: "/images/shop-by-age/8+.png",
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

/* -------------------------------------------------------------------------- */
/*                              MARQUEE                                       */
/* -------------------------------------------------------------------------- */

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
              font-[var(--font-roboto)]
              text-[13px]
              font-bold
              uppercase
              tracking-[0.12em]
              text-white
              sm:text-[10px]
              md:text-[11px]
              lg:text-[13px]
              xl:text-[13px]
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
              font-[var(--font-roboto)]
              text-[9px]
              font-bold
              uppercase
              tracking-[0.12em]
              text-white
              sm:text-[10px]
              md:text-[11px]
              lg:text-[13px]
              xl:text-[13px]
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

function ProductArcCard({ product, index }: { product: StorefrontProduct; index: number }) {
  const image = product.images?.[0]?.url;
  const imageAlt = product.images?.[0]?.alt || product.name || "BuzzieWorld product";

  const hasDiscount =
    typeof product.compareAtPrice === "number" && product.compareAtPrice > product.price;

  const discount = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const description =
    product.shortDescription || product.description || "A fun pick for curious young minds.";

  return (
    <motion.article variants={cardVariants} className="group min-w-0">
      <Link
        href={`/products/${product.slug}`}
        aria-label={`View ${product.name}`}
        className="
          block
          overflow-hidden
          rounded-b-[4px]


          transition-all
          duration-300

          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#A96FDB]
          focus-visible:ring-offset-2
        "
      >
        {/* -------------------------------------------------------------- */}
        {/* ARC IMAGE                                                      */}
        {/* -------------------------------------------------------------- */}

        <div
          className="
            relative
            aspect-[1.18/1]
            w-full
            overflow-hidden
            rounded-t-[50%]
            bg-transparent
          "
        >
          {/* Soft background glow */}
          <div
            aria-hidden="true"
            className="
              absolute
              inset-0
              bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.7),transparent_58%)]
            "
          />

          {image ? (
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="
                (max-width: 639px) 92vw,
                (max-width: 1023px) 45vw,
                30vw
              "
              className="
                relative
                z-10
                object-cover
                transition-transform
                duration-700
                ease-[cubic-bezier(0.22,1,0.36,1)]
                group-hover:scale-[1.035]
              "
            />
          ) : (
            <div
              className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                bg-[#EEE8F6]
                font-[var(--font-poppins)]
                text-sm
                font-bold
                text-[#7A6A91]
              "
            >
              Buzzie Product
            </div>
          )}

          {/* Product number */}
          <div
            className="
              absolute
              left-4
              top-4
              z-20
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-white/90
              font-[var(--font-poppins)]
              text-[10px]
              font-black
              text-[#111111]
              shadow-sm
              backdrop-blur-sm
            "
          >
            0{index + 1}
          </div>

          {/* Discount */}
          {discount > 0 && (
            <span
              className="
                absolute
                right-4
                top-4
                z-20
                rounded-full
                bg-[#E72D5A]
                px-3
                py-1.5
                font-[var(--font-poppins)]
                text-[9px]
                font-black
                uppercase
                tracking-[0.08em]
                text-white
                shadow-sm
              "
            >
              {discount}% OFF
            </span>
          )}
        </div>

        {/* -------------------------------------------------------------- */}
        {/* PRODUCT INFORMATION                                            */}
        {/* -------------------------------------------------------------- */}

        <div className="px-4 pb-5 pt-4 sm:px-5 sm:pb-6">
          <h3
            className="
            text-center
              line-clamp-1
              font-[var(--font-poppins)]
              text-[17px]
              font-extrabold
              tracking-[-0.03em]
              text-[#111111]
              sm:text-[19px]
            "
          >
            {product.name}
          </h3>

          <p
            className="
            text-center
              mt-1.5
              line-clamp-2
              min-h-[36px]
              font-[var(--font-roboto)]
              text-[11px]
              leading-[1.5]
              text-[#687489]
              sm:text-[12px]
            "
          >
            {description}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <span
                className="
                  font-[var(--font-poppins)]
                  text-[15px]
                  font-extrabold
                  text-[#111111]
                  sm:text-[17px]
                "
              >
                ₹{product.price.toLocaleString("en-IN")}
              </span>

              {hasDiscount && (
                <span
                  className="
                    font-[var(--font-roboto)]
                    text-[10px]
                    font-medium
                    text-[#9AA2B1]
                    line-through
                    sm:text-[11px]
                  "
                >
                  ₹{product.compareAtPrice!.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <span
              className="
                shrink-0
                rounded-full
                bg-[#FF8A4C]
                px-3.5
                py-2
                font-[var(--font-poppins)]
                text-[9px]
                font-black
                uppercase
                tracking-[0.05em]
                text-white
                transition-transform
                duration-300
                group-hover:scale-[1.04]
                sm:px-4
                sm:text-[10px]
              "
            >
              Add to Cart
            </span>
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
/*                            MAIN COMPONENT                                  */
/* -------------------------------------------------------------------------- */

export default function BenefitsStrip({ bestsellingProducts = [] }: BenefitsStripProps) {
  const products = bestsellingProducts.slice(0, 3);

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
                Buzzie <span className="text-[#E72D5A]">Products</span>
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
            {/* PRODUCT CARDS                                                */}
            {/* ------------------------------------------------------------ */}

            {products.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.12,
                }}
                className="
                bg-white
                
                  mt-2
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                  sm:gap-5
                  lg:grid-cols-3
                  lg:gap-6
                  xl:gap-7
                "
              >
                {products.map((product, index) => (
                  <ProductArcCard key={product._id} product={product} index={index} />
                ))}
              </motion.div>
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
                    font-[var(--font-poppins)]
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
                  Find their next
                </span>

                <span className="size-1.5 rounded-full bg-[#F59A23]" />
              </div>

              <h2
                className="
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
                Shop By <span className="text-[#E72D5A]">Age</span>
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
