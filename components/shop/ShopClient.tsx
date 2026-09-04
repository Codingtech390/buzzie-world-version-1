"use client";

import {
  ArrowUpDown,
  ChevronDown,
  Filter,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import ProductCard from "@/components/product/ProductCard";
import ShopPagination from "@/components/shop/ShopPagination";

import type {
  StorefrontProduct,
  StorefrontProductsResponse,
  StorefrontSelector,
  StorefrontSelectorResponse,
} from "@/types/storefront";

type ShopSort =
  | "newest"
  | "oldest"
  | "price-low"
  | "price-high"
  | "name-az"
  | "name-za";

type AgeGroup = "1–3" | "3–6" | "6–9" | "9–15" | "All Ages";

const PRODUCTS_PER_PAGE = 12;


const CATEGORY_DEFINITIONS = [
  {
    key: "binder",
    label: "Binder",
    aliases: ["binder"],
    tone: "#F2B078",
  },
  {
    key: "mythology",
    label: "Mythology",
    aliases: ["mythology", "mythological"],
    tone: "#EBCB91",
  },
  {
    key: "mind-games",
    label: "Mind Games",
    aliases: ["mind games", "mind-game", "mindgame", "logic"],
    tone: "#E9B6C5",
  },
  {
    key: "on-the-go-games",
    label: "On-the-Go Games",
    aliases: [
      "on-the-go games",
      "on the go games",
      "on-the-go",
      "travel games",
    ],
    tone: "#9CB8D0",
  },
  {
    key: "phonics",
    label: "Phonics",
    aliases: ["phonics"],
    tone: "#B9B1A8",
  },
  {
    key: "card-games",
    label: "Card Games",
    aliases: ["card games", "cards", "card-game"],
    tone: "#C391EE",
  },
  {
    key: "geography",
    label: "Geography",
    aliases: ["geography", "geographic"],
    tone: "#A8C89B",
  },
  {
    key: "return-gifts",
    label: "Return Gifts",
    aliases: ["return gifts", "return-gift", "party favors", "party favours"],
    tone: "#F2B5A0",
  },
  {
    key: "customised-products",
    label: "Customised Products",
    aliases: [
      "customised products",
      "customized products",
      "customised",
      "customized",
    ],
    tone: "#D4B8E8",
  },
] as const;

function normalizeCategoryText(value?: string) {
  return (value ?? "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[_/]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function matchesCategoryDefinition(
  category: StorefrontSelector,
  definition: (typeof CATEGORY_DEFINITIONS)[number],
) {
  const value = `${normalizeCategoryText(category.name)} ${normalizeCategoryText(
    category.slug,
  )}`;

  return definition.aliases.some((alias) =>
    value.includes(normalizeCategoryText(alias)),
  );
}

function getMatchingCategory(
  categories: StorefrontSelector[],
  definition: (typeof CATEGORY_DEFINITIONS)[number],
) {
  return categories.find((category) =>
    matchesCategoryDefinition(category, definition),
  );
}

function getCategoryProductImage(
  products: StorefrontProduct[],
  category?: StorefrontSelector,
) {
  if (!category) return null;

  const product = products.find(
    (item) =>
      item.category?._id === category._id ||
      normalizeCategoryText(item.category?.name).includes(
        normalizeCategoryText(category.name),
      ),
  );

  return product?.images?.find((image) => Boolean(image.url))?.url ?? null;
}

const AGE_GROUPS: {
  label: AgeGroup;
  caption: string;
  icon: string;
  className: string;
}[] = [
  {
    label: "1–3",
    caption: "Early Explorers",
    icon: "●",
    className: "border-[#F5B7C6] bg-[#FFF7F8] text-[#E63B5B]",
  },
  {
    label: "3–6",
    caption: "Play & Discover",
    icon: "✦",
    className: "border-[#F3C58C] bg-[#FFF9F1] text-[#E88A1A]",
  },
  {
    label: "6–9",
    caption: "Learn & Grow",
    icon: "●",
    className: "border-[#C8DDAE] bg-[#F8FBF2] text-[#5B9A35]",
  },
  {
    label: "9–15",
    caption: "Think & Master",
    icon: "✦",
    className: "border-[#CBBCE0] bg-[#FAF7FE] text-[#694D9B]",
  },
  {
    label: "All Ages",
    caption: "Curated for every age",
    icon: "✦",
    className: "border-[#D8D1C5] bg-[#FAF8F3] text-[#27314A]",
  },
];

const SORT_OPTIONS: { value: ShopSort; label: string }[] = [
  { value: "newest", label: "Featured" },
  { value: "oldest", label: "Oldest first" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name-az", label: "Name: A to Z" },
  { value: "name-za", label: "Name: Z to A" },
];

export default function ShopClient() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [categories, setCategories] = useState<StorefrontSelector[]>([]);
  const [collections, setCollections] = useState<StorefrontSelector[]>([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [collection, setCollection] = useState("");
  const [sort, setSort] = useState<ShopSort>("newest");
  const [selectedAge, setSelectedAge] = useState<AgeGroup>("All Ages");
const [selectedRatings, setSelectedRatings] = useState<number[]>([]);

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterError, setFilterError] = useState<string | null>(null);

  useEffect(() => {
    const urlPage = Number(searchParams.get("page"));

    // URL → component state synchronization is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(Number.isInteger(urlPage) && urlPage > 0 ? urlPage : 1);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch(searchParams.get("search") ?? "");

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCategory(searchParams.get("category") ?? "");

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCollection(searchParams.get("collection") ?? "");

    const urlSort = searchParams.get("sort");

    if (
      urlSort === "newest" ||
      urlSort === "oldest" ||
      urlSort === "price-low" ||
      urlSort === "price-high" ||
      urlSort === "name-az" ||
      urlSort === "name-za"
    ) {
      setSort(urlSort);
    } else {
      setSort("newest");
    }
  }, [searchParams]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSelectors() {
      try {
        setFilterLoading(true);
        setFilterError(null);

        const [categoriesResponse, collectionsResponse] =
          await Promise.all([
            fetch("/api/categories", { signal: controller.signal }),
            fetch("/api/collections", { signal: controller.signal }),
          ]);

        if (!categoriesResponse.ok || !collectionsResponse.ok) {
          throw new Error("Unable to load filters.");
        }

        const [categoriesData, collectionsData]: [
          StorefrontSelectorResponse,
          StorefrontSelectorResponse,
        ] = await Promise.all([
          categoriesResponse.json(),
          collectionsResponse.json(),
        ]);

        setCategories(categoriesData.categories ?? []);
        setCollections(collectionsData.collections ?? []);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;

        setFilterError(
          err instanceof Error ? err.message : "Unable to load filters.",
        );
      } finally {
        if (!controller.signal.aborted) setFilterLoading(false);
      }
    }

    loadSelectors();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const timeout = window.setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", String(PRODUCTS_PER_PAGE));
        params.set("status", "active");
        params.set("sort", sort);

        if (search.trim()) params.set("search", search.trim());
        if (category) params.set("category", category);
        if (collection) params.set("collection", collection);

        const response = await fetch(`/api/products?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Unable to load products.");

        const data: StorefrontProductsResponse = await response.json();

        if (!data.success) {
          throw new Error(data.message ?? "Unable to load products.");
        }

        setProducts(data.products ?? []);
        setTotalProducts(data.pagination?.total ?? 0);
        setTotalPages(data.pagination?.totalPages ?? 1);

        const url = new URL(window.location.href);

        if (page > 1) url.searchParams.set("page", String(page));
        else url.searchParams.delete("page");

        if (search.trim()) url.searchParams.set("search", search.trim());
        else url.searchParams.delete("search");

        if (category) url.searchParams.set("category", category);
        else url.searchParams.delete("category");

        if (collection) url.searchParams.set("collection", collection);
        else url.searchParams.delete("collection");

        if (sort !== "newest") url.searchParams.set("sort", sort);
        else url.searchParams.delete("sort");

        window.history.replaceState({}, "", url);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;

        setError(
          err instanceof Error ? err.message : "Unable to load products.",
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 180);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [page, search, category, collection, sort]);

  const updateSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const updateCategory = useCallback((value: string) => {
    setCategory(value);
    setPage(1);
  }, []);

  const updateCollection = useCallback((value: string) => {
    setCollection(value);
    setPage(1);
  }, []);

  const updateSort = useCallback((value: ShopSort) => {
    setSort(value);
    setPage(1);
    setShowSort(false);
  }, []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setCategory("");
    setCollection("");
    setSort("newest");
    setPage(1);
    setSelectedAge("All Ages");
    setSelectedRatings([]);
    setShowMobileFilters(false);
  }, []);

  const categoryItems = useMemo(
    () =>
      CATEGORY_DEFINITIONS.map((definition) => ({
        definition,
        category: getMatchingCategory(categories, definition),
      })),
    [categories],
  );

  const activeFilterCount =
    Number(Boolean(category)) +
    Number(Boolean(collection));

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#FCFAF7] text-[#17213D] font-[var(--font-poppins)]">
      {/* HERO */}
      <section className=" bg-[#FFFDFC]">
        <div className="mx-auto w-full max-w-[1500px] px-0 sm:px-4 lg:px-6">
          <div
            className="
        relative
        w-full
        overflow-hidden
        rounded-none
        sm:rounded-[24px]
        lg:rounded-[30px]
      "
          >
            <Image
              src="/images/banners/shop-page-banner.png"
              alt="BuzzieWorld — Shop games, books and learning toys for kids"
              width={1920}
              height={1080}
              priority
              quality={90}
              sizes="100vw"
              className="
          block
          h-auto
          w-full
          object-cover
        "
            />
          </div>
        </div>
      </section>

      {/* AGE NAVIGATION */}
      <section className="mt-10 mb-12 bg-[#FFFDFC]">
        <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-12 xl:px-16">
          {/* =========================================================
        SECTION HEADER
       ========================================================= */}

          <div className="mb-7 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-[2px] w-8 rounded-full bg-[#E72D5A]" />

                <p
                  className="
              font-[var(--font-poppins)]
              text-[9px]
              font-black
              uppercase
              tracking-[0.18em]
              text-[#E72D5A]
              sm:text-[10px]
            "
                >
                  Find their next
                </p>

                <span className="size-1.5 rounded-full bg-[#F59A23]" />
              </div>

              <h2
                className="
            mt-1.5
            font-[var(--font-roboto)]
            text-[30px]
            font-black
            leading-none
            tracking-[-0.055em]
            text-[#111111]
            sm:text-[36px]
            lg:text-[40px]
          "
              >
                Shop by age
              </h2>
            </div>

            <p
              className="
          hidden
          pb-1
          font-[var(--font-poppins)]
          text-[11px]
          font-medium
          text-[#77717B]
          sm:block
        "
            >
              Find the right fit for every stage
            </p>
          </div>

          {/* =========================================================
        AGE COLLECTION
       ========================================================= */}

          <div
            className="
        grid
        grid-cols-1
        gap-5
        sm:grid-cols-2
        lg:grid-cols-4
        lg:gap-6
        xl:gap-7
      "
          >
            {([
              {
                label: "1–3",
                displayLabel: "1–3 YEARS",
                image: "/images/shop-by-age/1-3-removebg-preview.png",
                background: "#F8D8E5",
                accent: "#E72D5A",
              },
              {
                label: "3–6",
                displayLabel: "3–6 YEARS",
                image: "/images/shop-by-age/3-6-removebg-preview.png",
                background: "#F8E5B7",
                accent: "#E99A25",
              },
              {
                label: "6–9",
                displayLabel: "6–9 YEARS",
                image: "/images/shop-by-age/6-9-removebg-preview.png",
                background: "#D9E9B8",
                accent: "#6CA83A",
              },
              {
                label: "9–15",
                displayLabel: "9–15 YEARS",
                image: "/images/shop-by-age/9-15-removebg-preview.png",
                background: "#DCD2F3",
                accent: "#7550A5",
              },
            ] as {
              label: AgeGroup;
              displayLabel: string;
              image: string;
              background: string;
              accent: string;
            }[]).map((age) => {
              const active = selectedAge === age.label;

              return (
                <button
                  key={age.label}
                  type="button"
                  onClick={() => setSelectedAge(age.label)}
                  aria-label={`Shop products for ${age.displayLabel}`}
                  aria-pressed={active}
                  className="
              group
              relative
              w-full
              text-left
              focus-visible:outline-none
            "
                >
                  {/* =================================================
                ORGANIC CATEGORY TILE
               ================================================= */}

                  <div
                    className={`
                relative
                mx-auto
                w-full
                max-w-[340px]
                overflow-hidden
                rounded-[42%_58%_48%_52%/36%_34%_66%_64%]
                px-3
                pt-3
                pb-5
                transition-all
                duration-300
                ease-out

                sm:max-w-none
                sm:px-4
                sm:pt-4
                sm:pb-6

                ${
                  active
                    ? "scale-[1.015] shadow-[0_18px_40px_rgba(40,25,50,0.14)]"
                    : "shadow-[0_8px_25px_rgba(40,25,50,0.045)] group-hover:-translate-y-1 group-hover:shadow-[0_16px_35px_rgba(40,25,50,0.10)]"
                }
              `}
                    style={{
                      backgroundColor: age.background,
                    }}
                  >
                    {/* Soft inner glow */}
                    <div
                      aria-hidden="true"
                      className="
                  pointer-events-none
                  absolute
                  -bottom-16
                  left-1/2
                  h-36
                  w-[85%]
                  -translate-x-1/2
                  rounded-full
                  bg-white/25
                  blur-xl
                "
                    />

                    {/* Image */}
                    <div className="relative z-10 flex w-full items-center justify-center">
                      <img
                        src={age.image}
                        alt={`BuzzieWorld ${age.label} collection`}
                        className="
                    block
                    h-auto
                    w-full
                    object-contain
                    transition-transform
                    duration-500
                    ease-out
                    group-hover:scale-[1.025]
                  "
                        loading="lazy"
                      />
                    </div>
                  </div>

                  {/* =================================================
                SMALL EDITORIAL ACCENT
               ================================================= */}

                  <div className="mt-3 flex items-center justify-center gap-1.5">
                    <span
                      className="h-[2px] w-5 rounded-full opacity-30"
                      style={{ backgroundColor: age.accent }}
                    />

                    <span
                      className="size-1.5 rounded-full"
                      style={{ backgroundColor: age.accent }}
                    />

                    <span
                      className="h-[2px] w-5 rounded-full opacity-30"
                      style={{ backgroundColor: age.accent }}
                    />
                  </div>

                  {/* Accessible active indicator */}
                  <span
                    aria-hidden="true"
                    className={`
                pointer-events-none
                absolute
                inset-0
                rounded-[42%_58%_48%_52%/36%_34%_66%_64%]
                border-2
                transition-opacity
                duration-300
                ${active ? "opacity-100" : "border-transparent opacity-0"}
              `}
                    style={{
                      borderColor: `${age.accent}55`,
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto w-full max-w-[1500px] px-4 pb-14 pt-7 sm:px-7 lg:px-10 lg:pt-9 xl:px-14">
        <div className="grid gap-7 lg:grid-cols-[235px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)] xl:gap-9">
          {/* SIDEBAR — BRAND INTENTIONALLY REMOVED */}
          <aside className="hidden lg:block">
            <div className="sticky top-5 overflow-hidden rounded-[20px] border border-[#E5DED4] bg-[#FFFDFC] shadow-[0_8px_28px_rgba(28,24,20,0.035)]">
              <div className="flex items-center justify-between border-b border-[#EEE8DF] px-5 py-4">
                <div>
                  <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#E72D5A]">
                    Refine
                  </p>
                  <h2 className="mt-1 text-[15px] font-black">Filters</h2>
                </div>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-full px-2.5 py-1.5 text-[8px] font-black text-[#E72D5A] hover:bg-[#FFF0F4]"
                >
                  Clear all
                </button>
              </div>

              <FilterBlock title="Shop by Age">
                <div className="grid grid-cols-2 gap-1.5">
                  {AGE_GROUPS.map((age) => (
                    <button
                      key={age.label}
                      type="button"
                      onClick={() => setSelectedAge(age.label)}
                      className={[
                        "rounded-[10px] border px-2 py-2 text-[9px] font-black transition",
                        age.className,
                        selectedAge === age.label
                          ? "ring-2 ring-[#C391EE]/25"
                          : "opacity-85 hover:opacity-100",
                      ].join(" ")}
                    >
                      {age.label}
                    </button>
                  ))}
                </div>
              </FilterBlock>

              <FilterBlock title="Category">
                {filterLoading ? (
                  <FilterSkeleton />
                ) : filterError ? (
                  <p className="text-[9px] leading-4 text-[#A05A5A]">{filterError}</p>
                ) : (
                  <div className="space-y-2.5">
                    {categoryItems.map(({ definition, category: matchedCategory }) => {
                      if (!matchedCategory) return null;

                      return (
                        <FilterCheckbox
                          key={definition.key}
                          checked={category === matchedCategory._id}
                          label={definition.label}
                          onClick={() =>
                            updateCategory(
                              category === matchedCategory._id ? "" : matchedCategory._id,
                            )
                          }
                        />
                      );
                    })}
                  </div>
                )}
              </FilterBlock>

              <FilterBlock title="Price Range">
                <div className="px-1">
                  <div className="relative h-1.5 rounded-full bg-[#E8E1D8]">
                    <div className="absolute inset-y-0 left-0 w-[80%] rounded-full bg-[#17213D]" />
                    <span className="absolute left-0 top-1/2 size-3.5 -translate-y-1/2 rounded-full border-2 border-white bg-[#17213D] shadow-md" />
                    <span className="absolute left-[80%] top-1/2 size-3.5 -translate-y-1/2 rounded-full border-2 border-white bg-[#17213D] shadow-md" />
                  </div>
                  <div className="mt-2 flex justify-between text-[9px] font-medium text-[#747987]">
                    <span>₹199</span>
                    <span>₹4,999+</span>
                  </div>
                </div>
              </FilterBlock>

              <FilterBlock title="Rating">
                <div className="space-y-2.5">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const active = selectedRatings.includes(rating);

                    return (
                      <button
                        key={rating}
                        type="button"
                        onClick={() =>
                          setSelectedRatings((current) =>
                            current.includes(rating)
                              ? current.filter((value) => value !== rating)
                              : [...current, rating],
                          )
                        }
                        className="flex w-full items-center gap-2 text-left"
                      >
                        <span
                          className={[
                            "flex size-3.5 shrink-0 items-center justify-center rounded-[4px] border",
                            active ? "border-[#C391EE] bg-[#C391EE]" : "border-[#CFC7BC] bg-white",
                          ].join(" ")}
                        >
                          {active ? (
                            <span className="text-[8px] font-black text-white">✓</span>
                          ) : null}
                        </span>

                        <span className="flex">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              size={10}
                              fill={index < rating ? "currentColor" : "none"}
                              className={index < rating ? "text-[#F2A91A]" : "text-[#D6CEC4]"}
                            />
                          ))}
                        </span>

                        <span className="text-[9px] font-medium text-[#666D7C]">& up</span>
                      </button>
                    );
                  })}
                </div>
              </FilterBlock>

              <FilterBlock title="Collection">
                {filterLoading ? (
                  <FilterSkeleton />
                ) : (
                  <div className="space-y-2.5">
                    {collections.slice(0, 5).map((item) => (
                      <FilterCheckbox
                        key={item._id}
                        checked={collection === item._id}
                        label={item.name}
                        onClick={() => updateCollection(collection === item._id ? "" : item._id)}
                      />
                    ))}
                  </div>
                )}
              </FilterBlock>

              <div className="p-5">
                <button
                  type="button"
                  onClick={() => setShowMobileFilters(false)}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#C391EE] text-[9px] font-black text-white shadow-[0_7px_18px_rgba(195,145,238,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#E72D5A]"
                >
                  <SlidersHorizontal size={12} />
                  Apply Filters
                </button>
              </div>
            </div>
          </aside>

          {/* PRODUCT AREA */}
          <section className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center gap-2.5">
              <div className="mr-auto">
                <p className="text-[9px] font-medium text-[#737A87] sm:text-[10px]">
                  Showing{" "}
                  <strong className="text-[#17213D]">
                    {loading ? "..." : totalProducts === 0 ? 0 : (page - 1) * PRODUCTS_PER_PAGE + 1}
                    –{loading ? "..." : Math.min(page * PRODUCTS_PER_PAGE, totalProducts)}
                  </strong>{" "}
                  of <strong className="text-[#17213D]">{loading ? "..." : totalProducts}</strong>{" "}
                  products
                </p>
              </div>

              <div className="relative w-full sm:w-[260px]">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7D8490]"
                />
                <input
                  value={search}
                  onChange={(event) => updateSearch(event.target.value)}
                  placeholder="Search toys, games & more..."
                  className="h-10 w-full rounded-full border border-[#DDD6CC] bg-white pl-10 pr-9 text-[10px] font-medium text-[#27314A] outline-none transition placeholder:text-[#9296A0] focus:border-[#C391EE] focus:ring-2 focus:ring-[#C391EE]/15"
                />

                {search ? (
                  <button
                    type="button"
                    onClick={() => updateSearch("")}
                    className="absolute right-2 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-[#777D88] hover:bg-[#F1EEE9]"
                    aria-label="Clear search"
                  >
                    <X size={11} />
                  </button>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => setShowMobileFilters(true)}
                className="flex h-10 items-center gap-1.5 rounded-[12px] border border-[#DDD6CC] bg-white px-3 text-[9px] font-black text-[#27314A] lg:hidden"
              >
                <Filter size={12} />
                Filter
                {activeFilterCount > 0 ? (
                  <span className="flex size-4 items-center justify-center rounded-full bg-[#E72D5A] text-[7px] text-white">
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSort((value) => !value)}
                  className="flex h-10 items-center gap-2 rounded-[12px] border border-[#DDD6CC] bg-white px-3 text-[9px] font-black text-[#27314A]"
                >
                  <ArrowUpDown size={12} />
                  Sort
                </button>

                {showSort ? (
                  <div className="absolute right-0 top-[calc(100%+7px)] z-50 w-[210px] rounded-[17px] border border-[#DED8CF] bg-white p-2 shadow-[0_15px_35px_rgba(30,25,20,0.14)]">
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => updateSort(option.value)}
                        className={[
                          "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[9px] font-bold",
                          sort === option.value
                            ? "bg-[#F5F2EE] text-[#E72D5A]"
                            : "text-[#3D4658] hover:bg-[#F8F5F1]",
                        ].join(" ")}
                      >
                        {option.label}
                        {sort === option.value ? <span>✓</span> : null}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-[20px] border border-[#E6DFD6] bg-white"
                  >
                    <div className="aspect-[0.9] animate-pulse bg-[#EEE8E0]" />
                    <div className="space-y-2 p-4">
                      <div className="h-2 w-1/2 animate-pulse rounded bg-[#EEE8E0]" />
                      <div className="h-3 w-4/5 animate-pulse rounded bg-[#EEE8E0]" />
                      <div className="h-3 w-1/3 animate-pulse rounded bg-[#EEE8E0]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-[22px] border border-[#E7C0C0] bg-[#FFF5F5] p-12 text-center">
                <p className="text-sm font-bold text-[#A44B4B]">{error}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-4 rounded-full bg-[#C391EE] px-5 py-2.5 text-[10px] font-black text-white transition hover:bg-[#E72D5A]"
                >
                  Try again
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="rounded-[22px] border border-[#E4DED5] bg-white p-12 text-center">
                <Search size={24} className="mx-auto text-[#8A92A1]" />
                <h2 className="mt-3 text-lg font-black">No products found</h2>
                <p className="mx-auto mt-1 max-w-sm text-xs text-[#747B89]">
                  Try changing your search or filters.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-full bg-[#C391EE] px-5 py-2.5 text-[10px] font-black text-white transition hover:bg-[#E72D5A]"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-4 xl:grid-cols-4 xl:gap-x-5">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                <div className="mt-10">
                  <ShopPagination
                    page={page}
                    totalPages={totalPages}
                    isLoading={loading}
                    onPageChange={setPage}
                  />
                </div>
              </>
            )}
          </section>
        </div>
      </section>

      {/* CATEGORY DISCOVERY */}
      <section className="border-y border-[#EEE7DE] bg-[#FFFDFC]">
        <div className="mx-auto w-full max-w-[1500px] px-5 py-12 sm:px-8 lg:px-12 xl:px-16">
          <div className="mb-7 flex items-end justify-between gap-5">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#E72D5A]">
                Keep exploring
              </p>

              <h2 className="mt-1 text-[30px] font-black tracking-[-0.045em] text-[#17213D] sm:text-[36px]">
                Shop by category
              </h2>

              <p className="mt-1.5 max-w-[520px] text-[11px] leading-5 text-[#737A87] sm:text-xs">
                Discover games and learning experiences designed around curiosity, creativity and
                real-world play.
              </p>
            </div>

            <Sparkles className="hidden size-7 text-[#C391EE] sm:block" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {categoryItems.map(({ definition, category: matchedCategory }) => {
              const active = category === matchedCategory?._id;
              const categoryImage = getCategoryProductImage(products, matchedCategory);

              return (
                <button
                  key={definition.key}
                  type="button"
                  disabled={!matchedCategory}
                  onClick={() => {
                    if (!matchedCategory) return;

                    updateCategory(category === matchedCategory._id ? "" : matchedCategory._id);

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  className="group min-w-0 text-left disabled:cursor-not-allowed disabled:opacity-45"
                >
                  <div
                    className={[
                      "relative overflow-hidden rounded-[22px] border bg-white transition-all duration-300",
                      active
                        ? "border-[#17213D] shadow-[0_12px_30px_rgba(23,33,61,0.13)]"
                        : "border-[#E6DED5] group-hover:-translate-y-1 group-hover:shadow-[0_14px_32px_rgba(23,33,61,0.09)]",
                    ].join(" ")}
                  >
                    <div
                      className="relative aspect-[1.08] overflow-hidden"
                      style={{ backgroundColor: definition.tone }}
                    >
                      {categoryImage ? (
                        <Image
                          src={categoryImage}
                          alt={definition.label}
                          fill
                          sizes="(max-width: 639px) 46vw, (max-width: 1023px) 30vw, 20vw"
                          className="object-contain p-5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <div className="flex size-16 items-center justify-center rounded-full bg-white/55 text-2xl font-black text-[#17213D] shadow-sm">
                            {definition.label.charAt(0)}
                          </div>
                        </div>
                      )}

                      <div className="absolute left-3 top-3">
                        <span className="rounded-full bg-white/90 px-2.5 py-1 text-[7px] font-black uppercase tracking-[0.08em] text-[#17213D] shadow-sm backdrop-blur-sm">
                          Explore
                        </span>
                      </div>
                    </div>

                    <div className="flex min-h-[70px] items-center justify-between gap-2 bg-white px-4 py-3.5">
                      <div className="min-w-0">
                        <h3 className="truncate text-[11px] font-black text-[#17213D] sm:text-xs">
                          {definition.label}
                        </h3>
                        <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.08em] text-[#8B8F98]">
                          Explore collection
                        </p>
                      </div>

                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[#E3DCD4] text-[13px] text-[#E72D5A] transition-all duration-200 group-hover:border-[#C391EE] group-hover:bg-[#C391EE] group-hover:text-white">
                        ↗
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRUST / BENEFITS */}
      <section className="mx-auto w-full max-w-[1500px] px-5 py-9 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid overflow-hidden rounded-[22px] border border-[#E6DED5] bg-white sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: "Curated Quality",
              text: "Thoughtful picks for curious young minds.",
              image: "/images/benefits-vectors/bird.png",
            },
            {
              title: "Designed to Learn",
              text: "Build skills through play and curiosity.",
              image: "/images/benefits-vectors/finance.png",
            },
            {
              title: "Fast Delivery",
              text: "Little adventures shouldn't have to wait.",
              image: "/images/benefits-vectors/car.png",
            },
            {
              title: "Easy Returns",
              text: "A shopping experience designed for parents.",
              image: "/images/benefits-vectors/happy.png",
            },
          ].map((benefit) => (
            <Benefit
              key={benefit.title}
              title={benefit.title}
              text={benefit.text}
              image={benefit.image}
            />
          ))}
        </div>
      </section>

      {/* MOBILE FILTER DRAWER */}
      {showMobileFilters ? (
        <div
          className="fixed inset-0 z-[100] bg-[#17213D]/45 backdrop-blur-[2px] lg:hidden"
          onClick={() => setShowMobileFilters(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[92vh] overflow-y-auto rounded-t-[28px] bg-white p-5 shadow-[0_-20px_50px_rgba(30,25,20,0.18)] sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.14em] text-[#E72D5A]">
                  Refine your selection
                </p>
                <h2 className="mt-1 text-lg font-black">Filters</h2>
              </div>

              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="flex size-9 items-center justify-center rounded-full bg-[#F2EEE8]"
                aria-label="Close filters"
              >
                <X size={16} />
              </button>
            </div>

            <FilterBlock title="Shop by Age">
              <div className="grid grid-cols-2 gap-2">
                {AGE_GROUPS.map((age) => (
                  <button
                    key={age.label}
                    type="button"
                    onClick={() => setSelectedAge(age.label)}
                    className={[
                      "rounded-[11px] border px-4 py-2.5 text-[10px] font-black",
                      age.className,
                      selectedAge === age.label ? "ring-2 ring-[#C391EE]/25" : "",
                    ].join(" ")}
                  >
                    {age.label}
                  </button>
                ))}
              </div>
            </FilterBlock>

            <FilterBlock title="Category">
              {categoryItems.map(({ definition, category: matchedCategory }) => {
                if (!matchedCategory) return null;

                return (
                  <FilterCheckbox
                    key={definition.key}
                    checked={category === matchedCategory._id}
                    label={definition.label}
                    onClick={() =>
                      updateCategory(category === matchedCategory._id ? "" : matchedCategory._id)
                    }
                  />
                );
              })}
            </FilterBlock>

            <FilterBlock title="Collection">
              <div className="space-y-2.5">
                {collections.map((item) => (
                  <FilterCheckbox
                    key={item._id}
                    checked={collection === item._id}
                    label={item.name}
                    onClick={() => updateCollection(collection === item._id ? "" : item._id)}
                  />
                ))}
              </div>
            </FilterBlock>

            <FilterBlock title="Rating">
              <div className="space-y-2.5">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const active = selectedRatings.includes(rating);

                  return (
                    <button
                      key={rating}
                      type="button"
                      onClick={() =>
                        setSelectedRatings((current) =>
                          current.includes(rating)
                            ? current.filter((value) => value !== rating)
                            : [...current, rating],
                        )
                      }
                      className="flex w-full items-center gap-2 text-left"
                    >
                      <span
                        className={[
                          "flex size-4 items-center justify-center rounded-[4px] border",
                          active ? "border-[#C391EE] bg-[#C391EE]" : "border-[#CFC7BC] bg-white",
                        ].join(" ")}
                      >
                        {active ? (
                          <span className="text-[8px] font-black text-white">✓</span>
                        ) : null}
                      </span>

                      <span className="flex">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            size={11}
                            fill={index < rating ? "currentColor" : "none"}
                            className={index < rating ? "text-[#F2A91A]" : "text-[#D6CEC4]"}
                          />
                        ))}
                      </span>

                      <span className="text-[10px] text-[#666D7C]">& up</span>
                    </button>
                  );
                })}
              </div>
            </FilterBlock>

            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={clearFilters}
                className="h-11 flex-1 rounded-full border border-[#D8D0C7] text-xs font-black text-[#27314A]"
              >
                Clear all
              </button>

              <button
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="h-11 flex-[1.5] rounded-full bg-[#C391EE] text-xs font-black text-white transition hover:bg-[#E72D5A]"
              >
                Show products
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function FilterBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-[#EEE8DF] px-5 py-5">
      <div className="mb-3.5 flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase tracking-[0.08em] text-[#26314A]">
          {title}
        </h3>
        <ChevronDown size={11} className="text-[#8A8199]" />
      </div>

      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function FilterSkeleton() {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="size-3.5 animate-pulse rounded bg-[#EEE8DF]" />
          <div className="h-2.5 w-20 animate-pulse rounded bg-[#EEE8DF]" />
        </div>
      ))}
    </div>
  );
}

function FilterCheckbox({
  checked,
  label,
  onClick,
}: {
  checked: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2.5 text-left transition hover:translate-x-0.5"
    >
      <span
        className={[
          "flex size-3.5 shrink-0 items-center justify-center rounded-[4px] border",
          checked
            ? "border-[#C391EE] bg-[#C391EE]"
            : "border-[#CFC7BC] bg-white",
        ].join(" ")}
      >
        {checked ? (
          <span className="text-[8px] font-black text-white">✓</span>
        ) : null}
      </span>

      <span className="min-w-0 truncate text-[9px] font-medium leading-4 text-[#3D4657]">
        {label}
      </span>
    </button>
  );
}

function Benefit({
  title,
  text,
  image,
}: {
  title: string;
  text: string;
  image: string;
}) {
  return (
    <div className="group flex min-h-[145px] flex-col items-center justify-center border-b border-[#E7DED5] px-5 py-6 text-center last:border-b-0 sm:min-h-[160px] lg:border-b-0 lg:border-r lg:last:border-r-0">
      <div className="relative flex h-[58px] w-[72px] items-center justify-center">
        <div className="absolute left-1/2 top-1/2 h-11 w-14 -translate-x-1/2 -translate-y-1/2 rounded-[46%_54%_55%_45%] bg-[#E72D5A]/7 transition duration-500 group-hover:scale-110" />
        <Image
          src={image}
          alt=""
          width={80}
          height={80}
          sizes="80px"
          className="relative z-10 h-14 w-14 object-contain transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105"
        />
      </div>

      <div className="mt-2 max-w-[210px]">
        <h3 className="text-[12px] font-bold tracking-[-0.015em] text-[#17213D] sm:text-[13px]">
          {title}
        </h3>
        <p className="mt-1 text-[10px] leading-[1.5] text-[#737A87] sm:text-[11px]">
          {text}
        </p>
      </div>
    </div>
  );
}
