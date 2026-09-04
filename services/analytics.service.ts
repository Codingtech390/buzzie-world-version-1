import { connectToDatabase } from "@/lib/mongoose";

import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

export type AnalyticsRange = "7d" | "30d" | "90d" | "1y";

export interface AdminAnalytics {
  overview: {
    /**
     * Gross collected revenue from successfully paid,
     * non-cancelled orders during the selected period.
     */
    revenue: number;

    /**
     * Total number of orders placed during the selected period.
     * This includes pending/failed/cancelled orders because
     * it represents order volume, not revenue.
     */
    orders: number;

    /**
     * Number of unique customers who generated paid revenue
     * during the selected period.
     */
    customers: number;

    /**
     * Total products currently present in the catalog.
     */
    products: number;

    /**
     * Average order value based only on successfully paid,
     * non-cancelled orders.
     */
    averageOrderValue: number;
  };

  comparison: {
    /**
     * Percentage change versus the immediately preceding
     * period of equal length.
     */
    revenue: number;

    orders: number;

    customers: number;
  };

  revenueByDate: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;

  ordersByStatus: Array<{
    status: string;
    count: number;
  }>;

  topProducts: Array<{
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;

  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customer: string;
    total: number;
    status: string;
    paymentStatus: string;
    createdAt: string;
  }>;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function roundMoney(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function getRangeStart(range: AnalyticsRange, endDate: Date = new Date()) {
  const start = new Date(endDate);

  switch (range) {
    case "7d":
      start.setDate(start.getDate() - 7);
      break;

    case "30d":
      start.setDate(start.getDate() - 30);
      break;

    case "90d":
      start.setDate(start.getDate() - 90);
      break;

    case "1y":
      start.setFullYear(start.getFullYear() - 1);
      break;
  }

  return start;
}

function getPreviousRangeStart(range: AnalyticsRange, currentStart: Date) {
  const start = new Date(currentStart);

  switch (range) {
    case "7d":
      start.setDate(start.getDate() - 7);
      break;

    case "30d":
      start.setDate(start.getDate() - 30);
      break;

    case "90d":
      start.setDate(start.getDate() - 90);
      break;

    case "1y":
      start.setFullYear(start.getFullYear() - 1);
      break;
  }

  return start;
}

/**
 * Revenue must represent money that was actually collected.
 *
 * We therefore ONLY count:
 *   paymentStatus === "paid"
 *
 * and exclude cancelled orders.
 *
 * Refunded orders are naturally excluded because their paymentStatus
 * is "refunded", not "paid".
 */
function isRevenueOrder(order: { status?: string; paymentStatus?: string }): boolean {
  return order.paymentStatus === "paid" && order.status !== "cancelled";
}

/**
 * The Order.total is the final order amount.
 *
 * This is preferable to calculating revenue from the current
 * Product price because an order stores the historical amount
 * paid by the customer.
 */
function getRevenue(order: { total?: number }): number {
  const total = Number(order.total ?? 0);

  return Number.isFinite(total) && total > 0 ? total : 0;
}

/**
 * Calculates percentage change between two periods.
 *
 * When the previous period is zero:
 * - 0 -> 0 = 0%
 * - 0 -> positive = 100%
 *
 * The latter is a practical dashboard representation of
 * "growth from zero" because a mathematical percentage is undefined.
 */
function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) {
    return current === 0 ? 0 : 100;
  }

  return ((current - previous) / previous) * 100;
}

/**
 * Creates a stable date key.
 *
 * Your store is India-focused, so using Asia/Kolkata prevents an
 * order near midnight from appearing under the wrong calendar date
 * when the server itself is running in UTC.
 */
function getDateKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/**
 * Creates all calendar dates in the selected period.
 *
 * This means the analytics chart can show zero-revenue days instead
 * of silently removing days where there were no orders.
 */
