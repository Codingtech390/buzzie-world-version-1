import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

import mongoose from "mongoose";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

/**
 * BUZZIEWORLD LOCAL PRODUCT MEDIA MIGRATION
 *
 * Default: DRY RUN; no filesystem or database changes.
 *
 * Apply mode requires BOTH:
 *   --apply
 *   --replace-galleries
 *
 * This intentionally replaces product galleries with the mapped
 * local source galleries. It never deletes Cloudinary assets.
 */

const SOURCE_ROOT = path.resolve(
  process.env.MEDIA_IMPORT_SOURCE_ROOT ??
    "C:\\Users\\DELL\\Downloads\\products_2026-10-14_21_13",
);

const STORAGE_ROOT = path.resolve(
  process.env.MEDIA_LOCAL_ROOT?.trim() || "./media-storage",
);

const APPLY = process.argv.includes("--apply");
const REPLACE_GALLERIES = process.argv.includes("--replace-galleries");

const PRODUCT_MEDIA_ROOT = "buzzie-world/products";

const SUPPORTED_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
]);

const MAX_FILE_BYTES = 10 * 1024 * 1024;

/**
 * Explicit mappings from the reviewed dry-run report.
 *
 * Wordlogy products are intentionally excluded.
 * Unassigned root-level images are never imported by this script.
 */
const FOLDER_TO_SLUG: Record<string, string> = {
  "animal-homes-learning-game-kids": "animal-homes-learning-game-kids",
  "animal-world": "animal-world",
  "brain-binder-activity-book-kids": "brain-binder-activity-book-kids",
  "buzzie-brains-part-2-activity-mats": "buzzie-brains-part-2-activity-mats",
  "buzzie-brains-reusable-activity-mats": "buzzie-brains-reusable-activity-mats",
  "car-logo-blitz": "car-logo-blitz",
  "flag-it-world-flags-bingo": "flag-it-world-flags-bingo",
  "guess-the-city-india-card-game": "guess-the-city-india-card-game",
  "guess-who-i-am-ramayana-edition": "guess-who-i-am-ramayana-edition",
  "india-bingo-states-capitals-game": "india-bingo-states-capitals-game",
  "indialogy-indian-city-guessing-game": "indialogy-indian-city-guessing-game",
  "knowledge-train-level-1-game": "knowledge-train-level-1-game",
  "knowledge-train-level-2-combo": "knowledge-train-level-2-combo",
  "knowledge-train-level-2-part-2": "knowledge-train-level-2-part-2",
  "kt-3": "kt-3",
  "lets-travel-memory-book": "lets-travel-memory-book",
  "logo-blitz": "logo-blitz",
  "logology-logo-guessing-card-game": "logology-logo-guessing-card-game",
  "match-o-fun-learning-game": "match-o-fun-learning-game",
  "math-busy-book-kids": "math-busy-book-kids",
  "multiplication-table-flashcards-1-20":
    "multiplication-table-flashcards-1-20",
  "same-pinch-festive-edition": "same-pinch-festive-edition",
  "same-pinch-logo-edition": "same-pinch-logo-edition",
  "spell-master-phonics-cards": "spell-master-phonics-cards",
  "toddler-busy-binder-learning-book": "toddler-busy-binder-learning-book",
  "why-zone-of-giggles": "why-zone-of-giggles",
  "word-family-flashcards": "word-family-flashcards",
};

/**
 * Existing local public assets from the current project.
 *
 * The A+ fallback is copied into each product's local a-plus folder.
 * How-to-Play images are copied only for Spell Master because those
 * are the only known product-specific instructions in the current setup.
 */
const DEFAULT_A_PLUS_SOURCE = path.resolve(
  process.cwd(),
  "public/images/products/a-plus/image-spell-master.png",
);

const SPELL_MASTER_HOW_TO_PLAY_SOURCES = [
  {
    source: "public/images/how-to-play/spell-master/01-categories-1-2.png",
    output: "01-categories-1-2.png",
  },
  {
    source: "public/images/how-to-play/spell-master/02-categories-3-4.png",
    output: "02-categories-3-4.png",
  },
  {
    source: "public/images/how-to-play/spell-master/03-how-spell-master-works.png",
    output: "03-how-spell-master-works.png",
  },
  {
    source: "public/images/how-to-play/spell-master/04-spell-master-setup.png",
    output: "04-spell-master-setup.png",
  },
] as const;

type SourceImage = {
  sourcePath: string;
  sourceName: string;
  outputName: string;
  bytes: number;
  sha256: string;
};

