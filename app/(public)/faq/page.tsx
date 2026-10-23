"use client";

import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PackageCheck,
  Truck,
} from "lucide-react";

import Image from "next/image";

import Link from "next/link";

import { useEffect, useRef, useState } from "react";

import type { StorefrontProduct } from "@/types/storefront";

const faqs = [
  {
    question: "Can I return or exchange product?",

    answer:
      "Product can be exchanged in case of defective or missing parts received. Kindly share 360 degree unboxing video (without any editing) on lookwhatagift@gmail.com and we will gwt back to you after investigation",

    icon: PackageCheck,
  },

  {
    question: "Do you offer bulk or gifting orders or customised orders?",

    answer:
      "Yes, if you are planning a larger purchase, gifting order, school activity, or group requirement, please contact our team @ 8826345978 or drop us an email at lookwhatagift@gmail.com and share what you are looking for. We can help you with the next steps.",

    icon: Truck,
  },

  {
    question: "I still have questions. How can I contact you?",

    answer:
      "If you cannot find the answer you are looking for, please reach out to BuzzieWorld support team @ 8826345978 or drop us an email at lookwhatagift@gmail.com. We will be happy to help.",

    icon: PackageCheck,
  },
];

type TransparentHowToPlayImage = {
  src: string;
  matches: string[];
  clickable?: boolean;
};

