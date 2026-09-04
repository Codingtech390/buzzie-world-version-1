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
  Users,
  Zap,
} from "lucide-react";
import type { StorefrontProduct } from "@/types/storefront";
import Reveal from "./Reveal";

interface ShopByAgeProps {
  products: StorefrontProduct[];
}

interface VideoCardData {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  duration: string;
  accent: string;
  accentSoft: string;
  icon: "users" | "star" | "zap" | "heart";
  rotation: string;
}

/* ==========================================================================
   VIDEO CARD DATA
   ========================================================================== */

const videoCards: VideoCardData[] = [
  {
    id: 1,
    eyebrow: "PLAY TOGETHER",
    title: "Game night with friends.",
    description: "Fun, laughter and little moments worth remembering.",
    duration: "00:37",
    accent: "#8D55E8",
    accentSoft: "#F1E9FF",
    icon: "users",
    rotation: "lg:-rotate-[0.8deg]",
  },
  {
    id: 2,
    eyebrow: "DISCOVER",
    title: "Learning that feels like play.",
    description: "See curiosity turn into confidence, one game at a time.",
    duration: "00:43",
    accent: "#E91E63",
    accentSoft: "#FDEAF2",
    icon: "star",
    rotation: "lg:rotate-[0.5deg]",
  },
  {
    id: 3,
    eyebrow: "MAKE MEMORIES",
    title: "Turn any moment into a story.",
    description: "Pick a game, gather everyone and let the fun begin.",
    duration: "00:42",
    accent: "#F1A348",
    accentSoft: "#FFF1DF",
    icon: "zap",
    rotation: "lg:-rotate-[0.5deg]",
  },
  {
    id: 4,
    eyebrow: "REAL FAMILIES",
    title: "Why parents love BuzzieWorld.",
    description: "Thoughtful games made for curious growing minds.",
    duration: "00:47",
    accent: "#5799E4",
    accentSoft: "#EAF4FF",
    icon: "heart",
    rotation: "lg:rotate-[0.8deg]",
  },
  {
    id: 5,
    eyebrow: "REAL FAMILIES",
    title: "Why parents love BuzzieWorld.",
    description: "Thoughtful games made for curious growing minds.",
    duration: "00:47",
    accent: "#5799E4",
    accentSoft: "#EAF4FF",
    icon: "heart",
    rotation: "lg:rotate-[0.8deg]",
  },
];

/* ==========================================================================
   ICON
   ========================================================================== */

