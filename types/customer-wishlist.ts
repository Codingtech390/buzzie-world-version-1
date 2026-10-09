import type { Types } from "mongoose";

export interface CustomerWishlistItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
  addedAt: string;
}

export interface CustomerWishlistResponse {
  success: boolean;
  wishlist: CustomerWishlistItem[];
}

export interface WishlistMutationResponse {
  success: boolean;
  message: string;
  item?: CustomerWishlistItem;
}

export interface WishlistDocument {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  product: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