type ProductPlan = {
  folderName: string;
  slug: string;
  productName: string;
  productId: string;
  images: SourceImage[];
};

function log(message = ""): void {
  console.log(message);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function safeFolderName(value: string): string {
  const normalized = value.trim().toLowerCase();

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) {
    throw new Error(`Unsafe product slug: ${value}`);
  }

  return normalized;
}

function mediaRelativePath(slug: string, section: string, file: string): string {
  return [
    PRODUCT_MEDIA_ROOT,
    safeFolderName(slug),
    section,
    file,
  ].join("/");
}

function localMediaUrl(relativePath: string): string {
  return (
    "/api/media/files/" +
    relativePath.split("/").map(encodeURIComponent).join("/")
  );
}

function safeOutputName(index: number, originalName: string): string {
  const extension = path.extname(originalName).toLowerCase();

  const stem = path
    .basename(originalName, path.extname(originalName))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);

  return `${String(index + 1).padStart(2, "0")}-${stem || "image"}${extension}`;
}

async function sha256File(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath);
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

async function listSourceImages(folderPath: string): Promise<SourceImage[]> {
  const entries = await fs.readdir(folderPath, { withFileTypes: true });

  const candidates = entries
    .filter((entry) => entry.isFile())
    .filter((entry) =>
      SUPPORTED_EXTENSIONS.has(path.extname(entry.name).toLowerCase()),
    )
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    );

  const images: SourceImage[] = [];

  for (let index = 0; index < candidates.length; index += 1) {
    const entry = candidates[index];
    const sourcePath = path.join(folderPath, entry.name);
    const stats = await fs.stat(sourcePath);

    assert(
      stats.size > 0,
      `Empty image file: ${sourcePath}`,
    );

    assert(
      stats.size <= MAX_FILE_BYTES,
      `Image exceeds 10 MB limit: ${sourcePath} (${stats.size} bytes)`,
    );

    images.push({
      sourcePath,
      sourceName: entry.name,
      outputName: safeOutputName(index, entry.name),
      bytes: stats.size,
      sha256: await sha256File(sourcePath),
    });
  }

  return images;
}

async function ensureDirectory(directory: string): Promise<void> {
  await fs.mkdir(directory, { recursive: true });
}

async function copyIfDifferent(
  sourcePath: string,
  destinationPath: string,
): Promise<void> {
  const sourceHash = await sha256File(sourcePath);

  try {
    const destinationHash = await sha256File(destinationPath);

    if (sourceHash === destinationHash) {
      return;
    }
  } catch {
    // Destination does not exist or cannot be read; copy below.
  }

  await ensureDirectory(path.dirname(destinationPath));
  await fs.copyFile(sourcePath, destinationPath);
}

async function readProductSource(
  Product: typeof import("@/models/Product").Product,
): Promise<ProductPlan[]> {
  const plans: ProductPlan[] = [];

  for (const [folderName, slug] of Object.entries(FOLDER_TO_SLUG)) {
    const folderPath = path.join(SOURCE_ROOT, folderName);

    let folderStats;

    try {
      folderStats = await fs.stat(folderPath);
    } catch {
      throw new Error(
        `Mapped source folder is missing: ${folderPath}`,
      );
    }

    assert(
      folderStats.isDirectory(),
      `Expected a directory: ${folderPath}`,
    );

    const product = await Product.findOne(
      { slug },
      { _id: 1, name: 1, slug: 1, images: 1, listingImage: 1 },
    )
      .lean()
      .exec();

    assert(
      product,
      `No database product found for slug "${slug}" (source folder "${folderName}").`,
    );

    const images = await listSourceImages(folderPath);

    assert(
      images.length > 0,
      `No supported gallery images found in ${folderPath}`,
    );

    assert(
      images.length <= 10,
      `Product "${product.name}" has ${images.length} source images. The admin gallery limit is 10; refusing to truncate.`,
    );

    plans.push({
      folderName,
      slug,
      productName: product.name,
      productId: String(product._id),
      images,
    });
  }

  return plans;
}

