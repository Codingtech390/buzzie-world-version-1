"use client";

import { ArrowRight, Heart, ShoppingBag, Sparkles, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/*
|--------------------------------------------------------------------------
| TEMPORARY WISHLIST TYPE
|--------------------------------------------------------------------------
|
| The actual wishlist model/store/API is currently empty in the project.
| This UI is therefore intentionally structured so that the real
| wishlist data layer can be connected without redesigning the page.
|
*/

interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
}

/*
|--------------------------------------------------------------------------
| TEMPORARY DATA
|--------------------------------------------------------------------------
|
| Keep this empty for now.
|
| Once wishlistStore / wishlist.service / API are implemented, replace
| the `wishlistProducts` state with data coming from useWishlist().
|
*/

const wishlistProducts: WishlistProduct[] = [];

function WishlistProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-[26px] border border-[#EEE5DB] bg-white">
      <div className="aspect-square animate-pulse bg-[#F4EEE7]" />

      <div className="space-y-3 p-5">
        <div className="h-3 w-20 animate-pulse rounded-full bg-[#F0E8DF]" />
        <div className="h-5 w-4/5 animate-pulse rounded-full bg-[#F0E8DF]" />
        <div className="h-4 w-2/5 animate-pulse rounded-full bg-[#F0E8DF]" />
      </div>
    </div>
  );
}

