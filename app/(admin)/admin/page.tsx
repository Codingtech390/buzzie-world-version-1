"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  AlertCircle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Eye,
  IndianRupee,
  Package,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";

type Period = 7 | 30 | 90;

type DashboardData = {
  period: {
    days: number;
    start: string;
    end: string;
  };

  overview: {
    totalRevenue: number;
    revenueChange: number;

    totalOrders: number;
    periodOrders: number;
    orderChange: number;

    totalCustomers: number;
    activeCustomers: number;
    periodCustomerCount: number;

    totalProducts: number;
    activeProducts: number;
    lowStockProducts: number;

    averageOrderValue: number;
  };

  orders: {
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };

  chart: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;

  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    total: number;
    currency: string;
    status: string;
    paymentStatus: string;
    createdAt: string | null;
  }>;

  lowStockProducts: Array<{
    id: string;
    name: string;
    slug: string;
    sku: string;
    stock: number;
    price: number;
    image: string;
    status: string;
  }>;
};

type ApiResponse = {
  success: boolean;
  data?: DashboardData;
  message?: string;
};

function formatCurrency(value: number, compact = false) {
  if (compact && Math.abs(value) >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }

  if (compact && Math.abs(value) >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatShortDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

function formatStatus(status: string) {
  if (!status) return "Unknown";

  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<Period>(30);

  const [data, setData] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response = await fetch(`/api/admin/dashboard?days=${period}`, {
          method: "GET",
          cache: "no-store",
        });

        const raw = await response.text();

        let result: ApiResponse | null = null;

        try {
          result = raw ? JSON.parse(raw) : null;
        } catch {
          throw new Error(`Server returned an invalid response (${response.status})`);
        }

        if (!response.ok || !result?.success) {
          throw new Error(result?.message || `Failed to load dashboard (${response.status})`);
        }

        setData(result.data ?? null);
      } catch (err) {
        console.error("Admin dashboard error:", err);

        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [period],
  );

  useEffect(() => {
    // Intentional dashboard data synchronization.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboard();
  }, [fetchDashboard]);

  const chart = useMemo(() => {
    if (!data?.chart) {
      return [];
    }

    /*
     * For a 90-day range, don't render every label.
     * The data remains complete, but labels are reduced
     * to keep the chart clean.
     */
    const step = period === 90 ? 10 : period === 30 ? 4 : 1;

    return data.chart.map((item, index) => ({
      ...item,
      showLabel: index === 0 || index === data.chart.length - 1 || index % step === 0,
    }));
  }, [data, period]);

  return (
    <div className="min-h-screen bg-[#FCFAF7]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-violet-600">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </div>

            <h1 className="font-[Poppins] text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
              A real-time overview of your BuzzieWorld store, orders, customers and products.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex h-10 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              {([7, 30, 90] as Period[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPeriod(value)}
                  className={`rounded-lg px-3 text-xs font-semibold transition sm:px-4 sm:text-sm ${
                    period === value
                      ? "bg-violet-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {value} days
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => fetchDashboard(true)}
              disabled={loading || refreshing}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div className="min-w-0 flex-1">
              <p className="font-semibold">Dashboard data could not be loaded</p>

              <p className="mt-1 text-red-600">{error}</p>

              <button
                type="button"
                onClick={() => fetchDashboard()}
                className="mt-3 font-semibold underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {loading && !data ? (
          <DashboardSkeleton />
        ) : data ? (
          <>
            {/* Primary metrics */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Revenue"
                value={formatCurrency(data.overview.totalRevenue, true)}
                description={`Last ${period} days`}
                icon={<IndianRupee className="h-5 w-5" />}
                change={data.overview.revenueChange}
              />

              <MetricCard
                title="Orders"
                value={data.overview.periodOrders.toLocaleString("en-IN")}
                description={`Last ${period} days`}
                icon={<ShoppingBag className="h-5 w-5" />}
                change={data.overview.orderChange}
              />

              <MetricCard
                title="Customers"
                value={data.overview.totalCustomers.toLocaleString("en-IN")}
                description={`${data.overview.periodCustomerCount} joined in period`}
                icon={<Users className="h-5 w-5" />}
              />

              <MetricCard
                title="Products"
                value={data.overview.totalProducts.toLocaleString("en-IN")}
                description={`${data.overview.activeProducts} active`}
                icon={<Package className="h-5 w-5" />}
              />
            </section>

            {/* Revenue + Order Status */}
            <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <RevenueChart data={chart} period={period} />

              <OrderOverview orders={data.orders} totalOrders={data.overview.totalOrders} />
            </section>

            {/* Secondary metrics */}
            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MiniMetric
                icon={<TrendingUp className="h-4 w-4" />}
                label="Average Order Value"
                value={formatCurrency(data.overview.averageOrderValue)}
              />

              <MiniMetric
                icon={<UserRound className="h-4 w-4" />}
                label="Active Customers"
                value={data.overview.activeCustomers.toLocaleString("en-IN")}
              />

              <MiniMetric
                icon={<Clock3 className="h-4 w-4" />}
                label="Pending Orders"
                value={data.orders.pending.toLocaleString("en-IN")}
              />

              <MiniMetric
                icon={<AlertCircle className="h-4 w-4" />}
                label="Low Stock Products"
                value={data.overview.lowStockProducts.toLocaleString("en-IN")}
                warning={data.overview.lowStockProducts > 0}
              />
            </section>

            {/* Recent orders + low stock */}
            <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
              <RecentOrders orders={data.recentOrders} />

              <LowStockProducts products={data.lowStockProducts} />
            </section>

            {/* Quick actions */}
            <section className="mt-6">
              <div className="mb-4">
                <h2 className="font-[Poppins] text-lg font-semibold text-slate-900">
                  Quick Actions
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Jump directly to the areas you use most often.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <QuickAction
                  href="/admin/products/new"
                  icon={Package}
                  title="Add Product"
                  description="Create a new product"
                />

                <QuickAction
                  href="/admin/orders"
                  icon={ShoppingBag}
                  title="View Orders"
                  description="Manage customer orders"
                />

                <QuickAction
                  href="/admin/customers"
                  icon={Users}
                  title="Customers"
                  description="Manage customer accounts"
                />

                <QuickAction
                  href="/admin/storefront/homepage"
                  icon={Eye}
                  title="Storefront"
                  description="Manage homepage content"
                />
              </div>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Metric Card                                                                */
/* -------------------------------------------------------------------------- */

function MetricCard({
  title,
  value,
  description,
  icon,
  change,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  change?: number;
}) {
  const positive = typeof change === "number" && change >= 0;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>

          <p className="mt-2 font-[Poppins] text-2xl font-semibold tracking-tight text-slate-900 sm:text-[28px]">
            {value}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400">{description}</span>

            {typeof change === "number" && (
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                  positive ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {positive ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                {Math.abs(change)}%
              </span>
            )}
          </div>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Revenue Chart                                                              */
/* -------------------------------------------------------------------------- */

function RevenueChart({
  data,
  period,
}: {
  data: Array<{
    date: string;
    revenue: number;
    orders: number;
    showLabel: boolean;
  }>;
  period: Period;
}) {
  const width = 900;
  const height = 300;

  const paddingLeft = 10;
  const paddingRight = 10;
  const paddingTop = 25;
  const paddingBottom = 45;

  const chartWidth = width - paddingLeft - paddingRight;

  const chartHeight = height - paddingTop - paddingBottom;

  const maxRevenue = Math.max(...data.map((item) => item.revenue), 1);

  const points = data.map((item, index) => {
    const x = data.length <= 1 ? width / 2 : paddingLeft + (index / (data.length - 1)) * chartWidth;

    const y = paddingTop + chartHeight - (item.revenue / maxRevenue) * chartHeight;

    return {
      ...item,
      x,
      y,
    };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${
          points[0].x
        } ${paddingTop + chartHeight} Z`
      : "";

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.035)]">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-[Poppins] text-base font-semibold text-slate-900">
            Revenue Overview
          </h2>

          <p className="mt-1 text-xs text-slate-400">Paid orders over the last {period} days</p>
        </div>

        <div className="flex items-center gap-5">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Revenue
            </p>

            <p className="mt-0.5 text-sm font-semibold text-slate-800">
              {formatCurrency(totalRevenue, true)}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Orders
            </p>

            <p className="mt-0.5 text-sm font-semibold text-slate-800">{totalOrders}</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto px-4 pb-3 pt-5 sm:px-5">
        <div className="min-w-[650px]">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="h-[280px] w-full"
            preserveAspectRatio="none"
            role="img"
            aria-label="Revenue chart"
          >
            {[0, 1, 2, 3].map((line) => {
              const y = paddingTop + (chartHeight / 3) * line;

              return (
                <line
                  key={line}
                  x1={paddingLeft}
                  x2={width - paddingRight}
                  y1={y}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-100"
                  strokeWidth="1"
                />
              );
            })}

            {areaPath && <path d={areaPath} fill="currentColor" className="text-violet-50" />}

            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="currentColor"
                className="text-violet-500"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {points.map((point, index) => (
              <g key={point.date}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={period === 90 ? 2 : 3}
                  fill="currentColor"
                  className="text-violet-500"
                />

                {point.showLabel && (
                  <text
                    x={point.x}
                    y={height - 14}
                    textAnchor="middle"
                    className="fill-slate-400 text-[11px]"
                  >
                    {formatShortDate(point.date)}
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Order Overview                                                             */
/* -------------------------------------------------------------------------- */

function OrderOverview({
  orders,
  totalOrders,
}: {
  orders: DashboardData["orders"];
  totalOrders: number;
}) {
  const items = [
    {
      label: "Pending",
      value: orders.pending,
      icon: Clock3,
      className: "bg-amber-50 text-amber-700",
    },
    {
      label: "Processing",
      value: orders.processing,
      icon: RefreshCw,
      className: "bg-violet-50 text-violet-700",
    },
    {
      label: "Shipped",
      value: orders.shipped,
      icon: ShoppingBag,
      className: "bg-blue-50 text-blue-700",
    },
    {
      label: "Delivered",
      value: orders.delivered,
      icon: CheckCircle2,
      className: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Cancelled",
      value: orders.cancelled,
      icon: XCircle,
      className: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.035)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-[Poppins] text-base font-semibold text-slate-900">Order Overview</h2>

          <p className="mt-1 text-xs text-slate-400">Current order pipeline</p>
        </div>

        <Link
          href="/admin/orders"
          className="text-xs font-semibold text-violet-600 hover:text-violet-700"
        >
          View all
        </Link>
      </div>

      <div className="mt-5 space-y-3">
        {items.map((item) => {
          const Icon = item.icon;

          const percentage = totalOrders > 0 ? Math.round((item.value / totalOrders) * 100) : 0;

          return (
            <div key={item.label}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.className}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                </div>

                <span className="text-sm font-semibold text-slate-900">{item.value}</span>
              </div>

              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-violet-400 transition-all"
                  style={{
                    width: `${Math.min(percentage, 100)}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Mini Metric                                                                */
/* -------------------------------------------------------------------------- */

function MiniMetric({
  icon,
  label,
  value,
  warning = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-4">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          warning ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-500"
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs text-slate-400">{label}</p>

        <p className="mt-0.5 text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Recent Orders                                                              */
/* -------------------------------------------------------------------------- */

function RecentOrders({ orders }: { orders: DashboardData["recentOrders"] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.035)]">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
        <div>
          <h2 className="font-[Poppins] text-base font-semibold text-slate-900">Recent Orders</h2>

          <p className="mt-1 text-xs text-slate-400">Latest activity from your store</p>
        </div>

        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 hover:text-violet-700"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <ShoppingBag className="mx-auto h-7 w-7 text-slate-300" />

          <p className="mt-3 text-sm font-medium text-slate-600">No orders yet</p>

          <p className="mt-1 text-xs text-slate-400">
            Orders will appear here once customers place them.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Order
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Customer
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Total
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id} className="transition hover:bg-slate-50/50">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-sm font-semibold text-slate-800 hover:text-violet-700"
                      >
                        {order.orderNumber || "—"}
                      </Link>
                    </td>

                    <td className="px-5 py-4">
                      <p className="max-w-[180px] truncate text-sm font-medium text-slate-700">
                        {order.customerName}
                      </p>

                      <p className="mt-0.5 max-w-[180px] truncate text-xs text-slate-400">
                        {order.customerEmail}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                      {formatCurrency(order.total)}
                    </td>

                    <td className="px-5 py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>

                    <td className="px-5 py-4 text-right text-xs text-slate-400">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-slate-100 md:hidden">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block p-4 transition hover:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {order.orderNumber || "Order"}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-400">{order.customerName}</p>
                  </div>

                  <OrderStatusBadge status={order.status} />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-800">
                    {formatCurrency(order.total)}
                  </span>

                  <span className="text-xs text-slate-400">{formatDate(order.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    confirmed: "bg-blue-50 text-blue-700",
    processing: "bg-violet-50 text-violet-700",
    shipped: "bg-indigo-50 text-indigo-700",
    delivered: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-red-50 text-red-600",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold ${
        styles[status] ?? "bg-slate-100 text-slate-500"
      }`}
    >
      {formatStatus(status)}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Low Stock                                                                  */
/* -------------------------------------------------------------------------- */

function LowStockProducts({ products }: { products: DashboardData["lowStockProducts"] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.035)]">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">
        <div>
          <h2 className="font-[Poppins] text-base font-semibold text-slate-900">Low Stock</h2>

          <p className="mt-1 text-xs text-slate-400">Products that need attention</p>
        </div>

        <Link
          href="/admin/products"
          className="text-xs font-semibold text-violet-600 hover:text-violet-700"
        >
          Products
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <CheckCircle2 className="mx-auto h-7 w-7 text-emerald-400" />

          <p className="mt-3 text-sm font-medium text-slate-600">Inventory looks healthy</p>

          <p className="mt-1 text-xs text-slate-400">
            No active products are currently low on stock.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/admin/products/${product.id}`}
              className="flex items-center gap-3 p-4 transition hover:bg-slate-50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                {product.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-4 w-4 text-slate-300" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">{product.name}</p>

                <p className="mt-0.5 truncate text-[11px] text-slate-400">
                  {product.sku || "No SKU"}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p
                  className={`text-sm font-bold ${
                    product.stock === 0 ? "text-red-600" : "text-amber-600"
                  }`}
                >
                  {product.stock}
                </p>

                <p className="text-[10px] text-slate-400">
                  {product.stock === 1 ? "left" : "left"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Quick Actions                                                              */
/* -------------------------------------------------------------------------- */

function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-[0_8px_25px_rgba(15,23,42,0.05)]"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition-colors group-hover:bg-violet-50 group-hover:text-violet-600">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800">{title}</p>

        <p className="mt-0.5 text-xs text-slate-400">{description}</p>
      </div>

      <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-violet-500" />
    </Link>
  );
}

/* -------------------------------------------------------------------------- */
/* Skeleton                                                                   */
/* -------------------------------------------------------------------------- */

function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 rounded-2xl bg-white" />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="h-[370px] rounded-2xl bg-white" />

        <div className="h-[370px] rounded-2xl bg-white" />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-20 rounded-xl bg-white" />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
        <div className="h-[400px] rounded-2xl bg-white" />

        <div className="h-[400px] rounded-2xl bg-white" />
      </div>
    </div>
  );
}
