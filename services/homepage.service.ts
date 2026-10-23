import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongoose";
import { Homepage } from "@/models/Homepage";
import { Product } from "@/models/Product";

import type { HeroCarouselSlide } from "@/types/homepage";
import { DEFAULT_HERO_SLIDES } from "@/types/homepage";

const HOMEPAGE_KEY = "default";

function normalizeProductIds(productIds: unknown): string[] {
  if (!Array.isArray(productIds)) {
    throw new Error("Product IDs must be an array.");
  }

  if (productIds.length > 100) {
    throw new Error("You can select a maximum of 100 products.");
  }

  const ids = productIds.map((id) => String(id));

  if (ids.some((id) => !Types.ObjectId.isValid(id))) {
    throw new Error("One or more product IDs are invalid.");
  }

  if (new Set(ids).size !== ids.length) {
    throw new Error("A product cannot be selected more than once.");
  }

  return ids;
}

export async function getHomepageFavoriteProductIds(): Promise<string[]> {
  await connectToDatabase();

  const homepage = await Homepage.findOne({ key: HOMEPAGE_KEY })
    .select("favoriteProductIds")
    .lean();

  return (homepage?.favoriteProductIds ?? []).map((id) => String(id));
}

export async function getHomepageFavoriteSectionEnabled(): Promise<boolean> {
  await connectToDatabase();

  const homepage = await Homepage.findOne({ key: HOMEPAGE_KEY })
    .select("isFavoriteSectionEnabled")
    .lean();

  // Fail closed: an unset value means the section is hidden.
  return homepage?.isFavoriteSectionEnabled === true;
}

export async function saveHomepageFavoriteSectionEnabled(enabled: unknown): Promise<boolean> {
  if (typeof enabled !== "boolean") {
    throw new Error("Section visibility must be a boolean.");
  }

  await connectToDatabase();

  await Homepage.findOneAndUpdate(
    { key: HOMEPAGE_KEY },
    {
      $set: {
        isFavoriteSectionEnabled: enabled,
      },
      $setOnInsert: {
        key: HOMEPAGE_KEY,
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  return enabled;
}



export async function saveHomepageFavoriteProductIds(productIds: unknown): Promise<string[]> {
  await connectToDatabase();

  const ids = normalizeProductIds(productIds);

  if (ids.length > 0) {
    const existingCount = await Product.countDocuments({
      _id: { $in: ids },
    });

    if (existingCount !== ids.length) {
      throw new Error("One or more selected products no longer exist.");
    }
  }

  await Homepage.findOneAndUpdate(
    { key: HOMEPAGE_KEY },
    {
      $set: {
        favoriteProductIds: ids.map((id) => new Types.ObjectId(id)),
      },
      $setOnInsert: {
        key: HOMEPAGE_KEY,
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  return ids;
}

export async function getHomepageFavoriteProducts() {
  await connectToDatabase();

  const ids = await getHomepageFavoriteProductIds();

  if (ids.length === 0) {
    return [];
  }

  const products = await Product.find({
    _id: { $in: ids },
    published: true,
    status: { $ne: "archived" },
  })
    .populate("category", "name slug")
    .populate("brand", "name slug")
    .populate("collection", "name slug")
    .lean();

  // MongoDB $in does not guarantee the order saved by the admin.
  const productMap = new Map(products.map((product) => [String(product._id), product]));

  return ids.map((id) => productMap.get(id)).filter((product) => product !== undefined);
}



// Hero carousel

export async function getHeroCarouselSlides(): Promise<HeroCarouselSlide[]> {
  await connectToDatabase();

  const homepage = await Homepage.findOne({ key: HOMEPAGE_KEY }).select("heroSlides").lean();

  const slides = homepage?.heroSlides;

  if (
    !Array.isArray(slides) ||
    slides.length !== 3 ||
    slides.some((slide) => !slide || typeof slide.image !== "string" || !slide.image.trim())
  ) {
    return DEFAULT_HERO_SLIDES;
  }

  return slides.map((slide) => ({
    id: slide.id,
    image: slide.image,
    alt: slide.alt,
    href: slide.href,
  }));
}

export async function saveHeroCarouselSlides(input: unknown): Promise<HeroCarouselSlide[]> {
  if (!Array.isArray(input) || input.length !== 3) {
    throw new Error("Exactly three hero slides are required.");
  }

  const slides: HeroCarouselSlide[] = input.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`Slide ${index + 1} is invalid.`);
    }

    const slide = item as Record<string, unknown>;

    if (
      typeof slide.image !== "string" ||
      !slide.image.trim() ||
      typeof slide.alt !== "string" ||
      typeof slide.href !== "string"
    ) {
      throw new Error(`Slide ${index + 1} has missing fields.`);
    }

    const image = slide.image.trim();
    const href = slide.href.trim();

    const isLocalImage = image.startsWith("/") && !image.startsWith("//");
    const isCloudinaryImage = /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//i.test(
      image,
    );

    if (!isLocalImage && !isCloudinaryImage) {
      throw new Error(
        `Slide ${index + 1} must use a local image path or a secure Cloudinary image URL.`,
      );
    }

    if (!href.startsWith("/") || href.startsWith("//")) {
      throw new Error(`Slide ${index + 1} must have a valid local link.`);
    }

    return {
      id: `slide-${index + 1}`,
      image,
      alt: slide.alt.trim(),
      href,
    };
  });

  await connectToDatabase();

  await Homepage.findOneAndUpdate(
    { key: HOMEPAGE_KEY },
    {
      $set: { heroSlides: slides },
      $setOnInsert: { key: HOMEPAGE_KEY },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  return slides;
}
