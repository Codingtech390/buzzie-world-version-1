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

  const keyFeatures = Array.isArray(product.keyFeatures)
    ? product.keyFeatures
    : [];

  /*
   * Storefront products can legitimately have no price yet.
   * Narrow the optional values into concrete local values so
   * TypeScript knows exactly what is being passed to formatPrice().
   */
  const price = typeof product.price === "number" ? product.price : null;

  const compareAtPrice = typeof product.compareAtPrice === "number" ? product.compareAtPrice : null;


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
          font-playpen
          text-[clamp(2rem,3.2vw,2rem)]
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
      max-w-xl
      font-[var(--font-poppins)]
      text-[14px]
      font-medium
      leading-6
      text-[#20243D]
      sm:text-[13px]
      sm:leading-6
      xl:text-[13px]
    "
        >
          {product.shortDescription}
        </p>
      ) : null}

      {/* ================================================================
    KEY FEATURES
================================================================ */}

      {keyFeatures.length > 0 ? (
        <div
          className="
      mt-6
      max-w-2xl
      rounded-2xl
      border
      border-[#C391EE]/20
      bg-[#F9F6FF]
      px-4
      py-4
      sm:mt-7
      sm:px-5
      sm:py-5
    "
        >
          <h2
            className="
        font-playpen
        text-[13px]
        font-extrabold
        uppercase
        tracking-[0.08em]
        text-[#7044B8]
      "
          >
            Key Features
          </h2>

          <ul className="mt-3 space-y-2.5">
            {keyFeatures.map((feature, index) => (
              <li
                key={`${product._id}-feature-${index}`}
                className="
            flex
            items-start
            gap-3
            font-[var(--font-poppins)]
            text-[12px]
            font-medium
            leading-[1.7]
            text-[#34384D]
            sm:text-[13px]
            sm:leading-6
            lg:text-[13px]
          "
              >
                <span
                  aria-hidden="true"
                  className="
              mt-[6px]
              flex
              size-4
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#C391EE]/90
              text-[9px]
              font-black
              text-black
            "
                >
                  ✓
                </span>

                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
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
        {price !== null ? (
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
            {formatPrice(price)}
          </span>
        ) : (
          <span
            className="
              font-[var(--font-roboto)]
              text-[1.35rem]
              font-black
              leading-none
              tracking-[-0.035em]
              text-[#7044B8]
              sm:text-[1.5rem]
            "
          >
            Price coming soon
          </span>
        )}

        {hasDiscount && compareAtPrice !== null ? (
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
            {formatPrice(compareAtPrice)}
          </span>
        ) : null}

        {discount > 0 && price !== null ? (
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
          xl:-mt-5
        "
      >
        <Image
          src="/images/benefits-vectors/info-artwork.png"
          alt="Product benefits and safety features"
          width={1200}
          height={200}
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
