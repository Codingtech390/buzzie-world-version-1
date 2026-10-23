import { connectToDatabase } from "@/lib/mongoose";

import { Brand } from "@/models/Brand";
import { Category } from "@/models/Category";
import { Collection } from "@/models/Collection";
import { Product } from "@/models/Product";

import { createSlug } from "@/lib/slug";

import type { SortOrder } from "mongoose";

import type { IProductContentImage } from "@/models/Product";
import type { ProductDiaryData } from "@/types/product";

export type ProductSort = "newest" | "oldest" | "price-low" | "price-high" | "name-az" | "name-za";

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  collection?: string;
  status?: string;
  published?: boolean;
  featured?: boolean;

  // Numeric age bounds for age-group storefront filtering.
  ageMin?: number;
  ageMax?: number;

  sort?: ProductSort;
  page?: number;
  limit?: number;
}

function getProductSort(sort: ProductSort = "newest"): Record<string, SortOrder> {
  switch (sort) {
    case "oldest":
      return {
        createdAt: 1,
        _id: 1,
      };

    case "price-low":
      return {
        price: 1,
        createdAt: -1,
        _id: 1,
      };

    case "price-high":
      return {
        price: -1,
        createdAt: -1,
        _id: 1,
      };

    case "name-az":
      return {
        name: 1,
        _id: 1,
      };

    case "name-za":
      return {
        name: -1,
        _id: 1,
      };

    case "newest":
    default:
      return {
        createdAt: -1,
        _id: 1,
      };
  }
}

export interface ProductImageInput {
  url: string;
  publicId?: string;
  alt?: string;
}

export interface ProductVariantInput {
  name: string;
  value: string;
  sku?: string;
  price?: number;
  stock?: number;
}
export interface ProductVideoInput {
  url: string;
  publicId?: string;
  title?: string;
  format?: string;
  duration?: number;
}
export interface ProductInput {
  name: string;
  slug?: string;
  description: string;
  shortDescription?: string;
  keyFeatures?: string[];
  productDiary?: ProductDiaryData;
  // Optional because draft products may not have these yet.
  price?: number;
  compareAtPrice?: number;

  sku?: string;

  images?: ProductImageInput[];

  listingImage?: string;
  carouselImages?: ProductImageInput[];

  aPlusContent?: IProductContentImage[];
  howToPlay?: IProductContentImage[];

  videos?: ProductVideoInput[];
  category?: string;
  brand?: string;
  collection?: string;

  variants?: ProductVariantInput[];

  // Optional because draft products may not have these yet.
  stock?: number;

  status?: "draft" | "active" | "archived";

  /**
   * Controls whether the product is visible
   * in the public storefront.
   *
   * This is intentionally separate from `status`.
   */
  published?: boolean;

  featured?: boolean;

  ageRange?: {
    min?: number;
    max?: number;
  };
}

function cleanOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed || undefined;
}

function cleanImages(value: unknown): ProductImageInput[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (image): image is Record<string, unknown> => Boolean(image) && typeof image === "object",
    )
    .map((image) => ({
      url: String(image.url ?? "").trim(),
      publicId: cleanOptionalString(image.publicId),
      alt: cleanOptionalString(image.alt),
      caption: cleanOptionalString(image.caption),
    }))
    .filter((image) => Boolean(image.url));
}

function cleanVideos(value: unknown): ProductVideoInput[] {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new Error("Videos must be an array.");
  }

  if (value.length > 3) {
    throw new Error("A product can have a maximum of 3 videos.");
  }

  return value.map((item): ProductVideoInput => {
    if (!item || typeof item !== "object") {
      throw new Error("Invalid video entry.");
    }

    const video = item as Record<string, unknown>;
    const url = typeof video.url === "string" ? video.url.trim() : "";

    if (
      !url.startsWith("/api/media/files/buzzie-world/products/") ||
      !url.includes("/video/") ||
      url.includes("..") ||
      url.includes("\\") ||
      url.includes("?") ||
      url.includes("#") ||
      /^https?:\/\//i.test(url)
    ) {
      throw new Error("Videos must use a valid local product video URL.");
    }

    return {
      url,
      publicId: cleanOptionalString(video.publicId),
      title: cleanOptionalString(video.title),
      format: cleanOptionalString(video.format),
      duration: normalizeOptionalNumber(video.duration),
    };
  });
}



