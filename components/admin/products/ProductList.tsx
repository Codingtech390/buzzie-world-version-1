"use client";

import type { Product } from "@/types/product";
import { useEffect, useState, type ChangeEvent } from "react";

import ProductDeleteDialog from "./ProductDeleteDialog";

interface PopulatedReference {
  _id: string;
  name: string;
  slug: string;
}

type ProductListItem = Omit<Product, "category" | "brand" | "collection"> & {
  category?: PopulatedReference;
  brand?: PopulatedReference;
  collection?: PopulatedReference;
};

interface ProductsResponse {
  success: boolean;
  products?: ProductListItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

interface SelectorItem {
  _id: string;
  name: string;
  slug: string;
}

function uniqueSelectorItems(items: SelectorItem[]): SelectorItem[] {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (!item?._id || seen.has(item._id)) {
      return false;
    }

    seen.add(item._id);
    return true;
  });
}

interface SelectorResponse {
  success: boolean;
  message?: string;
  categories?: SelectorItem[];
  brands?: SelectorItem[];
  collections?: SelectorItem[];
}

type FilterStatus = "" | Product["status"];
type FeaturedFilter = "" | "true" | "false";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function getStatusClasses(status: Product["status"]): string {
  switch (status) {
    case "active":
      return "bg-[#79D45C]/15 text-[#4D9A38]";

    case "draft":
      return "bg-[#F8C83B]/20 text-[#A67A00]";

    case "archived":
      return "bg-[#F56B9A]/15 text-[#C44770]";

    default:
      return "bg-muted text-muted-foreground";
  }
}

function getStockLabel(stock: number): {
  label: string;
  className: string;
} {
  if (stock === 0) {
    return {
      label: "Out of stock",
      className: "text-[#C44770]",
    };
  }

  if (stock <= 5) {
    return {
      label: `${stock} left`,
      className: "text-[#A67A00]",
    };
  }

  return {
    label: `${stock} in stock`,
    className: "text-[#4D9A38]",
  };
}

