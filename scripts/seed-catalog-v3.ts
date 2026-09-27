/**
 * ============================================================================
 * BUZZIEWORLD — CATALOG MIGRATION V3
 * ============================================================================
 *
 * PURPOSE
 * ----------------------------------------------------------------------------
 * Replace the current Product catalog with the verified 49-product
 * BuzzieWorld client catalog.
 *
 * This version is specifically designed for the CURRENT BuzzieWorld database.
 *
 * IMPORTANT:
 *
 *   Existing Categories:
 *     PRESERVED
 *
 *   Existing Brand:
 *     PRESERVED
 *
 *   Existing Collections:
 *     PRESERVED
 *
 *   Existing Products:
 *     BACKED UP
 *     THEN REPLACED
 *
 *   Users:
 *     NEVER TOUCHED
 *
 *   Orders:
 *     NEVER TOUCHED
 *
 *   Carts:
 *     NEVER TOUCHED
 *
 *   Reviews:
 *     NEVER TOUCHED
 *
 *   Wishlists:
 *     NEVER TOUCHED
 *
 *   Payments:
 *     NEVER TOUCHED
 *
 *   Authentication:
 *     NEVER TOUCHED
 *
 *   Site settings:
 *     NEVER TOUCHED
 *
 * ============================================================================
 *
 * SAFE BY DEFAULT
 * ----------------------------------------------------------------------------
 *
 * Running:
 *
 *   npx tsx scripts/seed-catalog-v3.ts
 *
 * performs:
 *
 *   - source validation
 *   - database inspection
 *   - reference safety checks
 *   - catalog preview
 *
 * It DOES NOT modify MongoDB.
 *
 * Actual migration requires BOTH:
 *
 *   --apply
 *   --confirm-replace
 *
 * Example:
 *
 *   npx tsx scripts/seed-catalog-v3.ts --apply --confirm-replace
 *
 * ============================================================================
 *
 * SOURCE
 * ----------------------------------------------------------------------------
 *
 * Primary catalog source:
 *
 *   data/buzzieworld-complete-catalog-v2.json
 *
 * This source contains:
 *
 *   49 client products
 *   42 detailed products
 *   7 name/category-only products
 *
 * The 7 name/category-only products are intentionally inserted as drafts
 * with empty description, price, stock, SKU, variants and images.
 *
 * ============================================================================
 *
 * CATEGORY MAPPING
 * ----------------------------------------------------------------------------
 *
 * The client source uses:
 *
 *   Binder
 *   Mind games
 *   Travel Pack
 *   Card Games
 *   Startegy Game
 *   Phonics
 *   Geography
 *   Mythology
 *
 * The existing BuzzieWorld database uses:
 *
 *   Binder
 *   Mind Games
 *   On-the-Go Games
 *   Card Games
 *   Phonics
 *   Geography
 *   Mythology
 *
 * Therefore:
 *
 *   Binder        -> Binder
 *   Mind games    -> Mind Games
 *   Travel Pack   -> On-the-Go Games
 *   Card Games    -> Card Games
 *   Startegy Game -> On-the-Go Games
 *   Phonics       -> Phonics
 *   Geography     -> Geography
 *   Mythology     -> Mythology
 *
 * No new category is created by this migration.
 *
 * ============================================================================
 */

import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

/* ============================================================================
   ENVIRONMENT — MUST LOAD BEFORE APPLICATION MODULES
============================================================================ */

const envPath = path.resolve(process.cwd(), ".env.local");

const envResult = dotenv.config({
  path: envPath,
});

if (envResult.error) {
  console.error("");
  console.error("❌ Failed to load .env.local");
  console.error("");
  console.error(`Expected file: ${envPath}`);
  console.error("");
  console.error(envResult.error);
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error("");
  console.error("❌ MONGODB_URI is missing.");
  console.error("");
  console.error(`Checked: ${envPath}`);
  console.error("");
  console.error("Make sure your .env.local contains MONGODB_URI=...");
  process.exit(1);
}

console.log("✓ .env.local loaded");
console.log("✓ MONGODB_URI detected");

let connectToDatabase: typeof import("@/lib/mongoose").connectToDatabase;

let Product: typeof import("@/models/Product").Product;
let Category: typeof import("@/models/Category").Category;
let Brand: typeof import("@/models/Brand").Brand;
let Collection: typeof import("@/models/Collection").Collection;
let Order: typeof import("@/models/Order").Order;
let Cart: typeof import("@/models/Cart").Cart;
let Review: typeof import("@/models/Review").Review;

async function loadApplicationModules(): Promise<void> {
  const mongooseModule = await import("@/lib/mongoose");

  const productModule = await import("@/models/Product");
  const categoryModule = await import("@/models/Category");
  const brandModule = await import("@/models/Brand");
  const collectionModule = await import("@/models/Collection");
  const orderModule = await import("@/models/Order");
  const cartModule = await import("@/models/Cart");
  const reviewModule = await import("@/models/Review");

  connectToDatabase = mongooseModule.connectToDatabase;

  Product = productModule.Product;
  Category = categoryModule.Category;
  Brand = brandModule.Brand;
  Collection = collectionModule.Collection;
  Order = orderModule.Order;
  Cart = cartModule.Cart;
  Review = reviewModule.Review;

  console.log("✓ Application models loaded");
}

/* ============================================================================
   1. COMMAND-LINE MODES
============================================================================ */

const APPLY_MODE = process.argv.includes("--apply");

const CONFIRM_REPLACE_MODE = process.argv.includes("--confirm-replace");

const DRY_RUN_MODE = !APPLY_MODE;

/*
 * We deliberately do NOT implement --clear-demo-data in V3.
 *
 * V3 never deletes Orders or Carts.
 *
 * If demo data exists and references products, the migration stops safely.
 */
const UNSUPPORTED_DEMO_CLEANUP_MODE = process.argv.includes("--clear-demo-data");

/* ============================================================================
   2. CONSTANTS
============================================================================ */

const SCRIPT_NAME = "seed-catalog-v3";

const SOURCE_FILE = path.resolve(process.cwd(), "data/buzzieworld-complete-catalog-v2.json");

const BACKUP_DIRECTORY = path.resolve(process.cwd(), "scripts", "backups");

const EXPECTED_PRODUCT_COUNT = 49;

const EXPECTED_DETAILED_PRODUCT_COUNT = 42;

const EXPECTED_PLACEHOLDER_COUNT = 7;

const EXPECTED_BRAND_NAME = "BuzzieWorld";

const EXPECTED_BRAND_SLUG = "buzzie-world";

/*
 * These are the categories that MUST already exist.
 *
 * V3 intentionally refuses to create/recreate them.
 */