function CardIcon({ type }: { type: VideoCardData["icon"] }) {
  const className = "h-5 w-5 sm:h-[22px] sm:w-[22px]";
  const strokeWidth = 1.8;

  switch (type) {
    case "users":
      return <Users className={className} strokeWidth={strokeWidth} />;

    case "star":
      return <Star className={className} strokeWidth={strokeWidth} />;

    case "zap":
      return <Zap className={className} strokeWidth={strokeWidth} />;

    default:
      return <Heart className={className} strokeWidth={strokeWidth} />;
  }
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
   VIDEO PREVIEW
   ========================================================================== */

function VideoPreview({ card }: { card: VideoCardData }) {
  return (
    <div
      className="
        group/video
        relative
        aspect-[3/4]
        min-h-0
        w-full
        overflow-hidden
      "
      style={{
        background: `linear-gradient(
          145deg,
          ${card.accent} 0%,
          ${card.accent}D9 100%
        )`,
      }}
    >
      {/* Soft background shapes */}

      <div
        aria-hidden="true"
        className="
          absolute
          left-[18%]
          top-[18%]
          h-[72px]
          w-[72px]
          rounded-full
          bg-white/[0.10]
          transition-transform
          duration-700
          group-hover/video:scale-125
          sm:h-[86px]
          sm:w-[86px]
        "
      />

      <div
        aria-hidden="true"
        className="
          absolute
          left-[37%]
          top-[29%]
          h-[90px]
          w-[90px]
          rounded-[42%]
          bg-black/[0.045]
          transition-transform
          duration-700
          group-hover/video:translate-x-3
          sm:h-[105px]
          sm:w-[105px]
        "
      />

      <div
        aria-hidden="true"
        className="
          absolute
          bottom-[8%]
          right-[12%]
          h-[100px]
          w-[100px]
          rounded-full
          bg-black/[0.045]
          blur-2xl
        "
      />

      {/* Play button */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          flex
          h-[58px]
          w-[58px]
          -translate-x-1/2
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          bg-white
          shadow-[0_12px_28px_rgba(30,20,40,0.15)]
          transition-transform
          duration-500
          group-hover/video:scale-110
          sm:h-[70px]
          sm:w-[70px]
        "
      >
        <Play className="ml-1 h-6 w-6 sm:h-7 sm:w-7" fill="#E91E63" strokeWidth={0} />
      </div>

      {/* Duration */}

      <div
        className="
          absolute
          right-3
          top-3
          rounded-full
          bg-[#16141A]/90
          px-2.5
          py-1
          text-[0.58rem]
          font-bold
          tracking-[0.03em]
          text-white
          sm:right-4
          sm:top-4
          sm:px-3
          sm:py-1.5
          sm:text-[0.64rem]
        "
      >
        {card.duration}
      </div>

      {/* Coming soon */}

      <div
        className="
          absolute
          bottom-3
          left-3
          rounded-full
          bg-black/20
          px-2.5
          py-1
          text-[0.48rem]
          font-black
          uppercase
          tracking-[0.12em]
          text-white
          backdrop-blur-md
          sm:bottom-4
          sm:left-4
          sm:px-3
          sm:py-1.5
          sm:text-[0.55rem]
        "
      >
        Video coming soon
      </div>
    </div>
  );
}

/* ==========================================================================
   VIDEO CARD
   ========================================================================== */

function VideoCard({ card, index }: { card: VideoCardData; index: number }) {
  return (
    <Reveal delay={index * 0.06}>
      <article
        className="
          group
          relative
          mx-auto
          w-full
          max-w-[330px]
          min-w-0
          shrink-0
          overflow-hidden
          rounded-[16px]
          border
          border-white/60
          bg-[#17152A]
          shadow-[0_12px_32px_rgba(30,25,45,0.10)]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-[0_18px_42px_rgba(30,25,45,0.15)]
          sm:mx-0
          sm:max-w-none
        "
      >
        {/* ============================================================
            FULL-HEIGHT VIDEO
        ============================================================ */}

        <Link
          href={`/videos/${card.id}`}
          className="
            relative
            block
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#a092cd]
            focus-visible:ring-inset
          "
          aria-label={`Watch ${card.title}`}
        >
          <VideoPreview card={card} />

          {/* Small Watch & Buy label */}

          <span
            className="
              absolute
              left-3
              top-3
              z-20
              inline-flex
              items-center
              gap-1.5
              rounded-full
              bg-white/92
              px-2.5
              py-1.5
              text-[0.5rem]
              font-black
              uppercase
              tracking-[0.12em]
              text-[#4F465B]
              shadow-[0_5px_15px_rgba(20,15,30,0.12)]
              backdrop-blur-sm
              sm:left-4
              sm:top-4
            "
          >
            <Play className="size-2.5 fill-[#a092cd] text-[#a092cd]" strokeWidth={2} />
            Watch & Buy
          </span>
        </Link>

        {/* ============================================================
            BOTTOM ACTION BAR — ATTACHED TO CARD
        ============================================================ */}

        <div
          className="
            relative
            z-30
            border-t
            border-white/10
            bg-[#C391EE]
            px-3
            py-2.5
            sm:px-4
            sm:py-3
          "
        >
          <div className="flex items-center gap-2">
            {/* Add to Cart */}

            <button
              type="button"
              aria-label={`Add ${card.title} to cart`}
              title="Add to Cart"
              className="
                flex
                h-8
                flex-1
                items-center
                justify-center
                rounded-full
                bg-[#E83D59]
                text-white
                shadow-[0_4px_12px_rgba(20,15,30,0.16)]
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-[#8F7FBE]
                active:translate-y-0
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-white
                focus-visible:ring-offset-2
                focus-visible:ring-offset-[#17152A]
                sm:h-9
              "
            >
              <ShoppingBag className="size-3.5" strokeWidth={2} />
            </button>

            {/* View Product */}

            <Link
              href={`/videos/${card.id}`}
              aria-label={`View product for ${card.title}`}
              title="View Product"
              className="
                flex
                h-8
                flex-1
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/10
                text-white
                shadow-[0_4px_12px_rgba(20,15,30,0.10)]
                backdrop-blur-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-white/60
                hover:bg-[#C391EE]
                hover:text-[#6F5A98]
                active:translate-y-0
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#a092cd]
                focus-visible:ring-offset-2
                sm:h-9
              "
            >
              <ExternalLink className="size-3.5 text-white" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* ==========================================================================
   BENEFITS STRIP
   ========================================================================== */

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

      {/* ====================================================================
          FINAL BACKGROUND ARTWORK

          All decorative dashes, arrows and corner artwork now come from
          ONE image instead of being recreated in JSX.
      ==================================================================== */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          -z-10
          bg-white
          bg-[url('/images/backgrounds/video-cards-background.png')]
          bg-cover
          bg-center
          bg-no-repeat
        "
      />

      {/* Very subtle white overlay to keep typography crisp */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          -z-[5]
          bg-white/[0.025]
        "
      />

      <div className="container relative">
        {/* ==================================================================
            WATCH & BUY
        ================================================================== */}

        <Reveal>
          <header
            className="
              mx-auto
              max-w-[760px]
              px-4
              text-center
              sm:px-6
            "
          >
            <div className="flex items-center justify-center gap-3">
              <span className="h-[2px] w-8 rounded-full bg-[#a092cd] sm:w-10" />

              <p
                className="
                  text-[0.56rem]
                  font-black
                  uppercase
                  tracking-[0.19em]
                  text-[#7353A7]
                  sm:text-[0.65rem]
                  xl:text-[13px]
                "
              >
                Watch & Buy
              </p>

              <span className="h-2 w-2 rounded-full bg-[#E91E63]" />
            </div>

            <h2
              className="
                mx-auto
                mt-3
                text-balance
                font-[var(--font-roboto)]
                text-[clamp(2.25rem,5.5vw,3.9rem)]
                font-black
                leading-[0.95]
                tracking-[-0.055em]
                text-[#15121C]
              "
            >
              See it.
              <span className="text-[#E91E63]"> Love it.</span>
              <br />
              <span className="text-[#7353A7]">Take it home.</span>
            </h2>

            <p
              className="
                mx-auto
                mt-4
                w-full
                max-w-[620px]
                text-center
                text-[0.82rem]
                leading-[1.75]
                text-[#62606B]
                sm:text-[0.95rem]
                sm:leading-7
              "
            >
              Watch how the fun comes to life, discover your next favourite, and shop it in just a
              tap.
            </p>
          </header>
        </Reveal>



        <div
          className="
            relative
            mx-auto
            mt-6
            max-w-[1150px]
            sm:mt-7
            lg:mt-8
          "
        >
          <div
            className="
              grid
              grid-cols-1
              gap-6
              sm:grid-cols-2
              sm:gap-4
              md:grid-cols-3
              md:gap-4
              lg:grid-cols-5
              lg:gap-3
              xl:gap-4
            "
          >
            {videoCards.map((card, index) => (
              <VideoCard key={card.id} card={card} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