const TRANSPARENT_HOW_TO_PLAY_IMAGES: TransparentHowToPlayImage[] = [
  {
    src: "/images/how-to-play/custom-bg-removed/buzzie-brains-part-2.png",
    matches: ["buzzie-brains-part-2"],
  },
  {
    src: "/images/how-to-play/custom-bg-removed/buzzie-brains.png",
    matches: ["buzzie-brains"],
  },
  {
    src: "/images/how-to-play/custom-bg-removed/guess-who-am-i.png",
    matches: [
      "guess-who-am-i",
      "guess-who-i-am-ramayana-edition",
      "guess-who-i-am",
      "guess-who-ramayana",
    ],
  },
  {
    src: "/images/how-to-play/custom-bg-removed/krishna.png",
    matches: ["krishna", "krishna-quest", "krishna-quest-trivia-card-game"],
  },
  {
    src: "/images/how-to-play/custom-bg-removed/logo-blitz.png",
    matches: ["logo-blitz"],
  },
  {
    src: "/images/how-to-play/custom-bg-removed/logology.png",
    matches: ["logology"],
  },
  {
    src: "/images/how-to-play/custom-bg-removed/same-pinch-logo.png",
    matches: ["same-pinch-logo"],
  },
  {
    src: "/images/how-to-play/custom-bg-removed/same-pinch.png",
    matches: ["same-pinch"],
  },
  {
    src: "/images/how-to-play/custom-bg-removed/spell-master.png",
    matches: ["spell-master", "spell-master-phonics-cards"],
  },
  {
    src: "/images/how-to-play/custom-bg-removed/word-families.png",
    matches: ["word-families"],
  },
  {
    src: "/images/how-to-play/custom-bg-removed/wzone-of-giggles.png",
    matches: ["wzone-of-giggles"],
  },

  // new

  // New product images — display only, not clickable yet.
  {
    src: "/images/how-to-play/custom-bg-removed/bg-animal-homes-removebg-preview.png",
    matches: ["animal-homes", "animal-home"],
    clickable: false,
  },
  {
    src: "/images/how-to-play/custom-bg-removed/bg-wordlogy-emoji-removebg-preview.png",
    matches: ["wordlogy-emoji", "wordlogy-emoji-game"],
    clickable: false,
  },
  {
    src: "/images/how-to-play/custom-bg-removed/bg-wordlogy-removebg-preview.png",
    matches: ["wordlogy"],
    clickable: false,
  },
  {
    src: "/images/how-to-play/custom-bg-removed/bg-travelscrapbook-removebg-preview.png",
    matches: ["travel-scrapbook", "travelscrapbook"],
    clickable: false,
  },
  {
    src: "/images/how-to-play/custom-bg-removed/bg-toddler-binder-removebg-preview.png",
    matches: ["toddler-binder"],
    clickable: false,
  },
  {
    src: "/images/how-to-play/custom-bg-removed/bg-mygodflashcard-removebg-preview.png",
    matches: [
      "mygodflashcard",
      "my-god-flashcard",
      "my-god-flash-card",
      "my-gods-flash-cards",
      "my-gods-flash-card",
    ],
    clickable: false,
  },
  {
    src: "/images/how-to-play/custom-bg-removed/bg-multiplication-table-removebg-preview.png",
    matches: ["multiplication-table"],
    clickable: false,
  },
  {
    src: "/images/how-to-play/custom-bg-removed/bg-mathbusy-book-removebg-preview.png",
    matches: ["mathbusy-book", "math-busy-book", "mathbusybook"],
    clickable: false,
  },
  {
    src: "/images/how-to-play/custom-bg-removed/bg-match-o-fun-removebg-preview.png",
    matches: ["match-o-fun", "match-o-fun-game"],
    clickable: false,
  },
  {
    src: "/images/how-to-play/custom-bg-removed/bg-kt-3-removebg-preview.png",
    matches: ["kt-3", "kt3"],
    clickable: false,
  },
  {
    src: "/images/how-to-play/custom-bg-removed/bg-kt-2-part-2-removebg-preview.png",
    matches: ["kt-2-part-2", "kt2-part-2"],
    clickable: false,
  },
  {
    src: "/images/how-to-play/custom-bg-removed/bg-kt-2-part-1-removebg-preview.png",
    matches: ["kt-2-part-1", "kt2-part-1"],
    clickable: false,
  },
  {
    src: "/images/how-to-play/custom-bg-removed/bg-kt-2-removebg-preview.png",
    matches: ["kt-2", "kt2"],
    clickable: false,
  },
  {
    src: "/images/how-to-play/custom-bg-removed/bg-kt-1-removebg-preview.png",
    matches: ["kt-1", "kt1"],
    clickable: false,
  },
  {
    src: "/images/how-to-play/custom-bg-removed/bg-indialogy-removebg-preview.png",
    matches: ["indialogy", "india-logy", "indiaology"],
    clickable: false,
  },
  {
    src: "/images/how-to-play/custom-bg-removed/bg-indiabingo-removebg-preview.png",
    matches: ["indiabingo", "india-bingo"],
    clickable: false,
  },
  {
    src: "/images/how-to-play/custom-bg-removed/bg-guessthecity-india-removebg-preview.png",
    matches: ["guessthecity-india", "guess-the-city-india"],
    clickable: false,
  },
  {
    src: "/images/how-to-play/custom-bg-removed/bg-guess-ramayana-removebg-preview.png",
    matches: [
      "guess-ramayana",
      "guess-the-ramayana",
      "epic-tale-ramayana",
      "epic-tale-of-ramayana",
    ],
    clickable: false,
  },

  {
    src: "/images/how-to-play/custom-bg-removed/bg-ganesha-removebg-preview.png",
    matches: ["create your own ganesha", "ganesha-game", "create-your-own-ganesha"],
    clickable: false,
  },
  {
    src: "/images/how-to-play/custom-bg-removed/bg-flagit-removebg-preview.png",
    matches: ["flagit", "flag-it"],
    clickable: false,
  },
  {
    src: "/images/how-to-play/custom-bg-removed/bg-diwali-chhota-removebg-preview.png",
    matches: [
      "diwali-chhota",
      "diwali-chhota-game",
      "diwali-chhota-box",
      "diwali-kit-small",
      "diwali-kit",
      "diwali-kit-small-box",
    ],
    clickable: false,
  },
  {
    src: "/images/how-to-play/custom-bg-removed/bg-lantern-removebg-preview.png",
    matches: ["create-your-own-lantern", "create your own lantern", "lantern"],
    clickable: false,
  },
  {
    src: "/images/how-to-play/custom-bg-removed/bg-devmoji-removebg-preview.png",
    matches: ["devmoji", "dev-moji", "godmoji", "god-moji"],
    clickable: false,
  },
  {
    src: "/images/how-to-play/custom-bg-removed/bg-brain-binder-removebg-preview.png",
    matches: ["brain-binder", "brainbinder"],
    clickable: false,
  },
  {
    src: "/images/how-to-play/custom-bg-removed/bg-animalworld-removebg-preview.png",
    matches: ["animalworld", "animal-world"],
    clickable: false,
  },
];

