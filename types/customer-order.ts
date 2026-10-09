import type { OrderStatus, PaymentStatus } from "@/models/Order";
import type { Shipment } from "@/types/shipment";

export interface CustomerOrderItem {
  product: string;
  name: string;
  slug: string;
  sku?: string;
  image?: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface CustomerOrderAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  items: CustomerOrderItem[];
  shippingAddress: CustomerOrderAddress;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  shipment?: Shipment;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerOrdersResponse {
  success: boolean;
  data?: CustomerOrder[];
  message?: string;
}

export interface CustomerOrderResponse {
  success: boolean;
  data?: CustomerOrder;
  message?: string;
}
