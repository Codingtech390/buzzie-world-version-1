"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { StorefrontSelector } from "@/types/storefront";

/* ============================================================================
   TYPES
============================================================================ */

interface CollectionShowcaseProps {
  /**
   * Kept in the props so the existing parent component does not need to
   * change. The return-gift section is now a single static artwork.
   */
  collections: StorefrontSelector[];
}

type InstagramPostType = "reel" | "post";

interface InstagramPost {
  id: number;
  type: InstagramPostType;
  image: string;
  url: string;
  alt: string;
}

/* ============================================================================
   INSTAGRAM DATA
============================================================================ */

const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 1,
    type: "reel",
    image: "/images/instagram/Instagram-1.png",
    url: "https://www.instagram.com/reel/DG-MToHozVz/",
    alt: "BuzzieWorld Instagram Reel",
  },
  {
    id: 2,
    type: "reel",
    image: "/images/instagram/Instagram-2.png",
    url: "https://www.instagram.com/buzzieworld.in/reel/DEmSOtTy122/",
    alt: "BuzzieWorld Instagram Reel",
  },
  {
    id: 3,
    type: "reel",
    image: "/images/instagram/Instagram-3.png",
    url: "https://www.instagram.com/reel/DG-MToHozVz/",
    alt: "BuzzieWorld Instagram Reel",
  },
  {
    id: 4,
    type: "reel",
    image: "/images/instagram/Instagram-4.png",
    url: "https://www.instagram.com/buzzieworld.in/reel/DEmSOtTy122/",
    alt: "BuzzieWorld Instagram Reel",
  },
  {
    id: 5,
    type: "reel",
    image: "/images/instagram/Instagram-5.png",
    url: "https://www.instagram.com/reel/DG-MToHozVz/",
    alt: "BuzzieWorld Instagram Reel",
  },
  {
    id: 6,
    type: "reel",
    image: "/images/instagram/Instagram-6.png",
    url: "https://www.instagram.com/buzzieworld.in/reel/DEmSOtTy122/",
    alt: "BuzzieWorld Instagram Reel",
  },
  {
    id: 7,
    type: "reel",
    image: "/images/instagram/Instagram-7.png",
    url: "https://www.instagram.com/buzzieworld.in/reel/DEmSOtTy122/",
    alt: "BuzzieWorld Instagram Reel",
  },
  {
    id: 8,
    type: "reel",
    image: "/images/instagram/Instagram-8.png",
    url: "https://www.instagram.com/buzzieworld.in/reel/DEmSOtTy122/",
    alt: "BuzzieWorld Instagram Reel",
  },
];

/* ============================================================================
   INSTAGRAM ICON
============================================================================ */

function InstagramIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle
        cx="17.25"
        cy="6.75"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}

/* ============================================================================
   ARROW ICON
============================================================================ */

