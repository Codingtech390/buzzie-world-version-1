"use client";

import { useEffect, useState } from "react";

import ProductCard from "@/components/product/ProductCard";

import type { StorefrontProduct, StorefrontProductsResponse } from "@/types/storefront";

interface RelatedProductsProps {
  currentProductId: string;
}

export default function RelatedProducts({ currentProductId }: RelatedProductsProps) {
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function loadFeaturedProducts() {
      try {
        setIsLoading(true);

        const params = new URLSearchParams();
        params.set("status", "active");
        params.set("featured", "true");
        params.set("limit", "5");
        params.set("sort", "newest");

        const response = await fetch(`/api/products?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load featured products");
        }

        const data: StorefrontProductsResponse = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to load featured products");
        }

        setProducts(
          (data.products ?? []).filter((product) => product._id !== currentProductId).slice(0, 4),
        );
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setProducts([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadFeaturedProducts();

    return () => {
      controller.abort();
    };
  }, [currentProductId]);

  if (isLoading) {
    return (
      <section className="mt-16">
        <div className="mb-6">
          <div className="h-7 w-52 animate-pulse rounded bg-[#F8EFD8]" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="aspect-[0.82] animate-pulse rounded-3xl bg-[#F8EFD8]" />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#3F7DFF]">
          Featured picks
        </p>

        <h2 className="mt-2 text-2xl font-bold text-[#252525]">Featured treasures</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
