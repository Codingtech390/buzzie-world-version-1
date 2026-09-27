import fs from "node:fs/promises";
import path from "node:path";

import mongoose from "mongoose";
import { loadEnvConfig } from "@next/env";

/**
 * IMPORTANT:
 * Load the same environment configuration that Next.js uses
 * before importing any application module that depends on env vars.
 */
loadEnvConfig(process.cwd());

const MEDIA_ROOT = "C:\\Users\\DELL\\Downloads\\img";

const SUPPORTED_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".heic",
  ".hiec",
  ".gif",
  ".avif",
]);

type MediaFile = {
  name: string;
  path: string;
  relativePath: string;
  extension: string;
  sizeBytes: number;
};

type MediaFolder = {
  folderName: string;
  folderPath: string;
  files: MediaFile[];
};

type ProductRecord = {
  _id: string;
  name: string;
  slug: string;
};

type ProductCandidate = {
  productId: string;
  productName: string;
  productSlug: string;
  score: number;
};

type ProductMatch = {
  status: "matched" | "possible" | "unmatched";
  productId?: string;
  productName?: string;
  productSlug?: string;
  reason?: string;
  candidates?: ProductCandidate[];
};

type MatchResult = {
  folderName: string;
  imageCount: number;
  totalSizeBytes: number;
  extensions: Record<string, number>;
  productMatch: ProductMatch;
  files: MediaFile[];
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/\.(png|jpg|jpeg|webp|heic|hiec|gif|avif)$/i, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function calculateTokenScore(folderName: string, productName: string, productSlug: string): number {
  const folderTokens = new Set(tokenize(folderName));

  const productTokens = new Set([...tokenize(productName), ...tokenize(productSlug)]);

  if (folderTokens.size === 0 || productTokens.size === 0) {
    return 0;
  }

  let matches = 0;

  for (const token of folderTokens) {
    if (productTokens.has(token)) {
      matches += 1;
    }
  }

  return Math.round((matches / folderTokens.size) * 100);
}

async function getFolders(): Promise<MediaFolder[]> {
  const entries = await fs.readdir(MEDIA_ROOT, {
    withFileTypes: true,
  });

  const folders: MediaFolder[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const folderPath = path.join(MEDIA_ROOT, entry.name);

    const childEntries = await fs.readdir(folderPath, {
      withFileTypes: true,
    });

    const files: MediaFile[] = [];

    for (const child of childEntries) {
      if (!child.isFile()) {
        continue;
      }

      const extension = path.extname(child.name).toLowerCase();

      if (!SUPPORTED_EXTENSIONS.has(extension)) {
        continue;
      }

      const absolutePath = path.join(folderPath, child.name);
      const stats = await fs.stat(absolutePath);

      files.push({
        name: child.name,
        path: absolutePath,
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

    folders.push({
      folderName: entry.name,
      folderPath,
      files,
    });
  }

  folders.sort((a, b) =>
    a.folderName.localeCompare(b.folderName, undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );

  return folders;
}

function findMatch(folderName: string, products: ProductRecord[]): ProductMatch {
  const normalizedFolder = normalize(folderName);

  // ------------------------------------------------------------
  // 1. Exact normalized product-name match
  // ------------------------------------------------------------

  const exactNameMatch = products.find((product) => normalize(product.name) === normalizedFolder);

  if (exactNameMatch) {
    return {
      status: "matched",
      productId: exactNameMatch._id,
      productName: exactNameMatch.name,
      productSlug: exactNameMatch.slug,
      reason: "Exact normalized product-name match",
    };
  }

  // ------------------------------------------------------------
  // 2. Exact normalized product-slug match
  // ------------------------------------------------------------

  const exactSlugMatch = products.find((product) => normalize(product.slug) === normalizedFolder);

  if (exactSlugMatch) {
    return {
      status: "matched",
      productId: exactSlugMatch._id,
      productName: exactSlugMatch.name,
      productSlug: exactSlugMatch.slug,
      reason: "Exact normalized product-slug match",
    };
  }

  // ------------------------------------------------------------
  // 3. Possible candidates
  //
  // IMPORTANT:
  // Candidates are NEVER automatically assigned.
  // They are only displayed for manual review.
  // ------------------------------------------------------------

  const candidates = products
    .map((product) => ({
      productId: product._id,
      productName: product.name,
      productSlug: product.slug,
      score: Math.max(
        calculateTokenScore(folderName, product.name, product.slug),
        calculateTokenScore(folderName, product.slug, product.name),
      ),
    }))
    .filter((candidate) => candidate.score >= 50)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.productName.localeCompare(b.productName);
    })
    .slice(0, 5);

  if (candidates.length > 0) {
    return {
      status: "possible",
      reason: "Possible product matches found. Nothing was automatically assigned.",
      candidates,
    };
  }

  return {
    status: "unmatched",
    reason: "No reliable product-name or product-slug match was found.",
  };
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

function printSeparator() {
  console.log("------------------------------------------------------------");
}

async function main() {
  console.log("");
  console.log("============================================================");
  console.log("BUZZIEWORLD — PRODUCT MEDIA SCAN");
  console.log("============================================================");
  console.log("");

  console.log(`Media directory: ${MEDIA_ROOT}`);
  console.log("");

  // ------------------------------------------------------------
  // Verify local media directory
  // ------------------------------------------------------------

  try {
    const stats = await fs.stat(MEDIA_ROOT);

    if (!stats.isDirectory()) {
      throw new Error("The configured media path exists but is not a directory.");
    }
  } catch {
    throw new Error(
      [
        "Media directory could not be accessed.",
        "",
        `Expected directory: ${MEDIA_ROOT}`,
        "",
        "Make sure the folder exists on this computer.",
      ].join("\n"),
    );
  }

  console.log("✓ Local media directory found.");

  // ------------------------------------------------------------
  // IMPORTANT:
  // Import application modules only AFTER loadEnvConfig()
  // has executed at the top of this file.
  // ------------------------------------------------------------

  const { connectToDatabase } = await import("@/lib/mongoose");
  const { Product } = await import("@/models/Product");

  // ------------------------------------------------------------
  // Connect to MongoDB
  // ------------------------------------------------------------

  console.log("Connecting to MongoDB...");

  await connectToDatabase();

  console.log("✓ MongoDB connection established.");
  console.log("");

  // ------------------------------------------------------------
  // Read the existing 49-product catalog
  //
  // We only read _id, name and slug.
  // Nothing is modified.
  // ------------------------------------------------------------

  const products = await Product.find(
    {},
    {
      _id: 1,
      name: 1,
      slug: 1,
    },
  )
    .lean()
    .exec();

  const productRecords: ProductRecord[] = products.map((product) => ({
    _id: String(product._id),
    name: product.name,
    slug: product.slug,
  }));

  console.log(`Products found in database: ${productRecords.length}`);

  if (productRecords.length !== 49) {
    console.log("");
    console.log(`WARNING: Expected 49 products but found ${productRecords.length}.`);
    console.log("The scan will continue, but nothing will be modified.");
  }

  // ------------------------------------------------------------
  // Scan local folders
  // ------------------------------------------------------------

  console.log("");
  console.log("Scanning local product folders...");

  const folders = await getFolders();

  console.log(`Product folders found locally: ${folders.length}`);

  // ------------------------------------------------------------
  // Build mapping report
  // ------------------------------------------------------------

  const results: MatchResult[] = folders.map((folder) => {
    const extensions: Record<string, number> = {};

    let totalSizeBytes = 0;

    for (const file of folder.files) {
      extensions[file.extension] = (extensions[file.extension] ?? 0) + 1;

      totalSizeBytes += file.sizeBytes;
    }

    return {
      folderName: folder.folderName,
      imageCount: folder.files.length,
      totalSizeBytes,
      extensions,
      productMatch: findMatch(folder.folderName, productRecords),
      files: folder.files,
    };
  });

  // ------------------------------------------------------------
  // Summary
  // ------------------------------------------------------------

  const matched = results.filter((result) => result.productMatch.status === "matched");

  const possible = results.filter((result) => result.productMatch.status === "possible");

  const unmatched = results.filter((result) => result.productMatch.status === "unmatched");

  const emptyFolders = results.filter((result) => result.imageCount === 0);

  const totalImages = results.reduce((total, result) => total + result.imageCount, 0);

  const totalSizeBytes = results.reduce((total, result) => total + result.totalSizeBytes, 0);

  const extensionSummary: Record<string, number> = {};

  for (const result of results) {
    for (const [extension, count] of Object.entries(result.extensions)) {
      extensionSummary[extension] = (extensionSummary[extension] ?? 0) + count;
    }
  }

  // ------------------------------------------------------------
  // Print summary
  // ------------------------------------------------------------

  console.log("");
  console.log("============================================================");
  console.log("SCAN SUMMARY");
  console.log("============================================================");

  console.log(`Database products:       ${productRecords.length}`);

  console.log(`Local folders:           ${folders.length}`);

  console.log(`Total images:            ${totalImages}`);

  console.log(`Total image size:        ${formatBytes(totalSizeBytes)}`);

  console.log(`Automatically matched:   ${matched.length}`);

  console.log(`Needs review:            ${possible.length}`);

  console.log(`Unmatched:               ${unmatched.length}`);

  console.log(`Empty folders:           ${emptyFolders.length}`);

  console.log("");

  console.log("FILE TYPES");
  printSeparator();

  for (const [extension, count] of Object.entries(extensionSummary).sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    console.log(`${extension.padEnd(8)} ${count}`);
  }

  // ------------------------------------------------------------
  // Automatically matched
  // ------------------------------------------------------------

  console.log("");
  console.log("============================================================");
  console.log("AUTOMATICALLY MATCHED");
  console.log("============================================================");

  if (matched.length === 0) {
    console.log("None.");
  } else {
    for (const result of matched) {
      const match = result.productMatch;

      console.log("");
      console.log(`✓ ${result.folderName}`);
      console.log(`  → ${match.productName}`);
      console.log(`  → slug: ${match.productSlug}`);
      console.log(`  → images: ${result.imageCount}`);
      console.log(`  → size: ${formatBytes(result.totalSizeBytes)}`);
      console.log(`  → ${match.reason}`);
    }
  }

  // ------------------------------------------------------------
  // Possible matches
  // ------------------------------------------------------------

  console.log("");
  console.log("============================================================");
  console.log("POSSIBLE MATCHES — MANUAL REVIEW REQUIRED");
  console.log("============================================================");

  if (possible.length === 0) {
    console.log("None.");
  } else {
    for (const result of possible) {
      console.log("");
      console.log(`! ${result.folderName}`);
      console.log(`  Images: ${result.imageCount}`);
      console.log(`  Size: ${formatBytes(result.totalSizeBytes)}`);

      const candidates = result.productMatch.candidates ?? [];

      for (const candidate of candidates) {
        console.log(`  ${candidate.score}% → ${candidate.productName}`);

        console.log(`           slug: ${candidate.productSlug}`);
      }

      console.log("  Nothing has been assigned.");
    }
  }

  // ------------------------------------------------------------
  // Unmatched folders
  // ------------------------------------------------------------

  console.log("");
  console.log("============================================================");
  console.log("UNMATCHED FOLDERS");
  console.log("============================================================");

  if (unmatched.length === 0) {
    console.log("None.");
  } else {
    for (const result of unmatched) {
      console.log("");
      console.log(`? ${result.folderName}`);
      console.log(`  Images: ${result.imageCount}`);
      console.log(`  Size: ${formatBytes(result.totalSizeBytes)}`);
      console.log("  No database product was automatically assigned.");
    }
  }

  // ------------------------------------------------------------
  // Empty folders
  // ------------------------------------------------------------

  if (emptyFolders.length > 0) {
    console.log("");
    console.log("============================================================");
    console.log("EMPTY FOLDERS");
    console.log("============================================================");

    for (const result of emptyFolders) {
      console.log(`- ${result.folderName}`);
    }
  }

  // ------------------------------------------------------------
  // Generate JSON report
  // ------------------------------------------------------------

  const report = {
    generatedAt: new Date().toISOString(),

    mediaRoot: MEDIA_ROOT,

    databaseProductCount: productRecords.length,

    localFolderCount: folders.length,

    totalImages,

    totalSizeBytes,

    totalSizeFormatted: formatBytes(totalSizeBytes),

    extensionSummary,

    matchedFolderCount: matched.length,

    possibleFolderCount: possible.length,

    unmatchedFolderCount: unmatched.length,

    emptyFolderCount: emptyFolders.length,

    products: productRecords,

    folders: results,
  };

  const reportPath = path.join(process.cwd(), "product-media-scan.json");

  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");

  // ------------------------------------------------------------
  // Final status
  // ------------------------------------------------------------

  console.log("");
  console.log("============================================================");
  console.log("READ-ONLY SCAN COMPLETE");
  console.log("============================================================");

  console.log("");
  console.log("Report:");
  console.log(reportPath);

  console.log("");
  console.log("DATABASE CHANGES:       NONE");
  console.log("CLOUDINARY UPLOADS:     NONE");
  console.log("PRODUCT IMAGES CHANGED: NONE");
  console.log("LOCAL FILES CHANGED:    NONE");

  console.log("");
  console.log("The next step is to review the generated mapping.");

  console.log("");
  console.log("============================================================");
}

main()
  .catch((error) => {
    console.error("");
    console.error("============================================================");
    console.error("PRODUCT MEDIA SCAN FAILED");
    console.error("============================================================");
    console.error("");

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    console.error("");
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });
