import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

import Reveal from "./Reveal";

/* ==========================================================================
   LOCAL VIDEO LINKS
   Replace these five paths independently whenever you want.
   ========================================================================== */

const VIDEO_1 = "/images/instagram/video/Video-2.mp4";
const VIDEO_2 = "/images/instagram/video/Video-1.mp4";
const VIDEO_3 = "/images/instagram/video/Video-1.mp4";
const VIDEO_4 = "/images/instagram/video/Video-2.mp4";
const VIDEO_5 = "/images/instagram/video/Video-1.mp4";

/* ==========================================================================
   PRODUCT DATA
   Keep product data separate so each card can be connected to its own
   catalogue product later.
   ========================================================================== */

interface VideoCardData {
  id: number;
  video: string;
  productImage: string;
  productName: string;
  price: number;
  productHref: string;
}

const videoCards: VideoCardData[] = [
  {
    id: 1,
    video: VIDEO_1,
    productImage: "/images/instagram/instagram-product-thumb.png",
    productName: "The Ultimate Indian Drinking Game",
    price: 699,
    productHref: "/products/the-ultimate-indian-drinking-game",
  },
  {
    id: 2,
    video: VIDEO_2,
    productImage: "/images/instagram/instagram-product-thumb.png",
    productName: "The Ultimate Indian Drinking Game",
    price: 699,
    productHref: "/products/the-ultimate-indian-drinking-game",
  },
  {
    id: 3,
    video: VIDEO_3,
    productImage: "/images/instagram/instagram-product-thumb.png",
    productName: "The Ultimate Indian Drinking Game",
    price: 699,
    productHref: "/products/the-ultimate-indian-drinking-game",
  },
  {
    id: 4,
    video: VIDEO_4,
    productImage: "/images/instagram/instagram-product-thumb.png",
    productName: "The Ultimate Indian Drinking Game",
    price: 699,
    productHref: "/products/the-ultimate-indian-drinking-game",
  },
  {
    id: 5,
    video: VIDEO_5,
    productImage: "/images/instagram/instagram-product-thumb.png",
    productName: "The Ultimate Indian Drinking Game",
    price: 699,
    productHref: "/products/the-ultimate-indian-drinking-game",
  },
];

/* ==========================================================================
   VIDEO CARD
   ========================================================================== */