export default function ProductList() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [collection, setCollection] = useState("");
  const [status, setStatus] = useState<FilterStatus>("");
  const [featured, setFeatured] = useState<FeaturedFilter>("");

  const [products, setProducts] = useState<ProductListItem[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [categories, setCategories] = useState<SelectorItem[]>([]);
  const [brands, setBrands] = useState<SelectorItem[]>([]);
  const [collections, setCollections] = useState<SelectorItem[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [filterError, setFilterError] = useState<string | null>(null);

  const [urlInitialized, setUrlInitialized] = useState(false);

  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  const [deleteProductName, setDeleteProductName] = useState<string>("");

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [refreshKey, setRefreshKey] = useState(0);

  /*
   * Restore URL state only after hydration.
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const urlPage = Number(params.get("page") || "1");

    // URL → component state synchronization is intentional here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(Number.isInteger(urlPage) && urlPage >= 1 ? urlPage : 1);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch(params.get("search") || "");

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCategory(params.get("category") || "");
    setBrand(params.get("brand") || "");
    setCollection(params.get("collection") || "");

    const urlStatus = params.get("status") || "";

    if (urlStatus === "active" || urlStatus === "draft" || urlStatus === "archived") {
      setStatus(urlStatus);
    } else {
      setStatus("");
    }

    const urlFeatured = params.get("featured") || "";

    if (urlFeatured === "true" || urlFeatured === "false") {
      setFeatured(urlFeatured);
    } else {
      setFeatured("");
    }

    setUrlInitialized(true);
  }, []);

  /*
   * Load selectors.
   */
  useEffect(() => {
    const controller = new AbortController();

    async function loadFilterOptions() {
      try {
        setIsLoadingFilters(true);
        setFilterError(null);

        const [categoriesResponse, brandsResponse, collectionsResponse] = await Promise.all([
          fetch("/api/categories", {
            signal: controller.signal,
          }),
          fetch("/api/brands", {
            signal: controller.signal,
          }),
          fetch("/api/collections", {
            signal: controller.signal,
          }),
        ]);

        if (!categoriesResponse.ok || !brandsResponse.ok || !collectionsResponse.ok) {
          throw new Error("Failed to load product filters");
        }

        const [categoriesData, brandsData, collectionsData]: SelectorResponse[] = await Promise.all(
          [categoriesResponse.json(), brandsResponse.json(), collectionsResponse.json()],
        );

        if (!categoriesData.success || !brandsData.success || !collectionsData.success) {
          throw new Error("Failed to load product filters");
        }

        setCategories(uniqueSelectorItems(categoriesData.categories ?? []));

        setBrands(uniqueSelectorItems(brandsData.brands ?? []));

        setCollections(uniqueSelectorItems(collectionsData.collections ?? []));
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setFilterError(err instanceof Error ? err.message : "Failed to load product filters");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingFilters(false);
        }
      }
    }

    loadFilterOptions();

    return () => controller.abort();
  }, []);

  /*
   * Load products.
   */
  useEffect(() => {
    if (!urlInitialized) {
      return;
    }

    const controller = new AbortController();

    const timeout = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();

        params.set("page", String(page));
        params.set("limit", "20");

        const trimmedSearch = search.trim();

        if (trimmedSearch) {
          params.set("search", trimmedSearch);
        }

        if (category) {
          params.set("category", category);
        }

        if (brand) {
          params.set("brand", brand);
        }

        if (collection) {
          params.set("collection", collection);
        }

        if (status) {
          params.set("status", status);
        }

        if (featured) {
          params.set("featured", featured);
        }

        const response = await fetch(`/api/products?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: ProductsResponse = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch products");
        }

        setProducts(data.products ?? []);

        setTotalPages(data.pagination?.totalPages ?? 1);

        setTotalProducts(data.pagination?.total ?? 0);

        /*
         * Synchronize URL after the request succeeds.
         */
        const url = new URL(window.location.href);

        if (page > 1) {
          url.searchParams.set("page", String(page));
        } else {
          url.searchParams.delete("page");
        }

        if (trimmedSearch) {
          url.searchParams.set("search", trimmedSearch);
        } else {
          url.searchParams.delete("search");
        }

        if (category) {
          url.searchParams.set("category", category);
        } else {
          url.searchParams.delete("category");
        }

        if (brand) {
          url.searchParams.set("brand", brand);
        } else {
          url.searchParams.delete("brand");
        }

        if (collection) {
          url.searchParams.set("collection", collection);
        } else {
          url.searchParams.delete("collection");
        }

        if (status) {
          url.searchParams.set("status", status);
        } else {
          url.searchParams.delete("status");
        }

        if (featured) {
          url.searchParams.set("featured", featured);
        } else {
          url.searchParams.delete("featured");
        }

        window.history.replaceState({}, "", url);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [urlInitialized, search, category, brand, collection, status, featured, page, refreshKey]);

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
    setPage(1);
  }

  function clearSearch() {
    setSearch("");
    setPage(1);
  }

  function clearFilters() {
    setCategory("");
    setBrand("");
    setCollection("");
    setStatus("");
    setFeatured("");
    setPage(1);
  }

  function handleDeleteRequested(product: ProductListItem) {
    setDeleteProductId(product._id);
    setDeleteProductName(product.name);
  }

  function handleDeleted() {
    setDeleteProductId(null);
    setDeleteProductName("");

    setSuccessMessage("Product deleted successfully.");

    /*
     * Refresh the current page.
     */
    setPage((currentPage) =>
      currentPage > 1 && products.length === 1 ? currentPage - 1 : currentPage,
    );

    window.setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  }

  const hasActiveFilters =
    Boolean(category) ||
    Boolean(brand) ||
    Boolean(collection) ||
    Boolean(status) ||
    Boolean(featured);

  const hasSearch = Boolean(search.trim());

  const showingFrom = totalProducts === 0 ? 0 : (page - 1) * 20 + 1;

  const showingTo = totalProducts === 0 ? 0 : Math.min(page * 20, totalProducts);

  return (
    <div className="relative space-y-7 pb-8 font-[var(--font-poppins)]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#F8F6FB]"
      >
        <div className="absolute -right-40 -top-40 size-[520px] rounded-full bg-[#C391EE]/10 blur-3xl" />
        <div className="absolute -bottom-48 -left-40 size-[560px] rounded-full bg-[#E83D59]/5 blur-3xl" />
      </div>

      {/* Header */}
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-1.5 w-8 rounded-full bg-[#E83D59]" />
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#8B62B4]">
              Catalog management
            </span>
          </div>
          <h1 className="font-[var(--font-roboto)] text-[2rem] font-black tracking-[-0.055em] text-[#27344A] sm:text-[2.35rem]">
            Products
          </h1>
          <p className="mt-1.5 max-w-xl text-sm leading-6 text-[#687489]">
            Manage your BuzzieWorld product catalog, inventory, visibility and featured products
            from one place.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2.5 sm:flex-row xl:w-auto">
          <div className="w-full sm:min-w-[330px] xl:w-[360px]">
            <label htmlFor="product-search" className="sr-only">
              Search products
            </label>
            <div className="relative">
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8993A5]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                />
              </svg>
              <input
                id="product-search"
                type="search"
                value={search}
                onChange={handleSearchChange}
                placeholder="Search by product name or SKU..."
                autoComplete="off"
                className="h-11 w-full rounded-[14px] border border-[#E4DDEA] bg-white pl-10 pr-10 text-sm text-[#27344A] outline-none transition-all placeholder:text-[#A0A8B5] hover:border-[#D8C8E3] focus:border-[#C391EE] focus:ring-4 focus:ring-[#C391EE]/10"
              />
              {hasSearch && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear product search"
                  className="absolute right-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-[#8993A5] transition hover:bg-[#F4EDF8] hover:text-[#27344A]"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/admin/products/new";
            }}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[14px] bg-[#C391EE] px-5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(195,145,238,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E83D59] hover:shadow-[0_12px_28px_rgba(232,61,89,0.18)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#C391EE]/20"
          >
            <span className="text-lg leading-none">+</span>
            Add Product
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 rounded-[16px] border border-[#79D45C]/25 bg-[#F4FBEF] px-4 py-3.5 shadow-sm">
          <span className="flex size-7 items-center justify-center rounded-full bg-[#79D45C]/15 text-[#4D9A38]">
            ✓
          </span>
          <p className="text-sm font-semibold text-[#4D9A38]">{successMessage}</p>
        </div>
      )}

      {/* Filters */}
      <section className="overflow-hidden rounded-[22px] border border-[#E5DDEA] bg-white/95 shadow-[0_18px_55px_rgba(39,52,74,0.055)]">
        <div className="border-b border-[#EEE8F3] bg-[#FBF8FE] px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-[var(--font-roboto)] text-base font-black tracking-[-0.025em] text-[#27344A]">
                  Catalog filters
                </h2>
                {(hasActiveFilters || hasSearch) && (
                  <span className="rounded-full bg-[#F1E6F9] px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.08em] text-[#8B62B4]">
                    Active
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs leading-5 text-[#8993A5]">
                Narrow your catalog by category, brand, collection, status or featured state.
              </p>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="self-start rounded-full px-3 py-1.5 text-xs font-bold text-[#E83D59] transition hover:bg-[#FFF0F3] sm:self-auto"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          {filterError ? (
            <div className="rounded-[15px] border border-[#F56B9A]/25 bg-[#FFF3F6] px-4 py-3">
              <p className="text-sm font-medium text-[#C44770]">{filterError}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                {
                  id: "category-filter",
                  label: "Category",
                  value: category,
                  setter: setCategory,
                  options: categories,
                  placeholder: "All categories",
                },
                {
                  id: "brand-filter",
                  label: "Brand",
                  value: brand,
                  setter: setBrand,
                  options: brands,
                  placeholder: "All brands",
                },
                {
                  id: "collection-filter",
                  label: "Collection",
                  value: collection,
                  setter: setCollection,
                  options: collections,
                  placeholder: "All collections",
                },
              ].map((filter) => {
                const uniqueOptions = uniqueSelectorItems(filter.options);

                return (
                  <div key={filter.id}>
                    <label
                      htmlFor={filter.id}
                      className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.1em] text-[#7C8798]"
                    >
                      {filter.label}
                    </label>

                    <select
                      id={filter.id}
                      value={filter.value}
                      onChange={(event) => {
                        filter.setter(event.target.value);
                        setPage(1);
                      }}
                      disabled={isLoadingFilters}
                      className="h-11 w-full rounded-[13px] border border-[#E4DDEA] bg-white px-3 text-sm font-medium text-[#27344A] outline-none transition hover:border-[#D8C8E3] focus:border-[#C391EE] focus:ring-4 focus:ring-[#C391EE]/10 disabled:opacity-60"
                    >
                      <option value="">{filter.placeholder}</option>

                      {uniqueOptions.map((item) => (
                        <option key={`${filter.id}-${item._id}`} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              })}

              <div>
                <label
                  htmlFor="status-filter"
                  className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.1em] text-[#7C8798]"
                >
                  Status
                </label>
                <select
                  id="status-filter"
                  value={status}
                  onChange={(event) => {
                    setStatus(event.target.value as FilterStatus);
                    setPage(1);
                  }}
                  className="h-11 w-full rounded-[13px] border border-[#E4DDEA] bg-white px-3 text-sm font-medium text-[#27344A] outline-none transition hover:border-[#D8C8E3] focus:border-[#C391EE] focus:ring-4 focus:ring-[#C391EE]/10"
                >
                  <option value="">All statuses</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="featured-filter"
                  className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.1em] text-[#7C8798]"
                >
                  Featured
                </label>
                <select
                  id="featured-filter"
                  value={featured}
                  onChange={(event) => {
                    setFeatured(event.target.value as FeaturedFilter);
                    setPage(1);
                  }}
                  className="h-11 w-full rounded-[13px] border border-[#E4DDEA] bg-white px-3 text-sm font-medium text-[#27344A] outline-none transition hover:border-[#D8C8E3] focus:border-[#C391EE] focus:ring-4 focus:ring-[#C391EE]/10"
                >
                  <option value="">All products</option>
                  <option value="true">Featured</option>
                  <option value="false">Not featured</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Product content */}
      <section className="overflow-hidden rounded-[22px] border border-[#E5DDEA] bg-white/95 shadow-[0_18px_55px_rgba(39,52,74,0.055)]">
        <div className="flex items-center justify-between border-b border-[#EEE8F3] bg-white px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-[var(--font-roboto)] text-base font-black tracking-[-0.025em] text-[#27344A]">
              Product catalog
            </h2>
            {!isLoading && !error && products.length > 0 && (
              <p className="mt-0.5 text-xs text-[#8993A5]">
                Showing {showingFrom}–{showingTo} of {totalProducts} products
              </p>
            )}
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="size-2 rounded-full bg-[#79D45C]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#8993A5]">
              Live catalog
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[360px] items-center justify-center px-6">
            <div className="text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-[16px] bg-[#F4E9FF]">
                <div className="size-6 animate-spin rounded-full border-2 border-[#E7D9F0] border-t-[#C391EE]" />
              </div>
              <p className="mt-4 text-sm font-semibold text-[#526075]">
                {hasSearch || hasActiveFilters ? "Updating products..." : "Loading products..."}
              </p>
              <p className="mt-1 text-xs text-[#9AA2AE]">Please wait a moment.</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-[360px] items-center justify-center px-6">
            <div className="max-w-md text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-[18px] bg-[#FFF0F3] text-[#E83D59]">
                !
              </div>
              <h2 className="mt-5 font-[var(--font-roboto)] text-xl font-black tracking-[-0.03em] text-[#27344A]">
                Failed to load products
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#7C8798]">{error}</p>
              <button
                type="button"
                onClick={() => setRefreshKey((value) => value + 1)}
                className="mt-5 rounded-[12px] bg-[#C391EE] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#E83D59]"
              >
                Retry
              </button>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex min-h-[360px] items-center justify-center px-6">
            <div className="max-w-md text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-[18px] bg-[#F4E9FF] text-[#C391EE]">
                ✦
              </div>
              <h2 className="mt-5 font-[var(--font-roboto)] text-xl font-black tracking-[-0.03em] text-[#27344A]">
                {hasSearch || hasActiveFilters ? "No matching products" : "No products found"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#7C8798]">
                {hasSearch || hasActiveFilters
                  ? "Try changing your search or filters."
                  : "Your product catalog is currently empty."}
              </p>
              {(hasSearch || hasActiveFilters) && (
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {hasSearch && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="rounded-full bg-[#F4E9FF] px-4 py-2 text-xs font-bold text-[#8B62B4] transition hover:bg-[#EDE0F7]"
                    >
                      Clear search
                    </button>
                  )}
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="rounded-full bg-[#FFF0F3] px-4 py-2 text-xs font-bold text-[#E83D59] transition hover:bg-[#FFE4E9]"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[1040px]">
                <thead>
                  <tr className="border-b border-[#EEE8F3] bg-[#FBF8FE]">
                    {[
                      "Product",
                      "SKU",
                      "Category",
                      "Price",
                      "Stock",
                      "Status",
                      "Featured",
                      "Actions",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className={`px-5 py-3.5 text-left text-[9px] font-black uppercase tracking-[0.12em] text-[#8993A5] ${heading === "Actions" ? "text-right" : ""}`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EBF3]">
                  {products.map((product) => {
                    const stock = getStockLabel(product.stock);
                    return (
                      <tr key={product._id} className="group transition-colors hover:bg-[#FCFAFE]">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3.5">
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[13px] border border-[#EDE5F2] bg-[#FFF8EC] shadow-sm">
                              {product.images?.[0]?.url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={product.images[0].url}
                                  alt={product.images[0].alt || product.name}
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-[#9AA2AE]">
                                  No image
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-[#27344A]">
                                {product.name}
                              </p>
                              <p className="mt-0.5 truncate text-[10px] text-[#9199A7]">
                                {product.slug}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs font-medium text-[#687489]">
                          {product.sku || "—"}
                        </td>
                        <td className="px-5 py-4 text-xs font-medium text-[#526075]">
                          {product.category?.name || "—"}
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-sm font-black text-[#27344A]">
                            {formatPrice(product.price)}
                          </div>
                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <div className="mt-0.5 text-[10px] text-[#9AA2AE] line-through">
                              {formatPrice(product.compareAtPrice)}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`text-xs font-bold ${stock.className}`}>
                            {stock.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-black capitalize ${getStatusClasses(product.status)}`}
                          >
                            {product.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {product.featured ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8C83B]/15 px-2.5 py-1 text-[10px] font-black text-[#A67A00]">
                              <span className="size-1.5 rounded-full bg-[#F8C83B]" />
                              Featured
                            </span>
                          ) : (
                            <span className="text-xs text-[#A1A8B4]">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1.5">
                            <a
                              href={`/products/${product.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-[9px] border border-[#E3D9E9] bg-white px-3 py-1.5 text-[10px] font-bold text-[#687489] transition hover:border-[#C391EE] hover:bg-[#F8F1FC] hover:text-[#8B62B4]"
                            >
                              View
                            </a>
                            <a
                              href={`/admin/products/${product._id}/edit`}
                              className="rounded-[9px] border border-[#E3D9E9] bg-white px-3 py-1.5 text-[10px] font-bold text-[#687489] transition hover:border-[#C391EE] hover:bg-[#F8F1FC] hover:text-[#8B62B4]"
                            >
                              Edit
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteRequested(product)}
                              className="rounded-[9px] border border-[#F56B9A]/25 bg-white px-3 py-1.5 text-[10px] font-bold text-[#C44770] transition hover:bg-[#FFF1F4]"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-[#F0EBF3] md:hidden">
              {products.map((product) => {
                const stock = getStockLabel(product.stock);
                return (
                  <div
                    key={product._id}
                    className="space-y-4 p-4 transition-colors hover:bg-[#FCFAFE]"
                  >
                    <div className="flex gap-3.5">
                      <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[15px] border border-[#EDE5F2] bg-[#FFF8EC] shadow-sm">
                        {product.images?.[0]?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.images[0].url}
                            alt={product.images[0].alt || product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-[#9AA2AE]">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h2 className="truncate text-sm font-black text-[#27344A]">
                              {product.name}
                            </h2>
                            <p className="mt-1 truncate text-[10px] text-[#9199A7]">
                              {product.sku || "No SKU"}
                            </p>
                          </div>
                          {product.featured && (
                            <span className="shrink-0 rounded-full bg-[#F8C83B]/15 px-2 py-1 text-[9px] font-black text-[#A67A00]">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-black capitalize ${getStatusClasses(product.status)}`}
                          >
                            {product.status}
                          </span>
                          <span
                            className={`inline-flex rounded-full bg-[#F5F3F7] px-2.5 py-1 text-[9px] font-bold ${stock.className}`}
                          >
                            {stock.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        ["Category", product.category?.name || "—"],
                        ["Collection", product.collection?.name || "—"],
                        ["Price", formatPrice(product.price)],
                        ["Brand", product.brand?.name || "—"],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-[13px] border border-[#EEE8F3] bg-[#FBF8FE] px-3 py-2.5"
                        >
                          <p className="text-[9px] font-black uppercase tracking-[0.08em] text-[#9AA2AE]">
                            {label}
                          </p>
                          <p className="mt-1 truncate text-xs font-bold text-[#526075]">{value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <a
                        href={`/products/${product.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-[10px] border border-[#E3D9E9] bg-white px-3 py-2.5 text-center text-[10px] font-bold text-[#687489] transition hover:border-[#C391EE] hover:bg-[#F8F1FC] hover:text-[#8B62B4]"
                      >
                        View
                      </a>
                      <a
                        href={`/admin/products/${product._id}/edit`}
                        className="rounded-[10px] bg-[#C391EE] px-3 py-2.5 text-center text-[10px] font-bold text-white transition hover:bg-[#E83D59]"
                      >
                        Edit
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDeleteRequested(product)}
                        className="rounded-[10px] border border-[#F56B9A]/25 bg-white px-3 py-2.5 text-[10px] font-bold text-[#C44770] transition hover:bg-[#FFF1F4]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col gap-4 border-t border-[#EEE8F3] bg-[#FBF8FE]/55 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div className="text-xs text-[#8993A5]">
                  Showing <span className="font-bold text-[#526075]">{showingFrom}</span> to{" "}
                  <span className="font-bold text-[#526075]">{showingTo}</span> of{" "}
                  <span className="font-bold text-[#526075]">{totalProducts}</span> products
                </div>
                <div className="flex items-center justify-between gap-1 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                    disabled={page <= 1 || isLoading}
                    className="inline-flex h-9 items-center justify-center rounded-[10px] border border-[#E3D9E9] bg-white px-3 text-[10px] font-bold text-[#687489] transition hover:border-[#C391EE] hover:text-[#8B62B4] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                      .filter(
                        (pageNumber) =>
                          totalPages <= 7 ||
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= page - 1 && pageNumber <= page + 1),
                      )
                      .map((pageNumber, index, visiblePages) => {
                        const previousPage = visiblePages[index - 1];
                        const shouldShowEllipsis =
                          previousPage !== undefined && pageNumber - previousPage > 1;
                        return (
                          <div key={pageNumber} className="flex items-center gap-1">
                            {shouldShowEllipsis && (
                              <span className="flex h-9 w-7 items-center justify-center text-xs text-[#9AA2AE]">
                                …
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => setPage(pageNumber)}
                              disabled={isLoading}
                              aria-current={pageNumber === page ? "page" : undefined}
                              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-[10px] border px-2 text-[10px] font-black transition ${pageNumber === page ? "border-[#C391EE] bg-[#C391EE] text-white shadow-[0_7px_18px_rgba(195,145,238,0.22)]" : "border-[#E3D9E9] bg-white text-[#687489] hover:border-[#C391EE] hover:bg-[#F8F1FC] hover:text-[#8B62B4]"} disabled:cursor-not-allowed disabled:opacity-40`}
                            >
                              {pageNumber}
                            </button>
                          </div>
                        );
                      })}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
                    disabled={page >= totalPages || isLoading}
                    className="inline-flex h-9 items-center justify-center rounded-[10px] border border-[#E3D9E9] bg-white px-3 text-[10px] font-bold text-[#687489] transition hover:border-[#C391EE] hover:text-[#8B62B4] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <ProductDeleteDialog
        productId={deleteProductId}
        productName={deleteProductName}
        onClose={() => {
          setDeleteProductId(null);
          setDeleteProductName("");
        }}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