function cleanVariants(value: unknown): ProductVariantInput[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (variant): variant is Record<string, unknown> =>
        Boolean(variant) && typeof variant === "object",
    )
    .map((variant) => ({
      name: String(variant.name ?? "").trim(),
      value: String(variant.value ?? "").trim(),
      sku: cleanOptionalString(variant.sku),

      price:
        variant.price === undefined || variant.price === null || variant.price === ""
          ? undefined
          : Number(variant.price),

      stock:
        variant.stock === undefined || variant.stock === null || variant.stock === ""
          ? undefined
          : Number(variant.stock),
    }))
    .filter((variant) => variant.name && variant.value);
}

function normalizeOptionalNumber(value: unknown): number | undefined {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : undefined;
}


function cleanDiaryTextSection(value: unknown) {
  const section =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  const entries = Array.isArray(section.entries) ? section.entries : [];

  return {
    eyebrow: cleanOptionalString(section.eyebrow) ?? "",
    title: cleanOptionalString(section.title) ?? "",
    intro: cleanOptionalString(section.intro) ?? "",
    entries: entries
      .filter(
        (entry): entry is Record<string, unknown> =>
          Boolean(entry) && typeof entry === "object",
      )
      .map((entry) => ({
        title: cleanOptionalString(entry.title) ?? "",
        description: cleanOptionalString(entry.description) ?? "",
      }))
      .filter((entry) => entry.title || entry.description),
  };
}

function cleanDiarySpecifications(value: unknown) {
  const section =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  const entries = Array.isArray(section.entries) ? section.entries : [];

  return {
    eyebrow: cleanOptionalString(section.eyebrow) ?? "",
    title: cleanOptionalString(section.title) ?? "",
    intro: cleanOptionalString(section.intro) ?? "",
    entries: entries
      .filter(
        (entry): entry is Record<string, unknown> =>
          Boolean(entry) && typeof entry === "object",
      )
      .map((entry) => ({
        label: cleanOptionalString(entry.label) ?? "",
        value: cleanOptionalString(entry.value) ?? "",
      }))
      .filter((entry) => entry.label || entry.value),
  };
}

function cleanProductDiary(value: unknown): ProductDiaryData | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Product Diary must be an object.");
  }

  const diary = value as Record<string, unknown>;

  return {
    overview: cleanDiaryTextSection(diary.overview),
    keyFeatures: cleanDiaryTextSection(diary.keyFeatures),
    specifications: cleanDiarySpecifications(diary.specifications),
    benefits: cleanDiaryTextSection(diary.benefits),
  };
}




function normalizeProductInput(data: ProductInput) {
  const name = String(data.name ?? "").trim();

  const providedSlug = typeof data.slug === "string" ? data.slug.trim() : "";

  const price = normalizeOptionalNumber(data.price);

  const stock = normalizeOptionalNumber(data.stock);

  const compareAtPrice = normalizeOptionalNumber(data.compareAtPrice);

  const ageMin = normalizeOptionalNumber(data.ageRange?.min);

  const ageMax = normalizeOptionalNumber(data.ageRange?.max);

  return {
    name,

    slug: providedSlug || createSlug(name),

    description: String(data.description ?? "").trim(),

    shortDescription: cleanOptionalString(data.shortDescription),

    keyFeatures: Array.isArray(data.keyFeatures)
      ? data.keyFeatures
          .filter((feature): feature is string => typeof feature === "string")
          .map((feature) => feature.trim())
          .filter(Boolean)
      : [],

    productDiary: cleanProductDiary(data.productDiary),

    price,

    compareAtPrice,

    sku: cleanOptionalString(data.sku),

    images: cleanImages(data.images),

    listingImage: cleanOptionalString(data.listingImage) ?? "",

    carouselImages: cleanImages(data.carouselImages),

    aPlusContent: cleanImages(data.aPlusContent),

    howToPlay: cleanImages(data.howToPlay),

    videos: cleanVideos(data.videos),

    category: cleanOptionalString(data.category),

    brand: cleanOptionalString(data.brand),

    collection: cleanOptionalString(data.collection),

    variants: cleanVariants(data.variants),

    // These remain undefined when not supplied.
    stock,

    status: data.status ?? "draft",

    /**
     * Storefront visibility.
     *
     * New products default to hidden unless explicitly
     * published.
     */
    published: data.published ?? false,

    featured: Boolean(data.featured),

    ageRange:
      ageMin !== undefined || ageMax !== undefined
        ? {
            ...(ageMin !== undefined ? { min: ageMin } : {}),
            ...(ageMax !== undefined ? { max: ageMax } : {}),
          }
        : undefined,
  };
}

