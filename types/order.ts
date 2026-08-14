export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  product: string;
  name: string;
  image?: string;
  quantity: number;
  price: number;
  variantId?: string;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];

  shippingAddress: OrderAddress;

  subtotal: number;
  discount: number;
  shipping: number;
  total: number;

  status: OrderStatus;
  paymentStatus: PaymentStatus;

  razorpayOrderId?: string;
  razorpayPaymentId?: string;

  createdAt: string;
  updatedAt: string;
}

/**
 * Shipping address submitted during checkout.
 *
 * Extends the existing OrderAddress so we preserve
 * the current order structure while allowing checkout
 * to collect the customer's email.
 */
export interface ShippingAddress extends OrderAddress {
  email: string;
}

export interface CreateOrderPayload {
  shippingAddress: ShippingAddress;
}

export interface OrderCreationResponse {
  success: boolean;
  order: {
    id: string;
    orderNumber: string;
    total: number;
    currency: string;
  };
  razorpay: {
    keyId: string;
    orderId: string;
    amount: number;
    currency: string;
  };
}
