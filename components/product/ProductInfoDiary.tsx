"use client";

import { Check, Info, PackageCheck, Sparkles, Tag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import type { StorefrontProduct } from "@/types/storefront";

interface ProductInfoDiaryProps {
  product: StorefrontProduct;
  ageLabel: string | null;
  hasDiscount: boolean;
  discount: number;
}

type DiaryTab = "overview" | "description" | "specs" | "benefits";

const diaryTabs: Array<{
  id: DiaryTab;
  label: string;
  icon: typeof Info;
}> = [
  {
    id: "overview",
    label: "Overview",
    icon: Info,
  },
  {
    id: "description",
    label: "Story",
    icon: PackageCheck,
  },
  {
    id: "specs",
    label: "Specs",
    icon: Tag,
  },
  {
    id: "benefits",
    label: "Benefits",
    icon: Sparkles,
  },
];

function getDiaryContent(
  tab: DiaryTab,
  product: StorefrontProduct,
  ageLabel: string | null,
  hasDiscount: boolean,
  discount: number,
) {
  switch (tab) {
    case "description":
      return {
        eyebrow: "PRODUCT STORY",
        title: "Made for curious minds.",
        body:
          product.description ||
          product.shortDescription ||
          "A thoughtfully selected product designed for fun, discovery and everyday play.",
        points: [
          "Thoughtfully designed for engaging play",
          "Easy to understand and enjoy",
          "Made for memorable everyday moments",
        ],
        icon: PackageCheck,
      };

    case "specs":
      return {
        eyebrow: "PRODUCT DETAILS",
        title: "Everything you need to know.",
        body: "Here are the key details available for this product, so you can choose with confidence.",
        points: [
          `Age: ${ageLabel || "Suitable age group not specified"}`,
          `SKU: ${product.sku || "Not specified"}`,
          `Availability: ${
            product.stock === undefined
              ? "Availability pending"
              : product.stock > 0
                ? "In stock"
                : "Currently unavailable"
          }`,
        ],
        icon: Tag,
      };

    case "benefits":
      return {
        eyebrow: "VALUE & OFFERS",
        title: hasDiscount ? `${discount}% off right now.` : "More value, more fun.",
        body: hasDiscount
          ? "This product currently has a special price. Check the purchase panel for the current price and quantity options."
          : "Look for eligible offers, quantity savings and purchase benefits in the panel alongside this section.",
        points: [
          hasDiscount ? `${discount}% current discount` : "No current product discount",
          "Quantity savings may be available",
          "Secure checkout and delivery support",
        ],
        icon: Sparkles,
      };

    default:
      return {
        eyebrow: "QUICK OVERVIEW",
        title: product.shortDescription || "A little more fun for every day.",
        body:
          product.shortDescription ||
          product.description ||
          "Discover the key details of this product before you choose your favourite.",
        points: [
          "Playful and thoughtfully selected",
          ageLabel ? `Designed for ${ageLabel}` : "Age information available in Specs",
          "Ready to become part of their next adventure",
        ],
        icon: Info,
      };
  }
}

export default function ProductInfoDiary({
  product,
  ageLabel,
  hasDiscount,
  discount,
}: ProductInfoDiaryProps) {
  const [activeTab, setActiveTab] = useState<DiaryTab>("overview");

  const content = getDiaryContent(activeTab, product, ageLabel, hasDiscount, discount);

  const ContentIcon = content.icon;

  return (
    <section
      aria-labelledby="product-diary-heading"
      className="
        relative
        w-full
        overflow-hidden
        rounded-[28px]
        border
        border-[#E8E1EF]
        bg-[linear-gradient(135deg,#FFFFFF_0%,#FBF8FF_52%,#FFF9FB_100%)]
        shadow-[0_20px_55px_rgba(43,30,70,0.07)]
        sm:rounded-[32px]
      "
    >
      {/* ================================================================
          DECORATIVE ATMOSPHERE
      ================================================================= */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          size-40
          rounded-full
          bg-[#E8DEFF]/60
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-20
          left-10
          size-44
          rounded-full
          bg-[#FFE0E8]/50
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          right-8
          top-8
          hidden
          h-16
          w-20
          opacity-60
          sm:block
        "
      >
        <svg viewBox="0 0 90 70" className="h-full w-full" fill="none">
          <path
            d="M12 42C24 28 34 48 45 32C53 21 64 25 78 15"
            stroke="#C391EE"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="4 5"
          />

          <circle cx="78" cy="15" r="3" fill="#E72D5A" />

          <circle cx="63" cy="26" r="2.5" fill="#F1A348" />
        </svg>
      </div>

      {/* ================================================================
          DIARY LAYOUT
      ================================================================= */}

      <div
        className="
          relative
          z-10
          grid
          lg:grid-cols-[205px_minmax(0,1fr)]
          xl:grid-cols-[225px_minmax(0,1fr)]
        "
      >
        {/* ================================================================
            LEFT — DIARY INDEX
        ================================================================= */}

        <aside
          className="
            border-b
            border-[#ECE6F2]
            bg-[#F8F4FC]/75
            p-3
            lg:border-b-0
            lg:border-r
            lg:p-4
          "
        >
          <div className="mb-3 px-2 lg:mb-5">
            <p
              className="
                font-[var(--font-poppins)]
                text-[12px]
                font-black
                uppercase
                tracking-[0.18em]
                text-[#E72D5A]
              "
            >
              Product diary
            </p>

            <h2
              id="product-diary-heading"
              className="
                mt-1
                font-playpen
                text-[20px]
                font-black
                leading-tight
                tracking-[-0.04em]
                text-[#10183B]
                sm:text-[22px]
              "
            >
              Inside the story
            </h2>
          </div>

          {/* Mobile horizontal / desktop vertical nav */}

          <div
            className="
              flex
              gap-2
              overflow-x-auto
              pb-1
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              lg:block
              lg:space-y-2
              lg:overflow-visible
              lg:pb-0
            "
            role="tablist"
            aria-label="Product information"
          >
            {diaryTabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group
                    relative
                    flex
                    min-w-fit
                    shrink-0
                    items-center
                    gap-2.5
                    rounded-[14px]
                    border
                    px-3
                    py-2.5
                    text-left
                    transition-all
                    duration-300
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#E72D5A]/40
                    lg:w-full
                    lg:rounded-[16px]
                    lg:px-3
                    lg:py-3
                    ${
                      active
                        ? "border-[#C391EE]/30 bg-white text-[#7044B8] shadow-[0_8px_22px_rgba(112,68,184,0.10)]"
                        : "border-transparent bg-transparent text-[#737686] hover:border-[#ECE5F4] hover:bg-white/70"
                    }
                  `}
                >
                  <span
                    className={`
                      flex
                      size-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      transition-all
                      ${
                        active
                          ? "bg-[#F0E7FF] text-[#7044B8]"
                          : "bg-white text-[#8B8E9A] group-hover:text-[#7044B8]"
                      }
                    `}
                  >
                    <Icon className="size-4" strokeWidth={1.9} />
                  </span>

                  <span
                    className="
                      whitespace-nowrap
                      font-[var(--font-poppins)]
                      text-[12px]
                      font-extrabold
                      sm:text-[14px]
                    "
                  >
                    {tab.label}
                  </span>

                  {active ? (
                    <span
                      aria-hidden="true"
                      className="
                        absolute
                        right-2
                        hidden
                        size-1.5
                        rounded-full
                        bg-[#E72D5A]
                        lg:block
                      "
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </aside>

        {/* ================================================================
            RIGHT — DIARY CONTENT
        ================================================================= */}

        <div
          className="
            min-w-0
            w-full
            px-5
            py-7
            sm:px-7
            sm:py-8
            lg:px-10
            lg:py-10
            xl:px-11
            xl:py-11
          "
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              className="w-full min-w-0"
            >
              {/* ------------------------------------------------------------
                  HEADER
              ------------------------------------------------------------- */}

              <div className="flex items-start gap-4">
                {/* Icon */}

                <motion.div
                  initial={{
                    rotate: -8,
                    scale: 0.88,
                  }}
                  animate={{
                    rotate: 0,
                    scale: 1,
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                  className="
                    flex
                    size-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-[15px]
                    border
                    border-[#C391EE]/20
                    bg-gradient-to-br
                    from-[#F6F0FF]
                    to-[#EDE2FF]
                    text-[#7044B8]
                    shadow-[0_6px_18px_rgba(112,68,184,0.10)]
                    sm:size-12
                    sm:rounded-[16px]
                  "
                >
                  <ContentIcon className="size-[19px] sm:size-5" strokeWidth={1.9} />
                </motion.div>

                {/* Heading */}

                <div className="min-w-0 flex-1 pt-0.5">
                  <p
                    className="
                      font-[var(--font-poppins)]
                      text-[12px]
                      font-bold
                      uppercase
                      tracking-[0.18em]
                      text-[#E72D5A]
                    "
                  >
                    {content.eyebrow}
                  </p>

                  <h3
                    className="
                      mt-1.5
                      font-playpen
                      text-[20px]
                      font-black
                      leading-[1.2]
                      tracking-[-0.025em]
                      text-[#10183B]
                      sm:text-[25px]
                      lg:text-[27px]
                    "
                  >
                    {content.title}
                  </h3>
                </div>

                {/* Decorative dots */}

                <div className="hidden shrink-0 items-center gap-1.5 pt-2 sm:flex">
                  <span className="size-1.5 rounded-full bg-[#E72D5A]" />
                  <span className="size-1.5 rounded-full bg-[#C391EE]" />
                  <span className="size-1.5 rounded-full bg-[#F1A348]" />
                </div>
              </div>

              {/* ------------------------------------------------------------
                  DESCRIPTION
              ------------------------------------------------------------- */}

              <p
                className="
                  mt-7
                  max-w-3xl
                  font-[var(--font-poppins)]
                  text-[12px]
                  font-normal
                  leading-[1.8]
                  tracking-[-0.005em]
                  text-[#5D6172]
                  sm:mt-8
                  sm:text-[13px]
                  sm:leading-[1.85]
                  lg:text-[14px]
                  lg:leading-[1.9]
                "
              >
                {content.body}
              </p>

              {/* ------------------------------------------------------------
                  INFORMATION POINTS
              ------------------------------------------------------------- */}

              <div
                className="
                  mt-7
                  grid
                  gap-3
                  sm:mt-8
                  sm:grid-cols-3
                  sm:gap-3
                "
              >
                {content.points.map((point, index) => (
                  <motion.div
                    key={point}
                    initial={{
                      opacity: 0,
                      y: 6,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.06,
                      duration: 0.25,
                      ease: "easeOut",
                    }}
                    whileHover={{
                      y: -2,
                    }}
                    className="
                      group
                      flex
                      min-h-[72px]
                      items-start
                      gap-2.5
                      rounded-[16px]
                      border
                      border-[#ECE7F2]
                      bg-[#FCFAFF]
                      px-3.5
                      py-3.5
                      shadow-[0_3px_12px_rgba(38,24,67,0.025)]
                      transition-all
                      duration-200
                      hover:border-[#DCCCF2]
                      hover:bg-[#F9F5FF]
                      hover:shadow-[0_7px_20px_rgba(112,68,184,0.07)]
                      sm:px-3
                      sm:py-3.5
                    "
                  >
                    {/* Check */}

                    <span
                      className="
                        mt-0.5
                        flex
                        size-[21px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#FDE9EF]
                        text-[#E72D5A]
                        transition-transform
                        duration-200
                        group-hover:scale-105
                      "
                    >
                      <Check className="size-[11px]" strokeWidth={2.7} />
                    </span>

                    {/* Text */}

                    <span
                      className="
                        pt-px
                        font-[var(--font-poppins)]
                        text-[12px]
                        font-medium
                        leading-[1.55]
                        tracking-[-0.005em]
                        text-[#505467]
                      "
                    >
                      {point}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* ------------------------------------------------------------
                  FOOTER
              ------------------------------------------------------------- */}

              <div
                className="
                  mt-7
                  flex
                  flex-col
                  gap-2
                  border-t
                  border-[#ECE7F2]
                  pt-4
                  sm:mt-8
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  sm:gap-4
                "
              >
                <span
                  className="
                    font-[var(--font-poppins)]
                    text-[12px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-[#A2A3AD]
                  "
                >
                  BuzzieWorld product notes
                </span>

                <span
                  className="
                    min-w-0
                    truncate
                    font-[var(--font-poppins)]
                    text-[12px]
                    font-medium
                    text-[#A27BCF]
                    sm:max-w-[55%]
                    sm:text-right
                  "
                >
                  {product.name}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
  