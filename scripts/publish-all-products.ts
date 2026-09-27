import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

async function main() {
  /*
   * These imports intentionally happen after .env.local has been loaded.
   * lib/env.ts validates MONGODB_URI during module evaluation.
   */
  const { default: mongoose } = await import("mongoose");

  const { connectToDatabase } = await import("@/lib/mongoose");

  const { Product } = await import("@/models/Product");

  await connectToDatabase();

  /*
   * Capture the catalog state before making any changes.
   */
  const [totalCount, publishedBefore, explicitlyHiddenBefore, missingPublishedBefore] =
    await Promise.all([
      Product.countDocuments(),

      Product.countDocuments({
        published: true,
      }),

      Product.countDocuments({
        published: false,
      }),

      Product.countDocuments({
        published: {
          $exists: false,
        },
      }),
    ]);

  /*
   * Publish every existing product.
   *
   * IMPORTANT:
   * This changes ONLY the storefront visibility field.
   *
   * It does NOT:
   * - change status
   * - add prices
   * - add stock
   * - add images
   * - change categories
   * - change brands
   * - change collections
   * - change featured state
   * - change product names
   * - change SKUs
   */
  const result = await Product.updateMany(
    {},
    {
      $set: {
        published: true,
      },
    },
  );

  /*
   * Verify the final state directly from MongoDB.
   */
  const [
    publishedAfter,
    hiddenAfter,
    missingPublishedAfter,
    activeAfter,
    publishedActiveAfter,
    publishedDraftAfter,
    publishedArchivedAfter,
  ] = await Promise.all([
    Product.countDocuments({
      published: true,
    }),

    Product.countDocuments({
      published: false,
    }),

    Product.countDocuments({
      published: {
        $exists: false,
      },
    }),

    Product.countDocuments({
      status: "active",
    }),

    Product.countDocuments({
      published: true,
      status: "active",
    }),

    Product.countDocuments({
      published: true,
      status: "draft",
    }),

    Product.countDocuments({
      published: true,
      status: "archived",
    }),
  ]);

  console.log("");
  console.log("==========================================");
  console.log("BUZZIEWORLD — PUBLISH ALL PRODUCTS");
  console.log("==========================================");
  console.log("");
  console.log("BEFORE");
  console.log("------------------------------------------");
  console.log(`Total products:          ${totalCount}`);
  console.log(`Published:               ${publishedBefore}`);
  console.log(`Explicitly hidden:       ${explicitlyHiddenBefore}`);
  console.log(`Published field missing: ${missingPublishedBefore}`);
  console.log("");
  console.log("UPDATE");
  console.log("------------------------------------------");
  console.log(`Matched:                 ${result.matchedCount}`);
  console.log(`Modified:                ${result.modifiedCount}`);
  console.log("");
  console.log("AFTER");
  console.log("------------------------------------------");
  console.log(`Total products:          ${totalCount}`);
  console.log(`Published:               ${publishedAfter}`);
  console.log(`Hidden:                  ${hiddenAfter}`);
  console.log(`Published field missing: ${missingPublishedAfter}`);
  console.log("");
  console.log("LIFECYCLE BREAKDOWN");
  console.log("------------------------------------------");
  console.log(`Active:                  ${activeAfter}`);
  console.log(`Published + active:      ${publishedActiveAfter}`);
  console.log(`Published + draft:       ${publishedDraftAfter}`);
  console.log(`Published + archived:    ${publishedArchivedAfter}`);
  console.log("");
  console.log("==========================================");

  if (publishedAfter === totalCount && hiddenAfter === 0 && missingPublishedAfter === 0) {
    console.log("SUCCESS: All products are published.");
  } else {
    console.log("WARNING: Catalog visibility verification failed.");
  }

  console.log("==========================================");
  console.log("");

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("");
  console.error("Failed to publish products:");
  console.error(error);

  try {
    const { default: mongoose } = await import("mongoose");

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  } catch {
    // Ignore cleanup errors.
  }

  process.exitCode = 1;
});
