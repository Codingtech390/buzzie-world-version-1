import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongoose";

import { createRazorpayOrder, verifyRazorpaySignature } from "@/lib/razorpay";

import { Cart } from "@/models/Cart";

import { Order } from "@/models/Order";

import { DealSettings } from "@/models/DealSettings";
import { Product } from "@/models/Product";

import type { ShippingAddress } from "@/types/order";

import { getShippingQuote } from "@/services/shiprocket.service";

function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();

  const random = Math.random().toString(36).slice(2, 8).toUpperCase();

  return `BW-${timestamp}-${random}`;
}

function assertAddress(address: ShippingAddress) {
  const requiredFields: Array<keyof ShippingAddress> = [
    "fullName",

    "email",

    "phone",

    "addressLine1",

    "city",

    "state",

    "postalCode",

    "country",
  ];

  for (const field of requiredFields) {
    if (typeof address[field] !== "string" || !address[field].trim()) {
      throw new Error(`${field} is required`);
    }
  }
}

async function calculateCustomerDiscount(
  subtotal: number,

  userId?: string,
): Promise<{ discount: number; discountLabel: string | null }> {
  if (!userId) {
    return { discount: 0, discountLabel: null };
  }

  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid customer.");
  }

  const previousPaidOrder = await Order.exists({
    user: new Types.ObjectId(userId),

    paymentStatus: "paid",
  });

  if (previousPaidOrder) {
    return { discount: 0, discountLabel: null };
  }

  if (subtotal > 1299) {
    return {
      discount: Math.round(subtotal * 0.2 * 100) / 100,

      discountLabel: "First 20 Code applied",
    };
  }

  if (subtotal > 999) {
    return {
      discount: Math.round(subtotal * 0.15 * 100) / 100,

      discountLabel: "New Customer discount applied",
    };
  }

  return { discount: 0, discountLabel: null };
}

type DealCartItem = {
  productId: unknown;
  quantity: number;
  price: number;
};

async function calculateCrazyDeals(
  cartItems: DealCartItem[],
): Promise<{ discount: number; freeItemCount: number; labels: string[] }> {
  const settings = await DealSettings.findOne({ key: "default" }).lean();

  if (!settings?.isPublished || !Array.isArray(settings.items)) {
    return { discount: 0, freeItemCount: 0, labels: [] };
  }

  const dealMap = new Map(
    settings.items.filter((item) => item.isEnabled).map((item) => [String(item.productId), item]),
  );

  let discount = 0;
  let freeItemCount = 0;
  const labels: string[] = [];

  for (const cartItem of cartItems) {
    const deal = dealMap.get(String(cartItem.productId));
    const quantity = Number(cartItem.quantity);
    const price = Number(cartItem.price);

    if (
      !deal ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      !Number.isFinite(price) ||
      price <= 0
    )
      continue;

    if (deal.offerType === "percentage") {
      const percent = Number(deal.discountPercent);
      if (![30, 50, 60].includes(percent)) continue;

      discount += price * quantity * (percent / 100);
      labels.push(`${percent}% OFF`);
      continue;
    }

    if (deal.offerType === "buy_x_get_y") {
      const buyQuantity = Number(deal.buyQuantity);
      const freeQuantity = Number(deal.freeQuantity);

      if (
        !Number.isInteger(buyQuantity) ||
        !Number.isInteger(freeQuantity) ||
        buyQuantity < 1 ||
        freeQuantity < 1
      )
        continue;

      // Buy X, Get Y Free requires X paid units plus Y free units in the cart.
      const qualifyingGroups = Math.floor(quantity / (buyQuantity + freeQuantity));

      if (qualifyingGroups > 0) {
        const freeUnits = qualifyingGroups * freeQuantity;
        discount += price * freeUnits;
        freeItemCount += freeUnits;
        labels.push(`BUY ${buyQuantity}, GET ${freeQuantity} FREE`);
      }
    }
  }

  return {
    discount: Math.round(discount * 100) / 100,
    freeItemCount,
    labels: [...new Set(labels)],
  };
}

function combineDiscountLabels(dealLabels: string[], customerDiscountLabel: string | null) {
  const labels = [...dealLabels];
  if (customerDiscountLabel) labels.push(customerDiscountLabel);
  return labels.length ? labels.join(" + ") : null;
}

