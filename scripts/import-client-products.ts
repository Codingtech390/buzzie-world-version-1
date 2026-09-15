import dotenv from "dotenv";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";

type ClientProductSeed = {
  name: string;
  slug: string;
  category: string;
  brand: string;
  shortDescription: string;
  description: string;
  ageRange?: { min: number; max?: number };
  status: "draft" | "active" | "archived";
  featured: boolean;
};

const DRY_RUN = process.argv.includes("--dry-run");

function log(message: string) {
  console.log(`[client-products] ${message}`);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalize(value: string): string {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

async function findByName(Model: any, name: string) {
  const escaped = escapeRegExp(name.trim());
  return Model.findOne({
    name: { $regex: `^${escaped}$`, $options: "i" },
  });
}

async function run() {
  // Dynamic imports keep environment loading ahead of model/database initialization.
  const { connectToDatabase } = await import("@/lib/mongoose");
  const { Product } = await import("@/models/Product");
  const { Category } = await import("@/models/Category");
  const { Brand } = await import("@/models/Brand");
  const { CLIENT_PRODUCTS } = await import("@/data/client-products");

  const products = CLIENT_PRODUCTS as ClientProductSeed[];

  log(`Mode: ${DRY_RUN ? "DRY RUN — no writes" : "APPLY — database writes enabled"}`);
  log(`Source products: ${products.length}`);

  await connectToDatabase();

  if (mongoose.connection.readyState !== 1) {
    throw new Error("MongoDB is not connected.");
  }

  const brandCache = new Map<string, any>();
  const categoryCache = new Map<string, any>();

  // Resolve every referenced category/brand before writing anything.
  // This prevents a half-import caused by a missing selector.
  for (const product of products) {
    const categoryKey = normalize(product.category);
    const brandKey = normalize(product.brand);

    if (!categoryCache.has(categoryKey)) {
      const category = await findByName(Category, product.category);
      if (!category) {
        throw new Error(
          `Missing category "${product.category}". Create/seed this category before importing products.`,
        );
      }
      categoryCache.set(categoryKey, category);
    }

    if (!brandCache.has(brandKey)) {
      const brand = await findByName(Brand, product.brand);
      if (!brand) {
        throw new Error(
          `Missing brand "${product.brand}". Create/seed this brand before importing products.`,
        );
      }
      brandCache.set(brandKey, brand);
    }
  }

  const summary = {
    created: 0,
    updated: 0,
    unchanged: 0,
  };

  for (const source of products) {
    const category = categoryCache.get(normalize(source.category));
    const brand = brandCache.get(normalize(source.brand));

    if (!category || !brand) {
      throw new Error(`Selector resolution failed for "${source.name}".`);
    }

    // Slug is the stable import identity. If a manually-created product with
    // the same exact name already exists under another slug, reuse it rather
    // than creating a duplicate.
    let existing = await Product.findOne({ slug: source.slug });

    if (!existing) {
      existing = await findByName(Product, source.name);
    }

    if (!existing) {
      const createData: Record<string, unknown> = {
        name: source.name,
        slug: source.slug,
        description: source.description,
        shortDescription: source.shortDescription,
        category: category._id,
        brand: brand._id,
        images: [],
        variants: [],
        status: "draft",
        featured: false,
      };

      if (source.ageRange) {
        createData.ageRange = source.ageRange;
      }

      if (DRY_RUN) {
        summary.created += 1;
        log(`WOULD CREATE: ${source.name} → ${source.category}`);
        continue;
      }

      await Product.create(createData);
      summary.created += 1;
      log(`CREATED: ${source.name}`);
      continue;
    }

    // IMPORTANT:
    // Never overwrite manually managed commercial/catalog fields during a
    // re-import. In particular, price, stock, SKU, images, variants, status,
    // featured and compareAtPrice are intentionally excluded.
    const updateData: Record<string, unknown> = {
      name: source.name,
      slug: source.slug,
      description: source.description,
      shortDescription: source.shortDescription,
      category: category._id,
      brand: brand._id,
    };

    // Only update ageRange when the source explicitly provides it.
    // If the source does not provide it, preserve an existing manually-entered value.
    if (source.ageRange) {
      updateData.ageRange = source.ageRange;
    }

    const changed =
      existing.name !== source.name ||
      existing.slug !== source.slug ||
      existing.description !== source.description ||
      existing.shortDescription !== source.shortDescription ||
      String(existing.category ?? "") !== String(category._id) ||
      String(existing.brand ?? "") !== String(brand._id) ||
      (source.ageRange &&
        JSON.stringify(existing.ageRange ?? {}) !== JSON.stringify(source.ageRange));

    if (!changed) {
      summary.unchanged += 1;
      log(`UNCHANGED: ${source.name}`);
      continue;
    }

    if (DRY_RUN) {
      summary.updated += 1;
      log(`WOULD UPDATE: ${source.name}`);
      continue;
    }

    await Product.updateOne({ _id: existing._id }, { $set: updateData }, { runValidators: true });

    summary.updated += 1;
    log(`UPDATED: ${source.name}`);
  }

  log("");
  log(`Created: ${summary.created}`);
  log(`Updated: ${summary.updated}`);
  log(`Unchanged: ${summary.unchanged}`);
  log(`Processed: ${products.length}`);

  if (summary.created + summary.updated + summary.unchanged !== products.length) {
    throw new Error("Import summary does not match source product count.");
  }

  log("Import completed successfully.");
}

run()
  .catch((error) => {
    console.error("");
    console.error("[client-products] IMPORT FAILED");
    console.error(getErrorMessage(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });
