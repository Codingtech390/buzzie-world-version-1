"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useState } from "react";

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

export default function ProductInfoArtwork({
  product,
  ageLabel,
  hasDiscount,
  discount,
}: ProductInfoArtworkProps) {
  const [wishlistActive, setWishlistActive] = useState(false);

  return (
    <section className="w-full">
      {/* ================================================================
          BADGES + WISHLIST
      ================================================================= */}

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
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

      {/* ================================================================
          CATEGORY
      ================================================================= */}

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

      {/* ================================================================
          PRODUCT NAME
      ================================================================= */}

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

      {/* ================================================================
          SHORT DESCRIPTION
      ================================================================= */}

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

      {/* ================================================================
          RATING / META
      ================================================================= */}

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

      {/* ================================================================
          PRICE
      ================================================================= */}

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

      {/* ================================================================
          PRODUCT BENEFITS / TRUST VECTORS
      ================================================================= */}

      <div
        className="
          mt-4
          w-full
          overflow-hidden
          sm:mt-5
        "
      >
        <Image
          src="/images/benefits-vectors/product-details-badges-2.png"
          alt="Product benefits and safety features"
          width={1200}
          height={220}
          sizes="100%"
          className="
            block
            h-auto
            w-full
            object-contain
            object-left
          "
        />
      </div>
    </section>
  );
}