export async function getCheckoutPricing(sessionId: string, userId?: string) {
  await connectToDatabase();

  if (userId && !Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid customer.");
  }

  const cart = await Cart.findOne({ sessionId });

  if (!cart || cart.items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  const productIds = cart.items.map((item) => item.product);

  const products = await Product.find({
    _id: { $in: productIds },

    status: "active",
  }).lean();

  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  let subtotal = 0;
  const pricedCartItems: DealCartItem[] = [];

  for (const cartItem of cart.items) {
    const product = productMap.get(cartItem.product.toString());
    if (!product) throw new Error("One or more products are no longer available.");

    const stock =
      typeof product.stock === "number" && Number.isFinite(product.stock)
        ? Math.max(product.stock, 0)
        : 0;
    if (stock < cartItem.quantity) {
      throw new Error(`${product.name} does not have enough stock.`);
    }

    const price =
      typeof product.price === "number" && Number.isFinite(product.price) ? product.price : 0;
    if (price <= 0) throw new Error(`${product.name} has an invalid price.`);

    subtotal += price * cartItem.quantity;
    pricedCartItems.push({ productId: product._id, quantity: cartItem.quantity, price });
  }

  subtotal = Math.round(subtotal * 100) / 100;
  const crazyDeals = await calculateCrazyDeals(pricedCartItems);
  const subtotalAfterDeals = Math.max(0, Math.round((subtotal - crazyDeals.discount) * 100) / 100);
  const customerDiscountResult = await calculateCustomerDiscount(subtotalAfterDeals, userId);
  const customerDiscount = Math.min(customerDiscountResult.discount, subtotalAfterDeals);
  const discount =
    Math.round(Math.min(subtotal, crazyDeals.discount + customerDiscount) * 100) / 100;
  const discountLabel = combineDiscountLabels(
    crazyDeals.labels,
    customerDiscount > 0 ? customerDiscountResult.discountLabel : null,
  );

  return {
    subtotal,
    discount,
    discountLabel,
    // Shipping has not been quoted yet.
    shipping: null,
    totalBeforeShipping: Math.max(0, Math.round((subtotal - discount) * 100) / 100),
  };
}

export async function createOrderFromCart(
  sessionId: string,

  shippingAddress: ShippingAddress,

  userId?: string,
) {
  await connectToDatabase();

  if (userId && !Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid customer.");
  }

  assertAddress(shippingAddress);

  const cart = await Cart.findOne({
    sessionId,
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Your cart is empty");
  }

  const productIds = cart.items.map((item) => item.product);

  const products = await Product.find({
    _id: { $in: productIds },

    status: "active",
  }).lean();

  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  const orderItems = [];

  for (const cartItem of cart.items) {
    const product = productMap.get(cartItem.product.toString());

    if (!product) {
      throw new Error("One or more products are no longer available");
    }

    const stock =
      typeof product.stock === "number" && Number.isFinite(product.stock)
        ? Math.max(product.stock, 0)
        : 0;

    if (stock < cartItem.quantity) {
      throw new Error(`${product.name} does not have enough stock`);
    }

    const price =
      typeof product.price === "number" && Number.isFinite(product.price) ? product.price : 0;

    if (price <= 0) {
      throw new Error(`${product.name} has an invalid price`);
    }

    orderItems.push({
      product: product._id,

      name: product.name,

      slug: product.slug,

      sku: product.sku,

      image: product.images?.[0]?.url,

      price,

      quantity: cartItem.quantity,

      lineTotal: price * cartItem.quantity,
    });
  }

  const subtotal =
    Math.round(orderItems.reduce((sum, item) => sum + item.lineTotal, 0) * 100) / 100;

  const crazyDeals = await calculateCrazyDeals(
    orderItems.map((item) => ({
      productId: item.product,
      quantity: item.quantity,
      price: item.price,
    })),
  );
  const subtotalAfterDeals = Math.max(0, Math.round((subtotal - crazyDeals.discount) * 100) / 100);
  const customerDiscountResult = await calculateCustomerDiscount(subtotalAfterDeals, userId);
  const customerDiscount = Math.min(customerDiscountResult.discount, subtotalAfterDeals);
  const discount =
    Math.round(Math.min(subtotal, crazyDeals.discount + customerDiscount) * 100) / 100;
  const discountLabel = combineDiscountLabels(
    crazyDeals.labels,
    customerDiscount > 0 ? customerDiscountResult.discountLabel : null,
  );

  const quote = await getShippingQuote(
    shippingAddress.postalCode,
    Math.max(0, subtotal - discount),
  );
  const shipping = quote.amount;
  const total = Math.round((subtotal + shipping - discount) * 100) / 100;

  if (!Number.isFinite(total) || total <= 0) {
    throw new Error("Order total must be greater than zero.");
  }

  const orderNumber = generateOrderNumber();

  const razorpayOrder = await createRazorpayOrder(Math.round(total * 100), orderNumber);

  const order = await Order.create({
    orderNumber,

    ...(userId
      ? {
          user: new Types.ObjectId(userId),
        }
      : {}),

    items: orderItems,

    shippingAddress,

    subtotal,

    shipping,

    discount,

    total,

    currency: "INR",

    status: "pending",

    paymentStatus: "pending",

    razorpayOrderId: razorpayOrder.id,
  });

  return {
    order,

    razorpayOrder,

    discountLabel,

    shippingQuote: quote,
  };
}

export async function verifyPayment(
  orderId: string,

  razorpayPaymentId: string,

  razorpayOrderId: string,

  razorpaySignature: string,

  userId?: string,
) {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid order");
  }

  if (userId && !Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid customer.");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  if (userId) {
    if (!order.user || order.user.toString() !== userId) {
      throw new Error("You are not authorized to verify this order.");
    }
  }

  if (!order.razorpayOrderId) {
    throw new Error("Razorpay order is missing");
  }

  if (order.razorpayOrderId !== razorpayOrderId) {
    throw new Error("Razorpay order mismatch");
  }

  const valid = verifyRazorpaySignature(
    order.razorpayOrderId,

    razorpayPaymentId,

    razorpaySignature,
  );

  if (!valid) {
    order.paymentStatus = "failed";

    await order.save();

    throw new Error("Payment verification failed");
  }

  if (order.paymentStatus === "paid") {
    return order;
  }

  order.paymentStatus = "paid";

  order.status = "confirmed";

  order.razorpayPaymentId = razorpayPaymentId;

  order.razorpaySignature = razorpaySignature;

  await order.save();

  /**

*   * Reduce stock only after successful*

*   * server-side payment verification.*

*   */

  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        stock: -item.quantity,
      },
    });
  }

  return order;
}

