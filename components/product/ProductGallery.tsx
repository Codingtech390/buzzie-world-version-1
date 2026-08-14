"use client";

import { useState } from "react";

import type { StorefrontProductImage } from "@/types/storefront";

interface ProductGalleryProps {
  images: StorefrontProductImage[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const validImages = images.filter((image) => Boolean(image.url));

  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedImage = validImages[selectedIndex] ?? validImages[0];

  if (validImages.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-[2rem] bg-[#FFF8EC] text-center text-sm text-muted-foreground">
        Product image coming soon
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[2rem] border border-[#F8EFD8] bg-[#FFF8EC]">
        <div className="aspect-square">
          <img
            src={selectedImage.url}
            alt={selectedImage.alt || `${productName} product image`}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {validImages.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`View product image ${index + 1}`}
              className={`overflow-hidden rounded-2xl border-2 bg-[#FFF8EC] ${
                selectedIndex === index ? "border-[#3F7DFF]" : "border-transparent"
              }`}
            >
              <div className="aspect-square">
                <img
                  src={image.url}
                  alt={image.alt || `${productName} thumbnail ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
