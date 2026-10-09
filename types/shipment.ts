import type { OrderStatus } from "@/models/Order";

export type ShipmentStatus = "pending" | "shipped" | "in_transit" | "delivered";

export interface Shipment {
  courier: string;
  trackingNumber: string;
  trackingUrl?: string;
  status: ShipmentStatus;
  shippedAt?: string;
  deliveredAt?: string;
}

export interface ShipmentInput {
  courier: string;
  trackingNumber: string;
  trackingUrl?: string;
  status: ShipmentStatus;
}

export interface CustomerTrackingOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  shipment?: Shipment;
}

export interface CustomerTrackingResponse {
  success: boolean;
  data?: CustomerTrackingOrder[];
  message?: string;
}