export interface AdminOrderListOptions {
  page?: number;

  limit?: number;

  search?: string;

  status?: string;

  paymentStatus?: string;

  sort?: "newest" | "oldest";
}

export async function getAdminOrders(options: AdminOrderListOptions = {}) {
  await connectToDatabase();

  const page = Math.max(1, Number(options.page) || 1);

  const limit = Math.min(100, Math.max(1, Number(options.limit) || 20));

  const search = options.search?.trim() || "";

  const status = options.status?.trim() || "";

  const paymentStatus = options.paymentStatus?.trim() || "";

  const sort = options.sort === "oldest" ? "oldest" : "newest";

  const filter: Record<string, unknown> = {};

  if (status && status !== "all") {
    filter.status = status;
  }

  if (paymentStatus && paymentStatus !== "all") {
    filter.paymentStatus = paymentStatus;
  }

  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&");

    const searchRegex = new RegExp(escapedSearch, "i");

    filter.$or = [
      {
        orderNumber: searchRegex,
      },

      {
        "shippingAddress.fullName": searchRegex,
      },

      {
        "shippingAddress.email": searchRegex,
      },
    ];
  }

  const skip = (page - 1) * limit;

  const sortQuery = {
    createdAt: sort === "newest" ? -1 : 1,
  } as const;

  const [orders, total] = await Promise.all([
    Order.find(filter).sort(sortQuery).skip(skip).limit(limit).lean(),

    Order.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    orders,

    pagination: {
      page,

      limit,

      total,

      totalPages,
    },
  };
}
