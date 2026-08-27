import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, SlidersHorizontal } from "lucide-react";

import ProductCard from "@/components/product/ProductCard";

type AgeGroup = {
  age: string;
  title: string;
  description: string;
  slug: string;
  image: string;
  tone: string;
  accent: string;
};

const ageGroups = [
  {
    age: "1–3 YEARS",
    title: "Early Explorers",
    description: "Simple, safe play for little learners.",
    slug: "1-3-years",
    image: "/images/shop-by-age/1.avif",
    banner: "/images/shop-by-age/1-3-banner.png",
    tone: "#F8D8E5",
    accent: "#E72D5A",
  },

  {
    age: "3–6 YEARS",
    title: "Play & Discover",
    description: "Hands-on fun that sparks imagination.",
    slug: "3-6-years",
    image: "/images/shop-by-age/2.avif",
    banner: "/images/shop-by-age/3-6-banner.png",
    tone: "#F8E5B7",
    accent: "#E99A25",
  },

  {
    age: "6–9 YEARS",
    title: "Learn & Grow",
    description: "Build skills through curiosity and play.",
    slug: "6-9-years",
    image: "/images/shop-by-age/3.avif",
    banner: "/images/shop-by-age/6-9-banner.png",
    tone: "#D9E9B8",
    accent: "#6CA83A",
  },

  {
    age: "9–15 YEARS",
    title: "Think & Master",
    description: "Challenges for curious, growing minds.",
    slug: "9-15-years",
    image: "/images/shop-by-age/4.avif",
    banner: "/images/shop-by-age/9-15-banner.png",
    tone: "#DCD2F3",
    accent: "#7550A5",
  },
] as const;

