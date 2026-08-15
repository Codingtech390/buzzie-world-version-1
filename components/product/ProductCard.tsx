"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, Sparkles } from "lucide-react";

import AddToCartButton from "@/components/cart/AddToCartButton";
import type { StorefrontProduct } from "@/types/storefront";

interface ProductCardProps {
  product: StorefrontProduct;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function getDiscountPercentage(price: number, compareAtPrice?: number): number {
  if (typeof compareAtPrice !== "number" || compareAtPrice <= price || compareAtPrice <= 0) {
    return 0;
  }

  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.find((image) => image.url)?.url || null;

  const imageAlt = product.images?.find((image) => image.alt)?.alt || product.name;

  const discount = getDiscountPercentage(product.price, product.compareAtPrice);

  const isOutOfStock = product.stock <= 0;

  return (
    <article className="group relative flex h-full min-w-0 flex-col">
      <div className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-[#EEDDBB]/65 bg-white shadow-[0_10px_30px_rgba(39,52,74,0.055)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_22px_48px_rgba(39,52,74,0.11)]">
        <div className="relative overflow-hidden bg-[#FFF8EC]">
          <Link
            href={`/products/${product.slug}`}
            className="block"
            aria-label={`View ${product.name}`}
          >
            <div className="relative aspect-square overflow-hidden">
              {primaryImage ? (
                <Image
                  src={primaryImage}
                  alt={imageAlt}
                  fill
                  sizes="(max-width: 639px) 46vw, (max-width: 1023px) 44vw, 23vw"
                  className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.045]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(145deg,#FFF8EC,#F8EFD8)] px-6 text-center">
                  <div>
                    <Sparkles className="mx-auto size-8 text-[#3F7DFF]/60" />
                    <p className="mt-3 text-xs font-semibold text-[#687489]">Image coming soon</p>
                  </div>
                </div>
              )}

              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#27344A]/12 to-transparent"
              />

              <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                {product.featured ? (
                  <span className="rounded-full bg-[#3F7DFF] px-2.5 py-1.5 text-[0.62rem] font-bold text-white shadow-[0_6px_15px_rgba(63,125,255,0.22)]">
                    Featured
                  </span>
                ) : null}

                {discount > 0 ? (
                  <span className="rounded-full bg-[#F56B9A] px-2.5 py-1.5 text-[0.62rem] font-bold text-white shadow-[0_6px_15px_rgba(245,107,154,0.18)]">
                    {discount}% off
                  </span>
                ) : null}
              </div>
            </div>
          </Link>

          <Link
            href="/account/wishlist"
            aria-label={`Open wishlist for ${product.name}`}
            className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full border border-white/80 bg-white/90 text-[#526075] shadow-[0_8px_18px_rgba(39,52,74,0.08)] backdrop-blur transition-all duration-200 hover:scale-105 hover:text-[#C44770] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
          >
            <Heart className="size-4" strokeWidth={2} />
          </Link>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          {product.category?.name ? (
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.15em] text-[#3F7DFF]">
              {product.category.name}
            </p>
          ) : null}

          <Link
            href={`/products/${product.slug}`}
            className="mt-1 block focus-visible:outline-none"
          >
            <h3 className="line-clamp-2 min-h-[2.9rem] font-[var(--font-roboto)] text-[1rem] font-black leading-6 tracking-[-0.02em] text-[#27344A] transition-colors duration-200 group-hover:text-[#2A62D8]">
              {product.name}
            </h3>
          </Link>

          {product.shortDescription ? (
            <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-xs leading-5 text-[#687489] sm:text-sm">
              {product.shortDescription}
            </p>
          ) : (
            <p className="mt-2 min-h-[2.5rem] text-xs leading-5 text-transparent sm:text-sm">
              Product discovery starts here.
            </p>
          )}

          <div className="mt-auto pt-4">
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                <p className="font-[var(--font-roboto)] text-lg font-black tracking-[-0.02em] text-[#27344A]">
                  {formatPrice(product.price)}
                </p>

                {discount > 0 && product.compareAtPrice ? (
                  <p className="mt-0.5 text-xs text-[#99A1AF] line-through">
                    {formatPrice(product.compareAtPrice)}
                  </p>
                ) : null}
              </div>

              <Link
                href={`/products/${product.slug}`}
                aria-label={`View ${product.name}`}
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#FFF8EC] text-[#526075] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#3F7DFF]/10 hover:text-[#2A62D8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
              >
                <ArrowUpRight className="size-4" strokeWidth={2} />
              </Link>
            </div>

            <div className="mt-4">
              {isOutOfStock ? (
                <button
                  type="button"
                  disabled
                  className="inline-flex min-h-10 w-full cursor-not-allowed items-center justify-center rounded-full bg-[#F2F3F5] px-4 text-xs font-bold text-[#99A1AF]"
                >
                  Sold out
                </button>
              ) : (
                <AddToCartButton
                  productId={product._id}
                  quantity={1}
                  className="min-h-10 w-full rounded-full px-4 py-2.5 text-xs font-bold shadow-[0_10px_20px_rgba(63,125,255,0.14)] sm:text-sm"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
