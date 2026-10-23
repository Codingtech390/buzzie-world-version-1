export type CategoryBanner = {
  image: string;
  alt: string;
};

const CATEGORY_BANNERS: Record<string, CategoryBanner> = {
  binder: {
    image: "/images/banners/categories-banner/Banner-binder.png",
    alt: "Binder games",
  },
  "card-games": {
    image: "/images/banners/categories-banner/Banner-card-games.png",
    alt: "Card games",
  },
  geography: {
    image: "/images/banners/categories-banner/Banner-geography.png",
    alt: "Geography games",
  },
  "mind-games": {
    image: "/images/banners/categories-banner/Banner-mind-games.png",
    alt: "Mind games",
  },
  mythology: {
    image: "/images/banners/categories-banner/Banner-mythology.png",
    alt: "Mythology games",
  },
  "on-the-go-games": {
    image: "/images/banners/categories-banner/Banner-on-the-go-games.png",
    alt: "On-the-go games",
  },
  phonics: {
    image: "/images/banners/categories-banner/Banner-phonics.png",
    alt: "Phonics games",
  },
};

export function getCategoryBanner(slug: string | null | undefined): CategoryBanner | null {
  if (!slug) return null;

  return CATEGORY_BANNERS[slug.trim().toLowerCase()] ?? null;
}
