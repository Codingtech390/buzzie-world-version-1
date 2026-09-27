import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

async function main() {
  /*
   * These imports intentionally happen AFTER dotenv has loaded
   * .env.local. Static imports at the top of the file are evaluated
   * before dotenv.config() executes.
   */
  const { default: mongoose } = await import("mongoose");

  const { connectToDatabase } = await import("@/lib/mongoose");

  const { Product } = await import("@/models/Product");

  await connectToDatabase();

  const [
    total,
    published,
    unpublished,
    active,
    publishedActive,
    publishedDraft,
    publishedArchived,
    missingPrice,
    missingStock,
    missingImages,
  ] = await Promise.all([
    Product.countDocuments(),

    Product.countDocuments({
      published: true,
    }),

    Product.countDocuments({
      published: false,
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

    Product.countDocuments({
      price: { $exists: false },
    }),

    Product.countDocuments({
      stock: { $exists: false },
    }),

    Product.countDocuments({
      $or: [
        {
          images: {
            $exists: false,
          },
        },
        {
          images: {
            $size: 0,
          },
        },
      ],
    }),
  ]);

  console.log("");
  console.log("==========================================");
  console.log("BUZZIEWORLD — CATALOG CHECK");
  console.log("==========================================");
  console.log(`Total products:          ${total}`);
  console.log(`Published:               ${published}`);
  console.log(`Hidden:                  ${unpublished}`);
  console.log(`Active:                  ${active}`);
  console.log(`Published + active:      ${publishedActive}`);
  console.log(`Published + draft:       ${publishedDraft}`);
  console.log(`Published + archived:    ${publishedArchived}`);
  console.log(`Missing price:           ${missingPrice}`);
  console.log(`Missing stock:           ${missingStock}`);
  console.log(`Missing images:          ${missingImages}`);
  console.log("==========================================");
  console.log("");

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error("");
  console.error("Catalog check failed:");
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
