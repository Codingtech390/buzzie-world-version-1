import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongoose";
import { Cart } from "@/models/Cart";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import type { ShippingAddress } from "@/types/order";
import { createRazorpayOrder, verifyRazorpaySignature } from "@/lib/razorpay";

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

export async function createOrderFromCart(sessionId: string, shippingAddress: ShippingAddress) {
  await connectToDatabase();

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

    if (product.stock < cartItem.quantity) {
      throw new Error(`${product.name} does not have enough stock`);
    }

    const price = product.price;

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

  const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);

  /*
   * Keep shipping at zero for the first
   * commerce implementation.
   *
   * Shipping rules can be added later
   * without changing the payment flow.
   */
  const shipping = 0;
  const discount = 0;
  const total = subtotal + shipping - discount;

  if (total <= 0) {
    throw new Error("Order total must be greater than zero");
  }

  const orderNumber = generateOrderNumber();

  const razorpayOrder = await createRazorpayOrder(Math.round(total * 100), orderNumber);

  const order = await Order.create({
    orderNumber,
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
  };
}

export async function verifyPayment(
  orderId: string,
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string,
) {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid order");
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
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
