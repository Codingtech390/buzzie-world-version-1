"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import type { StorefrontProduct } from "@/types/storefront";
import AddToCartButton from "@/components/cart/AddToCartButton";
import ProceedToCheckoutButton from "@/components/cart/ProceedToCheckoutButton";
import { useRouter } from "next/navigation";

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
  isOutOfStock,


}: ProductInfoArtworkProps) {
  const [wishlistActive, setWishlistActive] = useState(false);

  const keyFeatures = Array.isArray(product.keyFeatures)
    ? product.keyFeatures
    : [];

  const [quantity, setQuantity] = useState(1);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const router = useRouter();
  const { addItem } = useCart();

  const handleBuyNow = async () => {
    if (isOutOfStock || !price || isBuyingNow) return;

    try {
      setIsBuyingNow(true);

      await addItem(String(product._id), quantity);

      router.push("/checkout");
    } catch (error) {
      console.error("Failed to proceed to checkout:", error);
    } finally {
      setIsBuyingNow(false);
    }
  };
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
      relative
      top-5
      max-w-xl
      font-playpen
      text-[14px]
      font-medium
      leading-6
      text-[#20243D]
      sm:text-[13px]
      sm:leading-6
      xl:text-[15px]
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
        relative
          mt-4
          top-3
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

      {/* FULL-WIDTH PURCHASE SECTION */}
      <section className="min-w-0 w-full lg:col-span-2">
        <div className="flex w-full flex-col gap-3">
          {/* QUANTITY COUNTER */}
          <div className="flex items-center justify-between">
            <span className="font-[var(--font-poppins)] text-sm font-semibold text-[#27344A]">
              Quantity
            </span>

            <div className="flex items-center gap-4 rounded-full border border-[#E8DDF4] bg-white px-2 py-1.5">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity <= 1 || isOutOfStock}
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                className="flex size-8 items-center justify-center rounded-full text-[#7655A3] transition hover:bg-[#F4EEFB] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus className="size-4" />
              </button>

              <span
                aria-live="polite"
                className="min-w-5 text-center text-sm font-bold text-[#27344A]"
              >
                {quantity}
              </span>

              <button
                type="button"
                aria-label="Increase quantity"
                disabled={isOutOfStock}
                onClick={() => setQuantity((current) => current + 1)}
                className="flex size-8 items-center justify-center rounded-full text-[#7655A3] transition hover:bg-[#F4EEFB] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          {/* HALF-WIDTH PURCHASE BUTTONS */}
          <div className="flex w-full gap-3">
            <AddToCartButton
              productId={String(product._id)}
              quantity={quantity}
              disabled={isOutOfStock || !price}
              className="relative top-5 min-h-12 min-w-0 flex-1 rounded-full bg-[#C391EE] px-3 py-3 font-[var(--font-poppins)] text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#E83D59] disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
            />

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isOutOfStock || !price || isBuyingNow}
              className="relative top-5 flex min-h-12 min-w-0 flex-1 items-center justify-center rounded-full bg-[#E83D59] px-3 py-3 font-[var(--font-poppins)] text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#C92D49] disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
            >
              {isBuyingNow ? "Please wait..." : "Buy Now"}
            </button>
          </div>
        </div>
      </section>

      {/* ================================================================
          PRODUCT BENEFITS / TRUST VECTORS
      ================================================================= */}
      <div
        className="
         mt-4
    w-[75%]
    overflow-hidden
    sm:mt-5
    xl:mt-5
        "
      >
        <Image
          src="/images/benefits-vectors/trust-badge.png"
          alt="Product benefits and safety features"
          width={1200}
          height={200}
          sizes="75vw"
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
