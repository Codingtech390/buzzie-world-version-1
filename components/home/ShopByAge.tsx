"use client";

import Link from "next/link";
import { ArrowRight, Heart, Play, Star, Users, Zap } from "lucide-react";

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
   VIDEO PREVIEW
   ========================================================================== */

function VideoPreview({ card }: { card: VideoCardData }) {
  return (
    <div
      className="
        group/video
        relative
        aspect-[1.52/1]
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
        className={`
          group
          relative
          w-[78vw]
          max-w-[350px]
          shrink-0
          overflow-hidden
          rounded-[22px]
          border
          border-[#17152A]/[0.075]
          bg-white
          shadow-[0_18px_45px_rgba(30,25,45,0.075)]
          transition-all
          duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]
          hover:-translate-y-2
          hover:shadow-[0_28px_60px_rgba(30,25,45,0.13)]
          sm:w-full
          sm:max-w-none
          ${card.rotation}
        `}
      >
        <VideoPreview card={card} />

        <div
          className="
            px-4
            pb-5
            pt-4
            sm:px-5
            sm:pb-6
            sm:pt-5
          "
        >
          <div className="flex items-start gap-3.5 sm:gap-4">
            {/* Icon */}

            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                sm:h-11
                sm:w-11
              "
              style={{
                backgroundColor: card.accentSoft,
                color: card.accent,
              }}
            >
              <CardIcon type={card.icon} />
            </div>

            {/* Heading */}

            <div className="min-w-0">
              <p
                className="
                  text-[0.5rem]
                  font-black
                  uppercase
                  tracking-[0.16em]
                  sm:text-[0.56rem]
                  sm:tracking-[0.17em]
                "
                style={{
                  color: card.accent,
                }}
              >
                {card.eyebrow}
              </p>

              <h3
                className="
                  mt-1
                  text-[0.95rem]
                  font-extrabold
                  leading-[1.12]
                  tracking-[-0.025em]
                  text-[#151329]
                  sm:text-[1.08rem]
                "
              >
                {card.title}
              </h3>
            </div>
          </div>

          <p
            className="
              mt-3
              pl-[53px]
              text-[0.7rem]
              leading-[1.45]
              text-[#686571]
              sm:mt-4
              sm:pl-[59px]
              sm:text-[0.78rem]
              sm:leading-5
            "
          >
            {card.description}
          </p>
        </div>
      </article>
    </Reveal>
  );
}

/* ==========================================================================
   BENEFITS STRIP
   ========================================================================== */

function BenefitsStrip() {
  const items = [
    {
      icon: "star" as const,
      title: (
        <>
          Made for
          <br />
          Real Fun
        </>
      ),
      text: (
        <>
          Games that get
          <br />
          everyone talking.
        </>
      ),
      bg: "#F1E9FF",
      color: "#8D55E8",
    },
    {
      icon: "users" as const,
      title: (
        <>
          Loved by
          <br />
          Thousands
        </>
      ),
      text: (
        <>
          Join thousands of
          <br />
          happy players.
        </>
      ),
      bg: "#FFF1DF",
      color: "#F1A348",
    },
    {
      icon: "zap" as const,
      title: (
        <>
          Zero Boring
          <br />
          Moments
        </>
      ),
      text: (
        <>
          Every card brings
          <br />
          something new.
        </>
      ),
      bg: "#F1E9FF",
      color: "#8D55E8",
    },
    {
      icon: "heart" as const,
      title: (
        <>
          Memories
          <br />
          Guaranteed
        </>
      ),
      text: (
        <>
          Nights you'll laugh
          <br />
          about forever.
        </>
      ),
      bg: "#FDEAF2",
      color: "#E91E63",
    },
  ];

  return (
    <Reveal delay={0.15}>
      <div
        className="
          mx-auto
          mt-9
          max-w-[1120px]
          overflow-hidden
          rounded-[26px]
          border
          border-[#17152A]/[0.07]
          bg-white
          shadow-[0_16px_42px_rgba(30,25,45,0.055)]
          sm:mt-11
          lg:mt-12
        "
      >
        <div className="grid grid-cols-2 md:grid-cols-4">
          {items.map((item, index) => (
            <div
              key={index}
              className={`
                flex
                items-center
                gap-3
                px-4
                py-4
                sm:gap-3.5
                sm:px-6
                sm:py-5
                ${index === 1 ? "border-l border-[#17152A]/[0.08] md:border-l-0" : ""}
                ${index === 2 ? "border-t border-[#17152A]/[0.08] md:border-t-0" : ""}
                ${
                  index === 3
                    ? "border-l border-t border-[#17152A]/[0.08] md:border-l-0 md:border-t-0"
                    : ""
                }
                ${index < 3 ? "md:border-r md:border-[#17152A]/[0.08]" : ""}
              `}
            >
              {/* Icon */}

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  sm:h-11
                  sm:w-11
                "
                style={{
                  backgroundColor: item.bg,
                  color: item.color,
                }}
              >
                <CardIcon type={item.icon} />
              </div>

              {/* Text */}

              <div className="min-w-0">
                <h4
                  className="
                    text-[0.68rem]
                    font-extrabold
                    leading-[1.18]
                    text-[#17152A]
                    sm:text-[0.8rem]
                  "
                >
                  {item.title}
                </h4>

                <p
                  className="
                    mt-1
                    text-[0.54rem]
                    leading-[1.45]
                    text-[#77737D]
                    sm:text-[0.63rem]
                    sm:leading-4
                  "
                >
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */

export default function ShopByAge({ products: _products }: ShopByAgeProps) {
  return (
    <section
      className="
        relative
        isolate
        overflow-hidden
        bg-white
        py-14
        sm:py-18
        lg:py-20
      "
    >
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
            HEADER
        ================================================================== */}

        <Reveal>
          <header
            className="
      mx-auto
      flex
      w-full
      max-w-[1000px]
      flex-col
      items-center
      px-4
      text-center
      sm:px-6
    "
          >
            {/* Eyebrow */}
            <div
              className="
        flex
        items-center
        justify-center
        gap-3
      "
            >
              <span className="h-[2px] w-8 rounded-full bg-[#E91E63] sm:w-10" />

              <p
                className="
          text-[0.56rem]
          font-black
          uppercase
          tracking-[0.19em]
          text-[#E91E63]
          sm:text-[0.65rem]
        "
              >
                BuzzieWorld in action
              </p>

              <span className="h-2 w-2 rounded-full bg-[#F1A348]" />
            </div>

            {/* Main heading */}
            <h2
              className="
        mx-auto
        mt-5
        w-full
        max-w-[1000px]
        text-balance
        text-[clamp(2.65rem,6vw,5.6rem)]
        font-black
        leading-[0.91]
        tracking-[-0.065em]
        text-[#15121C]
      "
            >
              Play more.
              <br />
              <span className="text-[#E91E63]">Discover more.</span>
            </h2>

            {/* Description */}
            <div className="mx-auto mt-5 flex w-full justify-center sm:mt-6">
              <p
                className="
          mx-auto
          w-full
          max-w-[610px]
          text-center
          text-[0.8rem]
          leading-[1.65]
          text-[#62606B]
          sm:text-[0.93rem]
          sm:leading-7
        "
              >
                See BuzzieWorld in action — games, discoveries and moments that turn ordinary
                playtime into something worth remembering.
              </p>
            </div>
          </header>
        </Reveal>

        {/* ==================================================================
            VIDEO CARDS
        ================================================================== */}

        <div
          className="
            relative
            mx-auto
            mt-9
            max-w-[1150px]
            sm:mt-11
            lg:mt-12
          "
        >
          {/* Mobile / tablet horizontal scrolling */}

          <div
            className="
              -mx-4
              overflow-x-auto
              px-4
              pb-5
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              sm:mx-0
              sm:overflow-visible
              sm:px-0
              sm:pb-0
            "
          >
            <div
              className="
                flex
                gap-4
                sm:grid
                sm:grid-cols-2
                sm:gap-5
                lg:grid-cols-4
                lg:gap-5
                xl:gap-6
              "
            >
              {videoCards.map((card, index) => (
                <VideoCard key={card.id} card={card} index={index} />
              ))}
            </div>
          </div>
        </div>

        {/* ==================================================================
            BENEFITS
        ================================================================== */}

        <BenefitsStrip />

        {/* ==================================================================
            CTA
        ================================================================== */}

        <Reveal delay={0.22}>
          <div
            className="
              mt-8
              flex
              justify-center
              sm:mt-9
              lg:mt-10
            "
          >
            <Link
              href="/shop"
              className="
    group
    inline-flex
    min-h-[50px]
    items-center
    justify-center
    gap-3
    rounded-full
    bg-[#C391EE]
    px-6
    text-[0.78rem]
    font-extrabold
    text-white
    shadow-[0_14px_30px_rgba(111,50,245,0.22)]
    transition-all
    duration-300
    hover:-translate-y-1
    hover:bg-[#E83D59]
    hover:shadow-[0_18px_38px_rgba(111,50,245,0.3)]
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-[#6F32F5]
    focus-visible:ring-offset-4
    sm:min-h-[54px]
    sm:px-8
    sm:text-[0.84rem]
  "
            >
              <span className="text-white">Watch More Videos</span>

              <span
                className="
      flex
      h-7
      w-7
      items-center
      justify-center
      rounded-full
      bg-white/20
      sm:h-8
      sm:w-8
    "
              >
                <ArrowRight
                  className="
        h-4
        w-4
        text-white
        transition-transform
        duration-300
        group-hover:translate-x-1
      "
                  strokeWidth={2.2}
                />
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