export async function getProducts(filters: ProductFilters = {}) {
  await connectToDatabase();

  const {
    search,
    category,
    brand,
    collection,
    status,
    published,
    sort = "newest",
    featured,
    ageMin,
    ageMax,
    page = 1,
    limit = 20,
  } = filters;

  const query: Record<string, unknown> = {};

  if (search) {
    query.$text = {
      $search: search,
    };
  }

  if (category) {
    query.category = category;
  }

  if (brand) {
    query.brand = brand;
  }

  if (collection) {
    query.collection = collection;
  }

  if (status) {
    query.status = status;
  }

  if (typeof published === "boolean") {
    query.published = published;
  }

  if (typeof featured === "boolean") {
    query.featured = featured;
  }

  if (
    typeof ageMin === "number" &&
    Number.isFinite(ageMin) &&
    typeof ageMax === "number" &&
    Number.isFinite(ageMax)
  ) {
    query["ageRange.min"] = { $lte: ageMax };
    query["ageRange.max"] = { $gte: ageMin };
  }

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate("category", "name slug")
      .populate("brand", "name slug")
      .populate("collection", "name slug")
      .sort(getProductSort(sort))
      .skip(skip)
      .limit(limit)
      .lean(),

    Product.countDocuments(query),
  ]);

  return {
    products,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getProductById(id: string) {
  await connectToDatabase();

  return Product.findById(id)
    .populate("category", "name slug")
    .populate("brand", "name slug")
    .populate("collection", "name slug")
    .lean();
}

export async function getProductBySlug(
  slug: string,
  options?: {
    published?: boolean;
  },
) {
  await connectToDatabase();

  const query: Record<string, unknown> = {
    slug,
  };

  if (typeof options?.published === "boolean") {
    query.published = options.published;
  }

  return Product.findOne(query)
    .populate("category", "name slug")
    .populate("brand", "name slug")
    .populate("collection", "name slug")
    .lean();
}

export async function createProduct(data: ProductInput) {
  await connectToDatabase();

  const normalized = normalizeProductInput(data);

  return Product.create({
    ...normalized,
  });
}

export async function updateProduct(id: string, data: Partial<ProductInput>) {
  await connectToDatabase();

  const existing = await Product.findById(id);


  if (!existing) {
    return null;
  }

  const normalized = normalizeProductInput({
    name: data.name ?? existing.name,

    slug: data.slug ?? existing.slug,

    description: data.description ?? existing.description,

    shortDescription:
      data.shortDescription !== undefined ? data.shortDescription : existing.shortDescription,

    keyFeatures: data.keyFeatures !== undefined ? data.keyFeatures : existing.keyFeatures,
    productDiary: data.productDiary !== undefined ? data.productDiary : existing.productDiary,

    price: data.price !== undefined ? data.price : existing.price,

    compareAtPrice:
      data.compareAtPrice !== undefined ? data.compareAtPrice : existing.compareAtPrice,

    sku: data.sku !== undefined ? data.sku : existing.sku,

    images: data.images !== undefined ? data.images : existing.images,

    listingImage: data.listingImage !== undefined ? data.listingImage : existing.listingImage,
    
    carouselImages:
      data.carouselImages !== undefined ? data.carouselImages : existing.carouselImages,

    aPlusContent: data.aPlusContent !== undefined ? data.aPlusContent : existing.aPlusContent,

    howToPlay: data.howToPlay !== undefined ? data.howToPlay : existing.howToPlay,

    videos: data.videos !== undefined ? data.videos : existing.videos,

    category: data.category !== undefined ? data.category : existing.category?.toString(),

    brand: data.brand !== undefined ? data.brand : existing.brand?.toString(),

    collection: data.collection !== undefined ? data.collection : existing.collection?.toString(),

    variants: data.variants !== undefined ? data.variants : existing.variants,

    stock: data.stock !== undefined ? data.stock : existing.stock,

    status: data.status !== undefined ? data.status : existing.status,

    published: data.published !== undefined ? data.published : existing.published,

    featured: data.featured !== undefined ? data.featured : existing.featured,

    ageRange: data.ageRange !== undefined ? data.ageRange : existing.ageRange,
  });

  console.log("[updateProduct] Normalized ageRange:", normalized.ageRange);

  return Product.findByIdAndUpdate(
    id,
    {
      $set: normalized,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .populate("category", "name slug")
    .populate("brand", "name slug")
    .populate("collection", "name slug")
    .lean();
}

export async function deleteProduct(id: string) {
  await connectToDatabase();

  return Product.findByIdAndDelete(id);
}

/**
 * Register referenced models explicitly.
 *
 * Product.populate() needs these models registered in the same
 * Mongoose connection before population occurs.
 */
void Category;
void Brand;
void Collection;
