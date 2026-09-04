
"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  FolderTree,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Tag,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Category = {
  _id?: string;
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  status?: string;
  isActive?: boolean;
  active?: boolean;
  productCount?: number;
  productsCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

type CategoriesResponse = {
  success?: boolean;
  data?: Category[] | { categories?: Category[] };
  categories?: Category[];
  message?: string;
};

type FilterStatus = "all" | "active" | "inactive";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/categories", {
        method: "GET",
        cache: "no-store",
      });

      const result: CategoriesResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to load categories."
        );
      }

      const extractedCategories = extractCategories(result);

      setCategories(extractedCategories);
    } catch (err) {
      console.error("Failed to fetch categories:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading categories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Intentional initial data synchronization.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return categories.filter((category) => {
      const name = category.name?.toLowerCase() || "";
      const slug = category.slug?.toLowerCase() || "";
      const description = category.description?.toLowerCase() || "";

      const matchesSearch =
        !normalizedSearch ||
        name.includes(normalizedSearch) ||
        slug.includes(normalizedSearch) ||
        description.includes(normalizedSearch);

      const active = getCategoryActiveState(category);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && active) ||
        (statusFilter === "inactive" && !active);

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  const activeCount = categories.filter((category) =>
    getCategoryActiveState(category)
  ).length;

  const inactiveCount = categories.length - activeCount;

  return (
    <div className="min-h-full bg-[#FCFAF7]">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header */}
        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-violet-600">
              <FolderTree className="h-4 w-4" />
              <span>Catalog</span>

              <span className="text-slate-300">/</span>

              <span className="text-slate-500">Categories</span>
            </div>

            <h1 className="font-[Poppins] text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Categories
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
              Organize your BuzzieWorld products into clear, easy-to-browse
              categories.
            </p>
          </div>

          <Link
            href="/admin/categories/new"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(124,58,237,0.18)] transition-all hover:bg-violet-700 hover:shadow-[0_8px_22px_rgba(124,58,237,0.24)]"
          >
            <Plus className="h-4 w-4 text-white" />
            Add Category
          </Link>
        </div>

        {/* Summary */}
        <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SummaryCard
            icon={FolderTree}
            label="Total Categories"
            value={loading ? "—" : categories.length.toString()}
          />

          <SummaryCard
            icon={CheckCircle2}
            label="Active"
            value={loading ? "—" : activeCount.toString()}
            iconClassName="text-emerald-600"
            iconBackground="bg-emerald-50"
          />

          <SummaryCard
            icon={XCircle}
            label="Inactive"
            value={loading ? "—" : inactiveCount.toString()}
            iconClassName="text-slate-500"
            iconBackground="bg-slate-100"
          />
        </div>

        {/* Main card */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_4px_24px_rgba(15,23,42,0.035)]">
          {/* Toolbar */}
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <div className="relative w-full lg:max-w-md">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search categories..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-10 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label="Clear search"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value as FilterStatus)
                    }
                    className="h-10 appearance-none rounded-xl border border-slate-200 bg-white pl-3.5 pr-9 text-sm font-medium text-slate-600 outline-none transition-all hover:border-slate-300 focus:border-violet-300 focus:ring-4 focus:ring-violet-500/10"
                  >
                    <option value="all">All statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                </div>

                <button
                  type="button"
                  onClick={fetchCategories}
                  disabled={loading}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                  />
                  <span className="hidden sm:inline">Refresh</span>
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
                    Unable to load categories
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-600">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={fetchCategories}
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
              {Array.from({ length: 5 }).map((_, index) => (
                <CategorySkeleton key={index} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredCategories.length === 0 && (
            <div className="flex min-h-[360px] flex-col items-center justify-center px-6 py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-500">
                {search ? (
                  <Search className="h-6 w-6" />
                ) : (
                  <FolderTree className="h-6 w-6" />
                )}
              </div>

              <h2 className="font-[Poppins] text-base font-semibold text-slate-900">
                {search || statusFilter !== "all"
                  ? "No categories found"
                  : "No categories yet"}
              </h2>

              <p className="mt-1.5 max-w-sm text-sm leading-6 text-slate-500">
                {search || statusFilter !== "all"
                  ? "Try changing your search or filter to find what you're looking for."
                  : "Create your first category to start organizing your products."}
              </p>

              {search || statusFilter !== "all" ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("all");
                  }}
                  className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50"
                >
                  Clear filters
                </button>
              ) : (
                <Link
                  href="/admin/categories/new"
                  className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-violet-600 px-3.5 text-xs font-semibold text-white hover:bg-violet-700"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Create Category
                </Link>
              )}
            </div>
          )}

          {/* Categories */}
          {!loading && !error && filteredCategories.length > 0 && (
            <>
              {/* Desktop header */}
              <div className="hidden grid-cols-[minmax(240px,1.7fr)_minmax(150px,1fr)_120px_70px] gap-4 border-b border-slate-100 bg-slate-50/50 px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400 md:grid lg:px-6">
                <span>Category</span>
                <span>Products</span>
                <span>Status</span>
                <span />
              </div>

              <div className="divide-y divide-slate-100">
                {filteredCategories.map((category) => {
                  const categoryId = getCategoryId(category);
                  const active = getCategoryActiveState(category);
                  const productCount = getProductCount(category);

                  return (
                    <div
                      key={categoryId}
                      className="group relative px-4 py-4 transition-colors hover:bg-slate-50/50 sm:px-5 lg:px-6"
                    >
                      {/* Desktop */}
                      <div className="hidden grid-cols-[minmax(240px,1.7fr)_minmax(150px,1fr)_120px_70px] items-center gap-4 md:grid">
                        <CategoryIdentity category={category} />

                        <div>
                          <span className="text-sm font-medium text-slate-600">
                            {productCount}
                          </span>

                          <span className="ml-1 text-xs text-slate-400">
                            {productCount === 1 ? "product" : "products"}
                          </span>
                        </div>

                        <StatusBadge active={active} />

                        <div className="flex justify-end">
                          <ActionMenu
                            categoryId={categoryId}
                            openMenu={openMenu}
                            setOpenMenu={setOpenMenu}
                          />
                        </div>
                      </div>

                      {/* Mobile */}
                      <div className="flex items-start gap-3 md:hidden">
                        <CategoryIdentity category={category} />

                        <div className="relative ml-auto">
                          <ActionMenu
                            categoryId={categoryId}
                            openMenu={openMenu}
                            setOpenMenu={setOpenMenu}
                          />
                        </div>
                      </div>

                      {/* Mobile metadata */}
                      <div className="mt-3 flex items-center gap-3 pl-[52px] md:hidden">
                        <StatusBadge active={active} />

                        <span className="text-xs text-slate-400">
                          {productCount}{" "}
                          {productCount === 1 ? "product" : "products"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/30 px-4 py-3.5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-5 lg:px-6">
                <span>
                  Showing{" "}
                  <span className="font-semibold text-slate-600">
                    {filteredCategories.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-600">
                    {categories.length}
                  </span>{" "}
                  categories
                </span>

                {search && (
                  <span>
                    Filtered by{" "}
                    <span className="font-medium text-slate-600">
                      "{search}"
                    </span>
                  </span>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   Components
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
      <div className="flex items-center justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBackground} ${iconClassName}`}
        >
          <Icon className="h-[18px] w-[18px]" />
        </div>

        <p className="font-[Poppins] text-2xl font-semibold tracking-tight text-slate-900">
          {value}
        </p>
      </div>

      <p className="mt-4 text-xs font-medium text-slate-400">{label}</p>
    </div>
  );
}

function CategoryIdentity({ category }: { category: Category }) {
  const image = category.image || category.imageUrl;

  return (
    <div className="flex min-w-0 items-center gap-3.5">
      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
        {image ? (
          <img
            src={image}
            alt={category.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-violet-400">
            <FolderTree className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-800">
          {category.name}
        </p>

        {category.slug && (
          <p className="mt-0.5 truncate text-xs text-slate-400">
            /{category.slug}
          </p>
        )}

        {category.description && (
          <p className="mt-1 hidden max-w-md truncate text-xs text-slate-400 lg:block">
            {category.description}
          </p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-500"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-slate-400"
        }`}
      />

      {active ? "Active" : "Inactive"}
    </span>
  );
}

function ActionMenu({
  categoryId,
  openMenu,
  setOpenMenu,
}: {
  categoryId: string;
  openMenu: string | null;
  setOpenMenu: (id: string | null) => void;
}) {
  const isOpen = openMenu === categoryId;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpenMenu(isOpen ? null : categoryId)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        aria-label="Category actions"
        aria-expanded={isOpen}
      >
        <MoreHorizontal className="h-[18px] w-[18px]" />
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-10 cursor-default"
            onClick={() => setOpenMenu(null)}
          />

          <div className="absolute right-0 top-10 z-20 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_12px_35px_rgba(15,23,42,0.12)]">
            <Link
              href={`/admin/categories/${categoryId}/edit`}
              onClick={() => setOpenMenu(null)}
              className="flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <Pencil className="h-3.5 w-3.5" />
              Edit category
            </Link>

            <button
              type="button"
              onClick={() => {
                setOpenMenu(null);
                console.log("Delete category:", categoryId);
              }}
              className="flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-xs font-medium text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete category
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function CategorySkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-4 sm:px-5 lg:px-6">
      <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-slate-100" />

      <div className="flex-1">
        <div className="h-3.5 w-32 animate-pulse rounded bg-slate-100" />
        <div className="mt-2 h-2.5 w-20 animate-pulse rounded bg-slate-100" />
      </div>

      <div className="hidden h-3 w-20 animate-pulse rounded bg-slate-100 sm:block" />

      <div className="h-6 w-16 animate-pulse rounded-full bg-slate-100" />

      <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-100" />
    </div>
  );
}

/* =========================================================
   Helpers
========================================================= */

function extractCategories(result: CategoriesResponse): Category[] {
  if (Array.isArray(result.categories)) {
    return result.categories;
  }

  if (Array.isArray(result.data)) {
    return result.data;
  }

  if (
    result.data &&
    !Array.isArray(result.data) &&
    Array.isArray(result.data.categories)
  ) {
    return result.data.categories;
  }

  return [];
}

function getCategoryId(category: Category) {
  return category._id || category.id || category.slug || category.name;
}

function getCategoryActiveState(category: Category) {
  if (typeof category.isActive === "boolean") {
    return category.isActive;
  }

  if (typeof category.active === "boolean") {
    return category.active;
  }

  if (typeof category.status === "string") {
    return category.status.toLowerCase() === "active";
  }

  // If the existing API doesn't expose a status field,
  // treat the category as active rather than inventing state.
  return true;
}

function getProductCount(category: Category) {
  return category.productCount ?? category.productsCount ?? 0;
}
