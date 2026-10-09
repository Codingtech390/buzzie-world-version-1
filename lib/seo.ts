import type { Metadata } from "next";

import type { StorefrontProduct } from "@/types/storefront";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.buzzieworld.com";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph-image`;

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

function cleanText(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncate(value: string, maxLength = 160): string {
  const cleaned = cleanText(value);

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  return `${cleaned.slice(0, maxLength - 1).trim()}…`;
}

export interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  noIndex?: boolean;
}

export function createPageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const canonicalUrl = absoluteUrl(path);
  const imageUrl = image ? absoluteUrl(image) : DEFAULT_OG_IMAGE;

  return {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: "website",
      url: canonicalUrl,
      title,
      description,
      siteName: "BuzzieWorld",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },

    robots: noIndex
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },
  };
}

export function createOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BuzzieWorld",
    url: SITE_URL,
  };
}

export function createWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "BuzzieWorld",
    url: SITE_URL,
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function createBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function createProductJsonLd(product: StorefrontProduct, canonicalPath: string) {
  const productUrl = absoluteUrl(canonicalPath);

  const imageUrls = product.images
    .map((image) => image.url)
    .filter(Boolean)
    .map((image) => absoluteUrl(image));

  const productData: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",

    name: product.name,

    description: truncate(product.shortDescription || product.description, 500),

    url: productUrl,

    ...(imageUrls.length > 0
      ? {
          image: imageUrls,
        }
      : {}),

    ...(product.sku
      ? {
          sku: product.sku,
        }
      : {}),

    ...(product.brand?.name
      ? {
          brand: {
            "@type": "Brand",
            name: product.brand.name,
          },
        }
      : {}),

    ...(product.category?.name
      ? {
          category: product.category.name,
        }
      : {}),
  };

  if (typeof product.price === "number") {
    productData.offers = {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "INR",
      price: product.price,
      itemCondition: "https://schema.org/NewCondition",
      ...(typeof product.stock === "number"
        ? {
            availability:
              product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          }
        : {}),
    };
  }

  return productData;
}
