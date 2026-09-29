/**
 * BUZZIEWORLD
 * Product Key Features Migration
 *
 * PURPOSE
 * -------
 * Populate Product.keyFeatures for the existing 49-product catalog.
 *
 * IMPORTANT CATALOG STRUCTURE
 * ---------------------------
 * MongoDB contains:
 *
 *   49 total products
 *
 * The verified detailed catalog source contains:
 *
 *   42 detailed products
 *
 * The remaining 7 products were intentionally created as
 * name/category-only placeholders during Catalog V3 migration.
 *
 * Therefore:
 *
 *   42 products -> receive their real keyFeatures
 *    7 products -> receive []
 *
 * THIS SCRIPT ONLY MODIFIES:
 *
 *   keyFeatures
 *
 * IT DOES NOT MODIFY:
 *
 *   name
 *   slug
 *   description
 *   shortDescription
 *   price
 *   compareAtPrice
 *   sku
 *   images
 *   category
 *   brand
 *   collection
 *   variants
 *   stock
 *   status
 *   published
 *   featured
 *   ageRange
 *
 * It does not delete anything.
 */

import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

dotenv.config({ path: ".env.local" });

type SourceContent = {
  keyFeatures?: unknown;
};

type CatalogProduct = {
  sourceNumber?: number;
  name: string;
  slug: string;
  sourceContent?: SourceContent;
};

type Catalog = {
  products: CatalogProduct[];
};

const EXPECTED_DATABASE_PRODUCTS = 49;
const EXPECTED_DETAILED_PRODUCTS = 42;

const PLACEHOLDER_PRODUCTS = [
  "Animal Busy Book",
  "My First Busy Book",
  "Logo Blitz",
  "DIY DIYA KIT",
  "DIY JHAROKA KIT",
  "DIY RAM MANDIR",
  "DIY RANGOLI",
] as const;

