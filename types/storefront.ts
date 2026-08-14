import type { ProductStatus } from "@/types/product";

export interface StorefrontReference {
  _id: string;
  name: string;
  slug: string;
}

export interface StorefrontProductImage {
  url: string;
  publicId?: string;
  alt?: string;
}

export interface StorefrontProductVariant {
  _id?: string;
  name: string;
  value: string;
  sku?: string;
  price?: number;
  stock?: number;
}

export interface StorefrontProduct {
  _id: string;
  name: string;
  slug: string;

  description: string;
  shortDescription?: string;

  price: number;
  compareAtPrice?: number;

  sku?: string;

  images: StorefrontProductImage[];

  category?: StorefrontReference;
  brand?: StorefrontReference;
  collection?: StorefrontReference;

  variants: StorefrontProductVariant[];

  stock: number;

  status: ProductStatus;

  featured: boolean;

  ageRange?: {
    min?: number;
    max?: number;
  };

  createdAt: string;
  updatedAt: string;
}

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

export interface StorefrontProductResponse {
  success: boolean;
  product?: StorefrontProduct;
  message?: string;
}

export interface StorefrontSelector {
  _id: string;
  name: string;
  slug: string;
}

export interface StorefrontSelectorResponse {
  success: boolean;
  categories?: StorefrontSelector[];
  brands?: StorefrontSelector[];
  collections?: StorefrontSelector[];
  message?: string;
}
