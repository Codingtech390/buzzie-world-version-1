import { ArrowRight, Heart, Star, Users, Zap } from "lucide-react";

import Image from "next/image";

import Link from "next/link";

import { notFound } from "next/navigation";

import JsonLd from "@/components/seo/JsonLd";

import { absoluteUrl, createBreadcrumbJsonLd, createProductJsonLd } from "@/lib/seo";

import type { Metadata } from "next";

import HoverVideoPreview from "@/components/product/HoverVideoPreview";
import ProductGallery from "@/components/product/ProductGallery";
import ProductImageCarousel from "@/components/product/ProductImageCarousel";

import ProductInfoArtwork from "@/components/product/ProductInfoArtwork";

import ProductInfoDiary from "@/components/product/ProductInfoDiary";

// import ProductPurchaseCard from "@/components/product/ProductPurchaseCard";

import Reveal from "@/components/home/Reveal";

import type { StorefrontProduct, StorefrontProductResponse } from "@/types/storefront";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/* ============================================================================*

*    PRODUCT DATA*

*  ============================================================================ */

async function getProduct(slug: string): Promise<StorefrontProduct | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/products/slug/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  const data: StorefrontProductResponse = await response.json();

  if (!data.success || !data.product) {
    return null;
  }

  return data.product;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found",

      description: "The requested BuzzieWorld product could not be found.",

      robots: {
        index: false,

        follow: false,
      },
    };
  }

  const description =
    product.shortDescription || product.description || `Discover ${product.name} at BuzzieWorld.`;

  const canonicalUrl = absoluteUrl(`/products/${product.slug}`);

  const imageUrl = product.images[0]?.url
    ? absoluteUrl(product.images[0].url)
    : absoluteUrl("/opengraph-image");

  return {
    title: product.name,

    description: description.slice(0, 160),

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: "website",

      url: canonicalUrl,

      siteName: "BuzzieWorld",

      title: product.name,

      description: description.slice(0, 160),

      images: [
        {
          url: imageUrl,

          width: 1200,

          height: 630,

          alt: product.name,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title: product.name,

      description: description.slice(0, 160),

      images: [imageUrl],
    },

    robots: {
      index: true,

      follow: true,
    },
  };
}

/* ============================================================================*

*    PRICE FORMATTER*

*  ============================================================================ */

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",

    currency: "INR",

    maximumFractionDigits: 0,
  }).format(price);
}

/* ============================================================================*

*    AGE LABEL*

*  ============================================================================ */

function getAgeLabel(ageRange?: StorefrontProduct["ageRange"]): string | null {
  if (!ageRange) {
    return null;
  }

  if (ageRange.min !== undefined && ageRange.max !== undefined) {
    return `${ageRange.min}–${ageRange.max} years`;
  }

  if (ageRange.min !== undefined) {
    return `${ageRange.min}+ years`;
  }

  if (ageRange.max !== undefined) {
    return `Up to ${ageRange.max} years`;
  }

  return "All ages";
}

/* ============================================================================*

*    VIDEO CARDS*

*  ============================================================================ */

interface VideoCardData {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  duration: string;
  accent: string;
  accentSoft: string;
  icon: "users" | "star" | "zap" | "heart";
  rotation: string;
}

/* ==========================================================================*

*    VIDEO CARDS*

*  ============================================================================= */

const videoCards: VideoCardData[] = [
  {
    id: 1,
    eyebrow: "PLAY TOGETHER",
    title: "Game night with friends.",
    description: "Fun, laughter and little moments worth remembering.",
    duration: "00:37",
    accent: "#8D55E8",
    accentSoft: "#F1E9FF",
    icon: "users",
    rotation: "lg:-rotate-[1deg]",
  },

  {
    id: 2,
    eyebrow: "DISCOVER",
    title: "Learning that feels like play.",
    description: "See curiosity turn into confidence, one game at a time.",
    duration: "00:43",
    accent: "#E91E63",
    accentSoft: "#FDEAF2",
    icon: "star",
    rotation: "lg:rotate-[0.7deg]",
  },

  {
    id: 3,
    eyebrow: "MAKE MEMORIES",
    title: "Turn any moment into a story.",
    description: "Pick a game, gather everyone and let the fun begin.",
    duration: "00:42",
    accent: "#F1A348",
    accentSoft: "#FFF1DF",
    icon: "zap",
    rotation: "lg:-rotate-[0.7deg]",
  },
];

