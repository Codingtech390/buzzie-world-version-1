"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, Heart, Star, ThumbsUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

import Reveal from "./Reveal";

/* =========================================================
   TYPES
   ========================================================= */

interface Review {
  _id: string;
  name: string;
  relationship: string;
  review: string;
  rating: number;
  accent: "pink" | "yellow" | "purple" | "green";
  recommendation?: string;
}

interface ReviewsShowcaseProps {
  reviews?: Review[];
}

/* =========================================================
   FALLBACK REVIEWS
   ========================================================= */

const fallbackReviews: Review[] = [
  {
    _id: "review-1",
    name: "Priya Sharma",
    relationship: "Mother of 5-year-old",
    review:
      "BuzzieWorld is our go-to for toys and games. Everything is safe, fun and keeps my daughter engaged for hours!",
    rating: 5,
    accent: "pink",
    recommendation: "Highly recommended",
  },
  {
    _id: "review-2",
    name: "Rahul Mehta",
    relationship: "Father of 6-year-old",
    review:
      "I love that the products are educational without feeling like school. My son learns while having so much fun!",
    rating: 5,
    accent: "yellow",
    recommendation: "Worth every penny",
  },
  {
    _id: "review-3",
    name: "Neha Kapoor",
    relationship: "Mother of 3-year-old",
    review:
      "So many thoughtful products in one place. We trust BuzzieWorld and recommend it to all our friends!",
    rating: 5,
    accent: "purple",
    recommendation: "We recommend it",
  },
  {
    _id: "review-4",
    name: "Vikram Singh",
    relationship: "Father of 8-year-old",
    review:
      "The quality is excellent and delivery is super quick. My son loves the games! Highly recommend!",
    rating: 5,
    accent: "green",
    recommendation: "Parent favourite",
  },
  {
    _id: "review-5",
    name: "Ananya Verma",
    relationship: "Mother of 7-year-old",
    review:
      "The games are genuinely engaging and my daughter enjoys learning without even realizing she is learning.",
    rating: 5,
    accent: "pink",
    recommendation: "Happy parent",
  },
  {
    _id: "review-6",
    name: "Amit Malhotra",
    relationship: "Father of 6-year-old",
    review:
      "Great products, beautiful quality and a really smooth shopping experience. We will definitely shop again.",
    rating: 5,
    accent: "yellow",
    recommendation: "Will shop again",
  },
];

/* =========================================================
   VISUAL THEMES
   ========================================================= */

const accentStyles = {
  pink: {
    background: "bg-[#FFF0F4]",
    avatar: "bg-[#FFDDE8] text-[#E72D5A]",
    quote: "text-[#E72D5A]",
    decorative: "text-[#E72D5A]",
  },

  yellow: {
    background: "bg-[#FFF8E8]",
    avatar: "bg-[#FFEDB8] text-[#D99500]",
    quote: "text-[#F0A800]",
    decorative: "text-[#F0A800]",
  },

  purple: {
    background: "bg-[#F5F0FF]",
    avatar: "bg-[#E9DDFF] text-[#7137D8]",
    quote: "text-[#7137D8]",
    decorative: "text-[#7137D8]",
  },

  green: {
    background: "bg-[#F1F8EC]",
    avatar: "bg-[#E0F1D7] text-[#579C37]",
    quote: "text-[#579C37]",
    decorative: "text-[#579C37]",
  },
} as const;

/* =========================================================
   DECORATIVE ICONS
   ========================================================= */

const decorativeIcons = {
  pink: Heart,
  yellow: Star,
  purple: Heart,
  green: ThumbsUp,
} as const;

/* =========================================================
   HELPERS
   ========================================================= */

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* =========================================================
   STAR RATING
   ========================================================= */

function ReviewStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-[3px]" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className="
            size-[14px]
            fill-[#F5A900]
            text-[#F5A900]
            sm:size-[15px]
          "
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

/* =========================================================
   REVIEW CARD
   ========================================================= */

function ReviewCard({ review, index }: { review: Review; index: number }) {
  const visual = accentStyles[review.accent];
  const DecorativeIcon = decorativeIcons[review.accent];

  return (
    <Reveal delay={index * 0.035} className="h-full w-full">
      <article
        className={[
          "relative flex w-full flex-col overflow-hidden",
          "h-[270px]",
          "rounded-[28px]",
          visual.background,
          "px-6 py-6",
          "sm:h-[278px] sm:px-7 sm:py-7",
          "shadow-[0_10px_30px_rgba(23,19,31,0.045)]",
          "transition-all duration-300",
          "hover:-translate-y-1",
          "hover:shadow-[0_18px_40px_rgba(23,19,31,0.08)]",
        ].join(" ")}
      >
        {/* Decorative quotation mark */}
        <div
          aria-hidden="true"
          className={[
            "pointer-events-none absolute right-5 top-0",
            "font-[var(--font-roboto)]",
            "text-[64px] font-black leading-none",
            visual.quote,
          ].join(" ")}
        >
          “
        </div>

        {/* Rating */}
        <div className="relative z-10 shrink-0">
          <ReviewStars rating={review.rating} />
        </div>

        {/* Review */}
        <div className="relative z-10 mt-5 min-h-0 flex-1 overflow-hidden">
          <p
            className="
              font-[var(--font-poppins)]
              text-[13px]
              font-medium
              leading-[1.6]
              text-[#272431]
              sm:text-[13.5px]
              sm:leading-[1.62]
            "
          >
            {review.review}
          </p>
        </div>

        {/* Reviewer */}
        <div
          className="
            relative z-10 mt-5
            flex shrink-0 items-center justify-between gap-3
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            {/* Avatar */}
            <div
              className={[
                "flex size-[44px] shrink-0 items-center justify-center",
                "rounded-full",
                "font-[var(--font-poppins)]",
                "text-[10px] font-black",
                visual.avatar,
              ].join(" ")}
            >
              {getInitials(review.name)}
            </div>

            {/* Reviewer details */}
            <div className="min-w-0">
              <p
                className="
                  truncate
                  font-[var(--font-poppins)]
                  text-[12px]
                  font-extrabold
                  leading-tight
                  text-[#17131F]
                  sm:text-[13px]
                "
              >
                {review.name}
              </p>

              <p
                className="
                  mt-1
                  truncate
                  font-[var(--font-poppins)]
                  text-[9px]
                  font-medium
                  leading-tight
                  text-[#77717D]
                  sm:text-[10px]
                "
              >
                {review.relationship}
              </p>
            </div>
          </div>

          {/* Bottom decorative icon */}
          <div
            aria-hidden="true"
            className={[
              "flex size-[42px] shrink-0 items-center justify-center",
              visual.decorative,
            ].join(" ")}
          >
            <DecorativeIcon className="size-8" strokeWidth={1.8} />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function ReviewsShowcase({ reviews }: ReviewsShowcaseProps) {
  const visibleReviews = reviews && reviews.length > 0 ? reviews : fallbackReviews;

  const carouselRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  /* =========================================================
     CLEAR AUTOPLAY
     ========================================================= */

  const clearAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  /* =========================================================
     RESPONSIVE CARD WIDTH
     ========================================================= */

  const getScrollAmount = useCallback(() => {
    const container = carouselRef.current;

    if (!container) {
      return 0;
    }

    const firstCard = container.querySelector<HTMLElement>("[data-review-card]");

    if (!firstCard) {
      return container.clientWidth;
    }

    const cardWidth = firstCard.offsetWidth;

    const styles = window.getComputedStyle(container);

    const gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;

    return cardWidth + gap;
  }, []);

  /* =========================================================
     SCROLL TO INDEX
     ========================================================= */

  const scrollToIndex = useCallback(
    (index: number) => {
      const container = carouselRef.current;

      if (!container) {
        return;
      }

      const scrollAmount = getScrollAmount();

      if (!scrollAmount) {
        return;
      }

      const safeIndex = Math.max(0, Math.min(index, visibleReviews.length - 1));

      container.scrollTo({
        left: safeIndex * scrollAmount,
        behavior: "smooth",
      });

      setActiveIndex(safeIndex);
    },
    [getScrollAmount, visibleReviews.length],
  );

  /* =========================================================
     NEXT
     ========================================================= */

  const nextReview = useCallback(() => {
    if (visibleReviews.length <= 1) {
      return;
    }

    setActiveIndex((current) => {
      const next = current >= visibleReviews.length - 1 ? 0 : current + 1;

      requestAnimationFrame(() => {
        scrollToIndex(next);
      });

      return next;
    });
  }, [scrollToIndex, visibleReviews.length]);

  /* =========================================================
     PREVIOUS
     ========================================================= */

  const previousReview = useCallback(() => {
    if (visibleReviews.length <= 1) {
      return;
    }

    setActiveIndex((current) => {
      const previous = current <= 0 ? visibleReviews.length - 1 : current - 1;

      requestAnimationFrame(() => {
        scrollToIndex(previous);
      });

      return previous;
    });
  }, [scrollToIndex, visibleReviews.length]);

  /* =========================================================
     TRACK MANUAL SCROLL
     ========================================================= */

  const handleScroll = useCallback(() => {
    const container = carouselRef.current;

    if (!container) {
      return;
    }

    const scrollAmount = getScrollAmount();

    if (!scrollAmount) {
      return;
    }

    const index = Math.round(container.scrollLeft / scrollAmount);

    setActiveIndex(Math.max(0, Math.min(index, visibleReviews.length - 1)));
  }, [getScrollAmount, visibleReviews.length]);

  /* =========================================================
     START AUTOPLAY
     ========================================================= */

  const startAutoplay = useCallback(() => {
    clearAutoplay();

    if (visibleReviews.length <= 1) {
      return;
    }

    autoplayRef.current = setInterval(() => {
      if (!document.hidden) {
        nextReview();
      }
    }, 4500);
  }, [clearAutoplay, nextReview, visibleReviews.length]);

  /* =========================================================
     AUTOPLAY
     ========================================================= */

  useEffect(() => {
    if (isPaused) {
      clearAutoplay();
      return;
    }

    startAutoplay();

    return () => {
      clearAutoplay();
    };
  }, [isPaused, startAutoplay, clearAutoplay]);

  /* =========================================================
     CLEANUP
     ========================================================= */

  useEffect(() => {
    return () => {
      clearAutoplay();
    };
  }, [clearAutoplay]);

  /* =========================================================
     KEYBOARD
     ========================================================= */

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      previousReview();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      nextReview();
    }
  };

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <section className="relative overflow-hidden bg-white">

      {/* =====================================================
          REVIEWS
         ===================================================== */}

      <div
        className="
          relative
          px-4
          pb-12
          pt-9
          sm:px-6
          sm:pb-14
          sm:pt-11
          lg:px-8
          lg:pb-16
          lg:pt-12
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-40
            top-0
            size-80
            rounded-full
            bg-[#E72D5A]/[0.025]
            blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-40
            bottom-0
            size-96
            rounded-full
            bg-[#7137D8]/[0.025]
            blur-3xl
          "
        />

        <div className="relative mx-auto w-full max-w-[1380px]">
          <div
            className="relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
            onKeyDown={handleKeyDown}
          >
            {/* =================================================
                LEFT ARROW
               ================================================= */}

            <button
              type="button"
              aria-label="Previous review"
              onClick={previousReview}
              className="
                absolute
                left-[-22px]
                top-1/2
                z-20
                hidden
                size-11
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-white
                text-[#E72D5A]
                shadow-[0_10px_28px_rgba(23,19,31,0.12)]
                ring-1
                ring-black/[0.04]
                transition-all
                duration-300
                hover:-translate-x-1
                hover:shadow-[0_15px_35px_rgba(23,19,31,0.16)]
                lg:flex
              "
            >
              <ArrowLeft className="size-5" />
            </button>

            {/* =================================================
                RIGHT ARROW
               ================================================= */}

            <button
              type="button"
              aria-label="Next review"
              onClick={nextReview}
              className="
                absolute
                right-[-22px]
                top-1/2
                z-20
                hidden
                size-11
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-[#E72D5A]
                text-white
                shadow-[0_10px_28px_rgba(231,45,90,0.2)]
                transition-all
                duration-300
                hover:translate-x-1
                hover:bg-[#D91F50]
                lg:flex
              "
            >
              <ArrowRight className="size-5" />
            </button>

            <div
              ref={carouselRef}
              className="
              flex
              w-full
              snap-x
              snap-mandatory
              gap-5
              overflow-x-hidden
              overflow-y-hidden
              scroll-smooth
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden

              xl:mt-12
            "
            >
              {visibleReviews.map((review, index) => (
                <div
                  key={review._id}
                  data-review-card
                  className="
                    w-[calc(100%-4px)]
                    min-w-[calc(100%-4px)]
                    shrink-0
                    snap-start

                    sm:w-[calc(50%-10px)]
                    sm:min-w-[calc(50%-10px)]

                    lg:w-[calc(25%-15px)]
                    lg:min-w-[calc(25%-15px)]
                  "
                >
                  <ReviewCard review={review} index={index} />
                </div>
              ))}
            </div>

            {/* =================================================
                MOBILE / TABLET NAVIGATION
               ================================================= */}

            <div
              className="
                mt-6
                flex
                items-center
                justify-between
                lg:hidden
              "
            >
              {/* Previous */}
              <button
                type="button"
                aria-label="Previous review"
                onClick={previousReview}
                className="
                  flex
                  size-10
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-[#E72D5A]
                  shadow-[0_8px_25px_rgba(23,19,31,0.1)]
                  ring-1
                  ring-black/[0.05]
                "
              >
                <ArrowLeft className="size-4" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2">
                {visibleReviews.map((review, index) => (
                  <button
                    key={review._id}
                    type="button"
                    aria-label={`Show review ${index + 1}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                    onClick={() => scrollToIndex(index)}
                    className={[
                      "h-2 rounded-full transition-all duration-300",
                      index === activeIndex ? "w-7 bg-[#E72D5A]" : "w-2 bg-[#E7DDE1]",
                    ].join(" ")}
                  />
                ))}
              </div>

              {/* Next */}
              <button
                type="button"
                aria-label="Next review"
                onClick={nextReview}
                className="
                  flex
                  size-10
                  items-center
                  justify-center
                  rounded-full
                  bg-[#E72D5A]
                  text-white
                  shadow-[0_8px_25px_rgba(231,45,90,0.2)]
                  transition-all
                  hover:bg-[#D91F50]
                "
              >
                <ArrowRight className="size-4" />
              </button>
            </div>

            {/* =================================================
                DESKTOP DOTS
               ================================================= */}

            <div
              className="
                mt-7
                hidden
                items-center
                justify-center
                gap-2
                lg:flex
              "
            >
              {visibleReviews.map((review, index) => (
                <button
                  key={review._id}
                  type="button"
                  aria-label={`Show review ${index + 1}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  onClick={() => scrollToIndex(index)}
                  className={[
                    "h-2 rounded-full transition-all duration-300",
                    index === activeIndex
                      ? "w-8 bg-[#E72D5A]"
                      : "w-2 bg-[#E7DDE1] hover:bg-[#F3B5C4]",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>
        </div>
      </div>


    </section>
  );
}
