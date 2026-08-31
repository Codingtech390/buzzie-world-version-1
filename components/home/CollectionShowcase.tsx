"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import type { StorefrontSelector } from "@/types/storefront";

/* ============================================================================
   TYPES
============================================================================ */

interface CollectionShowcaseProps {
  collections: StorefrontSelector[];
}

interface ShowcaseSlide {
  id: string;
  image: string;
  alt: string;
  href: string;
}

/* ============================================================================
   SHOWCASE SLIDES

   These are your three promotional return-gift images.

   IMPORTANT:
   If your actual filenames are different, change only the image paths.
============================================================================ */

const SHOWCASE_SLIDES: ShowcaseSlide[] = [
  {
    id: "return-gift-1",
    image: "/images/return-gifts/return-gift-1.png",
    alt: "BuzzieWorld return gifts for kids",
    href: "/crazy-deals",
  },
  {
    id: "return-gift-2",
    image: "/images/return-gifts/return-gift-2.png",
    alt: "BuzzieWorld gifts for kids",
    href: "/crazy-deals",
  },
  {
    id: "return-gift-3",
    image: "/images/return-gifts/return-gift-3.png",
    alt: "BuzzieWorld fun return gifts",
    href: "/crazy-deals",
  },
];

/* ============================================================================
   SETTINGS
============================================================================ */

const AUTOPLAY_DELAY = 5000;

const pageEase = [0.22, 1, 0.36, 1] as const;

const slideVariants = {
  enter: {
    opacity: 0,
    scale: 1.015,
  },

  center: {
    opacity: 1,
    scale: 1,
  },

  exit: {
    opacity: 0,
    scale: 0.995,
  },
};

/* ============================================================================
   COMPONENT
============================================================================ */

