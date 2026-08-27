import type {
  StorefrontProduct,
  StorefrontProductsResponse,
  StorefrontSelector,
} from "@/types/storefront";

import BrandStory from "@/components/home/BrandStory";
import BenefitsStrip from "@/components/home/BenefitsStrip";
import BestSellers from "@/components/home/BestSellers";
import CategoryShowcase from "@/components/home/CategoryShowcase";
import CollectionShowcase from "@/components/home/CollectionShowcase";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Hero from "@/components/home/Hero";
import KingdomBanner from "@/components/home/KingdomBanner";
import Newsletter from "@/components/home/Newsletter";
import ReviewsShowcase from "@/components/home/ReviewsShowcase";
import ShopByAge from "@/components/home/ShopByAge";

interface HomepageData {
  featuredProducts: StorefrontProduct[];
  latestProducts: StorefrontProduct[];
  categories: StorefrontSelector[];
  collections: StorefrontSelector[];
}

const EMPTY_DATA: HomepageData = {
  featuredProducts: [],
  latestProducts: [],
  categories: [],
  collections: [],
};

function getApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  );
}

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function getHomepageData(): Promise<HomepageData> {
  const [featuredResponse, latestResponse, categoriesResponse, collectionsResponse] =
    await Promise.all([
      fetchJson<StorefrontProductsResponse>(
        "/api/products?status=active&featured=true&sort=newest&page=1&limit=8",
      ),

      fetchJson<StorefrontProductsResponse>(
        "/api/products?status=active&sort=newest&page=1&limit=8",
      ),

      fetchJson<{
        success: boolean;
        categories?: StorefrontSelector[];
      }>("/api/categories"),

      fetchJson<{
        success: boolean;
        collections?: StorefrontSelector[];
      }>("/api/collections"),
    ]);

  return {
    featuredProducts:
      featuredResponse?.success && featuredResponse.products ? featuredResponse.products : [],

    latestProducts:
      latestResponse?.success && latestResponse.products ? latestResponse.products : [],

    categories:
      categoriesResponse?.success && categoriesResponse.categories
        ? categoriesResponse.categories
        : [],

    collections:
      collectionsResponse?.success && collectionsResponse.collections
        ? collectionsResponse.collections
        : [],
  };
}

export default async function HomePage() {
  const data = await getHomepageData();

  const homepageData =
    data.featuredProducts.length ||
    data.latestProducts.length ||
    data.categories.length ||
    data.collections.length
      ? data
      : EMPTY_DATA;

  return (
    <main id="main-content" className="min-w-0 overflow-hidden bg-[#f7f4ec]">
      {/* ================================================================
          HERO
         ================================================================ */}

      <Hero products={homepageData.featuredProducts} />

      {/* ================================================================
          BENEFITS
         ================================================================ */}

      <BenefitsStrip />

      {/* ================================================================
          SHOP BY AGE
         ================================================================ */}

      <ShopByAge products={homepageData.latestProducts} />

      {/* ================================================================
          CATEGORIES
         ================================================================ */}

      <CategoryShowcase categories={homepageData.categories} />

      {/* ================================================================
          FEATURED PRODUCTS
         ================================================================ */}

      <FeaturedProducts products={homepageData.featuredProducts} />

      {/* ================================================================
          KINGDOM BANNER
         ================================================================ */}

      <KingdomBanner />

      {/* ================================================================
          COLLECTIONS
         ================================================================ */}

      <CollectionShowcase collections={homepageData.collections} />

      {/* ================================================================
          BEST SELLERS
         ================================================================ */}

      <BestSellers
        products={homepageData.latestProducts}
        featuredProducts={homepageData.featuredProducts}
      />

      {/* ================================================================
          REVIEWS
         ================================================================ */}

      <ReviewsShowcase />

      {/* ================================================================
          BRAND STORY
         ================================================================ */}

      <BrandStory products={homepageData.featuredProducts} />

      {/* ================================================================
          NEWSLETTER
         ================================================================ */}

      <Newsletter />
    </main>
  );
}
