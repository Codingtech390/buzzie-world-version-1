"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

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

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.find((image) => image.url)?.url || null;

  const imageAlt = product.images?.find((image) => image.alt)?.alt || product.name;

  const hasDiscount =
    typeof product.compareAtPrice === "number" && product.compareAtPrice > product.price;

  const isOutOfStock = product.stock <= 0;

  return (
    <article className="group relative">
      <div className="relative overflow-hidden rounded-3xl border border-[#F8EFD8] bg-[#FFF8EC]">
        <Link
          href={`/products/${product.slug}`}
          className="block"
          aria-label={`View ${product.name}`}
        >
          <div className="relative aspect-square overflow-hidden">
            {primaryImage ? (
              <img
                src={primaryImage}
                alt={imageAlt}
                className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#F8EFD8] px-6 text-center text-sm text-muted-foreground">
                Image coming soon
              </div>
            )}

            {product.featured && (
              <span className="absolute left-3 top-3 rounded-full bg-[#3F7DFF] px-3 py-1.5 text-xs font-semibold text-white">
                Featured
              </span>
            )}

            {hasDiscount && (
              <span className="absolute right-3 top-3 rounded-full bg-[#F56B9A] px-3 py-1.5 text-xs font-semibold text-white">
                Sale
              </span>
            )}

            <button
              type="button"
              aria-label={`Add ${product.name} to wishlist`}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
              className="absolute right-3 bottom-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#3F7DFF] shadow-sm backdrop-blur transition hover:scale-105"
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </Link>

        <div className="p-4 sm:p-5">
          {product.category?.name && (
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#3F7DFF]">
              {product.category.name}
            </p>
          )}

          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="line-clamp-2 min-h-[3rem] text-base font-semibold text-[#252525] transition hover:text-[#3F7DFF]">
              {product.name}
            </h3>
          </Link>

          {product.shortDescription && (
            <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">
              {product.shortDescription}
            </p>
          )}

          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-lg font-bold text-[#252525]">{formatPrice(product.price)}</p>

              {hasDiscount && (
                <p className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice!)}
                </p>
              )}
            </div>

            <AddToCartButton
              productId={product._id}
              disabled={isOutOfStock}
              quantity={1}
              className="h-10 rounded-full px-4 text-sm"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
