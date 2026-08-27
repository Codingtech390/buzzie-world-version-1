import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Reveal from "./Reveal";

const BARGAINS_IMAGE = "/images/banners/buzzie-bargains.png";

export default function KingdomBanner() {
  return (
    <section className="bg-[#FCFAF7] py-12 sm:py-16 lg:py-20">
      <div className="container">
        <Reveal>
          <div className="relative">
            {/* ------------------------------------------------------------ */}
            {/* BANNER                                                        */}
            {/* ------------------------------------------------------------ */}

            <Link
              href="/deals"
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
                href="/deals"
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
                Explore deals
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
  );
}