function normalizeProductIdentifier(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getTransparentProductImageEntry(
  product: StorefrontProduct,
): TransparentHowToPlayImage | null {
  const identifiers = [
    normalizeProductIdentifier(product.slug),
    normalizeProductIdentifier(product.name),
  ];

  return (
    TRANSPARENT_HOW_TO_PLAY_IMAGES.find((item) =>
      item.matches.some((alias) => identifiers.includes(normalizeProductIdentifier(alias))),
    ) ?? null
  );
}

function getTransparentProductImage(product: StorefrontProduct): string | null {
  return getTransparentProductImageEntry(product)?.src ?? null;
}

const READY_HOW_TO_PLAY_SLUGS = new Set([
  "krishna-quest",
  "krishna-quest-trivia-card-game",
  "spell-master",
  "spell-master-phonics-cards",
]);

const MYTHOLOGY_PRODUCT_NAMES = new Set([
  "my gods flash cards",
  "guess who i am ramayana edition",
  "krishna quest",
  "diwali kit small",
  "diwali chhota box",
  "epic tale ramayana",
  "create your own ganesha",
  "create your own lantern",
  "godmoji",
]);

function normalizeProductName(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\\s+/g, " ");
}

function isReadyHowToPlayProduct(product: StorefrontProduct): boolean {
  const slug = normalizeProductIdentifier(product.slug);
  const name = normalizeProductName(product.name);

  return (
    READY_HOW_TO_PLAY_SLUGS.has(slug) ||
    name === "spell master" ||
    name === "spell master phonics cards"
  );
}

function isAllowedHowToPlayProduct(product: StorefrontProduct): boolean {
  const name = normalizeProductName(product.name);
  const slug = normalizeProductName(product.slug);
  const categoryName = normalizeProductName(product.category?.name ?? "");
  const categorySlug = normalizeProductIdentifier(product.category?.slug ?? "");

  const isMythologyCategory = categoryName === "mythology" || categorySlug === "mythology";

  const isMythologyProduct =
    isMythologyCategory &&
    (MYTHOLOGY_PRODUCT_NAMES.has(name) ||
      MYTHOLOGY_PRODUCT_NAMES.has(slug) ||
      name === "diwali chhota box" ||
      slug === "diwali-chhota-box" ||
      slug === "diwali-chhota");

  return isReadyHowToPlayProduct(product) || isMythologyProduct;
}