async function main(): Promise<void> {
  // IMPORTANT:
  // Import database modules only after .env.local has been loaded.
  const { connectToDatabase } = await import("@/lib/mongoose");
  const { Product } = await import("@/models/Product");

  console.log("");
  console.log("==============================================================");
  console.log("BUZZIEWORLD — PRODUCT KEY FEATURES MIGRATION");
  console.log("==============================================================");
  console.log("");

  /*
   * ========================================================================
   * 1. LOAD SOURCE CATALOG
   * ========================================================================
   */

  const catalogPath = path.resolve(process.cwd(), "data/buzzieworld-complete-catalog-v2.json");

  if (!fs.existsSync(catalogPath)) {
    throw new Error(`Catalog file was not found:\n${catalogPath}`);
  }

  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8")) as Catalog;

  if (!Array.isArray(catalog.products)) {
    throw new Error("Catalog does not contain a valid products array.");
  }

  console.log(`Detailed catalog products found: ${catalog.products.length}`);

  if (catalog.products.length !== EXPECTED_DETAILED_PRODUCTS) {
    throw new Error(
      `Expected exactly ${EXPECTED_DETAILED_PRODUCTS} detailed catalog products, but found ${catalog.products.length}. Migration stopped.`,
    );
  }

  /*
   * ========================================================================
   * 2. VALIDATE SOURCE CATALOG SLUGS
   * ========================================================================
   */

  const catalogSlugs = new Set<string>();

  for (const product of catalog.products) {
    if (!product.name?.trim()) {
      throw new Error("A catalog product is missing its name.");
    }

    if (!product.slug?.trim()) {
      throw new Error(`Catalog product "${product.name}" is missing a slug.`);
    }

    if (catalogSlugs.has(product.slug)) {
      throw new Error(`Duplicate catalog slug detected: ${product.slug}`);
    }

    catalogSlugs.add(product.slug);
  }

  console.log("Detailed catalog validation: PASSED");
  console.log("");

  /*
   * ========================================================================
   * 3. CONNECT TO DATABASE
   * ========================================================================
   */

  await connectToDatabase();

  /*
   * ========================================================================
   * 4. READ ALL DATABASE PRODUCTS
   * ========================================================================
   */

  const databaseProducts = await Product.find({}).select("_id name slug keyFeatures").lean();

  console.log(`Database products found: ${databaseProducts.length}`);

  if (databaseProducts.length !== EXPECTED_DATABASE_PRODUCTS) {
    throw new Error(
      `Expected exactly ${EXPECTED_DATABASE_PRODUCTS} database products, but found ${databaseProducts.length}. Migration stopped.`,
    );
  }

  /*
   * ========================================================================
   * 5. VALIDATE DATABASE SLUGS
   * ========================================================================
   */

  const databaseBySlug = new Map(databaseProducts.map((product) => [product.slug, product]));

  /*
   * ========================================================================
   * 6. VALIDATE ALL 42 DETAILED PRODUCTS EXIST IN DATABASE
   * ========================================================================
   */

  const missingDetailedProducts = catalog.products.filter(
    (catalogProduct) => !databaseBySlug.has(catalogProduct.slug),
  );

  if (missingDetailedProducts.length > 0) {
    console.error("");
    console.error("The following detailed catalog products are missing from MongoDB:");

    for (const product of missingDetailedProducts) {
      console.error(`  - ${product.name} (${product.slug})`);
    }

    throw new Error(
      `${missingDetailedProducts.length} detailed catalog products could not be matched to MongoDB.`,
    );
  }

  console.log("42 detailed catalog products matched to MongoDB: PASSED");

  /*
   * ========================================================================
   * 7. FIND THE 7 PLACEHOLDERS
   * ========================================================================
   */

  const placeholderProducts = databaseProducts.filter((product) =>
    PLACEHOLDER_PRODUCTS.includes(product.name as (typeof PLACEHOLDER_PRODUCTS)[number]),
  );

  console.log(`Placeholder products found: ${placeholderProducts.length}`);

  if (placeholderProducts.length !== PLACEHOLDER_PRODUCTS.length) {
    console.error("");
    console.error("Expected these 7 placeholder products:");

    for (const name of PLACEHOLDER_PRODUCTS) {
      console.error(`  - ${name}`);
    }

    console.error("");
    console.error("Actually found:");

    for (const product of placeholderProducts) {
      console.error(`  - ${product.name}`);
    }

    throw new Error(
      "The expected 7 placeholder products could not be safely identified. Migration stopped.",
    );
  }

  console.log("7 placeholder products matched: PASSED");

  /*
   * ========================================================================
   * 8. MIGRATE THE 42 DETAILED PRODUCTS
   * ========================================================================
   */

  let detailedMatched = 0;
  let detailedModified = 0;
  let detailedEmpty = 0;

  console.log("");
  console.log("--------------------------------------------------------------");
  console.log("MIGRATING 42 DETAILED PRODUCTS");
  console.log("--------------------------------------------------------------");

  for (const catalogProduct of catalog.products) {
    const rawFeatures = catalogProduct.sourceContent?.keyFeatures;

    const keyFeatures = Array.isArray(rawFeatures)
      ? rawFeatures
          .filter((feature): feature is string => typeof feature === "string")
          .map((feature) => feature.trim())
          .filter(Boolean)
      : [];

    detailedMatched += 1;

    if (keyFeatures.length === 0) {
      detailedEmpty += 1;

      console.log(`[EMPTY]  ${catalogProduct.name}`);
    } else {
      console.log(`[UPDATE] ${catalogProduct.name} → ${keyFeatures.length} features`);
    }

    const result = await Product.updateOne(
      {
        slug: catalogProduct.slug,
      },
      {
        $set: {
          keyFeatures,
        },
      },
    );

    detailedModified += result.modifiedCount;
  }

  /*
   * ========================================================================
   * 9. SET EMPTY FEATURES FOR THE 7 PLACEHOLDERS
   * ========================================================================
   *
   * These products intentionally have no detailed source content.
   *
   * We still give them a consistent keyFeatures: [] field so the
   * storefront can safely render:
   *
   *   product.keyFeatures.length
   *
   * without undefined/null handling.
   * ========================================================================
   */

  let placeholderModified = 0;

  console.log("");
  console.log("--------------------------------------------------------------");
  console.log("SETTING 7 PLACEHOLDER PRODUCTS");
  console.log("--------------------------------------------------------------");

  for (const productName of PLACEHOLDER_PRODUCTS) {
    console.log(`[PLACEHOLDER] ${productName} → []`);

    const result = await Product.updateOne(
      {
        name: productName,
      },
      {
        $set: {
          keyFeatures: [],
        },
      },
    );

    placeholderModified += result.modifiedCount;
  }

  /*
   * ========================================================================
   * 10. MIGRATION SUMMARY
   * ========================================================================
   */

  console.log("");
  console.log("--------------------------------------------------------------");
  console.log("MIGRATION RESULT");
  console.log("--------------------------------------------------------------");

  console.log(`Detailed products processed:       ${detailedMatched}`);

  console.log(`Detailed products modified:        ${detailedModified}`);

  console.log(`Detailed products with no features: ${detailedEmpty}`);

  console.log(`Placeholder products processed:    ${PLACEHOLDER_PRODUCTS.length}`);

  console.log(`Placeholder products modified:     ${placeholderModified}`);

  /*
   * ========================================================================
   * 11. POST-MIGRATION VERIFICATION
   * ========================================================================
   */

  console.log("");
  console.log("--------------------------------------------------------------");
  console.log("POST-MIGRATION VERIFICATION");
  console.log("--------------------------------------------------------------");

  const [totalProducts, productsWithKeyFeaturesArray, productsWithoutKeyFeaturesArray] =
    await Promise.all([
      Product.countDocuments(),

      Product.countDocuments({
        keyFeatures: {
          $exists: true,
          $type: "array",
        },
      }),

      Product.countDocuments({
        $or: [
          {
            keyFeatures: {
              $exists: false,
            },
          },
          {
            keyFeatures: {
              $not: {
                $type: "array",
              },
            },
          },
        ],
      }),
    ]);

  console.log(`Total products:                    ${totalProducts}`);

  console.log(`Products with keyFeatures array:   ${productsWithKeyFeaturesArray}`);

  console.log(`Products without keyFeatures:      ${productsWithoutKeyFeaturesArray}`);

  /*
   * ========================================================================
   * 12. VERIFY THE 7 PLACEHOLDERS ARE EMPTY
   * ========================================================================
   */

  const placeholderVerification = await Product.find({
    name: {
      $in: [...PLACEHOLDER_PRODUCTS],
    },
  })
    .select("name keyFeatures")
    .lean();

  const placeholdersWithUnexpectedFeatures = placeholderVerification.filter(
    (product) => !Array.isArray(product.keyFeatures) || product.keyFeatures.length !== 0,
  );

  console.log(
    `Placeholders with keyFeatures:     ${
      placeholderVerification.filter(
        (product) => Array.isArray(product.keyFeatures) && product.keyFeatures.length > 0,
      ).length
    }`,
  );

  /*
   * ========================================================================
   * 13. FINAL SAFETY CHECKS
   * ========================================================================
   */

  if (totalProducts !== EXPECTED_DATABASE_PRODUCTS) {
    throw new Error(
      `Database product count changed unexpectedly. Expected ${EXPECTED_DATABASE_PRODUCTS}, found ${totalProducts}.`,
    );
  }

  if (productsWithoutKeyFeaturesArray !== 0) {
    throw new Error(
      `${productsWithoutKeyFeaturesArray} products still do not have a keyFeatures array.`,
    );
  }

  if (placeholdersWithUnexpectedFeatures.length > 0) {
    throw new Error("One or more placeholder products unexpectedly contain key features.");
  }

  console.log("");
  console.log("==============================================================");
  console.log("SUCCESS");
  console.log("==============================================================");
  console.log("");

  console.log("✓ 49 database products verified.");

  console.log("✓ 42 detailed products received their source keyFeatures.");

  console.log("✓ 7 placeholder products received keyFeatures: [].");

  console.log("✓ Every product now has a keyFeatures array.");

  console.log("✓ No price data was modified.");

  console.log("✓ No stock data was modified.");

  console.log("✓ No images were modified.");

  console.log("✓ No descriptions were modified.");

  console.log("✓ No publication/status data was modified.");

  console.log("");
}

main().catch((error) => {
  console.error("");
  console.error("MIGRATION FAILED");
  console.error("");

  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }

  process.exit(1);
});
