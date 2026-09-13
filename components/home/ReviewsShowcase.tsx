"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, Star, ThumbsUp } from "lucide-react";

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
            relative
            z-10
            mt-5
            flex
            shrink-0
            items-center
            justify-between
            gap-3
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

  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const positionRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  const [isPaused, setIsPaused] = useState(false);

  /* =========================================================
     CONTINUOUS MARQUEE

     The track contains two identical review sets.

     Once the first set has completely passed,
     the position is reset by exactly one set width.

     This creates a seamless infinite loop.
     ========================================================= */

  useEffect(() => {
    const track = trackRef.current;

    if (!track || visibleReviews.length === 0) {
      return;
    }

    const SPEED = 32;

    const animate = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      const delta = Math.min(time - lastTimeRef.current, 40);

      lastTimeRef.current = time;

      if (!isPaused) {
        positionRef.current += (SPEED * delta) / 1000;

        const firstSetWidth = track.scrollWidth / 2;

        if (positionRef.current >= firstSetWidth) {
          positionRef.current -= firstSetWidth;
        }

        track.style.transform = `translate3d(${-positionRef.current}px, 0, 0)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }

      animationRef.current = null;
      lastTimeRef.current = null;
    };
  }, [visibleReviews.length, isPaused]);

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-white
        pt-8
        pb-8
        sm:pt-10
        sm:pb-10
        lg:pt-12
        lg:pb-12
      "
    >
      {/* =====================================================
          REVIEWS
      ===================================================== */}

      <div
        className="
          relative
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* Soft decorative background glow — left */}
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

        {/* Soft decorative background glow — right */}
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

        <div
          className="
            relative
            mx-auto
            w-full
            max-w-[1380px]
          "
        >
          {/* =================================================
              MARQUEE VIEWPORT

              Slightly oversized so the tilted track never
              exposes empty corners.
          ================================================= */}

          <div
            className="
              relative
              -mx-8
              overflow-hidden
              px-8
              py-4
              sm:-mx-10
              sm:px-10
              lg:-mx-14
              lg:px-14
            "
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocus={() => setIsPaused(true)}
            onBlur={() => setIsPaused(false)}
          >
            {/* =================================================
                SLANTED CONTINUOUS TRACK
            ================================================= */}

            <div
              className="
                relative
                -rotate-[1.15deg]
                origin-center
                will-change-transform
              "
            >
              <div
                ref={trackRef}
                className="
                  flex
                  w-max
                  gap-5
                  will-change-transform
                "
              >
                {/* =================================================
                    FIRST SET
                ================================================= */}

                <div
                  className="
                    flex
                    shrink-0
                    gap-5
                  "
                >
                  {visibleReviews.map((review, index) => (
                    <div
                      key={`first-${review._id}`}
                      data-review-card
                      className="
                          w-[calc(100vw-48px)]
                          max-w-[430px]
                          shrink-0
                          sm:w-[calc(50vw-34px)]
                          lg:w-[320px]
                          xl:w-[330px]
                        "
                    >
                      <ReviewCard review={review} index={index} />
                    </div>
                  ))}
                </div>

                {/* =================================================
                    SECOND SET

                    Exact duplicate of the first set so the
                    marquee can loop without a visible jump.
                ================================================= */}

                <div
                  aria-hidden="true"
                  className="
                    flex
                    shrink-0
                    gap-5
                  "
                >
                  {visibleReviews.map((review, index) => (
                    <div
                      key={`second-${review._id}`}
                      className="
                          w-[calc(100vw-48px)]
                          max-w-[430px]
                          shrink-0
                          sm:w-[calc(50vw-34px)]
                          lg:w-[320px]
                          xl:w-[330px]
                        "
                    >
                      <ReviewCard review={review} index={index + visibleReviews.length} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
