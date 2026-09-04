"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Music2, Sparkles } from "lucide-react";

import Reveal from "./Reveal";

/* -------------------------------------------------------------------------- */
/* CONFIG                                                                     */
/* -------------------------------------------------------------------------- */

/*
 * Replace this with your actual Spotify playlist URL.
 */
const SPOTIFY_PLAYLIST_URL = "https://open.spotify.com/playlist/YOUR_PLAYLIST_ID";

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
              className="pointer-events-none absolute -right-24 -top-28 size-72 rounded-full bg-white/7 blur-3xl"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-32 -left-24 size-80 rounded-full bg-[#F8C83B]/8 blur-3xl"
            />

            <div
              className="
                relative
                grid
                lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]
              "
            >
              {/* ============================================================ */}
              {/* LEFT — IMAGE / EDITORIAL                                    */}
              {/* ============================================================ */}

              <div
                className="
                  relative
                  flex
                  min-h-[430px]
                  flex-col
                  overflow-hidden
                  px-6
                  pb-0
                  pt-8
                  sm:min-h-[520px]
                  sm:px-9
                  sm:pt-10
                  lg:min-h-[540px]
                  lg:px-10
                  lg:pt-10
                "
              >
                <div className="relative z-20">
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
                    Playdate
                    <br />
                    Idea
                  </h2>
                </div>

                {/* The artwork intentionally owns the entire lower-left area. */}
                <div
                  className="
                    relative
                    z-10
                    mt-auto
                    flex
                    min-h-0
                    flex-1
                    items-end
                    justify-center

                    pt-5
                    sm:pt-7
                    lg:-mx-4
                    lg:pt-3
                  "
                >
                  <Image
                    src="/images/categories/more-playdates.png"
                    alt="Playdate ideas for kids"
                    width={1000}
                    height={700}
                    priority={false}
                    className="
                      block
                      h-auto
                      w-[120%]
                      max-w-none
                      translate-y-2
                      object-contain
                      object-bottom
                      sm:w-[120%]
                      sm:translate-y-3
                      lg:w-[120%]
                      lg:translate-y-4
                    "
                  />
                </div>
              </div>

              {/* ============================================================ */}
              {/* RIGHT — COPY                                                 */}
              {/* ============================================================ */}

              <div
                className="
                  relative
                  flex
                  items-center
                  px-7
                  py-10
                  sm:px-10
                  sm:py-12
                  lg:px-14
                  lg:py-14
                  xl:px-16
                "
              >
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    left-0
                    top-1/2
                    hidden
                    h-[72%]
                    w-px
                    -translate-y-1/2
                    bg-white/20
                    lg:block
                  "
                />

                <div className="max-w-[580px] lg:pl-2 xl:pl-4">
                  <div className="flex items-center gap-2">
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
                      className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
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
          {/* SPOTIFY                                                         */}
          {/* ================================================================ */}

          <Link
            href={SPOTIFY_PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Listen to the BuzzieWorld playdate playlist on Spotify"
            className="
              group
              relative
              block
              overflow-hidden
              rounded-[24px]
              bg-[#20B95A]
              shadow-[0_18px_45px_rgba(32,185,90,0.12)]
              outline-none
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-[0_22px_52px_rgba(32,185,90,0.16)]
              focus-visible:ring-2
              focus-visible:ring-[#20B95A]
              focus-visible:ring-offset-4
              focus-visible:ring-offset-[#FFF8E8]
              sm:rounded-[28px]
            "
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/4"
            />

            {/* Decorative music notes */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-5 top-2 rotate-[-12deg] font-[var(--font-poppins)] text-3xl font-black text-[#07391D]/70 sm:left-8"
            >
              ♪
            </span>

            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-1 left-[28%] rotate-12 font-[var(--font-poppins)] text-2xl font-black text-[#07391D]/55"
            >
              ♫
            </span>

            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-[30%] top-2 rotate-[-8deg] font-[var(--font-poppins)] text-3xl font-black text-[#07391D]/55"
            >
              ♪
            </span>

            <div
              className="
                relative
                flex
                min-h-[116px]
                flex-col
                items-start
                justify-center
                gap-6
                px-7
                py-7
                sm:min-h-[126px]
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:px-10
                lg:px-14
              "
            >
              {/* Playlist copy */}

              <div className="relative z-10 flex items-center gap-4 sm:gap-5">
                <span
                  className="
                    flex
                    size-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-[#07391D]
                    text-[#07391D]
                    sm:size-14
                  "
                >
                  <Music2 className="size-5 sm:size-6" strokeWidth={2.3} />
                </span>

                <div>
                  <p
                    className="
                      font-[var(--font-poppins)]
                      text-[clamp(1.35rem,3vw,2.25rem)]
                      font-black
                      uppercase
                      leading-[0.9]
                      tracking-[-0.055em]
                      text-[#FFF8E8]
                    "
                  >
                    Here&apos;s a playlist
                  </p>

                  <p
                    className="
                      mt-1.5
                      font-[var(--font-poppins)]
                      text-[clamp(0.76rem,1.5vw,1rem)]
                      font-black
                      uppercase
                      leading-none
                      tracking-[-0.015em]
                      text-[#07391D]
                    "
                  >
                    To turn up your playdate!
                  </p>
                </div>
              </div>

              {/* Spotify CTA */}

              <div
                className="
                  relative
                  z-10
                  flex
                  min-h-12
                  shrink-0
                  items-center
                  gap-3
                  rounded-full
                  border-2
                  border-[#07391D]
                  px-5
                  py-2.5
                  font-[var(--font-poppins)]
                  text-[0.68rem]
                  font-black
                  uppercase
                  text-[#07391D]
                  transition-all
                  duration-300
                  group-hover:bg-[#FFF8E8]
                  sm:min-h-14
                  sm:px-6
                  sm:text-xs
                "
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-[#07391D] text-[#20B95A] sm:size-9">
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[18px] fill-current">
                    <path d="M12 1.8A10.2 10.2 0 1 0 22.2 12 10.2 10.2 0 0 0 12 1.8Zm4.68 14.7a.62.62 0 0 1-.85.2c-2.34-1.43-5.28-1.75-8.75-.96a.62.62 0 1 1-.27-1.21c3.79-.87 7.04-.51 9.67 1.1a.62.62 0 0 1 .2.87Zm1.13-2.5a.78.78 0 0 1-1.07.25c-2.68-1.65-6.76-2.13-9.93-1.16a.78.78 0 1 1-.46-1.5c3.62-1.1 8.12-.56 11.2 1.33a.78.78 0 0 1 .26 1.08Zm.1-2.62c-3.22-1.91-8.54-2.09-11.62-1.16a.94.94 0 1 1-.54-1.8c3.54-1.07 9.43-.86 13.12 1.33a.94.94 0 0 1-.96 1.63Z" />
                  </svg>
                </span>

                <span>Listen on Spotify</span>

                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
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
