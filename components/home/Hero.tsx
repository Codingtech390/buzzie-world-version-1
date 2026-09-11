"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface LandingSlide {
  id: string;
  image: string;
  alt: string;
  href: string;
}

const LANDING_SLIDES: LandingSlide[] = [
  {
    id: "slide-1",
    image: "/images/home/landing/hero-1.png",
    alt: "BuzzieWorld special offer",
    href: "/crazy-deals",
  },
  {
    id: "slide-2",
    image: "/images/home/landing/hero-2.png",
    alt: "BuzzieWorld celebration and gifting",
    href: "/crazy-deals",
  },
  {
    id: "slide-3",
    image: "/images/home/landing/hero-3.png",
    alt: "BuzzieWorld learning through play",
    href: "/crazy-deals",
  },
];

const AUTOPLAY_DELAY = 6500;

const slideTransition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1] as const,
};

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  const nextSlide = useCallback(() => {
    setDirection(1);

    setActiveSlide((current) => {
      return (current + 1) % LANDING_SLIDES.length;
    });
  }, []);

  const previousSlide = useCallback(() => {
    setDirection(-1);

    setActiveSlide((current) => {
      return (current - 1 + LANDING_SLIDES.length) % LANDING_SLIDES.length;
    });
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (index === activeSlide) {
        return;
      }

      setDirection(index > activeSlide ? 1 : -1);
      setActiveSlide(index);
    },
    [activeSlide],
  );

  useEffect(() => {
    if (isPaused || LANDING_SLIDES.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      nextSlide();
    }, AUTOPLAY_DELAY);

    return () => {
      window.clearInterval(timer);
    };
  }, [isPaused, nextSlide]);

  const activeSlideData = LANDING_SLIDES[activeSlide];

  if (!activeSlideData) {
    return null;
  }

  return (
    <section
      aria-label="BuzzieWorld promotional highlights"
      className="relative w-full overflow-hidden bg-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      {/* ================================================================
          FULLSCREEN LANDING CAROUSEL
      ================================================================ */}

      <div className="relative w-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeSlideData.id}
            custom={direction}
            initial={{
              opacity: 0,
              x: direction > 0 ? "2%" : "-2%",
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: direction > 0 ? "-2%" : "2%",
            }}
            transition={slideTransition}
            className="relative w-full"
          >
            <Link
              href={activeSlideData.href}
              aria-label={`Explore ${activeSlideData.alt}`}
              className="group relative block w-full overflow-hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#C391EE]/50"
            >
              <img
                src={activeSlideData.image}
                alt={activeSlideData.alt}
                draggable={false}
                className="
                  block
                  h-auto
                  w-full
                  max-w-none
                  select-none
                  object-contain
                "
              />

              {/* Very subtle hover overlay */}
              <span
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-black/[0.025]
                  opacity-0
                  transition-opacity
                  duration-300
                  group-hover:opacity-100
                "
              />
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* ================================================================
            SLIDE INDICATORS
        ================================================================ */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-3
            left-3
            z-20
            flex
            items-center
            gap-1.5
            sm:bottom-5
            sm:left-5
          "
        >
          {LANDING_SLIDES.map((slide, index) => (
            <span
              key={slide.id}
              className={
                index === activeSlide
                  ? `
                    h-1.5
                    w-7
                    rounded-full
                    bg-[#C391EE]
                    shadow-[0_0_10px_rgba(195,145,238,0.4)]
                  `
                  : `
                    h-1.5
                    w-2.5
                    rounded-full
                    bg-white/90
                    shadow-sm
                  `
              }
            />
          ))}
        </div>

        {/* ================================================================
            BOTTOM-RIGHT CONTROLS
        ================================================================ */}

        <div
          className="
            absolute
            bottom-3
            right-3
            z-30
            flex
            items-center
            gap-1
            rounded-full
            border
            border-white/80
            bg-white/90
            p-1
            shadow-[0_10px_30px_rgba(38,52,92,0.18)]
            backdrop-blur-xl
            sm:bottom-5
            sm:right-5
            sm:gap-1.5
            sm:p-1.5
          "
        >
          {/* Previous */}

          <button
            type="button"
            onClick={previousSlide}
            aria-label="Previous promotional slide"
            className="
              flex
              size-8
              items-center
              justify-center
              rounded-full
              bg-white
              text-[#26345C]
              transition-all
              duration-200
              hover:bg-[#F8F0FF]
              hover:text-[#7A48B8]
              active:scale-95
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#C391EE]
              sm:size-9
            "
          >
            <ArrowLeft className="size-4" strokeWidth={2.4} />
          </button>

          {/* Play / Pause */}

          <button
            type="button"
            onClick={() => setIsPaused((current) => !current)}
            aria-label={isPaused ? "Play promotional carousel" : "Pause promotional carousel"}
            aria-pressed={isPaused}
            className="
              flex
              size-8
              items-center
              justify-center
              rounded-full
              bg-[#C391EE]
              text-white
              shadow-[0_6px_16px_rgba(195,145,238,0.35)]
              transition-all
              duration-200
              hover:bg-[#B77BE8]
              active:scale-95
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#C391EE]
              sm:size-9
            "
          >
            {isPaused ? (
              <Play className="size-3.5" fill="currentColor" strokeWidth={2} />
            ) : (
              <Pause className="size-3.5" fill="currentColor" strokeWidth={2} />
            )}
          </button>

          {/* Next */}

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next promotional slide"
            className="
              flex
              size-8
              items-center
              justify-center
              rounded-full
              bg-white
              text-[#26345C]
              transition-all
              duration-200
              hover:bg-[#F8F0FF]
              hover:text-[#7A48B8]
              active:scale-95
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#C391EE]
              sm:size-9
            "
          >
            <ArrowRight className="size-4" strokeWidth={2.4} />
          </button>
        </div>
      </div>

      {/* ================================================================
          ACCESSIBLE SLIDE NAVIGATION
      ================================================================ */}

      <div className="sr-only">
        {LANDING_SLIDES.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`Go to promotional slide ${index + 1}`}
            aria-current={index === activeSlide ? "true" : undefined}
          >
            Slide {index + 1}
          </button>
        ))}
      </div>
    </section>
  );
}
