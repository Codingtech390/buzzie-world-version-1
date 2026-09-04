"use client";

import { ArrowRight, ChevronDown, Search, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import ProductCard from "@/components/product/ProductCard";
import ShopPagination from "@/components/shop/ShopPagination";

import type { StorefrontProduct, StorefrontProductsResponse } from "@/types/storefront";

const PRODUCTS_PER_PAGE = 12;

const DISCOVERY_CATEGORIES = [
  {
    label: "Games",
    query: "games",
    tone: "bg-[#FCE8ED] text-[#C93552]",
  },
  {
    label: "Toys",
    query: "toys",
    tone: "bg-[#FFF0D5] text-[#B96E16]",
  },
  {
    label: "Books",
    query: "books",
    tone: "bg-[#E9F1FF] text-[#3D69B8]",
  },
  {
    label: "STEM",
    query: "stem",
    tone: "bg-[#EAE3F8] text-[#7652A5]",
  },
  {
    label: "Arts & Crafts",
    query: "arts crafts",
    tone: "bg-[#E5F3E9] text-[#4B8A61]",
  },
];

const POPULAR_SEARCHES = [
  "Dinosaurs",
  "Mind Games",
  "Mythology",
  "Geography",
  "Learning Games",
  "Travel Games",
];

type SortOption = "newest" | "oldest" | "price-low" | "price-high" | "name-az" | "name-za";

const SORT_OPTIONS: Array<{
  value: SortOption;
  label: string;
}> = [
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "price-low",
    label: "Price: Low to High",
  },
  {
    value: "price-high",
    label: "Price: High to Low",
  },
  {
    value: "name-az",
    label: "Name: A–Z",
  },
];

function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-[24px] bg-white ring-1 ring-[#EEE5DB]">
      <div className="aspect-square animate-pulse bg-[#F4EEE7]" />

      <div className="space-y-3 p-4">
        <div className="h-4 w-4/5 animate-pulse rounded-full bg-[#F1E9E0]" />
        <div className="h-4 w-2/5 animate-pulse rounded-full bg-[#F1E9E0]" />
        <div className="h-5 w-1/3 animate-pulse rounded-full bg-[#F1E9E0]" />
      </div>
    </div>
  );
}

function SearchIconButton({ type = "submit" }: { type?: "submit" | "button" }) {
  return (
    <button
      type={type}
      aria-label="Search"
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#E83D59] text-white shadow-[0_8px_20px_rgba(232,61,89,0.20)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#D8324E] active:translate-y-0"
    >
      <Search className="h-5 w-5" strokeWidth={2.4} />
    </button>
  );
}