export async function generateStaticParams() {
  return ageGroups.map((group) => ({
    slug: group.slug,
  }));
}

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AgeShopPage({ params }: PageProps) {
  const { slug } = await params;

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

  return (
    <main className="min-h-screen overflow-hidden bg-white">
      {/* =========================================================
          BREADCRUMB
      ========================================================= */}
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

      {/* =========================================================
          AGE HERO
      ========================================================= */}
      <section className="mx-auto mt-2 w-full max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="relative w-full overflow-hidden rounded-[24px] sm:rounded-[30px] lg:rounded-[38px]">
          <Image
            src={ageGroup.banner}
            alt={`${ageGroup.title} — ${ageGroup.age}`}
            width={1920}
            height={720}
            priority
            sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(100vw - 48px), calc(100vw - 64px)"
            className="
        block
        h-auto
        w-full
        object-cover
      "
          />
        </div>
      </section>

      {/* =========================================================
          PRODUCTS HEADER
      ========================================================= */}
      <section className="mx-auto w-full max-w-[1320px] px-5 pb-16 pt-14 sm:px-8 sm:pt-16 lg:px-10 lg:pt-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="h-[2px] w-8 rounded-full"
                style={{ backgroundColor: ageGroup.accent }}
              />

              <span
                className="font-[var(--font-poppins)] text-[9px] font-black uppercase tracking-[0.18em]"
                style={{ color: ageGroup.accent }}
              >
                Handpicked for them
              </span>
            </div>

            <h2 className="mt-4 font-[var(--font-roboto)] text-[clamp(2rem,4vw,3.35rem)] font-black leading-[0.95] tracking-[-0.055em] text-[#111111]">
              Made for{" "}
              <span style={{ color: ageGroup.accent }}>{ageGroup.title.toLowerCase()}.</span>
            </h2>

            <p className="mt-4 max-w-[550px] font-[var(--font-poppins)] text-[13px] leading-6 text-[#737987] sm:text-[14px]">
              Discover games, activities and learning experiences selected especially for children
              aged {ageGroup.age.toLowerCase()}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-[#E7E3EA] bg-white px-5 font-[var(--font-poppins)] text-[11px] font-bold text-[#343847] shadow-sm transition hover:border-[#C391EE]"
            >
              <SlidersHorizontal className="size-4" />
              Filters
            </button>

            <button
              type="button"
              className="inline-flex h-11 items-center gap-3 rounded-full border border-[#E7E3EA] bg-white px-5 font-[var(--font-poppins)] text-[11px] font-bold text-[#343847] shadow-sm transition hover:border-[#C391EE]"
            >
              Sort by: Best Selling
              <ChevronDown className="size-4" />
            </button>
          </div>
        </div>

        {/* =======================================================
            PRODUCT AREA
        ======================================================= */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          {/* Desktop filter */}
          <aside className="hidden rounded-[24px] border border-[#ECE8EF] bg-white p-5 shadow-[0_10px_35px_rgba(31,25,45,0.04)] lg:block">
            <div className="flex items-center justify-between">
              <h3 className="font-[var(--font-roboto)] text-lg font-black text-[#111111]">
                Filters
              </h3>

              <SlidersHorizontal className="size-4 text-[#7B7184]" />
            </div>

            <div className="my-5 h-px bg-[#EEEAF0]" />

            <div>
              <p className="font-[var(--font-poppins)] text-[11px] font-black uppercase tracking-[0.12em] text-[#55515B]">
                Age
              </p>

              <div className="mt-4 space-y-3">
                {ageGroups.map((group) => {
                  const active = group.slug === ageGroup.slug;

                  return (
                    <Link
                      key={group.slug}
                      href={`/shop/age/${group.slug}`}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 font-[var(--font-poppins)] text-[11px] font-semibold transition ${
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

            <div className="my-5 h-px bg-[#EEEAF0]" />

            <div>
              <p className="font-[var(--font-poppins)] text-[11px] font-black uppercase tracking-[0.12em] text-[#55515B]">
                Categories
              </p>

              <div className="mt-4 space-y-3 font-[var(--font-poppins)] text-[11px] text-[#70707A]">
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="accent-[#C391EE]" />
                  All products
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-[#C391EE]" />
                  Games
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-[#C391EE]" />
                  Learning
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" className="accent-[#C391EE]" />
                  Activity kits
                </label>
              </div>
            </div>

            <div className="my-5 h-px bg-[#EEEAF0]" />

            <div>
              <p className="font-[var(--font-poppins)] text-[11px] font-black uppercase tracking-[0.12em] text-[#55515B]">
                Price range
              </p>

              <div className="mt-4 h-1 rounded-full bg-[#E9DDF2]">
                <div className="relative h-full w-[70%] rounded-full bg-[#C391EE]">
                  <span className="absolute -right-1.5 -top-1.5 size-4 rounded-full border-2 border-[#C391EE] bg-white" />
                  <span className="absolute -left-1.5 -top-1.5 size-4 rounded-full border-2 border-[#C391EE] bg-white" />
                </div>
              </div>

              <div className="mt-3 flex justify-between font-[var(--font-poppins)] text-[10px] text-[#77717D]">
                <span>₹0</span>
                <span>₹5,000+</span>
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="min-w-0">
            {/* IMPORTANT:
                Replace this fetch section with the same backend product
                retrieval/filtering already used by your existing Shop page.

                The UI below intentionally uses your existing ProductCard.
            */}

            <AgeProducts slug={ageGroup.slug} ageLabel={ageGroup.age} />
          </div>
        </div>
      </section>
    </main>
  );
}

/* ===============================================================
   PRODUCTS

   This keeps the age page independent while using your existing
   ProductCard. It expects your existing API to accept the age slug.

   If your existing shop API uses a different parameter name,
   change ONLY the URL below.
=============================================================== */

async function AgeProducts({ slug, ageLabel }: { slug: string; ageLabel: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let products: any[] = [];

  try {
    const response = await fetch(`${baseUrl}/api/products?age=${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();

      products = data?.products ?? data?.data?.products ?? data?.data ?? [];
    }
  } catch {
    products = [];
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-[var(--font-poppins)] text-[11px] text-[#85808B]">
            {products.length} products
          </p>

          <h3 className="mt-1 font-[var(--font-roboto)] text-xl font-black tracking-[-0.035em] text-[#111111]">
            Products for {ageLabel.toLowerCase()}
          </h3>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product._id ?? product.id ?? product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-[#DED6E5] px-6 py-20 text-center">
          <p className="font-[var(--font-poppins)] text-[11px] font-black uppercase tracking-[0.15em] text-[#C391EE]">
            Coming soon
          </p>

          <h3 className="mt-3 font-[var(--font-roboto)] text-2xl font-black tracking-[-0.04em] text-[#111111]">
            More products are on the way.
          </h3>

          <p className="mx-auto mt-3 max-w-md font-[var(--font-poppins)] text-[13px] leading-6 text-[#77717D]">
            We&apos;re preparing more products specially selected for
            {` ${ageLabel.toLowerCase()}`}.
          </p>

          <Link
            href="/shop"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#C391EE] px-5 font-[var(--font-poppins)] text-[11px] font-black text-white shadow-[0_10px_25px_rgba(195,145,238,0.2)] transition hover:-translate-y-0.5 hover:bg-[#A96FDB]"
          >
            Browse all products
            <ArrowRight className="size-4" />
          </Link>
        </div>
      )}
    </>
  );
}
