import Image from "next/image";

import Link from "next/link";

import { ArrowRight, SlidersHorizontal } from "lucide-react";

import type { Metadata } from "next";

import ProductCard from "@/components/product/ProductCard";

import { createPageMetadata } from "@/lib/seo";

interface AgePageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    category?: string | string[];
  }>;
}

type ShopCategory = {
  _id: string;

  name: string;

  slug: string;
};

type AgeGroup = {
  age: string;

  title: string;

  description: string;

  slug: string;

  minAge: number;

  maxAge: number;

  image: string;

  banner: string;

  tone: string;

  accent: string;
};

type ShopProduct = {
  _id?: string;

  id?: string;

  slug?: string;

  [key: string]: unknown;
};

const ageGroups = [
  {
    age: "1–3 YEARS",
    minAge: 1,
    maxAge: 3,
    title: "Early Explorers",
    description: "Simple, safe play for little learners.",
    slug: "1-3-years",
    image: "/images/shop-by-age/1.avif",
    banner: "/images/shop-by-age/Shop-by-age-1-3-banner.png",
    tone: "#F8D8E5",
    accent: "#E72D5A",
  },

  {
    age: "3–6 YEARS",
    minAge: 3,
    maxAge: 6,
    title: "Play & Discover",
    description: "Hands-on fun that sparks imagination.",
    slug: "3-6-years",
    image: "/images/shop-by-age/2.avif",
    banner: "/images/shop-by-age/Shop-by-age-3+banner.png",
    tone: "#F8E5B7",
    accent: "#E99A25",
  },

  {
    age: "6–9 YEARS",
    minAge: 6,
    maxAge: 9,
    title: "Learn & Grow",
    description: "Build skills through curiosity and play.",
    slug: "6-9-years",
    image: "/images/shop-by-age/3.avif",
    banner: "/images/shop-by-age/Shop-by-age-6+banner.png",
    tone: "#D9E9B8",
    accent: "#6CA83A",
  },

  {
    age: "9–15 YEARS",
    minAge: 9,
    maxAge: 15,
    title: "Think & Master",
    description: "Challenges for curious, growing minds.",
    slug: "9-15-years",
    image: "/images/shop-by-age/4.avif",
    banner: "/images/shop-by-age/Shop-by-age-8+banner.png",
    tone: "#DCD2F3",
    accent: "#7550A5",
  },
] as const satisfies readonly AgeGroup[];

function getSiteBaseUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredUrl) return configuredUrl.replace(/\/$/, "");

  const vercelUrl = process.env.VERCEL_URL?.trim();

  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}

function extractCategories(payload: unknown): ShopCategory[] {
  const value = payload as {
    categories?: unknown;

    data?: { categories?: unknown } | unknown;
  } | null;

  let items: unknown;

  if (Array.isArray(payload)) {
    items = payload;
  } else if (value && Array.isArray(value.categories)) {
    items = value.categories;
  } else if (
    value?.data &&
    typeof value.data === "object" &&
    "categories" in value.data &&
    Array.isArray(value.data.categories)
  ) {
    items = value.data.categories;
  } else if (value && Array.isArray(value.data)) {
    items = value.data;
  } else {
    items = [];
  }

  return (items as unknown[]).filter((item): item is ShopCategory => {
    if (!item || typeof item !== "object") return false;

    const category = item as Partial<ShopCategory>;

    return (
      typeof category._id === "string" &&
      typeof category.name === "string" &&
      typeof category.slug === "string"
    );
  });
}

