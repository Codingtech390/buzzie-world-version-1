import { connectToDatabase } from "@/lib/mongoose";

import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { Brand } from "@/models/Brand";
import { Collection } from "@/models/Collection";

import { createSlug } from "@/lib/slug";

import type { SortOrder } from "mongoose";

export type ProductSort = "newest" | "oldest" | "price-low" | "price-high" | "name-az" | "name-za";

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  collection?: string;
  status?: string;
  featured?: boolean;
  sort?: ProductSort;
  page?: number;
  limit?: number;
}

function getProductSort(sort: ProductSort = "newest"): Record<string, SortOrder> {
  switch (sort) {
    case "oldest":
      return {
        createdAt: 1,
      };

    case "price-low":
      return {
        price: 1,
        createdAt: -1,
      };

    case "price-high":
      return {
        price: -1,
        createdAt: -1,
      };

    case "name-az":
      return {
        name: 1,
      };

    case "name-za":
      return {
        name: -1,
      };

    case "newest":
    default:
      return {
        createdAt: -1,
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

export interface ProductInput {
  name: string;
  slug?: string;
  description: string;
  shortDescription?: string;

  // Optional because draft products may not have these yet.
  price?: number;
  compareAtPrice?: number;

  sku?: string;

  images?: ProductImageInput[];

  category?: string;
  brand?: string;
  collection?: string;

  variants?: ProductVariantInput[];

  // Optional because draft products may not have these yet.
  stock?: number;

  status?: "draft" | "active" | "archived";

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
    }))
    .filter((image) => Boolean(image.url));
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

    // These remain undefined when not supplied.
    price,

    compareAtPrice,

    sku: cleanOptionalString(data.sku),

    images: cleanImages(data.images),

    category: cleanOptionalString(data.category),

    brand: cleanOptionalString(data.brand),

    collection: cleanOptionalString(data.collection),

    variants: cleanVariants(data.variants),

    // These remain undefined when not supplied.
    stock,

    status: data.status ?? "draft",

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
    sort = "newest",
    featured,
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

  if (typeof featured === "boolean") {
    query.featured = featured;
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

export async function getProductBySlug(slug: string) {
  await connectToDatabase();

  return Product.findOne({ slug })
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

    shortDescription: data.shortDescription ?? existing.shortDescription,

    price: data.price !== undefined ? data.price : existing.price,

    compareAtPrice:
      data.compareAtPrice !== undefined ? data.compareAtPrice : existing.compareAtPrice,

    sku: data.sku !== undefined ? data.sku : existing.sku,

    images: data.images !== undefined ? data.images : existing.images,

    category: data.category !== undefined ? data.category : existing.category?.toString(),

    brand: data.brand !== undefined ? data.brand : existing.brand?.toString(),

    collection: data.collection !== undefined ? data.collection : existing.collection?.toString(),

    variants: data.variants !== undefined ? data.variants : existing.variants,

    stock: data.stock !== undefined ? data.stock : existing.stock,

    status: data.status !== undefined ? data.status : existing.status,

    featured: data.featured !== undefined ? data.featured : existing.featured,

    ageRange: data.ageRange !== undefined ? data.ageRange : existing.ageRange,
  });

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

/*
 * Register referenced models explicitly.
 *
 * Product.populate() needs these models registered in the same
 * Mongoose connection before population occurs.
 */
void Category;
void Brand;
void Collection;

