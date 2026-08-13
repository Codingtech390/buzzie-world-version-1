import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

// --------------------------------------------------
// 1. LOAD ENVIRONMENT FIRST
// --------------------------------------------------
//
// IMPORTANT:
// Do not use static imports for modules that import
// "@/lib/env" before dotenv.config() has executed.
//
// --------------------------------------------------

const envPath = path.resolve(process.cwd(), ".env.local");

const result = dotenv.config({
  path: envPath,
});

if (result.error) {
  console.error("❌ Failed to load .env.local");
  console.error(`Expected file: ${envPath}`);
  console.error(result.error);
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing.");
  console.error(`Checked: ${envPath}`);
  process.exit(1);
}

console.log("✓ .env.local loaded");
console.log("✓ MONGODB_URI detected");

// --------------------------------------------------
// 2. START SEED
// --------------------------------------------------

async function seed() {
  // ------------------------------------------------
  // Dynamic imports AFTER environment is loaded
  // ------------------------------------------------

  const { connectToDatabase } = await import("@/lib/mongoose");
  const { createSlug } = await import("@/lib/slug");

  const { Product } = await import("@/models/Product");
  const { Category } = await import("@/models/Category");
  const { Brand } = await import("@/models/Brand");
  const { Collection } = await import("@/models/Collection");

  console.log("\n🌱 Starting BuzzieWorld database seed...\n");

  try {
    // --------------------------------------------------
    // 3. CONNECT DATABASE
    // --------------------------------------------------

    await connectToDatabase();

    console.log("✓ MongoDB connected");

    // --------------------------------------------------
    // 4. CLEAR EXISTING CATALOG DATA
    // --------------------------------------------------

    console.log("\n🧹 Clearing existing catalog data...");

    await Product.deleteMany({});
    await Collection.deleteMany({});
    await Brand.deleteMany({});
    await Category.deleteMany({});

    console.log("✓ Existing catalog cleared");

    // --------------------------------------------------
    // 5. CREATE CATEGORIES
    // --------------------------------------------------

    console.log("\n📂 Creating categories...");

    const categories = await Category.insertMany([
      {
        name: "Toys",
        slug: "toys",
        description: "Fun, engaging and imaginative toys designed for growing minds.",
        isActive: true,
        sortOrder: 1,
      },
      {
        name: "Books",
        slug: "books",
        description: "Storybooks, activity books and learning adventures for children.",
        isActive: true,
        sortOrder: 2,
      },
      {
        name: "STEM & Learning",
        slug: "stem-learning",
        description: "Hands-on learning products that make science, technology and creativity fun.",
        isActive: true,
        sortOrder: 3,
      },
      {
        name: "Baby & Toddler",
        slug: "baby-toddler",
        description: "Thoughtfully selected products for babies and growing toddlers.",
        isActive: true,
        sortOrder: 4,
      },
      {
        name: "Arts & Crafts",
        slug: "arts-crafts",
        description: "Creative products that encourage imagination and self-expression.",
        isActive: true,
        sortOrder: 5,
      },
    ]);

    console.log(`✓ Created ${categories.length} categories`);

    // --------------------------------------------------
    // 6. CREATE BRANDS
    // --------------------------------------------------

    console.log("\n🏷️ Creating brands...");

    const brands = await Brand.insertMany([
      {
        name: "Buzzie Originals",
        slug: "buzzie-originals",
        description: "Original products curated especially for the BuzzieWorld universe.",
        isActive: true,
      },
      {
        name: "Little Explorers",
        slug: "little-explorers",
        description: "Playful products designed to inspire curiosity and discovery.",
        isActive: true,
      },
      {
        name: "WonderKids",
        slug: "wonderkids",
        description: "Creative and educational products for curious young minds.",
        isActive: true,
      },
    ]);

    console.log(`✓ Created ${brands.length} brands`);

    // --------------------------------------------------
    // 7. CREATE COLLECTIONS
    // --------------------------------------------------

    console.log("\n✨ Creating collections...");

    const collections = await Collection.insertMany([
      {
        name: "Little Explorers",
        slug: "little-explorers",
        description: "A collection created for curious children ready to explore the world.",
        isActive: true,
        featured: true,
        sortOrder: 1,
      },
      {
        name: "Creative Kingdom",
        slug: "creative-kingdom",
        description: "Art, creativity and imagination brought together in one collection.",
        isActive: true,
        featured: true,
        sortOrder: 2,
      },
      {
        name: "Learning Adventures",
        slug: "learning-adventures",
        description: "Products that turn everyday learning into an exciting adventure.",
        isActive: true,
        featured: true,
        sortOrder: 3,
      },
    ]);

    console.log(`✓ Created ${collections.length} collections`);

    // --------------------------------------------------
    // 8. HELPER REFERENCES
    // --------------------------------------------------

    const toysCategory = categories.find((category) => category.slug === "toys");

    const booksCategory = categories.find((category) => category.slug === "books");

    const stemCategory = categories.find((category) => category.slug === "stem-learning");

    const artsCategory = categories.find((category) => category.slug === "arts-crafts");

    const babyCategory = categories.find((category) => category.slug === "baby-toddler");

    const buzzieBrand = brands.find((brand) => brand.slug === "buzzie-originals");

    const explorersBrand = brands.find((brand) => brand.slug === "little-explorers");

    const wonderKidsBrand = brands.find((brand) => brand.slug === "wonderkids");

    const explorersCollection = collections.find(
      (collection) => collection.slug === "little-explorers",
    );

    const creativeCollection = collections.find(
      (collection) => collection.slug === "creative-kingdom",
    );

    const learningCollection = collections.find(
      (collection) => collection.slug === "learning-adventures",
    );

    // --------------------------------------------------
    // 9. CREATE PRODUCTS
    // --------------------------------------------------

    console.log("\n🧸 Creating products...");

    const productData = [
      {
        name: "Wooden Safari Puzzle",
        description:
          "A beautifully illustrated wooden puzzle that introduces children to animals and encourages problem-solving skills.",
        shortDescription: "A playful wooden animal puzzle for curious little explorers.",
        price: 799,
        compareAtPrice: 999,
        sku: "BZ-SAFARI-001",
        images: [
          {
            url: "/images/products/wooden-safari-puzzle.jpg",
            alt: "Wooden Safari Puzzle",
          },
        ],
        category: toysCategory?._id,
        brand: explorersBrand?._id,
        collection: explorersCollection?._id,
        stock: 25,
        status: "active" as const,
        featured: true,
        ageRange: {
          min: 3,
          max: 6,
        },
      },

      {
        name: "Magnetic Building Blocks",
        description:
          "Colorful magnetic building blocks designed to encourage creativity, spatial thinking and imaginative play.",
        shortDescription: "Build, create and explore with colorful magnetic blocks.",
        price: 1299,
        compareAtPrice: 1599,
        sku: "BZ-BLOCKS-001",
        images: [
          {
            url: "/images/products/magnetic-building-blocks.jpg",
            alt: "Magnetic Building Blocks",
          },
        ],
        category: toysCategory?._id,
        brand: buzzieBrand?._id,
        collection: explorersCollection?._id,
        stock: 18,
        status: "active" as const,
        featured: true,
        ageRange: {
          min: 3,
          max: 9,
        },
      },

      {
        name: "My First Space Adventure",
        description:
          "An illustrated children's book introducing young readers to planets, stars and the wonders of outer space.",
        shortDescription: "A colorful first adventure through the universe.",
        price: 499,
        compareAtPrice: 599,
        sku: "BZ-SPACE-001",
        images: [
          {
            url: "/images/products/space-adventure.jpg",
            alt: "My First Space Adventure",
          },
        ],
        category: booksCategory?._id,
        brand: wonderKidsBrand?._id,
        collection: learningCollection?._id,
        stock: 40,
        status: "active" as const,
        featured: true,
        ageRange: {
          min: 4,
          max: 8,
        },
      },

      {
        name: "Junior Science Lab",
        description:
          "A hands-on science activity kit that introduces children to exciting experiments and scientific thinking.",
        shortDescription: "Hands-on experiments for young scientists.",
        price: 1499,
        compareAtPrice: 1799,
        sku: "BZ-SCIENCE-001",
        images: [
          {
            url: "/images/products/junior-science-lab.jpg",
            alt: "Junior Science Lab",
          },
        ],
        category: stemCategory?._id,
        brand: wonderKidsBrand?._id,
        collection: learningCollection?._id,
        stock: 12,
        status: "active" as const,
        featured: true,
        ageRange: {
          min: 6,
          max: 12,
        },
      },

      {
        name: "Rainbow Art Studio",
        description:
          "A creative art set with colorful materials designed to let children draw, paint and create their own masterpieces.",
        shortDescription: "Everything young artists need to start creating.",
        price: 999,
        compareAtPrice: 1199,
        sku: "BZ-ART-001",
        images: [
          {
            url: "/images/products/rainbow-art-studio.jpg",
            alt: "Rainbow Art Studio",
          },
        ],
        category: artsCategory?._id,
        brand: buzzieBrand?._id,
        collection: creativeCollection?._id,
        stock: 30,
        status: "active" as const,
        featured: true,
        ageRange: {
          min: 4,
          max: 10,
        },
      },

      {
        name: "Soft Cuddle Bunny",
        description:
          "A soft and comforting bunny designed to become a gentle companion for little ones.",
        shortDescription: "A soft cuddly companion for little dreamers.",
        price: 699,
        compareAtPrice: 799,
        sku: "BZ-BUNNY-001",
        images: [
          {
            url: "/images/products/soft-cuddle-bunny.jpg",
            alt: "Soft Cuddle Bunny",
          },
        ],
        category: babyCategory?._id,
        brand: explorersBrand?._id,
        collection: explorersCollection?._id,
        stock: 22,
        status: "active" as const,
        featured: false,
        ageRange: {
          min: 1,
          max: 3,
        },
      },
    ];

    const products = await Product.insertMany(
      productData.map((product) => ({
        ...product,
        slug: createSlug(product.name),
      })),
    );

    console.log(`✓ Created ${products.length} products`);

    // --------------------------------------------------
    // 10. SUMMARY
    // --------------------------------------------------

    console.log("\n========================================");
    console.log("🎉 BUZZIEWORLD SEED COMPLETE");
    console.log("========================================");
    console.log(`Categories:   ${categories.length}`);
    console.log(`Brands:       ${brands.length}`);
    console.log(`Collections:  ${collections.length}`);
    console.log(`Products:     ${products.length}`);
    console.log("========================================\n");
  } catch (error) {
    console.error("\n❌ Database seed failed:\n");
    console.error(error);

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();

    console.log("✓ MongoDB connection closed");
  }
}

// --------------------------------------------------
// 11. RUN SEED
// --------------------------------------------------

seed().catch((error) => {
  console.error("\n❌ Unexpected seed error:\n");
  console.error(error);

  process.exitCode = 1;
});
