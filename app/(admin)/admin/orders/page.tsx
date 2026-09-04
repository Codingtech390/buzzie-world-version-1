"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowUpDown,
  ChevronDown,
  ClipboardList,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type OrderStatus =
  | "pending"
  | "processing"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

type Order = {
  _id?: string;
  id?: string;
  orderNumber?: string;
  status?: OrderStatus | string;
  paymentStatus?: PaymentStatus | string;
  total?: number;
  subtotal?: number;
  shipping?: number;
  shippingCost?: number;
  tax?: number;
  currency?: string;
  customer?: {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
  };
  user?: {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
  };
  customerName?: string;
  customerEmail?: string;
  items?: Array<{
    quantity?: number;
    product?: {
      name?: string;
    };
  }>;
  createdAt?: string;
  updatedAt?: string;
};

type OrdersResponse = {
  success?: boolean;
  data?:
    | Order[]
    | {
        orders?: Order[];
        pagination?: {
          page?: number;
          limit?: number;
          total?: number;
          totalPages?: number;
        };
      };
  orders?: Order[];
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  message?: string;
};

type StatusFilter =
  | "all"
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

type PaymentFilter =
  | "all"
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");
  const [paymentFilter, setPaymentFilter] =
    useState<PaymentFilter>("all");

  const [sortDirection, setSortDirection] =
    useState<"newest" | "oldest">("newest");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/orders", {
        method: "GET",
        cache: "no-store",
      });

      const result: OrdersResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load orders."
        );
      }

      setOrders(extractOrders(result));
    } catch (err) {
      console.error("Failed to fetch orders:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading orders."
      );

      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Intentional initial data synchronization.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = orders.filter((order) => {
      const orderNumber =
        order.orderNumber?.toLowerCase() || "";

      const id = order._id?.toLowerCase() || order.id?.toLowerCase() || "";

      const customerName = getCustomerName(order).toLowerCase();

      const customerEmail =
        getCustomerEmail(order).toLowerCase();

      const matchesSearch =
        !query ||
        orderNumber.includes(query) ||
        id.includes(query) ||
        customerName.includes(query) ||
        customerEmail.includes(query);

      const status =
        order.status?.toLowerCase() || "pending";

      const paymentStatus =
        order.paymentStatus?.toLowerCase() || "pending";

      const matchesStatus =
        statusFilter === "all" ||
        status === statusFilter;

      const matchesPayment =
        paymentFilter === "all" ||
        paymentStatus === paymentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment
      );
    });

    return result.sort((a, b) => {
      const aDate = new Date(
        a.createdAt || 0
      ).getTime();

      const bDate = new Date(
        b.createdAt || 0
      ).getTime();

      return sortDirection === "newest"
        ? bDate - aDate
        : aDate - bDate;
    });
  }, [
    orders,
    search,
    statusFilter,
    paymentFilter,
    sortDirection,
  ]);

  const pendingCount = orders.filter((order) =>
    ["pending", "processing", "confirmed"].includes(
      order.status?.toLowerCase() || "pending"
    )
  ).length;

  const shippedCount = orders.filter(
    (order) =>
      order.status?.toLowerCase() === "shipped"
  ).length;

  const deliveredCount = orders.filter(
    (order) =>
      order.status?.toLowerCase() === "delivered"
  ).length;

  const totalRevenue = orders.reduce(
    (sum, order) => sum + getOrderTotal(order),
    0
  );

  return (
    <div className="min-h-full bg-[#FCFAF7]">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-violet-600">
              <ClipboardList className="h-4 w-4" />

              <span>Sales</span>

              <span className="text-slate-300">/</span>

              <span className="text-slate-500">
                Orders
              </span>
            </div>

            <h1 className="font-[Poppins] text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Orders
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
              View, track, and manage orders placed through
              your BuzzieWorld storefront.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchOrders}
            disabled={loading}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />

            Refresh Orders
          </button>
        </div>

        {/* Summary */}
        <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <SummaryCard
            icon={ClipboardList}
            label="Total Orders"
            value={loading ? "—" : orders.length.toString()}
          />

          <SummaryCard
            icon={Loader2}
            label="Needs Attention"
            value={
              loading ? "—" : pendingCount.toString()
            }
            iconClassName="text-amber-600"
            iconBackground="bg-amber-50"
          />

          <SummaryCard
            icon={ShoppingBag}
            label="Shipped"
            value={
              loading ? "—" : shippedCount.toString()
            }
            iconClassName="text-blue-600"
            iconBackground="bg-blue-50"
          />

          <SummaryCard
            icon={ShoppingBag}
            label="Revenue"
            value={
              loading
                ? "—"
                : formatCurrency(totalRevenue)
            }
            iconClassName="text-emerald-600"
            iconBackground="bg-emerald-50"
          />
        </div>

        {/* Main card */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.035)]">
          {/* Toolbar */}
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              {/* Search */}
              <div className="relative w-full xl:max-w-md">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search order number or customer..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <FilterSelect
                  value={statusFilter}
                  onChange={(value) =>
                    setStatusFilter(
                      value as StatusFilter
                    )
                  }
                  options={[
                    ["all", "All statuses"],
                    ["pending", "Pending"],
                    ["processing", "Processing"],
                    ["shipped", "Shipped"],
                    ["delivered", "Delivered"],
                    ["cancelled", "Cancelled"],
                  ]}
                />

                <FilterSelect
                  value={paymentFilter}
                  onChange={(value) =>
                    setPaymentFilter(
                      value as PaymentFilter
                    )
                  }
                  options={[
                    ["all", "All payments"],
                    ["pending", "Payment pending"],
                    ["paid", "Paid"],
                    ["failed", "Failed"],
                    ["refunded", "Refunded"],
                  ]}
                />

                <button
                  type="button"
                  onClick={() =>
                    setSortDirection((current) =>
                      current === "newest"
                        ? "oldest"
                        : "newest"
                    )
                  }
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50"
                >
                  <ArrowUpDown className="h-4 w-4" />

                  <span className="hidden sm:inline">
                    {sortDirection === "newest"
                      ? "Newest"
                      : "Oldest"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="m-4 rounded-xl border border-red-100 bg-red-50 p-4 sm:m-5">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-red-500 shadow-sm">
                  <AlertCircle className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-red-800">
                    Unable to load orders
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-600">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={fetchOrders}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 hover:text-red-800"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && !error && (
            <div className="divide-y divide-slate-100">
              {Array.from({ length: 6 }).map(
                (_, index) => (
                  <OrderSkeleton key={index} />
                )
              )}
            </div>
          )}

          {/* Empty */}
          {!loading &&
            !error &&
            filteredOrders.length === 0 && (
              <div className="flex min-h-[380px] flex-col items-center justify-center px-6 py-12 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-500">
                  {search ||
                  statusFilter !== "all" ||
                  paymentFilter !== "all" ? (
                    <Search className="h-6 w-6" />
                  ) : (
                    <ClipboardList className="h-6 w-6" />
                  )}
                </div>

                <h2 className="font-[Poppins] text-base font-semibold text-slate-900">
                  {search ||
                  statusFilter !== "all" ||
                  paymentFilter !== "all"
                    ? "No orders found"
                    : "No orders yet"}
                </h2>

                <p className="mt-1.5 max-w-sm text-sm leading-6 text-slate-500">
                  {search ||
                  statusFilter !== "all" ||
                  paymentFilter !== "all"
                    ? "Try changing your search or filters."
                    : "Orders placed through your storefront will appear here."}
                </p>

                {(search ||
                  statusFilter !== "all" ||
                  paymentFilter !== "all") && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("all");
                      setPaymentFilter("all");
                    }}
                    className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}

          {/* Desktop table */}
          {!loading &&
            !error &&
            filteredOrders.length > 0 && (
              <>
                <div className="hidden md:block">
                  <div className="grid grid-cols-[1.3fr_1.3fr_100px_130px_120px_50px] gap-4 border-b border-slate-100 bg-slate-50/50 px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400 lg:px-6">
                    <span>Order</span>
                    <span>Customer</span>
                    <span>Items</span>
                    <span>Total</span>
                    <span>Status</span>
                    <span />
                  </div>

                  <div className="divide-y divide-slate-100">
                    {filteredOrders.map((order) => (
                      <OrderRow
                        key={getOrderId(order)}
                        order={order}
                      />
                    ))}
                  </div>
                </div>

                {/* Mobile cards */}
                <div className="divide-y divide-slate-100 md:hidden">
                  {filteredOrders.map((order) => (
                    <MobileOrderCard
                      key={getOrderId(order)}
                      order={order}
                    />
                  ))}
                </div>

                <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/30 px-4 py-3.5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-5 lg:px-6">
                  <span>
                    Showing{" "}
                    <span className="font-semibold text-slate-600">
                      {filteredOrders.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-600">
                      {orders.length}
                    </span>{" "}
                    orders
                  </span>

                  <span>
                    {deliveredCount} delivered
                  </span>
                </div>
              </>
            )}
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   Desktop Order Row
========================================================= */

function OrderRow({ order }: { order: Order }) {
  const orderId = getOrderId(order);

  return (
    <div className="group grid grid-cols-[1.3fr_1.3fr_100px_130px_120px_50px] items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50/50 lg:px-6">
      <div className="min-w-0">
        <Link
          href={`/admin/orders/${orderId}`}
          className="text-sm font-semibold text-slate-800 hover:text-violet-600"
        >
          {getOrderNumber(order)}
        </Link>

        <p className="mt-1 text-xs text-slate-400">
          {formatDate(order.createdAt)}
        </p>
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-700">
          {getCustomerName(order)}
        </p>

        <p className="mt-1 truncate text-xs text-slate-400">
          {getCustomerEmail(order) || "No email"}
        </p>
      </div>

      <div className="text-sm font-medium text-slate-600">
        {getItemCount(order)}
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-800">
          {formatCurrency(getOrderTotal(order), order.currency)}
        </p>

        <p className="mt-1 text-[10px] font-medium text-slate-400">
          {formatPaymentStatus(order.paymentStatus)}
        </p>
      </div>

      <StatusBadge status={order.status} />

      <Link
        href={`/admin/orders/${orderId}`}
        aria-label={`View ${getOrderNumber(order)}`}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-violet-50 hover:text-violet-600"
      >
        <Eye className="h-4 w-4" />
      </Link>
    </div>
  );
}

/* =========================================================
   Mobile Order Card
========================================================= */

function MobileOrderCard({ order }: { order: Order }) {
  const orderId = getOrderId(order);

  return (
    <Link
      href={`/admin/orders/${orderId}`}
      className="block p-4 transition-colors hover:bg-slate-50/60"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">
            {getOrderNumber(order)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {formatDate(order.createdAt)}
          </p>
        </div>

        <StatusBadge status={order.status} />
      </div>

      <div className="mt-4">
        <p className="truncate text-sm font-medium text-slate-700">
          {getCustomerName(order)}
        </p>

        <p className="mt-1 truncate text-xs text-slate-400">
          {getCustomerEmail(order) || "No email"}
        </p>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-xs text-slate-400">
            {getItemCount(order)}{" "}
            {getItemCount(order) === 1
              ? "item"
              : "items"}
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-800">
            {formatCurrency(
              getOrderTotal(order),
              order.currency
            )}
          </p>
        </div>

        <span className="text-xs font-semibold text-violet-600">
          View order →
        </span>
      </div>
    </Link>
  );
}

/* =========================================================
   UI Components
========================================================= */

function SummaryCard({
  icon: Icon,
  label,
  value,
  iconClassName = "text-violet-600",
  iconBackground = "bg-violet-50",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  iconClassName?: string;
  iconBackground?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_3px_18px_rgba(15,23,42,0.025)] sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBackground} ${iconClassName}`}
        >
          <Icon className="h-[18px] w-[18px]" />
        </div>

        <p className="truncate text-right font-[Poppins] text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
          {value}
        </p>
      </div>

      <p className="mt-4 text-xs font-medium text-slate-400">
        {label}
      </p>
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="h-10 max-w-[180px] appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-9 text-sm font-medium text-slate-600 outline-none transition-all hover:border-slate-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-500/10"
      >
        {options.map(([optionValue, label]) => (
          <option
            key={optionValue}
            value={optionValue}
          >
            {label}
          </option>
        ))}
      </select>

      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status?: string;
}) {
  const normalized =
    status?.toLowerCase() || "pending";

  const styles: Record<
    string,
    string
  > = {
    pending:
      "bg-amber-50 text-amber-700",
    processing:
      "bg-blue-50 text-blue-700",
    confirmed:
      "bg-blue-50 text-blue-700",
    shipped:
      "bg-indigo-50 text-indigo-700",
    delivered:
      "bg-emerald-50 text-emerald-700",
    cancelled:
      "bg-red-50 text-red-600",
    refunded:
      "bg-slate-100 text-slate-600",
  };

  const dotStyles: Record<
    string,
    string
  > = {
    pending: "bg-amber-500",
    processing: "bg-blue-500",
    confirmed: "bg-blue-500",
    shipped: "bg-indigo-500",
    delivered: "bg-emerald-500",
    cancelled: "bg-red-500",
    refunded: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
        styles[normalized] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          dotStyles[normalized] ||
          "bg-slate-400"
        }`}
      />

      {capitalize(normalized)}
    </span>
  );
}