async function getShopCategories(): Promise<ShopCategory[]> {
  try {
    const response = await fetch(`${getSiteBaseUrl()}/api/categories`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to load categories: ${response.status} ${response.statusText}`);

      return [];
    }

    return extractCategories(await response.json());
  } catch (error) {
    console.error("Unable to fetch shop categories:", error);

    return [];
  }
}

export async function generateMetadata({ params }: AgePageProps): Promise<Metadata> {
  const { slug } = await params;

  const ageLabel = slug.replace(/-/g, " ").replace(/\b\w/g, (character) => character.toUpperCase());

  return createPageMetadata({
    title: `Toys for ${ageLabel}`,

    description: `Explore age-appropriate toys, games and learning products for ${ageLabel} at BuzzieWorld.`,

    path: `/shop/age/${slug}`,
  });
}

export async function generateStaticParams() {
  return ageGroups.map((group) => ({ slug: group.slug }));
}

export default async function AgeShopPage({ params, searchParams }: AgePageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const categoryParam = Array.isArray(query.category) ? query.category[0] : query.category;
  const selectedCategoryId = categoryParam?.trim() || "";

  const ageGroup = ageGroups.find((group) => group.slug === slug);

  if (!ageGroup) {
    return (
      <main className="min-h-screen bg-white px-5 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="font-[var(--font-poppins)] text-xs font-black uppercase tracking-[0.18em] text-[#E72D5A]">
            BuzzieWorld
          </p>

          <h1 className="mt-4 font-[var(--font-roboto)] text-4xl font-black tracking-[-0.045em] text-[#111111] sm:text-6xl">
            Age group not found.
          </h1>

          <Link
            href="/shop"
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#C391EE] px-6 font-[var(--font-poppins)] text-sm font-black text-white transition hover:bg-[#A96FDB]"
          >
            Back to shop
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    );
  }

  const categories = await getShopCategories();

  return (
    <main className="min-h-screen overflow-hidden bg-white">
      {/* Breadcrumb */}

      <div className="mx-auto w-full max-w-[1320px] px-5 pt-6 sm:px-8 lg:px-10">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 font-[var(--font-poppins)] text-[11px] font-medium text-[#747887]"
        >
          <Link href="/" className="transition-colors hover:text-[#111111]">
            Home
          </Link>

          <span>/</span>

          <Link href="/shop" className="transition-colors hover:text-[#111111]">
            Shop
          </Link>

          <span>/</span>

          <span className="text-[#111111]">{ageGroup.title}</span>
        </nav>
      </div>

      {/* Age hero */}

      <section className="mt-2 w-full">
        <div className="relative w-full overflow-hidden rounded-none sm:rounded-none lg:rounded-none">
          <Image
            src={ageGroup.banner}
            alt={`${ageGroup.title} — ${ageGroup.age}`}
            width={1920}
            height={720}
            priority
            sizes="100vw"
            className="block h-auto w-full object-cover"
          />
        </div>
      </section>

      {/* Products header */}

      <section className="mx-auto w-full max-w-[1320px] px-5 pb-12 pt-5 sm:px-8 sm:pt-7 lg:px-10 lg:pt-9">
        <div className="flex w-full flex-col items-center justify-center gap-6 text-center">
          <div className="w-full text-center">
            <h2 className="mt-0 font-roboto uppercase text-[clamp(2rem,6vw,8rem)] font-black leading-[0.95] tracking-[-0.055em] text-[#111111]">
              Made for{" "}
              <span style={{ color: ageGroup.accent }}>{ageGroup.title.toLowerCase()}.</span>
            </h2>
          </div>
        </div>

        {/* Product area */}

        <div className="mt-6 grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* Desktop filters */}

          <aside className="hidden self-start rounded-[24px] border border-[#ECE8EF] bg-white p-4 font-roboto shadow-[0_10px_35px_rgba(31,25,45,0.04)] lg:block">
            <div className="flex items-center justify-between">
              <h3 className="font-roboto text-lg uppercase font-black text-[#111111] text-[28px]">
                Filters
              </h3>

              <SlidersHorizontal className="size-4 text-[#7B7184]" />
            </div>

            <div className="my-3 h-px bg-[#EEEAF0]" />

            {/* Age filter */}
            <div>
              <p className="font-roboto text-[13px] font-black uppercase tracking-[0.1em] text-[#55515B]">
                Age
              </p>

              <div className="mt-2 space-y-1">
                {ageGroups.map((group) => {
                  const active = group.slug === ageGroup.slug;

                  return (
                    <Link
                      key={group.slug}
                      href={`/shop/age/${group.slug}`}
                      className={`flex items-center justify-between rounded-xl px-3 py-1.5 font-roboto text-[14px] font-semibold transition ${
                        active ? "bg-[#F5EEFA] text-[#111111]" : "text-[#70707A] hover:bg-[#FAF8FB]"
                      }`}
                    >
                      <span>{group.age}</span>

                      {active && (
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: group.accent }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="my-3 h-px bg-[#EEEAF0]" />

            {/* Dynamic categories */}
            <div>
              <p className="font-roboto text-[14px] font-black uppercase tracking-[0.1em] text-[#55515B]">
                Categories
              </p>

              <div className="mt-2 space-y-1.5 font-roboto text-[14px] text-[#70707A]">
                <Link
                  href={`/shop/age/${ageGroup.slug}`}
                  aria-current={!selectedCategoryId ? "page" : undefined}
                  className={`flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-[#FAF8FB] ${
                    !selectedCategoryId ? "bg-[#F5EEFA] font-bold text-[#111111]" : ""
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex size-4 shrink-0 items-center justify-center rounded-[4px] border ${
                      !selectedCategoryId
                        ? "border-[#C391EE] bg-[#C391EE] text-white"
                        : "border-[#C9C2D0] bg-white"
                    }`}
                  >
                    {!selectedCategoryId ? (
                      <span className="text-[11px] leading-none">✓</span>
                    ) : null}
                  </span>
                  <span>All products</span>
                </Link>

                {categories.length > 0 ? (
                  categories.map((category) => {
                    const active = selectedCategoryId === category._id;
                    const href = active
                      ? `/shop/age/${ageGroup.slug}`
                      : `/shop/age/${ageGroup.slug}?category=${encodeURIComponent(category._id)}`;

                    return (
                      <Link
                        key={category._id}
                        href={href}
                        aria-current={active ? "page" : undefined}
                        aria-label={`${category.name}${active ? ", selected. Click to clear filter" : ", filter products by this category"}`}
                        className={`flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-[#FAF8FB] ${
                          active ? "bg-[#F5EEFA] font-bold text-[#111111]" : ""
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`flex size-4 shrink-0 items-center justify-center rounded-[4px] border ${
                            active
                              ? "border-[#C391EE] bg-[#C391EE] text-white"
                              : "border-[#C9C2D0] bg-white"
                          }`}
                        >
                          {active ? <span className="text-[11px] leading-none">✓</span> : null}
                        </span>
                        <span className="min-w-0 break-words">{category.name}</span>
                      </Link>
                    );
                  })
                ) : (
                  <p className="px-2 py-1 text-[11px] text-[#85808B]">
                    Categories are currently unavailable.
                  </p>
                )}
              </div>
            </div>

            <div className="my-3 h-px bg-[#EEEAF0]" />
          </aside>

          {/* Products */}

          <div className="min-w-0">
            <AgeProducts
              slug={ageGroup.slug}
              ageLabel={ageGroup.age}
              minAge={ageGroup.minAge}
              maxAge={ageGroup.maxAge}
              categoryId={selectedCategoryId}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