const REQUIRED_EXISTING_CATEGORIES = [
  {
    sourceName: "Binder",
    databaseName: "Binder",
    databaseSlug: "binder",
  },
  {
    sourceName: "Mind games",
    databaseName: "Mind Games",
    databaseSlug: "mind-games",
  },
  {
    sourceName: "Travel Pack",
    databaseName: "On-the-Go Games",
    databaseSlug: "on-the-go-games",
  },
  {
    sourceName: "Card Games",
    databaseName: "Card Games",
    databaseSlug: "card-games",
  },
  {
    sourceName: "Startegy Game",
    databaseName: "On-the-Go Games",
    databaseSlug: "on-the-go-games",
  },
  {
    sourceName: "Phonics",
    databaseName: "Phonics",
    databaseSlug: "phonics",
  },
  {
    sourceName: "Geography",
    databaseName: "Geography",
    databaseSlug: "geography",
  },
  {
    sourceName: "Mythology",
    databaseName: "Mythology",
    databaseSlug: "mythology",
  },
] as const;

/*
 * The exact seven products for which the detailed catalog source did not
 * provide full product content.
 *
 * These are inserted as draft placeholders.
 */
const EXPECTED_PLACEHOLDERS = [
  {
    sourceNumber: 7,
    categoryName: "Binder",
    name: "Animal Busy Book",
  },
  {
    sourceNumber: 8,
    categoryName: "Binder",
    name: "My First Busy Book",
  },
  {
    sourceNumber: 20,
    categoryName: "Card Games",
    name: "Logo Blitz",
  },
  {
    sourceNumber: 45,
    categoryName: "Mythology",
    name: "DIY DIYA KIT",
  },
  {
    sourceNumber: 46,
    categoryName: "Mythology",
    name: "DIY JHAROKA KIT",
  },
  {
    sourceNumber: 47,
    categoryName: "Mythology",
    name: "DIY RAM MANDIR",
  },
  {
    sourceNumber: 48,
    categoryName: "Mythology",
    name: "DIY RANGOLI",
  },
] as const;

const PLACEHOLDER_SOURCE_NUMBERS = new Set<number>(
  EXPECTED_PLACEHOLDERS.map((item): number => item.sourceNumber),
);

/*
 * Complete client catalog order.
 *
 * This is intentionally hardcoded so the migration can verify that the
 * source JSON has not silently changed order or omitted a product.
 */
const EXPECTED_CLIENT_PRODUCTS = [
  {
    sourceNumber: 1,
    name: "Brain Binder",
    categoryName: "Binder",
  },
  {
    sourceNumber: 2,
    name: "Daily Oral Binder",
    categoryName: "Binder",
  },
  {
    sourceNumber: 3,
    name: "Match O Fun",
    categoryName: "Binder",
  },
  {
    sourceNumber: 4,
    name: "Toddler Busy Binder",
    categoryName: "Binder",
  },
  {
    sourceNumber: 5,
    name: "Animal Homes",
    categoryName: "Binder",
  },
  {
    sourceNumber: 6,
    name: "Math Busy Book",
    categoryName: "Binder",
  },
  {
    sourceNumber: 7,
    name: "Animal Busy Book",
    categoryName: "Binder",
  },
  {
    sourceNumber: 8,
    name: "My First Busy Book",
    categoryName: "Binder",
  },
  {
    sourceNumber: 9,
    name: "Buzzie Brains Part 1",
    categoryName: "Mind games",
  },
  {
    sourceNumber: 10,
    name: "Buzzie Brains Part 2",
    categoryName: "Mind games",
  },
  {
    sourceNumber: 11,
    name: "Guess Who I Am",
    categoryName: "Mind games",
  },
  {
    sourceNumber: 12,
    name: "KT 1",
    categoryName: "Travel Pack",
  },
  {
    sourceNumber: 13,
    name: "KT 2 Part 1",
    categoryName: "Travel Pack",
  },
  {
    sourceNumber: 14,
    name: "KT 2 Part 2",
    categoryName: "Travel Pack",
  },
  {
    sourceNumber: 15,
    name: "KT 2 Part 1 and 2",
    categoryName: "Travel Pack",
  },
  {
    sourceNumber: 16,
    name: "Animal World",
    categoryName: "Travel Pack",
  },
  {
    sourceNumber: 17,
    name: "KT 3",
    categoryName: "Travel Pack",
  },
  {
    sourceNumber: 18,
    name: "Multiplication Table 1 to 20",
    categoryName: "Travel Pack",
  },
  {
    sourceNumber: 19,
    name: "QUACK - Buzz/ Dibs from Skillmatics",
    categoryName: "Card Games",
  },
  {
    sourceNumber: 20,
    name: "Logo Blitz",
    categoryName: "Card Games",
  },
  {
    sourceNumber: 21,
    name: "Car Logo Blitz",
    categoryName: "Card Games",
  },
  {
    sourceNumber: 22,
    name: "Logology",
    categoryName: "Card Games",
  },
  {
    sourceNumber: 23,
    name: "Same Pinch - Festival",
    categoryName: "Card Games",
  },
  {
    sourceNumber: 24,
    name: "Same Pinch - Logo",
    categoryName: "Card Games",
  },
  {
    sourceNumber: 25,
    name: "Why Zone of Giggles",
    categoryName: "Card Games",
  },
  {
    sourceNumber: 26,
    name: "Startegy Game Monster on the go",
    categoryName: "Startegy Game",
  },
  {
    sourceNumber: 27,
    name: "Word Families Flash Catds",
    categoryName: "Phonics",
  },
  {
    sourceNumber: 28,
    name: "Spell Master",
    categoryName: "Phonics",
  },
  {
    sourceNumber: 29,
    name: "Wordlogy",
    categoryName: "Geography",
  },
  {
    sourceNumber: 30,
    name: "Wordlogy - Emoji Edition",
    categoryName: "Geography",
  },
  {
    sourceNumber: 31,
    name: "Indialogy",
    categoryName: "Geography",
  },
  {
    sourceNumber: 32,
    name: "Flag It",
    categoryName: "Geography",
  },
  {
    sourceNumber: 33,
    name: "India Bingo",
    categoryName: "Geography",
  },
  {
    sourceNumber: 34,
    name: "Guess the City - India Edition",
    categoryName: "Geography",
  },
  {
    sourceNumber: 35,
    name: "Guess the City - World Edition",
    categoryName: "Geography",
  },
  {
    sourceNumber: 36,
    name: "Travel Scrapbook",
    categoryName: "Geography",
  },
  {
    sourceNumber: 37,
    name: "my Gods Flash Cards",
    categoryName: "Mythology",
  },
  {
    sourceNumber: 38,
    name: "Guess Who I Am - Ramayana Edition",
    categoryName: "Mythology",
  },
  {
    sourceNumber: 39,
    name: "Krishna Quest",
    categoryName: "Mythology",
  },
  {
    sourceNumber: 40,
    name: "Diwali Kit Small",
    categoryName: "Mythology",
  },
  {
    sourceNumber: 41,
    name: "Epic Tale Ramayana",
    categoryName: "Mythology",
  },
  {
    sourceNumber: 42,
    name: "Create your own Ganesha",
    categoryName: "Mythology",
  },
  {
    sourceNumber: 43,
    name: "Create your own Lantern",
    categoryName: "Mythology",
  },
  {
    sourceNumber: 44,
    name: "Godmoji",
    categoryName: "Mythology",
  },
  {
    sourceNumber: 45,
    name: "DIY DIYA KIT",
    categoryName: "Mythology",
  },
  {
    sourceNumber: 46,
    name: "DIY JHAROKA KIT",
    categoryName: "Mythology",
  },
  {
    sourceNumber: 47,
    name: "DIY RAM MANDIR",
    categoryName: "Mythology",
  },
  {
    sourceNumber: 48,
    name: "DIY RANGOLI",
    categoryName: "Mythology",
  },
  {
    sourceNumber: 49,
    name: "DIY Wall Hanging",
    categoryName: "Mythology",
  },
] as const;

