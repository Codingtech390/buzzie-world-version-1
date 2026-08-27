"use client";

import { ChevronDown, Filter, RotateCcw, Search, SlidersHorizontal } from "lucide-react";

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
    <section
      aria-label="Shop filters"
      className="relative overflow-hidden rounded-[30px] border border-[#EEDDBB]/70 bg-white/90 p-4 shadow-[0_16px_45px_rgba(39,52,74,0.06)] backdrop-blur-xl sm:p-5"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 size-56 rounded-full bg-[#3F7DFF]/6 blur-3xl"
      />

      <div className="relative">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-[#FFF8EC] text-[#3F7DFF]">
              <SlidersHorizontal className="size-4" />
            </span>

            <div>
              <p className="font-[var(--font-roboto)] text-sm font-black text-[#27344A]">
                Refine the adventure
              </p>

              <p className="mt-0.5 text-[0.68rem] text-[#99A1AF]">
                Find exactly what they&apos;ll love.
              </p>
            </div>
          </div>

          {hasFilters ? (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold text-[#3F7DFF] transition hover:bg-[#3F7DFF]/6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7DFF] focus-visible:ring-offset-2"
            >
              <RotateCcw className="size-3.5" />
              Reset
            </button>
          ) : null}
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.6fr_repeat(4,minmax(0,1fr))]">
          {/* Search */}
          <div className="lg:col-span-1">
            <label
              htmlFor="shop-search"
              className="mb-1.5 block text-[0.63rem] font-bold uppercase tracking-[0.14em] text-[#687489]"
            >
              Search
            </label>

            <div className="relative">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#99A1AF]"
              />

              <input
                id="shop-search"
                type="search"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Toys, books, games..."
                autoComplete="off"
                className="h-11 w-full rounded-2xl border border-[#EEDDBB]/80 bg-[#FFFDF9] pl-10 pr-4 text-sm text-[#27344A] outline-none transition-all placeholder:text-[#99A1AF] hover:border-[#EEDDBB] focus:border-[#3F7DFF]/40 focus:bg-white focus:ring-4 focus:ring-[#3F7DFF]/8"
              />
            </div>
          </div>

          <FilterSelect
            id="shop-category"
            label="Category"
            value={category}
            placeholder="All categories"
            items={categories}
            onChange={onCategoryChange}
          />

          <FilterSelect
            id="shop-brand"
            label="Brand"
            value={brand}
            placeholder="All brands"
            items={brands}
            onChange={onBrandChange}
          />

          <FilterSelect
            id="shop-collection"
            label="Collection"
            value={collection}
            placeholder="All collections"
            items={collections}
            onChange={onCollectionChange}
          />

          <div>
            <label
              htmlFor="shop-sort"
              className="mb-1.5 block text-[0.63rem] font-bold uppercase tracking-[0.14em] text-[#687489]"
            >
              Sort
            </label>

            <div className="relative">
              <select
                id="shop-sort"
                value={sort}
                onChange={(event) => onSortChange(event.target.value as ShopSort)}
                className="h-11 w-full appearance-none rounded-2xl border border-[#EEDDBB]/80 bg-[#FFFDF9] px-3.5 pr-10 text-sm text-[#27344A] outline-none transition-all hover:border-[#EEDDBB] focus:border-[#3F7DFF]/40 focus:bg-white focus:ring-4 focus:ring-[#3F7DFF]/8"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Name: A–Z</option>
                <option value="name-za">Name: Z–A</option>
              </select>

              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#687489]"
              />
            </div>
          </div>
        </div>

        {hasFilters ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#EEDDBB]/50 pt-4">
            <div className="flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#99A1AF]">
              <Filter className="size-3.5" />
              Active
            </div>

            {search.trim() ? <ActiveFilter label={`Search: ${search.trim()}`} /> : null}

            {category ? <ActiveFilter label="Category selected" /> : null}

            {brand ? <ActiveFilter label="Brand selected" /> : null}

            {collection ? <ActiveFilter label="Collection selected" /> : null}

            {sort !== "newest" ? <ActiveFilter label="Custom sorting" /> : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function FilterSelect({
  id,
  label,
  value,
  placeholder,
  items,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  items: StorefrontSelector[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[0.63rem] font-bold uppercase tracking-[0.14em] text-[#687489]"
      >
        {label}
      </label>

      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-2xl border border-[#EEDDBB]/80 bg-[#FFFDF9] px-3.5 pr-10 text-sm text-[#27344A] outline-none transition-all hover:border-[#EEDDBB] focus:border-[#3F7DFF]/40 focus:bg-white focus:ring-4 focus:ring-[#3F7DFF]/8"
        >
          <option value="">{placeholder}</option>

          {items.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>

        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#687489]"
        />
      </div>
    </div>
  );
}

function ActiveFilter({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-[#F1F5FF] px-3 py-1.5 text-[0.65rem] font-semibold text-[#526075]">
      {label}
    </span>
  );
}
