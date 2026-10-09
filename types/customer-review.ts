import type { ReviewStatus } from "@/models/Review";

export interface CustomerReviewProduct {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

export interface CustomerReview {
  id: string;

  product: CustomerReviewProduct;

  rating: number;
  title: string;
  comment: string;

  verifiedPurchase: boolean;
  status: ReviewStatus;

  createdAt: string;
  updatedAt: string;
}

export interface ReviewableProduct {
  productId: string;
  name: string;
  slug: string;
  image: string | null;
}

export interface CustomerReviewsResponse {
  success: boolean;
  reviews?: CustomerReview[];
  message?: string;
}

export interface ReviewableProductsResponse {
  success: boolean;
  products?: ReviewableProduct[];
  message?: string;
}
