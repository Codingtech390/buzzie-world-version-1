"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  Crown,
  Heart,
  Layers3,
  Sparkles,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { StorefrontProduct } from "@/types/storefront";
import Reveal from "./Reveal";

interface BrandStoryProps {
  products: StorefrontProduct[];
}

interface StorySlide {
  question: string;
  eyebrow: string;
  title: string;
  description: string;
  icon: typeof Compass;
  buttonLabel: string;
  href: string;
}

const STORY_SLIDES: StorySlide[] = [
  {
    question: "Why geography games?",
    eyebrow: "DISCOVER THE WORLD",
    title: "Big worlds. Little explorers.",
    description:
      "Geography games turn maps, places and curious questions into something children can explore together. Every game becomes a tiny adventure that makes learning feel natural.",
    icon: Compass,
    buttonLabel: "Explore Geography Games",
    href: "/shop",
  },
  {
    question: "Why you choose binders?",
    eyebrow: "COLLECT • ORGANISE • DISCOVER",
    title: "Keep their little world together.",
    description:
      "Binders give children a simple way to collect, organise and revisit the things they love. They turn loose cards and discoveries into something personal they can keep growing.",
    icon: Layers3,
    buttonLabel: "Explore Binders",
    href: "/shop",
  },
  {
    question: "Why family card games?",
    eyebrow: "PLAY TOGETHER",
    title: "The best games bring everyone in.",
    description:
      "Family card games create easy moments to sit down, laugh, think and play together. They are simple to pick up, exciting to replay and made for shared memories.",
    icon: Users,
    buttonLabel: "Explore Family Games",
    href: "/shop",
  },
  {
    question: "What are BuzzieWorld special edition games?",
    eyebrow: "LIMITED • SPECIAL • MEMORABLE",
    title: "A little more special.",
    description:
      "Our special edition games are made to feel different from the everyday favourites — distinctive themes, memorable play and extra little details that make them worth discovering.",
    icon: Crown,
    buttonLabel: "Discover Special Editions",
    href: "/shop",
  },
  {
    question: "Bestsellers / Featured Games",
    eyebrow: "FAVOURITES RIGHT NOW",
    title: "The games families are loving.",
    description:
      "Start with the games families are loving most. These featured picks bring together playful ideas, thoughtful design and plenty of reasons to come back for another round.",
    icon: Heart,
    buttonLabel: "Shop Featured Games",
    href: "/shop",
  },
];

function StoryProductImage({
  url,
  alt,
  position,
}: {
  url?: string;
  alt: string;
  position: "left" | "right";
}) {
  return (
    <div
      className={`
        relative
        hidden
        h-[516px]
        w-[563px]
        max-w-none
        shrink-0
        overflow-hidden
        bg-[#E9E4F6]
        lg:block
        ${position === "left" ? "rounded-r-[22px]" : "rounded-l-[22px]"}
      `}
    >
      {url ? (
        <Image
          src={url}
          alt={alt}
          fill
          sizes="(max-width: 1279px) 34vw, 480px"
          className="object-cover transition-transform duration-700 hover:scale-[1.025]"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-[#D9D1F0]">
          <Sparkles className="size-14 text-white/80" />
        </div>
      )}
    </div>
  );
}

function MobileStoryImage({ url, alt }: { url?: string; alt: string }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px] bg-[#D9D1F0]">
      {url ? (
        <Image
          src={url}
          alt={alt}
          fill
          sizes="(max-width: 1023px) 92vw, 600px"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <Sparkles className="size-12 text-white/80" />
        </div>
      )}
    </div>
  );
}