function VideoCard({ card, index }: { card: VideoCardData; index: number }) {
  return (
    <Reveal delay={index * 0.05}>
      <article
        className="
          group
          relative
          w-full
          overflow-hidden
          rounded-[10px]
          bg-[#17152A]
          shadow-[0_14px_32px_rgba(31,24,55,0.18)]
          transition-transform
          duration-300
          hover:-translate-y-1
        "
      >
        {/* ================================================================
            REEL

            Reference card:
            - 227px-ish wide on desktop
            - 423px total height
            - approximately 378px video + 45px action bar

            object-cover intentionally crops the source video slightly so
            there are no black letterbox areas above/below the card.
        ================================================================ */}
        <div
          className="
            relative
            h-[378px]
            w-full
            overflow-hidden
            bg-black
          "
        >
          <video
            src={card.video}
            className="
              absolute
              inset-0
              block
              h-full
              w-full
              object-cover
              object-center
            "
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            aria-label={`BuzzieWorld video ${card.id}`}
          />

          {/* ==============================================================
              PRODUCT OVERLAY

              Sits directly over the bottom of the video like the reference.
          ============================================================== */}
          <Link
            href={card.productHref}
            aria-label={`View ${card.productName}`}
            className="
              absolute
              inset-x-0
              bottom-0
              z-20
              flex
              min-h-[66px]
              items-center
              gap-2.5
              bg-gradient-to-t
              from-black/95
              via-black/75
              to-transparent
              px-2.5
              pb-2
              pt-7
              text-white
            "
          >
            <span
              className="
                relative
                h-10
                w-10
                shrink-0
                overflow-hidden
                rounded-[6px]
                border
                border-white/80
                bg-white
                shadow-[0_2px_8px_rgba(0,0,0,0.24)]
              "
            >
              <Image
                src={card.productImage}
                alt=""
                fill
                sizes="40px"
                className="object-contain p-0.5"
              />
            </span>

            <span className="min-w-0 leading-none">
              <span
                className="
                  block
                  line-clamp-2
                  text-[10px]
                  font-semibold
                  leading-[1.15]
                  text-white
                  sm:text-[11px]
                "
              >
                {card.productName}
              </span>

              <span
                className="
                  mt-1
                  block
                  text-[11px]
                  font-bold
                  leading-none
                  text-white
                  sm:text-[12px]
                "
              >
                ₹{card.price.toLocaleString("en-IN")}.00
              </span>
            </span>
          </Link>
        </div>

        {/* ================================================================
            ADD TO CART + WISHLIST

            Kept in the established BuzzieWorld purple / crimson treatment.
            Total card height remains exactly 423px.
        ================================================================ */}
        <div
          className="
            flex
            h-[45px]
            items-center
            gap-2
            bg-[#C391EE]
            px-2.5
          "
        >
          <button
            type="button"
            aria-label={`Add ${card.productName} to cart`}
            title="Add to Cart"
            className="
              flex
              h-[34px]
              min-w-0
              flex-1
              items-center
              justify-center
              gap-1.5
              rounded-full
              bg-[#E83D59]
              px-2
              text-[9px]
              font-extrabold
              uppercase
              tracking-[-0.01em]
              text-white
              shadow-[0_3px_9px_rgba(20,15,30,0.15)]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-[#D92F4D]
              active:translate-y-0
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-white
              focus-visible:ring-offset-1
              focus-visible:ring-offset-[#C391EE]
              sm:text-[10px]
            "
          >
            <ShoppingBag className="size-3 shrink-0" strokeWidth={2} />
            <span className="truncate">Add to Cart</span>
          </button>

          <button
            type="button"
            aria-label={`Add ${card.productName} to wishlist`}
            title="Wishlist"
            className="
              flex
              h-[34px]
              w-[34px]
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white
              text-[#7353A7]
              shadow-[0_3px_9px_rgba(20,15,30,0.12)]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:text-[#E83D59]
              active:translate-y-0
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-white
              focus-visible:ring-offset-1
              focus-visible:ring-offset-[#C391EE]
            "
          >
            <Heart className="size-[16px]" strokeWidth={2} />
          </button>
        </div>
      </article>
    </Reveal>
  );
}

/* ==========================================================================
   BANNER
   ========================================================================== */

const BARGAINS_IMAGE = "/images/banners/bargain-2.png";

export default function KingdomBanner() {
  return (
    <>
      {/* ====================================================================
          BUZZIE BARGAINS
      ==================================================================== */}
      <section className="bg-[#C391EE] py-12 sm:py-16 lg:py-20">
        <div className="container">
          <Reveal>
            <div className="relative">
              <Link
                href="/crazy-deals"
                aria-label="Explore BuzzieWorld deals"
                className="
                  group
                  relative
                  block
                  overflow-hidden
                  rounded-[8px]
                  transition-all
                  duration-500
                  hover:-translate-y-0.5
                  hover:shadow-[0_18px_50px_rgba(23,33,61,0.08)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#C391EE]
                  focus-visible:ring-offset-4
                  sm:rounded-[30px]
                  lg:rounded-[8px]
                "
              >
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

                <div className="relative w-full">
                  <Image
                    src={BARGAINS_IMAGE}
                    alt="Buzzie Bargains — up to 50% off"
                    width={1920}
                    height={1080}
                    priority={false}
                    sizes="100vw"
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
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================================================================
          WATCH & BUY
      ==================================================================== */}
      <section className="relative overflow-hidden bg-[#5C4AA5] py-12 sm:py-16 lg:py-20">
        <div className="container relative">
          <Reveal>
            <header
              className="
                mx-auto
                max-w-[900px]
                px-4
                text-center
                sm:px-6
              "
            >
              {/* Small themed eyebrow */}
              <div className="flex items-center justify-center gap-3">
                <span
                  aria-hidden="true"
                  className="
                    h-[2px]
                    w-8
                    rounded-full
                    bg-[#C391EE]
                    sm:w-10
                  "
                />

                <p
                  className="
                    font-[var(--font-poppins-brand)]
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-white/90
                    sm:text-[11px]
                  "
                >
                  Watch & Buy
                </p>

                <span
                  aria-hidden="true"
                  className="
                    h-2
                    w-2
                    rounded-full
                    bg-[#E83D59]
                  "
                />
              </div>

              {/* Main heading — Poppins Brand / BuzzieWorld typography */}
              <h2
                className="
                  mx-auto
                  mt-6
                  max-w-[900px]
                  text-balance
                  font-[var(--font-poppins-brand)]
                  text-[clamp(2.8rem,8vw,5.2rem)]
                  font-bold
                  uppercase
                  leading-[0.84]
                  tracking-[-0.035em]
                  text-white
                "
              >
                See it.
                <span className="text-[#FF6079]"> Love it.</span>
                <span className="text-[#E6D7FF]"> Take it home.</span>
              </h2>
            </header>
          </Reveal>

          {/* ==================================================================
              FIVE-CARD ROW

              Reference width is approximately 1,200px at desktop.
              5 cards + 4 × 16px gaps = ~1,200px.
          ================================================================== */}
          <div
            className="
              relative
              mx-auto
              mt-8
              w-full
              max-w-[1200px]
              sm:mt-10
              lg:mt-12
            "
          >
            <div
              className="
                -mx-4
                overflow-x-auto
                px-4
                pb-1
                touch-pan-x
                overscroll-x-contain
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
                  grid
                  w-full
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                  md:grid-cols-3
                  lg:grid-cols-5
                "
              >
                {videoCards.map((card, index) => (
                  <VideoCard key={card.id} card={card} index={index} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

