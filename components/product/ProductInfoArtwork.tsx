"use client";

import {
  Check,
  Clock3,
  Heart,
  Info,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Tag,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import ProductPurchaseOptions from "@/components/product/ProductPurchaseOptions";
import type { StorefrontProduct } from "@/types/storefront";

interface ProductInfoArtworkProps {
  product: StorefrontProduct;
  ageLabel: string | null;
  hasDiscount: boolean;
  discount: number;
  isOutOfStock: boolean;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

type InfoTab = "overview" | "description" | "specs" | "benefits";

const infoTabs: Array<{
  id: InfoTab;
  label: string;
  icon: typeof Info;
}> = [
  { id: "overview", label: "Overview", icon: Info },
  { id: "description", label: "Description", icon: PackageCheck },
  { id: "specs", label: "Specs", icon: Tag },
  { id: "benefits", label: "Benefits", icon: Sparkles },
];

function getInfoContent(
  tab: InfoTab,
  product: StorefrontProduct,
  ageLabel: string | null,
  hasDiscount: boolean,
  discount: number,
) {
  switch (tab) {
    case "description":
      return {
        eyebrow: "PRODUCT DESCRIPTION",
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
          `Availability: ${product.stock > 0 ? "In stock" : "Currently unavailable"}`,
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

export default function ProductInfoArtwork({
  product,
  ageLabel,
  hasDiscount,
  discount,
  isOutOfStock,
}: ProductInfoArtworkProps) {
  const [wishlistActive, setWishlistActive] = useState(false);
  const [deliveryPin, setDeliveryPin] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [activeInfoTab, setActiveInfoTab] = useState<InfoTab>("overview");

  function checkDelivery() {
    const pin = deliveryPin.trim();

    if (!pin) {
      setDeliveryMessage("Please enter your pincode.");
      return;
    }

    if (!/^\d{6}$/.test(pin)) {
      setDeliveryMessage("Please enter a valid 6-digit pincode.");
      return;
    }

    setDeliveryMessage("We'll confirm delivery availability at checkout.");
  }

  return (
    <section className="w-full">
      <div
        className="
            grid
            gap-8
            lg:grid-cols-[minmax(0,1fr)_255px]
            xl:grid-cols-[minmax(0,1fr)_270px]
            lg:items-start
          "
      >
        {/* =====================================================================
              LEFT — PRODUCT INFORMATION
          ====================================================================== */}

        <div className="min-w-0">
          {/* BADGES + WISHLIST */}

          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {product.featured ? (
                <span
                  className="
                      inline-flex
                      items-center
                      rounded-full
                      bg-[#E72D5A]
                      px-3
                      py-1.5
                      font-[var(--font-poppins)]
                      text-[10px]
                      font-extrabold
                      leading-none
                      text-white
                      shadow-[0_6px_18px_rgba(231,45,90,0.16)]
                      sm:text-[11px]
                    "
                >
                  Best Seller
                </span>
              ) : null}

              {ageLabel ? (
                <span
                  className="
                      inline-flex
                      items-center
                      rounded-full
                      bg-[#F0E9FF]
                      px-3
                      py-1.5
                      font-[var(--font-poppins)]
                      text-[10px]
                      font-extrabold
                      leading-none
                      text-[#7044B8]
                      sm:text-[11px]
                    "
                >
                  {ageLabel}
                </span>
              ) : null}
            </div>

            <button
              type="button"
              aria-label={wishlistActive ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={wishlistActive}
              onClick={() => setWishlistActive((value) => !value)}
              className="
                  flex
                  size-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#E5E1E3]
                  bg-white
                  text-[#17203B]
                  transition
                  hover:border-[#E72D5A]/40
                  hover:text-[#E72D5A]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#E72D5A]
                "
            >
              <Heart
                className={`size-[19px] ${wishlistActive ? "fill-[#E72D5A] text-[#E72D5A]" : ""}`}
                strokeWidth={1.8}
              />
            </button>
          </div>

          {/* CATEGORY */}

          {product.category?.name ? (
            <p
              className="
                  mt-5
                  font-[var(--font-poppins)]
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.13em]
                  text-[#E72D5A]
                  sm:text-[11px]
                "
            >
              {product.category.name}
            </p>
          ) : null}

          {/* PRODUCT NAME */}

          <h1
            className="
                mt-2
                font-[var(--font-roboto)]
                text-[clamp(2rem,3.2vw,2.75rem)]
                font-black
                leading-[1.02]
                tracking-[-0.055em]
                text-[#10183B]
              "
          >
            {product.name}
          </h1>

          {/* SHORT DESCRIPTION */}

          {product.shortDescription ? (
            <p
              className="
                  mt-4
                  max-w-2xl
                  font-[var(--font-poppins)]
                  text-[14px]
                  font-medium
                  leading-6
                  text-[#20243D]
                  sm:text-[15px]
                  sm:leading-7
                "
            >
              {product.shortDescription}
            </p>
          ) : null}

          {/* RATING / META */}

          <div
            className="
                mt-4
                flex
                flex-wrap
                items-center
                gap-x-3
                gap-y-2
                font-[var(--font-poppins)]
                text-[11px]
                font-medium
                text-[#64687A]
                sm:text-[12px]
              "
          >
            <span className="flex items-center gap-1">
              <span className="text-[#FFB000]">★★★★★</span>
            </span>

            <span className="text-[#4F5367]">Loved by little explorers</span>

            {product.sku ? (
              <>
                <span className="hidden h-4 w-px bg-[#DCD9DC] sm:block" />
                <span>SKU: {product.sku}</span>
              </>
            ) : null}
          </div>

          {/* PRICE */}

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <span
              className="
                  font-[var(--font-roboto)]
                  text-[2.25rem]
                  font-black
                  leading-none
                  tracking-[-0.055em]
                  text-[#E72D5A]
                  sm:text-[2.65rem]
                "
            >
              {formatPrice(product.price)}
            </span>

            {hasDiscount ? (
              <span
                className="
                    pb-1
                    font-[var(--font-poppins)]
                    text-[15px]
                    font-medium
                    text-[#777985]
                    line-through
                    sm:text-[16px]
                  "
              >
                {formatPrice(product.compareAtPrice!)}
              </span>
            ) : null}

            {discount > 0 ? (
              <span
                className="
                    mb-1
                    rounded-full
                    bg-[#FFF0F4]
                    px-3
                    py-1.5
                    font-[var(--font-poppins)]
                    text-[10px]
                    font-extrabold
                    text-[#E72D5A]
                    sm:text-[11px]
                  "
              >
                {discount}% OFF
              </span>
            ) : null}
          </div>

          {/* ==================================================================
                INTERACTIVE PRODUCT INFORMATION
            ================================================================== */}
          <div className="mt-6">
            <div
              className="
                  relative
                  overflow-hidden
                  rounded-[24px]
                  border
                  border-[#E9E4EE]
                  bg-[linear-gradient(135deg,#FFFFFF_0%,#FBF8FF_100%)]
                  p-3
                  shadow-[0_18px_45px_rgba(43,30,70,0.06)]
                  sm:rounded-[28px]
                  sm:p-4
                "
            >
              {/* Decorative graphics */}
              <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -right-10
                    -top-10
                    size-28
                    rounded-full
                    bg-[#E8DEFF]/55
                    blur-3xl
                  "
              />
              <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -bottom-12
                    left-10
                    size-32
                    rounded-full
                    bg-[#FFE0E8]/45
                    blur-3xl
                  "
              />
              <svg
                aria-hidden="true"
                viewBox="0 0 90 70"
                className="pointer-events-none absolute right-4 top-4 h-12 w-14 opacity-50"
                fill="none"
              >
                <path
                  d="M12 42C24 28 34 48 45 32C53 21 64 25 78 15"
                  stroke="#C391EE"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="4 5"
                />
                <circle cx="78" cy="15" r="3" fill="#E72D5A" />
              </svg>

              {/* Icon controls */}
              <div
                className="
                    relative
                    z-10
                    flex
                    gap-1.5
                    rounded-full
                    border
                    border-[#EEE8F4]
                    bg-[#F8F5FC]
                    p-1
                    overflow-x-auto
                    [scrollbar-width:none]
                    [&::-webkit-scrollbar]:hidden
                    sm:gap-2
                  "
                role="tablist"
                aria-label="Product information"
              >
                {infoTabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeInfoTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveInfoTab(tab.id)}
                      className={`
                          relative
                          flex
                          min-w-fit
                          items-center
                          justify-center
                          gap-1.5
                          rounded-full
                          px-3
                          py-2
                          font-[var(--font-poppins)]
                          whitespace-nowrap
                          text-[10px]
                          font-extrabold
                          transition-all
                          duration-300
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-[#E72D5A]/40
                          sm:px-3.5
                          sm:text-[11px]
                          ${
                            active
                              ? "bg-[#a092cd] text-white shadow-[0_7px_18px_rgba(160,146,205,0.24)]"
                              : "bg-white text-[#686B7B] hover:bg-white hover:text-[#7044B8]"
                          }
                        `}
                    >
                      <Icon className="relative z-10 size-3.5" strokeWidth={2} />
                      <span className="relative z-10">{tab.label}</span>
                      {active ? (
                        <motion.span
                          layoutId="active-product-info-tab"
                          className="absolute inset-0 z-0 rounded-full bg-[#a092cd]"
                          transition={{ type: "spring", stiffness: 420, damping: 30 }}
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {/* Animated content */}
              {(() => {
                const content = getInfoContent(
                  activeInfoTab,
                  product,
                  ageLabel,
                  hasDiscount,
                  discount,
                );
                const ContentIcon = content.icon;

                return (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeInfoTab}
                      initial={{ opacity: 0, y: 10, scale: 0.985 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.985 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="relative z-10 mt-4 overflow-hidden rounded-[22px] border border-[#F0EBF4] bg-white p-4 shadow-[0_10px_30px_rgba(43,30,70,0.035)] sm:p-5"
                    >
                      <div className="flex items-start gap-3">
                        <motion.div
                          initial={{ rotate: -8, scale: 0.85 }}
                          animate={{ rotate: 0, scale: 1 }}
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className="
                              flex
                              size-10
                              shrink-0
                              items-center
                              justify-center
                              rounded-2xl
                              bg-[linear-gradient(145deg,#F1EAFF_0%,#E9DEFF_100%)]
                              text-[#7044B8]
                              shadow-[0_8px_20px_rgba(112,68,184,0.12)]
                              sm:size-11
                            "
                        >
                          <ContentIcon className="size-5" strokeWidth={1.8} />
                        </motion.div>

                        <div className="min-w-0 flex-1">
                          <p
                            className="
                                font-[var(--font-poppins)]
                                text-[9px]
                                font-black
                                uppercase
                                tracking-[0.14em]
                                text-[#E72D5A]
                                sm:text-[10px]
                              "
                          >
                            {content.eyebrow}
                          </p>
                          <h2
                            className="
                                mt-1
                                font-[var(--font-roboto)]
                                text-[17px]
                                font-black
                                leading-tight
                                tracking-[-0.025em]
                                text-[#10183B]
                                sm:text-[19px]
                              "
                          >
                            {content.title}
                          </h2>
                        </div>

                        <div className="hidden shrink-0 items-center gap-1 sm:flex">
                          <span className="size-1.5 rounded-full bg-[#E72D5A]" />
                          <span className="size-1.5 rounded-full bg-[#C391EE]" />
                          <span className="size-1.5 rounded-full bg-[#F1A348]" />
                        </div>
                      </div>

                      <p
                        className="
                            mt-3
                            font-[var(--font-poppins)]
                            text-[12px]
                            font-medium
                            leading-5
                            text-[#55596B]
                            sm:text-[13px]
                            sm:leading-6
                          "
                      >
                        {content.body}
                      </p>

                      <div className="mt-4 grid gap-2 sm:grid-cols-3">
                        {content.points.map((point, index) => (
                          <motion.div
                            key={point}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.06, duration: 0.22 }}
                            className="
                                flex
                                items-start
                                gap-2
                                rounded-xl
                                border
                                border-[#F0ECF4]
                                bg-[#FCFBFD]
                                px-2.5
                                py-2.5
                                transition-colors
                                hover:bg-[#F8F4FF]
                              "
                          >
                            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#FDE8EE] text-[#E72D5A]">
                              <Check className="size-3" strokeWidth={2.5} />
                            </span>
                            <span
                              className="
                                  font-[var(--font-poppins)]
                                  text-[10px]
                                  font-semibold
                                  leading-4
                                  text-[#4E5264]
                                "
                            >
                              {point}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                );
              })()}
            </div>
          </div>
        </div>

        {/* =====================================================================
              RIGHT — PURCHASE / DELIVERY CARD
          ====================================================================== */}

        <aside
          className="
              rounded-[24px]
              border
              border-[#E9E5E6]
              bg-white
              p-4
              shadow-[0_18px_45px_rgba(20,24,48,0.07)]
              sm:p-5
              lg:p-5.5
              lg:sticky
              lg:top-6
            "
        >
          {/* STOCK */}

          <div
            className="
                flex
                items-center
                gap-2.5
                border-b
                border-[#ECE9EA]
                pb-5
              "
          >
            <span className="size-2.5 rounded-full bg-[#39A65A]" />

            <div>
              <p
                className="
                    font-[var(--font-poppins)]
                    text-[12px]
                    font-extrabold
                    text-[#3B8F50]
                  "
              >
                {isOutOfStock ? "Out of stock" : "In stock"}
              </p>

              {!isOutOfStock ? (
                <p
                  className="
                      mt-0.5
                      font-[var(--font-poppins)]
                      text-[12px]
                      font-medium
                      text-[#747783]
                    "
                >
                  Ready to ship
                </p>
              ) : null}
            </div>
          </div>

          {/* PURCHASE CONTROLS */}

          <div className="[&>div]:!gap-3 [&_button]:!min-h-10 [&_button]:!px-3 [&_button]:!text-[12px] [&_input]:!h-10 [&_input]:!text-[12px] [&_label]:!text-[12px] [&_p]:!text-[12px]">
            <ProductPurchaseOptions
              productId={product._id}
              price={product.price}
              stock={product.stock}
              disabled={isOutOfStock}
            />
          </div>

          {/* SERVICE BENEFITS */}

          <div
            className="
                mt-6
                space-y-3.5
                border-t
                border-[#F0ECEE]
                pt-6
              "
          >
            <ServiceBenefit
              icon={<Truck />}
              title="Free Shipping"
              description="On eligible orders"
            />

            <ServiceBenefit
              icon={<Clock3 />}
              title="Easy Returns"
              description="Simple return process"
            />

            <ServiceBenefit
              icon={<ShieldCheck />}
              title="Secure Payments"
              description="Safe checkout"
            />
          </div>

          {/* DELIVERY */}

          <div
            className="
                mt-6
                border-t
                border-[#F0ECEE]
                pt-6
              "
          >
            <div className="flex items-start gap-2.5">
              <span
                className="
                    flex
                    size-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#FFF2F5]
                    text-[#E72D5A]
                    shadow-[0_5px_14px_rgba(231,45,90,0.07)]
                  "
              >
                <Truck className="size-4" strokeWidth={1.8} />
              </span>

              <div>
                <p
                  className="
                      font-[var(--font-poppins)]
                      text-[12px]
                      font-extrabold
                      text-[#171B35]
                      sm:text-[13px]
                    "
                >
                  Check delivery
                </p>

                <p
                  className="
                      mt-0.5
                      font-[var(--font-poppins)]
                      text-[10px]
                      font-medium
                      leading-5
                      text-[#777985]
                      sm:text-[11px]
                    "
                >
                  Enter your pincode to check availability.
                </p>
              </div>
            </div>

            <div className="mt-3 flex overflow-hidden rounded-[10px] border border-[#E3E0E2]">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={deliveryPin}
                onChange={(event) => {
                  setDeliveryPin(event.target.value.replace(/\D/g, ""));
                  setDeliveryMessage("");
                }}
                placeholder="Enter pincode"
                aria-label="Delivery pincode"
                className="
                    min-w-0
                    flex-1
                    bg-white
                    px-3
                    py-3
                    font-[var(--font-poppins)]
                    text-[11px]
                    font-medium
                    text-[#20243D]
                    outline-none
                    placeholder:text-[#A1A2AA]
                  "
              />

              <button
                type="button"
                onClick={checkDelivery}
                className="
                    bg-[#E72D5A]
                    px-4
                    font-[var(--font-poppins)]
                    text-[10px]
                    font-extrabold
                    text-white
                    transition
                    hover:bg-[#D92150]
                    sm:text-[11px]
                  "
              >
                Check
              </button>
            </div>

            {deliveryMessage ? (
              <p
                className="
                    mt-2
                    font-[var(--font-poppins)]
                    text-[9px]
                    font-medium
                    leading-4
                    text-[#777985]
                  "
              >
                {deliveryMessage}
              </p>
            ) : null}
          </div>
        </aside>
      </div>
    </section>
  );
}

/* ============================================================================
    FEATURE
  ============================================================================ */

function Feature({
  icon,
  title,
  subtitle,
  className,
  iconClass,
}: {
  icon: string;
  title: string;
  subtitle: string;
  className: string;
  iconClass: string;
}) {
  return (
    <div
      className={`
          flex
          min-w-0
          items-center
          gap-2.5
          rounded-[14px]
          px-3
          py-3
          ${className}
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
            text-[13px]
            font-black
            ${iconClass}
          `}
      >
        {icon}
      </span>

      <div className="min-w-0">
        <p
          className="
              truncate
              font-[var(--font-poppins)]
              text-[10px]
              font-extrabold
              text-[#22263E]
              sm:text-[11px]
            "
        >
          {title}
        </p>

        <p
          className="
              mt-0.5
              truncate
              font-[var(--font-poppins)]
              text-[8px]
              font-medium
              text-[#747783]
              sm:text-[9px]
            "
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/* ============================================================================
    SERVICE BENEFIT
  ============================================================================ */

function ServiceBenefit({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="
            flex
            size-8
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#F5F0FF]
            text-[#7044B8]
            shadow-[0_5px_14px_rgba(112,68,184,0.07)]
          "
      >
        {icon}
      </span>

      <div>
        <p
          className="
              font-[var(--font-poppins)]
              text-[11px]
              font-extrabold
              text-[#272B41]
              sm:text-[12px]
            "
        >
          {title}
        </p>

        <p
          className="
              mt-0.5
              font-[var(--font-poppins)]
              text-[9px]
              font-medium
              text-[#858692]
              sm:text-[10px]
            "
        >
          {description}
        </p>
      </div>
    </div>
  );
}

