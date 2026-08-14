"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import AddToCartButton from "@/components/cart/AddToCartButton";

interface ProductDetailClientProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription?: string;
    price: number;
    compareAtPrice?: number;
    sku?: string;
    stock: number;
    status: "draft" | "active" | "archived";
    featured: boolean;
    images: {
      url: string;
      alt?: string;
    }[];
    ageRange?: {
      min?: number;
      max?: number;
    };
    category?: {
      name: string;
      slug: string;
    } | null;
    brand?: {
      name: string;
      slug: string;
    } | null;
    collection?: {
      name: string;
      slug: string;
    } | null;
  };
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const [quantity, setQuantity] = useState(1);

  const currentImage = product.images?.[selectedImage]?.url;

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  const maxQuantity = Math.max(product.stock, 1);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 text-sm text-black/50">
        <Link href="/shop" className="hover:text-[#3F7DFF]">
          Shop
        </Link>

        <span className="mx-2">/</span>

        <span>{product.name}</span>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        <section>
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#FFF8EC]">
            {currentImage ? (
              <Image
                src={currentImage}
                alt={product.images?.[selectedImage]?.alt || product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-black/40">
                No image available
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={image.url}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-xl border ${
                    selectedImage === index ? "border-[#3F7DFF]" : "border-black/10"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || product.name}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col justify-center">
          {product.featured && (
            <span className="w-fit rounded-full bg-[#79D45C]/15 px-3 py-1 text-xs font-semibold text-[#3F7DFF]">
              Featured
            </span>
          )}

          <h1 className="mt-4 text-4xl font-semibold tracking-tight">{product.name}</h1>

          {product.shortDescription && (
            <p className="mt-4 text-lg text-black/60">{product.shortDescription}</p>
          )}

          <div className="mt-6 flex items-center gap-3">
            <span className="text-3xl font-semibold">₹{product.price.toFixed(2)}</span>

            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-lg text-black/40 line-through">
                ₹{product.compareAtPrice.toFixed(2)}
              </span>
            )}

            {discount > 0 && (
              <span className="rounded-full bg-[#F56B9A]/10 px-3 py-1 text-sm font-medium text-[#F56B9A]">
                {discount}% OFF
              </span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-sm">
            {product.ageRange?.min !== undefined && product.ageRange?.max !== undefined && (
              <span className="rounded-full bg-[#F8EFD8] px-3 py-1">
                Ages {product.ageRange.min}–{product.ageRange.max}
              </span>
            )}

            {product.category && (
              <span className="rounded-full bg-[#F8EFD8] px-3 py-1">{product.category.name}</span>
            )}
          </div>

          <div className="mt-8 border-t border-black/10 pt-8">
            <p className="leading-7 text-black/65">{product.description}</p>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center overflow-hidden rounded-xl border border-black/10">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3"
              >
                −
              </button>

              <span className="min-w-10 text-center">{quantity}</span>

              <button
                type="button"
                onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                disabled={quantity >= product.stock}
                className="px-4 py-3 disabled:opacity-30"
              >
                +
              </button>
            </div>

            <AddToCartButton
              productId={product._id}
              quantity={quantity}
              disabled={product.stock < 1 || product.status !== "active"}
              className="flex-1"
            />
          </div>

          <div className="mt-5 text-sm">
            {product.stock > 0 ? (
              <span className="text-[#3F7DFF]">{product.stock} available</span>
            ) : (
              <span className="text-red-500">Out of stock</span>
            )}
          </div>

          {product.sku && <p className="mt-3 text-xs text-black/40">SKU: {product.sku}</p>}
        </section>
      </div>
    </main>
  );
}
