
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";

const APPLY_MODE = process.argv.includes("--apply");

async function main() {
  const root = process.cwd();
  const envLocal = path.join(root, ".env.local");
  const envFile = path.join(root, ".env");

  const envPath = fs.existsSync(envLocal)
    ? envLocal
    : envFile;

  if (!fs.existsSync(envPath)) {
    throw new Error("Could not find .env.local or .env.");
  }

  dotenv.config({ path: envPath });

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from the loaded environment.");
  }

  // Import after environment variables have been loaded.
  const { connectToDatabase } = await import("@/lib/mongoose");
  const { Product } = await import("@/models/Product");

  await connectToDatabase();

  const products = await Product.find({})
    .select("_id name slug shortDescription")
    .lean();

const marker =
  /^\s*(?:Add(?:\s+Combo)?\s+to\s+Cart|Why Choose\b.*)\s*$/im;

  const changes: {
    id: string;
    name: string;
    slug: string;
    before: string;
    after: string;
  }[] = [];

  for (const product of products) {
    const before = product.shortDescription ?? "";
    const match = marker.exec(before);

    if (!match || match.index === undefined) continue;

    const after = before
      .slice(0, match.index)
      .trim();

    // Never save an empty description.
    if (!after) {
      console.warn(
        `SKIPPED: ${product.name} — marker occurs before any summary.`,
      );
      continue;
    }

    changes.push({
      id: String(product._id),
      name: product.name,
      slug: product.slug,
      before,
      after,
    });
  }

  console.log(
    `\nMODE: ${APPLY_MODE ? "APPLY" : "DRY RUN"}`,
  );
  console.log(`Products checked: ${products.length}`);
  console.log(`Products to repair: ${changes.length}\n`);

  for (const change of changes) {
    console.log(`\n${change.name} (${change.slug})`);
    console.log("BEFORE:", change.before);
    console.log("AFTER: ", change.after);
    console.log("-".repeat(70));
  }

  if (!APPLY_MODE) {
    console.log(
      "\nDRY RUN COMPLETE. No database changes were made.",
    );
    console.log(
      "Review the BEFORE/AFTER output before running with --apply.",
    );
    return;
  }

  if (changes.length === 0) {
    console.log("Nothing to repair.");
    return;
  }

  // Save a backup before writing to MongoDB.
  const backupDirectory = path.join(root, "backups");
  fs.mkdirSync(backupDirectory, { recursive: true });

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-");

  const backupPath = path.join(
    backupDirectory,
    `short-descriptions-${timestamp}.json`,
  );

  fs.writeFileSync(
    backupPath,
    JSON.stringify(
      changes.map(({ id, name, slug, before }) => ({
        id,
        name,
        slug,
        shortDescription: before,
      })),
      null,
      2,
    ),
    "utf8",
  );

  console.log(`Backup saved to: ${backupPath}`);

  let updated = 0;

  for (const change of changes) {
    const result = await Product.updateOne(
      { _id: change.id },
      { $set: { shortDescription: change.after } },
    );

    if (result.modifiedCount !== 1) {
      throw new Error(
        `Update verification failed for ${change.name} (${change.id}). ` +
        `Check the database and backup before continuing.`,
      );
    }

    updated++;
    console.log(`UPDATED: ${change.name}`);
  }

  console.log(
    `\nREPAIR COMPLETE: ${updated} product descriptions updated.`,
  );
  console.log("All other product fields were left untouched.");
}

main().catch((error) => {
  console.error("Repair failed:", error);
  process.exitCode = 1;
});
