import type { ProductStatus } from "@/types/product";

/**
 * Shared populated reference used by storefront products.
 */
export interface StorefrontReference {
  _id: string;
  name: string;
  slug: string;
}

/**
 * Product image exposed to the storefront.
 */
export interface StorefrontProductImage {
  url: string;
  publicId?: string;
  alt?: string;
}

/**
 * Product variant exposed to the storefront.
 */
export interface StorefrontProductVariant {
  _id?: string;
  name: string;
  value: string;
  sku?: string;
  price?: number;
  stock?: number;
}

/**
 * Product exposed to the public storefront.
 *
 * Price and stock are optional because a published
 * product can still be in preparation.
 *
 * A product only becomes purchasable when:
 *
 * - status === "active"
 * - price exists
 * - stock exists
 *
 * The cart/API layer continues to enforce the
 * commercial rules server-side.
 */
export interface StorefrontProduct {
  _id: string;

  name: string;
  slug: string;

  description: string;
  shortDescription?: string;
  keyFeatures: string[];

  price?: number;
  compareAtPrice?: number;

  sku?: string;

  images: StorefrontProductImage[];

  category?: StorefrontReference;
  brand?: StorefrontReference;
  collection?: StorefrontReference;

  variants: StorefrontProductVariant[];

  stock?: number;

  /**
   * Commerce lifecycle.
   */
  status: ProductStatus;

  /**
   * Public storefront visibility.
   */
  published: boolean;

  featured: boolean;

  ageRange?: {
    min?: number;
    max?: number;
  };

  createdAt: string;
  updatedAt: string;
}

/**
 * Product list API response.
 */
export interface StorefrontProductsResponse {
  success: boolean;

  products?: StorefrontProduct[];

  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  message?: string;
}

/**
 * Single product API response.
 */
export interface StorefrontProductResponse {
  success: boolean;

  product?: StorefrontProduct;

  message?: string;
}

/**
 * Storefront selector/reference.
 */
export interface StorefrontSelector {
  _id: string;
  name: string;
  slug: string;
}

/**
 * Storefront selector API response.
 */
export interface StorefrontSelectorResponse {
  success: boolean;

  categories?: StorefrontSelector[];

  brands?: StorefrontSelector[];

  collections?: StorefrontSelector[];

  message?: string;
}
