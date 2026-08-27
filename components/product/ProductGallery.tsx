"use client";

import Image from "next/image";

import {
  ChevronLeft,
  ChevronRight,
  Expand,
  Heart,
  Sparkles,
} from "lucide-react";

import { useEffect, useState } from "react";

import type { StorefrontProductImage } from "@/types/storefront";

interface ProductGalleryProps {
  images: StorefrontProductImage[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const validImages = images.filter((image) => Boolean(image.url));

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (selectedIndex >= validImages.length) {
      setSelectedIndex(0);
    }
  }, [selectedIndex, validImages.length]);

  const selectedImage =
    validImages[selectedIndex] ?? validImages[0];

  function showPrevious() {
    if (validImages.length < 2) {
      return;
    }

    setSelectedIndex((current) =>
      current === 0
        ? validImages.length - 1
        : current - 1,
    );
  }

  function showNext() {
    if (validImages.length < 2) {
      return;
    }

    setSelectedIndex((current) =>
      current === validImages.length - 1
        ? 0
        : current + 1,
    );
  }

  if (validImages.length === 0) {
    return (
      <div
        className="
    relative
    min-w-0
    overflow-hidden
    rounded-[26px]
    border
    border-[#ECE7E8]
    bg-[#FAF9F9]
    shadow-[0_18px_50px_rgba(23,19,31,0.055)]
        "
      >
        <div
          aria-hidden="true"
          className="
            absolute
            -right-16
            -top-16
            size-48
            rounded-full
            bg-[#3F7DFF]/10
            blur-3xl
          "
        />

        <div className="relative">
          <div
            className="
              mx-auto
              flex
              size-20
              items-center
              justify-center
              rounded-[26px]
              bg-white
              text-[#3F7DFF]
              shadow-[0_15px_35px_rgba(39,52,74,0.08)]
            "
          >
            <Sparkles className="size-9" />
          </div>

          <p className="mt-5 text-sm font-semibold text-[#687489]">Product image coming soon</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* ================================================================
          DESKTOP GALLERY

          Reference layout:

          ┌──────────┐ ┌───────────────────────────────┐
          │          │ │                               │
          │ Image 1  │ │                               │
          │          │ │                               │
          ├──────────┤ │                               │
          │          │ │        MAIN PRODUCT           │
          │ Image 2  │ │             IMAGE             │
          │          │ │                               │
          ├──────────┤ │                               │
          │          │ │                               │
          │ Image 3  │ │                               │
          │          │ │                               │
          ├──────────┤ └───────────────────────────────┘
          │ Image 4  │
          │          │
          └──────────┘
      ================================================================= */}

      <div
        className="
          hidden
          grid-cols-[58px_minmax(0,1fr)]
          gap-2
          lg:grid
          xl:grid-cols-[64px_minmax(0,1fr)]
          xl:gap-2.5
        "
      >
        {/* ================================================================
            LEFT THUMBNAILS — EXACTLY 4
        ================================================================= */}

        <div
          className="
            flex
            flex-col
            gap-2
          "
        >
          {validImages.slice(0, 4).map((image, index) => {
            const isSelected = selectedIndex === index;

            return (
              <button
                key={`${image.url}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`View product image ${index + 1}`}
                aria-current={isSelected ? "true" : undefined}
                className={`
                  group
                  relative
                  aspect-square
                  w-full
                  overflow-hidden
                  rounded-[12px]
                  border
                  bg-[#F7EFE1]
                  transition-all
                  duration-200
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#3F7DFF]
                  focus-visible:ring-offset-2
                  ${
                    isSelected
                      ? "border-[#E72D5A] bg-[#FFF0F4] shadow-[0_5px_16px_rgba(231,45,90,0.14)]"
                      : "border-[#E8E3E5] bg-white hover:-translate-y-0.5 hover:border-[#E72D5A]/30"
                  }
                `}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `${productName} thumbnail ${index + 1}`}
                  fill
                  sizes="76px"
                  className="
                    object-cover
                    transition-transform
                    duration-300
                    group-hover:scale-[1.04]
                  "
                />

                {isSelected ? (
                  <span
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      inset-0
                      rounded-[11px]
                      ring-2
                      ring-inset
                      ring-[#E72D5A]
                    "
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* ================================================================
            DESKTOP MAIN IMAGE
        ================================================================= */}

        <div
          className="
            relative
            min-w-0
            overflow-hidden
            rounded-[26px]
            border
            border-[#EEDDBB]/70
            bg-[#F8F0E3]
            shadow-[0_10px_30px_rgba(39,52,74,0.055)]
          "
        >
          {/* Soft center glow */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,1),rgba(255,255,255,0.72)_58%,rgba(231,45,90,0.035)_100%)]
            "
          />

          {/* Best Seller badge */}

          <div
            className="
              absolute
              left-4
              top-4
              z-20
              rounded-full
              bg-[#E72D5A]
              px-3
              py-1.5
              text-[9px]
              font-black
              leading-none
              text-white
              shadow-[0_6px_16px_rgba(117,67,184,0.24)]
              sm:left-5
              sm:top-5
              sm:text-[10px]
            "
          >
            Best Seller
          </div>

          {/* Wishlist */}

          <button
            type="button"
            aria-label="Add product to wishlist"
            className="
              absolute
              right-4
              top-4
              z-20
              flex
              size-9
              items-center
              justify-center
              rounded-full
              border
              border-white/80
              bg-white/90
              text-[#526075]
              shadow-[0_7px_18px_rgba(39,52,74,0.10)]
              backdrop-blur-md
              transition
              hover:scale-105
              hover:text-[#D55C61]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#3F7DFF]
              focus-visible:ring-offset-2
              sm:right-5
              sm:top-5
              sm:size-10
            "
          >
            <Heart className="size-4" strokeWidth={1.8} />
          </button>

          {/* Expand */}

          <button
            type="button"
            aria-label="View product image"
            className="
              absolute
              right-4
              top-[4.25rem]
              z-20
              flex
              size-9
              items-center
              justify-center
              rounded-full
              border
              border-white/80
              bg-white/90
              text-[#526075]
              shadow-[0_7px_18px_rgba(39,52,74,0.10)]
              backdrop-blur-md
              transition
              hover:scale-105
              hover:text-[#3F7DFF]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#3F7DFF]
              focus-visible:ring-offset-2
              sm:right-5
              sm:size-10
            "
          >
            <Expand className="size-4" />
          </button>

          {/* Main image area */}

          <div
            className="
              relative
              flex
              min-h-[320px]
              items-center
              justify-center
              sm:min-h-[350px]
              xl:min-h-[390px]
            "
          >
            <Image
              key={selectedImage.url}
              src={selectedImage.url}
              alt={selectedImage.alt || `${productName} product image`}
              fill
              priority
              sizes="(max-width: 1023px) 100vw, (max-width: 1279px) 42vw, 44vw"
              className="
                object-contain
                p-4
                sm:p-5
                xl:p-6
              "
            />
          </div>

          {/* Image counter */}

          <div
            className="
              absolute
              bottom-4
              left-4
              z-20
              rounded-full
              border
              border-white/70
              bg-white/85
              px-3
              py-1.5
              text-[9px]
              font-bold
              text-[#526075]
              shadow-sm
              backdrop-blur-md
            "
          >
            {selectedIndex + 1} / {validImages.length}
          </div>

          {/* Previous */}

          {validImages.length > 1 ? (
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Previous product image"
              className="
                absolute
                left-3
                top-1/2
                z-20
                flex
                size-9
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-white/80
                bg-white/90
                text-[#27344A]
                shadow-[0_8px_20px_rgba(39,52,74,0.10)]
                backdrop-blur-md
                transition
                hover:-translate-x-0.5
                hover:bg-white
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#3F7DFF]
                focus-visible:ring-offset-2
              "
            >
              <ChevronLeft className="size-4" />
            </button>
          ) : null}

          {/* Next */}

          {validImages.length > 1 ? (
            <button
              type="button"
              onClick={showNext}
              aria-label="Next product image"
              className="
                absolute
                right-3
                top-1/2
                z-20
                flex
                size-9
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                border
                border-white/80
                bg-white/90
                text-[#27344A]
                shadow-[0_8px_20px_rgba(39,52,74,0.10)]
                backdrop-blur-md
                transition
                hover:translate-x-0.5
                hover:bg-white
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#3F7DFF]
                focus-visible:ring-offset-2
              "
            >
              <ChevronRight className="size-4" />
            </button>
          ) : null}
        </div>
      </div>

      {/* ================================================================
          MOBILE GALLERY

          Main image first, thumbnails underneath.
      ================================================================= */}

      <div className="lg:hidden">
        <div
          className="
            relative
            overflow-hidden
            rounded-[26px]
            border
            border-[#EEDDBB]/70
            bg-[#F8F0E3]
           shadow-[0_10px_30px_rgba(39,52,74,0.055)]
          "
        >
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.95),transparent_70%)]
            "
          />

          <div
            className="
              absolute
              left-4
              top-4
              z-20
              rounded-full
              bg-[#E72D5A]
              px-3
              py-1.5
              text-[9px]
              font-black
              text-white
            "
          >
            Best Seller
          </div>

          <button
            type="button"
            aria-label="Add product to wishlist"
            className="
              absolute
              right-4
              top-4
              z-20
              flex
              size-9
              items-center
              justify-center
              rounded-full
              border
              border-white/80
              bg-white/90
              text-[#526075]
              shadow-sm
              backdrop-blur-md
            "
          >
            <Heart className="size-4" />
          </button>

          <div
            className="
              relative
              flex
              min-h-[360px]
              items-center
              justify-center
              sm:min-h-[450px]
            "
          >
            <Image
              key={selectedImage.url}
              src={selectedImage.url}
              alt={selectedImage.alt || `${productName} product image`}
              fill
              priority
              sizes="100vw"
              className="
                object-contain
                p-6
                sm:p-10
              "
            />
          </div>

          {validImages.length > 1 ? (
            <>
              <button
                type="button"
                onClick={showPrevious}
                aria-label="Previous product image"
                className="
                  absolute
                  left-3
                  top-1/2
                  z-20
                  flex
                  size-9
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/80
                  bg-white/90
                  shadow-sm
                "
              >
                <ChevronLeft className="size-4" />
              </button>

              <button
                type="button"
                onClick={showNext}
                aria-label="Next product image"
                className="
                  absolute
                  right-3
                  top-1/2
                  z-20
                  flex
                  size-9
                  -translate-y-1/2
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/80
                  bg-white/90
                  shadow-sm
                "
              >
                <ChevronRight className="size-4" />
              </button>
            </>
          ) : null}
        </div>

        {/* Mobile thumbnails */}

        {validImages.length > 1 ? (
          <div
            className="
              mt-3
              flex
              gap-2.5
              overflow-x-auto
              pb-1
            "
            aria-label="Product image selection"
          >
            {validImages.slice(0, 4).map((image, index) => {
              const isSelected = selectedIndex === index;

              return (
                <button
                  key={`${image.url}-mobile-${index}`}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  aria-label={`View product image ${index + 1}`}
                  aria-current={isSelected ? "true" : undefined}
                  className={`
                    relative
                    size-[70px]
                    shrink-0
                    overflow-hidden
                    rounded-[12px]
                    border
                    bg-[#F7EFE1]
                    transition-all
                    ${isSelected ? "border-[#D79A20] ring-2 ring-[#E72D5A]/20" : "border-[#E5D9C7]"}
                  `}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `${productName} thumbnail ${index + 1}`}
                    fill
                    sizes="70px"
                    className="object-cover p-0.5"
                  />
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* ================================================================
          TRUST BADGES

          These stay underneath the entire gallery.
      ================================================================= */}

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <TrustBadge icon="✦" text="Strong Magnets" className="bg-[#FFF8E4] text-[#B98500]" />

        <TrustBadge icon="✓" text="BPA Free" className="bg-[#EEF7E7] text-[#5D8D3F]" />

        <TrustBadge icon="✓" text="Non-Toxic" className="bg-[#EEF5FF] text-[#4276B9]" />

        <TrustBadge icon="♢" text="Safe for Kids" className="bg-[#F4EEFB] text-[#7655A3]" />
      </div>
    </div>
  );
}

/* ============================================================================
   TRUST BADGE
============================================================================ */

function TrustBadge({
  icon,
  text,
  className,
}: {
  icon: string;
  text: string;
  className: string;
}) {
  return (
    <div
      className="
        flex
        min-w-0
        items-center
        justify-center
        gap-1.5
        rounded-full
        border
        border-[#E9DEC9]
        bg-white/80
        px-2
        py-2
        shadow-[0_4px_12px_rgba(39,52,74,0.04)]
      "
    >
      <span
        className={`
          flex
          size-5
          shrink-0
          items-center
          justify-center
          rounded-full
          text-[9px]
          font-black
          ${className}
        `}
      >
        {icon}
      </span>

      <span className="truncate text-[8px] font-bold text-[#526075] sm:text-[9px]">
        {text}
      </span>
    </div>
  );
}
