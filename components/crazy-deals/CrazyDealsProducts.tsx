"use client";

import Link from "next/link";
import { ArrowRight, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import ProductCard from "@/components/product/ProductCard";

import type { StorefrontProduct, StorefrontProductsResponse } from "@/types/storefront";

export default function CrazyDealsProducts() {
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ================================================================
     LOAD PRODUCTS
  ================================================================= */

  useEffect(() => {
    const controller = new AbortController();

    async function loadDeals() {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();

        params.set("status", "active");
        params.set("limit", "100");
        params.set("sort", "newest");

        const response = await fetch(`/api/products?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load deal products.");
        }

        const data: StorefrontProductsResponse = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to load deal products.");
        }

        setProducts(data.products ?? []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setError(err instanceof Error ? err.message : "Something went wrong while loading deals.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadDeals();

    return () => {
      controller.abort();
    };
  }, []);

  /* ================================================================
     DEAL FILTERING
  ================================================================= */

  const dealProducts = useMemo(() => {
    return products
      .filter(
        (product) =>
          typeof product.price === "number" &&
          typeof product.compareAtPrice === "number" &&
          product.compareAtPrice > product.price,
      )
      .sort((a, b) => {
        const aDiscount =
          typeof a.compareAtPrice === "number" && a.compareAtPrice > 0
            ? ((a.compareAtPrice - a.price) / a.compareAtPrice) * 100
            : 0;

        const bDiscount =
          typeof b.compareAtPrice === "number" && b.compareAtPrice > 0
            ? ((b.compareAtPrice - b.price) / b.compareAtPrice) * 100
            : 0;

        return bDiscount - aDiscount;
      });
  }, [products]);

  /* ================================================================
     LOADING
  ================================================================= */

  if (isLoading) {
    return (
      <section className="bg-white py-14 sm:py-16 lg:py-20">
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
          {/* Header skeleton */}
          <div className="flex flex-col items-center text-center">
            <div className="h-3 w-32 animate-pulse rounded-full bg-[#F7EAF0]" />

            <div className="mt-5 h-10 w-72 animate-pulse rounded-xl bg-[#F5F1F8] sm:h-12 sm:w-[420px]" />

            <div className="mt-4 h-4 w-[280px] animate-pulse rounded-full bg-[#F5F1F8] sm:w-[480px]" />
          </div>

          {/* Product skeletons */}
          <div
            className="
              mt-10
              grid
              grid-cols-1
              gap-x-4
              gap-y-8
              sm:grid-cols-2
              sm:gap-5
              lg:grid-cols-3
              xl:grid-cols-4
            "
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-[24px] border border-[#EEEAF1] bg-white"
              >
                <div className="aspect-square animate-pulse bg-[#F4EFF8]" />

                <div className="space-y-3 p-5">
                  <div className="h-3 w-20 animate-pulse rounded bg-[#F1ECF4]" />
                  <div className="h-5 w-3/4 animate-pulse rounded bg-[#F1ECF4]" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-[#F1ECF4]" />
                  <div className="h-5 w-24 animate-pulse rounded bg-[#F1ECF4]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ================================================================
     ERROR
  ================================================================= */

  if (error) {
    return (
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[600px] px-5 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#FFF0F4] text-[#E72D5A]">
            <Sparkles className="size-6" />
          </div>

          <h2
            className="
              mt-5
              font-[var(--font-roboto)]
              text-[clamp(1.7rem,4vw,2.5rem)]
              font-black
              tracking-[-0.045em]
              text-[#111111]
            "
          >
            Deals are taking a little break.
          </h2>

          <p
            className="
              mx-auto
              mt-3
              max-w-[430px]
              font-[var(--font-poppins)]
              text-[13px]
              leading-6
              text-[#687489]
              sm:text-[14px]
            "
          >
            We couldn't load the latest offers right now. Please try again.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="
              mt-7
              inline-flex
              min-h-[46px]
              items-center
              justify-center
              gap-2
              rounded-full
              bg-[#E72D5A]
              px-6
              font-[var(--font-poppins)]
              text-[11px]
              font-black
              uppercase
              tracking-[0.08em]
              text-white
              shadow-[0_12px_28px_rgba(231,45,90,0.20)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#D91F4D]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#E72D5A]
              focus-visible:ring-offset-2
            "
          >
            <RefreshCw className="size-3.5" />
            Try again
          </button>
        </div>
      </section>
    );
  }

  /* ================================================================
     EMPTY
  ================================================================= */

  if (dealProducts.length === 0) {
    return (
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-[620px] px-5 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#F3ECFF] text-[#6F32F5]">
            <Sparkles className="size-6" />
          </div>

          <p
            className="
              mt-5
              font-[var(--font-poppins)]
              text-[10px]
              font-black
              uppercase
              tracking-[0.18em]
              text-[#E72D5A]
            "
          >
            BuzzieWorld offers
          </p>

          <h2
            className="
              mt-3
              font-[var(--font-roboto)]
              text-[clamp(2rem,5vw,3.2rem)]
              font-black
              leading-[0.95]
              tracking-[-0.055em]
              text-[#111111]
            "
          >
            No deals right now.
          </h2>

          <p
            className="
              mx-auto
              mt-5
              max-w-[450px]
              font-[var(--font-poppins)]
              text-[13px]
              leading-6
              text-[#687489]
              sm:text-[14px]
            "
          >
            But there's still plenty to discover. Explore the full BuzzieWorld collection and find
            something worth bringing home.
          </p>

          <Link
            href="/shop"
            className="
              group
              mt-7
              inline-flex
              min-h-[48px]
              items-center
              justify-center
              gap-3
              rounded-full
              bg-[#6F32F5]
              px-7
              font-[var(--font-poppins)]
              text-[11px]
              font-black
              uppercase
              tracking-[0.08em]
              text-white
              shadow-[0_14px_30px_rgba(111,50,245,0.20)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#6024E5]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#6F32F5]
              focus-visible:ring-offset-2
            "
          >
            Explore all products
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    );
  }

  /* ================================================================
     PRODUCTS
  ================================================================= */

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        {/* ============================================================
            SECTION HEADER
        ============================================================ */}

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[680px]">
            {/* Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="h-[2px] w-8 rounded-full bg-[#E72D5A]" />

              <span
                className="
                  font-[var(--font-poppins)]
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.18em]
                  text-[#E72D5A]
                  sm:text-[10px]
                "
              >
                Crazy deals
              </span>

              <span className="size-1.5 rounded-full bg-[#F59A23]" />
            </div>

            {/* Heading */}
            <h2
              className="
                mt-4
                font-[var(--font-roboto)]
                text-[clamp(2rem,4.5vw,3.5rem)]
                font-black
                leading-[0.94]
                tracking-[-0.055em]
                text-[#111111]
              "
            >
              Big savings.
              <br />
              <span className="text-[#E72D5A]">Better play.</span>
            </h2>

            {/* Description */}
            <p
              className="
                mt-5
                max-w-[570px]
                font-[var(--font-poppins)]
                text-[13px]
                leading-6
                text-[#687489]
                sm:text-[14px]
                sm:leading-7
              "
            >
              The products they love, now at prices you'll love even more. Grab the best offers
              before they're gone.
            </p>
          </div>

          {/* Product count / CTA */}
          <div className="flex shrink-0 items-center gap-4 sm:pb-1">
            <span
              className="
                rounded-full
                bg-[#F8F2FF]
                px-3.5
                py-2
                font-[var(--font-poppins)]
                text-[10px]
                font-bold
                text-[#6F32F5]
              "
            >
              {dealProducts.length} deals
            </span>

            <Link
              href="/shop"
              className="
                group
                inline-flex
                items-center
                gap-2
                font-[var(--font-poppins)]
                text-[11px]
                font-black
                uppercase
                tracking-[0.07em]
                text-[#6F32F5]
                transition-colors
                hover:text-[#E72D5A]
              "
            >
              View all products
              <ArrowRight
                className="
                  size-4
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </Link>
          </div>
        </div>

        {/* ============================================================
            EDITORIAL ACCENT
        ============================================================= */}

        <div className="mt-7 flex items-center gap-1.5">
          <span className="h-[2px] w-10 rounded-full bg-[#C391EE]" />
          <span className="h-[2px] w-3 rounded-full bg-[#E72D5A]" />
          <span className="h-[2px] w-1.5 rounded-full bg-[#F5B5C5]" />
        </div>

        {/* ============================================================
            PRODUCT GRID
        ============================================================= */}

        <div
          className="
            mt-9
            grid
            grid-cols-1
            gap-x-4
            gap-y-9
            sm:grid-cols-2
            sm:gap-5
            lg:grid-cols-3
            lg:gap-x-5
            lg:gap-y-10
            xl:grid-cols-4
          "
        >
          {dealProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* ============================================================
            BOTTOM CTA
        ============================================================= */}

        <div className="mt-12 flex justify-center sm:mt-14">
          <Link
            href="/shop"
            className="
              group
              inline-flex
              min-h-[48px]
              items-center
              justify-center
              gap-3
              rounded-full
              border
              border-[#E8DDF5]
              bg-white
              px-7
              font-[var(--font-poppins)]
              text-[11px]
              font-black
              uppercase
              tracking-[0.08em]
              text-[#6F32F5]
              shadow-[0_10px_25px_rgba(39,52,74,0.05)]
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:border-[#D9C7F2]
              hover:bg-[#FBF8FF]
              hover:shadow-[0_14px_30px_rgba(111,50,245,0.10)]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#6F32F5]
              focus-visible:ring-offset-2
            "
          >
            Explore the full collection
            <span
              className="
                flex
                size-7
                items-center
                justify-center
                rounded-full
                bg-[#F3EAFF]
              "
            >
              <ArrowRight
                className="
                  size-3.5
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