export default function BrandStory({ products }: BrandStoryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const storyProducts = useMemo(
    () => products.filter((product) => product.images?.some((image) => image.url)),
    [products],
  );

  const activeSlide = STORY_SLIDES[activeIndex];

  const leftProduct =
    storyProducts.length > 0 ? storyProducts[activeIndex % storyProducts.length] : undefined;

  const rightProduct =
    storyProducts.length > 1
      ? storyProducts[(activeIndex + 1) % storyProducts.length]
      : storyProducts[0];

  const leftImage = leftProduct?.images?.find((image) => image.url)?.url;
  const rightImage = rightProduct?.images?.find((image) => image.url)?.url;

  const goTo = (index: number) => {
    const next = (index + STORY_SLIDES.length) % STORY_SLIDES.length;
    setActiveIndex(next);
  };

  const Icon = activeSlide.icon;

  return (
    <section className="relative overflow-hidden bg-[#5D50A8] font-[var(--font-poppins-brand)] text-white mt-2">
      {/* ================================================================
          SOFT BACKGROUND GRAPHICS
      ================================================================ */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-32
          -top-32
          size-[28rem]
          rounded-full
          bg-white/[0.045]
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-40
          -right-32
          size-[32rem]
          rounded-full
          bg-[#E83D59]/[0.055]
          blur-3xl
        "
      />

      {/* ================================================================
          DESKTOP CAROUSEL
      ================================================================ */}

      <div
        className="
          relative
          hidden
          min-h-[580px]
          w-full
          overflow-hidden
          lg:flex
        "
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeSlide.question}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute left-0 right-0 top-[32px] flex h-[516px] items-start pl-[72px]"
          >
            <StoryProductImage
              url={leftImage}
              alt={leftProduct?.name || "BuzzieWorld game"}
              position="left"
            />

            {/* ============================================================
    CENTER CONTENT
============================================================ */}

            <div
              className="
    flex
    min-h-[420px]
    w-full
    shrink-0
    items-center
    justify-center
    px-5
    py-8

    sm:min-h-[460px]
    sm:px-8
    sm:py-10

    md:min-h-[500px]
    md:px-10

    lg:h-[516px]
    lg:min-h-0
    lg:w-[505px]
    lg:px-11
    lg:py-0
  "
            >
              <div
                className="
      w-full
      max-w-[330px]

      sm:max-w-[380px]

      md:max-w-[420px]

      lg:max-w-[405px]
    "
              >
                <Reveal key={activeSlide.question}>
                  <div
                    className="
          flex
          flex-col
          items-center
          text-center

          lg:items-start
          lg:text-left
        "
                  >
                    {/* ==========================================================
            EYEBROW
        ========================================================== */}

                    <div
                      className="
            flex
            items-center
            justify-center
            gap-2.5

            lg:justify-start
          "
                    >
                      <span
                        aria-hidden="true"
                        className="
              h-[2px]
              w-7
              shrink-0
              rounded-full
              bg-white

              sm:w-8

              lg:w-9
            "
                      />

                      <span
                        className="
              inline-flex
              items-center
              gap-1.5
              font-[var(--font-playpen-sans)]
              text-[8px]
              font-bold
              uppercase
              leading-none
              tracking-[0.12em]
              text-white/90

              sm:text-[9px]
              sm:tracking-[0.14em]

              md:text-[10px]

              lg:text-[10px]
            "
                      >
                        <Icon
                          className="
                size-3

                sm:size-3.5
              "
                          strokeWidth={2.5}
                        />

                        <span>{activeSlide.eyebrow}</span>
                      </span>
                    </div>

                    {/* ============================================================
    QUESTION / MAIN HEADING
============================================================ */}

                    <div
                      className="
    mt-5
    w-full

    sm:mt-5

    md:mt-6

    lg:mt-5
  "
                    >
                      <h2
                        className="
      m-0
      w-full
      font-[var(--font-poppins-brand)]
      text-[clamp(2.25rem,9vw,3.4rem)]
      font-bold
      leading-[0.88]
      tracking-[-0.035em]
      text-[#FFD54F]

      sm:text-[clamp(2.6rem,6vw,3.6rem)]

      md:text-[clamp(2.8rem,4.5vw,3.8rem)]

      lg:text-[clamp(2.5rem,3.2vw,3.35rem)]
    "
                      >
                        {activeSlide.question}
                      </h2>
                    </div>

                    {/* ============================================================
    DESCRIPTION
============================================================ */}

                    <p
                      className="
    m-0
    mt-7
    w-full
    max-w-[320px]
    font-[var(--font-playpen-sans)]
    text-[11px]
    font-medium
    leading-[1.55]
    tracking-[0.005em]
    text-white

    max-sm:mt-6
    sm:mt-6
    sm:max-w-[370px]
    sm:text-[12px]
    sm:leading-[1.6]

    md:max-w-[400px]
    md:text-[13px]

    lg:mt-6
    lg:max-w-[405px]
    lg:text-[14px]
    lg:leading-[1.55]
  "
                    >
                      {activeSlide.description}
                    </p>

                    {/* ==========================================================
            DESCRIPTION
        ========================================================== */}

                    <p
                      className="
            m-0
            mt-5
            w-full
            max-w-[320px]
            font-[var(--font-playpen-sans)]
            text-[11px]
            font-medium
            leading-[1.55]
            tracking-[0.005em]
            text-white

            sm:mt-6
            sm:max-w-[370px]
            sm:text-[12px]
            sm:leading-[1.6]

            md:max-w-[400px]
            md:text-[13px]

            lg:mt-6
            lg:max-w-[405px]
            lg:text-[14px]
            lg:leading-[1.55]
          "
                    >
                      {activeSlide.description}
                    </p>

                    {/* ==========================================================
            CTA
        ========================================================== */}

                    <Link
                      href={activeSlide.href}
                      className="
            group
            mt-6
            inline-flex
            min-h-[42px]
            w-auto
            max-w-full
            items-center
            justify-center
            gap-1.5
            rounded-full
            bg-[#C391EE]
            px-4
            font-[var(--font-playpen-sans)]
            text-[8px]
            font-bold
            leading-none
            tracking-[0.015em]
            text-white
            shadow-[0_8px_20px_rgba(0,0,0,0.13)]
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:bg-[#E83D59]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-white
            focus-visible:ring-offset-2
            focus-visible:ring-offset-[#5D50A8]

            sm:mt-7
            sm:min-h-[44px]
            sm:px-5
            sm:text-[9px]

            md:min-h-[46px]
            md:px-6
            md:text-[10px]

            lg:mt-7
            lg:min-h-[48px]
            lg:px-6
            lg:text-[11px]

            xl:text-[12px]
          "
                    >
                      <span className="whitespace-nowrap">{activeSlide.buttonLabel}</span>

                      <ArrowRight
                        className="
              size-3
              shrink-0
              transition-transform
              duration-300
              group-hover:translate-x-1

              sm:size-3.5

              md:size-4
            "
                        strokeWidth={2.5}
                      />
                    </Link>

                    {/* ==========================================================
            MOBILE / TABLET VISUAL BREATHING SPACE
        ========================================================== */}

                    <div
                      aria-hidden="true"
                      className="
            mt-5
            h-px
            w-12
            rounded-full
            bg-white/25

            sm:mt-6

            lg:hidden
          "
                    />
                  </div>
                </Reveal>
              </div>
            </div>

            <StoryProductImage
              url={rightImage}
              alt={rightProduct?.name || "BuzzieWorld game"}
              position="right"
            />

            {/* Previous */}

            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Previous story"
              className="
                absolute
                left-[82px]
                top-[292px]
                z-30
                flex
                h-11 w-11
                -translate-y-0
                items-center
                justify-center
                rounded-md
                border
                border-black/10
                bg-white
                text-[#242038]
                shadow-[0_8px_22px_rgba(0,0,0,0.16)]
                transition-all
                hover:scale-105
                hover:bg-[#F8F6FF]
              "
            >
              <ArrowLeft className="size-5" />
            </button>

            {/* Next */}

            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next story"
              className="
                absolute
                right-[82px]
                top-[292px]
                z-30
                flex
                h-11 w-11
                -translate-y-0
                items-center
                justify-center
                rounded-md
                border
                border-black/10
                bg-white
                text-[#242038]
                shadow-[0_8px_22px_rgba(0,0,0,0.16)]
                transition-all
                hover:scale-105
                hover:bg-[#F8F6FF]
              "
            >
              <ArrowRight className="size-5" />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ================================================================
          MOBILE / TABLET
      ================================================================ */}

      <div className="relative px-4 py-10 sm:px-6 sm:py-12 lg:hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeSlide.question}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mx-auto max-w-[680px]"
          >
            <MobileStoryImage url={leftImage} alt={leftProduct?.name || "BuzzieWorld game"} />

            <div className="pt-6 text-center">
              <div className="flex items-center justify-center gap-3">
                <span className="h-1.5 w-8 rounded-full bg-white" />

                <p className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.16em] text-white/80 sm:text-[10px]">
                  <Icon className="size-3.5" />
                  {activeSlide.eyebrow}
                </p>

                <span className="h-2 w-2 rounded-full bg-[#E83D59]" />
              </div>

              <h2 className="mt-4 font-[var(--font-playpen)] text-[clamp(2rem,8vw,3.3rem)] leading-[0.9] tracking-[-0.035em] text-white">
                {activeSlide.question}
              </h2>

              <p className="mx-auto mt-5 max-w-[570px] font-[var(--font-poppins-brand)] text-[12px] leading-6 normal-case text-white/90 sm:text-[13px] sm:leading-7">
                {activeSlide.description}
              </p>

              <Link
                href={activeSlide.href}
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#E83D59] px-5 text-[10px] font-black uppercase text-[#17142A] shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
              >
                {activeSlide.buttonLabel}
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Mobile navigation */}

        <div className="mt-7 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            aria-label="Previous story"
            className="flex size-10 items-center justify-center rounded-full bg-white text-[#5D50A8] shadow-md transition-transform hover:scale-105"
          >
            <ArrowLeft className="size-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {STORY_SLIDES.map((slide, index) => (
              <button
                key={slide.question}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to story ${index + 1}`}
                className={`
                  h-1.5 rounded-full transition-all duration-300
                  ${index === activeIndex ? "w-7 bg-[#E83D59]" : "w-1.5 bg-white/45"}
                `}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            aria-label="Next story"
            className="flex size-10 items-center justify-center rounded-full bg-white text-[#5D50A8] shadow-md transition-transform hover:scale-105"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
