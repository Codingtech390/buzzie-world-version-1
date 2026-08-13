export interface CartItem {
  product: string;
  quantity: number;
  variantId?: string;
  price: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
}
