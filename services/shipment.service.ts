import mongoose from "mongoose";

import { connectToDatabase } from "@/lib/mongoose";
import { Order, type IShipment, type OrderStatus } from "@/models/Order";
import type { ShipmentInput, ShipmentStatus } from "@/types/shipment";

function assertValidOrderId(orderId: string) {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid order ID.");
  }
}

function normalizeTrackingUrl(value?: string) {
  if (!value?.trim()) {
    return undefined;
  }

  const url = value.trim();

  try {
    const parsed = new URL(url);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      throw new Error();
    }

    return parsed.toString();
  } catch {
    throw new Error("Tracking URL must be a valid HTTP or HTTPS URL.");
  }
}

function getOrderStatusFromShipmentStatus(status: ShipmentStatus): OrderStatus {
  switch (status) {
    case "shipped":
    case "in_transit":
      return "shipped";

    case "delivered":
      return "delivered";

    case "pending":
    default:
      return "processing";
  }
}

function serializeShipment(shipment?: IShipment) {
  if (!shipment) {
    return undefined;
  }

  return {
    courier: shipment.courier,
    trackingNumber: shipment.trackingNumber,
    trackingUrl: shipment.trackingUrl,
    status: shipment.status,
    shippedAt: shipment.shippedAt?.toISOString(),
    deliveredAt: shipment.deliveredAt?.toISOString(),
  };
}

export async function updateOrderShipment(orderId: string, input: ShipmentInput) {
  assertValidOrderId(orderId);

  await connectToDatabase();

  const courier = input.courier.trim();
  const trackingNumber = input.trackingNumber.trim();

  if (!courier) {
    throw new Error("Courier is required.");
  }

  if (!trackingNumber) {
    throw new Error("Tracking number / AWB is required.");
  }

  const trackingUrl = normalizeTrackingUrl(input.trackingUrl);

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  if (order.status === "cancelled") {
    throw new Error("Shipment cannot be added to a cancelled order.");
  }

  const now = new Date();

  const existingShippedAt = order.shipment?.shippedAt;

  const shipment: IShipment = {
    courier,
    trackingNumber,
    trackingUrl,
    status: input.status,
    shippedAt:
      input.status === "shipped" || input.status === "in_transit" || input.status === "delivered"
        ? (existingShippedAt ?? now)
        : existingShippedAt,

    deliveredAt: input.status === "delivered" ? (order.shipment?.deliveredAt ?? now) : undefined,
  };

  order.shipment = shipment;

  order.status = getOrderStatusFromShipmentStatus(input.status);

  await order.save();

  return {
    id: order._id.toString(),
    orderNumber: order.orderNumber,
    status: order.status,
    shipment: serializeShipment(order.shipment),
  };
}

export async function getOrderShipment(orderId: string) {
  assertValidOrderId(orderId);

  await connectToDatabase();

  const order = await Order.findById(orderId)
    .select("orderNumber user status paymentStatus shipment createdAt updatedAt")
    .lean();

  if (!order) {
    return null;
  }

  return {
    id: order._id.toString(),
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    shipment: order.shipment
      ? {
          courier: order.shipment.courier,
          trackingNumber: order.shipment.trackingNumber,
          trackingUrl: order.shipment.trackingUrl,
          status: order.shipment.status,
          shippedAt: order.shipment.shippedAt?.toISOString(),
          deliveredAt: order.shipment.deliveredAt?.toISOString(),
        }
      : undefined,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}
