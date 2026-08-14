"use client";

import type { StorefrontSelector } from "@/types/storefront";

export type ShopSort = "newest" | "oldest" | "price-low" | "price-high" | "name-az" | "name-za";

interface ShopFiltersProps {
  search: string;
  category: string;
  brand: string;
  collection: string;
  sort: ShopSort;

  categories: StorefrontSelector[];
  brands: StorefrontSelector[];
  collections: StorefrontSelector[];

  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onBrandChange: (value: string) => void;
  onCollectionChange: (value: string) => void;
  onSortChange: (value: ShopSort) => void;
  onClear: () => void;
}

export default function ShopFilters({
  search,
  category,
  brand,
  collection,
  sort,
  categories,
  brands,
  collections,
  onSearchChange,
  onCategoryChange,
  onBrandChange,
  onCollectionChange,
  onSortChange,
  onClear,
}: ShopFiltersProps) {
  const hasFilters =
    Boolean(search.trim()) ||
    Boolean(category) ||
    Boolean(brand) ||
    Boolean(collection) ||
    sort !== "newest";

  return (
    <div className="rounded-3xl border border-[#F8EFD8] bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[1.5fr_repeat(4,1fr)_auto] lg:items-end">
        <div>
          <label
            htmlFor="shop-search"
            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Search
          </label>

          <input
            id="shop-search"
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search toys, books, games..."
            autoComplete="off"
            className="h-11 w-full rounded-xl border border-[#F8EFD8] bg-[#FFFDF9] px-4 text-sm outline-none transition focus:border-[#3F7DFF] focus:ring-2 focus:ring-[#3F7DFF]/10"
          />
        </div>

        <div>
          <label
            htmlFor="shop-category"
            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Category
          </label>

          <select
            id="shop-category"
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="h-11 w-full rounded-xl border border-[#F8EFD8] bg-[#FFFDF9] px-3 text-sm outline-none focus:border-[#3F7DFF]"
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
            htmlFor="shop-brand"
            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Brand
          </label>

          <select
            id="shop-brand"
            value={brand}
            onChange={(event) => onBrandChange(event.target.value)}
            className="h-11 w-full rounded-xl border border-[#F8EFD8] bg-[#FFFDF9] px-3 text-sm outline-none focus:border-[#3F7DFF]"
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
            htmlFor="shop-collection"
            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Collection
          </label>

          <select
            id="shop-collection"
            value={collection}
            onChange={(event) => onCollectionChange(event.target.value)}
            className="h-11 w-full rounded-xl border border-[#F8EFD8] bg-[#FFFDF9] px-3 text-sm outline-none focus:border-[#3F7DFF]"
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
            htmlFor="shop-sort"
            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
          >
            Sort
          </label>

          <select
            id="shop-sort"
            value={sort}
            onChange={(event) => onSortChange(event.target.value as ShopSort)}
            className="h-11 w-full rounded-xl border border-[#F8EFD8] bg-[#FFFDF9] px-3 text-sm outline-none focus:border-[#3F7DFF]"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-az">Name: A–Z</option>
            <option value="name-za">Name: Z–A</option>
          </select>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="h-11 rounded-xl px-4 text-sm font-semibold text-[#3F7DFF] transition hover:bg-[#3F7DFF]/5"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
