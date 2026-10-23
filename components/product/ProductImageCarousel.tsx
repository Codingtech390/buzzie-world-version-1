"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { StorefrontProduct } from "@/types/storefront";

interface ProductImageCarouselProps {
  images: StorefrontProduct["images"];
  carouselImages?: StorefrontProduct["carouselImages"];
  productName: string;
}

export default function ProductImageCarousel({
  images,
  carouselImages,
  productName,
}: ProductImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = useMemo(() => {
    const configuredImages = Array.isArray(carouselImages)
      ? carouselImages.filter(
          (image) => typeof image.url === "string" && image.url.trim().length > 0,
        )
      : [];

    const fallbackImages = Array.isArray(images)
      ? images.filter((image) => typeof image.url === "string" && image.url.trim().length > 0)
      : [];

    return configuredImages.length > 0 ? configuredImages : fallbackImages;
  }, [carouselImages, images]);

  useEffect(() => {
    setActiveIndex(0);
  }, [productName, slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [slides.length]);

  if (slides.length === 0) return null;

  function changeSlide(direction: number) {
    setActiveIndex((current) => (current + direction + slides.length) % slides.length);
  }

  return (
    <section
      aria-label={`${productName} image carousel`}
      className="relative m-0 w-full max-w-none overflow-hidden bg-[#F5EEDC] p-0"
    >
      <div className="relative h-[100vh] min-h-[300px] w-full sm:h-[65vh] lg:h-[100vh]">
        {slides.map((image, index) => (
          <div
            key={`${image.url}-${index}`}
            aria-hidden={index !== activeIndex}
            className={`
              absolute
              inset-0
              transition-opacity
              duration-700
              ease-in-out
              motion-reduce:transition-none
              ${index === activeIndex ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"}
            `}
          >
            <Image
              src={image.url}
              alt={image.alt?.trim() || `${productName} carousel image ${index + 1}`}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </div>
        ))}

        {slides.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous carousel image"
              onClick={() => changeSlide(-1)}
              className="
                absolute
                left-3
                top-1/2
                z-20
                flex
                h-10
                w-10
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-white/85
                text-black
                shadow-md
                transition
                hover:scale-105
                hover:bg-white
                sm:left-6
                sm:h-12
                sm:w-12
              "
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              type="button"
              aria-label="Next carousel image"
              onClick={() => changeSlide(1)}
              className="
                absolute
                right-3
                top-1/2
                z-20
                flex
                h-10
                w-10
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-white/85
                text-black
                shadow-md
                transition
                hover:scale-105
                hover:bg-white
                sm:right-6
                sm:h-12
                sm:w-12
              "
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center gap-2">
              {slides.map((image, index) => (
                <button
                  key={`indicator-${image.url}-${index}`}
                  type="button"
                  aria-label={`Show carousel image ${index + 1}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  onClick={() => setActiveIndex(index)}
                  className={`
                    h-2.5
                    rounded-full
                    border
                    border-white
                    shadow-sm
                    transition-all
                    duration-300
                    ${
                      index === activeIndex ? "w-7 bg-white" : "w-2.5 bg-white/50 hover:bg-white/80"
                    }
                  `}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