function OrderSkeleton() {
  return (
    <div className="grid grid-cols-[1.3fr_1.3fr_100px_130px_120px_50px] items-center gap-4 px-5 py-4 lg:px-6">
      <div>
        <div className="h-3.5 w-24 animate-pulse rounded bg-slate-100" />
        <div className="mt-2 h-2.5 w-20 animate-pulse rounded bg-slate-100" />
      </div>

      <div>
        <div className="h-3.5 w-28 animate-pulse rounded bg-slate-100" />
        <div className="mt-2 h-2.5 w-36 animate-pulse rounded bg-slate-100" />
      </div>

      <div className="h-3 w-10 animate-pulse rounded bg-slate-100" />

      <div>
        <div className="h-3.5 w-20 animate-pulse rounded bg-slate-100" />
        <div className="mt-2 h-2.5 w-14 animate-pulse rounded bg-slate-100" />
      </div>

      <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />

      <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-100" />
    </div>
  );
}

/* =========================================================
   Helpers
========================================================= */

function extractOrders(
  result: OrdersResponse
): Order[] {
  if (Array.isArray(result.orders)) {
    return result.orders;
  }

  if (Array.isArray(result.data)) {
    return result.data;
  }

  if (
    result.data &&
    !Array.isArray(result.data) &&
    Array.isArray(result.data.orders)
  ) {
    return result.data.orders;
  }

  return [];
}

