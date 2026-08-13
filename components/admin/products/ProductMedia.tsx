"use client";

import { useState } from "react";

import type { ProductImage } from "@/types/product";

interface ProductMediaProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  disabled?: boolean;
}

export default function ProductMedia({ images, onChange, disabled = false }: ProductMediaProps) {
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");

  function addImage() {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      return;
    }

    onChange([
      ...images,
      {
        url: trimmedUrl,
        alt: alt.trim() || undefined,
      },
    ]);

    setUrl("");
    setAlt("");
  }

  function removeImage(index: number) {
    onChange(images.filter((_, imageIndex) => imageIndex !== index));
  }

  function moveImage(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= images.length) {
      return;
    }

    const nextImages = [...images];

    [nextImages[index], nextImages[targetIndex]] = [nextImages[targetIndex], nextImages[index]];

    onChange(nextImages);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold">Product Media</h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Add product image URLs. The first image is used as the primary product image.
        </p>
      </div>

      <div className="rounded-xl border p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <input
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com/product.jpg"
            disabled={disabled}
            className="h-10 rounded-xl border bg-background px-3 text-sm outline-none focus:border-[#3F7DFF] focus:ring-2 focus:ring-[#3F7DFF]/15"
          />

          <input
            type="text"
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
            placeholder="Image alt text"
            disabled={disabled}
            className="h-10 rounded-xl border bg-background px-3 text-sm outline-none focus:border-[#3F7DFF] focus:ring-2 focus:ring-[#3F7DFF]/15"
          />

          <button
            type="button"
            onClick={addImage}
            disabled={disabled || !url.trim()}
            className="h-10 rounded-xl bg-[#3F7DFF] px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add Image
          </button>
        </div>
      </div>

      {images.length === 0 ? (
        <div className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
          No product images added yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className="overflow-hidden rounded-xl border bg-background"
            >
              <div className="aspect-square bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.alt || "Product image"}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-3 p-3">
                <p className="truncate text-xs text-muted-foreground">
                  {index === 0 ? "Primary image" : `Image ${index + 1}`}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => moveImage(index, "up")}
                    disabled={disabled || index === 0}
                    className="flex-1 rounded-lg border px-2 py-2 text-xs font-medium hover:bg-muted disabled:opacity-40"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    onClick={() => moveImage(index, "down")}
                    disabled={disabled || index === images.length - 1}
                    className="flex-1 rounded-lg border px-2 py-2 text-xs font-medium hover:bg-muted disabled:opacity-40"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    disabled={disabled}
                    className="flex-1 rounded-lg border border-[#F56B9A]/30 px-2 py-2 text-xs font-medium text-[#C44770] hover:bg-[#F56B9A]/5 disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
