"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, Sparkles } from "lucide-react";

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

function getDiscountPercentage(
  price: number,
  compareAtPrice?: number,
): number {
  if (
    typeof compareAtPrice !== "number" ||
    compareAtPrice <= price ||
    compareAtPrice <= 0
  ) {
    return 0;
  }

  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

/* ================================================================
   PRODUCT CARD
================================================================ */

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage =
    product.images?.find((image) => Boolean(image.url))?.url || null;

  const imageAlt =
    product.images?.find((image) => Boolean(image.alt))?.alt ||
    product.name;

  const discount = getDiscountPercentage(
    product.price,
    product.compareAtPrice,
  );

  const isOutOfStock = product.stock <= 0;

  return (
    <article className="group relative flex h-full min-w-0 flex-col">
      {/* ==========================================================
          CARD
          No visible border — the arc is the visual frame.
      =========================================================== */}

      <div
        className="
          flex
          h-full
          w-full
          flex-col
          overflow-hidden
          rounded-[24px]

          transition-all
          duration-300
          ease-out
          group-hover:-translate-y-1

        "
      >
        {/* ========================================================
            ARC IMAGE AREA
        ========================================================= */}

        <div
          className="
            relative
            isolate
            w-full
            overflow-hidden
            bg-[#C391EE]
          "
          style={{
            height: "clamp(205px, 22vw, 285px)",
            borderRadius: "50% 50% 0 0 / 27% 27% 0 0",
          }}
        >
          {/* ======================================================
              PRODUCT IMAGE
          ======================================================= */}

          <Link
            href={`/products/${product.slug}`}
            aria-label={`View ${product.name}`}
            className="
              absolute
              inset-0
              z-[1]
              block
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#C391EE]
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
                  p-5
                  transition-transform
                  duration-500
                  ease-[cubic-bezier(0.22,1,0.36,1)]
                  group-hover:scale-[1.045]
                  sm:p-6
                  lg:p-7
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

          {/* ======================================================
              FEATURED / DISCOUNT BADGES
          ======================================================= */}

          <div
            className="
              absolute
              left-4
              top-4
              z-10
              flex
              flex-wrap
              gap-1.5
            "
          >
            {product.featured ? (
              <span
                className="
                  rounded-full
                  bg-[#E83D59]
                  px-2.5
                  py-1.5
                  text-[8px]
                  font-black
                  uppercase
                  leading-none
                  tracking-[0.04em]
                  text-white
                  shadow-[0_5px_12px_rgba(232,61,89,0.20)]
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
                  px-2.5
                  py-1.5
                  text-[8px]
                  font-black
                  uppercase
                  leading-none
                  tracking-[0.04em]
                  text-white
                  shadow-[0_5px_12px_rgba(23,33,61,0.18)]
                "
              >
                {discount}% OFF
              </span>
            ) : null}
          </div>

          {/* ======================================================
              WISHLIST
          ======================================================= */}

          <Link
            href="/account/wishlist"
            aria-label={`Open wishlist for ${product.name}`}
            className="
              absolute
              right-4
              top-4
              z-10
              flex
              size-9
              items-center
              justify-center
              rounded-full
              border
              border-white/80
              bg-white/90
              text-[#17213D]
              shadow-[0_6px_15px_rgba(39,52,74,0.10)]
              backdrop-blur-sm
              transition-all
              duration-200
              hover:scale-105
              hover:text-[#E83D59]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#C391EE]
              focus-visible:ring-offset-2
            "
          >
            <Heart
              className="size-[16px]"
              strokeWidth={1.9}
            />
          </Link>
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
              CATEGORY
          ======================================================= */}

          {product.category?.name ? (
            <p
              className="
                text-[8px]
                font-black
                uppercase
                tracking-[0.15em]
                text-[#8A8199]
              "
            >
              {product.category.name}
            </p>
          ) : (
            <p
              className="
                text-[8px]
                font-black
                uppercase
                tracking-[0.15em]
                text-transparent
              "
              aria-hidden="true"
            >
              Product
            </p>
          )}

          {/* ======================================================
              PRODUCT NAME
          ======================================================= */}

          <Link
            href={`/products/${product.slug}`}
            className="
              mt-1.5
              block
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#C391EE]
              focus-visible:ring-offset-2
            "
          >
            <h3
              className="
                line-clamp-2
                min-h-[2.8rem]
                font-[var(--font-poppins)]
                text-[11px]
                font-black
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
              BOTTOM SECTION
          ======================================================= */}

          <div className="mt-auto pt-3">
            {/* ====================================================
                PRICE
            ===================================================== */}

            <div className="flex items-end justify-between gap-2">
              <div className="min-w-0">
                <p
                  className="
                    font-[var(--font-poppins)]
                    text-base
                    font-black
                    tracking-[-0.025em]
                    text-[#17213D]
                    sm:text-[17px]
                  "
                >
                  {formatPrice(product.price)}
                </p>

                {discount > 0 && product.compareAtPrice ? (
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <p
                      className="
                        text-[8px]
                        font-medium
                        text-[#9A9EA7]
                        line-through
                      "
                    >
                      {formatPrice(product.compareAtPrice)}
                    </p>

                    <span
                      className="
                        text-[8px]
                        font-black
                        text-[#E83D59]
                      "
                    >
                      Save {discount}%
                    </span>
                  </div>
                ) : null}
              </div>

              {/* ==================================================
                  VIEW PRODUCT
              =================================================== */}

              <Link
                href={`/products/${product.slug}`}
                aria-label={`View ${product.name}`}
                className="
                  flex
                  size-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#E2DBD3]
                  bg-white
                  text-[#17213D]
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-[#C391EE]
                  hover:bg-[#C391EE]
                  hover:text-white
                "
              >
                <ArrowUpRight
                  className="size-3.5"
                  strokeWidth={2}
                />
              </Link>
            </div>

            {/* ====================================================
                LOW STOCK
            ===================================================== */}

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

            {/* ====================================================
                ADD TO CART
            ===================================================== */}

            <div className="mt-3">
              {isOutOfStock ? (
                <button
                  type="button"
                  disabled
                  className="
                    inline-flex
                    min-h-9
                    w-full
                    cursor-not-allowed
                    items-center
                    justify-center
                    rounded-full
                    bg-[#ECECEC]
                    px-3
                    text-[9px]
                    font-black
                    text-[#999DA4]
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
                    w-full
                    rounded-full
                    bg-[#C391EE]
                    px-3
                    py-2
                    text-[9px]
                    font-black
                    text-white
                    shadow-[0_7px_16px_rgba(195,145,238,0.24)]
                    transition-all
                    duration-300
                    hover:bg-[#E83D59]
                    hover:shadow-[0_9px_20px_rgba(232,61,89,0.22)]
                    active:translate-y-0
                    sm:text-[10px]
                  "
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