function buildDateRange(start: Date, end: Date): string[] {
  const dates: string[] = [];

  const cursor = new Date(start);

  // Work with calendar days rather than mutating the original date.
  cursor.setHours(0, 0, 0, 0);

  const endDate = new Date(end);
  endDate.setHours(0, 0, 0, 0);

  while (cursor <= endDate) {
    dates.push(getDateKey(cursor));

    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}

/* -------------------------------------------------------------------------- */
/* Main analytics                                                             */
/* -------------------------------------------------------------------------- */

export async function getAdminAnalytics(range: AnalyticsRange = "30d"): Promise<AdminAnalytics> {
  await connectToDatabase();

  const now = new Date();

  const currentStart = getRangeStart(range, now);

  const previousStart = getPreviousRangeStart(range, currentStart);

  /*
   * Fetch current and previous orders together.
   *
   * We intentionally keep the actual Order documents as the source
   * of truth for historical revenue. This avoids accidentally
   * calculating old orders using today's product prices.
   */
  const [currentOrders, previousOrders, totalProducts] = await Promise.all([
    Order.find({
      createdAt: {
        $gte: currentStart,
        $lte: now,
      },
    })
      .sort({ createdAt: -1 })
      .lean(),

    Order.find({
      createdAt: {
        $gte: previousStart,
        $lt: currentStart,
      },
    })
      .sort({ createdAt: -1 })
      .lean(),

    Product.countDocuments({}),
  ]);

  /* ---------------------------------------------------------------------- */
  /* Current period                                                         */
  /* ---------------------------------------------------------------------- */

  const revenueOrders = currentOrders.filter(isRevenueOrder);

  const revenue = roundMoney(revenueOrders.reduce((sum, order) => sum + getRevenue(order), 0));

  /*
   * Orders means order volume, not successful payments.
   *
   * This is useful operationally because an admin needs to know
   * how many orders entered the system, including orders that may
   * still need attention.
   */
  const orderCount = currentOrders.length;

  /* ---------------------------------------------------------------------- */
  /* Previous period                                                        */
  /* ---------------------------------------------------------------------- */

  const previousRevenueOrders = previousOrders.filter(isRevenueOrder);

  const previousRevenue = roundMoney(
    previousRevenueOrders.reduce((sum, order) => sum + getRevenue(order), 0),
  );

  const previousOrderCount = previousOrders.length;

  /* ---------------------------------------------------------------------- */
  /* Customers                                                              */
  /* ---------------------------------------------------------------------- */

  /*
   * There is currently no Customer model in the project.
   *
   * Therefore we identify a customer by normalized shipping email.
   *
   * IMPORTANT:
   * We use ONLY revenue-generating orders here.
   *
   * A person who started checkout but never paid should not
   * increase the "customers who generated revenue" metric.
   */

  const customerEmails = new Set<string>();

  for (const order of revenueOrders) {
    const email = order.shippingAddress?.email?.trim().toLowerCase();

    if (email) {
      customerEmails.add(email);
    }
  }

  const previousCustomerEmails = new Set<string>();

  for (const order of previousRevenueOrders) {
    const email = order.shippingAddress?.email?.trim().toLowerCase();

    if (email) {
      previousCustomerEmails.add(email);
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Revenue by date                                                        */
  /* ---------------------------------------------------------------------- */

  /*
   * Build every date first so zero-order days are still represented.
   */
  const dateKeys = buildDateRange(currentStart, now);

  const revenueMap = new Map<
    string,
    {
      revenue: number;
      orders: number;
    }
  >();

  for (const dateKey of dateKeys) {
    revenueMap.set(dateKey, {
      revenue: 0,
      orders: 0,
    });
  }

  for (const order of currentOrders) {
    const createdAt = new Date(order.createdAt);

    if (Number.isNaN(createdAt.getTime())) {
      continue;
    }

    const dateKey = getDateKey(createdAt);

    if (!revenueMap.has(dateKey)) {
      revenueMap.set(dateKey, {
        revenue: 0,
        orders: 0,
      });
    }

    const entry = revenueMap.get(dateKey)!;

    /*
     * Orders count includes every order.
     */
    entry.orders += 1;

    /*
     * Revenue only comes from successfully paid orders.
     */
    if (isRevenueOrder(order)) {
      entry.revenue += getRevenue(order);
    }
  }

  const revenueByDate = Array.from(revenueMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => ({
      date,
      revenue: roundMoney(data.revenue),
      orders: data.orders,
    }));

  /* ---------------------------------------------------------------------- */
  /* Order status                                                           */
  /* ---------------------------------------------------------------------- */

  /*
   * Status breakdown intentionally includes ALL orders.
   *
   * This lets the admin see:
   * pending -> confirmed -> processing -> shipped -> delivered
   * as well as cancelled orders.
   */
  const statusMap = new Map<string, number>();

  for (const order of currentOrders) {
    const status = order.status ?? "pending";

    statusMap.set(status, (statusMap.get(status) ?? 0) + 1);
  }

  const ordersByStatus = Array.from(statusMap.entries())
    .sort(([, a], [, b]) => b - a)
    .map(([status, count]) => ({
      status,
      count,
    }));

  /* ---------------------------------------------------------------------- */
  /* Top products                                                           */
  /* ---------------------------------------------------------------------- */

  /*
   * Product performance is based ONLY on paid revenue orders.
   *
   * We use:
   *   item.quantity
   *   item.lineTotal
   *
   * from the historical Order item.
   *
   * We DO NOT query the Product model for today's price because
   * today's price may be different from the price the customer
   * actually paid.
   */

  const productMap = new Map<
    string,
    {
      productId: string;
      name: string;
      quantity: number;
      revenue: number;
    }
  >();

  for (const order of revenueOrders) {
    if (!Array.isArray(order.items)) {
      continue;
    }

    for (const item of order.items) {
      if (!item?.product) {
        continue;
      }

      const productId = item.product.toString();

      const quantity = Number(item.quantity ?? 0);

      const lineTotal = Number(item.lineTotal ?? 0);

      if (!productMap.has(productId)) {
        productMap.set(productId, {
          productId,
          name: item.name?.trim() || "Unnamed Product",
          quantity: 0,
          revenue: 0,
        });
      }

      const product = productMap.get(productId)!;

      if (Number.isFinite(quantity) && quantity > 0) {
        product.quantity += quantity;
      }

      if (Number.isFinite(lineTotal) && lineTotal > 0) {
        product.revenue += lineTotal;
      }
    }
  }

  const topProducts = Array.from(productMap.values())
    .sort((a, b) => {
      /*
       * Revenue is the primary ranking because this is a
       * business/profit-oriented dashboard.
       *
       * Quantity is the secondary ranking for ties.
       */
      if (b.revenue !== a.revenue) {
        return b.revenue - a.revenue;
      }

      return b.quantity - a.quantity;
    })
    .slice(0, 10)
    .map((product) => ({
      productId: product.productId,
      name: product.name,
      quantity: product.quantity,
      revenue: roundMoney(product.revenue),
    }));

  /* ---------------------------------------------------------------------- */
  /* Recent orders                                                          */
  /* ---------------------------------------------------------------------- */

  /*
   * Recent orders should show the most recently created orders,
   * regardless of payment status.
   *
   * This is operational information rather than revenue information.
   */
  const recentOrders = currentOrders.slice(0, 8).map((order) => ({
    id: order._id.toString(),

    orderNumber: order.orderNumber || "Unknown",

    customer: order.shippingAddress?.fullName?.trim() || "Guest Customer",

    total: roundMoney(Number(order.total ?? 0)),

    status: order.status || "pending",

    paymentStatus: order.paymentStatus || "pending",

    createdAt: new Date(order.createdAt).toISOString(),
  }));

  /* ---------------------------------------------------------------------- */
  /* Average order value                                                    */
  /* ---------------------------------------------------------------------- */

  /*
   * AOV must use the same revenue definition as revenue:
   *
   * successfully paid + non-cancelled orders.
   *
   * Otherwise the dashboard could show an AOV based on unpaid
   * orders and give the business owner a misleading number.
   */
  const averageOrderValue =
    revenueOrders.length > 0 ? roundMoney(revenue / revenueOrders.length) : 0;

  /* ---------------------------------------------------------------------- */
  /* Comparisons                                                            */
  /* ---------------------------------------------------------------------- */

  const revenueChange = roundMoney(calculatePercentageChange(revenue, previousRevenue));

  const ordersChange = roundMoney(calculatePercentageChange(orderCount, previousOrderCount));

  const customersChange = roundMoney(
    calculatePercentageChange(customerEmails.size, previousCustomerEmails.size),
  );

  /* ---------------------------------------------------------------------- */
  /* Final response                                                         */
  /* ---------------------------------------------------------------------- */

  return {
    overview: {
      revenue,
      orders: orderCount,
      customers: customerEmails.size,
      products: totalProducts,
      averageOrderValue,
    },

    comparison: {
      revenue: revenueChange,
      orders: ordersChange,
      customers: customersChange,
    },

    revenueByDate,

    ordersByStatus,

    topProducts,

    recentOrders,
  };
}