/* ==========================================================================*
 *    ICON*
 *  ============================================================================= */

function CardIcon({ type }: { type: VideoCardData["icon"] }) {
  const className = "h-5 w-5";

  const strokeWidth = 1.8;

  if (type === "users") {
    return <Users className={className} strokeWidth={strokeWidth} />;
  }

  if (type === "star") {
    return <Star className={className} strokeWidth={strokeWidth} />;
  }

  if (type === "zap") {
    return <Zap className={className} strokeWidth={strokeWidth} />;
  }

  return <Heart className={className} strokeWidth={strokeWidth} />;
}

/* ==========================================================================*

*    TOP LEFT DECORATION*

*    Reference:*

*    Three clearly visible hand-drawn strokes.*

*  ============================================================================= */

function PurpleBurst() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 90 70"
      fill="none"
      className="h-[58px] w-[75px] sm:h-[68px] sm:w-[88px]"
    >
      <path d="M14 42L37 34" stroke="#8D55E8" strokeWidth="3" strokeLinecap="round" />

      <path d="M35 15L42 37" stroke="#8D55E8" strokeWidth="3" strokeLinecap="round" />

      <path d="M52 31L72 25" stroke="#8D55E8" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ==========================================================================*

*    TOP RIGHT DECORATION*

*  ============================================================================= */

function PinkBurst() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 90 70"
      fill="none"
      className="h-[58px] w-[75px] sm:h-[68px] sm:w-[88px]"
    >
      <path d="M76 42L53 34" stroke="#E91E63" strokeWidth="3" strokeLinecap="round" />

      <path d="M55 15L48 37" stroke="#E91E63" strokeWidth="3" strokeLinecap="round" />

      <path d="M38 31L18 25" stroke="#E91E63" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ==========================================================================*

*    LEFT CARD ARROW*

*    Larger and more visible than the previous version.*

*    The arrow points toward the first card.*

*  ============================================================================= */

function LeftCardArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 180 150"
      fill="none"
      className="

          pointer-events-none

          absolute

          -left-[105px]

          top-[25px]

          hidden

          h-[130px]

          w-[155px]

          xl:block

        "
    >
      <path
        d="

            M12 78

            C26 55 60 50 76 67

            C91 83 76 103 57 96

            C38 89 43 65 65 53

            C89 40 111 46 126 62

          "
        stroke="#C391EE"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      <path
        d="

            M116 50

            L128 62

            L113 68

          "
        stroke="#C391EE"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M28 105C20 101 15 96 12 88"
        stroke="#C391EE"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ==========================================================================*

*    RIGHT CARD ARROW*

*  ============================================================================= */

function RightCardArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 180 150"
      fill="none"
      className="

          pointer-events-none

          absolute

          -right-[105px]

          top-[115px]

          hidden

          h-[130px]

          w-[155px]

          xl:block

        "
    >
      <path
        d="

            M166 53

            C151 30 117 28 102 46

            C88 63 101 82 121 77

            C140 72 136 49 114 40

            C91 31 68 38 54 55

          "
        stroke="#E91E63"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      <path
        d="

            M64 44

            L52 55

            L67 61

          "
        stroke="#E91E63"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M151 78C159 73 164 66 166 57"
        stroke="#E91E63"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ==========================================================================*

*    BOTTOM LEFT ARROW*

*    This one points visually toward the CTA.*

*  ============================================================================= */

function BottomLeftArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 190 120"
      fill="none"
      className="

          pointer-events-none

          absolute

          -left-[20px]

          top-[-28px]

          hidden

          h-[105px]

          w-[165px]

          md:block

          lg:left-[30px]

        "
    >
      <path
        d="

            M8 82

            C26 103 57 105 69 87

            C80 70 66 54 48 59

            C29 64 31 83 48 87

            C70 92 86 70 104 53

            C120 38 139 33 157 44

          "
        stroke="#E91E63"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      <path
        d="

            M147 35

            L160 44

            L151 55

          "
        stroke="#E91E63"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ==========================================================================*

*    BOTTOM RIGHT ARROW*

*  ============================================================================= */

function BottomRightArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 190 120"
      fill="none"
      className="

          pointer-events-none

          absolute

          -right-[20px]

          top-[-20px]

          hidden

          h-[105px]

          w-[165px]

          md:block

          lg:right-[30px]

        "
    >
      <path
        d="

            M182 80

            C164 101 133 103 121 85

            C110 68 124 52 142 57

            C161 62 159 81 142 85

            C120 90 104 68 86 51

            C70 36 51 31 33 42

          "
        stroke="#F1A348"
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      <path
        d="

            M43 33

            L30 42

            L39 53

          "
        stroke="#F1A348"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ==========================================================================*

*   VIDEO PREVIEW — CLEAN VERTICAL VIDEO*

*   ========================================================================== */

function VideoPreview({ card }: { card: VideoCardData }) {
  return <HoverVideoPreview title={card.title} src="/images/products/Product-card-video-web.mp4" />;
}

