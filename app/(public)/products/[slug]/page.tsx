import { ArrowRight, Heart, Play, Sparkles, Star, Users, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import ProductGallery from "@/components/product/ProductGallery";
import ProductInfoArtwork from "@/components/product/ProductInfoArtwork";
import RelatedProducts from "@/components/product/RelatedProducts";
import Reveal from "@/components/home/Reveal";
import type { StorefrontProduct, StorefrontProductResponse } from "@/types/storefront";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

/* ============================================================================
   PRODUCT DATA
============================================================================ */

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

/* ============================================================================
   PRICE FORMATTER
============================================================================ */

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

/* ============================================================================
   AGE LABEL
============================================================================ */

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

/* ============================================================================
   VIDEO CARDS
============================================================================ */

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

/* ==========================================================================
   VIDEO CARDS
============================================================================= */

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
  {
    id: 4,
    eyebrow: "REAL FAMILIES",
    title: "Why parents love BuzzieWorld.",
    description: "Thoughtful games made for curious growing minds.",
    duration: "00:47",
    accent: "#5799E4",
    accentSoft: "#EAF4FF",
    icon: "heart",
    rotation: "lg:rotate-[1deg]",
  },
];

/* ==========================================================================
   ICON
============================================================================= */

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

/* ==========================================================================
   TOP LEFT DECORATION

   Reference:
   Three clearly visible hand-drawn strokes.
============================================================================= */

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

/* ==========================================================================
   TOP RIGHT DECORATION
============================================================================= */

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

/* ==========================================================================
   LEFT CARD ARROW

   Larger and more visible than the previous version.
   The arrow points toward the first card.
============================================================================= */

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

/* ==========================================================================
   RIGHT CARD ARROW
============================================================================= */

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

/* ==========================================================================
   BOTTOM LEFT ARROW

   This one points visually toward the CTA.
============================================================================= */

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

/* ==========================================================================
   BOTTOM RIGHT ARROW
============================================================================= */

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

/* ==========================================================================
   VIDEO PREVIEW
============================================================================= */