/* ============================================================================
   3. TYPES
============================================================================ */

type SourceProduct = {
  sourceNumber: number;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price?: number | null;
  compareAtPrice?: number | null;
  sku?: string | null;
  images?: Array<{
    url: string;
    publicId?: string;
    alt?: string;
  }>;
  categoryName: string;
  brandName?: string | null;
  collectionName?: string | null;
  variants?: Array<{
    name: string;
    value: string;
    sku?: string;
    price?: number;
    stock?: number;
  }>;
  stock?: number | null;
  status?: "draft" | "active" | "archived";
  featured?: boolean;
  ageRange?: {
    min?: number;
    max?: number;
  } | null;
};

type SourceCatalog = {
  catalogName: string;
  generatedFrom?: unknown;
  summary: {
    clientPdfProductCount: number;
    detailedSourceProductCount: number;
    omittedProductCount: number;
  };
  brand?: {
    name: string;
    slug: string;
    isActive: boolean;
  };
  categories?: Array<{
    name: string;
    slug: string;
    sourceNameExact?: string;
    sourceTypo?: boolean;
  }>;
  products: SourceProduct[];
};

type MigrationProduct = {
  sourceNumber: number;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: null;
  compareAtPrice: null;
  sku: null;
  images: Array<{
    url: string;
    publicId?: string;
    alt?: string;
  }>;
  categoryName: string;
  stock: null;
  variants: Array<{
    name: string;
    value: string;
    sku?: string;
    price?: number;
    stock?: number;
  }>;
  status: "draft";
  featured: false;
  ageRange?: {
    min?: number;
    max?: number;
  };
};

type CatalogBackup = {
  createdAt: string;
  script: string;
  databaseName: string;
  reason: string;
  products: unknown[];
  categories: unknown[];
  brands: unknown[];
  collections: unknown[];
};

/* ============================================================================
   4. LOGGING
============================================================================ */

function printHeader(title: string): void {
  console.log("");
  console.log("=".repeat(78));
  console.log(title);
  console.log("=".repeat(78));
  console.log("");
}

function printSection(title: string): void {
  console.log("");
  console.log("-".repeat(78));
  console.log(title);
  console.log("-".repeat(78));
}

function success(message: string): void {
  console.log(`✓ ${message}`);
}

function info(message: string): void {
  console.log(`• ${message}`);
}

function warning(message: string): void {
  console.log(`⚠ ${message}`);
}

function failure(message: string): void {
  console.error(`✗ ${message}`);
}

/* ============================================================================
   5. SOURCE LOADING
============================================================================ */