function EmptyWishlist() {
  return (
    <section className="relative overflow-hidden">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#F8E8EE]/70 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-0 h-72 w-72 rounded-full bg-[#EEE8F9]/70 blur-3xl"
      />

      <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:py-28">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#FCE8ED] shadow-[0_12px_35px_rgba(232,61,89,0.10)]">
          <Heart className="h-9 w-9 text-[#E83D59]" strokeWidth={1.8} />
        </div>

        <div className="mt-7 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-[#E83D59]/40 sm:w-12" />

          <p className="font-[var(--font-poppins)] text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#E83D59]">
            Your little collection
          </p>

          <span className="h-px w-8 bg-[#E83D59]/40 sm:w-12" />
        </div>

        <h2 className="mt-4 font-[var(--font-poppins)] text-[32px] font-black leading-tight tracking-[-0.035em] text-[#28212A] sm:text-[42px]">
          Your wishlist is waiting
        </h2>

        <p className="mx-auto mt-4 max-w-lg text-[13px] leading-7 text-[#7D7379] sm:text-[14px]">
          Save the things they love, come back whenever you like, and keep all their next favourites
          in one happy place.
        </p>

        <Link
          href="/shop"
          className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#E83D59] px-7 text-[12px] font-bold text-white shadow-[0_10px_25px_rgba(232,61,89,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#D8324E]"
        >
          Explore BuzzieWorld
          <ArrowRight className="h-4 w-4" />
        </Link>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[11px] font-semibold text-[#978D87]">
          <span className="inline-flex items-center gap-1.5">
            <Heart className="h-3.5 w-3.5 text-[#E83D59]" />
            Save favourites
          </span>

          <span className="hidden h-1 w-1 rounded-full bg-[#D9CEC4] sm:block" />

          <span className="inline-flex items-center gap-1.5">
            <ShoppingBag className="h-3.5 w-3.5 text-[#E83D59]" />
            Shop whenever you're ready
          </span>
        </div>
      </div>
    </section>
  );
}

function WishlistCard({
  product,
  onRemove,
}: {
  product: WishlistProduct;
  onRemove: (id: string) => void;
}) {
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  return (
    <article className="group relative overflow-hidden rounded-[26px] border border-[#EEE5DB] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#E8DDD3] hover:shadow-[0_18px_45px_rgba(65,48,38,0.09)]">
      {/* Product image */}
      <div className="relative aspect-square overflow-hidden bg-[#F8F4EF]">
        <Link
          href={`/products/${product.slug}`}
          aria-label={`View ${product.name}`}
          className="absolute inset-0 z-10"
        />

        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.04] sm:p-6"
        />

        {/* Discount */}
        {discount > 0 && (
          <span className="absolute left-3 top-3 z-20 rounded-full bg-[#E83D59] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wide text-white sm:left-4 sm:top-4">
            {discount}% off
          </span>
        )}

        {/* Remove */}
        <button
          type="button"
          onClick={() => onRemove(product.id)}
          aria-label={`Remove ${product.name} from wishlist`}
          className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#82777E] shadow-sm backdrop-blur transition-all duration-200 hover:bg-[#FCE8ED] hover:text-[#E83D59] sm:right-4 sm:top-4"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Product information */}
      <div className="p-4 sm:p-5">
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="line-clamp-2 min-h-[40px] font-[var(--font-poppins)] text-[13px] font-bold leading-5 text-[#302831] transition-colors group-hover:text-[#E83D59] sm:text-[14px]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex items-center gap-2">
          <span className="font-[var(--font-poppins)] text-[15px] font-black text-[#302831]">
            ₹{product.price.toLocaleString("en-IN")}
          </span>

          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-[11px] font-medium text-[#A59A92] line-through">
              ₹{product.compareAtPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <div className="mt-4">
          {product.inStock ? (
            <button
              type="button"
              className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#FCE8ED] text-[11px] font-bold text-[#C93552] transition-all duration-200 hover:bg-[#E83D59] hover:text-white"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Add to cart
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="flex h-10 w-full cursor-not-allowed items-center justify-center rounded-full bg-[#F3EFEC] text-[11px] font-bold text-[#AAA19B]"
            >
              Out of stock
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function WishlistClient() {
  const [products, setProducts] = useState<WishlistProduct[]>(wishlistProducts);

  const [isLoading] = useState(false);

  const removeFromWishlist = (id: string) => {
    setProducts((current) => current.filter((product) => product.id !== id));
  };

  /*
   * ------------------------------------------------------------
   * LOADING
   * ------------------------------------------------------------
   */

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FFFCF8]">
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto h-4 w-32 animate-pulse rounded-full bg-[#F0E8DF]" />

            <div className="mx-auto mt-5 h-11 w-72 animate-pulse rounded-2xl bg-[#F0E8DF] sm:h-14 sm:w-96" />

            <div className="mx-auto mt-4 h-4 w-full max-w-xl animate-pulse rounded-full bg-[#F0E8DF]" />
          </div>

          <div className="mt-12 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <WishlistProductSkeleton key={index} />
            ))}
          </div>
        </section>
      </main>
    );
  }

  /*
   * ------------------------------------------------------------
   * EMPTY
   * ------------------------------------------------------------
   */

  if (products.length === 0) {
    return (
      <main className="min-h-[calc(100vh-160px)] bg-[#FFFCF8]">
        <section className="border-b border-[#EEE5DB] bg-[#FFFCF8]">
          <div className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-14 lg:px-8">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-[#E83D59]" fill="currentColor" />

              <p className="font-[var(--font-poppins)] text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#E83D59]">
                My account
              </p>
            </div>

            <h1 className="mt-3 font-[var(--font-poppins)] text-[34px] font-black tracking-[-0.035em] text-[#28212A] sm:text-[44px]">
              My Wishlist
            </h1>

            <p className="mt-2 text-[13px] text-[#837980]">Keep the products you love close.</p>
          </div>
        </section>

        <EmptyWishlist />
      </main>
    );
  }

  /*
   * ------------------------------------------------------------
   * WISHLIST
   * ------------------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-[#FFFCF8]">
      {/* Header */}
      <section className="border-b border-[#EEE5DB] bg-[#FFFCF8]">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-14 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-[#E83D59]" fill="currentColor" />

                <p className="font-[var(--font-poppins)] text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#E83D59]">
                  My account
                </p>
              </div>

              <h1 className="mt-3 font-[var(--font-poppins)] text-[34px] font-black tracking-[-0.035em] text-[#28212A] sm:text-[44px]">
                My Wishlist
              </h1>

              <p className="mt-2 text-[13px] text-[#837980]">
                The things they're hoping to take home.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-[#E8DED4] bg-white px-4 py-2.5 text-[11px] font-bold text-[#625860]">
              <Heart className="h-3.5 w-3.5 text-[#E83D59]" fill="currentColor" />
              {products.length} {products.length === 1 ? "favourite" : "favourites"}
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="mb-8 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#E83D59]" />

          <p className="font-[var(--font-poppins)] text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#81767E]">
            Saved for later
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-4 lg:gap-x-6">
          {products.map((product) => (
            <WishlistCard key={product.id} product={product} onRemove={removeFromWishlist} />
          ))}
        </div>

        {/* Continue shopping */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-[#E4D9CF] bg-white px-6 py-3 text-[12px] font-bold text-[#5F555C] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#E83D59]/30 hover:text-[#E83D59]"
          >
            Continue shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