export default function SearchClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get("search")?.trim() ?? "";
  const urlPage = Number(searchParams.get("page") ?? "1");
  const urlSort = (searchParams.get("sort") ?? "newest") as SortOption;

  const pageFromUrl = Number.isFinite(urlPage) && urlPage > 0 ? urlPage : 1;

  const sortFromUrl = SORT_OPTIONS.some((option) => option.value === urlSort) ? urlSort : "newest";

  const [inputValue, setInputValue] = useState(urlSearch);
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(pageFromUrl);
  const [sort, setSort] = useState<SortOption>(sortFromUrl);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hasSearch = Boolean(urlSearch);

  useEffect(() => {
    setInputValue(urlSearch);
    setPage(pageFromUrl);
    setSort(sortFromUrl);
  }, [urlSearch, pageFromUrl, sortFromUrl]);

  const updateSearchUrl = useCallback(
    (query: string, nextPage = 1, nextSort: SortOption = sort) => {
      const params = new URLSearchParams();

      const cleanQuery = query.trim();

      if (cleanQuery) {
        params.set("search", cleanQuery);
      }

      if (nextPage > 1) {
        params.set("page", String(nextPage));
      }

      if (nextSort !== "newest") {
        params.set("sort", nextSort);
      }

      const queryString = params.toString();

      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    },
    [pathname, router, sort],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanQuery = inputValue.trim();

    if (!cleanQuery) {
      router.push(pathname);
      return;
    }

    updateSearchUrl(cleanQuery, 1, sort);
  };

  const handleClear = () => {
    setInputValue("");
    router.push(pathname);
  };

  const handleDiscoverySearch = (query: string) => {
    setInputValue(query);
    updateSearchUrl(query, 1, sort);
  };

  const handleSortChange = (nextSort: SortOption) => {
    setSort(nextSort);

    if (!urlSearch) {
      return;
    }

    updateSearchUrl(urlSearch, 1, nextSort);
  };

  const fetchProducts = useCallback(
    async (signal: AbortSignal) => {
      if (!urlSearch) {
        setProducts([]);
        setTotal(0);
        setTotalPages(0);
        setLoading(false);
        setError("");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          search: urlSearch,
          page: String(page),
          limit: String(PRODUCTS_PER_PAGE),
          sort,
        });

        const response = await fetch(`/api/products?${params.toString()}`, {
          method: "GET",
          cache: "no-store",
          signal,
        });

        const data = (await response.json()) as StorefrontProductsResponse;

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load search results.");
        }

        setProducts(data.products ?? []);
        setTotal(data.pagination?.total ?? 0);
        setTotalPages(data.pagination?.totalPages ?? 0);
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          return;
        }

        console.error("Search products error:", fetchError);

        setProducts([]);
        setTotal(0);
        setTotalPages(0);
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Something went wrong while searching.",
        );
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    },
    [page, sort, urlSearch],
  );

  useEffect(() => {
    const controller = new AbortController();

    void fetchProducts(controller.signal);

    return () => controller.abort();
  }, [fetchProducts]);

  const resultLabel = useMemo(() => {
    if (total === 1) {
      return "1 treasure found";
    }

    return `${total} treasures found`;
  }, [total]);

  const handlePageChange = (nextPage: number) => {
    if (!urlSearch || nextPage === page) {
      return;
    }

    setPage(nextPage);
    updateSearchUrl(urlSearch, nextPage, sort);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * ------------------------------------------------------------
   * INITIAL SEARCH STATE
   * ------------------------------------------------------------
   */

  if (!hasSearch) {
    return (
      <main className="min-h-[calc(100vh-160px)] bg-[#FFFCF8]">
        <section className="relative overflow-hidden px-4 pb-20 pt-14 sm:px-6 sm:pb-24 sm:pt-18 lg:px-8 lg:pb-28 lg:pt-24">
          {/* Decorative shapes */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-28 top-20 h-64 w-64 rounded-full bg-[#F6E8F0]/60 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[#EEE7FA]/70 blur-3xl"
          />

          <div className="relative mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-5 flex items-center justify-center gap-3">
                <span className="h-px w-10 bg-[#E83D59]/50 sm:w-16" />

                <p className="font-[var(--font-poppins)] text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#E83D59] sm:text-[11px]">
                  Find their next favourite
                </p>

                <span className="h-px w-10 bg-[#E83D59]/50 sm:w-16" />
              </div>

              <h1 className="font-[var(--font-poppins)] text-[38px] font-black leading-[0.98] tracking-[-0.045em] text-[#251D2A] sm:text-[52px] lg:text-[66px]">
                Search <span className="text-[#E83D59]">BuzzieWorld</span>
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-[14px] leading-7 text-[#756C72] sm:text-[16px]">
                Discover toys, games, learning kits, books and little things made for curious young
                minds.
              </p>

              {/* Main search */}
              <form onSubmit={handleSubmit} className="mx-auto mt-9 max-w-2xl">
                <div className="flex items-center gap-2 rounded-[22px] border border-[#E9DED2] bg-white p-2 shadow-[0_16px_45px_rgba(72,50,38,0.07)] transition-all duration-200 focus-within:border-[#E83D59]/40 focus-within:shadow-[0_18px_50px_rgba(72,50,38,0.10)]">
                  <Search className="ml-3 h-5 w-5 shrink-0 text-[#A69A92]" />

                  <input
                    type="search"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder="Search toys, games, books & more..."
                    aria-label="Search BuzzieWorld"
                    className="min-w-0 flex-1 bg-transparent px-2 py-3 text-[14px] text-[#302932] outline-none placeholder:text-[#B4AAA3] sm:text-[15px]"
                  />

                  {inputValue && (
                    <button
                      type="button"
                      onClick={() => setInputValue("")}
                      aria-label="Clear search"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#9C918A] transition hover:bg-[#F8F1EB] hover:text-[#514841]"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                  <SearchIconButton />
                </div>
              </form>
            </div>

            {/* Discovery */}
            <div className="mx-auto mt-16 max-w-4xl sm:mt-20">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#E83D59]" />

                  <p className="font-[var(--font-poppins)] text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#625861]">
                    Or explore a little
                  </p>

                  <Sparkles className="h-4 w-4 text-[#E83D59]" />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-center gap-2.5 sm:gap-3">
                {DISCOVERY_CATEGORIES.map((category) => (
                  <button
                    key={category.label}
                    type="button"
                    onClick={() => handleDiscoverySearch(category.query)}
                    className={`rounded-full px-4 py-2.5 text-[12px] font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm sm:px-5 sm:text-[13px] ${category.tone}`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              <div className="mt-12 text-center">
                <p className="font-[var(--font-poppins)] text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#9B918B]">
                  Popular searches
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-3">
                  {POPULAR_SEARCHES.map((query) => (
                    <button
                      key={query}
                      type="button"
                      onClick={() => handleDiscoverySearch(query)}
                      className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#625960] transition hover:text-[#E83D59]"
                    >
                      {query}

                      <ArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /*
   * ------------------------------------------------------------
   * SEARCH RESULTS
   * ------------------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-[#FFFCF8]">
      {/* Search header */}
      <section className="border-b border-[#EEE5DB] bg-[#FFFCF8]">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-14 lg:px-8">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#E83D59]/60" />

                <p className="font-[var(--font-poppins)] text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#E83D59]">
                  Search results
                </p>
              </div>

              <h1 className="font-[var(--font-poppins)] text-[34px] font-black leading-tight tracking-[-0.035em] text-[#251D2A] sm:text-[44px]">
                “{urlSearch}”
              </h1>

              {!loading && !error && total > 0 && (
                <p className="mt-2 text-[13px] font-medium text-[#847A81]">{resultLabel}</p>
              )}
            </div>

            {/* Result-page search */}
            <form onSubmit={handleSubmit} className="w-full lg:max-w-md">
              <div className="flex items-center gap-1.5 rounded-[18px] border border-[#E8DED4] bg-white p-1.5 shadow-sm transition focus-within:border-[#E83D59]/40">
                <Search className="ml-3 h-4 w-4 shrink-0 text-[#A39790]" />

                <input
                  type="search"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder="Search again..."
                  aria-label="Search again"
                  className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-[13px] text-[#302932] outline-none placeholder:text-[#B4AAA3]"
                />

                {inputValue && (
                  <button
                    type="button"
                    onClick={() => setInputValue("")}
                    aria-label="Clear search"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#9B918F] hover:bg-[#F8F1EB]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                <button
                  type="submit"
                  className="flex h-10 shrink-0 items-center justify-center rounded-[13px] bg-[#E83D59] px-4 text-[12px] font-bold text-white transition hover:bg-[#D8324E]"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Results content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {/* Toolbar */}
        {!error && !loading && total > 0 && (
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[12px] font-medium text-[#8A8087]">
              Showing{" "}
              <span className="font-bold text-[#51484F]">{(page - 1) * PRODUCTS_PER_PAGE + 1}</span>{" "}
              –{" "}
              <span className="font-bold text-[#51484F]">
                {Math.min(page * PRODUCTS_PER_PAGE, total)}
              </span>{" "}
              of <span className="font-bold text-[#51484F]">{total}</span>
            </div>

            <div className="relative flex items-center gap-2 self-start sm:self-auto">
              <label
                htmlFor="search-sort"
                className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9A9089]"
              >
                Sort
              </label>

              <div className="relative">
                <select
                  id="search-sort"
                  value={sort}
                  onChange={(event) => handleSortChange(event.target.value as SortOption)}
                  className="h-10 appearance-none rounded-[12px] border border-[#E8DED4] bg-white py-0 pl-3 pr-9 text-[12px] font-semibold text-[#4E454C] outline-none transition focus:border-[#E83D59]/50"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#887E85]" />
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-8 lg:grid-cols-4 lg:gap-x-6">
            {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mx-auto max-w-xl rounded-[28px] border border-[#F0D9DE] bg-white px-6 py-14 text-center shadow-sm sm:px-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FCE8ED]">
              <Search className="h-6 w-6 text-[#E83D59]" />
            </div>

            <h2 className="mt-5 font-[var(--font-poppins)] text-[23px] font-black text-[#302832]">
              We couldn't complete that search
            </h2>

            <p className="mx-auto mt-3 max-w-md text-[13px] leading-6 text-[#7F747C]">
              Something went wrong while looking for products. Please try again.
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-7 inline-flex h-11 items-center justify-center rounded-full bg-[#E83D59] px-6 text-[12px] font-bold text-white transition hover:bg-[#D8324E]"
            >
              Try again
            </button>
          </div>
        )}

        {/* No results */}
        {!loading && !error && total === 0 && (
          <div className="mx-auto max-w-2xl rounded-[30px] border border-dashed border-[#E5DCD3] bg-white px-6 py-16 text-center sm:px-10 sm:py-20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F7EEF2]">
              <Search className="h-7 w-7 text-[#E83D59]" />
            </div>

            <p className="mt-6 font-[var(--font-poppins)] text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#A09690]">
              Nothing here yet
            </p>

            <h2 className="mt-3 font-[var(--font-poppins)] text-[26px] font-black tracking-[-0.025em] text-[#302832] sm:text-[32px]">
              Hmm... nothing found
            </h2>

            <p className="mx-auto mt-3 max-w-md text-[13px] leading-6 text-[#7F747C] sm:text-[14px]">
              We couldn't find anything for{" "}
              <span className="font-bold text-[#4A4148]">“{urlSearch}”</span>. Try a different
              search or explore some of our collections.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-2">
              {POPULAR_SEARCHES.slice(0, 4).map((query) => (
                <button
                  key={query}
                  type="button"
                  onClick={() => handleDiscoverySearch(query)}
                  className="rounded-full border border-[#E8DED4] bg-[#FFFCF8] px-4 py-2 text-[11px] font-bold text-[#665C63] transition hover:border-[#E83D59]/30 hover:bg-[#FCE8ED] hover:text-[#C93552]"
                >
                  {query}
                </button>
              ))}
            </div>

            <Link
              href="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#E83D59] px-6 py-3 text-[12px] font-bold text-white transition hover:bg-[#D8324E]"
            >
              Browse all products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Products */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-9 lg:grid-cols-4 lg:gap-x-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <div className="mt-12 sm:mt-14">
              <ShopPagination
                page={page}
                totalPages={totalPages}
                isLoading={loading}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </section>
    </main>
  );
}
