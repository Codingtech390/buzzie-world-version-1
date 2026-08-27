import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import ProductGallery from "@/components/product/ProductGallery";
import ProductInfoArtwork from "@/components/product/ProductInfoArtwork";
import RelatedProducts from "@/components/product/RelatedProducts";
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
                  lg:text-[10px]
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
              More than a product.
              <br />
              <span className="text-[#E72D5A]">It&apos;s an experience.</span>
            </h2>

            {/* Description */}

            <p
              className="
                mx-auto
                mt-5
                max-w-[620px]
                font-[var(--font-poppins)]
                text-[12px]
                leading-6
                text-[#687489]
                sm:text-[13px]
                sm:leading-7
              "
            >
              Take a closer look at what makes this BuzzieWorld experience special — designed to
              bring more play, discovery and memorable moments into everyday life.
            </p>
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