function getOrderId(order: Order) {
  return (
    order._id ||
    order.id ||
    order.orderNumber ||
    "unknown"
  );
}

function getOrderNumber(order: Order) {
  return (
    order.orderNumber ||
    (order._id
      ? `#${order._id.slice(-8).toUpperCase()}`
      : order.id
        ? `#${order.id.slice(-8).toUpperCase()}`
        : "#ORDER")
  );
}

function getCustomerName(order: Order) {
  return (
    order.customer?.name ||
    order.user?.name ||
    order.customerName ||
    "Guest Customer"
  );
}

function getCustomerEmail(order: Order) {
  return (
    order.customer?.email ||
    order.user?.email ||
    order.customerEmail ||
    ""
  );
}

function getItemCount(order: Order) {
  return (
    order.items?.reduce(
      (total, item) =>
        total + (item.quantity || 0),
      0
    ) || 0
  );
}

function getOrderTotal(order: Order) {
  return Number(
    order.total ??
      order.subtotal ??
      0
  );
}

function formatPaymentStatus(
  status?: string
) {
  if (!status) {
    return "Payment pending";
  }

  return capitalize(status);
}

function formatCurrency(
  amount: number,
  currency = "INR"
) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date?: string) {
  if (!date) {
    return "Date unavailable";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
