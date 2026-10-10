import type { StorefrontProduct, StorefrontSelector } from "@/types/storefront";

export interface HomepageData {
  featuredProducts: StorefrontProduct[];
  latestProducts: StorefrontProduct[];
  categories: StorefrontSelector[];
  collections: StorefrontSelector[];
}

export interface HomepageApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Landing page Carousel

export interface HeroCarouselSlide {
  id: string;
  image: string;
  alt: string;
  href: string;
}

export interface HeroCarouselResponse {
  success: boolean;
  message?: string;
  slides?: HeroCarouselSlide[];
}

export const DEFAULT_HERO_SLIDES: HeroCarouselSlide[] = [
  {
    id: "slide-1",
    image: "/images/home/landing/hero-image-1.png",
    alt: "BuzzieWorld special offer",
    href: "/crazy-deals",
  },
  {
    id: "slide-2",
    image: "/images/home/landing/hero-image-2.png",
    alt: "BuzzieWorld celebration and gifting",
    href: "/crazy-deals",
  },
  {
    id: "slide-3",
    image: "/images/home/landing/hero-image-3.png",
    alt: "BuzzieWorld learning through play",
    href: "/crazy-deals",
  },
];
