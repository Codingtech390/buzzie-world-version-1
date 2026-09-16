"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Music2, Sparkles } from "lucide-react";

import Reveal from "./Reveal";

/* -------------------------------------------------------------------------- */
/* CONFIG                                                                     */
/* -------------------------------------------------------------------------- */

const YOUTUBE_URL = "https://www.youtube.com/";

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function Newsletter() {
  return (
    <section className="relative overflow-hidden bg-[#FFF8E8] py-12 sm:py-16 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-20 size-80 rounded-full bg-[#E83D59]/7 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-24 size-96 rounded-full bg-[#20B95A]/7 blur-3xl"
      />

      <div className="container relative">
        <Reveal>
          {/* ================================================================ */}
          {/* PLAYDATES                                                        */}
          {/* ================================================================ */}

          <div
            className="
    relative
    overflow-hidden
    rounded-[30px]
    bg-[#E83D59]
    shadow-[0_24px_65px_rgba(232,61,89,0.14)]
    sm:rounded-[38px]
  "
          >
            <div
              aria-hidden="true"
              className="
      pointer-events-none
      absolute
      -right-24
      -top-28
      size-72
      rounded-full
      bg-white/7
      blur-3xl
    "
            />

            <div
              aria-hidden="true"
              className="
      pointer-events-none
      absolute
      -bottom-32
      -left-24
      size-80
      rounded-full
      bg-[#F8C83B]/8
      blur-3xl
    "
            />

            <div
              className="
      relative
      grid
      lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]
    "
            >
              {/* ============================================================
        LEFT — IMAGE
    ============================================================ */}

              <div
                className="
        relative
        flex
        min-h-[430px]
        items-center
        justify-center
        overflow-hidden
        px-5
        py-8
        sm:min-h-[520px]
        sm:px-8
        sm:py-10
        lg:min-h-[560px]
        lg:px-10
        lg:py-12
      "
              >
                {/* Subtle glow behind artwork */}
                <div
                  aria-hidden="true"
                  className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          size-[70%]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-white/5
          blur-3xl
        "
                />

                <Image
                  src="/images/categories/more-playdates.png"
                  alt="Playdate ideas for kids"
                  width={1000}
                  height={700}
                  priority={false}
                  className="
                  rounded-md
          relative
          z-10
          block
          h-auto
          w-full
          max-w-[620px]
          object-contain
          object-center
          lg:max-w-[600px]
          xl:max-w-[650px]
        "
                />
              </div>

              {/* ============================================================
        RIGHT — HEADING + COPY
    ============================================================ */}

              <div
                className="
        relative
        flex
        items-center
        px-7
        py-10
        sm:px-10
        sm:py-12
        lg:px-12
        lg:py-12
        xl:px-16
        xl:py-14
      "
              >
                {/* Vertical divider */}
                <div
                  aria-hidden="true"
                  className="
          pointer-events-none
          absolute
          left-0
          top-1/2
          hidden
          h-[76%]
          w-px
          -translate-y-1/2
          bg-white/20
          lg:block
        "
                />

                <div className="w-full max-w-[580px] lg:pl-2 xl:pl-4">
                  {/* ========================================================
            RIGHT SIDE HEADING
        ======================================================== */}

                  <div>
                    <p
                      className="

              font-[var(--font-roboto)]
              text-[clamp(1.5rem,3vw,2.35rem)]
              font-light
              uppercase
              leading-[0.9]
              tracking-[-0.045em]
              text-white
            "
                    >
                      This week&apos;s
                    </p>

                    <h2
                      className="
              mt-1

              max-w-[460px]
              font-[var(--font-poppins)]
              text-[clamp(2.4rem,5vw,4.25rem)]
              font-black
              uppercase
              leading-[0.86]
              tracking-[-0.065em]
              text-[#FFF200]
            "
                    >
                      Playdate Idea
                    </h2>
                  </div>

                  {/* ========================================================
            SMALL EYEBROW
        ======================================================== */}

                  <div className="mt-8 flex items-center gap-2 sm:mt-9 lg:mt-10">
                    <span aria-hidden="true" className="size-2 rounded-full bg-[#FFF200]" />

                    <span
                      className="
              font-[var(--font-poppins)]
              text-[0.68rem]
              font-black
              uppercase
              tracking-[0.2em]
              text-white/75
            "
                    >
                      Play together
                    </span>
                  </div>

                  {/* ========================================================
            MAIN COPY
        ======================================================== */}

                  <h3
                    className="
            mt-4
            max-w-[540px]
            font-[var(--font-poppins)]
            text-[clamp(2rem,4vw,3.35rem)]
            font-black
            leading-[0.96]
            tracking-[-0.06em]
            text-white
          "
                  >
                    Make room for a little <span className="text-[#FFF200]">imagination.</span>
                  </h3>

                  <div className="mt-6 max-w-[545px] space-y-5">
                    <p
                      className="
              font-[var(--font-roboto)]
              text-[0.92rem]
              font-medium
              leading-[1.7]
              text-white/82
              sm:text-base
            "
                    >
                      Turn an ordinary afternoon into a memorable playdate. Pick a game, invite a
                      few little friends and let the kids take the lead.
                    </p>

                    <p
                      className="
              font-[var(--font-roboto)]
              text-[0.92rem]
              font-medium
              leading-[1.7]
              text-white/82
              sm:text-base
            "
                    >
                      A little less screen time, a little more laughter, imagination and play —
                      that&apos;s the kind of magic we love at BuzzieWorld.
                    </p>
                  </div>

                  {/* ========================================================
            CTA
        ======================================================== */}

                  <Link
                    href="/categories"
                    className="
            group
            mt-8
            inline-flex
            min-h-12
            items-center
            gap-2.5
            rounded-full
            bg-[#FFF8E8]
            px-6
            font-[var(--font-poppins)]
            text-xs
            font-bold
            text-[#E83D59]
            shadow-[0_12px_26px_rgba(89,20,36,0.13)]
            outline-none
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:bg-white
            focus-visible:ring-2
            focus-visible:ring-white
            focus-visible:ring-offset-2
            focus-visible:ring-offset-[#E83D59]
          "
                  >
                    Explore play ideas
                    <ArrowUpRight
                      className="
              size-4
              transition-transform
              duration-300
              group-hover:-translate-y-0.5
              group-hover:translate-x-0.5
            "
                      strokeWidth={2.2}
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================ */}
          {/* SEPARATION                                                       */}
          {/* ================================================================ */}

          <div aria-hidden="true" className="h-10 sm:h-12 lg:h-16" />

          {/* ================================================================ */}
          {/* YOUTUBE                                                         */}
          {/* ================================================================ */}

          <Link
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Watch BuzzieWorld on YouTube"
            className="
    group
    relative
    block
    overflow-hidden
    rounded-[24px]
    bg-[#E83D59]
    shadow-[0_18px_45px_rgba(255,0,0,0.12)]
    outline-none
    transition-all
    duration-300
    hover:-translate-y-0.5
    hover:shadow-[0_22px_52px_rgba(255,0,0,0.17)]
    focus-visible:ring-2
    focus-visible:ring-[#FF0000]
    focus-visible:ring-offset-4
    focus-visible:ring-offset-[#FFF8E8]
    sm:rounded-[28px]
  "
          >
            {/* Subtle background accent */}
            <div
              aria-hidden="true"
              className="
      pointer-events-none
      absolute
      inset-y-0
      left-0
      w-1/3
      bg-white/[0.05]
    "
            />

            {/* ============================================================
    SUBTLE BACKGROUND ICONS
============================================================ */}

            {/* YouTube background icon */}
            <div
              aria-hidden="true"
              className="
    pointer-events-none
    absolute
    left-[48%]
    top-1/2
    z-0
    -translate-x-1/2
    -translate-y-1/2
    opacity-[0.07]
    transition-opacity
    duration-300
    group-hover:opacity-[0.10]
  "
            >
              <svg
                viewBox="0 0 24 24"
                className="
      size-16
      fill-white
      sm:size-20
      lg:size-24
    "
              >
                <path d="M23.5 6.2a3 3 0 0 0-2.12-2.12C19.51 3.5 12 3.5 12 3.5s-7.51 0-9.38.58A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.12c1.87.58 9.38.58 9.38.58s7.51 0 9.38-.58a3 3 0 0 0 2.12-2.12A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8ZM9.6 15.5v-7l6.2 3.5-6.2 3.5Z" />
              </svg>
            </div>

            {/* Melody / music background icon */}
            <div
              aria-hidden="true"
              className="
    pointer-events-none
    absolute
    left-[60%]
    top-1/2
    z-0
    -translate-x-1/2
    -translate-y-1/2
    opacity-[0.055]
    transition-opacity
    duration-300
    group-hover:opacity-[0.08]
  "
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="
      size-16
      text-white
      sm:size-20
      lg:size-24
    "
              >
                <path d="M9 18V5l11-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="17" cy="16" r="3" />
              </svg>
            </div>

            {/* Decorative play circles */}
            <span
              aria-hidden="true"
              className="
      pointer-events-none
      absolute
      -left-3
      top-[-18px]
      size-20
      rounded-full
      border-[10px]
      border-white/[0.08]
      sm:size-24
    "
            />

            <span
              aria-hidden="true"
              className="
      pointer-events-none
      absolute
      bottom-[-28px]
      right-[20%]
      size-24
      rounded-full
      border-[12px]
      border-black/[0.06]
      sm:size-28
    "
            />

            <div
              className="
      relative
      flex
      min-h-[108px]
      flex-col
      items-start
      justify-center
      gap-5
      px-6
      py-6
      sm:min-h-[116px]
      sm:flex-row
      sm:items-center
      sm:justify-between
      sm:gap-6
      sm:px-9
      sm:py-6
      lg:px-12
    "
            >
              {/* YouTube copy */}
              <div className="relative z-10 flex min-w-0 items-center gap-4 sm:gap-5">
                <span
                  className="
          flex
          size-12
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-white
          text-[#FF0000]
          shadow-[0_8px_22px_rgba(0,0,0,0.12)]
          sm:size-14
        "
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="ml-[1px] size-[22px] fill-current sm:size-[25px]"
                  >
                    <path d="M23.5 6.2a3 3 0 0 0-2.12-2.12C19.51 3.5 12 3.5 12 3.5s-7.51 0-9.38.58A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.12c1.87.58 9.38.58 9.38.58s7.51 0 9.38-.58a3 3 0 0 0 2.12-2.12A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8ZM9.6 15.5v-7l6.2 3.5-6.2 3.5Z" />
                  </svg>
                </span>

                <div className="min-w-0">
                  <p
                    className="
            font-[var(--font-poppins)]
            text-[clamp(1.3rem,3vw,2.2rem)]
            font-black
            uppercase
            leading-[0.9]
            tracking-[-0.055em]
            text-white
          "
                  >
                    Watch &amp; Play
                  </p>

                  <p
                    className="
            mt-1.5
            font-[var(--font-poppins)]
            text-[clamp(0.72rem,1.5vw,0.95rem)]
            font-black
            uppercase
            leading-none
            tracking-[-0.015em]
            text-white/85
          "
                  >
                    Fun videos for little explorers!
                  </p>
                </div>
              </div>

              {/* YouTube CTA */}
              <div
                className="
        relative
        z-10
        flex
        min-h-11
        shrink-0
        items-center
        gap-3
        rounded-full
        border-2
        border-white
        px-5
        py-2
        font-[var(--font-poppins)]
        text-[0.68rem]
        font-black
        uppercase
        text-white
        transition-all
        duration-300
        group-hover:bg-white
        group-hover:text-[#FF0000]
        sm:min-h-12
        sm:px-6
        sm:text-xs
      "
              >
                <span
                  className="
          flex
          size-7
          items-center
          justify-center
          rounded-full
          bg-white
          text-[#FF0000]
          transition-colors
          duration-300
          group-hover:bg-[#FF0000]
          group-hover:text-white
          sm:size-8
        "
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="ml-[1px] size-[15px] fill-current sm:size-[17px]"
                  >
                    <path d="M23.5 6.2a3 3 0 0 0-2.12-2.12C19.51 3.5 12 3.5 12 3.5s-7.51 0-9.38.58A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.12c1.87.58 9.38.58 9.38.58s7.51 0 9.38-.58a3 3 0 0 0 2.12-2.12A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8ZM9.6 15.5v-7l6.2 3.5-6.2 3.5Z" />
                  </svg>
                </span>

                <span>Watch on YouTube</span>

                <ArrowUpRight
                  className="
          size-4
          transition-transform
          duration-300
          group-hover:-translate-y-0.5
          group-hover:translate-x-0.5
        "
                  strokeWidth={2.2}
                />
              </div>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
