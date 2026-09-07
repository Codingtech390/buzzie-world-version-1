import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Users, Zap, Star, ShoppingBag, ExternalLink, Play } from "lucide-react";

import Reveal from "./Reveal";


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
  {
    id: 5,
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
   VIDEO CARD
   ========================================================================== */

function VideoCard({
  card,
  index,
}: {
  card: VideoCardData;
  index: number;
}) {
  return (
    <div
      className="
      mb-8
        w-[72vw]
        min-w-[280px]
        max-w-[330px]
        shrink-0

        sm:w-auto
        sm:min-w-0
        sm:max-w-none
      "
    >
      <Reveal delay={index * 0.06}>
        <article
          className="
            group
            relative
            w-full
            min-w-0
            overflow-hidden
            rounded-[16px]
            border
            border-white/60
            bg-[#17152A]
            shadow-[0_12px_32px_rgba(30,25,45,0.10)]
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-[0_18px_42px_rgba(30,25,45,0.15)]
          "
        >
          {/* ============================================================
              VIDEO
          ============================================================ */}

          <Link
            href={`/videos/${card.id}`}
            className="
              relative
              block
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#a092cd]
              focus-visible:ring-inset
            "
            aria-label={`Watch ${card.title}`}
          >
            <VideoPreview card={card} />

            {/* Watch & Buy */}

            <span
              className="
                absolute
                left-3
                top-3
                z-20
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-white/92
                px-2.5
                py-1.5
                text-[0.5rem]
                font-black
                uppercase
                tracking-[0.12em]
                text-[#4F465B]
                shadow-[0_5px_15px_rgba(20,15,30,0.12)]
                backdrop-blur-sm
                sm:left-4
                sm:top-4
              "
            >
              <Play
                className="size-2.5 fill-[#a092cd] text-[#a092cd]"
                strokeWidth={2}
              />

              Watch & Buy
            </span>
          </Link>

          {/* ============================================================
              BOTTOM ACTION BAR
          ============================================================ */}

          <div
            className="
              relative
              z-30
              border-t
              border-white/10
              bg-[#C391EE]
              px-3
              py-2.5
              sm:px-4
              sm:py-3
            "
          >
            <div className="flex items-center gap-2">
              {/* Add to Cart */}

              <button
                type="button"
                aria-label={`Add ${card.title} to cart`}
                title="Add to Cart"
                className="
                  flex
                  h-8
                  flex-1
                  items-center
                  justify-center
                  rounded-full
                  bg-[#E83D59]
                  text-white
                  shadow-[0_4px_12px_rgba(20,15,30,0.16)]
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-[#8F7FBE]
                  active:translate-y-0
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-[#17152A]
                  sm:h-9
                "
              >
                <ShoppingBag
                  className="size-3.5"
                  strokeWidth={2}
                />
              </button>

              {/* View Product */}

              <Link
                href={`/videos/${card.id}`}
                aria-label={`View product for ${card.title}`}
                title="View Product"
                className="
                  flex
                  h-8
                  flex-1
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/10
                  text-white
                  shadow-[0_4px_12px_rgba(20,15,30,0.10)]
                  backdrop-blur-sm
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-white/60
                  hover:bg-[#C391EE]
                  hover:text-[#6F5A98]
                  active:translate-y-0
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#a092cd]
                  focus-visible:ring-offset-2
                  sm:h-9
                "
              >
                <ExternalLink
                  className="size-3.5 text-white"
                  strokeWidth={2}
                />
              </Link>
            </div>
          </div>
        </article>
      </Reveal>
    </div>
  );
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
        aspect-[15/16]
        min-h-0
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
        <Play
          className="ml-1 h-6 w-6 sm:h-7 sm:w-7"
          fill="#E91E63"
          strokeWidth={0}
        />
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



const BARGAINS_IMAGE = "/images/banners/buzzie-bargains.png";

export default function KingdomBanner() {
  return (
    <>
      <section className="bg-[#FCFAF7] py-12 sm:py-16 lg:py-20">
        <div className="container">
          <Reveal>
            <div className="relative">
              {/* ------------------------------------------------------------ */}
              {/* BANNER                                                        */}
              {/* ------------------------------------------------------------ */}

              <Link
                href="/crazy-deals"
                aria-label="Explore BuzzieWorld deals"
                className="
                group
                relative
                block
                overflow-hidden
                rounded-[24px]
                border
                border-[#E8E2DC]
                bg-white
                shadow-[0_12px_40px_rgba(23,33,61,0.055)]
                transition-all
                duration-500

                hover:-translate-y-0.5
                hover:shadow-[0_18px_50px_rgba(23,33,61,0.08)]

                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#C391EE]
                focus-visible:ring-offset-4

                sm:rounded-[30px]

                lg:rounded-[36px]
              "
              >
                {/* ---------------------------------------------------------- */}
                {/* TOP ACCENT                                                  */}
                {/* ---------------------------------------------------------- */}

                <span
                  aria-hidden="true"
                  className="
                  absolute
                  left-0
                  right-0
                  top-0
                  z-20
                  h-[3px]
                  bg-[#C391EE]
                "
                />

                {/* ---------------------------------------------------------- */}
                {/* IMAGE                                                       */}
                {/* ---------------------------------------------------------- */}

                <div
                  className="
                  relative
                  w-full
                  bg-[#FFF8F1]
                "
                >
                  <Image
                    src={BARGAINS_IMAGE}
                    alt="Buzzie Bargains — up to 50% off"
                    width={1920}
                    height={1080}
                    priority={false}
                    sizes="
                    100vw
                  "
                    className="
                    block
                    h-auto
                    w-full
                    object-contain
                    transition-transform
                    duration-700
                    ease-[cubic-bezier(0.22,1,0.36,1)]

                    group-hover:scale-[1.008]
                  "
                  />

                  {/* Very subtle image overlay on hover */}
                  <span
                    aria-hidden="true"
                    className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-white
                    opacity-0
                    transition-opacity
                    duration-500
                    group-hover:opacity-[0.025]
                  "
                  />
                </div>
              </Link>

              {/* ------------------------------------------------------------ */}
              {/* SMALL FOOTER                                                 */}
              {/* ------------------------------------------------------------ */}

              <div
                className="
                flex
                items-center
                justify-between
                px-1
                pt-4

                sm:px-2
                sm:pt-5
              "
              >
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="
                    size-1.5
                    rounded-full
                    bg-[#C391EE]
                  "
                  />

                  <span
                    className="
                    font-[var(--font-poppins)]
                    text-[7px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-[#8B919C]

                    sm:text-[8px]
                  "
                  >
                    Play · Learn · Grow
                  </span>
                </div>

                <Link
                  href="/return-gifts"
                  className="
                  group/shop
                  inline-flex
                  items-center
                  gap-1.5
                  font-[var(--font-poppins)]
                  text-[7px]
                  font-black
                  uppercase
                  tracking-[0.08em]
                  text-[#17213D]
                  transition-colors

                  hover:text-[#C391EE]

                  sm:text-[8px]
                "
                >
                  Explore Return Gifts
                  <ArrowRight
                    className="
                    size-3
                    transition-transform
                    duration-300
                    group-hover/shop:translate-x-0.5
                  "
                    strokeWidth={2.5}
                  />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

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
            WATCH & BUY
        ================================================================== */}

        <Reveal>
          <header
            className="
            mt-8
              mx-auto
              max-w-[760px]
              px-4
              text-center
              sm:px-6
            "
          >
            <div className="flex items-center justify-center gap-3">
              <span className="h-[2px] w-8 rounded-full bg-[#a092cd] sm:w-10" />

              <p
                className="
                  text-[0.56rem]
                  font-black
                  uppercase
                  tracking-[0.19em]
                  text-[#7353A7]
                  sm:text-[0.65rem]
                  xl:text-[13px]
                "
              >
                Watch & Buy
              </p>

              <span className="h-2 w-2 rounded-full bg-[#E91E63]" />
            </div>

            <h2
              className="
              uppercase
                mx-auto
                mt-3
                text-balance
                font-[var(--font-roboto)]
                text-[clamp(2.25rem,5.5vw,3.9rem)]
                font-black
                leading-[0.95]
                tracking-[-0.055em]
                text-[#15121C]
              "
            >
              See it.
              <span className="text-[#E91E63]"> Love it.</span>
              <br />
              <span className="text-[#7353A7]"> Take it home.</span>
            </h2>

            <p
              className="
                mx-auto
                mt-4
                w-full
                max-w-[620px]
                text-center
                text-[0.82rem]
                leading-[1.75]
                text-[#62606B]
                sm:text-[0.95rem]
                sm:leading-7
              "
            >
              Watch how the fun comes to life, discover your next favourite, and shop it in just a
              tap.
            </p>
          </header>
        </Reveal>

        <div
          className="
    relative
    mx-auto
    mt-6
    max-w-[1150px]
    sm:mt-7
    lg:mt-8
  "
        >
          {/* ================================================================
      MOBILE / SMALL DEVICES
      Horizontal scrolling carousel

      DESKTOP
      Normal multi-column grid
  ================================================================ */}

          <div
            className="
      -mx-4
      overflow-x-auto
      px-4
      pb-5
      overscroll-x-contain
      touch-pan-x
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
        w-max
        min-w-full
        items-stretch
        gap-3

        sm:w-auto
        sm:min-w-0
        sm:grid
        sm:grid-cols-2
        sm:gap-4

        md:grid-cols-3
        md:gap-4

        lg:grid-cols-5
        lg:gap-3

        xl:gap-4
      "
            >
              {videoCards.map((card, index) => (
                <VideoCard key={card.id} card={card} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
