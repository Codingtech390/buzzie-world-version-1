import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongoose";
import { createRazorpayOrder, verifyRazorpaySignature } from "@/lib/razorpay";
import { Cart } from "@/models/Cart";
import { Order } from "@/models/Order";
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

  for (const cartItem of cart.items) {
    const product = productMap.get(cartItem.product.toString());

    if (!product) {
      throw new Error("One or more products are no longer available.");
    }

    const stock =
      typeof product.stock === "number" && Number.isFinite(product.stock)
        ? Math.max(product.stock, 0)
        : 0;

    if (stock < cartItem.quantity) {
      throw new Error(`${product.name} does not have enough stock.`);
    }

    const price =
      typeof product.price === "number" && Number.isFinite(product.price) ? product.price : 0;

    if (price <= 0) {
      throw new Error(`${product.name} has an invalid price.`);
    }

    subtotal += price * cartItem.quantity;
  }

  subtotal = Math.round(subtotal * 100) / 100;

  const { discount, discountLabel } = await calculateCustomerDiscount(subtotal, userId);

  return {
    subtotal,
    discount,
    discountLabel,
    // Shipping has not been quoted yet.
    shipping: null,
    totalBeforeShipping: Math.round((subtotal - discount) * 100) / 100,
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


const subtotal = Math.round(orderItems.reduce((sum, item) => sum + item.lineTotal, 0) * 100) / 100;

const { discount, discountLabel } = await calculateCustomerDiscount(subtotal, userId);

const quote = await getShippingQuote(shippingAddress.postalCode, subtotal - discount);

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

  /*
   * Reduce stock only after successful
   * server-side payment verification.
   */
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
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
