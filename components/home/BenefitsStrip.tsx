"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowRight, Heart, ShieldCheck, Smile, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { StorefrontProduct } from "@/types/storefront";
import Reveal from "./Reveal";

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

interface BenefitsStripProps {
  bestsellingProducts?: StorefrontProduct[];
}

/* -------------------------------------------------------------------------- */
/*                                  ASSETS                                    */
/* -------------------------------------------------------------------------- */

const THEMED_STAR = "/images/hero/themed-icons/themed-star-red.png";

const RIGHT_KIDS = "/images/benefits-vectors/shop-by-age-kid-right.png";

/* -------------------------------------------------------------------------- */
/*                                  COLORS                                    */
/* -------------------------------------------------------------------------- */

const CRIMSON = "#E72D5A";
const PURPLE = "#C391EE";
const PURPLE_DARK = "#A96FDB";
const NAVY = "#17213D";
const MUTED = "#687489";

/* -------------------------------------------------------------------------- */
/*                               AGE GROUPS                                   */
/* -------------------------------------------------------------------------- */

const ageGroups = [
  {
    age: "1–3 YEARS",
    title: "Early Explorers",
    description: "Simple, safe play for little learners.",
    slug: "1-3-years",
    image: "/images/shop-by-age/1.avif",
    tone: "#F8D8E5",
    accent: "#E72D5A",
  },
  {
    age: "3–6 YEARS",
    title: "Play & Discover",
    description: "Hands-on fun that sparks imagination.",
    slug: "3-6-years",
    image: "/images/shop-by-age/2.avif",
    tone: "#F8E5B7",
    accent: "#E99A25",
  },
  {
    age: "6–9 YEARS",
    title: "Learn & Grow",
    description: "Build skills through curiosity and play.",
    slug: "6-9-years",
    image: "/images/shop-by-age/3.avif",
    tone: "#D9E9B8",
    accent: "#6CA83A",
  },
  {
    age: "9–15 YEARS",
    title: "Think & Master",
    description: "Challenges for curious, growing minds.",
    slug: "9-15-years",
    image: "/images/shop-by-age/4.avif",
    tone: "#DCD2F3",
    accent: "#7550A5",
  },
] as const;

/* -------------------------------------------------------------------------- */
/*                                  BENEFITS                                  */
/* -------------------------------------------------------------------------- */

const benefits = [
  {
    title: "Safe & Screen-free",
    description: "Thoughtful experiences made for curious minds.",
    icon: ShieldCheck,
  },
  {
    title: "Loved by Parents",
    description: "Picked with real families and real life in mind.",
    icon: Heart,
  },
  {
    title: "Designed to Learn",
    description: "Build skills naturally through play and discovery.",
    icon: Trophy,
  },
  {
    title: "Made for Real Life",
    description: "Fun products children actually want to use.",
    icon: Smile,
  },
] as const;

/* -------------------------------------------------------------------------- */
/*                              MOTION CONFIG                                 */
/* -------------------------------------------------------------------------- */

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
/* -------------------------------------------------------------------------- */
/*                              DECORATIVE STAR                               */
/* -------------------------------------------------------------------------- */