function HowToPlayCarousel({ products }: { products: StorefrontProduct[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const visibleProducts = products.filter(
    (product) =>
      product.published &&
      isAllowedHowToPlayProduct(product) &&
      getTransparentProductImage(product) !== null,
  );

  const hasHowToPlay = (product: StorefrontProduct) =>
    Array.isArray(product.howToPlay) &&
    product.howToPlay.some((item) => typeof item.url === "string" && item.url.trim().length > 0);

  const getProductImage = (product: StorefrontProduct) => getTransparentProductImage(product);

  useEffect(() => {
    const container = carouselRef.current;

    if (!container || visibleProducts.length <= 1) return;

    let intervalId: number | undefined;
    let resetTimeoutId: number | undefined;
    let resizeObserver: ResizeObserver | undefined;

    const getLoopWidth = () => {
      const firstCard = container.querySelector<HTMLElement>('[data-how-to-play-card="original"]');

      const firstDuplicate = container.querySelector<HTMLElement>(
        '[data-how-to-play-card="duplicate"]',
      );

      if (!firstCard || !firstDuplicate) return 0;

      return firstDuplicate.offsetLeft - firstCard.offsetLeft;
    };

    const advance = () => {
      const firstCard = container.querySelector<HTMLElement>('[data-how-to-play-card="original"]');

      if (!firstCard) return;

      const styles = window.getComputedStyle(container);
      const gap = Number.parseFloat(styles.columnGap) || 0;
      const step = firstCard.offsetWidth + gap;
      const loopWidth = getLoopWidth();

      if (step <= 0 || loopWidth <= 0) return;

      // Normalize the scroll position before advancing.
      if (container.scrollLeft >= loopWidth) {
        container.scrollTo({
          left: container.scrollLeft - loopWidth,
          behavior: "instant",
        });
      }

      const nextPosition = container.scrollLeft + step;

      container.scrollBy({
        left: step,
        behavior: "smooth",
      });

      // Once the smooth movement enters the duplicated track,
      // shift back by exactly one track width. The displayed
      // products remain visually identical during the reset.
      if (nextPosition >= loopWidth) {
        resetTimeoutId = window.setTimeout(() => {
          const currentContainer = carouselRef.current;
          if (!currentContainer) return;

          const currentLoopWidth = getLoopWidth();
          if (currentLoopWidth <= 0) return;

          if (currentContainer.scrollLeft >= currentLoopWidth) {
            currentContainer.scrollTo({
              left: currentContainer.scrollLeft - currentLoopWidth,
              behavior: "instant",
            });
          }
        }, 550);
      }
    };

    const startAutoplay = () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }

      intervalId = window.setInterval(advance, 3000);
    };

    // Wait for layout so card widths and the duplicate offset
    // are measurable before autoplay starts.
    const startTimeoutId = window.setTimeout(() => {
      startAutoplay();
    }, 500);

    resizeObserver = new ResizeObserver(() => {
      // Recalculate dimensions on the next autoplay tick.
      // No cached widths are kept across responsive changes.
    });

    resizeObserver.observe(container);

    return () => {
      window.clearTimeout(startTimeoutId);

      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }

      if (resetTimeoutId !== undefined) {
        window.clearTimeout(resetTimeoutId);
      }

      resizeObserver?.disconnect();
    };
  }, [visibleProducts.length]);

  const scrollCarousel = (direction: "left" | "right") => {
    const container = carouselRef.current;
    if (!container) return;

    const firstCard = container.querySelector<HTMLElement>('[data-how-to-play-card="original"]');

    if (!firstCard) return;

    const styles = window.getComputedStyle(container);
    const gap = Number.parseFloat(styles.columnGap) || 0;
    const step = firstCard.offsetWidth + gap;
    const loopWidth = (() => {
      const duplicate = container.querySelector<HTMLElement>('[data-how-to-play-card="duplicate"]');

      return duplicate ? duplicate.offsetLeft - firstCard.offsetLeft : 0;
    })();

    if (direction === "left" && container.scrollLeft <= 2 && loopWidth > 0) {
      container.scrollTo({
        left: loopWidth,
        behavior: "instant",
      });
    }

    container.scrollBy({
      left: direction === "right" ? step : -step,
      behavior: "smooth",
    });
  };

  if (visibleProducts.length === 0) {
    return (
      <div className="rounded-[24px] border border-[#ECE8F2] bg-[#FCFAFF] px-6 py-12 text-center">
        <p className="font-playpen text-[12px] font-semibold text-[#77727F]">
          No games are currently available. Please check back soon!
        </p>
      </div>
    );
  }

  const renderProductCard = (product: StorefrontProduct, copy: "original" | "duplicate") => {
    const imageEntry = getTransparentProductImageEntry(product);
    const imageSrc = imageEntry?.src ?? null;

    const canOpen =
      isReadyHowToPlayProduct(product) && imageEntry?.clickable !== false && hasHowToPlay(product);

    const cardClassName =
      "relative block h-[170px] w-[240px] min-w-[240px] shrink-0 snap-start overflow-hidden rounded-[18px] transition-opacity duration-300 sm:h-[190px]";

    return (
      <div
        key={`${copy}-${product._id}`}
        data-how-to-play-card={copy}
        aria-hidden={copy === "duplicate" ? true : undefined}
        className={canOpen ? cardClassName : `${cardClassName} cursor-not-allowed opacity-75`}
        title={canOpen ? `How to play ${product.name}` : "How to play instructions coming soon"}
      >
        {imageSrc &&
          (canOpen ? (
            <Link
              href={`/how-to-play/${encodeURIComponent(product.slug)}`}
              aria-label={`How to play ${product.name}`}
              tabIndex={copy === "duplicate" ? -1 : undefined}
              className="relative block size-full"
            >
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                sizes="240px"
                className="object-contain transition-transform duration-300 hover:scale-105"
              />
            </Link>
          ) : (
            <div aria-disabled="true" className="relative size-full">
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                sizes="240px"
                className="object-contain"
              />
            </div>
          ))}
      </div>
    );
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Previous games"
        onClick={() => scrollCarousel("left")}
        className="absolute left-[10px] top-[42%] z-20 hidden size-[42px] -translate-y-1/2 items-center justify-center rounded-full border border-[#E7DFF0] bg-white text-[#17213D] shadow-[0_8px_25px_rgba(21,18,28,0.10)] transition-all duration-300 hover:-translate-x-0.5 hover:border-[#CDBAE0] hover:bg-[#FAF7FD] lg:flex"
      >
        <ChevronLeft className="size-5" strokeWidth={1.8} />
      </button>

      <div
        ref={carouselRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden bg-gradient-to-r from-[#F4ECFF] via-[#FBF8FF] to-[#F4ECFF] px-12 py-5 sm:gap-4"
      >
        {visibleProducts.map((product) => renderProductCard(product, "original"))}

        {visibleProducts.map((product) => renderProductCard(product, "duplicate"))}
      </div>

      <button
        type="button"
        aria-label="Next games"
        onClick={() => scrollCarousel("right")}
        className="absolute right-[10px] top-[42%] z-20 hidden size-[42px] -translate-y-1/2 items-center justify-center rounded-full border border-[#E7DFF0] bg-white text-[#17213D] shadow-[0_8px_25px_rgba(21,18,28,0.10)] transition-all duration-300 hover:translate-x-0.5 hover:border-[#CDBAE0] hover:bg-[#FAF7FD] lg:flex"
      >
        <ChevronRight className="size-5" strokeWidth={1.8} />
      </button>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const [products, setProducts] = useState<StorefrontProduct[]>([]);

  const [productsLoading, setProductsLoading] = useState(true);

  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        setProductsLoading(true);

        setProductsError(null);

        const response = await fetch("/api/products?published=true&limit=100&sort=newest", {
          signal: controller.signal,
        });

        console.log("FAQ products API status:", response.status);

        console.log("FAQ products API URL:", response.url);

        if (!response.ok) {
          throw new Error("Unable to load products.");
        }

        const data = await response.json();

        console.log("FAQ products API response:", data);

        console.log("FAQ products API keys:", Object.keys(data ?? {}));

        if (!data.success) {
          throw new Error(data.message ?? "Unable to load products.");
        }

        const loadedProducts: StorefrontProduct[] = data.products ?? [];

        console.table(
          loadedProducts.map((product: StorefrontProduct) => ({
            name: product.name,

            categoryName: product.category?.name ?? "No category returned",

            categorySlug: product.category?.slug ?? "No slug returned",

            hasImage: Boolean(product.images?.some((image) => Boolean(image?.url))),

            status: product.status,
          })),
        );

        setProducts(loadedProducts);

        console.log("FAQ API product count:", loadedProducts.length);

        console.log("FAQ API first product:", loadedProducts[0]);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setProductsError(error instanceof Error ? error.message : "Unable to load products.");
      } finally {
        if (!controller.signal.aborted) {
          setProductsLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <main className="min-h-screen bg-white text-[#15121C]">
      {/* =========================================================*

  *            HERO BANNER*

  *          ========================================================= */}

      <section className="w-full">
        <div className="mx-auto w-full max-w-[1920px]">
          <div className="relative overflow-hidden">
            <Image
              src="/images/categories/game-instructions.png"
              alt="BuzzieWorld How to Play and FAQ"
              width={1920}
              height={1080}
              priority
              sizes="100vw"
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* =========================================================*

  *      HOW TO PLAY — PRODUCT CAROUSEL*

  *    ========================================================= */}

      <section className="relative z-10 mt-0 w-full pb-2 pt-8 sm:pt-10 lg:pt-12 ">
        <div className="w-full">
          {/* =====================================================*

  *      SECTION HEADER*

  *  ===================================================== */}

          <div className="mb-7 flex w-full justify-center text-center sm:mb-8 lg:mb-12">
            <div className="flex w-full flex-col items-center">
              <p
                className="

            font-[var(--font-poppins)]

            text-[9px]

            font-extrabold

            uppercase

            tracking-[0.16em]

            text-[#7B4DE8]

            sm:text-[10px]

          "
              >
                Learn the game
              </p>

              <h2
                className="

            mt-5

            w-full

            max-w-[760px]

            text-center

            font-[var(--font-roboto)]

            text-[clamp(2.25rem,5vw,4.4rem)]

            font-black

            uppercase

            leading-[0.92]

            tracking-[-0.055em]

            text-[#111111]"
              >
                How to
                <span className="text-[#E72D5A]"> Play.</span>
              </h2>

              <p
                className="

            mt-3

            w-full

            max-w-[560px]

            font-[var(--font-poppins)]

            text-[10px]

            leading-[1.6]

            text-[#77727F]

            sm:text-[11px]

            lg:text-[13px]

          "
              >
                Pick a game and discover how to play it.
              </p>
            </div>
          </div>

          {/* =====================================================*

  *          LOADING STATE*

  *        ===================================================== */}

          {productsLoading && (
            <div
              className="

              grid

              grid-cols-2

              gap-4

              sm:grid-cols-3

              lg:grid-cols-4

              lg:gap-6

            "
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="

                  overflow-hidden

                  rounded-[24px]

                  bg-white

                "
                >
                  <div
                    className="

      aspect-[1.05]

      animate-pulse

      rounded-[18px]

      bg-[#EEE9F7]

    "
                  />

                  <div className="px-4 pb-5 pt-4">
                    <div className="h-4 w-3/4 animate-pulse rounded-full bg-[#EEEAF2]" />

                    <div className="mt-3 h-3 w-full animate-pulse rounded-full bg-[#F1EEF5]" />

                    <div className="mt-2 h-3 w-4/5 animate-pulse rounded-full bg-[#F1EEF5]" />

                    <div className="mt-4 h-10 w-32 animate-pulse rounded-full bg-[#D8C9EB]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* =====================================================*

  *          ERROR STATE*

  *        ===================================================== */}

          {!productsLoading && productsError && (
            <div
              className="

              rounded-[24px]

              border

              border-[#F0D9E0]

              bg-[#FFF8FA]

              px-6

              py-10

              text-center

            "
            >
              <p
                className="

                font-[var(--font-poppins)]

                text-[12px]

                font-semibold

                text-[#8B5361]

              "
              >
                {productsError}
              </p>
            </div>
          )}

          {/* =====================================================*

  *          PRODUCT CAROUSEL*

  *        ===================================================== */}

          {!productsLoading && !productsError && <HowToPlayCarousel products={products} />}
        </div>
      </section>

      {/* =========================================================*

  *            FAQ INTRO*

  *          ========================================================= */}

      <section className="px-4 pb-8 pt-20 sm:px-6 sm:pb-10 sm:pt-24 lg:px-8 lg:pt-12 bg-[#F4ECFF] mt-5">
        <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
          {/* Heading */}

          <h2
            className="

            mt-5

            w-full

            max-w-[760px]

            text-center

            font-[var(--font-roboto)]

            text-[clamp(2.25rem,5vw,4.4rem)]

            font-black

            uppercase

            leading-[0.92]

            tracking-[-0.055em]

            text-[#111111]

          "
          >
            Everything you
            <span className="text-[#E72D5A]"> need to know.</span>
          </h2>

          {/* Description */}

          <p
            className="

            mx-auto

            mt-7

            w-full

            max-w-[610px]

            text-center

            font-[var(--font-poppins)]

            text-[13px]

            leading-[1.8]

            text-[#666474]

            sm:text-[14px]

            lg:text-[15px]

          "
          >
            From ordering and delivery to product safety and returns, find clear answers to the
            questions that matter before and after purchase.
          </p>
        </div>
      </section>

      {/* =========================================================*

  *            ACCORDION*

  *          ========================================================= */}

      <section className="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28 bg-[#F4ECFF] mb-8">
        <div className="mx-auto max-w-[980px]">
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const Icon = faq.icon;

              const isOpen = openIndex === index;

              return (
                <div
                  key={faq.question}
                  className={`

                        overflow-hidden

                        rounded-[18px]

                        border

                        transition-all

                        duration-300

                        ${
                          isOpen
                            ? "border-[#E8DDF7] bg-[#FCFAFF] shadow-[0_12px_35px_rgba(111,50,245,0.07)]"
                            : "border-[#ECEAF0] bg-white hover:border-[#DDD7E8]"
                        }

                      `}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    className="

                          flex

                          w-full

                          items-center

                          gap-4

                          px-5

                          py-5

                          text-left

                          sm:px-6

                          sm:py-6

                        "
                  >
                    <span
                      className={`

                            flex

                            size-10

                            shrink-0

                            items-center

                            justify-center

                            rounded-full

                            transition-colors

                            duration-300

                            sm:size-11

                            ${isOpen ? "bg-[#F0E7FF] text-[#6F32F5]" : "bg-[#F7F5FA] text-[#8A7F9D]"}

                          `}
                    >
                      <Icon className="size-[18px]" strokeWidth={1.8} />
                    </span>

                    <span
                      className="

                            flex-1

                            pr-2

                            font-[var(--font-poppins)]

                            text-[12px]

                            font-extrabold

                            leading-[1.4]

                            text-[#17141F]

                            sm:text-[14px]

                            lg:text-[15px]

                          "
                    >
                      {faq.question}
                    </span>

                    <span
                      className={`

                            flex

                            size-8

                            shrink-0

                            items-center

                            justify-center

                            rounded-full

                            transition-all

                            duration-300

                            ${isOpen ? "bg-[#6F32F5] text-white" : "bg-[#F6F4F8] text-[#625A6E]"}

                          `}
                    >
                      <ChevronDown
                        className={`

                              size-4

                              transition-transform

                              duration-300

                              ${isOpen ? "rotate-180" : ""}

                            `}
                        strokeWidth={2}
                      />
                    </span>
                  </button>

                  <div
                    className={`

                          grid

                          transition-[grid-template-rows]

                          duration-300

                          ease-out

                          ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}

                        `}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-[#EEEAF2] px-5 pb-6 pt-5 pl-[76px] sm:px-6 sm:pb-7 sm:pl-[82px]">
                        <p
                          className="

                                max-w-[720px]

                                font-[var(--font-poppins)]

                                text-[11px]

                                leading-[1.8]

                                text-[#686573]

                                sm:text-[12px]

                                lg:text-[13px]

                              "
                        >
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================*

  *      STILL NEED HELP*

  *    ========================================================= */}

      <section className="px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8 mt-12 mb-12 ">
        <div className="mx-auto max-w-[1180px]">
          <div
            className="

            relative

            isolate

            min-h-[360px]

            overflow-hidden

            rounded-[28px]

            bg-[#F4ECFF]

            bg-cover

            bg-center

            bg-no-repeat

            sm:min-h-[390px]

            lg:min-h-[430px]

            lg:rounded-[34px]

          "
            style={{
              backgroundImage: "url('/images/banners/faq-bottom-banner.png')",
            }}
          >
            {/* Background overlay */}

            <div
              aria-hidden="true"
              className="

              pointer-events-none

              absolute

              inset-0

              bg-white/[0.04]

            "
            />

            {/* Centered content */}

            <div
              className="

              relative

              z-10

              flex

              min-h-[360px]

              items-center

              justify-center

              px-6

              py-12

              text-center

              sm:min-h-[390px]

              sm:px-10

              lg:min-h-[430px]

              lg:px-16

            "
            >
              <div className="mx-auto flex w-full max-w-[620px] flex-col items-center text-center">
                {/* Eyebrow */}

                <p
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
                  Still need help?
                </p>

                {/* Heading */}

                <h2
                  className="

                  mt-5

            w-full

            max-w-[760px]

            text-center

            font-[var(--font-roboto)]

            text-[clamp(2.25rem,5vw,4.4rem)]

            font-black

            uppercase

            leading-[0.92]

            tracking-[-0.055em]

            text-[#111111]

                "
                >
                  We&apos;re here to <span className="text-[#E72D5A]">help.</span>
                </h2>

                {/* Description */}

                <p
                  className="

                  mx-auto

                  mt-5

                  max-w-[500px]

                  text-center

                  font-[var(--font-poppins)]

                  text-[12px]

                  leading-[1.75]

                  text-[#686273]

                  sm:text-[13px]

                  sm:leading-7

                "
                >
                  Couldn&apos;t find what you were looking for? Reach out to our team and we&apos;ll
                  help you find the right answer.
                </p>

                {/* CTA */}

                <Link
                  href="/contact"
                  className="

                  group

                  mt-7

                  inline-flex

                  min-h-[48px]

                  items-center

                  justify-center

                  gap-3

                  rounded-full

                  bg-[#C391EE]

                  px-6

                  font-[var(--font-poppins)]

                  text-[11px]

                  font-black

                  text-white

                  shadow-[0_10px_25px_rgba(195,145,238,0.25)]

                  transition-all

                  duration-300

                  hover:-translate-y-0.5

                  hover:bg-[#A96FDB]

                  hover:shadow-[0_14px_30px_rgba(169,111,219,0.28)]

                  focus-visible:outline-none

                  focus-visible:ring-2

                  focus-visible:ring-[#C391EE]

                  focus-visible:ring-offset-4

                  focus-visible:ring-offset-white

                  sm:min-h-[50px]

                  sm:px-7

                  sm:text-[12px]

                "
                >
                  <span className="text-white">Contact Support</span>

                  <span
                    className="

                    flex

                    size-7

                    items-center

                    justify-center

                    rounded-full

                    bg-white/20

                    text-white

                    sm:size-8

                  "
                  >
                    <ArrowRight
                      className="

                      size-3.5

                      text-white

                      transition-transform

                      duration-300

                      group-hover:translate-x-1

                      sm:size-4

                    "
                      strokeWidth={2.5}
                    />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
