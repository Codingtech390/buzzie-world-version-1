import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

import mongoose from "mongoose";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const SOURCE_ROOT = "C:\\Users\\DELL\\Downloads\\products_2026-10-14_21_13";

const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const EXPECTED_FOLDER_COUNT = 29;

type SourceImage = {
  name: string;
  absolutePath: string;
  relativePath: string;
  extension: string;
  sizeBytes: number;
  sha256: string;
};

type ProductImage = {
  url: string;
  publicId?: string;
  alt?: string;
};

type ProductRecord = {
  _id: string;
  name: string;
  slug: string;
  images: ProductImage[];
  listingImage?: string;
};

type PlannedProduct = {
  folder: string;
  product: ProductRecord;
  files: SourceImage[];
  newImages: ProductImage[];
  newListingImage?: string;
};

function formatBytes(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function encodeLocalUrl(relativePath: string): string {
  return "/api/media/files/" + relativePath.split("/").map(encodeURIComponent).join("/");
}

function getStorageRoot(): string {
  const configured = process.env.MEDIA_LOCAL_ROOT?.trim();

  return configured ? path.resolve(configured) : path.resolve(process.cwd(), "media-storage");
}

function getSha256(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function validateImage(buffer: Buffer, extension: string): boolean {
  if (extension === ".jpg" || extension === ".jpeg") {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (extension === ".png") {
    return (
      buffer.length >= 8 &&
      buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    );
  }

  if (extension === ".webp") {
    return (
      buffer.length >= 12 &&
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP"
    );
  }

  if (extension === ".avif") {
    return (
      buffer.length >= 12 &&
      buffer.toString("ascii", 4, 8) === "ftyp" &&
      buffer.toString("ascii", 8, 64).match(/avif|avis/) !== null
    );
  }

  return false;
}

async function readSourceImages(folderPath: string): Promise<SourceImage[]> {
  const entries = await fs.readdir(folderPath, { withFileTypes: true });
  const files: SourceImage[] = [];

  for (const entry of entries) {
    if (!entry.isFile()) continue;

    const extension = path.extname(entry.name).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.has(extension)) continue;

    const absolutePath = path.join(folderPath, entry.name);
    const stat = await fs.stat(absolutePath);

    if (stat.size <= 0) {
      throw new Error(`Empty file: ${absolutePath}`);
    }

    if (stat.size > MAX_FILE_BYTES) {
      throw new Error(`File exceeds 10 MB: ${absolutePath} (${formatBytes(stat.size)})`);
    }

    const buffer = await fs.readFile(absolutePath);

    if (!validateImage(buffer, extension)) {
      throw new Error(`Image signature does not match its extension: ${absolutePath}`);
    }

    files.push({
      name: entry.name,
      absolutePath,
      relativePath: path.relative(SOURCE_ROOT, absolutePath),
      extension,
      sizeBytes: stat.size,
      sha256: getSha256(buffer),
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

function getAltText(fileName: string): string {
  return path
    .basename(fileName, path.extname(fileName))
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const apply = args.has("--apply");
  const replaceImages = args.has("--replace-images");

  if (args.has("--help")) {
    console.log(`
Product media migration

Dry run:
  npx tsx scripts/import-product-media.ts

Apply gallery replacement:
  npx tsx scripts/import-product-media.ts --apply --replace-images

The apply command replaces images only for products with a matching
source folder. It does not delete Cloudinary assets.
`);
    return;
  }

  if (apply && !replaceImages) {
    throw new Error(
      "To prevent accidental gallery duplication, --apply requires --replace-images.",
    );
  }

  const sourceStat = await fs.stat(SOURCE_ROOT);

  if (!sourceStat.isDirectory()) {
    throw new Error(`Source is not a directory: ${SOURCE_ROOT}`);
  }

  const storageRoot = getStorageRoot();

  const { connectToDatabase } = await import("@/lib/mongoose");
  const { Product } = await import("@/models/Product");

  await connectToDatabase();

  try {
    const dbProducts = await Product.find(
      {},
      { _id: 1, name: 1, slug: 1, images: 1, listingImage: 1 },
    )
      .lean()
      .exec();

    const products: ProductRecord[] = dbProducts.map((item) => ({
      _id: String(item._id),
      name: item.name,
      slug: item.slug,
      images: Array.isArray(item.images)
        ? item.images.map((image) => ({
            url: image.url,
            publicId: image.publicId,
            alt: image.alt,
          }))
        : [],
      listingImage: item.listingImage || "",
    }));

    const productBySlug = new Map(products.map((p) => [p.slug, p]));

    const entries = await fs.readdir(SOURCE_ROOT, { withFileTypes: true });
    const folders = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .filter((name) => name.toLowerCase() !== "wordlogy")
      .sort((a, b) => a.localeCompare(b));

    if (folders.length !== EXPECTED_FOLDER_COUNT) {
      throw new Error(
        `Expected ${EXPECTED_FOLDER_COUNT} source folders but found ${folders.length}. ` +
          "Review the download before importing.",
      );
    }

    const plans: PlannedProduct[] = [];
    const allErrors: string[] = [];
    let totalSourceBytes = 0;
    let totalUniqueImages = 0;

    // Preflight every folder before copying any file or updating MongoDB.
    for (const folder of folders) {
      const productSlug = slugify(folder);
      const product = productBySlug.get(productSlug);

      if (!product) {
        allErrors.push(
          `No exact product slug match for folder "${folder}" (expected slug "${productSlug}").`,
        );
        continue;
      }

      const folderPath = path.join(SOURCE_ROOT, folder);
      const sourceFiles = await readSourceImages(folderPath);

      if (sourceFiles.length === 0) {
        allErrors.push(`No supported images in folder "${folder}".`);
        continue;
      }

      // Identical content within the same product should not become
      // duplicate entries in that product's gallery.
      const seenHashes = new Set<string>();
      const files = sourceFiles.filter((file) => {
        if (seenHashes.has(file.sha256)) return false;
        seenHashes.add(file.sha256);
        return true;
      });

      const newImages: ProductImage[] = files.map((file) => {
        const extension = file.extension === ".jpeg" ? ".jpg" : file.extension;
        const relativePath =
          `buzzie-world/products/${product.slug}/` + `${file.sha256}${extension}`;

        return {
          url: encodeLocalUrl(relativePath),
          publicId: relativePath,
          alt: getAltText(file.name),
        };
      });

      let newListingImage: string | undefined;

      const oldListingImage = product.listingImage || "";
      const oldGalleryIndex = product.images.findIndex((image) => image.url === oldListingImage);

      if (oldGalleryIndex >= 0 && newImages.length > 0) {
        const mappedIndex = Math.min(oldGalleryIndex, newImages.length - 1);
        newListingImage = newImages[mappedIndex].url;
      }

      plans.push({
        folder,
        product,
        files,
        newImages,
        newListingImage,
      });

      totalSourceBytes += files.reduce((sum, file) => sum + file.sizeBytes, 0);
      totalUniqueImages += files.length;
    }

    if (allErrors.length > 0) {
      console.error("\nPREFLIGHT FAILED — nothing was copied or updated.");
      for (const error of allErrors) console.error(`- ${error}`);
      throw new Error("Resolve the folder mapping or file errors and rerun.");
    }

    const report = {
      generatedAt: new Date().toISOString(),
      mode: apply ? "APPLY" : "DRY_RUN",
      sourceRoot: SOURCE_ROOT,
      storageRoot,
      folderCount: plans.length,
      uniqueImages: totalUniqueImages,
      sourceBytes: totalSourceBytes,
      products: plans.map((plan) => ({
        folder: plan.folder,
        productId: plan.product._id,
        productName: plan.product.name,
        productSlug: plan.product.slug,
        existingImageCount: plan.product.images.length,
        replacementImageCount: plan.newImages.length,
        existingListingImage: plan.product.listingImage,
        replacementListingImage: plan.newListingImage,
        files: plan.files.map((file) => ({
          source: file.relativePath,
          bytes: file.sizeBytes,
          sha256: file.sha256,
        })),
      })),
      rootFiles: entries.filter((entry) => entry.isFile()).map((entry) => entry.name),
      note:
        "Root-level files are intentionally not assigned to products. " +
        "Cloudinary assets are not deleted.",
    };

    const reportPath = path.join(
      process.cwd(),
      `product-media-migration-${apply ? "apply" : "dry-run"}.json`,
    );

    await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8");

    console.log("\nBUZZIEWORLD LOCAL PRODUCT MEDIA MIGRATION");
    console.log("----------------------------------------");
    console.log(`Mode: ${apply ? "APPLY" : "DRY RUN"}`);
    console.log(`Products: ${plans.length}`);
    console.log(`Unique images: ${totalUniqueImages}`);
    console.log(`Data size: ${formatBytes(totalSourceBytes)}`);
    console.log(`Root-level files left untouched: ${report.rootFiles.length}`);
    console.log(`Report: ${reportPath}`);

    for (const plan of plans) {
      console.log(
        `- ${plan.folder} → ${plan.product.name}: ` +
          `${plan.product.images.length} existing → ${plan.newImages.length} local`,
      );
    }

    if (!apply) {
      console.log("\nDRY RUN COMPLETE.");
      console.log("No media files were copied.");
      console.log("MongoDB was not modified.");
      console.log("Review the report before applying.");
      return;
    }

    // Preserve the exact previous gallery values before any database writes.
    const backupPath = path.join(
      process.cwd(),
      `product-media-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`,
    );

    await fs.writeFile(
      backupPath,
      JSON.stringify(
        plans.map((plan) => ({
          productId: plan.product._id,
          name: plan.product.name,
          slug: plan.product.slug,
          images: plan.product.images,
          listingImage: plan.product.listingImage,
        })),
        null,
        2,
      ),
      "utf8",
    );

    console.log(`\nGallery backup written: ${backupPath}`);

    // Copy all media before writing any product changes.
    for (const plan of plans) {
      for (let index = 0; index < plan.files.length; index += 1) {
        const file = plan.files[index];
        const image = plan.newImages[index];
        const relativePath = image.publicId!;

        const destination = path.resolve(storageRoot, relativePath);
        const relativeToRoot = path.relative(storageRoot, destination);

        if (!relativeToRoot || relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
          throw new Error(`Unsafe destination path: ${relativePath}`);
        }

        await fs.mkdir(path.dirname(destination), { recursive: true });

        try {
          // "wx" prevents overwriting an existing file.
          await fs.writeFile(destination, await fs.readFile(file.absolutePath), {
            flag: "wx",
          });
        } catch (error) {
          if (error && typeof error === "object" && "code" in error && error.code === "EEXIST") {
            const existing = await fs.readFile(destination);
            const source = await fs.readFile(file.absolutePath);

            if (getSha256(existing) !== getSha256(source)) {
              throw new Error(`Destination exists with different content: ${destination}`);
            }
          } else {
            throw error;
          }
        }
      }
    }

    // Verify every destination before touching MongoDB.
    for (const plan of plans) {
      for (const image of plan.newImages) {
        const destination = path.resolve(storageRoot, image.publicId!);
        const buffer = await fs.readFile(destination);
        const extension = path.extname(destination).toLowerCase();

        if (!validateImage(buffer, extension)) {
          throw new Error(`Copied image failed verification: ${destination}`);
        }
      }
    }

    // Only gallery fields are updated. All other product fields are untouched.
    for (const plan of plans) {
      const setFields: Record<string, unknown> = {
        images: plan.newImages,
      };

      if (plan.newListingImage) {
        setFields.listingImage = plan.newListingImage;
      }

      const result = await Product.updateOne({ _id: plan.product._id }, { $set: setFields });

      if (result.matchedCount !== 1) {
        throw new Error(`Product disappeared during migration: ${plan.product.slug}`);
      }

      console.log(`UPDATED ${plan.product.slug}: ${plan.newImages.length} images`);
    }

    console.log("\nMIGRATION FINISHED.");
    console.log("Local files copied and gallery updates submitted.");
    console.log("Cloudinary assets were not deleted.");
    console.log("Verify storefront URLs before any Cloudinary cleanup.");
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error("\nPRODUCT MEDIA MIGRATION FAILED");
  console.error(error instanceof Error ? error.message : error);
  console.error(
    "No Cloudinary assets were deleted. If apply mode failed, inspect the report, backup, copied files, and MongoDB before retrying.",
  );
  process.exitCode = 1;
});
