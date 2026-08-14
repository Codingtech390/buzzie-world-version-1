export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: {
    url: string;
    alt?: string;
  }[];
  stock: number;
  sku?: string;
}

export interface CartItemWithProduct extends CartItem {
  product: CartProduct;
  lineTotal: number;
}

export interface CartResponse {
  success: boolean;
  items: CartItemWithProduct[];
  subtotal: number;
  itemCount: number;
}
