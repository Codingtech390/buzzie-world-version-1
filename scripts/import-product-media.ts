import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

import mongoose from "mongoose";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const MEDIA_ROOT = "C:\\Users\\DELL\\Downloads\\img";

const CLOUDINARY_FOLDER_ROOT = "buzzie-world/products";

const SUPPORTED_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);

const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * The existing ProductMedia UI has a 10-image gallery limit.
 *
 * We do NOT silently discard images beyond that limit.
 * Products with >10 images are reported and skipped until explicitly
 * handled.
 */
const MAX_PRODUCT_IMAGES = 10;

type MediaFile = {
  name: string;
  absolutePath: string;
  relativePath: string;
  extension: string;
  sizeBytes: number;
};

type FolderMapping = {
  folderName: string;
  productName: string;
  productSlug: string;
};

type ProductRecord = {
  _id: string;
  name: string;
  slug: string;
  images: Array<{
    url: string;
    publicId?: string;
    alt?: string;
  }>;
};

type CloudinaryUploadResponse = {
  secure_url?: string;
  public_id?: string;
  error?: {
    message?: string;
  };
};

type UploadedImage = {
  url: string;
  publicId: string;
  alt: string;
  sourceFile: string;
};

/**
 * Explicit mappings for the 5 folders that the scanner could not
 * automatically assign.
 *
 * These mappings come directly from the scan you just ran.
 */
const MANUAL_FOLDER_MAPPINGS: Record<string, string> = {
  "Buzzie-brain-part-1": "buzzie-brains-reusable-activity-mats",

  "Buzzie-brain-part-2": "buzzie-brains-part-2-activity-mats",

  "Guess-who-ramayana": "guess-who-i-am-ramayana-edition",

  "Multiplication-table": "multiplication-table-flashcards-1-20",

  "Word-families": "word-family-flashcards",
};

/**
 * Convert a string into a safe Cloudinary path component.
 */
function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Build product-specific Cloudinary folder.
 *
 * Example:
 *
 * buzzie-world/products/brain-binder-activity-book-kids
 */
function buildCloudinaryFolder(productSlug: string): string {
  return `${CLOUDINARY_FOLDER_ROOT}/${slugify(productSlug)}`;
}

/**
 * Create a deterministic public ID from the local file path.
 *
 * We intentionally use the relative source path so running the
 * importer again produces the same Cloudinary public ID.
 */
function buildPublicId(relativePath: string): string {
  const withoutExtension = relativePath.replace(/\.[^/.]+$/, "");

  const safePath = withoutExtension
    .split(/[\\/]+/)
    .map((part) => slugify(part))
    .filter(Boolean)
    .join("-");

  return safePath || "product-image";
}

/**
 * Cloudinary's signed upload uses SHA-1 over sorted parameters.
 */
function signCloudinaryParams(params: Record<string, string | number>, apiSecret: string): string {
  const serialized = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto.createHash("sha1").update(`${serialized}${apiSecret}`).digest("hex");
}

function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];

  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);

  const value = bytes / Math.pow(1024, index);

  return `${value.toFixed(index === 0 ? 0 : 2)} ${units[index]}`;
}

function printLine() {
  console.log("------------------------------------------------------------");
}

/**
 * Scan one product folder.
 *
 * Only direct files are considered. This matches the folder
 * structure we scanned earlier.
 */
async function getFolderFiles(folderName: string): Promise<MediaFile[]> {
  const folderPath = path.join(MEDIA_ROOT, folderName);

  const entries = await fs.readdir(folderPath, {
    withFileTypes: true,
  });

  const files: MediaFile[] = [];

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();

    if (!SUPPORTED_EXTENSIONS.has(extension)) {
      continue;
    }

    const absolutePath = path.join(folderPath, entry.name);

    const stats = await fs.stat(absolutePath);

    files.push({
      name: entry.name,
      absolutePath,
      relativePath: path.relative(MEDIA_ROOT, absolutePath),
      extension,
      sizeBytes: stats.size,
    });
  }

  files.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );

  return files;
}

/**
 * Create the complete 29-folder mapping.
 *
 * We do not use fuzzy matching during the actual import.
 * The 24 exact matches come from the scanner.
 * The 5 ambiguous folders are explicitly mapped above.
 */
