import type {
  StorefrontProduct,
  StorefrontProductsResponse,
  StorefrontSelector,
} from "@/types/storefront";

import BenefitsStrip from "@/components/home/BenefitsStrip";
import BrandStory from "@/components/home/BrandStory";
import CollectionShowcase from "@/components/home/CollectionShowcase";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Hero from "@/components/home/Hero";
import KingdomBanner from "@/components/home/KingdomBanner";
import Newsletter from "@/components/home/Newsletter";
import ReviewsShowcase from "@/components/home/ReviewsShowcase";
import ShopByAge from "@/components/home/ShopByAge";
// import FollowUsSection from "@/components/home/FollowUsSection";


import { DEFAULT_HERO_SLIDES, type HeroCarouselSlide } from "@/types/homepage";

interface HomepageFavoritesResponse {
  success: boolean;
  products?: StorefrontProduct[];
  message?: string;
}

interface HomepageData {
  featuredProducts: StorefrontProduct[];
  latestProducts: StorefrontProduct[];
  favoriteProducts: StorefrontProduct[];
  categories: StorefrontSelector[];
  collections: StorefrontSelector[];
  heroSlides: HeroCarouselSlide[];
}

const EMPTY_DATA: HomepageData = {
  featuredProducts: [],
  latestProducts: [],
  favoriteProducts: [],
  categories: [],
  collections: [],
  heroSlides: DEFAULT_HERO_SLIDES,
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
  const [
    featuredResponse,
    latestResponse,
    favoritesResponse,
    categoriesResponse,
    collectionsResponse,
    heroSlidesResponse,
  ] = await Promise.all([
    fetchJson<StorefrontProductsResponse>(
      "/api/products?published=true&featured=true&sort=newest&page=1&limit=8",
    ),

    fetchJson<StorefrontProductsResponse>(
      "/api/products?published=true&sort=newest&page=1&limit=8",
    ),

    fetchJson<HomepageFavoritesResponse>("/api/homepage/favorites"),

    fetchJson<{
      success: boolean;
      categories?: StorefrontSelector[];
    }>("/api/categories"),

    fetchJson<{
      success: boolean;
      collections?: StorefrontSelector[];
    }>("/api/collections"),

    fetchJson<{
      success: boolean;
      slides?: HeroCarouselSlide[];
    }>("/api/homepage/hero-carousel"),
  ]);

  return {
    featuredProducts: featuredResponse?.success ? (featuredResponse.products ?? []) : [],

    latestProducts: latestResponse?.success ? (latestResponse.products ?? []) : [],

    favoriteProducts: favoritesResponse?.success ? (favoritesResponse.products ?? []) : [],

    categories: categoriesResponse?.success ? (categoriesResponse.categories ?? []) : [],

    collections: collectionsResponse?.success ? (collectionsResponse.collections ?? []) : [],

    heroSlides:
      heroSlidesResponse?.success &&
      Array.isArray(heroSlidesResponse.slides) &&
      heroSlidesResponse.slides.length === 3
        ? heroSlidesResponse.slides
        : DEFAULT_HERO_SLIDES,
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

      <Hero slides={homepageData.heroSlides} />

      {/* ================================================================
          BENEFITS
         ================================================================ */}

      <BenefitsStrip bestsellingProducts={homepageData.latestProducts} />

      {/* ================================================================
          SHOP BY AGE
         ================================================================ */}

      <ShopByAge
        products={homepageData.latestProducts}
        favoriteProducts={homepageData.favoriteProducts}
      />

      {/* ================================================================
          CATEGORIES
         ================================================================ */}

      {/* <CategoryShowcase categories={homepageData.categories} /> */}
      {/* <FollowUsSection /> */}

      {/* ================================================================
          FEATURED PRODUCTS
         ================================================================ */}

      <FeaturedProducts products={homepageData.featuredProducts} />

      {/* ================================================================
          KINGDOM BANNER
         ================================================================ */}

      <KingdomBanner />

      {/* ================================================================
          BEST SELLERS
         ================================================================ */}

      {/* <BestSellers
        products={homepageData.latestProducts}
        featuredProducts={homepageData.featuredProducts}
      /> */}

      {/* ================================================================
          BRAND STORY
         ================================================================ */}

      <BrandStory products={homepageData.featuredProducts} />

      {/* ================================================================
          COLLECTIONS
         ================================================================ */}

      <CollectionShowcase collections={homepageData.collections} />

      {/* ================================================================
          REVIEWS
         ================================================================ */}

      <ReviewsShowcase />

      {/* ================================================================
          NEWSLETTER
         ================================================================ */}

      <Newsletter />
    </main>
  );
}
