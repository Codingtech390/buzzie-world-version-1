"use client";
import type { StorefrontProduct } from "@/types/storefront";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Info, PackageCheck, Ruler, Scale, Sparkles, Tag } from "lucide-react";
import { useState } from "react";
import { resolveProductDiary } from "@/lib/product-diary";
interface ProductInfoDiaryProps {
  product: StorefrontProduct;
  ageLabel: string | null;
  hasDiscount: boolean;
  discount: number;
}
type DiaryTab = "overview" | "keyFeatures" | "specs" | "benefits";
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
    id: "keyFeatures",
    label: "Key Feature",
    icon: PackageCheck,
  },
  {
    id: "specs",
    label: "Specification",
    icon: Tag,
  },
  {
    id: "benefits",
    label: "Benefits",
    icon: Sparkles,
  },
];



const diaryTabColors: Record<
  DiaryTab,
  { accent: string; soft: string; border: string; iconBg: string }
> = {
  overview: {
    accent: "#F89B51",
    soft: "#F89B511F",
    border: "#F89B5180",
    iconBg: "#F89B5133",
  },
  keyFeatures: {
    accent: "#777B16",
    soft: "#DDE22E66",
    border: "#DDE22E",
    iconBg: "#DDE22E66",
  },
  specs: {
    accent: "#C45D7B",
    soft: "#F6A3BB66",
    border: "#F6A3BB",
    iconBg: "#F6A3BB66",
  },
  benefits: {
    accent: "#4ED3F6",
    soft: "#4ED3F61F",
    border: "#4ED3F680",
    iconBg: "#4ED3F633",
  },
};