function ArrowUpRightIcon({
  className = "h-4 w-4",
}: {
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7 17L17 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M8 7H17V16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ============================================================================
   INSTAGRAM CARD
============================================================================ */

function InstagramCard({
  post,
}: {
  post: InstagramPost;
}) {
  return (
    <article
      className="
        group
        relative
        mb-8
        flex
        w-[148px]
        shrink-0
        flex-col
        overflow-hidden
        rounded-[14px]
        border-0
        bg-white
        shadow-[0_6px_20px_rgba(39,52,74,0.11)]
        outline-none

        sm:w-[162px]
        md:w-[178px]
        lg:w-[194px]
        xl:w-[208px]
        2xl:w-[220px]
      "
    >
      {/* IMAGE */}
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${post.alt} on Instagram`}
        className="
          relative
          block
          w-full
          overflow-hidden
          bg-[#F4F4F4]
          outline-none
          focus-visible:ring-2
          focus-visible:ring-[#F20D58]
          focus-visible:ring-offset-2
        "
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src={post.image}
            alt={post.alt}
            fill
            unoptimized
            sizes="
              (max-width: 639px) 148px,
              (max-width: 767px) 162px,
              (max-width: 1023px) 178px,
              (max-width: 1279px) 194px,
              (max-width: 1535px) 208px,
              220px
            "
            className="
              object-cover
              transition-transform
              duration-500
              ease-out
              group-hover:scale-[1.04]
            "
          />

          {/* INSTAGRAM ICON */}
          <span
            aria-hidden="true"
            className="
              absolute
              left-2.5
              top-2.5
              flex
              size-7
              items-center
              justify-center
              rounded-full
              bg-black/55
              text-white
              backdrop-blur-sm
              sm:left-3
              sm:top-3
            "
          >
            <InstagramIcon className="size-3.5 sm:size-4" />
          </span>

          {/* REEL LABEL */}
          {post.type === "reel" && (
            <span
              className="
                absolute
                right-2.5
                top-2.5
                rounded-full
                bg-black/60
                px-2
                py-1
                font-[var(--font-poppins-brand)]
                text-[8px]
                font-bold
                tracking-[0.08em]
                text-white
                backdrop-blur-sm
                sm:right-3
                sm:top-3
                sm:text-[9px]
              "
            >
              REEL
            </span>
          )}
        </div>
      </a>

      {/* CARD FOOTER */}
      <div
        className="
          flex
          min-h-[40px]
          w-full
          items-center
          justify-between
          gap-1.5
          bg-[#C391EE]
          px-2.5
          py-2

          sm:min-h-[42px]
          sm:px-3

          md:min-h-[44px]
          md:px-3.5

          lg:min-h-[46px]
        "
      >
        <div className="min-w-0 flex-1">
          <p
            className="
              m-0
              truncate
              font-[var(--font-poppins-brand)]
              text-[10px]
              font-bold
              leading-tight
              text-white

              sm:text-[11px]
              md:text-[12px]
            "
          >
            BuzzieWorld
          </p>

          <p
            className="
              m-0
              truncate
              font-[var(--font-poppins-brand)]
              text-[8px]
              font-medium
              leading-tight
              text-white/80

              sm:text-[9px]
              md:text-[10px]
            "
          >
            {post.type === "reel"
              ? "Watch our Reel"
              : "View our post"}
          </p>
        </div>

        <span
          aria-hidden="true"
          className="
            flex
            size-6
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-white/20
            text-white
            transition-transform
            duration-300
            group-hover:translate-x-0.5

            sm:size-7
            md:size-8
          "
        >
          <ArrowUpRightIcon className="size-3 sm:size-3.5 md:size-4" />
        </span>
      </div>
    </article>
  );
}

/* ============================================================================
   INSTAGRAM CARD GROUP
============================================================================ */

function InstagramCardGroup({
  groupId,
}: {
  groupId: string;
}) {
  return (
    <div
      className="
        flex
        shrink-0
        items-stretch
        gap-3
        pr-3

        sm:gap-3.5
        sm:pr-3.5

        md:gap-4
        md:pr-4

        lg:gap-5
        lg:pr-5
      "
    >
      {INSTAGRAM_POSTS.map((post) => (
        <InstagramCard
          key={`${groupId}-${post.id}`}
          post={post}
        />
      ))}
    </div>
  );
}

/* ============================================================================
   COMPONENT
============================================================================ */

export default function CollectionShowcase({
  collections: _collections,
}: CollectionShowcaseProps) {
  return (
    <section
      aria-label="BuzzieWorld return gifts"
      className="
        relative
        w-full
        overflow-hidden
        bg-[#FFFDF9]
        pt-8
        pb-8

        sm:pt-10
        sm:pb-10

        lg:pt-12
        lg:pb-12
      "
    >
      {/* ======================================================================
          INSTAGRAM BANNER IMAGE
      ====================================================================== */}

      <div
        className="
          relative
          w-full
          overflow-hidden
        "
      >
        <Image
          src="/images/backgrounds/insta-video-banner.png"
          alt="BuzzieWorld"
          width={1920}
          height={700}
          priority
          quality={90}
          sizes="100vw"
          className="
            block
            h-auto
            w-full
            max-w-none
            object-contain
          "
        />
      </div>

      {/* ======================================================================
          INSTAGRAM HORIZONTAL MARQUEE

          This sits DIRECTLY below the Instagram banner image.
          Three groups are used so the animation can continuously loop.
      ====================================================================== */}

      {INSTAGRAM_POSTS.length > 0 && (
        <div
          className="
            relative
            w-full
            overflow-hidden
            bg-[#F8F1DE]
          "
        >
          {/* LEFT FADE */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-y-0
              left-0
              z-20
              w-8
              bg-gradient-to-r
              from-[#F8F1DE]
              to-transparent

              sm:w-12
              md:w-16
              lg:w-20
            "
          />

          {/* RIGHT FADE */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-y-0
              right-0
              z-20
              w-8
              bg-gradient-to-l
              from-[#F8F1DE]
              to-transparent

              sm:w-12
              md:w-16
              lg:w-20
            "
          />

          {/* MARQUEE */}
          <div className="relative w-full overflow-hidden">
            <div
              className="
                buzzie-instagram-marquee
                flex
                w-max
                items-stretch
              "
              style={{
                animation:
                  "buzzie-instagram-marquee-animation 30s linear infinite",
              }}
            >
              <InstagramCardGroup groupId="group-one" />

              <InstagramCardGroup groupId="group-two" />

              <InstagramCardGroup groupId="group-three" />
            </div>
          </div>

          {/* BOTTOM SPACING */}
          <div
            aria-hidden="true"
            className="
              h-6
              w-full

              sm:h-8
              md:h-10
              lg:h-12
            "
          />
        </div>
      )}

      {/* ======================================================================
          MAIN RESPONSIVE LAYOUT

          Mobile:
          - Copy first
          - Artwork below
          - Comfortable horizontal padding
          - Artwork contained so it does not overflow

          Desktop:
          - 25% copy
          - 75% artwork
      ====================================================================== */}

      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1920px]
          flex-col

          lg:flex-row
          lg:items-center
        "
      >
        {/* ====================================================================
            LEFT — COPY + CTA
        ==================================================================== */}

        <div
          className="
            order-1
            flex
            w-full
            flex-col
            items-center
            justify-center
            px-5
            text-center

            sm:px-8

            md:px-12

            lg:items-start
            lg:px-8
            lg:text-left

            xl:px-10

            2xl:px-14
          "
        >
          <div
            className="
              w-full
              max-w-[360px]

              sm:max-w-[460px]

              lg:max-w-[360px]
            "
          >
            {/* MAIN COPY */}

            <h2
              className="
                m-0
                w-full
                text-balance
                font-[var(--font-poppins-brand)]
                text-[clamp(2.45rem,11vw,4rem)]
                font-bold
                leading-[0.88]
                tracking-[-0.035em]
                text-[#111111]

                sm:text-[clamp(3rem,7vw,4rem)]

                lg:text-[clamp(3.2rem,4vw,4rem)]
              "
            >
              Looking for{" "}
              <span className="text-[#E83D59]">
                return gifts?
              </span>
            </h2>

            {/* CTA */}

            <div
              className="
                mt-5
                flex
                justify-center

                sm:mt-6

                lg:mt-8
                lg:justify-start
              "
            >
              <Link
                href="/return-gifts"
                className="
                  group
                  inline-flex
                  min-h-[46px]
                  max-w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-[#C391EE]
                  px-5
                  font-[var(--font-poppins-brand)]
                  text-[12px]
                  font-bold
                  leading-none
                  text-white
                  no-underline
                  shadow-[0_10px_24px_rgba(195,145,238,0.24)]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#E83D59]
                  hover:shadow-[0_14px_30px_rgba(232,61,89,0.20)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#E83D59]
                  focus-visible:ring-offset-3

                  sm:min-h-[50px]
                  sm:gap-2.5
                  sm:px-6
                  sm:text-[13px]

                  lg:min-h-[50px]
                  lg:px-6
                  lg:text-[13px]

                  xl:min-h-[54px]
                  xl:px-7
                  xl:text-[14px]
                "
              >
                <span className="text-white">
                  Explore return gifts
                </span>

                <span
                  aria-hidden="true"
                  className="
                    flex
                    size-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white/20
                    transition-transform
                    duration-300
                    group-hover:translate-x-0.5

                    sm:size-8
                  "
                >
                  <ArrowRight
                    className="size-3.5 text-white sm:size-4"
                    strokeWidth={2.5}
                  />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* ====================================================================
            RIGHT — RETURN GIFT ARTWORK
        ==================================================================== */}

        <div
          className="
            order-2
            relative
            mt-7
            w-full
            overflow-hidden

            sm:mt-8

            lg:mt-0
            lg:w-[75%]
            lg:flex-[0_0_75%]
          "
        >
          <Link
            href="/return-gifts"
            aria-label="Explore BuzzieWorld return gifts"
            className="
              group
              block
              w-full
              cursor-pointer
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#E83D59]
              focus-visible:ring-offset-2
            "
          >
            <img
              src="/images/return-gifts/return-gift.png"
              alt="BuzzieWorld return gifts for kids"
              className="
                mx-auto
                block
                h-auto
                w-full
                max-w-[680px]
                select-none
                object-contain
                transition-transform
                duration-500
                group-hover:scale-[1.01]

                sm:max-w-[820px]

                md:max-w-[980px]

                lg:mx-0
                lg:max-w-none
              "
              draggable={false}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
