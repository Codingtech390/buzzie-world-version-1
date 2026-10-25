import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/mongoose";
import { createCashfreeOrder, getCashfreePayments } from "@/lib/cashfree";
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


const rawPhone = shippingAddress.phone.trim();
const phoneDigits = rawPhone.replace(/\D/g, "");

// Accept an Indian mobile number with or without the +91 country code.
// Also handle a domestic leading zero.
const customerPhone =
  phoneDigits.length === 12 && phoneDigits.startsWith("91")
    ? phoneDigits.slice(2)
    : phoneDigits.length === 11 && phoneDigits.startsWith("0")
      ? phoneDigits.slice(1)
      : phoneDigits;

if (!/^[6-9]\d{9}$/.test(customerPhone)) {
  throw new Error("Please enter a valid 10-digit Indian mobile number.");
}

const cashfreeOrder = await createCashfreeOrder({
  orderId: orderNumber,
  amount: total,
  customerId: userId!,
  customerName: shippingAddress.fullName,
  customerEmail: shippingAddress.email,
  customerPhone,
});


  if (
    cashfreeOrder.order_id !== orderNumber ||
    cashfreeOrder.order_currency !== "INR" ||
    Math.round(cashfreeOrder.order_amount * 100) !== Math.round(total * 100) ||
    !cashfreeOrder.payment_session_id
  ) {
    throw new Error("Cashfree returned inconsistent order details.");
  }

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

    paymentProvider: "cashfree",

    cashfreeOrderId: cashfreeOrder.order_id,
  });

  return {
    order,

    cashfreeOrder,

    discountLabel,

    shippingQuote: quote,
  };
}


export async function verifyPayment(orderId: string, cashfreeOrderId: string, userId: string) {
  await connectToDatabase();

  // Validate all identifiers before querying the database or gateway.
  if (!Types.ObjectId.isValid(orderId)) {
    throw new Error("Invalid order.");
  }

  if (!userId || !Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid customer.");
  }

  if (typeof cashfreeOrderId !== "string" || !cashfreeOrderId.trim()) {
    throw new Error("Cashfree order ID is required.");
  }

  const expectedCashfreeOrderId = cashfreeOrderId.trim();

  // Check ownership and provider association before contacting Cashfree.
  const existingOrder = await Order.findById(orderId);

  if (!existingOrder) {
    throw new Error("Order not found.");
  }

  if (!existingOrder.user || existingOrder.user.toString() !== userId) {
    throw new Error("You are not authorized to verify this order.");
  }

  if (
    existingOrder.paymentProvider !== "cashfree" ||
    !existingOrder.cashfreeOrderId ||
    existingOrder.cashfreeOrderId !== expectedCashfreeOrderId
  ) {
    throw new Error("Cashfree order mismatch.");
  }

  // Idempotency: never deduct stock again for an already-paid order.
  if (existingOrder.paymentStatus === "paid") {
    return existingOrder;
  }

  if (existingOrder.paymentStatus === "refunded" || existingOrder.status === "cancelled") {
    throw new Error("This order cannot be paid in its current state.");
  }

  // Retrieve the actual payment records directly from Cashfree.
  const payments = await getCashfreePayments(expectedCashfreeOrderId);

  const successfulPayment = payments.find((payment) => payment.payment_status === "SUCCESS");

  // A redirect or a pending payment is not proof of payment.
  if (!successfulPayment) {
    throw new Error(
      "Cashfree has not confirmed a successful payment yet. Please try verification again shortly.",
    );
  }

  if (successfulPayment.order_id !== expectedCashfreeOrderId) {
    throw new Error("Cashfree payment order mismatch.");
  }

  if (successfulPayment.payment_currency !== "INR" || existingOrder.currency !== "INR") {
    throw new Error("Payment currency mismatch.");
  }

  const gatewayAmountPaise = Math.round(Number(successfulPayment.payment_amount) * 100);

  const expectedAmountPaise = Math.round(existingOrder.total * 100);

  if (
    !Number.isFinite(gatewayAmountPaise) ||
    gatewayAmountPaise <= 0 ||
    gatewayAmountPaise !== expectedAmountPaise
  ) {
    throw new Error("Payment amount does not match the order total.");
  }

  // Finalize payment and inventory together. This requires MongoDB
  // transactions, supported by MongoDB Atlas and replica sets.
  const dbSession = await Order.startSession();

  try {
    await dbSession.withTransaction(async () => {
      // Re-read inside the transaction to avoid relying on stale state.
      const order = await Order.findById(orderId).session(dbSession);

      if (!order) {
        throw new Error("Order not found.");
      }

      if (!order.user || order.user.toString() !== userId) {
        throw new Error("You are not authorized to verify this order.");
      }

      if (
        order.paymentProvider !== "cashfree" ||
        order.cashfreeOrderId !== expectedCashfreeOrderId
      ) {
        throw new Error("Cashfree order mismatch.");
      }

      // Another request may already have finalized this payment.
      if (order.paymentStatus === "paid") {
        return;
      }

      if (order.paymentStatus === "refunded" || order.status === "cancelled") {
        throw new Error("This order cannot be paid in its current state.");
      }

      // Deduct inventory conditionally. If any item has insufficient
      // stock, throwing aborts the transaction and rolls back prior changes.
      for (const item of order.items) {
        const stockUpdate = await Product.updateOne(
          {
            _id: item.product,
            stock: { $gte: item.quantity },
          },
          {
            $inc: { stock: -item.quantity },
          },
          { session: dbSession },
        );

        if (stockUpdate.modifiedCount !== 1) {
          throw new Error(
            `Insufficient stock for "${item.name}". Payment requires reconciliation before this order can be fulfilled.`,
          );
        }
      }

      order.paymentStatus = "paid";
      order.status = "confirmed";
      order.cashfreePaymentId = String(successfulPayment.cf_payment_id);

      await order.save({ session: dbSession });
    });
  } finally {
    await dbSession.endSession();
  }

  const finalizedOrder = await Order.findById(orderId);

  if (!finalizedOrder || finalizedOrder.paymentStatus !== "paid") {
    throw new Error("Payment finalization could not be confirmed. Please retry verification.");
  }

  return finalizedOrder;
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