function getDescriptionPoints(description: string): string[] {
  if (!description?.trim()) {
    return [];
  }

  return (
    description
      // Convert common HTML line-break/paragraph separators to real newlines.
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p\s*>\s*<p[^>]*>/gi, "\n")
      .replace(/<\/?p[^>]*>/gi, "")
      // Split on actual line breaks, including Windows CRLF and blank lines.
      .split(/\r?\n+/)
      // Remove simple Markdown emphasis/heading markers without changing the text.
      .map((part) =>
        part
          .trim()
          .replace(/^#{1,6}\s*/, "")
          .replace(/^\*{1,3}|\*{1,3}$/g, "")
          .replace(/^_{1,3}|_{1,3}$/g, "")
          .trim(),
      )
      .filter(Boolean)
  );
}
const staticBenefits = [
  {
    title: "Skill Building & Learning",
    description:
      "Boosts general knowledge, visual-spatial skills, memory, critical thinking and social play. An educational toy that combines learning with laughter.",
  },
];
function getDiaryContent(tab: DiaryTab, product: StorefrontProduct, ageLabel: string | null) {
  const descriptionPoints = getDescriptionPoints(product.description);
  switch (tab) {
    case "keyFeatures":
      return {
        eyebrow: "KEY FEATURES",
        title: "Everything that makes it special.",
        body: "A quick look at what comes with the product and the key features worth knowing.",
        points:
          product.keyFeatures.length > 0
            ? product.keyFeatures
            : ["Key features will be available soon."],
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
        eyebrow: "BENEFITS",
        title: "Made to learn, play and grow.",
        body: "Every BuzzieWorld product is designed to make learning feel playful and meaningful.",
        points: staticBenefits.map((benefit) => `${benefit.title} — ${benefit.description}`),
        icon: Sparkles,
      };
    default:
      return {
        eyebrow: "QUICK OVERVIEW",
        title: product.name,
        body:
          descriptionPoints.length > 0
            ? descriptionPoints
            : [
                product.shortDescription ||
                  "Discover the key details of this product before you choose your favourite.",
              ],
        points: [],
        icon: Info,
      };
  }
}
export default function ProductInfoDiary({ product, ageLabel }: ProductInfoDiaryProps) {
  const [activeTab, setActiveTab] = useState<DiaryTab>("overview");

const diary = resolveProductDiary(product);

const activeColors = diaryTabColors[activeTab];


const content = (() => {
  switch (activeTab) {
    case "overview":
      return {
        ...diary.overview,
        intro: diary.overview.intro,
        points: [],
        icon: Info,
      };

    case "keyFeatures":
      return {
        ...diary.keyFeatures,
        intro: diary.keyFeatures.intro,
        points: diary.keyFeatures.entries.map((entry) =>
          entry.description
            ? `${entry.title} — ${entry.description}`
            : entry.title,
        ),
        icon: PackageCheck,
      };

    case "specs":
      return {
        ...diary.specifications,
        intro: diary.specifications.intro,
        points: [],
        icon: Tag,
      };

    case "benefits":
      return {
        ...diary.benefits,
        intro: diary.benefits.intro,
        points: diary.benefits.entries.map((entry) =>
          entry.description
            ? `${entry.title} — ${entry.description}`
            : entry.title,
        ),
        icon: Sparkles,
      };
  }
})();


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
      {/* ================================================================*
       *          DECORATIVE ATMOSPHERE*
       *      ================================================================= */}
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
      {/* ================================================================*
       *          DIARY LAYOUT*
       *      ================================================================= */}
      <div
        className="
  relative
  z-10
  grid
  grid-cols-1
  w-full
  min-w-0
  lg:grid-cols-[205px_minmax(0,1fr)]
  xl:grid-cols-[225px_minmax(0,1fr)]
"
      >
        {/* ================================================================*
         *            LEFT — DIARY INDEX*
         *        ================================================================= */}
        <aside
          className="
  w-full
  min-w-0
  max-w-full
  overflow-hidden
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
            {/* <p
              className="
                font-[var(--font-roboto)]
                text-[12px]
                font-black
                uppercase
                tracking-[0.18em]
                text-[#E72D5A]
                sm:text-[12px]
                lg:text-[12px]
              "
            >
              Product diary
            </p> */}
            <h2
              id="product-diary-heading"
              className="
                mt-1
                font-[var(--font-roboto)]
                text-[20px]
                font-black
                uppercase
                leading-tight
                tracking-[-0.04em]
                text-[#10183B]
                sm:text-[22px]
                lg:text-[32px]
              "
            >
              Inside the story
            </h2>
          </div>
          {/* Mobile horizontal / desktop vertical nav */}

          <div
            className="
    block
    w-full
    min-w-0
    max-w-full
    overflow-x-auto
    overflow-y-hidden
    overscroll-x-contain
    touch-pan-x
    pb-2
    [-webkit-overflow-scrolling:touch]
    lg:overflow-visible
    lg:pb-0
  "
            style={{
              WebkitOverflowScrolling: "touch",
              touchAction: "pan-x",
            }}
            role="tablist"
            aria-label="Product information"
          >
            <div
              className="
                flex
                w-max
                min-w-max
                flex-nowrap
                gap-2
                lg:w-full
                lg:min-w-0
                lg:flex-col
                lg:gap-2
              "
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
                    style={{
                      backgroundColor: diaryTabColors[tab.id].soft,
                      borderColor: diaryTabColors[tab.id].border,
                      color: "#000000",
                      boxShadow: active ? `0 8px 22px ${diaryTabColors[tab.id].border}33` : "none",
                      outlineColor: diaryTabColors[tab.id].border,
                    }}
                    className={`
                    group
                    relative
                    flex
                    w-max
                    min-w-max
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
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    lg:w-full
                    lg:rounded-[16px]
                    lg:px-3
                    lg:py-3
                  `}
                  >
                    <span
                      style={{
                        backgroundColor: diaryTabColors[tab.id].iconBg,
                        color: diaryTabColors[tab.id].accent,
                      }}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full transition-all"
                    >
                      <Icon className="size-4" strokeWidth={1.9} />
                    </span>
                    <span
                      className="
                      font-[var(--font-poppins)]
                      text-[12px]
                      font-extrabold
                      whitespace-nowrap
                      sm:text-[14px]
                    "
                    >
                      {tab.label}
                    </span>
                    {active ? (
                      <span
                        aria-hidden="true"
                        className="absolute right-2 hidden size-1.5 rounded-full lg:block"
                        style={{ backgroundColor: diaryTabColors[tab.id].accent }}
                      />
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
        {/* ================================================================*
         *    RIGHT — DIARY CONTENT*
         *================================================================= */}
        <div
          className="min-w-0 w-full px-5 py-7 transition-colors duration-300 sm:px-7 sm:py-8 lg:px-10 lg:py-10 xl:px-11 xl:py-11"
          style={{
            background: activeColors.soft,
          }}
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
              {/* ------------------------------------------------------------*
               *          HEADER*
               *      ------------------------------------------------------------- */}
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
            shadow-[0_6px_18px_rgba(39,30,70,0.07)]
            sm:size-12
            sm:rounded-[16px]
          "
                  style={{
                    backgroundColor: activeColors.iconBg,
                    borderColor: activeColors.border,
                    color: activeColors.accent,
                  }}
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
              text-current
              sm:text-[12px]
              "
                    style={{ color: activeColors.accent }}
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
              </div>
              {/* ------------------------------------------------------------*
               *          DESCRIPTION*
               *      ------------------------------------------------------------- */}

              {activeTab === "overview" && (
                <div className="space-y-6 sm:space-y-7">
                  {diary.overview.entries.map((entry, index) => (
                    <motion.div
                      key={`overview-section-${index}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.04,
                        duration: 0.25,
                        ease: "easeOut",
                      }}
                      className="w-full max-w-none"
                    >
                      {entry.title && (
                        <h4 className="whitespace-nowrap font-playpen text-[13px] font-bold leading-[1.6] tracking-[-0.01em] text-[#292447] sm:text-[14px] lg:text-[15px]">
                          {entry.title}
                        </h4>
                      )}

                      {entry.description && (
                        <p className="mt-1.5 font-[var(--font-poppins)] text-[12px] font-normal leading-[1.85] tracking-[-0.005em] text-[#65677A] sm:text-[13px] lg:text-[14px] lg:leading-[1.9]">
                          {entry.description}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* ------------------------------------------------------------*
               *          PRODUCT PACKAGING DETAILS — SPECS*
               *      ------------------------------------------------------------- */}

              {activeTab === "specs" && (
                <div className="mt-6 grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {diary.specifications.entries.map((item, index) => (
                    <motion.div
                      key={`${item.label}-${index}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.04,
                        duration: 0.25,
                        ease: "easeOut",
                      }}
                      className="min-w-0 p-4 transition-transform duration-200 hover:-translate-y-0.5"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="flex size-9 shrink-0 items-center justify-center rounded-full"
                          style={{
                            backgroundColor: "#FFFFFFB8",
                            color: activeColors.accent,
                          }}
                        >
                          <Tag className="size-4" strokeWidth={1.8} />
                        </span>

                        <span className="min-w-0 break-words font-[var(--font-poppins)] text-[12px] font-bold text-[#30344A]">
                          {item.label}
                        </span>
                      </div>

                      <p className="mt-3 break-words font-[var(--font-poppins)] text-[12px] font-medium leading-5 text-[#6A6E7E]">
                        {item.value}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* ------------------------------------------------------------*
               *          INFORMATION POINTS*
               *      ------------------------------------------------------------- */}
              {content.points.length > 0 ? (
                activeTab === "benefits" ? (
                  <ul className="mt-7 space-y-4 sm:mt-8">
                    {content.points.map((point, index) => (
                      <motion.li
                        key={point}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.06, duration: 0.25, ease: "easeOut" }}
                        className="flex items-start gap-3"
                      >
                        <span
                          className="mt-[0.45rem] size-2 shrink-0 rounded-full"
                          style={{ backgroundColor: activeColors.accent }}
                        />
                        <span className="font-[var(--font-poppins)] text-[12px] font-medium leading-[1.7] tracking-[-0.005em] text-[#505467] sm:text-[13px] lg:text-[14px]">
                          {point}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <div
                    className={`mt-7 grid gap-3 sm:mt-8 ${activeTab === "keyFeatures" ? "grid-cols-1" : "sm:grid-cols-3 sm:gap-3"}`}
                  >
                    {content.points.map((point, index) => (
                      <motion.div
                        key={point}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.06, duration: 0.25, ease: "easeOut" }}
                        whileHover={{ y: -2 }}
                        className={`group flex items-start gap-2.5 px-1 py-2 transition-colors duration-200 ${activeTab === "keyFeatures" ? "min-h-0" : "min-h-[72px] sm:py-3.5"}`}
                      >
                        <span
                          className="mt-0.5 flex size-[21px] shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105"
                          style={{
                            backgroundColor: activeColors.iconBg,
                            color: activeColors.accent,
                          }}
                        >
                          <Check className="size-[11px]" strokeWidth={2.7} />
                        </span>
                        <span className="pt-px font-[var(--font-poppins)] text-[12px] font-medium leading-[1.55] tracking-[-0.005em] text-[#505467] sm:text-[12px]">
                          {point}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                )
              ) : null}
              {/* ------------------------------------------------------------*
               *          FOOTER*
               *      ------------------------------------------------------------- */}
              <div
                className="
          mt-7
          flex
          flex-col
          gap-2
          border-t
          pt-4
          sm:mt-8
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:gap-4
        "
                style={{ borderColor: activeColors.border }}
              >
                <span
                  className="
            font-[var(--font-poppins)]
            text-[12px]
            font-semibold
            uppercase
            tracking-[0.16em]
            text-[#A2A3AD]
            sm:text-[12px]
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
            sm:max-w-[55%]
            sm:text-right
          "
                  style={{ color: activeColors.accent }}
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
