import mongoose from "mongoose";

import { connectToDatabase } from "@/lib/mongoose";
import { Order, type IOrder } from "@/models/Order";
import type {
  CustomerOrder,
  CustomerOrderAddress,
  CustomerOrderItem,
} from "@/types/customer-order";

function serializeOrder(order: IOrder & { _id: mongoose.Types.ObjectId }): CustomerOrder {
  const items: CustomerOrderItem[] = order.items.map((item) => ({
    product: item.product.toString(),
    name: item.name,
    slug: item.slug,
    sku: item.sku,
    image: item.image,
    price: item.price,
    quantity: item.quantity,
    lineTotal: item.lineTotal,
  }));

  const shippingAddress: CustomerOrderAddress = {
    fullName: order.shippingAddress.fullName,
    email: order.shippingAddress.email,
    phone: order.shippingAddress.phone,
    addressLine1: order.shippingAddress.addressLine1,
    addressLine2: order.shippingAddress.addressLine2,
    city: order.shippingAddress.city,
    state: order.shippingAddress.state,
    postalCode: order.shippingAddress.postalCode,
    country: order.shippingAddress.country,
  };

  return {
    id: order._id.toString(),
    orderNumber: order.orderNumber,
    items,
    shippingAddress,
    subtotal: order.subtotal,
    shipping: order.shipping,
    discount: order.discount,
    total: order.total,
    currency: order.currency,
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

function assertValidUserId(userId: string) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid customer.");
  }
}

export async function getCustomerOrders(userId: string): Promise<CustomerOrder[]> {
  assertValidUserId(userId);

  await connectToDatabase();

  const orders = await Order.find({
    user: new mongoose.Types.ObjectId(userId),
  })
    .sort({ createdAt: -1 })
    .lean();

  return orders.map((order) => serializeOrder(order as IOrder & { _id: mongoose.Types.ObjectId }));
}

export async function getCustomerOrder(
  userId: string,
  orderId: string,
): Promise<CustomerOrder | null> {
  assertValidUserId(userId);

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return null;
  }

  await connectToDatabase();

  /*
   * Ownership is part of the database query.
   *
   * This is preferable to:
   *
   * Order.findById(orderId)
   *
   * followed by a client-side ownership check.
   *
   * A customer can therefore only retrieve an order belonging
   * to their authenticated account.
   */
  const order = await Order.findOne({
    _id: new mongoose.Types.ObjectId(orderId),
    user: new mongoose.Types.ObjectId(userId),
  }).lean();

  if (!order) {
    return null;
  }

  return serializeOrder(order as IOrder & { _id: mongoose.Types.ObjectId });
}
