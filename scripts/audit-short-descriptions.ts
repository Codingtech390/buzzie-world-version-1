
import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";

async function main() {
  const envLocalPath = path.resolve(process.cwd(), ".env.local");
  const envPath = path.resolve(process.cwd(), ".env");

  // Load .env.local first if present, otherwise use .env.
  const envPathToLoad = fs.existsSync(envLocalPath)
    ? envLocalPath
    : envPath;

  if (!fs.existsSync(envPathToLoad)) {
    throw new Error(
      "No .env.local or .env file was found in the project root.",
    );
  }

  dotenv.config({ path: envPathToLoad });

  if (!process.env.MONGODB_URI) {
    throw new Error(
      `MONGODB_URI is missing. Check ${path.basename(envPathToLoad)}.`,
    );
  }

  // Import only after environment variables have been loaded.
  const { connectToDatabase } = await import("@/lib/mongoose");
  const { Product } = await import("@/models/Product");

  await connectToDatabase();

  const products = await Product.find({})
    .select("_id name slug sku shortDescription")
    .lean();

  let affected = 0;

  console.log("\nBUZZIEWORLD — SHORT DESCRIPTION AUDIT\n");

  for (const product of products) {
    const shortDescription = product.shortDescription ?? "";

    const containsAddToCart = /^\s*Add to Cart\s*$/im.test(
      shortDescription,
    );
    const containsWhyChoose = /^\s*Why Choose\b/im.test(
      shortDescription,
    );

    if (!containsAddToCart && !containsWhyChoose) {
      continue;
    }

    affected++;

    console.log({
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      id: String(product._id),
      shortDescriptionLength: shortDescription.length,
      containsAddToCart,
      containsWhyChoose,
      preview: shortDescription.slice(0, 250),
    });
  }

  console.log(`\nAffected products: ${affected}`);
  console.log(`Total products checked: ${products.length}`);
}

main().catch((error) => {
  console.error("Audit failed:", error);
  process.exitCode = 1;
});