async function main(): Promise<void> {
  log("");
  log("============================================================");
  log("BUZZIEWORLD — LOCAL PRODUCT MEDIA MIGRATION");
  log("============================================================");
  log(`Mode: ${APPLY ? "APPLY" : "DRY RUN"}`);
  log(`Source: ${SOURCE_ROOT}`);
  log(`Storage: ${STORAGE_ROOT}`);
  log("");

  if (APPLY && !REPLACE_GALLERIES) {
    throw new Error(
      [
        "Apply mode requires explicit gallery replacement confirmation.",
        "",
        "Use both flags:",
        "npx tsx scripts/import-product-media-local.ts --apply --replace-galleries",
      ].join("\n"),
    );
  }

  const sourceStats = await fs.stat(SOURCE_ROOT);

  assert(
    sourceStats.isDirectory(),
    `Source path is not a directory: ${SOURCE_ROOT}`,
  );

  const aPlusExists = await fs
    .stat(DEFAULT_A_PLUS_SOURCE)
    .then((stats) => stats.isFile())
    .catch(() => false);

  assert(
    aPlusExists,
    `Default A+ image was not found: ${DEFAULT_A_PLUS_SOURCE}`,
  );

  for (const item of SPELL_MASTER_HOW_TO_PLAY_SOURCES) {
    const fullPath = path.resolve(process.cwd(), item.source);

    const exists = await fs
      .stat(fullPath)
      .then((stats) => stats.isFile())
      .catch(() => false);

    assert(
      exists,
      `Required Spell Master How-to-Play image is missing: ${fullPath}`,
    );
  }

  // Import application modules only after Next.js env loading.
  const { connectToDatabase } = await import("@/lib/mongoose");
  const { Product } = await import("@/models/Product");

  await connectToDatabase();
  log("MongoDB connected.");

  const plans = await readProductSource(Product);

  log(`Mapped product folders: ${plans.length}`);
  log(`Candidate gallery images: ${plans.reduce((sum, plan) => sum + plan.images.length, 0)}`);
  log("");

  for (const plan of plans) {
    log(`${plan.productName} (${plan.slug})`);
    log(`  Source folder: ${plan.folderName}`);
    log(`  Existing gallery will be replaced with: ${plan.images.length} local images`);

    for (const image of plan.images) {
      const destinationRelative = mediaRelativePath(
        plan.slug,
        "gallery",
        image.outputName,
      );

      log(`  ${image.sourceName} -> ${destinationRelative}`);
    }
  }

  const allProducts = await Product.find(
    {},
    { _id: 1, name: 1, slug: 1, images: 1, listingImage: 1 },
  )
    .lean()
    .exec();

  log("");
  log(`All products in database: ${allProducts.length}`);
  log("Wordlogy source folders: excluded from gallery replacement.");
  log("Unassigned root-level PNGs: excluded.");
  log("");

  if (!APPLY) {
    log("DRY RUN COMPLETE — no files or database records were changed.");
    log("Review the mappings above, then run with --apply --replace-galleries.");
    await mongoose.disconnect();
    return;
  }

  /**
   * Preflight all destination names and existing data before copying.
   */
  const backup = {
    createdAt: new Date().toISOString(),
    mode: "before-local-product-media-import",
    products: plans.map((plan) => {
      const product = allProducts.find(
        (item) => String(item._id) === plan.productId,
      );

      assert(product, `Backup failed: product ${plan.productId} was not found.`);

      return {
        _id: String(product._id),
        name: product.name,
        slug: product.slug,
        images: product.images ?? [],
        listingImage: product.listingImage ?? "",
      };
    }),
  };

  const backupDirectory = path.join(process.cwd(), "scripts", "backups");
  const backupFile = path.join(
    backupDirectory,
    `product-media-before-local-${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}.json`,
  );

  await ensureDirectory(backupDirectory);
  await fs.writeFile(backupFile, JSON.stringify(backup, null, 2), "utf8");

  log(`Product media backup saved: ${backupFile}`);

  /**
   * Copy gallery files and known supporting assets.
   * No source files or Cloudinary assets are deleted.
   */
  const allProductSlugs = allProducts
    .map((product) => product.slug)
    .filter((slug): slug is string => Boolean(slug));

  for (const slug of allProductSlugs) {
    const safeSlug = safeFolderName(slug);
    const base = path.join(STORAGE_ROOT, PRODUCT_MEDIA_ROOT, safeSlug);

    await ensureDirectory(path.join(base, "gallery"));
    await ensureDirectory(path.join(base, "a-plus"));
    await ensureDirectory(path.join(base, "how-to-play"));

    await copyIfDifferent(
      DEFAULT_A_PLUS_SOURCE,
      path.join(base, "a-plus", "01-default-a-plus.png"),
    );
  }

  for (const plan of plans) {
    const galleryDirectory = path.join(
      STORAGE_ROOT,
      PRODUCT_MEDIA_ROOT,
      safeFolderName(plan.slug),
      "gallery",
    );

    for (const image of plan.images) {
      await copyIfDifferent(
        image.sourcePath,
        path.join(galleryDirectory, image.outputName),
      );
    }
  }

  const spellMasterDirectory = path.join(
    STORAGE_ROOT,
    PRODUCT_MEDIA_ROOT,
    "spell-master-phonics-cards",
    "how-to-play",
  );

  for (const item of SPELL_MASTER_HOW_TO_PLAY_SOURCES) {
    await copyIfDifferent(
      path.resolve(process.cwd(), item.source),
      path.join(spellMasterDirectory, item.output),
    );
  }

  /**
   * Verify every copied gallery file before updating MongoDB.
   */
  for (const plan of plans) {
    const galleryDirectory = path.join(
      STORAGE_ROOT,
      PRODUCT_MEDIA_ROOT,
      safeFolderName(plan.slug),
      "gallery",
    );

    for (const image of plan.images) {
      const destination = path.join(galleryDirectory, image.outputName);

      const destinationHash = await sha256File(destination);

      assert(
        destinationHash === image.sha256,
        `Hash verification failed for ${plan.productName}/${image.outputName}`,
      );
    }
  }

  log("All candidate gallery files passed SHA-256 verification.");
  log("Updating product gallery URLs...");

  let updated = 0;

  for (const plan of plans) {
    const images = plan.images.map((image) => {
      const relativePath = mediaRelativePath(
        plan.slug,
        "gallery",
        image.outputName,
      );

      return {
        url: localMediaUrl(relativePath),
        publicId: relativePath,
        alt: `${plan.productName} - ${image.sourceName}`,
      };
    });

    const firstImage = images[0];

    assert(firstImage, `No listing image available for ${plan.productName}`);

    const result = await Product.updateOne(
      { _id: plan.productId, slug: plan.slug },
      {
        $set: {
          images,
          listingImage: firstImage.url,
        },
      },
      { runValidators: false },
    );

    assert(
      result.matchedCount === 1,
      `Database update failed to match ${plan.productName} (${plan.slug}).`,
    );

    updated += 1;
    log(`UPDATED: ${plan.productName} — ${images.length} local gallery images`);
  }

  /**
   * Re-read the database to verify the updated references.
   */
  const verification = await Product.find(
    {},
    { name: 1, slug: 1, images: 1, listingImage: 1 },
  )
    .lean()
    .exec();

  let remainingCloudinaryReferences = 0;
  let brokenLocalReferences = 0;

  for (const product of verification) {
    const references = [
      ...(Array.isArray(product.images) ? product.images.map((image) => image.url) : []),
      product.listingImage ?? "",
    ].filter(Boolean);

    for (const url of references) {
      if (/cloudinary\.com/i.test(url)) {
        remainingCloudinaryReferences += 1;
      }

      if (url.startsWith("/api/media/files/")) {
        const relative = url
          .replace(/^\/api\/media\/files\//, "")
          .split("/")
          .map((segment) => decodeURIComponent(segment))
          .join(path.sep);

        const fullPath = path.resolve(STORAGE_ROOT, relative);

        const exists = await fs
          .stat(fullPath)
          .then((stats) => stats.isFile())
          .catch(() => false);

        if (!exists) {
          brokenLocalReferences += 1;
          log(`MISSING LOCAL FILE: ${product.name} -> ${url}`);
        }
      }
    }
  }

  log("");
  log("============================================================");
  log("MIGRATION SUMMARY");
  log("============================================================");
  log(`Products updated: ${updated}`);
  log(`Remaining Cloudinary gallery/listing references: ${remainingCloudinaryReferences}`);
  log(`Broken local gallery/listing references: ${brokenLocalReferences}`);
  log(`Backup: ${backupFile}`);

  if (remainingCloudinaryReferences > 0) {
    log("");
    log("WARNING: Do not remove Cloudinary yet.");
    log("Some products still reference Cloudinary. Review and migrate them first.");
  }

  if (brokenLocalReferences > 0) {
    throw new Error(
      "Verification found broken local references. Do not remove Cloudinary.",
    );
  }

  log("");
  log("Local gallery file checks completed.");
  log("A+ and How-to-Play folders are organized; app integration must be tested separately.");

  await mongoose.disconnect();
}

main().catch(async (error: unknown) => {
  console.error("");
  console.error("LOCAL PRODUCT MEDIA MIGRATION FAILED");
  console.error(error instanceof Error ? error.stack ?? error.message : error);

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect().catch(() => undefined);
  }

  process.exitCode = 1;
});