export default function CollectionShowcase({ collections }: CollectionShowcaseProps) {
  /*
   * The collections prop is intentionally preserved.
   *
   * Your existing homepage may already pass backend collection data into
   * this component. The promotional carousel itself uses the three
   * manually-selected promotional artworks above.
   */

  const [activeSlide, setActiveSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /*
   * Keep this memoized so the carousel does not unnecessarily recreate
   * the slide array on every render.
   */
  const slides = useMemo(() => {
    if (SHOWCASE_SLIDES.length > 0) {
      return SHOWCASE_SLIDES;
    }

    /*
     * Safety fallback.
     *
     * This should normally never execute because SHOWCASE_SLIDES contains
     * your three promotional images.
     */
    return collections.slice(0, 3).map((collection) => ({
      id: collection._id,
      image: "",
      alt: collection.name,
      href: `/shop?collection=${encodeURIComponent(collection._id)}`,
    }));
  }, [collections]);

  /* ==========================================================================
     SAFETY FOR ACTIVE INDEX
  ========================================================================== */

  useEffect(() => {
    if (activeSlide >= slides.length) {
      setActiveSlide(0);
    }
  }, [activeSlide, slides.length]);

  /* ==========================================================================
     AUTOPLAY
  ========================================================================== */

  useEffect(() => {
    if (slides.length <= 1 || isHovered) {
      return;
    }

    autoplayRef.current = setInterval(() => {
      setActiveSlide((current) => {
        return (current + 1) % slides.length;
      });
    }, AUTOPLAY_DELAY);

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [isHovered, slides.length]);

  /* ==========================================================================
     NAVIGATION
  ========================================================================== */

  function goToPrevious() {
    setActiveSlide((current) => {
      if (current === 0) {
        return slides.length - 1;
      }

      return current - 1;
    });
  }

  function goToNext() {
    setActiveSlide((current) => {
      return (current + 1) % slides.length;
    });
  }

  function goToSlide(index: number) {
    setActiveSlide(index);
  }

  /* ==========================================================================
     EMPTY STATE
  ========================================================================== */

  if (slides.length === 0) {
    return null;
  }

  const currentSlide = slides[activeSlide] ?? slides[0];

  if (!currentSlide) {
    return null;
  }

  return (
    <section
      aria-label="BuzzieWorld return gifts"
      className="
        relative
        isolate
        w-full
        overflow-hidden
        bg-[#FFFDF9]
      "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ======================================================================
          FULLSCREEN CAROUSEL
      ====================================================================== */}

      <div
        className="
          relative
          w-full
          overflow-hidden
          bg-[#FFFDF9]
        "
      >
        {/* ====================================================================
            SLIDE AREA
        ==================================================================== */}

        <div
          className="
            relative
            w-full
            overflow-hidden
          "
        >
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={currentSlide.id}
              className="
                relative
                w-full
                overflow-hidden
              "
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.65,
                ease: pageEase,
              }}
            >
              {/* ================================================================
                  FULL-WIDTH PROMOTIONAL ARTWORK

                  Using normal img intentionally.

                  This avoids the Next/Image preload selector problem you were
                  previously getting with complex responsive `sizes` strings.
              ================================================================= */}

              <img
                src={currentSlide.image}
                alt={currentSlide.alt}
                className="
                  block
                  h-auto
                  w-full
                  max-w-none
                  select-none
                  object-contain
                "
                draggable={false}
              />

              {/* ================================================================
                  SUBTLE BOTTOM FADE

                  Only helps the controls remain readable.
              ================================================================= */}

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-x-0
                  bottom-0
                  h-24
                  bg-gradient-to-t
                  from-black/[0.08]
                  via-transparent
                  to-transparent
                "
              />

              {/* ================================================================
                  EXPLORE GIFTS BUTTON

                  Appears on hover.

                  Mobile:
                  The button remains available because touch devices do not
                  have normal hover behavior. See the `[@media...]` utility
                  below.
              ================================================================= */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  px-5
                "
              >
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 12,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    y: isHovered ? 0 : 12,
                    scale: isHovered ? 1 : 0.96,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: pageEase,
                  }}
                  className="
                    pointer-events-auto

                    [@media(hover:none)]:opacity-100
                    [@media(hover:none)]:translate-y-0
                    [@media(hover:none)]:scale-100
                  "
                >
                  <Link
                    href={currentSlide.href}
                    aria-label={`Explore gifts — ${currentSlide.alt}`}
                    className="
                      group
                      inline-flex
                      min-h-12
                      items-center
                      justify-center
                      gap-2
                      rounded-full
                      border
                      border-white/30
                      bg-[#C391EE]
                      px-7
                      py-3
                      font-[var(--font-poppins)]
                      text-sm
                      font-bold
                      !text-white
                      no-underline
                      shadow-[0_14px_35px_rgba(195,145,238,0.32)]
                      backdrop-blur-md
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:bg-[#B77BE8]
                      hover:!text-white
                      hover:shadow-[0_18px_42px_rgba(195,145,238,0.4)]
                      focus-visible:!text-white
                      focus-visible:outline-none
                      focus-visible:ring-4
                      focus-visible:ring-[#C391EE]/30
                      focus-visible:ring-offset-2
                      focus-visible:ring-offset-white
                    "
                    /*
                     * Inline color is intentional.
                     *
                     * This protects the CTA from any global anchor rule
                     * in globals.css that may be forcing links to black.
                     */
                    style={{
                      color: "#FFFFFF",
                    }}
                  >
                    <Sparkles
                      aria-hidden="true"
                      className="
                        size-4
                        !text-white
                        transition-transform
                        duration-300
                        group-hover:rotate-12
                      "
                      style={{
                        color: "#FFFFFF",
                      }}
                      strokeWidth={2.2}
                    />

                    <span
                      className="!text-white"
                      style={{
                        color: "#FFFFFF",
                      }}
                    >
                      Explore Gifts
                    </span>

                    <ArrowRight
                      aria-hidden="true"
                      className="
                        size-4
                        !text-white
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                      style={{
                        color: "#FFFFFF",
                      }}
                      strokeWidth={2.2}
                    />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ====================================================================
            BOTTOM-RIGHT NAVIGATION

            Both arrows stay together.
        ==================================================================== */}

        <div
          className="
            absolute
            bottom-5
            right-5
            z-30
            flex
            items-center
            gap-2
            sm:bottom-7
            sm:right-7
            lg:bottom-8
            lg:right-9
          "
        >
          {/* ================================================================
              PREVIOUS
          ================================================================= */}

          <motion.button
            type="button"
            aria-label="Previous slide"
            onClick={goToPrevious}
            whileHover={{
              y: -2,
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.96,
            }}
            className="
              flex
              size-11
              items-center
              justify-center
              rounded-full
              border
              border-white/70
              bg-white/90
              text-[#27344A]
              shadow-[0_8px_24px_rgba(39,52,74,0.14)]
              backdrop-blur-md
              transition-colors
              duration-200
              hover:bg-white
              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-[#C391EE]/25
              sm:size-12
            "
          >
            <ArrowLeft aria-hidden="true" className="size-4 sm:size-[18px]" strokeWidth={2.2} />
          </motion.button>

          {/* ================================================================
              NEXT
          ================================================================= */}

          <motion.button
            type="button"
            aria-label="Next slide"
            onClick={goToNext}
            whileHover={{
              y: -2,
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.96,
            }}
            className="
              flex
              size-11
              items-center
              justify-center
              rounded-full
              bg-[#C391EE]
              !text-white
              shadow-[0_10px_26px_rgba(195,145,238,0.32)]
              transition-colors
              duration-200
              hover:bg-[#B77BE8]
              focus-visible:outline-none
              focus-visible:ring-4
              focus-visible:ring-[#C391EE]/25
              focus-visible:ring-offset-2
              sm:size-12
            "
            style={{
              color: "#FFFFFF",
            }}
          >
            <ArrowRight
              aria-hidden="true"
              className="size-4 !text-white sm:size-[18px]"
              style={{
                color: "#FFFFFF",
              }}
              strokeWidth={2.2}
            />
          </motion.button>
        </div>

        {/* ====================================================================
            DESKTOP SLIDE INDICATORS

            Hidden on small screens to keep the mobile artwork clean.
        ==================================================================== */}

        <div
          className="
            absolute
            bottom-5
            left-1/2
            z-30
            hidden
            -translate-x-1/2
            items-center
            gap-1.5
            rounded-full
            border
            border-white/70
            bg-white/80
            px-3
            py-2
            shadow-[0_8px_22px_rgba(39,52,74,0.1)]
            backdrop-blur-md
            sm:flex
            sm:bottom-7
          "
        >
          {slides.map((slide, index) => {
            const isActive = activeSlide === index;

            return (
              <button
                key={slide.id}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => goToSlide(index)}
                className="
                  flex
                  h-4
                  w-5
                  items-center
                  justify-center
                  rounded-full
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#C391EE]
                "
              >
                <span
                  className={[
                    "block h-1.5 rounded-full transition-all duration-300",
                    isActive ? "w-5 bg-[#C391EE]" : "w-1.5 bg-[#27344A]/30",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================================
          MOBILE SLIDE INDICATORS
      ====================================================================== */}

      <div
        className="
          absolute
          bottom-5
          left-5
          z-30
          flex
          items-center
          gap-1
          rounded-full
          border
          border-white/70
          bg-white/80
          px-2.5
          py-1.5
          shadow-[0_6px_18px_rgba(39,52,74,0.1)]
          backdrop-blur-md
          sm:hidden
        "
      >
        {slides.map((slide, index) => {
          const isActive = activeSlide === index;

          return (
            <button
              key={`mobile-${slide.id}`}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={isActive ? "true" : undefined}
              onClick={() => goToSlide(index)}
              className="
                flex
                h-4
                w-4
                items-center
                justify-center
                rounded-full
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#C391EE]
              "
            >
              <span
                className={[
                  "block rounded-full transition-all duration-300",
                  isActive ? "h-1.5 w-4 bg-[#C391EE]" : "size-1.5 bg-[#27344A]/30",
                ].join(" ")}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}