function VideoPreview({ card }: { card: VideoCardData }) {
  return (
    <div
      className="
        group/video
        relative
        aspect-[1.52/1]
        w-full
        overflow-hidden
      "
      style={{
        background: `linear-gradient(
          145deg,
          ${card.accent} 0%,
          ${card.accent}D9 100%
        )`,
      }}
    >
      {/* Background visual */}

      <div
        aria-hidden="true"
        className="
          absolute
          left-[19%]
          top-[20%]
          h-[82px]
          w-[82px]
          rounded-full
          bg-white/[0.11]
          transition-transform
          duration-700
          group-hover/video:scale-125
        "
      />

      <div
        aria-hidden="true"
        className="
          absolute
          left-[38%]
          top-[30%]
          h-[100px]
          w-[100px]
          rounded-[42%]
          bg-black/[0.045]
          transition-transform
          duration-700
          group-hover/video:translate-x-3
        "
      />

      <div
        aria-hidden="true"
        className="
          absolute
          bottom-[8%]
          right-[12%]
          h-[110px]
          w-[110px]
          rounded-full
          bg-black/[0.045]
          blur-2xl
        "
      />

      {/* Play */}

      <div
        className="
          absolute
          left-1/2
          top-1/2
          flex
          h-[66px]
          w-[66px]
          -translate-x-1/2
          -translate-y-1/2
          items-center
          justify-center
          rounded-full
          bg-white
          shadow-[0_14px_32px_rgba(30,20,40,0.16)]
          transition-transform
          duration-500
          group-hover/video:scale-110
          sm:h-[72px]
          sm:w-[72px]
        "
      >
        <Play className="ml-1 h-7 w-7" fill="#E91E63" strokeWidth={0} />
      </div>

      {/* Duration */}

      <div
        className="
          absolute
          right-4
          top-4
          rounded-full
          bg-[#16141A]/90
          px-3
          py-1.5
          text-[0.64rem]
          font-bold
          tracking-[0.03em]
          text-white
        "
      >
        {card.duration}
      </div>

      {/* Coming soon */}

      <div
        className="
          absolute
          bottom-4
          left-4
          rounded-full
          bg-black/20
          px-3
          py-1.5
          text-[0.55rem]
          font-black
          uppercase
          tracking-[0.13em]
          text-white
          backdrop-blur-md
        "
      >
        Video coming soon
      </div>
    </div>
  );
}

/* ==========================================================================
   VIDEO CARD
============================================================================= */

function VideoCard({ card, index }: { card: VideoCardData; index: number }) {
  return (
    <Reveal delay={index * 0.06}>
      <article
        className={`
          group
          relative
          w-[82vw]
          max-w-[390px]
          shrink-0
          overflow-hidden
          rounded-[24px]
          border
          border-[#17152A]/[0.075]
          bg-white
          shadow-[0_18px_45px_rgba(30,25,45,0.075)]
          transition-all
          duration-500
          ease-[cubic-bezier(0.22,1,0.36,1)]
          hover:-translate-y-2
          hover:shadow-[0_28px_60px_rgba(30,25,45,0.13)]
          sm:w-full
          sm:max-w-none
          ${card.rotation}
        `}
      >
        <VideoPreview card={card} />

        <div className="px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-full
              "
              style={{
                backgroundColor: card.accentSoft,
                color: card.accent,
              }}
            >
              <CardIcon type={card.icon} />
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-[0.56rem]
                  font-black
                  uppercase
                  tracking-[0.17em]
                "
                style={{
                  color: card.accent,
                }}
              >
                {card.eyebrow}
              </p>

              <h3
                className="
                  mt-1.5
                  text-[1.04rem]
                  font-extrabold
                  leading-[1.12]
                  tracking-[-0.025em]
                  text-[#151329]
                  sm:text-[1.12rem]
                "
              >
                {card.title}
              </h3>
            </div>
          </div>

          <p
            className="
              mt-4
              pl-[60px]
              text-[0.77rem]
              leading-5
              text-[#686571]
              sm:text-[0.81rem]
            "
          >
            {card.description}
          </p>
        </div>
      </article>
    </Reveal>
  );
}

/* ============================================================================
   PAGE
============================================================================ */

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  /* ==========================================================================
     DERIVED PRODUCT DATA
  ========================================================================== */

  const hasDiscount =
    typeof product.compareAtPrice === "number" && product.compareAtPrice > product.price;

  const discount = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const isOutOfStock = product.stock <= 0;

  const ageLabel = getAgeLabel(product.ageRange);

  /* ==========================================================================
     PRODUCT INFO PROPS

     ProductInfoArtwork remains responsible for the complete
     right-side product information/purchase experience.
  ========================================================================== */

  const productInfoArtworkProps = {
    product,
    hasDiscount,
    discount,
    isOutOfStock,
    ageLabel,
  };

  return (
    <main className="min-h-screen overflow-hidden bg-white">
      {/* =====================================================================
          SUBTLE PAGE ATMOSPHERE
      ====================================================================== */}

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
        {/* ===================================================================
            BREADCRUMB
        ==================================================================== */}

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

        {/* ===================================================================
            MAIN PRODUCT AREA
        ==================================================================== */}

        <div
          className="
    grid
    gap-6
    lg:grid-cols-[0.78fr_1.22fr]
    lg:items-start
    lg:gap-8
    xl:grid-cols-[0.8fr_1.2fr]
    xl:gap-10
          "
        >
          {/* =================================================================
              LEFT — PRODUCT GALLERY
          ================================================================== */}

          <section className="min-w-0">
            <ProductGallery images={product.images} productName={product.name} />
          </section>

          {/* =================================================================
              RIGHT — PRODUCT INFORMATION
          ================================================================== */}

          <section className="min-w-0">
            <ProductInfoArtwork {...(productInfoArtworkProps as any)} />
          </section>
        </div>

        {/* ===================================================================
            A+ CONTENT
        ==================================================================== */}

        <section
          aria-labelledby="product-a-plus-heading"
          className="
            relative
            mt-14
            overflow-hidden
            rounded-[24px]
            border
            border-[#F0E8EA]
            bg-[#FFFDFD]
            shadow-[0_20px_65px_rgba(30,20,25,0.055)]
            sm:mt-18
            sm:rounded-[30px]
            lg:mt-24
            lg:rounded-[36px]
          "
        >
          {/* ================================================================
              A+ SECTION HEADER
          ================================================================= */}

          <div
            className="
              flex
              flex-col
              items-center
              px-5
              pb-6
              pt-8
              text-center
              sm:px-8
              sm:pb-8
              sm:pt-10
              lg:px-12
              lg:pb-10
              lg:pt-12
            "
          >
            {/* Eyebrow */}

            <div
              className="
                flex
                items-center
                justify-center
                gap-2.5
                mb-5
              "
            >
              <span className="h-[2px] w-7 rounded-full bg-[#E72D5A] sm:w-9" />

              <span
                className="
                  font-[var(--font-poppins)]
                  text-[8px]
                  font-black
                  uppercase
                  tracking-[0.2em]
                  text-[#E72D5A]
                  sm:text-[9px]
                  lg:text-[13px]
                "
              >
                Discover the experience
              </span>

              <span className="size-1.5 rounded-full bg-[#F59A23]" />
            </div>

            {/* Heading */}

            <h2
              id="product-a-plus-heading"
              className="
                mt-4
                max-w-[800px]
                font-[var(--font-roboto)]
                text-[clamp(2rem,4vw,3.6rem)]
                font-black
                leading-[0.94]
                tracking-[-0.055em]
                text-[#17131F]
              "
            >
              Watch
              <span className="text-[#E72D5A]"> & Buy</span>
            </h2>


          </div>

          {/* ==================================================================
              VIDEO CARDS
          ================================================================== */}

          <div
            className="
              relative
              mx-auto
              mt-9
              max-w-[1150px]
              sm:mt-11
              lg:mt-12
            "
          >
            {/* Mobile / tablet horizontal scrolling */}
            <div
              className="
                -mx-4
                overflow-x-auto
                px-4
                pb-5
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
                sm:mx-0
                sm:overflow-visible
                sm:px-0
                sm:pb-0
              "
            >
              <div
                className="
                  flex
                  gap-4
                  mb-12
                  sm:grid
                  sm:grid-cols-2
                  sm:gap-5
                  lg:grid-cols-4
                  lg:gap-5
                  xl:gap-6
                "
              >
                {videoCards.map((card, index) => (
                  <VideoCard key={card.id} card={card} index={index} />
                ))}
              </div>
            </div>
          </div>

          {/* ================================================================
              COMPLETE A+ CONTENT IMAGE

              The complete A+ artwork is now supplied as one HD image.
              This replaces the previously manually-built A+ rows.
          ================================================================= */}

          <div
            className="
              relative
              w-full
              overflow-hidden
              bg-white
            "
          >
            <Image
              src="/images/products/a-plus/a+combined.png"
              alt={`${product.name} — product features, what's included, learning benefits and product experience`}
              width={1600}
              height={2400}
              sizes="
                100vw
              "
              className="
                block
                h-auto
                w-full
                object-contain
              "
            />
          </div>

          {/* ================================================================
              A+ FOOTER ACCENT
          ================================================================= */}

          <div
            aria-hidden="true"
            className="
              flex
              items-center
              justify-center
              gap-1.5
              border-t
              border-[#F4E6E9]
              bg-[#FFFDFD]
              py-4
            "
          >
            <span className="h-[2px] w-8 rounded-full bg-[#C391EE]" />
            <span className="h-[2px] w-2.5 rounded-full bg-[#E72D5A]" />
            <span className="h-[2px] w-1.5 rounded-full bg-[#F5B5C5]" />
          </div>
        </section>

        {/* ===================================================================
            RELATED PRODUCTS
        ==================================================================== */}

        <section className="mt-16 sm:mt-20 lg:mt-24">
          <div className="mx-auto max-w-3xl text-center">
            {/* Eyebrow */}

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-[#FFF0F4]
                px-4
                py-2
              "
            >
              <Sparkles className="size-3 text-[#E72D5A]" />

              <span
                className="
                  font-[var(--font-poppins)]
                  text-[9px]
                  font-extrabold
                  uppercase
                  tracking-[0.18em]
                  text-[#E72D5A]
                "
              >
                Keep exploring
              </span>
            </div>

            {/* Heading */}

            <h2
              className="
                mt-4
                font-[var(--font-roboto)]
                text-3xl
                font-black
                tracking-[-0.045em]
                text-[#17131F]
                sm:text-4xl
                lg:text-5xl
              "
            >
              More to discover.
            </h2>

            {/* Description */}

            <p
              className="
                mx-auto
                mt-4
                max-w-xl
                font-[var(--font-poppins)]
                text-[12px]
                leading-6
                text-[#687489]
                sm:text-[13px]
                sm:leading-7
              "
            >
              Find another BuzzieWorld favourite to add to their next adventure.
            </p>
          </div>

          <div className="mt-8 sm:mt-10 lg:mt-12">
            <RelatedProducts currentProductId={product._id} />
          </div>
        </section>
      </div>
    </main>
  );
}
