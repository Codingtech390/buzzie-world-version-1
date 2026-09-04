"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";

import AddToCartButton from "@/components/cart/AddToCartButton";

import type { StorefrontProduct } from "@/types/storefront";

interface ProductCardProps {
  product: StorefrontProduct;
}

/* ================================================================
   PRICE FORMATTER
================================================================ */

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

/* ================================================================
   DISCOUNT
================================================================ */

function getDiscountPercentage(price: number, compareAtPrice?: number): number {
  if (typeof compareAtPrice !== "number" || compareAtPrice <= price || compareAtPrice <= 0) {
    return 0;
  }

  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

/* ================================================================
   SHORT PRODUCT DESCRIPTION
================================================================ */

function getShortDescription(product: StorefrontProduct): string {
  const source =
    typeof product.description === "string" && product.description.trim()
      ? product.description.trim()
      : typeof product.slug === "string" && product.slug.trim()
        ? product.slug.trim()
        : "A fun and engaging game designed to spark curiosity, learning, and imaginative play.";

  const words = source.replace(/\s+/g, " ").split(" ");

  if (words.length <= 15) {
    return source;
  }

  return `${words.slice(0, 15).join(" ")}…`;
}

/* ================================================================
   PRODUCT CARD
================================================================ */

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.find((image) => Boolean(image.url))?.url || null;

  const imageAlt = product.images?.find((image) => Boolean(image.alt))?.alt || product.name;

  const discount = getDiscountPercentage(product.price, product.compareAtPrice);

  const isOutOfStock = product.stock <= 0;

  return (
    <article className="group relative flex h-full min-w-0 flex-col">
      {/* ==========================================================
          CARD
          The outer card is the visual frame. The image has its
          own clipping layer so badges and wishlist stay inside
          the card without being clipped by the arc.
      =========================================================== */}

      <div
        className="
          flex
          h-full
          w-full
          flex-col
          overflow-hidden
          rounded-[28px]
          bg-transparent
          transition-all
          duration-300
          ease-out
          group-hover:-translate-y-1
        "
      >
        {/* ========================================================
            ARC IMAGE AREA
            A true large dome/half-circle forms the top of the card.
            The purple shape is clipped independently so the controls
            below never interfere with the arc.
        ========================================================= */}

        <div
          className="
            relative
            w-full
            overflow-hidden
            bg-transparent
          "
          style={{
            height: "clamp(215px, 23vw, 290px)",
          }}
        >
          <div
            className="
              absolute
              inset-x-0
              bottom-0
              h-[92%]
              overflow-hidden
              bg-[#a092cd]
            "
            style={{
              borderRadius: "50% 50% 0 0 / 44% 44% 0 0",
            }}
          >
            <Link
              href={`/products/${product.slug}`}
              aria-label={`View ${product.name}`}
              className="
                absolute
                inset-0
                block
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#a092cd]
                focus-visible:ring-inset
              "
            >
              {primaryImage ? (
                <Image
                  src={primaryImage}
                  alt={imageAlt}
                  fill
                  sizes="
                    (max-width: 639px) 45vw,
                    (max-width: 1023px) 29vw,
                    (max-width: 1279px) 22vw,
                    20vw
                  "
                  className="
                    object-contain
                    p-0
                    transition-transform
                    duration-500
                    ease-[cubic-bezier(0.22,1,0.36,1)]
                    group-hover:scale-[1.08]
                  "
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="text-center">
                    <div
                      className="
                        mx-auto
                        flex
                        size-14
                        items-center
                        justify-center
                        rounded-full
                        bg-white/70
                      "
                    >
                      <Sparkles className="size-7 text-[#69419A]/70" />
                    </div>

                    <p
                      className="
                        mt-3
                        text-[10px]
                        font-bold
                        text-[#4F386B]
                      "
                    >
                      Image coming soon
                    </p>
                  </div>
                </div>
              )}
            </Link>
          </div>
        </div>

        {/* ==========================================================
            PRODUCT INFORMATION
        =========================================================== */}

        <div
          className="
            flex
            flex-1
            flex-col
            bg-white
            px-4
            pb-4
            pt-4
            sm:px-5
            sm:pb-5
          "
        >
          {/* ======================================================
              BADGES
              Moved into the information area so the large top arc
              remains clean and the badges can never spill outside.
          ======================================================= */}

          <div className="flex min-h-[18px] items-center gap-1.5">
            {product.featured ? (
              <span
                className="
                  rounded-full
                  bg-[#E83D59]
                  px-2
                  py-1
                  text-[7px]
                  font-black
                  uppercase
                  leading-none
                  tracking-[0.04em]
                  text-white
                  shadow-[0_4px_10px_rgba(232,61,89,0.16)]
                "
              >
                Bestseller
              </span>
            ) : null}

            {discount > 0 ? (
              <span
                className="
                  rounded-full
                  bg-[#17213D]
                  px-2
                  py-1
                  text-[7px]
                  font-black
                  uppercase
                  leading-none
                  tracking-[0.04em]
                  text-white
                  shadow-[0_4px_10px_rgba(23,33,61,0.14)]
                "
              >
                {discount}% OFF
              </span>
            ) : null}
          </div>

          {/* PRODUCT NAME */}

          <Link
            href={`/products/${product.slug}`}
            className="
              mt-1.5
              block
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#a092cd]
              focus-visible:ring-offset-2
            "
          >
            <h3
              className="
                line-clamp-2
                min-h-[2.8rem]
                font-[var(--font-poppins)]
                text-[11px]
                font-bold
                leading-[1.4]
                tracking-[-0.02em]
                text-[#17213D]
                transition-colors
                duration-200
                group-hover:text-[#69419A]
                sm:text-[12px]
              "
            >
              {product.name}
            </h3>
          </Link>

          {/* ======================================================
              10–15 WORD DESCRIPTION
          ======================================================= */}

          <p
            className="
              mt-1
              line-clamp-2
              min-h-[2rem]
              max-w-full
              font-[var(--font-poppins)]
              text-[9px]
              font-medium
              leading-4
              text-[#7B8495]
              sm:text-[9.5px]
            "
          >
            {getShortDescription(product)}
          </p>

          {/* ======================================================
              PRICE
          ======================================================= */}

          <div className="mt-auto pt-3">
            <div>
              <p
                className="
                  font-[var(--font-poppins)]
                  text-[18px]
                  font-black
                  tracking-[-0.025em]
                  text-[#17213D]
                "
              >
                {formatPrice(product.price)}
              </p>

              {discount > 0 && product.compareAtPrice ? (
                <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                  <p
                    className="
                      text-[10px]
                      font-semibold
                      text-[#8F929A]
                      line-through
                      sm:text-[11px]
                    "
                  >
                    {formatPrice(product.compareAtPrice)}
                  </p>

                  <span
                    className="
                      text-[10px]
                      font-black
                      text-[#E83D59]
                      sm:text-[11px]
                    "
                  >
                    Save {discount}%
                  </span>
                </div>
              ) : null}
            </div>

            {/* LOW STOCK */}

            {product.stock > 0 && product.stock <= 5 ? (
              <p
                className="
                  mt-2
                  text-[8px]
                  font-bold
                  text-[#E83D59]
                "
              >
                Only {product.stock} left
              </p>
            ) : null}

            {/* ==================================================
                BOTTOM ACTIONS
                Add to Cart + Wishlist
            =================================================== */}

            <div className="mt-3 flex items-center gap-2">
              {isOutOfStock ? (
                <button
                  type="button"
                  disabled
                  className="
                    inline-flex
                    min-h-9
                    flex-1
                    cursor-not-allowed
                    items-center
                    justify-center
                    rounded-full
                    bg-[#ECECEC]
                    px-3
                    text-[9px]
                    font-bold
                    text-[#999DA4]
                    sm:text-[10px]
                  "
                >
                  Sold Out
                </button>
              ) : (
                <AddToCartButton
                  productId={product._id}
                  quantity={1}
                  className="
                    min-h-9
                    flex-1
                    rounded-full
                    bg-[#a092cd]
                    px-3
                    py-2
                    text-[9px]
                    font-medium
                    text-white
                    shadow-[0_5px_12px_rgba(160,146,205,0.16)]
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:bg-[#8F7FBE]
                    hover:shadow-[0_7px_16px_rgba(160,146,205,0.20)]
                    active:translate-y-0
                    sm:text-[10px]
                  "
                />
              )}

              <Link
                href="/account/wishlist"
                aria-label={`Open wishlist for ${product.name}`}
                className="
                  inline-flex
                  size-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#E4DFEC]
                  bg-[#F8F6FC]
                  text-[#17213D]
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-[#a092cd]
                  hover:bg-[#a092cd]
                  hover:text-white
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#a092cd]
                  focus-visible:ring-offset-2
                "
              >
                <Heart className="size-[15px]" strokeWidth={1.9} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