async function buildMappings(products: ProductRecord[]): Promise<FolderMapping[]> {
  const entries = await fs.readdir(MEDIA_ROOT, {
    withFileTypes: true,
  });

  const productBySlug = new Map(products.map((product) => [product.slug, product]));

  const mappings: FolderMapping[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const folderName = entry.name;

    const manualSlug = MANUAL_FOLDER_MAPPINGS[folderName];

    if (manualSlug) {
      const product = productBySlug.get(manualSlug);

      if (!product) {
        throw new Error(
          [
            `Manual mapping failed for folder "${folderName}".`,
            `Expected product slug: ${manualSlug}`,
            "",
            "That product does not exist in MongoDB.",
          ].join("\n"),
        );
      }

      mappings.push({
        folderName,
        productName: product.name,
        productSlug: product.slug,
      });

      continue;
    }

    /**
     * For the remaining folders, perform only an exact
     * normalized name/slug comparison.
     */
    const normalizedFolder = normalize(folderName);

    const product = products.find(
      (item) =>
        normalize(item.name) === normalizedFolder || normalize(item.slug) === normalizedFolder,
    );

    if (!product) {
      throw new Error(
        [
          `No safe product mapping found for folder "${folderName}".`,
          "",
          "The importer refuses to guess.",
        ].join("\n"),
      );
    }

    mappings.push({
      folderName,
      productName: product.name,
      productSlug: product.slug,
    });
  }

  mappings.sort((a, b) =>
    a.folderName.localeCompare(b.folderName, undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );

  return mappings;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

/**
 * Upload one image to Cloudinary using the same signing model
 * used by the existing BuzzieWorld media infrastructure.
 */
async function uploadToCloudinary(
  file: MediaFile,
  productSlug: string,
  cloudName: string,
  apiKey: string,
  apiSecret: string,
): Promise<UploadedImage> {
  if (file.sizeBytes <= 0) {
    throw new Error(`Empty image file: ${file.relativePath}`);
  }

  if (file.sizeBytes > MAX_FILE_SIZE) {
    throw new Error(
      [
        `Image exceeds the 10 MB limit:`,
        file.relativePath,
        `Size: ${formatBytes(file.sizeBytes)}`,
      ].join("\n"),
    );
  }

  const folder = buildCloudinaryFolder(productSlug);

  const timestamp = Math.floor(Date.now() / 1000);

  const publicId = buildPublicId(file.relativePath);

  const signature = signCloudinaryParams(
    {
      folder,
      timestamp,
      public_id: publicId,
    },
    apiSecret,
  );

  const fileBuffer = await fs.readFile(file.absolutePath);

  const blob = new Blob([fileBuffer]);

  const formData = new FormData();

  formData.append("file", blob, file.name);

  formData.append("api_key", apiKey);

  formData.append("timestamp", String(timestamp));

  formData.append("folder", folder);

  formData.append("public_id", publicId);

  formData.append("signature", signature);

  const endpoint =
    `https://api.cloudinary.com/v1_1/` + `${encodeURIComponent(cloudName)}/image/upload`;

  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });
  } catch (error) {
    throw new Error(
      `Cloudinary network error while uploading "${file.name}": ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  let result: CloudinaryUploadResponse | null = null;

  try {
    result = (await response.json()) as CloudinaryUploadResponse;
  } catch {
    throw new Error(`Cloudinary returned an invalid response for "${file.name}".`);
  }

  if (!response.ok || !result?.secure_url || !result?.public_id) {
    throw new Error(result?.error?.message || `Cloudinary upload failed for "${file.name}".`);
  }

  return {
    url: result.secure_url,
    publicId: result.public_id,
    alt: `${file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]+/g, " ")
      .trim()}`,
    sourceFile: file.relativePath,
  };
}

/**
 * Update one product with the uploaded images.
 *
 * We deliberately use the Product model directly so the operation
 * does not accidentally touch price, stock, status, published,
 * category, brand, collection, or any other product field.
 */
async function attachImagesToProduct(
  Product: typeof import("@/models/Product").Product,
  product: ProductRecord,
  uploadedImages: UploadedImage[],
) {
  const existingImages = Array.isArray(product.images) ? product.images : [];

  const existingPublicIds = new Set(
    existingImages
      .map((image) => image.publicId)
      .filter((value): value is string => typeof value === "string" && value.length > 0),
  );

  const existingUrls = new Set(
    existingImages
      .map((image) => image.url)
      .filter((value): value is string => typeof value === "string" && value.length > 0),
  );

  const newImages = uploadedImages
    .filter((image) => !existingPublicIds.has(image.publicId) && !existingUrls.has(image.url))
    .map((image) => ({
      url: image.url,
      publicId: image.publicId,
      alt: image.alt,
    }));

  const finalImages = [...existingImages, ...newImages];

  await Product.updateOne(
    {
      _id: product._id,
    },
    {
      $set: {
        images: finalImages,
      },
    },
  );

  return {
    existingCount: existingImages.length,
    addedCount: newImages.length,
    finalCount: finalImages.length,
  };
}

async function main() {
  console.log("");
  console.log("============================================================");
  console.log("BUZZIEWORLD — PRODUCT MEDIA IMPORT");
  console.log("============================================================");
  console.log("");

  console.log(`Source: ${MEDIA_ROOT}`);

  console.log(`Cloudinary root: ${CLOUDINARY_FOLDER_ROOT}`);

  console.log("");

  // ------------------------------------------------------------
  // Environment
  // ------------------------------------------------------------

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  const apiKey = process.env.CLOUDINARY_API_KEY;

  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      [
        "Cloudinary environment variables are missing.",
        "",
        "Required:",
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",
        "",
        "No images were uploaded.",
      ].join("\n"),
    );
  }

  // ------------------------------------------------------------
  // Verify source directory
  // ------------------------------------------------------------

  const mediaStats = await fs.stat(MEDIA_ROOT);

  if (!mediaStats.isDirectory()) {
    throw new Error(`Media path is not a directory: ${MEDIA_ROOT}`);
  }

  // ------------------------------------------------------------
  // Load application modules after environment loading
  // ------------------------------------------------------------

  const { connectToDatabase } = await import("@/lib/mongoose");

  const { Product } = await import("@/models/Product");

  await connectToDatabase();

  console.log("✓ MongoDB connected.");

  // ------------------------------------------------------------
  // Read catalog
  // ------------------------------------------------------------

  const products = await Product.find(
    {},
    {
      _id: 1,
      name: 1,
      slug: 1,
      images: 1,
    },
  )
    .lean()
    .exec();

  const productRecords: ProductRecord[] = products.map((product) => ({
    _id: String(product._id),
    name: product.name,
    slug: product.slug,
    images: Array.isArray(product.images)
      ? product.images.map((image) => ({
          url: image.url,
          publicId: image.publicId,
          alt: image.alt,
        }))
      : [],
  }));

  console.log(`✓ Products found: ${productRecords.length}`);

  if (productRecords.length !== 49) {
    throw new Error(`Expected 49 products, found ${productRecords.length}. Import stopped.`);
  }

  // ------------------------------------------------------------
  // Build safe mappings
  // ------------------------------------------------------------

  const mappings = await buildMappings(productRecords);

  console.log(`✓ Folder mappings confirmed: ${mappings.length}`);

  // ------------------------------------------------------------
  // Safety check: exactly the 29 scanned folders
  // ------------------------------------------------------------

  if (mappings.length !== 29) {
    throw new Error(`Expected 29 mapped folders, found ${mappings.length}. Import stopped.`);
  }

  // ------------------------------------------------------------
  // Preflight
  //
  // We check ALL files before uploading ANYTHING.
  // ------------------------------------------------------------

  console.log("");
  console.log("============================================================");
  console.log("PREFLIGHT CHECK");
  console.log("============================================================");

  const prepared = [];

  let totalImages = 0;

  let totalBytes = 0;

  for (const mapping of mappings) {
    const files = await getFolderFiles(mapping.folderName);

    if (files.length === 0) {
      throw new Error(`Folder contains no supported images: ${mapping.folderName}`);
    }

    /**
     * Existing UI limit.
     *
     * We stop here rather than silently throwing away images.
     */
    if (files.length > MAX_PRODUCT_IMAGES) {
      throw new Error(
        [
          `Product "${mapping.productName}" has ${files.length} images.`,
          `The current ProductMedia architecture allows ${MAX_PRODUCT_IMAGES} images.`,
          "",
          `Folder: ${mapping.folderName}`,
          "",
          "No images have been uploaded.",
          "",
          "Either reduce this folder to 10 images or explicitly change",
          "the product media limit before running the import.",
        ].join("\n"),
      );
    }

    for (const file of files) {
      if (file.sizeBytes <= 0) {
        throw new Error(`Empty file found: ${file.relativePath}`);
      }

      if (file.sizeBytes > MAX_FILE_SIZE) {
        throw new Error(
          [`File exceeds 10 MB: ${file.relativePath}`, `Size: ${formatBytes(file.sizeBytes)}`].join(
            "\n",
          ),
        );
      }
    }

    totalImages += files.length;

    totalBytes += files.reduce((sum, file) => sum + file.sizeBytes, 0);

    prepared.push({
      mapping,
      files,
    });

    console.log(`✓ ${mapping.folderName} → ${mapping.productName} (${files.length} images)`);
  }

  console.log("");
  console.log(`Total images ready: ${totalImages}`);

  console.log(`Total upload size: ${formatBytes(totalBytes)}`);

  console.log("");

  console.log("Preflight passed. Starting Cloudinary uploads...");

  // ------------------------------------------------------------
  // Import
  // ------------------------------------------------------------

  let uploadedCount = 0;

  let skippedCount = 0;

  let failedCount = 0;

  for (const item of prepared) {
    const { mapping, files } = item;

    const product = productRecords.find((candidate) => candidate.slug === mapping.productSlug);

    if (!product) {
      throw new Error(`Product disappeared during import: ${mapping.productSlug}`);
    }

    console.log("");
    console.log("============================================================");

    console.log(`${mapping.productName}`);

    console.log(`${files.length} image(s)`);

    console.log("============================================================");

    const uploadedForProduct: UploadedImage[] = [];

    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];

      const existingPublicId = product.images.find(
        (image) => image.publicId === buildPublicId(file.relativePath),
      );

      if (existingPublicId) {
        console.log(`  SKIP ${index + 1}/${files.length} — already attached: ${file.name}`);

        skippedCount += 1;

        continue;
      }

      try {
        console.log(`  UPLOAD ${index + 1}/${files.length} — ${file.name}`);

        const uploaded = await uploadToCloudinary(
          file,
          mapping.productSlug,
          cloudName,
          apiKey,
          apiSecret,
        );

        uploadedForProduct.push(uploaded);

        uploadedCount += 1;

        console.log(`  ✓ Uploaded → ${uploaded.publicId}`);
      } catch (error) {
        failedCount += 1;

        console.error(`  ✗ FAILED → ${file.name}`);

        console.error(error instanceof Error ? error.message : error);

        /**
         * Stop immediately.
         *
         * We don't continue uploading hundreds of files when
         * one operation has failed unexpectedly.
         */
        throw error;
      }
    }

    if (uploadedForProduct.length > 0) {
      const result = await attachImagesToProduct(Product, product, uploadedForProduct);

      /**
       * Keep the local product record synchronized so duplicate
       * protection works during this same process.
       */
      product.images = [
        ...product.images,
        ...uploadedForProduct.map((image) => ({
          url: image.url,
          publicId: image.publicId,
          alt: image.alt,
        })),
      ];

      console.log(`  ✓ MongoDB updated: +${result.addedCount} image(s)`);

      console.log(`  ✓ Total product images: ${result.finalCount}`);
    } else {
      console.log("  ✓ No new database update required.");
    }
  }

  // ------------------------------------------------------------
  // Final verification
  // ------------------------------------------------------------

  console.log("");
  console.log("============================================================");
  console.log("IMPORT COMPLETE");
  console.log("============================================================");

  console.log(`Uploaded:               ${uploadedCount}`);

  console.log(`Skipped existing:       ${skippedCount}`);

  console.log(`Failed:                 ${failedCount}`);

  console.log(`Source images scanned:  ${totalImages}`);

  // ------------------------------------------------------------
  // Database verification
  // ------------------------------------------------------------

  const productSlugs = mappings.map((mapping) => mapping.productSlug);

  const verifiedProducts = await Product.find(
    {
      slug: {
        $in: productSlugs,
      },
    },
    {
      name: 1,
      slug: 1,
      images: 1,
    },
  )
    .lean()
    .exec();

  let productsWithImages = 0;

  let totalDatabaseImages = 0;

  for (const product of verifiedProducts) {
    const count = Array.isArray(product.images) ? product.images.length : 0;

    if (count > 0) {
      productsWithImages += 1;
    }

    totalDatabaseImages += count;

    console.log(`✓ ${product.name}: ${count} image(s)`);
  }

  console.log("");
  console.log("DATABASE VERIFICATION");

  printLine();

  console.log(`Products with images:   ${productsWithImages}`);

  console.log(`Total database images:   ${totalDatabaseImages}`);

  console.log("");

  console.log("Other product fields were not modified.");

  console.log("Published/status/price/stock remain unchanged.");

  console.log("");
  console.log("============================================================");
}

main()
  .catch((error) => {
    console.error("");
    console.error("============================================================");
    console.error("PRODUCT MEDIA IMPORT FAILED");
    console.error("============================================================");
    console.error("");

    console.error(error instanceof Error ? error.message : error);

    console.error("");
    console.error("IMPORTANT: The importer stopped at the failed operation.");

    console.error("Already-uploaded assets were not automatically deleted.");

    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

