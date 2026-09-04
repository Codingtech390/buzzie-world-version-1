import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongoose";
import { User } from "@/models/User";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";

function toNumber(value: unknown) {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

type DashboardOrder = {
  _id?: {
    toString(): string;
  };
  orderNumber?: string;
  shippingAddress?: {
    fullName?: string;
    email?: string;
  };
  total?: number;
  currency?: string;
  status?: string;
  paymentStatus?: string;
  createdAt?: Date | string;
};

type DashboardProduct = {
  _id?: {
    toString(): string;
  };
  name?: string;
  slug?: string;
  sku?: string;
  stock?: number;
  price?: number;
  images?: Array<{
    url?: string;
  }>;
  status?: string;
};

function serializeOrder(order: DashboardOrder) {
  return {
    id: order._id?.toString() ?? "",
    orderNumber: order.orderNumber ?? "",
    customerName: order.shippingAddress?.fullName ?? "Guest Customer",
    customerEmail: order.shippingAddress?.email ?? "",
    total: toNumber(order.total),
    currency: order.currency ?? "INR",
    status: order.status ?? "pending",
    paymentStatus: order.paymentStatus ?? "pending",
    createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : null,
  };
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    const requestedDays = Number(searchParams.get("days") || "30");

    const days = [7, 30, 90].includes(requestedDays) ? requestedDays : 30;

    const now = new Date();

    const periodStart = new Date(now);

    periodStart.setDate(periodStart.getDate() - days);

    periodStart.setHours(0, 0, 0, 0);

    /*
     * ----------------------------------------------------------------------
     * Basic totals
     * ----------------------------------------------------------------------
     */

    const [
      totalCustomers,
      activeCustomers,
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalOrders,
      periodOrders,
      periodRevenue,
      previousPeriodRevenue,
      previousPeriodOrders,
      recentOrders,
      orderStatusCounts,
      periodCustomerCount,
    ] = await Promise.all([
      User.countDocuments({
        role: "customer",
      }),

      User.countDocuments({
        role: "customer",
        isActive: true,
      }),

      Product.countDocuments({}),

      Product.countDocuments({
        status: "active",
      }),

      Product.countDocuments({
        status: "active",
        stock: {
          $lte: 5,
        },
      }),

      Order.countDocuments({}),

      Order.countDocuments({
        createdAt: {
          $gte: periodStart,
          $lte: now,
        },
      }),

      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: periodStart,
              $lte: now,
            },
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            revenue: {
              $sum: "$total",
            },
          },
        },
      ]),

      /*
       * Previous equivalent period.
       *
       * Example:
       * Current = last 30 days
       * Previous = 30 days immediately before that.
       */
      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(periodStart.getTime() - days * 24 * 60 * 60 * 1000),
              $lt: periodStart,
            },
            paymentStatus: "paid",
          },
        },
        {
          $group: {
            _id: null,
            revenue: {
              $sum: "$total",
            },
          },
        },
      ]),

      Order.countDocuments({
        createdAt: {
          $gte: new Date(periodStart.getTime() - days * 24 * 60 * 60 * 1000),
          $lt: periodStart,
        },
      }),

      Order.find({})
        .sort({
          createdAt: -1,
        })
        .limit(8)
        .lean(),

      Order.aggregate([
        {
          $group: {
            _id: "$status",
            count: {
              $sum: 1,
            },
          },
        },
      ]),

      User.countDocuments({
        role: "customer",
        createdAt: {
          $gte: periodStart,
          $lte: now,
        },
      }),
    ]);

    /*
     * ----------------------------------------------------------------------
     * Revenue
     * ----------------------------------------------------------------------
     */

    const revenue = toNumber(periodRevenue?.[0]?.revenue);

    const previousRevenue = toNumber(previousPeriodRevenue?.[0]?.revenue);

    const revenueChange =
      previousRevenue === 0
        ? revenue > 0
          ? 100
          : 0
        : ((revenue - previousRevenue) / previousRevenue) * 100;

    /*
     * ----------------------------------------------------------------------
     * Order change
     * ----------------------------------------------------------------------
     */

    const orderChange =
      previousPeriodOrders === 0
        ? periodOrders > 0
          ? 100
          : 0
        : ((periodOrders - previousPeriodOrders) / previousPeriodOrders) * 100;

    /*
     * ----------------------------------------------------------------------
     * Average order value
     * ----------------------------------------------------------------------
     */

    const paidPeriodOrders = await Order.countDocuments({
      createdAt: {
        $gte: periodStart,
        $lte: now,
      },
      paymentStatus: "paid",
    });

    const averageOrderValue = paidPeriodOrders > 0 ? revenue / paidPeriodOrders : 0;

    /*
     * ----------------------------------------------------------------------
     * Order status map
     * ----------------------------------------------------------------------
     */

    const statusMap: Record<string, number> = {};

    for (const item of orderStatusCounts) {
      statusMap[item._id] = item.count;
    }

    /*
     * ----------------------------------------------------------------------
     * Low stock products
     * ----------------------------------------------------------------------
     */

    const lowStock = await Product.find({
      status: "active",
      stock: {
        $lte: 5,
      },
    })
      .sort({
        stock: 1,
      })
      .limit(8)
      .select("_id name slug sku stock price images status")
      .lean();

    /*
     * ----------------------------------------------------------------------
     * Revenue by day
     *
     * We generate a continuous list of days so that days with
     * zero revenue are still represented.
     * ----------------------------------------------------------------------
     */

    const revenueByDayRaw = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: periodStart,
            $lte: now,
          },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          revenue: {
            $sum: "$total",
          },
          orders: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const revenueMap = new Map(
      revenueByDayRaw.map((item) => [
        item._id,
        {
          revenue: toNumber(item.revenue),
          orders: toNumber(item.orders),
        },
      ]),
    );

    const chartData: Array<{
      date: string;
      revenue: number;
      orders: number;
    }> = [];

    const cursor = new Date(periodStart);

    while (cursor <= now) {
      const key = cursor.toISOString().slice(0, 10);

      const dayData = revenueMap.get(key);

      chartData.push({
        date: key,
        revenue: dayData?.revenue ?? 0,
        orders: dayData?.orders ?? 0,
      });

      cursor.setDate(cursor.getDate() + 1);
    }

    /*
     * ----------------------------------------------------------------------
     * Recent orders
     * ----------------------------------------------------------------------
     */

    const serializedRecentOrders = recentOrders.map(serializeOrder);

    /*
     * ----------------------------------------------------------------------
     * Response
     * ----------------------------------------------------------------------
     */

    return NextResponse.json({
      success: true,

      data: {
        period: {
          days,
          start: periodStart.toISOString(),
          end: now.toISOString(),
        },

        overview: {
          totalRevenue: revenue,
          revenueChange: Number(revenueChange.toFixed(1)),

          totalOrders,
          periodOrders,
          orderChange: Number(orderChange.toFixed(1)),

          totalCustomers,
          activeCustomers,
          periodCustomerCount,

          totalProducts,
          activeProducts,
          lowStockProducts: lowStockProducts,

          averageOrderValue: Number(averageOrderValue.toFixed(2)),
        },

        orders: {
          pending: statusMap.pending ?? 0,
          confirmed: statusMap.confirmed ?? 0,
          processing: statusMap.processing ?? 0,
          shipped: statusMap.shipped ?? 0,
          delivered: statusMap.delivered ?? 0,
          cancelled: statusMap.cancelled ?? 0,
        },

        chart: chartData,

        recentOrders: serializedRecentOrders,

        lowStockProducts: lowStock.map((product: DashboardProduct) => ({
          id: product._id?.toString() ?? "",
          name: product.name ?? "",
          slug: product.slug ?? "",
          sku: product.sku ?? "",
          stock: toNumber(product.stock),
          price: toNumber(product.price),
          image: product.images?.[0]?.url ?? "",
          status: product.status ?? "",
        })),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/dashboard error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to load dashboard",
      },
      {
        status: 500,
      },
    );
  }
}
