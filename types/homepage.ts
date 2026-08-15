import type { StorefrontProduct, StorefrontSelector } from "@/types/storefront";

export interface HomepageData {
  featuredProducts: StorefrontProduct[];
  latestProducts: StorefrontProduct[];
  categories: StorefrontSelector[];
  collections: StorefrontSelector[];
}

export interface HomepageApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
