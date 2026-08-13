"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import type { Product } from "@/types/product";

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

  /*
   * Restore URL state only after hydration.
   */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const urlPage = Number(params.get("page") || "1");

    setPage(Number.isInteger(urlPage) && urlPage >= 1 ? urlPage : 1);

    setSearch(params.get("search") || "");
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

        setCategories(categoriesData.categories ?? []);
        setBrands(brandsData.brands ?? []);
        setCollections(collectionsData.collections ?? []);
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
  }, [urlInitialized, search, category, brand, collection, status, featured, page]);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage your BuzzieWorld product catalog.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <div className="w-full lg:w-[360px]">
            <label htmlFor="product-search" className="sr-only">
              Search products
            </label>

            <div className="relative">
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
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
                className="h-10 w-full rounded-xl border bg-background pl-9 pr-10 text-sm outline-none transition focus:border-[#3F7DFF] focus:ring-2 focus:ring-[#3F7DFF]/15"
              />

              {hasSearch && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear product search"
                  className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
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
            className="h-10 rounded-xl bg-[#3F7DFF] px-4 text-sm font-medium text-white transition hover:opacity-90"
          >
            + Add Product
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="rounded-xl border border-[#79D45C]/30 bg-[#79D45C]/10 px-4 py-3">
          <p className="text-sm text-[#4D9A38]">{successMessage}</p>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl border bg-background p-4 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold">Filters</h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Narrow the product catalog by category, brand, collection, status or featured state.
              </p>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="self-start text-sm font-medium text-[#3F7DFF] hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {filterError ? (
            <div className="rounded-xl border border-[#F56B9A]/30 bg-[#F56B9A]/5 px-4 py-3">
              <p className="text-sm text-[#C44770]">{filterError}</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <label
                  htmlFor="category-filter"
                  className="mb-1.5 block text-xs font-medium text-muted-foreground"
                >
                  Category
                </label>

                <select
                  id="category-filter"
                  value={category}
                  onChange={(event) => {
                    setCategory(event.target.value);
                    setPage(1);
                  }}
                  disabled={isLoadingFilters}
                  className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-[#3F7DFF] focus:ring-2 focus:ring-[#3F7DFF]/15 disabled:opacity-60"
                >
                  <option value="">All categories</option>

                  {categories.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="brand-filter"
                  className="mb-1.5 block text-xs font-medium text-muted-foreground"
                >
                  Brand
                </label>

                <select
                  id="brand-filter"
                  value={brand}
                  onChange={(event) => {
                    setBrand(event.target.value);
                    setPage(1);
                  }}
                  disabled={isLoadingFilters}
                  className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-[#3F7DFF] focus:ring-2 focus:ring-[#3F7DFF]/15 disabled:opacity-60"
                >
                  <option value="">All brands</option>

                  {brands.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="collection-filter"
                  className="mb-1.5 block text-xs font-medium text-muted-foreground"
                >
                  Collection
                </label>

                <select
                  id="collection-filter"
                  value={collection}
                  onChange={(event) => {
                    setCollection(event.target.value);
                    setPage(1);
                  }}
                  disabled={isLoadingFilters}
                  className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-[#3F7DFF] focus:ring-2 focus:ring-[#3F7DFF]/15 disabled:opacity-60"
                >
                  <option value="">All collections</option>

                  {collections.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="status-filter"
                  className="mb-1.5 block text-xs font-medium text-muted-foreground"
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
                  className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-[#3F7DFF] focus:ring-2 focus:ring-[#3F7DFF]/15"
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
                  className="mb-1.5 block text-xs font-medium text-muted-foreground"
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
                  className="h-10 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:border-[#3F7DFF] focus:ring-2 focus:ring-[#3F7DFF]/15"
                >
                  <option value="">All products</option>
                  <option value="true">Featured</option>
                  <option value="false">Not featured</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product content */}
      <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
        {isLoading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-[#3F7DFF]" />

              <p className="mt-4 text-sm text-muted-foreground">
                {hasSearch || hasActiveFilters ? "Updating products..." : "Loading products..."}
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="flex min-h-[320px] items-center justify-center px-6">
            <div className="max-w-md text-center">
              <h2 className="text-lg font-semibold">Failed to load products</h2>

              <p className="mt-2 text-sm text-muted-foreground">{error}</p>

              <button
                type="button"
                onClick={() => setPage((currentPage) => currentPage)}
                className="mt-4 rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Retry
              </button>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex min-h-[320px] items-center justify-center px-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold">
                {hasSearch || hasActiveFilters ? "No matching products" : "No products found"}
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {hasSearch || hasActiveFilters
                  ? "Try changing your search or filters."
                  : "Your product catalog is currently empty."}
              </p>

              {(hasSearch || hasActiveFilters) && (
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  {hasSearch && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="text-sm font-medium text-[#3F7DFF] hover:underline"
                    >
                      Clear search
                    </button>
                  )}

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-sm font-medium text-[#3F7DFF] hover:underline"
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
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b bg-[#FFF8EC]/60">
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
                        className={`px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground ${
                          heading === "Actions" ? "text-right" : ""
                        }`}
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {products.map((product) => {
                    const stock = getStockLabel(product.stock);

                    return (
                      <tr key={product._id} className="transition-colors hover:bg-muted/30">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border bg-[#FFF8EC]">
                              {product.images?.[0]?.url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={product.images[0].url}
                                  alt={product.images[0].alt || product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                  No image
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-medium">{product.name}</p>

                              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                {product.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-sm">{product.sku || "—"}</td>

                        <td className="px-5 py-4 text-sm">{product.category?.name || "—"}</td>

                        <td className="px-5 py-4">
                          <div className="text-sm font-medium">{formatPrice(product.price)}</div>

                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <div className="mt-0.5 text-xs text-muted-foreground line-through">
                              {formatPrice(product.compareAtPrice)}
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span className={`text-sm font-medium ${stock.className}`}>
                            {stock.label}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusClasses(
                              product.status,
                            )}`}
                          >
                            {product.status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          {product.featured ? (
                            <span className="inline-flex rounded-full bg-[#F8C83B]/20 px-2.5 py-1 text-xs font-medium text-[#A67A00]">
                              Featured
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            <a
                              href={`/products/${product.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                            >
                              View
                            </a>

                            <a
                              href={`/admin/products/${product._id}/edit`}
                              className="rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                            >
                              Edit
                            </a>

                            <button
                              type="button"
                              onClick={() => handleDeleteRequested(product)}
                              className="rounded-lg border border-[#F56B9A]/30 px-3 py-1.5 text-xs font-medium text-[#C44770] hover:bg-[#F56B9A]/5"
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
            <div className="divide-y md:hidden">
              {products.map((product) => {
                const stock = getStockLabel(product.stock);

                return (
                  <div key={product._id} className="space-y-4 p-4">
                    <div className="flex gap-3">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-[#FFF8EC]">
                        {product.images?.[0]?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={product.images[0].url}
                            alt={product.images[0].alt || product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                            No image
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h2 className="truncate font-medium">{product.name}</h2>

                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {product.sku || "No SKU"}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusClasses(
                              product.status,
                            )}`}
                          >
                            {product.status}
                          </span>

                          {product.featured && (
                            <span className="inline-flex rounded-full bg-[#F8C83B]/20 px-2.5 py-1 text-xs font-medium text-[#A67A00]">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Category</p>

                        <p className="mt-1 font-medium">{product.category?.name || "—"}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Stock</p>

                        <p className={`mt-1 font-medium ${stock.className}`}>{stock.label}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Price</p>

                        <p className="mt-1 font-medium">{formatPrice(product.price)}</p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Collection</p>

                        <p className="mt-1 truncate font-medium">
                          {product.collection?.name || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={`/products/${product.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 rounded-lg border px-3 py-2 text-center text-xs font-medium hover:bg-muted"
                      >
                        View
                      </a>

                      <a
                        href={`/admin/products/${product._id}/edit`}
                        className="flex-1 rounded-lg border px-3 py-2 text-center text-xs font-medium hover:bg-muted"
                      >
                        Edit
                      </a>

                      <button
                        type="button"
                        onClick={() => handleDeleteRequested(product)}
                        className="flex-1 rounded-lg border border-[#F56B9A]/30 px-3 py-2 text-xs font-medium text-[#C44770] hover:bg-[#F56B9A]/5"
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
              <div className="flex flex-col gap-3 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{showingFrom}</span> to{" "}
                  <span className="font-medium text-foreground">{showingTo}</span> of{" "}
                  <span className="font-medium text-foreground">{totalProducts}</span> products
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                    disabled={page <= 1 || isLoading}
                    className="inline-flex h-9 items-center justify-center rounded-lg border px-3 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                      .filter((pageNumber) => {
                        if (totalPages <= 7) {
                          return true;
                        }

                        if (pageNumber === 1) {
                          return true;
                        }

                        if (pageNumber === totalPages) {
                          return true;
                        }

                        return pageNumber >= page - 1 && pageNumber <= page + 1;
                      })
                      .map((pageNumber, index, visiblePages) => {
                        const previousPage = visiblePages[index - 1];

                        const shouldShowEllipsis =
                          previousPage !== undefined && pageNumber - previousPage > 1;

                        return (
                          <div key={pageNumber} className="flex items-center gap-1">
                            {shouldShowEllipsis && (
                              <span className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground">
                                …
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => setPage(pageNumber)}
                              disabled={isLoading}
                              aria-current={pageNumber === page ? "page" : undefined}
                              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-medium transition ${
                                pageNumber === page
                                  ? "border-[#3F7DFF] bg-[#3F7DFF] text-white"
                                  : "hover:bg-muted"
                              } disabled:cursor-not-allowed disabled:opacity-40`}
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
                    className="inline-flex h-9 items-center justify-center rounded-lg border px-3 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

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

