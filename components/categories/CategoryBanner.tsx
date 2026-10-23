import Image from "next/image";

type CategoryBannerProps = {
  category: string | null;
};

const CATEGORY_BANNERS: Record<string, { image: string; alt: string }> = {
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

function normalizeCategory(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CategoryBanner({ category }: CategoryBannerProps) {
  const slug = category ? normalizeCategory(category) : "";
  const banner = CATEGORY_BANNERS[slug];

  if (!banner) {
    return null;
  }

  return (
    <section aria-label={banner.alt} className="mx-auto w-full max-w-[1500px] overflow-hidden">
      <Image
        src={banner.image}
        alt={banner.alt}
        width={1920}
        height={520}
        priority
        sizes="100vw"
        className="block h-auto w-full object-contain"
      />
    </section>
  );
}