function VideoCard({ card, index }: { card: VideoCardData; index: number }) {
  const isLeft = index === 0;
  const isCenter = index === 1;
  const isRight = index === 2;
  const isTwoCards = videoCards.length === 2;

  return (
    <article
      style={{ "--card-index": index } as React.CSSProperties}
      className={`

        group
        relative
        z-10
        w-[75vw]
        max-w-[350px]
        shrink-0
        snap-center
        overflow-hidden
        rounded-[18px]
        bg-transparent
        shadow-[0_18px_45px_rgba(30,25,45,0.18)]
        transition-[transform,box-shadow]
        duration-500
        ease-[cubic-bezier(0.22,1,0.36,1)]
        hover:z-50
        hover:scale-[1.07]
        hover:-translate-y-3
        hover:shadow-[0_30px_65px_rgba(30,25,45,0.28)]
        sm:w-full
        sm:max-w-none
        lg:w-[35%]
        lg:max-w-none
        ${isLeft ? "lg:-rotate-[3deg]" : ""}
        ${isRight || (isTwoCards && isCenter) ? "lg:rotate-[3deg]" : ""}
        ${isCenter && !isTwoCards ? "lg:-mx-[4%] lg:w-[38%] lg:scale-[1.04] lg:z-20" : ""}
      `}
    >
      <Reveal delay={index * 0.06}>
        <VideoPreview card={card} />
      </Reveal>
    </article>
  );
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  /* ==========================================================================*

*      DERIVED PRODUCT DATA*

*    ========================================================================== */

  /**

*     * price and stock are optional in the storefront model.*

*     **

*     * This is intentional because the new catalog contains draft products*

*     * where pricing/inventory has not yet been configured.*

*     **

*     * Never substitute 0 for missing price/stock here.*

*     */

  const hasPrice = typeof product.price === "number";

  const hasCompareAtPrice = typeof product.compareAtPrice === "number";

  const hasDiscount =
    typeof product.price === "number" &&
    typeof product.compareAtPrice === "number" &&
    product.compareAtPrice > product.price;

  let discount = 0;

  if (
    typeof product.price === "number" &&
    typeof product.compareAtPrice === "number" &&
    product.compareAtPrice > product.price
  ) {
    discount = Math.round(
      ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100,
    );
  }

  /**

*     * Undefined stock means inventory has not been configured yet.*

*     * Such a product must not be treated as purchasable.*

*     */

  const isOutOfStock = typeof product.stock !== "number" || product.stock <= 0;

  const ageLabel = getAgeLabel(product.ageRange);

  const productVideos = Array.isArray(product.videos)
    ? product.videos
        .filter((video) => typeof video.url === "string" && video.url.trim().length > 0)
        .slice(0, 3)
    : [];

  /* ==========================================================================*

*      PRODUCT INFO PROPS*

*      ProductInfoArtwork remains responsible for the complete*

*      right-side product information/purchase experience.*

*    ========================================================================== */

  const productInfoArtworkProps = {
    product,

    hasDiscount,

    discount,

    isOutOfStock,

    ageLabel,
  };

  return (
    <main className="min-h-screen overflow-hidden bg-white">
      {/* =====================================================================*

*          SEO — PRODUCT JSON-LD*

*      ====================================================================== */}

      <JsonLd data={createProductJsonLd(product, `/products/${product.slug}`)} />

      {/* =====================================================================*

*          SEO — BREADCRUMB JSON-LD*

*      ====================================================================== */}

      <JsonLd
        data={createBreadcrumbJsonLd([
          {
            name: "Home",

            url: "/",
          },

          {
            name: "Shop",

            url: "/shop",
          },

          ...(product.category?.name && product.category?.slug
            ? [
                {
                  name: product.category.name,

                  url: `/categories/${product.category.slug}`,
                },
              ]
            : []),

          {
            name: product.name,

            url: `/products/${product.slug}`,
          },
        ])}
      />

      {/* =====================================================================*

*            SUBTLE PAGE ATMOSPHERE*

*        ====================================================================== */}

      <div
        aria-hidden="true"
        className="

            pointer-events-none

            fixed

            inset-x-0

            top-0

            -z-0

            h-[24rem]

            bg-[radial-gradient(circle_at_12%_5%,rgba(231,45,90,0.055),transparent_28%),radial-gradient(circle_at_88%_8%,rgba(195,145,238,0.055),transparent_30%)]

          "
      />

      <div className="container relative z-10 py-5 sm:py-7 lg:py-8">
        {/* ===================================================================*
         *              BREADCRUMB*
         *          ==================================================================== */}

        <nav
          aria-label="Breadcrumb"
          className="

              mb-6

              flex

              flex-wrap

              items-center

              gap-2

              font-[var(--font-poppins)]

              text-[10px]

              font-medium

              text-[#687489]

              sm:mb-8

              sm:text-xs

            "
        >
          <Link
            href="/shop"
            className="

                transition-colors

                hover:text-[#E72D5A]

                focus-visible:outline-none

                focus-visible:ring-2

                focus-visible:ring-[#E72D5A]

                focus-visible:ring-offset-2

              "
          >
            Shop
          </Link>

          <ArrowRight className="size-3 text-[#B4B8C1]" />

          {product.category?.name ? (
            <>
              <span className="text-[#9AA1AE]">{product.category.name}</span>

              <ArrowRight className="size-3 text-[#B4B8C1]" />
            </>
          ) : null}

          <span className="max-w-[16rem] truncate font-semibold text-[#17131F]">
            {product.name}
          </span>
        </nav>

        {/* ===================================================================*

*              MAIN PRODUCT AREA*

*              Desktop structure:*

*              ┌──────────────┬──────────────────────┬──────────────┐*

*              │   GALLERY    │   PRODUCT INFO       │   PURCHASE   │*

*              │              │                      │              │*

*              │   TRUST      │   NAME               │   CART       │*

*              │   BADGES     │   PRICE              │   SHIPPING   │*

*              ├──────────────┴──────────────────────┤              │*

*              │                                     │              │*

*              │          PRODUCT DIARY               │              │*

*              │                                     │              │*

*              └─────────────────────────────────────┴──────────────┘*

*          ==================================================================== */}

        <div
          className="

grid
    grid-cols-1
    items-start
    gap-6
    lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)]
    lg:gap-6
    xl:gap-8

    "
        >
          {/* ================================================================*

*                LEFT — PRODUCT GALLERY*

*            ================================================================= */}

          <section className="min-w-0">
            <ProductGallery
              images={product.images}
              productName={product.name}
              productId={product._id}
            />
          </section>

          {/* ================================================================*

*                CENTER — PRODUCT INFORMATION*

*            ================================================================= */}

          <section className="min-w-0">
            <ProductInfoArtwork {...(productInfoArtworkProps as any)} />
          </section>

          {/* ================================================================*

*                PRODUCT DIARY*

*            ================================================================= */}

          <section
            className="

                min-w-0

                w-full

                lg:col-span-2

                lg:mt-0

              "
          >
            <ProductInfoDiary
              product={product}
              ageLabel={ageLabel}
              hasDiscount={hasDiscount}
              discount={discount}
            />
          </section>
        </div>

        {/* ===================================================================*

*              A+ CONTENT*

*          ==================================================================== */}

        {productVideos.length > 0 && (
          <section className="relative mt-14 overflow-hidden rounded-[24px] border border-[#F0E8EA] bg-[#FFFDFD] shadow-[0_20px_65px_rgba(30,20,25,0.055)] sm:mt-18 sm:rounded-[30px] lg:mt-24 lg:rounded-[36px]">
            <div className="px-5 pb-6 pt-8 text-center sm:px-8 sm:pb-8 sm:pt-10 lg:px-12 lg:pb-10 lg:pt-12">
              <p className="font-[var(--font-poppins)] text-xs font-bold uppercase tracking-[0.2em] text-[#E72D5A]">
                Discover the experience
              </p>

              <h2
                id="product-a-plus-heading"
                className="mt-4 font-[poppins-brand] text-[clamp(2rem,4.5vw,4.5rem)] font-black leading-[0.94] tracking-[-0.055em] text-[#17131F]"
              >
                Watch &amp;<span className="text-[#E72D5A]"> Buy</span>
              </h2>
            </div>

            <div
              className={`mx-auto grid w-full max-w-[1320px] grid-cols-1 items-start justify-items-center gap-5 px-4 pb-8 sm:gap-6 lg:px-8 ${
                productVideos.length === 1
                  ? "sm:grid-cols-1"
                  : productVideos.length === 2
                    ? "sm:grid-cols-2"
                    : "sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {productVideos.map((video, index) => (
                <div
                  key={video.publicId || video.url}
                  className={`mx-auto w-full max-w-[29.5rem] overflow-hidden rounded-[22px] border border-[#D7D0C7] bg-[#F3EEE6] shadow-[0_12px_35px_rgba(23,19,31,0.10)] transition-transform duration-500 ease-out ${
                    productVideos.length === 1
                      ? "rotate-[-1.5deg]"
                      : productVideos.length === 2
                        ? index === 0
                          ? "sm:-rotate-[2deg]"
                          : "sm:rotate-[2deg]"
                        : index === 0
                          ? "lg:-rotate-[3deg]"
                          : index === 1
                            ? "lg:rotate-0"
                            : "lg:rotate-[3deg]"
                  }`}
                >
                  <HoverVideoPreview
                    src={video.url}
                    title={video.title || `Product video ${index + 1}`}
                    className="block aspect-[3/4] h-auto w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* FULL-WIDTH PRODUCT PAGE CAROUSEL */}
      <ProductImageCarousel
        images={product.images}
        carouselImages={product.carouselImages}
        productName={product.name}
      />

      {/* A+ CONTENT — RENDER ONLY WHEN ADMIN CONTENT EXISTS */}
      {product.aPlusContent?.length ? (
        <section
          aria-label={`${product.name} product details`}
          className="w-full overflow-hidden bg-white"
        >
          <div className="flex w-full flex-col">
            {product.aPlusContent.map((item, index) => (
              <div key={`${item.url}-${index}`} className="w-full overflow-hidden">
                <Image
                  src={item.url}
                  alt={
                    item.alt?.trim() ||
                    item.caption?.trim() ||
                    `${product.name} product details image ${index + 1}`
                  }
                  width={1600}
                  height={2400}
                  sizes="100vw"
                  className="block h-auto w-full object-contain"
                  unoptimized={item.url.startsWith("/api/media/files/")}
                />

                {item.caption?.trim() ? (
                  <p className="mx-auto max-w-5xl px-4 py-3 text-center text-sm text-slate-600">
                    {item.caption}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
