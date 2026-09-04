"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Box,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Package,
  RefreshCw,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Users,
} from "lucide-react";

type AnalyticsRange = "7d" | "30d" | "90d" | "1y";

interface AnalyticsData {
  overview: {
    revenue: number;
    orders: number;
    customers: number;
    products: number;
    averageOrderValue: number;
  };

  comparison: {
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

interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
  message?: string;
}

const RANGE_OPTIONS: Array<{
  value: AnalyticsRange;
  label: string;
}> = [
  {
    value: "7d",
    label: "Last 7 days",
  },
  {
    value: "30d",
    label: "Last 30 days",
  },
  {
    value: "90d",
    label: "Last 90 days",
  },
  {
    value: "1y",
    label: "Last year",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
  }).format(new Date(date));
}

function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatStatus(status: string) {
  return status.replace(/[_-]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getStatusClasses(status: string) {
  switch (status.toLowerCase()) {
    case "delivered":
    case "paid":
    case "completed":
      return "bg-emerald-50 text-emerald-700";

    case "processing":
    case "confirmed":
    case "shipped":
      return "bg-blue-50 text-blue-700";

    case "pending":
      return "bg-amber-50 text-amber-700";

    case "cancelled":
    case "canceled":
    case "failed":
    case "refunded":
      return "bg-rose-50 text-rose-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function ChangeIndicator({ value }: { value: number }) {
  if (value === 0) {
    return <span className="text-xs font-medium text-slate-500">No change</span>;
  }

  const positive = value > 0;

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold ${
        positive ? "text-emerald-600" : "text-rose-600"
      }`}
    >
      {positive ? (
        <ArrowUpRight className="h-3.5 w-3.5" />
      ) : (
        <ArrowDownRight className="h-3.5 w-3.5" />
      )}
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  description,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  change?: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{value}</p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {typeof change === "number" && <ChangeIndicator value={change} />}

        <span className="text-xs text-slate-400">{description}</span>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState<AnalyticsRange>("30d");

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = useCallback(async (selectedRange: AnalyticsRange, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const response = await fetch(`/api/analytics?range=${selectedRange}`, {
        method: "GET",
        cache: "no-store",
      });

      const contentType = response.headers.get("content-type") ?? "";

      if (!response.ok || !contentType.includes("application/json")) {
        throw new Error(`Server returned an invalid response (${response.status})`);
      }

      const result = (await response.json()) as AnalyticsResponse;

      if (!result.success || !result.data) {
        throw new Error(result.message ?? "Failed to load analytics");
      }

      setAnalytics(result.data);
    } catch (err) {
      console.error("Analytics fetch error:", err);

      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Intentional initial/filter-change data synchronization.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAnalytics(range);
  }, [range, fetchAnalytics]);

  const maxRevenue = useMemo(() => {
    if (!analytics?.revenueByDate?.length) {
      return 0;
    }

    return Math.max(...analytics.revenueByDate.map((item) => item.revenue), 1);
  }, [analytics]);

  const totalStatusOrders = useMemo(() => {
    return analytics?.ordersByStatus.reduce((sum, item) => sum + item.count, 0) ?? 0;
  }, [analytics]);

  return (
    <div className="min-h-screen bg-[#FCFAF7]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* HEADER */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-violet-600">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Store performance
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Understand your sales, orders, customers and top-performing products.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <select
                value={range}
                onChange={(event) => setRange(event.target.value as AnalyticsRange)}
                className="h-10 appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-sm font-medium text-slate-700 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100"
              >
                {RANGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>

            <button
              type="button"
              onClick={() => fetchAnalytics(range, true)}
              disabled={loading || refreshing}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5">
            <p className="font-medium text-rose-800">Unable to load analytics</p>

            <p className="mt-1 text-sm text-rose-600">{error}</p>

            <button
              type="button"
              onClick={() => fetchAnalytics(range, true)}
              className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
            >
              Try again
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading && !analytics ? (
          <div className="mt-8 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <div key={index} className="h-36 animate-pulse rounded-2xl bg-slate-200/70" />
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
              <div className="h-[390px] animate-pulse rounded-2xl bg-slate-200/70" />

              <div className="h-[390px] animate-pulse rounded-2xl bg-slate-200/70" />
            </div>
          </div>
        ) : analytics ? (
          <>
            {/* KPI CARDS */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <StatCard
                icon={CircleDollarSign}
                label="Revenue"
                value={formatCurrency(analytics.overview.revenue)}
                change={analytics.comparison.revenue}
                description="vs previous period"
              />

              <StatCard
                icon={ShoppingCart}
                label="Orders"
                value={formatNumber(analytics.overview.orders)}
                change={analytics.comparison.orders}
                description="vs previous period"
              />

              <StatCard
                icon={Users}
                label="Unique customers"
                value={formatNumber(analytics.overview.customers)}
                description="unique customers in period"
              />

              <StatCard
                icon={Package}
                label="Products"
                value={formatNumber(analytics.overview.products)}
                description="catalog products"
              />

              <StatCard
                icon={ShoppingBag}
                label="Average order"
                value={formatCurrency(analytics.overview.averageOrderValue)}
                description="per revenue order"
              />
            </div>

            {/* REVENUE + ORDER STATUS */}
            <div className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
              {/* REVENUE CHART */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Revenue overview</h2>

                    <p className="mt-1 text-sm text-slate-500">Daily revenue and order activity.</p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <Activity className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-8 h-[300px]">
                  {analytics.revenueByDate.length === 0 ? (
                    <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200">
                      <div className="text-center">
                        <BarChart3 className="mx-auto h-8 w-8 text-slate-300" />

                        <p className="mt-2 text-sm font-medium text-slate-500">
                          No revenue data yet
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-full items-end gap-1 overflow-x-auto pb-7">
                      {analytics.revenueByDate.map((item, index) => {
                        const height = Math.max(
                          (item.revenue / maxRevenue) * 100,
                          item.revenue > 0 ? 4 : 1,
                        );

                        return (
                          <div
                            key={`${item.date}-${index}`}
                            className="group flex min-w-[26px] flex-1 flex-col items-center justify-end"
                          >
                            <div className="pointer-events-none mb-2 hidden rounded-lg bg-slate-900 px-2 py-1 text-[11px] text-white group-hover:block">
                              {formatCurrency(item.revenue)}
                            </div>

                            <div
                              className="w-full min-w-[10px] rounded-t-md bg-violet-500/80 transition-all duration-300 group-hover:bg-violet-600"
                              style={{
                                height: `${height}%`,
                              }}
                            />

                            {(index === 0 ||
                              index === analytics.revenueByDate.length - 1 ||
                              analytics.revenueByDate.length <= 12) && (
                              <span className="mt-2 whitespace-nowrap text-[10px] text-slate-400">
                                {formatDate(item.date)}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>

              {/* ORDER STATUS */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Order status</h2>

                    <p className="mt-1 text-sm text-slate-500">Current period breakdown.</p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-8 space-y-5">
                  {analytics.ordersByStatus.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
                      <ShoppingBag className="mx-auto h-8 w-8 text-slate-300" />

                      <p className="mt-2 text-sm text-slate-500">No orders yet</p>
                    </div>
                  ) : (
                    analytics.ordersByStatus.map((item) => {
                      const percentage =
                        totalStatusOrders > 0 ? (item.count / totalStatusOrders) * 100 : 0;

                      return (
                        <div key={item.status}>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-slate-700">
                              {formatStatus(item.status)}
                            </span>

                            <span className="text-slate-500">{item.count}</span>
                          </div>

                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-violet-500 transition-all"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </section>
            </div>

            {/* TOP PRODUCTS + RECENT ORDERS */}
            <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.35fr]">
              {/* TOP PRODUCTS */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Top products</h2>

                    <p className="mt-1 text-sm text-slate-500">Best performers by revenue.</p>
                  </div>

                  <Sparkles className="h-5 w-5 text-violet-500" />
                </div>

                <div className="mt-6 divide-y divide-slate-100">
                  {analytics.topProducts.length === 0 ? (
                    <div className="py-10 text-center">
                      <Package className="mx-auto h-8 w-8 text-slate-300" />

                      <p className="mt-2 text-sm text-slate-500">No product sales yet</p>
                    </div>
                  ) : (
                    analytics.topProducts.map((product, index) => (
                      <div key={product.productId} className="flex items-center gap-3 py-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">
                          {index + 1}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-800">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {formatNumber(product.quantity)} units
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-semibold text-slate-900">
                          {formatCurrency(product.revenue)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {/* RECENT ORDERS */}
              <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <div className="flex items-start justify-between gap-4 p-5 sm:p-6">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">Recent orders</h2>

                    <p className="mt-1 text-sm text-slate-500">Latest activity from your store.</p>
                  </div>

                  <Clock3 className="h-5 w-5 text-violet-500" />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px]">
                    <thead>
                      <tr className="border-y border-slate-100 bg-slate-50/70">
                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Order
                        </th>

                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Customer
                        </th>

                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Total
                        </th>

                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Status
                        </th>

                        <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Date
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {analytics.recentOrders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center">
                            <ShoppingCart className="mx-auto h-8 w-8 text-slate-300" />

                            <p className="mt-2 text-sm text-slate-500">No orders yet</p>
                          </td>
                        </tr>
                      ) : (
                        analytics.recentOrders.map((order) => (
                          <tr key={order.id} className="transition hover:bg-slate-50/60">
                            <td className="px-6 py-4">
                              <p className="text-sm font-semibold text-slate-800">
                                #{order.orderNumber}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">{order.paymentStatus}</p>
                            </td>

                            <td className="px-6 py-4">
                              <p className="max-w-[170px] truncate text-sm text-slate-700">
                                {order.customer}
                              </p>
                            </td>

                            <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                              {formatCurrency(order.total)}
                            </td>

                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                                  order.status,
                                )}`}
                              >
                                {formatStatus(order.status)}
                              </span>
                            </td>

                            <td className="px-6 py-4 text-xs text-slate-500">
                              {formatDateTime(order.createdAt)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>


          </>
        ) : null}
      </div>
    </div>
  );
}
