"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  AlertCircle,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Eye,
  Mail,
  MapPin,
  MoreHorizontal,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  UserRound,
  UserX,
  X,
} from "lucide-react";

type Address = {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin" | string;
  image: string;
  isActive: boolean;
  emailVerified: string | null;
  addresses: Address[];
  createdAt: string | null;
  updatedAt: string | null;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type CustomersResponse = {
  success: boolean;
  data: Customer[];
  pagination: Pagination;
  message?: string;
};

const PAGE_SIZE = 20;

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

function formatDateTime(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "C";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function getAvatarClass(name: string) {
  const classes = [
    "bg-violet-100 text-violet-700",
    "bg-fuchsia-100 text-fuchsia-700",
    "bg-indigo-100 text-indigo-700",
    "bg-purple-100 text-purple-700",
    "bg-pink-100 text-pink-700",
  ];

  let hash = 0;

  for (let index = 0; index < name.length; index++) {
    hash = name.charCodeAt(index) + ((hash << 5) - hash);
  }

  return classes[Math.abs(hash) % classes.length];
}

function getAddressLabel(address: Address) {
  return [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchCustomers = useCallback(
    async (showRefreshState = false) => {
      try {
        if (showRefreshState) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const params = new URLSearchParams();

        params.set("page", String(page));
        params.set("limit", String(PAGE_SIZE));

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (status !== "all") {
          params.set("status", status);
        }

        const response = await fetch(`/api/customers?${params.toString()}`, {
          method: "GET",
          cache: "no-store",
        });

        const raw = await response.text();

        let result: CustomersResponse | null = null;

        try {
          result = raw ? JSON.parse(raw) : null;
        } catch {
          throw new Error(`Server returned an invalid response (${response.status})`);
        }

        if (!response.ok || !result?.success) {
          throw new Error(result?.message || `Failed to load customers (${response.status})`);
        }

        setCustomers(Array.isArray(result.data) ? result.data : []);

        setPagination(
          result.pagination || {
            page,
            limit: PAGE_SIZE,
            total: 0,
            totalPages: 0,
          },
        );
      } catch (err) {
        console.error("Customers fetch error:", err);

        setError(err instanceof Error ? err.message : "Failed to load customers");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, search, status],
  );

  useEffect(() => {
    const timeout = window.setTimeout(
      () => {
        fetchCustomers();
      },
      search.trim() ? 350 : 0,
    );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [fetchCustomers]);

  // useEffect(() => {
  //   setPage(1);
  // }, [status]);

  const handleStatusChange = async (customer: Customer) => {
    try {
      setUpdatingId(customer.id);

      const response = await fetch("/api/customers", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: customer.id,
          isActive: !customer.isActive,
        }),
      });

      const raw = await response.text();

      let result: {
        success: boolean;
        data?: Customer;
        message?: string;
      } | null = null;

      try {
        result = raw ? JSON.parse(raw) : null;
      } catch {
        throw new Error(`Server returned an invalid response (${response.status})`);
      }

      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Failed to update customer");
      }

      if (result.data) {
        setCustomers((current) =>
          current.map((item) => (item.id === customer.id ? result.data! : item)),
        );

        setSelectedCustomer((current) => (current?.id === customer.id ? result.data! : current));
      }
    } catch (err) {
      console.error("Customer status update error:", err);

      window.alert(err instanceof Error ? err.message : "Failed to update customer");
    } finally {
      setUpdatingId(null);
    }
  };

  const statistics = useMemo(() => {
    const activeOnCurrentPage = customers.filter((customer) => customer.isActive).length;

    const inactiveOnCurrentPage = customers.filter((customer) => !customer.isActive).length;

    const verifiedOnCurrentPage = customers.filter((customer) =>
      Boolean(customer.emailVerified),
    ).length;

    const withAddressesOnCurrentPage = customers.filter(
      (customer) => customer.addresses.length > 0,
    ).length;

    return {
      total: pagination.total,
      activeOnCurrentPage,
      inactiveOnCurrentPage,
      verifiedOnCurrentPage,
      withAddressesOnCurrentPage,
    };
  }, [customers, pagination.total]);

  const showingFrom = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;

  const showingTo = Math.min(pagination.page * pagination.limit, pagination.total);

  const canGoPrevious = pagination.page > 1;
  const canGoNext = pagination.totalPages > 0 && pagination.page < pagination.totalPages;

  return (
    <div className="min-h-screen bg-[#FCFAF7]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-violet-600">
              <UserRound className="h-4 w-4" />
              <span>Customer Management</span>
            </div>

            <h1 className="font-[var(--font-poppins)] text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Customers
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-500">
              Manage your BuzzieWorld customers, account status, contact details and saved
              addresses.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fetchCustomers(true)}
            disabled={loading || refreshing}
            className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-60 lg:self-auto"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<CircleUserRound className="h-5 w-5" />}
            label="Total Customers"
            value={pagination.total}
            description="Registered customer accounts"
          />

          <StatCard
            icon={<UserCheck className="h-5 w-5" />}
            label="Active"
            value={statistics.activeOnCurrentPage}
            description="Active on current page"
          />

          <StatCard
            icon={<ShieldCheck className="h-5 w-5" />}
            label="Email Verified"
            value={statistics.verifiedOnCurrentPage}
            description="Verified on current page"
          />

          <StatCard
            icon={<MapPin className="h-5 w-5" />}
            label="With Addresses"
            value={statistics.withAddressesOnCurrentPage}
            description="Saved addresses on page"
          />
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          {/* Toolbar */}
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="relative w-full xl:max-w-md">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, email or phone..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-11 rounded-xl border border-slate-200 bg-slate-50 p-1">
                  {(
                    [
                      ["all", "All"],
                      ["active", "Active"],
                      ["inactive", "Inactive"],
                    ] as const
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setStatus(value)}
                      className={`rounded-lg px-3 text-xs font-medium transition sm:px-4 sm:text-sm ${
                        status === value
                          ? "bg-white text-violet-700 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="m-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:m-5">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

              <div className="min-w-0 flex-1">
                <p className="font-semibold">Unable to load customers</p>

                <p className="mt-1 text-red-600">{error}</p>

                <button
                  type="button"
                  onClick={() => fetchCustomers()}
                  className="mt-3 font-semibold underline underline-offset-2"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && !error ? (
            <CustomerTableSkeleton />
          ) : !error && customers.length === 0 ? (
            <EmptyState
              hasSearch={Boolean(search.trim())}
              onClear={() => {
                setSearch("");
                setStatus("all");
              }}
            />
          ) : !error ? (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/70">
                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Customer
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Contact
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Addresses
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Verification
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Joined
                      </th>

                      <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {customers.map((customer) => (
                      <CustomerRow
                        key={customer.id}
                        customer={customer}
                        updating={updatingId === customer.id}
                        onView={() => setSelectedCustomer(customer)}
                        onToggle={() => handleStatusChange(customer)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="divide-y divide-slate-100 lg:hidden">
                {customers.map((customer) => (
                  <MobileCustomerCard
                    key={customer.id}
                    customer={customer}
                    updating={updatingId === customer.id}
                    onView={() => setSelectedCustomer(customer)}
                    onToggle={() => handleStatusChange(customer)}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-xs text-slate-500 sm:text-sm">
                  Showing <span className="font-medium text-slate-700">{showingFrom}</span> to{" "}
                  <span className="font-medium text-slate-700">{showingTo}</span> of{" "}
                  <span className="font-medium text-slate-700">{pagination.total}</span> customers
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!canGoPrevious}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-violet-200 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-violet-50 px-3 text-sm font-semibold text-violet-700">
                    {pagination.page}
                  </div>

                  <button
                    type="button"
                    disabled={!canGoNext}
                    onClick={() => setPage((current) => current + 1)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-violet-200 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
        <CustomerDetailDrawer
          customer={selectedCustomer}
          updating={updatingId === selectedCustomer.id}
          onClose={() => setSelectedCustomer(null)}
          onToggle={() => handleStatusChange(selectedCustomer)}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function StatCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.03)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500">{label}</p>

          <p className="mt-2 font-[var(--font-poppins)] text-2xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">{description}</p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          {icon}
        </div>
      </div>
    </div>
  );
}

function CustomerAvatar({
  customer,
  size = "md",
}: {
  customer: Customer;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "lg" ? "h-16 w-16 text-lg" : size === "sm" ? "h-9 w-9 text-xs" : "h-11 w-11 text-sm";

  if (customer.image) {
    return (
      <div
        className={`${sizeClass} overflow-hidden rounded-full border border-slate-200 bg-slate-100`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={customer.image} alt={customer.name} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full font-semibold ${getAvatarClass(customer.name)}`}
    >
      {getInitials(customer.name)}
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500" : "bg-slate-400"}`} />

      {active ? "Active" : "Inactive"}
    </span>
  );
}

function CustomerRow({
  customer,
  updating,
  onView,
  onToggle,
}: {
  customer: Customer;
  updating: boolean;
  onView: () => void;
  onToggle: () => void;
}) {
  return (
    <tr className="group transition hover:bg-slate-50/60">
      <td className="px-5 py-4">
        <button type="button" onClick={onView} className="flex items-center gap-3 text-left">
          <CustomerAvatar customer={customer} size="md" />

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900 group-hover:text-violet-700">
              {customer.name || "Unnamed customer"}
            </p>

            <p className="mt-0.5 truncate text-xs text-slate-400">Customer</p>
          </div>
        </button>
      </td>

      <td className="px-5 py-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-slate-700">
            <Mail className="h-3.5 w-3.5 text-slate-400" />
            <span className="max-w-[220px] truncate">{customer.email || "—"}</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Phone className="h-3.5 w-3.5 text-slate-400" />
            <span>{customer.phone || "No phone"}</span>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <div>
          <p className="text-sm font-medium text-slate-700">{customer.addresses.length}</p>

          <p className="mt-0.5 text-xs text-slate-400">
            {customer.addresses.length === 1 ? "Saved address" : "Saved addresses"}
          </p>
        </div>
      </td>

      <td className="px-5 py-4">
        {customer.emailVerified ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
            <Check className="h-3.5 w-3.5" />
            Verified
          </span>
        ) : (
          <span className="text-xs font-medium text-slate-400">Not verified</span>
        )}
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
          {formatDate(customer.createdAt)}
        </div>
      </td>

      <td className="px-5 py-4">
        <StatusBadge active={customer.isActive} />
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={onView}
            title="View customer"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-violet-50 hover:text-violet-700"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onToggle}
            disabled={updating}
            title={customer.isActive ? "Deactivate customer" : "Activate customer"}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {updating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : customer.isActive ? (
              <UserX className="h-4 w-4" />
            ) : (
              <UserCheck className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={onView}
            title="More details"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function MobileCustomerCard({
  customer,
  updating,
  onView,
  onToggle,
}: {
  customer: Customer;
  updating: boolean;
  onView: () => void;
  onToggle: () => void;
}) {
  return (
    <div className="p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <CustomerAvatar customer={customer} size="md" />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <button
                type="button"
                onClick={onView}
                className="block max-w-full truncate text-left text-sm font-semibold text-slate-900"
              >
                {customer.name || "Unnamed customer"}
              </button>

              <p className="mt-0.5 truncate text-xs text-slate-400">{customer.email}</p>
            </div>

            <StatusBadge active={customer.isActive} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <InfoItem
              icon={<Phone className="h-3.5 w-3.5" />}
              label="Phone"
              value={customer.phone || "Not provided"}
            />

            <InfoItem
              icon={<MapPin className="h-3.5 w-3.5" />}
              label="Addresses"
              value={`${customer.addresses.length}`}
            />

            <InfoItem
              icon={<CalendarDays className="h-3.5 w-3.5" />}
              label="Joined"
              value={formatDate(customer.createdAt)}
            />

            <InfoItem
              icon={<ShieldCheck className="h-3.5 w-3.5" />}
              label="Email"
              value={customer.emailVerified ? "Verified" : "Not verified"}
            />
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={onView}
              className="flex h-9 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700"
            >
              <Eye className="h-3.5 w-3.5" />
              View details
            </button>

            <button
              type="button"
              onClick={onToggle}
              disabled={updating}
              className="flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              {updating ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : customer.isActive ? (
                <>
                  <UserX className="h-3.5 w-3.5" />
                  Disable
                </>
              ) : (
                <>
                  <UserCheck className="h-3.5 w-3.5" />
                  Activate
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
        {icon}
        {label}
      </div>

      <p className="mt-1 truncate text-xs font-medium text-slate-700">{value}</p>
    </div>
  );
}

function CustomerDetailDrawer({
  customer,
  updating,
  onClose,
  onToggle,
}: {
  customer: Customer;
  updating: boolean;
  onClose: () => void;
  onToggle: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close customer details"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-[#FCFAF7] shadow-2xl">
        {/* Drawer header */}
        <div className="border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-violet-600">
                Customer Profile
              </p>

              <h2 className="mt-1 font-[var(--font-poppins)] text-lg font-semibold text-slate-900">
                Customer details
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Drawer content */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6">
          {/* Profile */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-start gap-4">
              <CustomerAvatar customer={customer} size="lg" />

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-[var(--font-poppins)] text-lg font-semibold text-slate-900">
                    {customer.name || "Unnamed customer"}
                  </h3>

                  <StatusBadge active={customer.isActive} />
                </div>

                <p className="mt-1 break-all text-sm text-slate-500">
                  {customer.email || "No email"}
                </p>

                <p className="mt-1 text-sm text-slate-500">{customer.phone || "No phone number"}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5">
              <DetailValue label="Role" value={customer.role} />

              <DetailValue label="Customer ID" value={customer.id} mono />

              <DetailValue label="Joined" value={formatDateTime(customer.createdAt)} />

              <DetailValue label="Last updated" value={formatDateTime(customer.updatedAt)} />
            </div>
          </div>

          {/* Contact */}
          <DetailSection title="Contact information">
            <div className="grid gap-4 sm:grid-cols-2">
              <ContactDetail
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={customer.email || "Not provided"}
              />

              <ContactDetail
                icon={<Phone className="h-4 w-4" />}
                label="Phone"
                value={customer.phone || "Not provided"}
              />

              <ContactDetail
                icon={<ShieldCheck className="h-4 w-4" />}
                label="Email verification"
                value={
                  customer.emailVerified
                    ? `Verified ${formatDate(customer.emailVerified)}`
                    : "Not verified"
                }
              />
            </div>
          </DetailSection>

          {/* Addresses */}
          <DetailSection title="Saved addresses" count={customer.addresses.length}>
            {customer.addresses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
                <MapPin className="mx-auto h-5 w-5 text-slate-300" />

                <p className="mt-2 text-sm font-medium text-slate-600">No saved addresses</p>

                <p className="mt-1 text-xs text-slate-400">
                  This customer has not added an address yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {customer.addresses.map((address, index) => (
                  <div
                    key={address.id || `${customer.id}-address-${index}`}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                          <MapPin className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-slate-800">
                              {address.fullName || customer.name}
                            </p>

                            {address.isDefault && (
                              <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700">
                                Default
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-xs text-slate-500">
                            {address.phone || customer.phone || "No phone"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-lg bg-slate-50 p-3">
                      <p className="text-sm leading-6 text-slate-700">{getAddressLabel(address)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DetailSection>

          {/* Account */}
          <DetailSection title="Account information">
            <div className="grid gap-3 sm:grid-cols-2">
              <AccountStatus
                label="Account status"
                value={customer.isActive ? "Active" : "Inactive"}
                active={customer.isActive}
              />

              <AccountStatus
                label="Email status"
                value={customer.emailVerified ? "Verified" : "Unverified"}
                active={Boolean(customer.emailVerified)}
              />
            </div>
          </DetailSection>
        </div>

        {/* Drawer footer */}
        <div className="border-t border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="h-11 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Close
            </button>

            <button
              type="button"
              disabled={updating}
              onClick={onToggle}
              className={`h-11 flex-1 rounded-xl text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                customer.isActive
                  ? "bg-slate-900 text-white hover:bg-slate-800"
                  : "bg-violet-600 text-white hover:bg-violet-700"
              }`}
            >
              {updating ? (
                <span className="inline-flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Updating...
                </span>
              ) : customer.isActive ? (
                <span className="inline-flex items-center gap-2">
                  <UserX className="h-4 w-4" />
                  Deactivate Customer
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Activate Customer
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function DetailSection({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>

        {typeof count === "number" && (
          <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">
            {count}
          </span>
        )}
      </div>

      {children}
    </section>
  );
}

function DetailValue({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-slate-400">{label}</p>

      <p className={`mt-1 break-all text-xs font-medium text-slate-700 ${mono ? "font-mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function ContactDetail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-violet-600">
        {icon}
        <span className="text-xs font-semibold text-slate-500">{label}</span>
      </div>

      <p className="mt-2 break-words text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

function AccountStatus({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium text-slate-400">{label}</p>

      <div className="mt-2 flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${active ? "bg-emerald-500" : "bg-slate-400"}`} />

        <span className="text-sm font-semibold text-slate-800">{value}</span>
      </div>
    </div>
  );
}

function CustomerTableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="hidden lg:block">
        <div className="h-12 border-b border-slate-100 bg-slate-50" />

        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="flex items-center gap-5 border-b border-slate-100 px-5 py-5">
            <div className="h-11 w-11 shrink-0 rounded-full bg-slate-100" />

            <div className="w-48 space-y-2">
              <div className="h-3 w-28 rounded bg-slate-100" />
              <div className="h-2.5 w-16 rounded bg-slate-100" />
            </div>

            <div className="w-56 space-y-2">
              <div className="h-3 w-44 rounded bg-slate-100" />
              <div className="h-2.5 w-24 rounded bg-slate-100" />
            </div>

            <div className="h-8 w-16 rounded bg-slate-100" />

            <div className="h-8 w-20 rounded bg-slate-100" />

            <div className="h-8 w-20 rounded-full bg-slate-100" />

            <div className="ml-auto h-9 w-28 rounded bg-slate-100" />
          </div>
        ))}
      </div>

      <div className="lg:hidden">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex gap-3 border-b border-slate-100 p-5">
            <div className="h-11 w-11 rounded-full bg-slate-100" />

            <div className="flex-1 space-y-3">
              <div className="h-3 w-36 rounded bg-slate-100" />
              <div className="h-2.5 w-48 rounded bg-slate-100" />
              <div className="h-12 w-full rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ hasSearch, onClear }: { hasSearch: boolean; onClear: () => void }) {
  return (
    <div className="px-5 py-20 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-500">
        <CircleUserRound className="h-7 w-7" />
      </div>

      <h3 className="mt-5 font-[var(--font-poppins)] text-base font-semibold text-slate-900">
        {hasSearch ? "No customers found" : "No customers yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {hasSearch
          ? "Try changing your search or filters to find the customer you are looking for."
          : "Customer accounts will appear here once customers start registering."}
      </p>

      {hasSearch && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