async function AgeProducts({
  slug,

  ageLabel,

  minAge,

  maxAge,
  categoryId,
}: {
  slug: string;

  ageLabel: string;

  minAge: number;

  maxAge: number;

  categoryId: string;
}) {
  let products: ShopProduct[] = [];

  try {
    const productParams = new URLSearchParams({
      published: "true",
      limit: "100",
      ageMin: String(minAge),
      ageMax: String(maxAge),
    });

    if (categoryId) {
      productParams.set("category", categoryId);
    }

    const response = await fetch(`${getSiteBaseUrl()}/api/products?${productParams.toString()}`, {
      cache: "no-store",
    });

    if (response.ok) {
      const data: unknown = await response.json();

      const payload = data as {
        products?: unknown;

        data?: { products?: unknown } | unknown;
      } | null;

      const candidate =
        payload && Array.isArray(payload.products)
          ? payload.products
          : payload?.data &&
              typeof payload.data === "object" &&
              "products" in payload.data &&
              Array.isArray(payload.data.products)
            ? payload.data.products
            : payload && Array.isArray(payload.data)
              ? payload.data
              : [];

      products = candidate as ShopProduct[];
    } else {
      console.error(`Failed to load age products: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("Unable to fetch age products:", error);
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-[var(--font-poppins)] text-[13px] text-[#85808B]">
            {products.length} products
          </p>

          <h3 className="mt-1 font-playpen text-xl font-black tracking-[-0.035em] text-[#111111]">
            Products for {ageLabel.toLowerCase()}
            {categoryId ? " · filtered by category" : ""}
          </h3>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-7">
          {products.map((product, index) => (
            <ProductCard
              key={product._id ?? product.id ?? product.slug ?? `${slug}-${index}`}
              product={product as never}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-[#DED6E5] px-6 py-20 text-center">
          <p className="font-[var(--font-poppins)] text-[11px] font-black uppercase tracking-[0.15em] text-[#C391EE]">
            Coming soon
          </p>

          <h3 className="mt-3 font-playpen text-2xl font-black tracking-[-0.04em] text-[#111111]">
            More products are on the way.
          </h3>



          <Link
            href="/shop"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#C391EE] px-5 font-[var(--font-poppins)] text-[11px] font-black !text-white shadow-[0_10px_25px_rgba(195,145,238,0.2)] transition hover:-translate-y-0.5 hover:bg-[#A96FDB]"
          >
            Browse all products
            <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </>
  );
}