function DecorativeStar({ className = "", size = 20 }: { className?: string; size?: number }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute z-[1] ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <Image
        src={THEMED_STAR}
        alt=""
        width={60}
        height={60}
        className="h-full w-full object-contain"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            RIGHT CHILDREN                                   */
/* -------------------------------------------------------------------------- */

function RightKidsVisual() {
  return (
    <div
      aria-hidden="true"
      className="
        relative
        z-10
        mx-auto
        mt-7
        h-[190px]
        w-[220px]
        shrink-0

        sm:mt-8
        sm:h-[225px]
        sm:w-[255px]

        md:h-[255px]
        md:w-[290px]

        lg:absolute
        lg:right-[0px]
        lg:top-[-8px]
        lg:mt-0
        lg:h-[330px]
        lg:w-[315px]

        xl:right-[18px]
        xl:top-[-10px]
        xl:h-[355px]
        xl:w-[340px]
      "
    >
      <Image
        src={RIGHT_KIDS}
        alt=""
        fill
        priority
        sizes="(max-width: 639px) 220px, (max-width: 767px) 255px, (max-width: 1023px) 290px, (max-width: 1279px) 315px, 340px"
        className="
          select-none
          object-contain
          object-center

          lg:object-right-top
        "
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              BENEFITS ROW                                  */
/* -------------------------------------------------------------------------- */

function BenefitsRow() {
  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-[22px]
        border
        border-[#E7DFEF]
        bg-white
        shadow-[0_10px_35px_rgba(23,33,61,0.055)]

        sm:rounded-[25px]

        lg:rounded-[28px]
      "
    >
      <div
        className="
          grid
          grid-cols-1

          sm:grid-cols-2

          lg:grid-cols-4
        "
      >
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;

          return (
            <div
              key={benefit.title}
              className={`
                flex
                min-h-[82px]
                items-center
                gap-3
                px-4
                py-4

                sm:min-h-[92px]
                sm:px-5
                sm:py-5

                lg:min-h-[98px]
                lg:px-6
                lg:py-5

                ${
                  index < benefits.length - 1
                    ? "border-b border-[#E7DFEF] lg:border-b-0 lg:border-r"
                    : ""
                }

                ${index === 0 ? "sm:border-r sm:border-[#E7DFEF] lg:border-r" : ""}

                ${index === 2 ? "sm:border-r sm:border-[#E7DFEF] lg:border-r" : ""}
              `}
            >
              <span
                className="
                  flex
                  size-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-[#C391EE]
                  shadow-[0_4px_14px_rgba(23,33,61,0.07)]

                  sm:size-11

                  lg:size-12
                "
              >
                <Icon
                  className="
                    size-[18px]
                    sm:size-[19px]
                    lg:size-6
                  "
                  strokeWidth={1.8}
                />
              </span>

              <div className="min-w-0">
                <p
                  className="
                    font-[var(--font-poppins)]
                    text-[10px]
                    font-black
                    leading-[1.25]
                    tracking-[-0.01em]
                    text-[#17213D]

                    sm:text-[11px]

                    lg:text-[14px]
                  "
                >
                  {benefit.title}
                </p>

                <p
                  className="
                    mt-1
                    max-w-[240px]
                    font-[var(--font-poppins)]
                    text-[8px]
                    leading-[1.5]
                    text-[#7C8493]

                    sm:text-[8.5px]

                    lg:text-[10px]
                  "
                >
                  {benefit.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              AGE TILE                                      */
/* -------------------------------------------------------------------------- */

function AgeTile({ age }: { age: (typeof ageGroups)[number] }) {
  return (
    <motion.div variants={itemVariants} className="min-w-0">
      <Link
        href={`/shop/age/${age.slug}`}
        aria-label={`Shop products for ${age.age}`}
        className="group block h-full"
      >
        <motion.div
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.985 }}
          transition={{
            duration: 0.25,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            flex
            h-full
            flex-col
            items-center
            overflow-hidden
            rounded-[28px]
            bg-white
            px-4
            pb-5
            pt-5
            shadow-[0_8px_28px_rgba(23,33,61,0.035)]
            transition-all
            duration-300

            sm:rounded-[32px]
            sm:px-5
            sm:pb-6
            sm:pt-6

            lg:px-6
            lg:pb-7
            lg:pt-7
          "
        >
          {/* IMAGE CIRCLE */}

          <div
            className="
              relative
              flex
              aspect-square
              w-[150px]
              shrink-0
              items-center
              justify-center
              rounded-full
              transition-transform
              duration-500
              ease-[cubic-bezier(0.22,1,0.36,1)]

              group-hover:scale-[1.035]

              sm:w-[170px]

              md:w-[185px]

              lg:w-[205px]

              xl:w-[250px]
            "
          >
            {/* Soft base */}
            <div
              aria-hidden="true"
              className="
                absolute
                inset-0
                rounded-full
              "
            />

            {/* Dashed editorial ring */}
            <div
              aria-hidden="true"
              className="
                absolute
                inset-[7px]
                rounded-full
                border
                border-dashed
                border-white/90
              "
            />

            {/* Soft inner glow */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                rounded-full
                bg-[radial-gradient(circle_at_50%_34%,rgba(255,255,255,0.8),transparent_62%)]
              "
            />

            {/* Age illustration */}
            <Image
              src={age.image}
              alt=""
              fill
              sizes="
                (max-width: 639px) 150px,
                (max-width: 767px) 170px,
                (max-width: 1023px) 185px,
                (max-width: 1279px) 205px,
                220px
              "
              className="
                relative
                z-10
                object-contain
                p-2
                transition-transform
                duration-500
                group-hover:scale-[1.04]
              "
            />
          </div>

          {/* TEXT */}

          <div className="mt-5 text-center sm:mt-6">
            <h4
              className="
                font-[var(--font-roboto)]
                text-[16px]
                font-black
                tracking-[-0.035em]
                text-[#17213D]

                sm:text-[17px]

                lg:text-[18px]
              "
            >
              {age.title}
            </h4>

            <p
              className="
                mx-auto
                mt-1.5
                max-w-[190px]
                font-[var(--font-poppins)]
                text-[8.5px]
                leading-[1.55]
                text-[#7A8391]

                sm:text-[9px]

                lg:text-[9.5px]
              "
            >
              {age.description}
            </p>

            <span
              className="
                mt-4
                inline-flex
                items-center
                gap-1.5
                font-[var(--font-poppins)]
                text-[8px]
                font-black
                uppercase
                tracking-[0.08em]
                text-[#C391EE]
                transition-colors
                duration-300

                group-hover:text-[#A96FDB]

                sm:text-[8.5px]
              "
            >
              Explore age group
              <ArrowRight
                className="
                  size-3
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
                strokeWidth={2.5}
              />
            </span>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            MAIN COMPONENT                                  */
/* -------------------------------------------------------------------------- */

export default function BenefitsStrip({ bestsellingProducts = [] }: BenefitsStripProps) {
  /*
   * Kept intentionally for backwards compatibility.
   * The redesigned section does not currently need
   * bestsellingProducts directly.
   */
  void bestsellingProducts;

  return (
    <section
      className="
        relative
        z-10
        overflow-hidden
        bg-white
        py-10

        sm:py-14

        lg:py-18

        xl:py-20
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-[1380px]
          px-4

          sm:px-6

          lg:px-8

          xl:px-10
        "
      >
        <Reveal>
          <div
            className="
              relative
              overflow-hidden
              rounded-[28px]
              border
              border-[#EAE5DF]
              bg-white
              px-5
              py-7
              shadow-[0_16px_55px_rgba(23,33,61,0.045)]

              sm:rounded-[34px]
              sm:px-8
              sm:py-9

              md:px-10

              lg:rounded-[42px]
              lg:px-12
              lg:py-11

              xl:px-14
            "
          >
            {/* ---------------------------------------------------------------- */}
            {/* SOFT BACKGROUND                                                  */}
            {/* ---------------------------------------------------------------- */}

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -left-40
                top-0
                size-80
                rounded-full
                bg-[#E72D5A]/[0.018]
                blur-[90px]
              "
            />

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -right-40
                top-0
                size-96
                rounded-full
                bg-[#C391EE]/[0.055]
                blur-[90px]
              "
            />

            {/* Small editorial details */}

            <DecorativeStar
              className="
                left-[4%]
                top-[8%]
                opacity-30

                sm:left-[5%]
              "
              size={14}
            />

            <DecorativeStar
              className="
                bottom-[28%]
                right-[3%]
                rotate-[-10deg]
                opacity-25
              "
              size={13}
            />

            {/* ================================================================== */}
            {/* HERO                                                               */}
            {/* ================================================================== */}

            <div
              className="
                relative
                flex
                flex-col

                lg:min-h-[490px]
              "
            >
              {/* -------------------------------------------------------------- */}
              {/* HERO VISUAL                                                    */}
              {/* -------------------------------------------------------------- */}

              <RightKidsVisual />

              {/* -------------------------------------------------------------- */}
              {/* HERO COPY                                                      */}
              {/* -------------------------------------------------------------- */}

              <div
                className="
                  relative
                  z-20
                  mt-1
                  w-full

                  lg:mt-0
                  lg:max-w-[610px]
                  lg:pt-3
                  xl:pt-4
                "
              >
                {/* Eyebrow */}

                <div
                  className="
                    mb-4
                    flex
                    items-center
                    gap-2

                    sm:mb-5
                  "
                >
                  <span
                    className="
                      h-[2px]
                      w-7
                      rounded-full
                      bg-[#E72D5A]

                      sm:w-8
                    "
                  />

                  <span
                    className="
                      font-[var(--font-poppins)]
                      text-[8px]
                      font-black
                      uppercase
                      tracking-[0.18em]
                      text-[#E72D5A]

                      sm:text-[10px]

                      xl:text-[12px]
                    "
                  >
                    Find their next
                  </span>

                  <span
                    className="
                      size-1.5
                      rounded-full
                      bg-[#F59A23]
                    "
                  />
                </div>

                {/* Main heading */}

                <h2
                  className="
                    max-w-[570px]
                    font-[var(--font-roboto)]
                    text-[clamp(2.35rem,9vw,4.25rem)]
                    font-black
                    leading-[0.91]
                    tracking-[-0.06em]
                    text-[#111111]

                    sm:text-[clamp(2.8rem,7vw,4.25rem)]

                    lg:text-[clamp(3rem,4.8vw,4.25rem)]
                  "
                >
                  The perfect way
                  <br />
                  to <span className="text-[#E72D5A]">play & learn.</span>
                </h2>

                {/* Supporting copy */}

                <p
                  className="
                    mt-9
                    w-full
                    max-w-[470px]
                    font-[var(--font-poppins)]
                    text-[13px]
                    font-medium
                    leading-[1.75]
                    tracking-[-0.01em]
                    text-[#687489]

                    sm:mt-10
                    sm:max-w-[500px]
                    sm:text-[13px]

                    lg:mt-11
                    lg:text-[13px]

                    xl:mt-12
                    xl:text-[14px]
                  "
                >
                  Thoughtfully chosen games and learning experiences for every stage of growing up.
                </p>

                {/* Editorial accent */}

                <div
                  className="
                    mt-5
                    flex
                    items-center
                    gap-1.5

                    sm:mt-6
                  "
                >
                  <span
                    className="
                      h-[2px]
                      w-8
                      rounded-full
                      bg-[#C391EE]
                    "
                  />

                  <span
                    className="
                      h-[2px]
                      w-2.5
                      rounded-full
                      bg-[#E72D5A]
                    "
                  />

                  <span
                    className="
                      h-[2px]
                      w-1.5
                      rounded-full
                      bg-[#F5B5C5]
                    "
                  />
                </div>
              </div>

              {/* -------------------------------------------------------------- */}
              {/* BENEFITS                                                        */}
              {/* -------------------------------------------------------------- */}

              <div
                className="
                  relative
                  z-30
                  mt-7
                  w-full

                  sm:mt-8

                  lg:absolute
                  lg:bottom-[74px]
                  lg:left-0
                  lg:right-0
                  lg:mt-0
                "
              >
                <BenefitsRow />
              </div>

              {/* -------------------------------------------------------------- */}
              {/* CTA                                                             */}
              {/* -------------------------------------------------------------- */}

              <div
                className="
                  relative
                  z-30
                  mt-5

                  sm:mt-6

                  lg:absolute
                  lg:bottom-[8px]
                  lg:left-0
                  lg:mt-0
                "
              >
                <Link
                  href="/shop"
                  className="
    group
    inline-flex
    min-h-[46px]
    items-center
    justify-center
    gap-2.5
    rounded-full
    bg-[#C391EE]
    px-6
    py-3
    font-[var(--font-poppins)]
    text-[12px]
    font-black
    uppercase
    tracking-[0.08em]
    !text-white
    shadow-[0_10px_24px_rgba(195,145,238,0.24)]
    transition-all
    duration-300
    ease-out

    hover:-translate-y-0.5
    hover:bg-[#A96FDB]
    hover:shadow-[0_14px_32px_rgba(169,111,219,0.28)]

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-[#C391EE]
    focus-visible:ring-offset-2

    active:translate-y-0

    sm:min-h-[50px]
    sm:px-7
    sm:py-3.5
    sm:text-[9.5px]
    xl:text-[12px]
  "
                >
                  <span className="!text-white">Explore all ages</span>

                  <span
                    className="
      flex
      size-6
      shrink-0
      items-center
      justify-center
      rounded-full
      bg-white/20
      !text-white
      transition-all
      duration-300
      group-hover:bg-white/30
    "
                  >
                    <ArrowRight
                      className="
        size-3.5
        !text-white
        transition-transform
        duration-300
        group-hover:translate-x-1
      "
                      strokeWidth={2.5}
                    />
                  </span>
                </Link>
              </div>
            </div>

            {/* ================================================================== */}
            {/* AGE SECTION                                                        */}
            {/* ================================================================== */}

            <div
              className="
                relative
                z-30
                mt-10

                sm:mt-12

                lg:mt-14

                xl:mt-16
              "
            >
              {/* -------------------------------------------------------------- */}
              {/* HEADER                                                         */}
              {/* -------------------------------------------------------------- */}

              <div
                className="
                  mb-6
                  flex
                  flex-col
                  gap-2

                  sm:mb-7

                  lg:mb-8
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <span
                    className="
                      h-[2px]
                      w-7
                      rounded-full
                      bg-[#E72D5A]

                      sm:w-8
                    "
                  />

                  <p
                    className="
                      font-[var(--font-poppins)]
                      text-[8px]
                      font-black
                      uppercase
                      tracking-[0.17em]
                      text-[#E72D5A]

                      sm:text-[9px]

                      xl:text-[11px]
                    "
                  >
                    Choose their adventure
                  </p>
                </div>

                <h3
                  className="
                    font-[var(--font-roboto)]
                    text-[22px]
                    font-black
                    leading-[1]
                    tracking-[-0.045em]
                    text-[#17213D]

                    sm:text-[26px]

                    lg:text-[30px]
                  "
                >
                  Find their perfect age group.
                </h3>

                <p
                  className="
                    max-w-[500px]
                    font-[var(--font-poppins)]
                    text-[11px]
                    leading-[1.65]
                    text-[#7A8391]

                    sm:text-[12px]

                    lg:text-[13px]
                  "
                >
                  Age-appropriate experiences designed to grow with their curiosity, confidence and
                  imagination.
                </p>
              </div>

              {/* -------------------------------------------------------------- */}
              {/* AGE TILES                                                       */}
              {/* -------------------------------------------------------------- */}

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.12,
                }}
                className="
                  grid
                  grid-cols-1
                  gap-4

                  sm:grid-cols-2
                  sm:gap-5

                  lg:grid-cols-4
                  lg:gap-5

                  xl:gap-6
                "
              >
                {ageGroups.map((age) => (
                  <AgeTile key={age.slug} age={age} />
                ))}
              </motion.div>

              {/* -------------------------------------------------------------- */}
              {/* BOTTOM LINK                                                     */}
              {/* -------------------------------------------------------------- */}

              <div
                className="
                  mt-7
                  flex
                  flex-col
                  items-center
                  gap-2

                  sm:mt-8
                "
              >
                <div
                  className="
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-3
                  "
                >
                  <span
                    className="
                      hidden
                      h-px
                      w-16
                      bg-[#E8E2DC]

                      sm:block
                    "
                  />

                  <span
                    className="
                      font-[var(--font-poppins)]
                      text-[8px]
                      text-[#7B8491]

                      sm:text-[9px]

                      xl:text-[11px]
                    "
                  >
                    Not sure what fits?
                  </span>

                  <span
                    className="
                      hidden
                      h-px
                      w-16
                      bg-[#E8E2DC]

                      sm:block
                    "
                  />
                </div>

                <Link
                  href="/shop"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-1.5
                    font-[var(--font-poppins)]
                    text-[8px]
                    font-black
                    uppercase
                    tracking-[0.08em]
                    text-[#C391EE]
                    transition-colors
                    hover:text-[#A96FDB]

                    sm:text-[9px]

                    xl:text-[11px]
                  "
                >
                  Browse everything
                  <ArrowRight
                    className="
                      size-2.5
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                    strokeWidth={2.5}
                  />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
