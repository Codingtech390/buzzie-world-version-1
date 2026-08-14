"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import ProductCard from "@/components/product/ProductCard";
import ShopFilters, { type ShopSort } from "@/components/shop/ShopFilters";
import ShopPagination from "@/components/shop/ShopPagination";

import type {
  StorefrontProduct,
  StorefrontProductsResponse,
  StorefrontSelector,
  StorefrontSelectorResponse,
} from "@/types/storefront";

const PRODUCTS_PER_PAGE = 12;

export default function ShopClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<StorefrontProduct[]>([]);

  const [categories, setCategories] = useState<StorefrontSelector[]>([]);

  const [brands, setBrands] = useState<StorefrontSelector[]>([]);

  const [collections, setCollections] = useState<StorefrontSelector[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [collection, setCollection] = useState("");

  const [sort, setSort] = useState<ShopSort>("newest");

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [filterError, setFilterError] = useState<string | null>(null);

  /*
   * Restore storefront state from the URL.
   */
  useEffect(() => {
    const urlPage = Number(searchParams.get("page"));

    setPage(Number.isInteger(urlPage) && urlPage > 0 ? urlPage : 1);

    setSearch(searchParams.get("search") ?? "");
    setCategory(searchParams.get("category") ?? "");
    setBrand(searchParams.get("brand") ?? "");
    setCollection(searchParams.get("collection") ?? "");

    const urlSort = searchParams.get("sort");

    if (
      urlSort === "oldest" ||
      urlSort === "price-low" ||
      urlSort === "price-high" ||
      urlSort === "name-az" ||
      urlSort === "name-za" ||
      urlSort === "newest"
    ) {
      setSort(urlSort);
    } else {
      setSort("newest");
    }
  }, [searchParams]);

  /*
   * Load selector data.
   */
  useEffect(() => {
    const controller = new AbortController();

    async function loadFilters() {
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
          throw new Error("Failed to load shop filters");
        }

        const [categoriesData, brandsData, collectionsData]: [
          StorefrontSelectorResponse,
          StorefrontSelectorResponse,
          StorefrontSelectorResponse,
        ] = await Promise.all([
          categoriesResponse.json(),
          brandsResponse.json(),
          collectionsResponse.json(),
        ]);

        if (!categoriesData.success || !brandsData.success || !collectionsData.success) {
          throw new Error("Failed to load shop filters");
        }

        setCategories(categoriesData.categories ?? []);

        setBrands(brandsData.brands ?? []);

        setCollections(collectionsData.collections ?? []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }

        setFilterError(err instanceof Error ? err.message : "Failed to load shop filters");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingFilters(false);
        }
      }
    }

    loadFilters();

    return () => {
      controller.abort();
    };
  }, []);

  /*
   * Fetch products whenever storefront state changes.
   */
  useEffect(() => {
    const controller = new AbortController();

    const timeout = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();

        params.set("page", String(page));
        params.set("limit", String(PRODUCTS_PER_PAGE));
        params.set("status", "active");
        params.set("sort", sort);

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

        const response = await fetch(`/api/products?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data: StorefrontProductsResponse = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to fetch products");
        }

        setProducts(data.products ?? []);

        setTotalPages(data.pagination?.totalPages ?? 1);

        setTotalProducts(data.pagination?.total ?? 0);

        /*
         * Keep URL state synchronized.
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

        if (sort !== "newest") {
          url.searchParams.set("sort", sort);
        } else {
          url.searchParams.delete("sort");
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
    }, 250);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [page, search, category, brand, collection, sort]);

  const updateSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const updateCategory = useCallback((value: string) => {
    setCategory(value);
    setPage(1);
  }, []);

  const updateBrand = useCallback((value: string) => {
    setBrand(value);
    setPage(1);
  }, []);

  const updateCollection = useCallback((value: string) => {
    setCollection(value);
    setPage(1);
  }, []);

  const updateSort = useCallback((value: ShopSort) => {
    setSort(value);
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setCategory("");
    setBrand("");
    setCollection("");
    setSort("newest");
    setPage(1);
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] bg-[#FFF8EC] px-6 py-10 sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#3F7DFF]">
          BuzzieWorld Shop
        </p>

        <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-[#252525] sm:text-4xl lg:text-5xl">
          Find something wonderful for every little explorer.
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Explore toys, books, learning products and playful discoveries from the BuzzieWorld
          collection.
        </p>
      </div>

      <ShopFilters
        search={search}
        category={category}
        brand={brand}
        collection={collection}
        sort={sort}
        categories={categories}
        brands={brands}
        collections={collections}
        onSearchChange={updateSearch}
        onCategoryChange={updateCategory}
        onBrandChange={updateBrand}
        onCollectionChange={updateCollection}
        onSortChange={updateSort}
        onClear={clearFilters}
      />

      {filterError && (
        <div className="rounded-2xl border border-[#F56B9A]/30 bg-[#F56B9A]/5 px-4 py-3 text-sm text-[#C44770]">
          {filterError}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#252525]">Shop all products</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading
              ? "Loading products..."
              : `${totalProducts} product${totalProducts === 1 ? "" : "s"} available`}
          </p>
        </div>

        {isLoadingFilters && <p className="text-xs text-muted-foreground">Loading filters...</p>}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl border border-[#F8EFD8] bg-white"
            >
              <div className="aspect-square animate-pulse bg-[#F8EFD8]" />
              <div className="space-y-3 p-4">
                <div className="h-3 w-1/3 animate-pulse rounded bg-[#F8EFD8]" />
                <div className="h-5 w-4/5 animate-pulse rounded bg-[#F8EFD8]" />
                <div className="h-5 w-1/3 animate-pulse rounded bg-[#F8EFD8]" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-[#F56B9A]/30 bg-[#F56B9A]/5 px-6 py-12 text-center">
          <h2 className="text-lg font-semibold text-[#252525]">We couldn't load the products.</h2>

          <p className="mt-2 text-sm text-muted-foreground">{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-full bg-[#3F7DFF] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Try again
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-3xl border border-[#F8EFD8] bg-[#FFF8EC] px-6 py-16 text-center">
          <h2 className="text-xl font-semibold text-[#252525]">No products found</h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Try changing your search or filters to discover more products.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-full bg-[#3F7DFF] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <ShopPagination
            page={page}
            totalPages={totalPages}
            isLoading={isLoading}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
