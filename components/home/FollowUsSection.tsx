"use client";

import Image from "next/image";

/* ============================================================================
   TYPES
   ============================================================================ */

type InstagramPostType = "reel" | "post";

interface InstagramPost {
  id: number;
  type: InstagramPostType;
  image: string;
  url: string;
  alt: string;
}

/* ============================================================================
   INSTAGRAM POSTS
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
   ICONS
   ============================================================================ */

function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.25" cy="6.75" r="1" fill="currentColor" />
    </svg>
  );
}

function ArrowUpRightIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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

function InstagramCard({ post }: { post: InstagramPost }) {
  return (
    <article
      className="
        group relative flex w-[148px] shrink-0 flex-col overflow-hidden
        rounded-[14px] border-0 bg-white
        shadow-[0_6px_20px_rgba(39,52,74,0.11)] outline-none mb-8

        sm:w-[162px]
        md:w-[178px]
        lg:w-[194px]
        xl:w-[208px]
        2xl:w-[220px]
      "
    >
      <a
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open ${post.alt} on Instagram`}
        className="
          relative block w-full overflow-hidden bg-[#F4F4F4] outline-none
          focus-visible:ring-2 focus-visible:ring-[#F20D58] focus-visible:ring-offset-2
        "
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src={post.image}
            alt={post.alt}
            fill
            unoptimized
            sizes="
              (max-width: 640px) 148px,
              (max-width: 768px) 162px,
              (max-width: 1024px) 178px,
              (max-width: 1280px) 194px,
              220px
            "
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />

          {/* Instagram icon */}
          <span
            aria-hidden="true"
            className="
              pointer-events-none absolute right-2 top-2 z-10
              flex h-6 w-6 items-center justify-center rounded-full
              bg-white text-[#F20D58] shadow-[0_2px_8px_rgba(0,0,0,0.13)]

              sm:right-2.5 sm:top-2.5
              md:h-7 md:w-7
            "
          >
            <InstagramIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
          </span>

          {/* REEL label */}
          {post.type === "reel" && (
            <span
              className="
                absolute bottom-2 left-2 z-10 rounded-full bg-black/75
                px-2 py-1 text-[7px] font-extrabold uppercase leading-none
                tracking-wide text-white backdrop-blur-sm

                sm:bottom-2.5 sm:left-2.5 sm:text-[7.5px]
                md:text-[8px]
              "
            >
              REEL
            </span>
          )}
        </div>
      </a>

      {/* Footer */}
      <div
        className="
          flex min-h-[40px] w-full items-center justify-between gap-1.5
          bg-white px-2.5 py-2

          sm:min-h-[42px] sm:px-3
          md:min-h-[44px] md:px-3.5
          lg:min-h-[46px]
        "
      >
        <div className="min-w-0 flex-1">
          <p
            className="
              truncate text-[8px] font-extrabold uppercase leading-none
              tracking-[0.04em] text-[#27344A]

              sm:text-[8.5px]
              md:text-[9px]
            "
          >
            BuzzieWorld
          </p>
          <p
            className="
              mt-1 truncate text-[7px] leading-none text-[#7A8495]

              sm:text-[7.5px]
              md:text-[8px]
            "
          >
            {post.type === "reel" ? "Watch our Reel" : "View our post"}
          </p>
        </div>

        <span
          aria-hidden="true"
          className="
            flex h-5 w-5 shrink-0 items-center justify-center rounded-full
            bg-[#FFF0F5] text-[#F20D58] transition-colors duration-200
            group-hover:bg-[#F20D58] group-hover:text-white

            sm:h-5.5 sm:w-5.5
            md:h-6 md:w-6
          "
        >
          <ArrowUpRightIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5" />
        </span>
      </div>
    </article>
  );
}

/* ============================================================================
   CARD GROUP
   ============================================================================ */

function InstagramCardGroup({ groupId }: { groupId: string }) {
  return (
    <div className="flex shrink-0 items-stretch gap-3 pr-3 sm:gap-3.5 sm:pr-3.5 md:gap-4 md:pr-4 lg:gap-5 lg:pr-5">
      {INSTAGRAM_POSTS.map((post) => (
        <InstagramCard key={`${groupId}-${post.id}`} post={post} />
      ))}
    </div>
  );
}

/* ============================================================================
   FOLLOW US SECTION
   ============================================================================ */

export default function FollowUsSection() {
  if (INSTAGRAM_POSTS.length === 0) return null;

  return (
    <section
      aria-label="Follow BuzzieWorld on Instagram"
      className="relative isolate w-full max-w-full overflow-hidden bg-[#F8F1DE]"
    >
      {/* Background */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0 -z-10
          bg-[#F8F1DE]
          bg-[url('/images/backgrounds/perfect-background.png')]
          bg-cover bg-center bg-no-repeat
        "
      />

      <div className="relative w-full max-w-full overflow-hidden pt-1 pb-5 sm:pt-2 sm:pb-6 md:pt-3 md:pb-7 lg:pt-4 lg:pb-8">
        {/* Heading */}
        <div className="mx-auto w-[94%] max-w-[1150px] sm:w-[90%] md:w-[84%] lg:w-[78%] xl:w-[72%]">
          <Image
            src="/images/backgrounds/perfect-heading.png"
            alt="The perfect birthday gift page doesn't exist. Follow us on Instagram."
            width={2048}
            height={682}
            priority={false}
            unoptimized
            className="block h-auto w-full select-none"
          />
        </div>

        <div className="h-2 sm:h-3 md:h-4 lg:h-5" />

        {/* Marquee viewport */}
        <div className="relative w-full max-w-full overflow-hidden">
          {/* Left fade */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-3 bg-gradient-to-r from-[#F8F1DE] to-transparent sm:w-5 md:w-7 lg:w-10"
          />
          {/* Right fade */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-3 bg-gradient-to-l from-[#F8F1DE] to-transparent sm:w-5 md:w-7 lg:w-10"
          />

          {/* Moving track */}
          <div
            className="buzzie-instagram-marquee"
            style={{
              animation: "buzzie-instagram-marquee-animation 30s linear infinite",
            }}
          >
            <InstagramCardGroup groupId="group-one" />
            <InstagramCardGroup groupId="group-two" />
            <InstagramCardGroup groupId="group-three" />
          </div>
        </div>

        <div className="h-4 sm:h-5 md:h-6 lg:h-7" />
      </div>
    </section>
  );
}