function loadSourceCatalog(): SourceCatalog {
  if (!fs.existsSync(SOURCE_FILE)) {
    throw new Error(
      [
        "The required catalog source file was not found.",
        "",
        `Expected: ${SOURCE_FILE}`,
        "",
        "V3 requires:",
        "  data/buzzieworld-complete-catalog-v2.json",
        "",
        "Do not substitute the older catalog JSON.",
      ].join("\n"),
    );
  }

  const raw = fs.readFileSync(SOURCE_FILE, "utf8");

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Unable to parse catalog JSON: ${describeError(error)}`);
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Catalog JSON root must be an object.");
  }

  return parsed as SourceCatalog;
}

/* ============================================================================
   6. SLUG GENERATION
============================================================================ */

function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

/* ============================================================================
   7. CATEGORY MAPPING
============================================================================ */

function mapSourceCategoryToDatabaseCategory(sourceCategoryName: string): {
  name: string;
  slug: string;
} {
  const mapping = REQUIRED_EXISTING_CATEGORIES.find(
    (item) => item.sourceName === sourceCategoryName,
  );

  if (!mapping) {
    throw new Error(`No V3 category mapping exists for source category "${sourceCategoryName}".`);
  }

  return {
    name: mapping.databaseName,
    slug: mapping.databaseSlug,
  };
}

/* ============================================================================
   8. STATIC SOURCE VALIDATION
============================================================================ */

function validateStaticCatalog(source: SourceCatalog): MigrationProduct[] {
  printSection("STEP 1 — STATIC CATALOG VALIDATION");

  if (source.summary?.clientPdfProductCount !== EXPECTED_PRODUCT_COUNT) {
    throw new Error(
      `Source reports ${source.summary?.clientPdfProductCount} products; expected ${EXPECTED_PRODUCT_COUNT}.`,
    );
  }

  if (source.summary?.detailedSourceProductCount !== EXPECTED_DETAILED_PRODUCT_COUNT) {
    throw new Error(
      `Source reports ${source.summary?.detailedSourceProductCount} detailed products; expected ${EXPECTED_DETAILED_PRODUCT_COUNT}.`,
    );
  }

  if (source.summary?.omittedProductCount !== EXPECTED_PLACEHOLDER_COUNT) {
    throw new Error(
      `Source reports ${source.summary?.omittedProductCount} omitted products; expected ${EXPECTED_PLACEHOLDER_COUNT}.`,
    );
  }

  if (!Array.isArray(source.products)) {
    throw new Error("Source products must be an array.");
  }

  if (source.products.length !== EXPECTED_DETAILED_PRODUCT_COUNT) {
    throw new Error(
      `Source contains ${source.products.length} detailed products; expected ${EXPECTED_DETAILED_PRODUCT_COUNT}.`,
    );
  }

  /*
   * Validate source product numbers.
   */
  const sourceNumberSet = new Set<number>();

  for (const product of source.products) {
    if (sourceNumberSet.has(product.sourceNumber)) {
      throw new Error(`Duplicate detailed product sourceNumber: ${product.sourceNumber}`);
    }

    sourceNumberSet.add(product.sourceNumber);
  }

  /*
   * Detailed product numbers expected by the client catalog.
   */
  const expectedDetailedProducts = EXPECTED_CLIENT_PRODUCTS.filter(
    (item) => !PLACEHOLDER_SOURCE_NUMBERS.has(item.sourceNumber),
  );

  if (expectedDetailedProducts.length !== EXPECTED_DETAILED_PRODUCT_COUNT) {
    throw new Error(
      `Internal V3 error: expected detailed product count is ${expectedDetailedProducts.length}.`,
    );
  }

  /*
   * Verify every detailed source product against the canonical client list.
   */
  for (const expected of expectedDetailedProducts) {
    const actual = source.products.find(
      (product) => product.sourceNumber === expected.sourceNumber,
    );

    if (!actual) {
      throw new Error(
        `Missing detailed product sourceNumber ${expected.sourceNumber}: ${expected.name}`,
      );
    }

    if (actual.name !== expected.name) {
      throw new Error(
        [
          `Product name mismatch at sourceNumber ${expected.sourceNumber}.`,
          `Expected: ${expected.name}`,
          `Found:    ${actual.name}`,
        ].join("\n"),
      );
    }

    if (actual.categoryName !== expected.categoryName) {
      throw new Error(
        [
          `Product category mismatch for "${expected.name}".`,
          `Expected: ${expected.categoryName}`,
          `Found:    ${actual.categoryName}`,
        ].join("\n"),
      );
    }

    if (!actual.description?.trim()) {
      throw new Error(`Detailed product "${actual.name}" has an empty description.`);
    }

    if (!actual.slug?.trim()) {
      throw new Error(`Detailed product "${actual.name}" has an empty slug.`);
    }
  }

  /*
   * Validate the seven intentionally incomplete products.
   */
  for (const expected of EXPECTED_PLACEHOLDERS) {
    const accidentallyDetailed = source.products.find(
      (product) => product.sourceNumber === expected.sourceNumber,
    );

    if (accidentallyDetailed) {
      throw new Error(
        [
          `Placeholder product ${expected.sourceNumber} unexpectedly exists`,
          "inside the detailed source catalog.",
          `Product: ${expected.name}`,
        ].join(" "),
      );
    }
  }

  /*
   * Validate every client product against the expected 49-product list.
   */
  const allNames = new Set<string>();

  for (const expected of EXPECTED_CLIENT_PRODUCTS) {
    if (allNames.has(expected.name)) {
      throw new Error(`Duplicate canonical product name: ${expected.name}`);
    }

    allNames.add(expected.name);
  }

  if (allNames.size !== EXPECTED_PRODUCT_COUNT) {
    throw new Error(
      `Canonical product list contains ${allNames.size} unique names; expected ${EXPECTED_PRODUCT_COUNT}.`,
    );
  }

  /*
   * Convert the 42 detailed products to Product-model-compatible documents.
   */
  const detailedProducts: MigrationProduct[] = source.products.map((product) => {
    const category = mapSourceCategoryToDatabaseCategory(product.categoryName);

    const generatedSlug = slugify(product.name);

    /*
     * We intentionally use the source slug when it exists.
     *
     * This preserves the previously verified source mapping.
     */
    const slug = product.slug?.trim() || generatedSlug;

    const ageRange =
      product.ageRange && typeof product.ageRange === "object"
        ? {
            ...(typeof product.ageRange.min === "number" ? { min: product.ageRange.min } : {}),
            ...(typeof product.ageRange.max === "number" ? { max: product.ageRange.max } : {}),
          }
        : undefined;

    return {
      sourceNumber: product.sourceNumber,
      name: product.name,
      slug,
      description: product.description,
      shortDescription: product.shortDescription?.trim() ?? "",
      price: null,
      compareAtPrice: null,
      sku: null,
      images: [],
      categoryName: category.name,
      stock: null,
      variants: [],
      status: "draft",
      featured: false,
      ...(ageRange && (ageRange.min !== undefined || ageRange.max !== undefined)
        ? { ageRange }
        : {}),
    };
  });

  /*
   * Add the seven name/category-only placeholders.
   */
  const placeholderProducts: MigrationProduct[] = EXPECTED_PLACEHOLDERS.map((placeholder) => {
    const category = mapSourceCategoryToDatabaseCategory(placeholder.categoryName);

    return {
      sourceNumber: placeholder.sourceNumber,
      name: placeholder.name,
      slug: slugify(placeholder.name),
      description: `${placeholder.name} — Product details to be added.`,
      shortDescription: "",
      price: null,
      compareAtPrice: null,
      sku: null,
      images: [],
      categoryName: category.name,
      stock: null,
      variants: [],
      status: "draft",
      featured: false,
    };
  });

  const allProducts = [...detailedProducts, ...placeholderProducts].sort(
    (a, b) => a.sourceNumber - b.sourceNumber,
  );

  if (allProducts.length !== EXPECTED_PRODUCT_COUNT) {
    throw new Error(
      `V3 constructed ${allProducts.length} products; expected ${EXPECTED_PRODUCT_COUNT}.`,
    );
  }

  /*
   * Validate source number sequence.
   */
  for (let index = 0; index < EXPECTED_CLIENT_PRODUCTS.length; index += 1) {
    const expected = EXPECTED_CLIENT_PRODUCTS[index];
    const actual = allProducts[index];

    if (actual.sourceNumber !== expected.sourceNumber || actual.name !== expected.name) {
      throw new Error(
        [
          `Final product ordering mismatch at position ${index + 1}.`,
          `Expected: ${expected.sourceNumber} — ${expected.name}`,
          `Found:    ${actual.sourceNumber} — ${actual.name}`,
        ].join("\n"),
      );
    }
  }

  /*
   * Validate generated slugs.
   */
  const slugSet = new Set<string>();

  for (const product of allProducts) {
    if (slugSet.has(product.slug)) {
      throw new Error(`Duplicate product slug generated: ${product.slug}`);
    }

    slugSet.add(product.slug);
  }

  success("Client catalog count = 49.");
  success("Detailed products = 42.");
  success("Name/category-only placeholders = 7.");
  success("Canonical product order validated.");
  success("Canonical product names validated.");
  success("Canonical product categories validated.");
  success("Product slugs are unique.");
  success("All products will be inserted as DRAFT.");
  success("All product images will start empty.");
  success("No prices, stock, SKUs or variants will be invented.");

  return allProducts;
}

/* ============================================================================
   9. DATABASE CATEGORY / BRAND VALIDATION
============================================================================ */

async function validateExistingCatalogReferences(): Promise<{
  categoryMap: Map<string, mongoose.Types.ObjectId>;
  brandId: mongoose.Types.ObjectId;
}> {
  printSection("STEP 2 — EXISTING CATALOG REFERENCE VALIDATION");

  /*
   * We do NOT create categories here.
   *
   * They must already exist.
   */
  const categories = await Category.find({}).lean();

  info(`Current categories: ${categories.length}`);

  const categoryMap = new Map<string, mongoose.Types.ObjectId>();

  for (const required of REQUIRED_EXISTING_CATEGORIES) {
    const category = categories.find(
      (item) => item.name === required.databaseName && item.slug === required.databaseSlug,
    );

    if (!category) {
      throw new Error(
        [
          "Required existing category was not found.",
          `Database name: ${required.databaseName}`,
          `Database slug: ${required.databaseSlug}`,
          "",
          "V3 will NOT create or replace categories.",
          "Fix the category data first, then rerun the dry run.",
        ].join("\n"),
      );
    }

    categoryMap.set(required.databaseName, category._id as mongoose.Types.ObjectId);
  }

  /*
   * There should be exactly one BuzzieWorld brand.
   *
   * We do not delete or recreate brands.
   */
  const matchingBrands = await Brand.find({
    name: EXPECTED_BRAND_NAME,
    slug: EXPECTED_BRAND_SLUG,
  }).lean();

  if (matchingBrands.length !== 1) {
    throw new Error(
      [
        `Expected exactly one ${EXPECTED_BRAND_NAME} brand.`,
        `Found: ${matchingBrands.length}`,
        "",
        "V3 will NOT create, delete or replace the brand.",
      ].join("\n"),
    );
  }

  const brandId = matchingBrands[0]._id as mongoose.Types.ObjectId;

  /*
   * Collections are deliberately inspected but not modified.
   */
  const collectionCount = await Collection.countDocuments({});

  info(`Current collections: ${collectionCount}`);

  success("Required existing categories validated.");
  success("Existing BuzzieWorld brand validated.");
  success("Existing collections left untouched.");

  return {
    categoryMap,
    brandId,
  };
}

/* ============================================================================
   10. DATABASE SAFETY CHECKS
============================================================================ */

async function runReferenceSafetyChecks(): Promise<void> {
  printSection("STEP 3 — PROTECTED REFERENCE SAFETY CHECK");

  const currentProductCount = await Product.countDocuments({});

  const currentCategoryCount = await Category.countDocuments({});

  const currentBrandCount = await Brand.countDocuments({});

  const currentCollectionCount = await Collection.countDocuments({});

  const orderCount = await Order.countDocuments({});

  const nonEmptyCartCount = await Cart.countDocuments({
    "items.0": { $exists: true },
  });

  const reviewCount = await Review.countDocuments({});

  info(`Current products: ${currentProductCount}`);
  info(`Current categories: ${currentCategoryCount}`);
  info(`Current brands: ${currentBrandCount}`);
  info(`Current collections: ${currentCollectionCount}`);
  info(`Orders: ${orderCount}`);
  info(`Carts containing items: ${nonEmptyCartCount}`);
  info(`Reviews: ${reviewCount}`);

  /*
   * --------------------------------------------------------------------------
   * IMPORTANT
   *
   * V3 never deletes Orders/Carts/Reviews/Wishlists.
   *
   * If any existing Product is referenced by those collections, deleting the
   * Product would leave historical references pointing at non-existent
   * documents.
   *
   * Therefore V3 REFUSES to continue.
   * --------------------------------------------------------------------------
   */

  const orderReferences = await Order.countDocuments({
    "items.product": { $exists: true },
  });

  if (orderReferences > 0) {
    throw new Error(
      [
        `Safety stop: ${orderReferences} order document(s) contain product references.`,
        "",
        "V3 will NOT delete those products because historical orders must remain intact.",
        "",
        "No database changes have been made.",
        "",
        "If these are only demo orders, do not manually delete them yet.",
        "Send the dry-run output back and we can handle the demo cleanup separately.",
      ].join("\n"),
    );
  }

  const cartReferences = await Cart.countDocuments({
    "items.product": { $exists: true },
  });

  if (cartReferences > 0) {
    throw new Error(
      [
        `Safety stop: ${cartReferences} cart document(s) contain product references.`,
        "",
        "V3 will NOT delete products while carts reference them.",
        "",
        "No database changes have been made.",
      ].join("\n"),
    );
  }

  const reviewReferences = await Review.countDocuments({
    product: { $exists: true },
  });

  if (reviewReferences > 0) {
    throw new Error(
      [
        `Safety stop: ${reviewReferences} review document(s) contain product references.`,
        "",
        "V3 will NOT delete products while reviews reference them.",
        "",
        "No database changes have been made.",
      ].join("\n"),
    );
  }

  /*
   * Wishlist schema has historically been incomplete in this project.
   *
   * Use the underlying MongoDB collection so the safety check does not depend
   * on a particular Mongoose schema shape.
   */
  try {
    const wishlistCollection = mongoose.connection.db?.collection("wishlists");

    if (!wishlistCollection) {
      success("MongoDB wishlist collection is unavailable; nothing to protect.");
      return;
    }

    const wishlistReference = await wishlistCollection.findOne({
      $or: [
        {
          product: {
            $exists: true,
          },
        },
        {
          products: {
            $exists: true,
          },
        },
        {
          "items.product": {
            $exists: true,
          },
        },
      ],
    });

    if (wishlistReference) {
      throw new Error(
        [
          "Safety stop: at least one wishlist document contains product data.",
          "",
          "V3 will NOT delete products while wishlist references may exist.",
          "",
          "No database changes have been made.",
        ].join("\n"),
      );
    }

    success("No wishlist product references detected.");
  } catch (error) {
    /*
     * If the underlying wishlist collection does not exist yet, that is safe.
     */
    const message = describeError(error);

    if (message.includes("ns not found") || message.includes("NamespaceNotFound")) {
      success("Wishlist collection does not exist; nothing to protect.");
    } else {
      throw error;
    }
  }

  success("No protected order product references detected.");
  success("No protected cart product references detected.");
  success("No protected review product references detected.");
  success("Protected reference safety checks passed.");
}

/* ============================================================================
   11. BACKUP
============================================================================ */

async function createCatalogBackup(): Promise<string> {
  printSection("STEP 4 — CREATING CATALOG BACKUP");

  fs.mkdirSync(BACKUP_DIRECTORY, {
    recursive: true,
  });

  const [products, categories, brands, collections] = await Promise.all([
    Product.find({}).lean(),
    Category.find({}).lean(),
    Brand.find({}).lean(),
    Collection.find({}).lean(),
  ]);

  const databaseName = mongoose.connection.db?.databaseName ?? "unknown";

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  const backupFile = path.join(BACKUP_DIRECTORY, `catalog-v3-backup-${timestamp}.json`);

  const backup: CatalogBackup = {
    createdAt: new Date().toISOString(),
    script: SCRIPT_NAME,
    databaseName,
    reason: "Automatic backup created before BuzzieWorld V3 product catalog replacement.",
    products: JSON.parse(JSON.stringify(products)),
    categories: JSON.parse(JSON.stringify(categories)),
    brands: JSON.parse(JSON.stringify(brands)),
    collections: JSON.parse(JSON.stringify(collections)),
  };

  fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2), "utf8");

  success(`Catalog backup created: ${backupFile}`);

  info(
    `Backup contains ${products.length} products, ${categories.length} categories, ${brands.length} brands and ${collections.length} collections.`,
  );

  return backupFile;
}

/* ============================================================================
   12. PRE-TRANSACTION FINAL CHECK
============================================================================ */

async function finalPreApplyCheck(products: MigrationProduct[]): Promise<void> {
  printSection("STEP 5 — FINAL PRE-APPLY SAFETY CHECK");

  if (!APPLY_MODE) {
    success("DRY RUN mode detected.");
    success("No MongoDB writes are permitted.");
    return;
  }

  if (!CONFIRM_REPLACE_MODE) {
    throw new Error(
      [
        "APPLY mode was requested without the required confirmation flag.",
        "",
        "This migration replaces ALL existing Product documents.",
        "",
        "To explicitly authorize the replacement, run:",
        "",
        "  npx tsx scripts/seed-catalog-v3.ts --apply --confirm-replace",
        "",
        "No database changes have been made.",
      ].join("\n"),
    );
  }

  if (products.length !== EXPECTED_PRODUCT_COUNT) {
    throw new Error(
      `Final safety check expected ${EXPECTED_PRODUCT_COUNT} products but received ${products.length}.`,
    );
  }

  /*
   * The source catalog itself must be valid before destructive work starts.
   */
  await runReferenceSafetyChecks();

  success("Explicit --apply detected.");
  success("Explicit --confirm-replace detected.");
  success("Final safety check passed.");
}

/* ============================================================================
   13. PRODUCT DOCUMENT BUILDER
============================================================================ */

function buildProductDocument(
  product: MigrationProduct,
  categoryMap: Map<string, mongoose.Types.ObjectId>,
  brandId: mongoose.Types.ObjectId,
): Record<string, unknown> {
  const categoryId = categoryMap.get(product.categoryName);

  if (!categoryId) {
    throw new Error(`Database category ID missing for "${product.categoryName}".`);
  }

  return {
    name: product.name,
    slug: product.slug,

    description: product.description,

    shortDescription: product.shortDescription,

    /*
     * Commerce fields intentionally remain unset.
     *
     * Product is DRAFT, so price and stock are not required by the current
     * Product schema.
     */
    price: undefined,
    compareAtPrice: undefined,
    sku: undefined,

    /*
     * Images are intentionally empty.
     *
     * You will map the actual product images later through the Admin panel /
     * Cloudinary workflow.
     */
    images: [],

    category: categoryId,

    /*
     * Existing BuzzieWorld brand.
     */
    brand: brandId,

    /*
     * Existing collections are intentionally NOT assigned.
     *
     * The client source did not provide authoritative collection assignments.
     * We will not invent them.
     */
    collection: undefined,

    variants: [],

    stock: undefined,

    /*
     * Every product is intentionally draft.
     *
     * This prevents incomplete products from being purchasable.
     */
    status: "draft",

    featured: false,

    ...(product.ageRange
      ? {
          ageRange: product.ageRange,
        }
      : {}),
  };
}

/* ============================================================================
   14. INSERT PRODUCTS
============================================================================ */

async function insertProducts(
  products: MigrationProduct[],
  categoryMap: Map<string, mongoose.Types.ObjectId>,
  brandId: mongoose.Types.ObjectId,
  session: mongoose.ClientSession,
): Promise<void> {
  printSection("STEP 8 — INSERTING 49 PRODUCTS");

  const documents = products.map((product) => buildProductDocument(product, categoryMap, brandId));

  info(`Preparing ${documents.length} Product documents...`);

  for (const product of products) {
    const categoryId = categoryMap.get(product.categoryName);

    if (!categoryId) {
      throw new Error(
        `Cannot insert "${product.name}": category "${product.categoryName}" is missing.`,
      );
    }

    console.log(
      `  ${String(product.sourceNumber).padStart(2, "0")}. ${product.name} -> ${product.categoryName}`,
    );
  }

  await Product.insertMany(documents, {
    session,
    ordered: true,
  });

  success(`Inserted ${documents.length} products.`);
}

/* ============================================================================
   15. TRANSACTION VERIFICATION
============================================================================ */

async function verifyInsideTransaction(
  products: MigrationProduct[],
  categoryMap: Map<string, mongoose.Types.ObjectId>,
  brandId: mongoose.Types.ObjectId,
  session: mongoose.ClientSession,
): Promise<void> {
  printSection("STEP 9 — VERIFYING INSIDE TRANSACTION");

  const productCount = await Product.countDocuments({}, { session });

  if (productCount !== EXPECTED_PRODUCT_COUNT) {
    throw new Error(
      [
        "Transaction verification failed.",
        `Expected products: ${EXPECTED_PRODUCT_COUNT}`,
        `Found products: ${productCount}`,
      ].join("\n"),
    );
  }

  const productNames = await Product.find({})
    .select("name slug category brand status images price stock variants")
    .lean()
    .session(session);

  if (productNames.length !== EXPECTED_PRODUCT_COUNT) {
    throw new Error(
      `Transaction verification returned ${productNames.length} products instead of ${EXPECTED_PRODUCT_COUNT}.`,
    );
  }

  const expectedNameSet = new Set(products.map((product) => product.name));

  const actualNameSet = new Set(productNames.map((product) => product.name));

  if (expectedNameSet.size !== actualNameSet.size) {
    throw new Error("Transaction verification detected duplicate or missing product names.");
  }

  for (const expectedName of expectedNameSet) {
    if (!actualNameSet.has(expectedName)) {
      throw new Error(`Transaction verification missing product: ${expectedName}`);
    }
  }

  /*
   * Every product must be draft.
   */
  const nonDraftCount = productNames.filter((product) => product.status !== "draft").length;

  if (nonDraftCount !== 0) {
    throw new Error(`Transaction verification found ${nonDraftCount} non-draft products.`);
  }

  /*
   * Every product must have zero images at this migration stage.
   */
  const productsWithImages = productNames.filter(
    (product) => Array.isArray(product.images) && product.images.length > 0,
  ).length;

  if (productsWithImages !== 0) {
    throw new Error(
      `Transaction verification found ${productsWithImages} products with images. Images must remain empty in V3.`,
    );
  }

  /*
   * Product prices must not be invented.
   */
  const productsWithPrices = productNames.filter(
    (product) => typeof product.price === "number" || typeof product.compareAtPrice === "number",
  ).length;

  if (productsWithPrices !== 0) {
    throw new Error(
      `Transaction verification found ${productsWithPrices} products with invented commerce pricing.`,
    );
  }

  /*
   * Product stock must not be invented.
   */
  const productsWithStock = productNames.filter(
    (product) => typeof product.stock === "number",
  ).length;

  if (productsWithStock !== 0) {
    throw new Error(
      `Transaction verification found ${productsWithStock} products with invented stock.`,
    );
  }

  /*
   * Every product must reference one of the required existing categories.
   */
  const allowedCategoryIds = new Set(Array.from(categoryMap.values()).map((id) => id.toString()));

  for (const product of productNames) {
    if (!product.category) {
      throw new Error(`Product "${product.name}" has no category reference.`);
    }

    if (!allowedCategoryIds.has(product.category.toString())) {
      throw new Error(`Product "${product.name}" has an unexpected category reference.`);
    }

    if (!product.brand) {
      throw new Error(`Product "${product.name}" has no brand reference.`);
    }

    if (product.brand.toString() !== brandId.toString()) {
      throw new Error(`Product "${product.name}" has an unexpected brand reference.`);
    }
  }

  /*
   * Verify there are exactly 49 unique slugs.
   */
  const slugs = productNames.map((product) => product.slug);

  if (new Set(slugs).size !== EXPECTED_PRODUCT_COUNT) {
    throw new Error("Transaction verification detected duplicate product slugs.");
  }

  success("Product count verified = 49.");
  success("All product names verified.");
  success("All products verified as DRAFT.");
  success("All product images verified as empty.");
  success("No prices inserted.");
  success("No stock inserted.");
  success("All category references verified.");
  success("All brand references verified.");
  success("Product slugs verified as unique.");
  success("Transaction verification passed.");
}

/* ============================================================================
   16. POST-COMMIT VERIFICATION
============================================================================ */

async function verifyAfterCommit(products: MigrationProduct[]): Promise<void> {
  printSection("STEP 11 — POST-COMMIT VERIFICATION");

  const productCount = await Product.countDocuments({});

  if (productCount !== EXPECTED_PRODUCT_COUNT) {
    throw new Error(
      `Post-commit verification failed: expected ${EXPECTED_PRODUCT_COUNT} products, found ${productCount}.`,
    );
  }

  const persistedProducts = await Product.find({})
    .select("name slug status images price stock category brand")
    .lean();

  const expectedNames = new Set(products.map((product) => product.name));

  const persistedNames = new Set(persistedProducts.map((product) => product.name));

  if (persistedNames.size !== EXPECTED_PRODUCT_COUNT) {
    throw new Error(`Post-commit verification found ${persistedNames.size} unique product names.`);
  }

  for (const name of expectedNames) {
    if (!persistedNames.has(name)) {
      throw new Error(`Post-commit verification missing product: ${name}`);
    }
  }

  const activeCount = persistedProducts.filter((product) => product.status === "active").length;

  if (activeCount !== 0) {
    throw new Error(
      `Post-commit verification found ${activeCount} active products. V3 should create zero active products.`,
    );
  }

  const imageCount = persistedProducts.reduce(
    (total, product) => total + (Array.isArray(product.images) ? product.images.length : 0),
    0,
  );

  if (imageCount !== 0) {
    throw new Error(`Post-commit verification found ${imageCount} persisted product images.`);
  }

  success("Post-commit product count = 49.");
  success("Post-commit product names verified.");
  success("Post-commit status verification passed.");
  success("Post-commit image verification passed.");
}

/* ============================================================================
   17. DRY RUN REPORT
============================================================================ */

async function printDryRunReport(products: MigrationProduct[]): Promise<void> {
  printHeader("BUZZIEWORLD CATALOG V3 — DRY RUN / NO DATABASE CHANGES");

  console.log("SOURCE");
  console.log("----------------------------------------");
  console.log(SOURCE_FILE);

  console.log("");
  console.log("MIGRATION");
  console.log("----------------------------------------");
  console.log("Existing categories: PRESERVED");
  console.log("Existing brand:      PRESERVED");
  console.log("Existing collections:PRESERVED");
  console.log("Existing products:   BACKUP + REPLACE");
  console.log("Users:               UNTOUCHED");
  console.log("Orders:              UNTOUCHED");
  console.log("Carts:               UNTOUCHED");
  console.log("Reviews:             UNTOUCHED");
  console.log("Wishlists:           UNTOUCHED");
  console.log("Payments:            UNTOUCHED");
  console.log("Authentication:      UNTOUCHED");
  console.log("Settings:            UNTOUCHED");

  console.log("");
  console.log("CATALOG");
  console.log("----------------------------------------");
  console.log(`Products:             ${products.length}`);
  console.log(`Detailed products:    ${EXPECTED_DETAILED_PRODUCT_COUNT}`);
  console.log(`Placeholders:         ${EXPECTED_PLACEHOLDER_COUNT}`);
  console.log("Product status:       draft");
  console.log("Images:               empty");
  console.log("Prices:               unset");
  console.log("Stock:                unset");
  console.log("SKU:                  unset");
  console.log("Variants:             empty");

  console.log("");
  console.log("PRODUCTS");
  console.log("----------------------------------------");

  for (const product of products) {
    const placeholder = EXPECTED_PLACEHOLDERS.some(
      (item) => item.sourceNumber === product.sourceNumber,
    );

    console.log(
      `${String(product.sourceNumber).padStart(2, "0")}. ${product.name}${
        placeholder ? " [PLACEHOLDER]" : ""
      }`,
    );
  }

  console.log("");

  warning("DRY RUN ONLY.");
  warning("No database writes have been performed.");

  console.log("");
  console.log("If the output is correct, the APPLY command is:");
  console.log("");
  console.log("  npx tsx scripts/seed-catalog-v3.ts --apply --confirm-replace");
  console.log("");
}

/* ============================================================================
   18. MAIN MIGRATION
============================================================================ */

async function runMigration(): Promise<void> {
  printHeader("BUZZIEWORLD — CATALOG MIGRATION V3");

  info(`Execution mode: ${DRY_RUN_MODE ? "DRY RUN" : "APPLY"}`);

  if (UNSUPPORTED_DEMO_CLEANUP_MODE) {
    throw new Error(
      [
        "--clear-demo-data is intentionally NOT supported by V3.",
        "",
        "V3 never deletes Orders or Carts.",
        "",
        "If your database contains only demo orders/carts and they block",
        "the migration, stop here and review them separately.",
      ].join("\n"),
    );
  }

  /*
   * --------------------------------------------------------------------------
   * STEP 1
   * Load and validate source catalog.
   * --------------------------------------------------------------------------
   */

  const source = loadSourceCatalog();

  const products = validateStaticCatalog(source);

  await loadApplicationModules();

  /*
   * --------------------------------------------------------------------------
   * STEP 2
   * Connect to MongoDB.
   * --------------------------------------------------------------------------
   */

  printSection("STEP 2 — CONNECTING TO MONGODB");

  await connectToDatabase();

  if (mongoose.connection.readyState !== 1) {
    throw new Error(
      `MongoDB connection state is ${mongoose.connection.readyState}, expected CONNECTED (1).`,
    );
  }

  success("MongoDB connection established.");

  if (mongoose.connection.db?.databaseName) {
    info(`Database name: ${mongoose.connection.db.databaseName}`);
  }

  /*
   * --------------------------------------------------------------------------
   * STEP 3
   * Existing catalog references.
   * --------------------------------------------------------------------------
   */

  const { categoryMap, brandId } = await validateExistingCatalogReferences();

  /*
   * --------------------------------------------------------------------------
   * STEP 4
   * Protected references.
   *
   * This runs in BOTH dry-run and apply mode.
   * --------------------------------------------------------------------------
   */

  await runReferenceSafetyChecks();

  // Capture the product count immediately before the final safety gate.
  // The transaction re-checks this value before deleting anything.
  const productCountBeforeApply = await Product.countDocuments({});

  /*
   * --------------------------------------------------------------------------
   * STEP 5
   * Final safety gate.
   * --------------------------------------------------------------------------
   */

  await finalPreApplyCheck(products);

  /*
   * --------------------------------------------------------------------------
   * DRY RUN STOP
   * --------------------------------------------------------------------------
   */

  if (DRY_RUN_MODE) {
    await printDryRunReport(products);
    return;
  }

  /*
   * --------------------------------------------------------------------------
   * STEP 6
   * Backup.
   * --------------------------------------------------------------------------
   */

  const backupFile = await createCatalogBackup();

  /*
   * --------------------------------------------------------------------------
   * STEP 7
   * Start transaction.
   * --------------------------------------------------------------------------
   */

  printSection("STEP 7 — STARTING MONGODB TRANSACTION");

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(
      async () => {
        info("MongoDB transaction started.");

        /*
         * Re-check product count inside the transaction.
         *
         * This is intentionally defensive. If another process inserted or
         * changed products between our safety checks and transaction start,
         * the migration should stop instead of blindly replacing them.
         */
        const productCountAtTransactionStart = await Product.countDocuments({}, { session });

        info(`Products immediately before replacement: ${productCountAtTransactionStart}`);

        if (productCountAtTransactionStart !== productCountBeforeApply) {
          throw new Error(
            [
              "Safety stop: the Product count changed after the final pre-apply check.",
              `Expected before transaction: ${productCountBeforeApply}`,
              `Found at transaction start: ${productCountAtTransactionStart}`,
              "No Product documents will be replaced.",
            ].join("\n"),
          );
        }

        /*
         * Delete ONLY Product documents.
         *
         * Categories, brands and collections are NOT deleted.
         */
        const deleteResult = await Product.deleteMany(
          {},
          {
            session,
          },
        );

        info(`Deleted existing products: ${deleteResult.deletedCount}`);

        /*
         * Insert the new 49-product catalog.
         */
        await insertProducts(products, categoryMap, brandId, session);

        /*
         * Verify everything before commit.
         */
        await verifyInsideTransaction(products, categoryMap, brandId, session);

        info("Transaction callback completed successfully.");
        info("MongoDB will now commit the catalog replacement atomically.");
      },
      {
        readPreference: "primary",
        readConcern: {
          level: "snapshot",
        },
        writeConcern: {
          w: "majority",
        },
        maxCommitTimeMS: 120000,
      },
    );

    success("MongoDB transaction COMMITTED successfully.");
  } catch (error) {
    failure("MongoDB transaction FAILED.");

    console.error("");
    console.error("ERROR DETAILS:");
    console.error(describeError(error));

    console.error("");
    console.error("IMPORTANT:");
    console.error(
      "- If the transaction did not commit, MongoDB should have rolled back the product replacement.",
    );
    console.error("- The pre-migration backup was already created.");
    console.error(`- Backup: ${backupFile}`);
    console.error("- Do NOT rerun blindly if the commit result was ambiguous.");

    throw error;
  } finally {
    await session.endSession();
    success("MongoDB transaction session closed.");
  }

  /*
   * --------------------------------------------------------------------------
   * STEP 10
   * Post-commit verification.
   * --------------------------------------------------------------------------
   */

  await verifyAfterCommit(products);

  /*
   * --------------------------------------------------------------------------
   * SUCCESS
   * --------------------------------------------------------------------------
   */

  printHeader("BUZZIEWORLD CATALOG V3 — MIGRATION COMPLETED SUCCESSFULLY");

  success("49 products are now present in MongoDB.");
  success("42 detailed products were seeded from the verified catalog source.");
  success("7 intentionally incomplete products were created as drafts.");
  success("Existing categories were preserved.");
  success("Existing BuzzieWorld brand was preserved.");
  success("Existing collections were preserved.");
  success("All products are DRAFT.");
  success("All product images are empty.");
  success("No prices were invented.");
  success("No stock values were invented.");
  success("No SKUs were invented.");
  success("No variants were invented.");
  success("Protected data was not deleted.");

  console.log("");
  console.log("CATALOG BACKUP");
  console.log("----------------------------------------");
  console.log(backupFile);
  console.log("----------------------------------------");

  console.log("");
  console.log("Next step: map/upload the actual product images through the Admin panel.");
}

/* ============================================================================
   19. ERROR FORMATTER
============================================================================ */

function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.stack || error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error, null, 2);
  } catch {
    return String(error);
  }
}

/* ============================================================================
   20. GLOBAL ERROR HANDLER
============================================================================ */

async function main(): Promise<void> {
  try {
    await runMigration();
  } catch (error) {
    printHeader("BUZZIEWORLD CATALOG V3 — MIGRATION FAILED");

    failure("The migration did not complete.");

    console.error("");
    console.error("ERROR DETAILS:");
    console.error(describeError(error));

    console.error("");
    console.error("SAFETY STATUS:");
    console.error("- If this was a DRY RUN, no database changes were made.");
    console.error(
      "- If APPLY mode failed before transaction commit, MongoDB should have rolled back the transaction.",
    );
    console.error(
      "- A catalog backup is created BEFORE the destructive Product replacement begins.",
    );
    console.error("- Categories, brands and collections are never deleted by V3.");
    console.error(
      "- Users, orders, carts, reviews, wishlists and authentication data are never deleted by V3.",
    );

    process.exitCode = 1;
  } finally {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
        success("MongoDB connection closed.");
      }
    } catch (disconnectError) {
      console.error("Failed to close MongoDB connection:", describeError(disconnectError));

      process.exitCode = 1;
    }
  }
}

/* ============================================================================
   21. RUN
============================================================================ */

void main();
