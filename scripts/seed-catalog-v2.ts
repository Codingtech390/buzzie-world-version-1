/**
 * ============================================================================
 * BUZZIEWORLD — CATALOG MIGRATION V2
 * ============================================================================
 *
 * Purpose:
 *   Replace the old development catalog with the new BuzzieWorld catalog.
 *
 * IMPORTANT:
 *   This script is intentionally SAFE BY DEFAULT.
 *
 *   Running:
 *
 *       npx tsx scripts/seed-catalog-v2.ts
 *
 *   performs ONLY validation / dry-run checks.
 *
 *   Nothing is written to MongoDB.
 *
 *   To actually apply the migration:
 *
 *       npx tsx scripts/seed-catalog-v2.ts --apply
 *
 * ============================================================================
 *
 * WHAT THIS SCRIPT CHANGES
 * ----------------------------------------------------------------------------
 *
 *   Categories:
 *     Replaced with the new 9 BuzzieWorld categories.
 *
 *   Brands:
 *     Replaced with exactly ONE brand:
 *       BuzzieWorld
 *
 *   Collections:
 *     Replaced with 3 new collections.
 *
 *   Products:
 *     Replaced with 18 products.
 *
 * ============================================================================
 *
 * WHAT THIS SCRIPT DOES NOT TOUCH
 * ----------------------------------------------------------------------------
 *
 *   Users
 *   Orders
 *   Cart documents
 *   Payments
 *   Newsletter subscribers
 *   Site settings
 *   Homepage settings
 *   Reviews
 *   Wishlist
 *   Authentication data
 *
 * ============================================================================
 *
 * SAFETY MODEL
 * ----------------------------------------------------------------------------
 *
 * 1. Load environment.
 * 2. Validate local image assets.
 * 3. Connect to MongoDB.
 * 4. Inspect current database.
 * 5. Refuse to apply if orders exist.
 * 6. Refuse to apply if active carts contain products.
 * 7. Create a local catalog backup.
 * 8. Start MongoDB transaction.
 * 9. Remove ONLY old catalog records.
 * 10. Insert new categories.
 * 11. Insert single BuzzieWorld brand.
 * 12. Insert collections.
 * 13. Insert products.
 * 14. Verify everything inside transaction.
 * 15. Commit.
 * 16. Verify everything again after commit.
 *
 * ============================================================================
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "node:fs";
import path from "node:path";

/* ============================================================================
   1. COMMAND-LINE MODE
============================================================================ */

const APPLY_MODE = process.argv.includes("--apply");
const DRY_RUN_MODE = !APPLY_MODE;

/* ============================================================================
   2. CONSTANTS
============================================================================ */

const SCRIPT_NAME = "seed-catalog-v2";

const EXPECTED_CATEGORY_COUNT = 9;
const EXPECTED_BRAND_COUNT = 1;
const EXPECTED_COLLECTION_COUNT = 3;
const EXPECTED_PRODUCT_COUNT = 18;

/**
 * All product images that must exist locally before the migration is allowed
 * to proceed.
 *
 * These filenames were verified against the files uploaded for this catalog.
 */
const REQUIRED_IMAGE_PATHS = [
  "/images/products/brain-binder-1.png",
  "/images/products/car-logo-1.png",
  "/images/products/logo-lblitz-1.png",
  "/images/products/treasure-product-1.png",
  "/images/products/treasure-product-2.png",
  "/images/products/treasure-product-3.png",
  "/images/products/treasure-product-4.png",
  "/images/products/treasure-product-5.png",
] as const;

/* ============================================================================
   3. DATA TYPES
============================================================================ */

type CategoryDefinition = {
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
};

type CollectionDefinition = {
  name: string;
  slug: string;
  description: string;
  featured: boolean;
  sortOrder: number;
};

type ProductImageDefinition = {
  url: string;
  alt: string;
};

type ProductDefinition = {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice: number;
  sku: string;
  images: ProductImageDefinition[];
  categorySlug: string;
  collectionSlug: string;
  stock: number;
  status: "active";
  featured: boolean;
  ageRange: {
    min: number;
    max: number;
  };
};

/* ============================================================================
   4. CATALOG DEFINITIONS
============================================================================ */

/**
 * ============================================================================
 * CATEGORIES
 * ============================================================================
 *
 * These are the ONLY categories that should exist after migration.
 */

const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  {
    name: "Binder",
    slug: "binder",
    description:
      "Reusable binders and activity books designed to keep children learning, creating and exploring.",
    sortOrder: 1,
  },
  {
    name: "Mythology",
    slug: "mythology",
    description:
      "Story-led products that introduce children to fascinating myths, legends and cultural characters.",
    sortOrder: 2,
  },
  {
    name: "Mind Games",
    slug: "mind-games",
    description: "Puzzles, matching activities and brain-building games that make thinking fun.",
    sortOrder: 3,
  },
  {
    name: "On-the-Go Games",
    slug: "on-the-go-games",
    description:
      "Compact screen-free games and activities made for travel, outings and family time.",
    sortOrder: 4,
  },
  {
    name: "Phonics",
    slug: "phonics",
    description:
      "Playful early-language activities that help children explore letters, sounds and words.",
    sortOrder: 5,
  },
  {
    name: "Card Games",
    slug: "card-games",
    description:
      "Fast, fun card-based games designed for memory, observation, conversation and family play.",
    sortOrder: 6,
  },
  {
    name: "Geography",
    slug: "geography",
    description:
      "World discovery activities that introduce children to maps, places, landmarks and cultures.",
    sortOrder: 7,
  },
  {
    name: "Return Gifts",
    slug: "return-gifts",
    description:
      "Fun and useful activity products made for birthdays, celebrations and party gifting.",
    sortOrder: 8,
  },
  {
    name: "Customized Products",
    slug: "customized-products",
    description:
      "Personalizable BuzzieWorld products created for special occasions, names and unique gifting needs.",
    sortOrder: 9,
  },
];

/* ============================================================================
   SINGLE BRAND
============================================================================ */

const BRAND_DEFINITION = {
  name: "BuzzieWorld",
  slug: "buzzie-world",
  description:
    "BuzzieWorld creates playful, screen-free learning products that help children explore, think, create and have fun.",
  isActive: true,
};

/* ============================================================================
   COLLECTIONS
============================================================================ */

const COLLECTION_DEFINITIONS: CollectionDefinition[] = [
  {
    name: "Learning Adventures",
    slug: "learning-adventures",
    description: "Activity products designed to turn learning into playful discovery.",
    featured: true,
    sortOrder: 1,
  },
  {
    name: "Play Anywhere",
    slug: "play-anywhere",
    description:
      "Compact games and activities that children can enjoy at home, on trips or anywhere in between.",
    featured: true,
    sortOrder: 2,
  },
  {
    name: "Gifts & Favourites",
    slug: "gifts-and-favourites",
    description: "Popular BuzzieWorld picks for birthdays, celebrations and thoughtful gifting.",
    featured: true,
    sortOrder: 3,
  },
];

/* ============================================================================
   IMAGE LIBRARY
============================================================================ */

/**
 * Actual product images uploaded for the new catalog.
 *
 * Some demo products intentionally reuse these images because we currently
 * have only a small set of product photography.
 *
 * This is acceptable for the development/demo catalog.
 *
 * IMPORTANT:
 * These are real local paths. The script verifies that every file exists
 * BEFORE any database mutation happens.
 */

const IMAGE = {
  BRAIN_BINDER: {
    url: "/images/products/brain-binder-1.png",
    alt: "BuzzieWorld Brain Binder activity book",
  },

  CAR_LOGO: {
    url: "/images/products/car-logo-1.png",
    alt: "BuzzieWorld Car Logo Blitz card game",
  },

  LOGO_BLITZ: {
    url: "/images/products/logo-lblitz-1.png",
    alt: "BuzzieWorld Logo Blitz card game",
  },

  ANIMAL_HOMES_HERO: {
    url: "/images/products/treasure-product-1.png",
    alt: "BuzzieWorld Animal Homes activity product",
  },

  ANIMAL_HOMES_BINDER: {
    url: "/images/products/treasure-product-2.png",
    alt: "BuzzieWorld Animal Homes Pocket Binder",
  },

  ANIMAL_LINK: {
    url: "/images/products/treasure-product-3.png",
    alt: "BuzzieWorld Animal Link matching game",
  },

  ANIMAL_TRAIL: {
    url: "/images/products/treasure-product-4.png",
    alt: "BuzzieWorld Animal Trail matching game",
  },

  BUZZIE_BRAINS: {
    url: "/images/products/treasure-product-5.png",
    alt: "BuzzieWorld Brains wipe and clean activity mats",
  },
} as const;

/* ============================================================================
   PRODUCT DEFINITIONS
============================================================================ */

/**
 * NOTE:
 *
 * The first 8 entries use the real uploaded product assets.
 *
 * The remaining demo products reuse available imagery because unique
 * photography for those products has not yet been supplied.
 *
 * Their names/content are ORIGINAL BuzzieWorld demo catalog content.
 *
 * The additional product concepts are inspired by the kinds of educational,
 * reusable, travel-friendly and creative products currently present in the
 * children's activity market, including PepPlay's catalog.
 */

const PRODUCT_DEFINITIONS: ProductDefinition[] = [
  /* ------------------------------------------------------------------------
     1. REAL PRODUCT
  ------------------------------------------------------------------------ */

  {
    name: "Brain Binder Activity Book",
    slug: "brain-binder-activity-book",
    description:
      "A reusable wipe-and-clean activity binder designed for children to practise thinking, matching, patterns, directions and early problem-solving through hands-on activities.",
    shortDescription: "A reusable activity binder packed with playful brain-building challenges.",
    price: 899,
    compareAtPrice: 1099,
    sku: "BZ-BINDER-001",
    images: [IMAGE.BRAIN_BINDER],
    categorySlug: "binder",
    collectionSlug: "learning-adventures",
    stock: 30,
    status: "active",
    featured: true,
    ageRange: {
      min: 4,
      max: 7,
    },
  },

  /* ------------------------------------------------------------------------
     2. REAL PRODUCT
  ------------------------------------------------------------------------ */

  {
    name: "Car Logo Blitz",
    slug: "car-logo-blitz",
    description:
      "A family-friendly card game built around recognising popular car logos, encouraging observation, memory, quick thinking and friendly competition.",
    shortDescription: "A fast-paced car logo guessing game for curious kids and families.",
    price: 499,
    compareAtPrice: 599,
    sku: "BZ-CARD-CAR-001",
    images: [IMAGE.CAR_LOGO],
    categorySlug: "card-games",
    collectionSlug: "play-anywhere",
    stock: 45,
    status: "active",
    featured: true,
    ageRange: {
      min: 4,
      max: 8,
    },
  },

  /* ------------------------------------------------------------------------
     3. REAL PRODUCT
  ------------------------------------------------------------------------ */

  {
    name: "Logo Blitz",
    slug: "logo-blitz",
    description:
      "A colourful logo guessing card game that encourages children and families to recognise familiar brands while developing memory, observation and recall.",
    shortDescription: "A colourful logo guessing game for family fun and quick thinking.",
    price: 499,
    compareAtPrice: 599,
    sku: "BZ-CARD-LOGO-001",
    images: [IMAGE.LOGO_BLITZ],
    categorySlug: "card-games",
    collectionSlug: "play-anywhere",
    stock: 45,
    status: "active",
    featured: true,
    ageRange: {
      min: 4,
      max: 10,
    },
  },

  /* ------------------------------------------------------------------------
     4. REAL PRODUCT
  ------------------------------------------------------------------------ */

  {
    name: "Animal Homes Activity Kit",
    slug: "animal-homes-activity-kit",
    description:
      "An animal-themed learning activity kit introducing children to animal homes, babies, sounds and food through colourful hands-on activities.",
    shortDescription: "Explore animal homes, babies, sounds and food through playful activities.",
    price: 799,
    compareAtPrice: 999,
    sku: "BZ-BINDER-ANIMAL-001",
    images: [IMAGE.ANIMAL_HOMES_HERO, IMAGE.ANIMAL_HOMES_BINDER],
    categorySlug: "binder",
    collectionSlug: "learning-adventures",
    stock: 28,
    status: "active",
    featured: true,
    ageRange: {
      min: 3,
      max: 7,
    },
  },

  /* ------------------------------------------------------------------------
     5. REAL PRODUCT
  ------------------------------------------------------------------------ */

  {
    name: "Animal Link",
    slug: "animal-link",
    description:
      "A self-correcting animal matching game where children connect related animal pictures while exploring farm, sea and jungle themes.",
    shortDescription: "A self-correcting animal matching game for little explorers.",
    price: 399,
    compareAtPrice: 499,
    sku: "BZ-MIND-ANIMAL-LINK-001",
    images: [IMAGE.ANIMAL_LINK],
    categorySlug: "mind-games",
    collectionSlug: "learning-adventures",
    stock: 40,
    status: "active",
    featured: true,
    ageRange: {
      min: 4,
      max: 7,
    },
  },

  /* ------------------------------------------------------------------------
     6. REAL PRODUCT
  ------------------------------------------------------------------------ */

  {
    name: "Animal Trail",
    slug: "animal-trail",
    description:
      "A simple identify-and-match animal trail game that encourages visual recognition, matching and early reasoning through playful animal challenges.",
    shortDescription: "Identify, match and explore with a playful animal trail game.",
    price: 349,
    compareAtPrice: 449,
    sku: "BZ-MIND-ANIMAL-TRAIL-001",
    images: [IMAGE.ANIMAL_TRAIL],
    categorySlug: "mind-games",
    collectionSlug: "play-anywhere",
    stock: 42,
    status: "active",
    featured: false,
    ageRange: {
      min: 2,
      max: 6,
    },
  },

  /* ------------------------------------------------------------------------
     7. REAL PRODUCT
  ------------------------------------------------------------------------ */

  {
    name: "Buzzie Brains Activity Mats",
    slug: "buzzie-brains-activity-mats",
    description:
      "Reusable wipe-and-clean activity mats filled with playful exercises that encourage matching, patterns, visual thinking and problem-solving.",
    shortDescription: "Reusable wipe-and-clean brain activities for growing minds.",
    price: 699,
    compareAtPrice: 849,
    sku: "BZ-MIND-BRAINS-001",
    images: [IMAGE.BUZZIE_BRAINS],
    categorySlug: "mind-games",
    collectionSlug: "learning-adventures",
    stock: 32,
    status: "active",
    featured: true,
    ageRange: {
      min: 3,
      max: 6,
    },
  },

  /* ------------------------------------------------------------------------
     8. REAL PRODUCT FAMILY / ADDITIONAL DEMO ENTRY
  ------------------------------------------------------------------------ */

  {
    name: "Animal Homes Pocket Binder",
    slug: "animal-homes-pocket-binder",
    description:
      "A compact animal-themed pocket binder designed for children to explore habitats, animal babies, food and sounds through reusable learning activities.",
    shortDescription: "A pocket-sized animal learning binder for curious little explorers.",
    price: 749,
    compareAtPrice: 899,
    sku: "BZ-BINDER-ANIMAL-002",
    images: [IMAGE.ANIMAL_HOMES_BINDER],
    categorySlug: "binder",
    collectionSlug: "gifts-and-favourites",
    stock: 25,
    status: "active",
    featured: false,
    ageRange: {
      min: 3,
      max: 7,
    },
  },

  /* ------------------------------------------------------------------------
     9. DEMO — MYTHOLOGY
  ------------------------------------------------------------------------ */

  {
    name: "Little Legends Mythology Cards",
    slug: "little-legends-mythology-cards",
    description:
      "A story-led card set introducing children to memorable characters, creatures and stories from Indian mythology through simple facts and playful matching challenges.",
    shortDescription: "Discover fascinating legends and characters through colourful cards.",
    price: 549,
    compareAtPrice: 699,
    sku: "BZ-MYTH-001",
    images: [IMAGE.LOGO_BLITZ],
    categorySlug: "mythology",
    collectionSlug: "learning-adventures",
    stock: 35,
    status: "active",
    featured: true,
    ageRange: {
      min: 6,
      max: 12,
    },
  },

  /* ------------------------------------------------------------------------
     10. DEMO — MYTHOLOGY
  ------------------------------------------------------------------------ */

  {
    name: "Mythology Match Quest",
    slug: "mythology-match-quest",
    description:
      "A memory and matching game inspired by mythology themes, where children pair characters, symbols and story elements while strengthening recall and observation.",
    shortDescription: "Match characters and symbols while discovering legendary stories.",
    price: 449,
    compareAtPrice: 549,
    sku: "BZ-MYTH-002",
    images: [IMAGE.ANIMAL_LINK],
    categorySlug: "mythology",
    collectionSlug: "play-anywhere",
    stock: 38,
    status: "active",
    featured: false,
    ageRange: {
      min: 6,
      max: 10,
    },
  },

  /* ------------------------------------------------------------------------
     11. DEMO — ON THE GO
  ------------------------------------------------------------------------ */

  {
    name: "Travel Quest Mini Game",
    slug: "travel-quest-mini-game",
    description:
      "A compact screen-free travel game designed for car rides, family outings and waiting time, combining quick challenges, observation and memory.",
    shortDescription: "A compact screen-free game made for travel and family outings.",
    price: 399,
    compareAtPrice: 499,
    sku: "BZ-TRAVEL-001",
    images: [IMAGE.ANIMAL_TRAIL],
    categorySlug: "on-the-go-games",
    collectionSlug: "play-anywhere",
    stock: 50,
    status: "active",
    featured: true,
    ageRange: {
      min: 5,
      max: 10,
    },
  },

  /* ------------------------------------------------------------------------
     12. DEMO — PHONICS
  ------------------------------------------------------------------------ */

  {
    name: "Phonics Sound Safari",
    slug: "phonics-sound-safari",
    description:
      "A playful early-reading activity that helps children connect letters with their sounds through animals, objects and simple visual challenges.",
    shortDescription: "A playful first step into letters, sounds and early reading.",
    price: 449,
    compareAtPrice: 549,
    sku: "BZ-PHONICS-001",
    images: [IMAGE.ANIMAL_HOMES_HERO],
    categorySlug: "phonics",
    collectionSlug: "learning-adventures",
    stock: 36,
    status: "active",
    featured: true,
    ageRange: {
      min: 4,
      max: 7,
    },
  },

  /* ------------------------------------------------------------------------
     13. DEMO — PHONICS / CARD GAMES
  ------------------------------------------------------------------------ */

  {
    name: "Word Builder Phonics Cards",
    slug: "word-builder-phonics-cards",
    description:
      "A colourful card-based learning game that helps children recognise letter sounds, build simple words and practise early spelling through play.",
    shortDescription: "Build simple words while practising letter sounds and spelling.",
    price: 499,
    compareAtPrice: 599,
    sku: "BZ-PHONICS-002",
    images: [IMAGE.BUZZIE_BRAINS],
    categorySlug: "phonics",
    collectionSlug: "learning-adventures",
    stock: 40,
    status: "active",
    featured: false,
    ageRange: {
      min: 5,
      max: 8,
    },
  },

  /* ------------------------------------------------------------------------
     14. DEMO — GEOGRAPHY
  ------------------------------------------------------------------------ */

  {
    name: "World Explorer Geography Cards",
    slug: "world-explorer-geography-cards",
    description:
      "A visual geography card game introducing children to countries, landmarks, animals, foods and interesting places around the world.",
    shortDescription: "Travel the world through colourful geography cards.",
    price: 599,
    compareAtPrice: 749,
    sku: "BZ-GEO-001",
    images: [IMAGE.CAR_LOGO],
    categorySlug: "geography",
    collectionSlug: "learning-adventures",
    stock: 34,
    status: "active",
    featured: true,
    ageRange: {
      min: 6,
      max: 12,
    },
  },

  /* ------------------------------------------------------------------------
     15. DEMO — GEOGRAPHY / MIND GAME
  ------------------------------------------------------------------------ */

  {
    name: "Map Match Challenge",
    slug: "map-match-challenge",
    description:
      "A matching challenge that helps children connect places with simple map clues, landmarks and visual cues while building memory and spatial awareness.",
    shortDescription: "Match places, maps and landmarks in a playful geography challenge.",
    price: 549,
    compareAtPrice: 649,
    sku: "BZ-GEO-002",
    images: [IMAGE.LOGO_BLITZ],
    categorySlug: "geography",
    collectionSlug: "play-anywhere",
    stock: 30,
    status: "active",
    featured: false,
    ageRange: {
      min: 7,
      max: 12,
    },
  },

  /* ------------------------------------------------------------------------
     16. DEMO — RETURN GIFTS
  ------------------------------------------------------------------------ */

  {
    name: "Party Play Return Gift Pack",
    slug: "party-play-return-gift-pack",
    description:
      "A cheerful compact activity pack designed for birthdays and celebrations, giving children a screen-free activity they can enjoy after the party.",
    shortDescription: "A fun activity gift pack made for birthdays and celebrations.",
    price: 299,
    compareAtPrice: 399,
    sku: "BZ-RETURN-001",
    images: [IMAGE.ANIMAL_LINK],
    categorySlug: "return-gifts",
    collectionSlug: "gifts-and-favourites",
    stock: 75,
    status: "active",
    featured: true,
    ageRange: {
      min: 4,
      max: 9,
    },
  },

  /* ------------------------------------------------------------------------
     17. DEMO — CUSTOMIZED PRODUCTS
  ------------------------------------------------------------------------ */

  {
    name: "Create Your Own Buzzie Binder",
    slug: "create-your-own-buzzie-binder",
    description:
      "A customizable activity binder concept that can be personalised for a child's name, theme or special occasion.",
    shortDescription: "A personalised activity binder made especially for your little explorer.",
    price: 999,
    compareAtPrice: 1199,
    sku: "BZ-CUSTOM-001",
    images: [IMAGE.BRAIN_BINDER],
    categorySlug: "customized-products",
    collectionSlug: "gifts-and-favourites",
    stock: 20,
    status: "active",
    featured: true,
    ageRange: {
      min: 4,
      max: 10,
    },
  },

  /* ------------------------------------------------------------------------
     18. DEMO — RETURN GIFTS / ON THE GO
  ------------------------------------------------------------------------ */

  {
    name: "Creative Sticker Story Kit",
    slug: "creative-sticker-story-kit",
    description:
      "A compact creative activity that lets children build little stories with colourful stickers, characters and simple scene-based prompts.",
    shortDescription: "Create colourful stories with stickers, characters and imagination.",
    price: 349,
    compareAtPrice: 449,
    sku: "BZ-RETURN-002",
    images: [IMAGE.BUZZIE_BRAINS],
    categorySlug: "return-gifts",
    collectionSlug: "gifts-and-favourites",
    stock: 60,
    status: "active",
    featured: false,
    ageRange: {
      min: 4,
      max: 8,
    },
  },
];

/* ============================================================================
   5. LOGGING HELPERS
============================================================================ */

function printHeader(title: string): void {
  console.log("");
  console.log("=".repeat(78));
  console.log(title);
  console.log("=".repeat(78));
}

function printSection(title: string): void {
  console.log("");
  console.log("-".repeat(78));
  console.log(title);
  console.log("-".repeat(78));
}

function success(message: string): void {
  console.log(`✓ ${message}`);
}

function warning(message: string): void {
  console.log(`⚠ ${message}`);
}

function failure(message: string): void {
  console.error(`✗ ${message}`);
}

function info(message: string): void {
  console.log(`• ${message}`);
}

/* ============================================================================
   6. ERROR FORMATTER
============================================================================ */

function describeError(error: unknown): string {
  if (error instanceof Error) {
    const mongooseError = error as Error & {
      code?: number;
      keyPattern?: unknown;
      keyValue?: unknown;
    };

    const parts = [`name=${mongooseError.name}`, `message=${mongooseError.message}`];

    if (mongooseError.code !== undefined) {
      parts.push(`code=${mongooseError.code}`);
    }

    if (mongooseError.keyPattern !== undefined) {
      parts.push(`keyPattern=${JSON.stringify(mongooseError.keyPattern)}`);
    }

    if (mongooseError.keyValue !== undefined) {
      parts.push(`keyValue=${JSON.stringify(mongooseError.keyValue)}`);
    }

    return parts.join(" | ");
  }

  try {
    return JSON.stringify(error, null, 2);
  } catch {
    return String(error);
  }
}

/* ============================================================================
   7. ENVIRONMENT VALIDATION
============================================================================ */

function loadEnvironment(): void {
  printSection("STEP 1 — ENVIRONMENT VALIDATION");

  const envPath = path.resolve(process.cwd(), ".env.local");

  info(`Project root: ${process.cwd()}`);
  info(`Expected environment file: ${envPath}`);

  const result = dotenv.config({
    path: envPath,
  });

  if (result.error) {
    throw new Error(
      [
        "Could not load .env.local.",
        `Expected file: ${envPath}`,
        `Original error: ${describeError(result.error)}`,
      ].join("\n"),
    );
  }

  success(".env.local loaded successfully.");

  if (!process.env.MONGODB_URI) {
    throw new Error(
      [
        "MONGODB_URI is missing.",
        `Checked environment file: ${envPath}`,
        "",
        "Please verify that .env.local contains:",
        "MONGODB_URI=your_mongodb_connection_string",
      ].join("\n"),
    );
  }

  success("MONGODB_URI detected.");

  info(`Execution mode: ${APPLY_MODE ? "APPLY / WRITE" : "DRY RUN / READ ONLY"}`);
}

/* ============================================================================
   8. IMAGE VALIDATION
============================================================================ */

function validateLocalImages(): void {
  printSection("STEP 2 — LOCAL IMAGE VALIDATION");

  const missingImages: string[] = [];

  for (const imageUrl of REQUIRED_IMAGE_PATHS) {
    const relativePath = imageUrl.replace(/^\/+/, "");
    const absolutePath = path.resolve(process.cwd(), "public", relativePath);

    if (!fs.existsSync(absolutePath)) {
      missingImages.push(`${imageUrl} -> ${absolutePath}`);
      failure(`Missing image: ${imageUrl}`);
      continue;
    }

    const stat = fs.statSync(absolutePath);

    if (!stat.isFile()) {
      missingImages.push(`${imageUrl} -> path exists but is not a file`);
      failure(`Not a file: ${imageUrl}`);
      continue;
    }

    if (stat.size === 0) {
      missingImages.push(`${imageUrl} -> file is empty`);
      failure(`Empty image file: ${imageUrl}`);
      continue;
    }

    success(`${imageUrl} (${stat.size.toLocaleString()} bytes)`);
  }

  if (missingImages.length > 0) {
    throw new Error(
      [
        "IMAGE VALIDATION FAILED.",
        "",
        "The migration was stopped BEFORE any MongoDB mutation.",
        "",
        "Missing/invalid files:",
        ...missingImages.map((item) => `  - ${item}`),
        "",
        "Fix the image paths/files and run the script again.",
      ].join("\n"),
    );
  }

  success(`All ${REQUIRED_IMAGE_PATHS.length} required image files are valid.`);
}

/* ============================================================================
   9. STATIC CATALOG VALIDATION
============================================================================ */

function validateCatalogDefinitions(): void {
  printSection("STEP 3 — STATIC CATALOG VALIDATION");

  /* --------------------------------------------------------------------------
     Category count
  -------------------------------------------------------------------------- */

  if (CATEGORY_DEFINITIONS.length !== EXPECTED_CATEGORY_COUNT) {
    throw new Error(
      `Expected ${EXPECTED_CATEGORY_COUNT} categories but found ${CATEGORY_DEFINITIONS.length}.`,
    );
  }

  success(`Category count = ${CATEGORY_DEFINITIONS.length}`);

  /* --------------------------------------------------------------------------
     Category slug uniqueness
  -------------------------------------------------------------------------- */

  const categorySlugs = CATEGORY_DEFINITIONS.map((category) => category.slug);

  const duplicateCategorySlugs = categorySlugs.filter(
    (slug, index) => categorySlugs.indexOf(slug) !== index,
  );

  if (duplicateCategorySlugs.length > 0) {
    throw new Error(`Duplicate category slugs detected: ${duplicateCategorySlugs.join(", ")}`);
  }

  success("Category slugs are unique.");

  /* --------------------------------------------------------------------------
     Collection count
  -------------------------------------------------------------------------- */

  if (COLLECTION_DEFINITIONS.length !== EXPECTED_COLLECTION_COUNT) {
    throw new Error(
      `Expected ${EXPECTED_COLLECTION_COUNT} collections but found ${COLLECTION_DEFINITIONS.length}.`,
    );
  }

  success(`Collection count = ${COLLECTION_DEFINITIONS.length}`);

  /* --------------------------------------------------------------------------
     Collection slug uniqueness
  -------------------------------------------------------------------------- */

  const collectionSlugs = COLLECTION_DEFINITIONS.map((collection) => collection.slug);

  const duplicateCollectionSlugs = collectionSlugs.filter(
    (slug, index) => collectionSlugs.indexOf(slug) !== index,
  );

  if (duplicateCollectionSlugs.length > 0) {
    throw new Error(`Duplicate collection slugs detected: ${duplicateCollectionSlugs.join(", ")}`);
  }

  success("Collection slugs are unique.");

  /* --------------------------------------------------------------------------
     Product count
  -------------------------------------------------------------------------- */

  if (PRODUCT_DEFINITIONS.length !== EXPECTED_PRODUCT_COUNT) {
    throw new Error(
      `Expected ${EXPECTED_PRODUCT_COUNT} products but found ${PRODUCT_DEFINITIONS.length}.`,
    );
  }

  success(`Product count = ${PRODUCT_DEFINITIONS.length}`);

  /* --------------------------------------------------------------------------
     Product slug uniqueness
  -------------------------------------------------------------------------- */

  const productSlugs = PRODUCT_DEFINITIONS.map((product) => product.slug);

  const duplicateProductSlugs = productSlugs.filter(
    (slug, index) => productSlugs.indexOf(slug) !== index,
  );

  if (duplicateProductSlugs.length > 0) {
    throw new Error(`Duplicate product slugs detected: ${duplicateProductSlugs.join(", ")}`);
  }

  success("Product slugs are unique.");

  /* --------------------------------------------------------------------------
     Product SKU uniqueness
  -------------------------------------------------------------------------- */

  const productSkus = PRODUCT_DEFINITIONS.map((product) => product.sku);

  const duplicateProductSkus = productSkus.filter(
    (sku, index) => productSkus.indexOf(sku) !== index,
  );

  if (duplicateProductSkus.length > 0) {
    throw new Error(`Duplicate product SKUs detected: ${duplicateProductSkus.join(", ")}`);
  }

  success("Product SKUs are unique.");

  /* --------------------------------------------------------------------------
     Category references
  -------------------------------------------------------------------------- */

  const validCategorySlugs = new Set(CATEGORY_DEFINITIONS.map((category) => category.slug));

  const invalidProductCategories = PRODUCT_DEFINITIONS.filter(
    (product) => !validCategorySlugs.has(product.categorySlug),
  );

  if (invalidProductCategories.length > 0) {
    throw new Error(
      [
        "Some products reference categories that do not exist:",
        ...invalidProductCategories.map(
          (product) => `  - ${product.name} -> ${product.categorySlug}`,
        ),
      ].join("\n"),
    );
  }

  success("All product category references are valid.");

  /* --------------------------------------------------------------------------
     Collection references
  -------------------------------------------------------------------------- */

  const validCollectionSlugs = new Set(COLLECTION_DEFINITIONS.map((collection) => collection.slug));

  const invalidProductCollections = PRODUCT_DEFINITIONS.filter(
    (product) => !validCollectionSlugs.has(product.collectionSlug),
  );

  if (invalidProductCollections.length > 0) {
    throw new Error(
      [
        "Some products reference collections that do not exist:",
        ...invalidProductCollections.map(
          (product) => `  - ${product.name} -> ${product.collectionSlug}`,
        ),
      ].join("\n"),
    );
  }

  success("All product collection references are valid.");

  /* --------------------------------------------------------------------------
     Price validation
  -------------------------------------------------------------------------- */

  const invalidPrices = PRODUCT_DEFINITIONS.filter(
    (product) =>
      !Number.isFinite(product.price) ||
      product.price < 0 ||
      !Number.isFinite(product.compareAtPrice) ||
      product.compareAtPrice < product.price,
  );

  if (invalidPrices.length > 0) {
    throw new Error(
      [
        "Invalid product pricing detected:",
        ...invalidPrices.map(
          (product) =>
            `  - ${product.name}: price=${product.price}, compareAtPrice=${product.compareAtPrice}`,
        ),
      ].join("\n"),
    );
  }

  success("All product prices are valid.");

  /* --------------------------------------------------------------------------
     Stock validation
  -------------------------------------------------------------------------- */

  const invalidStock = PRODUCT_DEFINITIONS.filter(
    (product) => !Number.isInteger(product.stock) || product.stock < 0,
  );

  if (invalidStock.length > 0) {
    throw new Error(
      [
        "Invalid product stock detected:",
        ...invalidStock.map((product) => `  - ${product.name}: stock=${product.stock}`),
      ].join("\n"),
    );
  }

  success("All product stock values are valid.");

  /* --------------------------------------------------------------------------
     Age range validation
  -------------------------------------------------------------------------- */

  const invalidAgeRanges = PRODUCT_DEFINITIONS.filter(
    (product) =>
      !Number.isInteger(product.ageRange.min) ||
      !Number.isInteger(product.ageRange.max) ||
      product.ageRange.min < 0 ||
      product.ageRange.max < product.ageRange.min,
  );

  if (invalidAgeRanges.length > 0) {
    throw new Error(
      [
        "Invalid age ranges detected:",
        ...invalidAgeRanges.map(
          (product) => `  - ${product.name}: ${product.ageRange.min}-${product.ageRange.max}`,
        ),
      ].join("\n"),
    );
  }

  success("All age ranges are valid.");

  /* --------------------------------------------------------------------------
     Image validation inside product definitions
  -------------------------------------------------------------------------- */

  const referencedImages = new Set<string>();

  for (const product of PRODUCT_DEFINITIONS) {
    if (product.images.length === 0) {
      throw new Error(`Product "${product.name}" has no images.`);
    }

    for (const image of product.images) {
      referencedImages.add(image.url);
    }
  }

  const missingReferencedImages = [...referencedImages].filter(
    (imageUrl) => !REQUIRED_IMAGE_PATHS.includes(imageUrl as (typeof REQUIRED_IMAGE_PATHS)[number]),
  );

  if (missingReferencedImages.length > 0) {
    throw new Error(
      [
        "A product references an image that is not in the approved image library:",
        ...missingReferencedImages.map((image) => `  - ${image}`),
      ].join("\n"),
    );
  }

  success("All product images reference approved local assets.");

  /* --------------------------------------------------------------------------
     Print catalog overview
  -------------------------------------------------------------------------- */

  info("");
  info("NEW CATALOG OVERVIEW:");

  for (const category of CATEGORY_DEFINITIONS) {
    const productsInCategory = PRODUCT_DEFINITIONS.filter(
      (product) => product.categorySlug === category.slug,
    ).length;

    info(`Category "${category.name}" -> ${productsInCategory} product(s)`);
  }

  info("");
  info(`Brand: ${BRAND_DEFINITION.name}`);
  info(`Collections: ${COLLECTION_DEFINITIONS.length}`);
  info(`Products: ${PRODUCT_DEFINITIONS.length}`);

  success("Static catalog validation completed.");
}

/* ============================================================================
   10. DATABASE BACKUP
============================================================================ */

async function createCatalogBackup(
  Product: typeof import("@/models/Product").Product,
  Category: typeof import("@/models/Category").Category,
  Brand: typeof import("@/models/Brand").Brand,
  Collection: typeof import("@/models/Collection").Collection,
): Promise<string> {
  printSection("STEP 5 — EXISTING CATALOG BACKUP");

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  const backupDirectory = path.resolve(process.cwd(), "scripts", "backups");

  fs.mkdirSync(backupDirectory, {
    recursive: true,
  });

  const backupFile = path.join(backupDirectory, `catalog-backup-${timestamp}.json`);

  info("Reading existing catalog records...");

  const [products, categories, brands, collections] = await Promise.all([
    Product.find({}).lean(),
    Category.find({}).lean(),
    Brand.find({}).lean(),
    Collection.find({}).lean(),
  ]);

  const backup = {
    metadata: {
      script: SCRIPT_NAME,
      createdAt: new Date().toISOString(),
      purpose: "Pre-migration backup of BuzzieWorld catalog collections.",
      counts: {
        products: products.length,
        categories: categories.length,
        brands: brands.length,
        collections: collections.length,
      },
    },
    products,
    categories,
    brands,
    collections,
  };

  fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2), "utf8");

  success(`Backup created: ${backupFile}`);

  info(
    `Backup contains ${products.length} products, ${categories.length} categories, ${brands.length} brands and ${collections.length} collections.`,
  );

  return backupFile;
}

/* ============================================================================
   11. DATABASE SAFETY CHECK
============================================================================ */

async function runDatabaseSafetyChecks(
  Product: typeof import("@/models/Product").Product,
  Order: typeof import("@/models/Order").Order,
  Cart: typeof import("@/models/Cart").Cart,
): Promise<void> {
  printSection("STEP 4 — DATABASE SAFETY CHECK");

  const currentProductCount = await Product.countDocuments({});
  const currentCategoryCount = await mongoose.connection
    .collection("categories")
    .countDocuments({});
  const currentBrandCount = await mongoose.connection.collection("brands").countDocuments({});
  const currentCollectionCount = await mongoose.connection
    .collection("collections")
    .countDocuments({});

  const orderCount = await Order.countDocuments({});

  /**
   * Only carts containing actual items are dangerous.
   *
   * Empty carts do not matter because they do not reference products.
   */
  const activeCartCount = await Cart.countDocuments({
    "items.0": {
      $exists: true,
    },
  });

  info(`Current products: ${currentProductCount}`);
  info(`Current categories: ${currentCategoryCount}`);
  info(`Current brands: ${currentBrandCount}`);
  info(`Current collections: ${currentCollectionCount}`);
  info(`Orders: ${orderCount}`);
  info(`Carts containing items: ${activeCartCount}`);

  /**
   * Some older/future models may exist as collections even if the current
   * model file is empty.
   *
   * Check them without importing them.
   */
  const database = mongoose.connection.db;

  if (!database) {
    throw new Error("MongoDB database handle is unavailable after connection.");
  }

  const collectionNames = await database.listCollections().toArray();

  const collectionNameSet = new Set(collectionNames.map((collection) => collection.name));

  let wishlistCount = 0;
  let reviewCount = 0;

  if (collectionNameSet.has("wishlists")) {
    wishlistCount = await database.collection("wishlists").countDocuments({});
  }

  if (collectionNameSet.has("reviews")) {
    reviewCount = await database.collection("reviews").countDocuments({});
  }

  info(`Wishlist documents: ${wishlistCount}`);
  info(`Review documents: ${reviewCount}`);

  /**
   * Orders are intentionally treated as a hard stop.
   *
   * We do not want to delete products that historical orders may depend on.
   */
  if (orderCount > 0) {
    throw new Error(
      [
        "CATALOG MIGRATION STOPPED.",
        "",
        `The database currently contains ${orderCount} order(s).`,
        "",
        "This migration replaces the Product collection.",
        "Deleting existing products could break historical order references.",
        "",
        "NO DATABASE MUTATION HAS BEEN PERFORMED.",
        "",
        "If this database contains only temporary demo orders, remove those",
        "demo orders deliberately and rerun the migration.",
        "",
        "If these are real orders, do NOT delete them.",
        "We should instead perform a reference-preserving migration.",
      ].join("\n"),
    );
  }

  /**
   * Active carts are also a hard stop.
   *
   * We do not silently destroy someone's cart.
   */
  if (activeCartCount > 0) {
    throw new Error(
      [
        "CATALOG MIGRATION STOPPED.",
        "",
        `There are ${activeCartCount} cart(s) containing product items.`,
        "",
        "Replacing the product collection would leave those cart items",
        "pointing at deleted products.",
        "",
        "NO DATABASE MUTATION HAS BEEN PERFORMED.",
        "",
        "Clear the temporary demo carts first, or tell me that we should",
        "build a cart-preserving migration.",
      ].join("\n"),
    );
  }

  /**
   * Wishlist/review documents may also reference product IDs.
   *
   * Since those models are currently empty/optional in the project,
   * we treat existing records as a hard stop rather than guessing.
   */
  if (wishlistCount > 0) {
    throw new Error(
      [
        "CATALOG MIGRATION STOPPED.",
        "",
        `The database contains ${wishlistCount} wishlist document(s).`,
        "",
        "The migration intentionally refuses to delete products while",
        "wishlist data may reference them.",
        "",
        "NO DATABASE MUTATION HAS BEEN PERFORMED.",
      ].join("\n"),
    );
  }

  if (reviewCount > 0) {
    throw new Error(
      [
        "CATALOG MIGRATION STOPPED.",
        "",
        `The database contains ${reviewCount} review document(s).`,
        "",
        "Reviews may reference existing products.",
        "The migration therefore stops rather than risking broken references.",
        "",
        "NO DATABASE MUTATION HAS BEEN PERFORMED.",
      ].join("\n"),
    );
  }

  success("No orders found.");
  success("No non-empty carts found.");
  success("No wishlist documents found.");
  success("No review documents found.");

  success("Database safety checks passed.");
}

/* ============================================================================
   12. BUILD DATABASE REFERENCES
============================================================================ */

async function buildDatabaseReferences(
  Category: typeof import("@/models/Category").Category,
  Brand: typeof import("@/models/Brand").Brand,
  Collection: typeof import("@/models/Collection").Collection,
  session: mongoose.ClientSession,
) {
  printSection("STEP 6 — BUILDING NEW CATALOG REFERENCES");

  const categories = await Category.insertMany(
    CATEGORY_DEFINITIONS.map((category) => ({
      ...category,
      isActive: true,
      parent: null,
    })),
    {
      session,
    },
  );

  success(`Inserted ${categories.length} categories.`);

  const brand = await Brand.create(
    [
      {
        ...BRAND_DEFINITION,
      },
    ],
    {
      session,
    },
  );

  if (brand.length !== 1) {
    throw new Error(
      `Expected exactly one BuzzieWorld brand to be created, received ${brand.length}.`,
    );
  }

  success("Inserted exactly 1 BuzzieWorld brand.");

  const collections = await Collection.insertMany(
    COLLECTION_DEFINITIONS.map((collection) => ({
      ...collection,
      isActive: true,
    })),
    {
      session,
    },
  );

  success(`Inserted ${collections.length} collections.`);

  const categoryMap = new Map(categories.map((category) => [category.slug, category._id]));

  const collectionMap = new Map(collections.map((collection) => [collection.slug, collection._id]));

  const brandId = brand[0]._id;

  if (!brandId) {
    throw new Error("BuzzieWorld brand was created but its _id is missing.");
  }

  return {
    categories,
    collections,
    categoryMap,
    collectionMap,
    brandId,
  };
}

/* ============================================================================
   13. INSERT PRODUCTS
============================================================================ */

async function insertProducts(
  Product: typeof import("@/models/Product").Product,
  categoryMap: Map<string, mongoose.Types.ObjectId>,
  collectionMap: Map<string, mongoose.Types.ObjectId>,
  brandId: mongoose.Types.ObjectId,
  session: mongoose.ClientSession,
) {
  printSection("STEP 7 — INSERTING NEW PRODUCTS");

  const documents = PRODUCT_DEFINITIONS.map((product, index) => {
    const categoryId = categoryMap.get(product.categorySlug);
    const collectionId = collectionMap.get(product.collectionSlug);

    if (!categoryId) {
      throw new Error(
        `Product #${index + 1} "${product.name}" references missing category "${product.categorySlug}".`,
      );
    }

    if (!collectionId) {
      throw new Error(
        `Product #${index + 1} "${product.name}" references missing collection "${product.collectionSlug}".`,
      );
    }

    return {
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      sku: product.sku,
      images: product.images,
      category: categoryId,
      brand: brandId,
      collection: collectionId,
      variants: [],
      stock: product.stock,
      status: product.status,
      featured: product.featured,
      ageRange: product.ageRange,
    };
  });

  info(`Preparing ${documents.length} product documents...`);

  documents.forEach((product, index) => {
    console.log(`  ${String(index + 1).padStart(2, "0")}. ${product.name}`);
    console.log(`      SKU: ${product.sku}`);
    console.log(`      Slug: ${product.slug}`);
    console.log(`      Price: ₹${product.price}`);
    console.log(`      Stock: ${product.stock}`);
    console.log(`      Featured: ${product.featured}`);
    console.log(`      Age: ${product.ageRange.min}-${product.ageRange.max}`);
  });

  const products = await Product.insertMany(documents, {
    session,
  });

  if (products.length !== EXPECTED_PRODUCT_COUNT) {
    throw new Error(
      `Expected ${EXPECTED_PRODUCT_COUNT} products after insert but received ${products.length}.`,
    );
  }

  success(`Inserted ${products.length} products.`);

  return products;
}

/* ============================================================================
   14. TRANSACTION VERIFICATION
============================================================================ */

async function verifyInsideTransaction(
  Product: typeof import("@/models/Product").Product,
  Category: typeof import("@/models/Category").Category,
  Brand: typeof import("@/models/Brand").Brand,
  Collection: typeof import("@/models/Collection").Collection,
  session: mongoose.ClientSession,
): Promise<void> {
  printSection("STEP 8 — VERIFYING MIGRATION INSIDE TRANSACTION");

  const categoryCount = await Category.countDocuments({}, { session });

  const brandCount = await Brand.countDocuments({}, { session });

  const collectionCount = await Collection.countDocuments({}, { session });

  const productCount = await Product.countDocuments({}, { session });

  info(`Categories found: ${categoryCount}`);
  info(`Brands found: ${brandCount}`);
  info(`Collections found: ${collectionCount}`);
  info(`Products found: ${productCount}`);

  if (categoryCount !== EXPECTED_CATEGORY_COUNT) {
    throw new Error(
      `Transaction verification failed: expected ${EXPECTED_CATEGORY_COUNT} categories, found ${categoryCount}.`,
    );
  }

  if (brandCount !== EXPECTED_BRAND_COUNT) {
    throw new Error(
      `Transaction verification failed: expected ${EXPECTED_BRAND_COUNT} brand, found ${brandCount}.`,
    );
  }

  if (collectionCount !== EXPECTED_COLLECTION_COUNT) {
    throw new Error(
      `Transaction verification failed: expected ${EXPECTED_COLLECTION_COUNT} collections, found ${collectionCount}.`,
    );
  }

  if (productCount !== EXPECTED_PRODUCT_COUNT) {
    throw new Error(
      `Transaction verification failed: expected ${EXPECTED_PRODUCT_COUNT} products, found ${productCount}.`,
    );
  }

  success("Catalog counts are correct.");

  /* --------------------------------------------------------------------------
     Verify exact categories
  -------------------------------------------------------------------------- */

  const categories = await Category.find({}).sort({ sortOrder: 1 }).session(session).lean();

  const categorySlugsFromDatabase = categories.map((category) => category.slug);

  const expectedCategorySlugs = CATEGORY_DEFINITIONS.map((category) => category.slug);

  const missingCategorySlugs = expectedCategorySlugs.filter(
    (slug) => !categorySlugsFromDatabase.includes(slug),
  );

  const unexpectedCategorySlugs = categorySlugsFromDatabase.filter(
    (slug) => !expectedCategorySlugs.includes(slug),
  );

  if (missingCategorySlugs.length > 0) {
    throw new Error(`Missing categories: ${missingCategorySlugs.join(", ")}`);
  }

  if (unexpectedCategorySlugs.length > 0) {
    throw new Error(`Unexpected categories: ${unexpectedCategorySlugs.join(", ")}`);
  }

  success("Category names/slugs verified.");

  /* --------------------------------------------------------------------------
     Verify brand
  -------------------------------------------------------------------------- */

  const brands = await Brand.find({}).session(session).lean();

  if (brands.length !== 1) {
    throw new Error(`Expected exactly one brand, found ${brands.length}.`);
  }

  if (brands[0].name !== BRAND_DEFINITION.name) {
    throw new Error(`Expected brand "${BRAND_DEFINITION.name}", found "${brands[0].name}".`);
  }

  if (brands[0].slug !== BRAND_DEFINITION.slug) {
    throw new Error(`Expected brand slug "${BRAND_DEFINITION.slug}", found "${brands[0].slug}".`);
  }

  success("Single BuzzieWorld brand verified.");

  /* --------------------------------------------------------------------------
     Verify collections
  -------------------------------------------------------------------------- */

  const collections = await Collection.find({}).sort({ sortOrder: 1 }).session(session).lean();

  const databaseCollectionSlugs = collections.map((collection) => collection.slug);

  const expectedCollectionSlugs = COLLECTION_DEFINITIONS.map((collection) => collection.slug);

  const missingCollectionSlugs = expectedCollectionSlugs.filter(
    (slug) => !databaseCollectionSlugs.includes(slug),
  );

  const unexpectedCollectionSlugs = databaseCollectionSlugs.filter(
    (slug) => !expectedCollectionSlugs.includes(slug),
  );

  if (missingCollectionSlugs.length > 0) {
    throw new Error(`Missing collections: ${missingCollectionSlugs.join(", ")}`);
  }

  if (unexpectedCollectionSlugs.length > 0) {
    throw new Error(`Unexpected collections: ${unexpectedCollectionSlugs.join(", ")}`);
  }

  success("Collections verified.");

  /* --------------------------------------------------------------------------
     Verify products
  -------------------------------------------------------------------------- */

  const products = await Product.find({})
    .populate("category", "name slug")
    .populate("brand", "name slug")
    .populate("collection", "name slug")
    .session(session)
    .lean();

  const databaseProductSkus = products.map((product) => product.sku);

  const expectedProductSkus = PRODUCT_DEFINITIONS.map((product) => product.sku);

  const missingProductSkus = expectedProductSkus.filter(
    (sku) => !databaseProductSkus.includes(sku),
  );

  const unexpectedProductSkus = databaseProductSkus.filter(
    (sku) => sku !== undefined && !expectedProductSkus.includes(sku),
  );

  if (missingProductSkus.length > 0) {
    throw new Error(
      ["Missing product SKUs:", ...missingProductSkus.map((sku) => `  - ${sku}`)].join("\n"),
    );
  }

  if (unexpectedProductSkus.length > 0) {
    throw new Error(
      ["Unexpected product SKUs:", ...unexpectedProductSkus.map((sku) => `  - ${sku}`)].join("\n"),
    );
  }

  success("All expected product SKUs are present.");

  /* --------------------------------------------------------------------------
     Verify every product
  -------------------------------------------------------------------------- */

  for (const expectedProduct of PRODUCT_DEFINITIONS) {
    const actualProduct = products.find((product) => product.sku === expectedProduct.sku);

    if (!actualProduct) {
      throw new Error(`Could not find inserted product with SKU "${expectedProduct.sku}".`);
    }

    if (actualProduct.slug !== expectedProduct.slug) {
      throw new Error(
        `Slug mismatch for SKU "${expectedProduct.sku}": expected "${expectedProduct.slug}", found "${actualProduct.slug}".`,
      );
    }

    if (actualProduct.price !== expectedProduct.price) {
      throw new Error(`Price mismatch for "${expectedProduct.name}".`);
    }

    if (actualProduct.stock !== expectedProduct.stock) {
      throw new Error(`Stock mismatch for "${expectedProduct.name}".`);
    }

    if (actualProduct.status !== "active") {
      throw new Error(`Product "${expectedProduct.name}" is not active.`);
    }

    if (!actualProduct.category) {
      throw new Error(`Product "${expectedProduct.name}" has no category reference.`);
    }

    if (!actualProduct.brand) {
      throw new Error(`Product "${expectedProduct.name}" has no brand reference.`);
    }

    if (!actualProduct.collection) {
      throw new Error(`Product "${expectedProduct.name}" has no collection reference.`);
    }

    if (!actualProduct.images || actualProduct.images.length === 0) {
      throw new Error(`Product "${expectedProduct.name}" has no images.`);
    }
  }

  success("Every product document passed field-level verification.");

  /* --------------------------------------------------------------------------
     Verify category coverage
  -------------------------------------------------------------------------- */

  const productsByCategory = new Map<string, number>();

  for (const product of products) {
    const populatedCategory = product.category as
      | {
          slug?: string;
        }
      | null
      | undefined;

    const categorySlug = populatedCategory?.slug;

    if (!categorySlug) {
      throw new Error(`Product "${product.name}" has an invalid populated category.`);
    }

    productsByCategory.set(categorySlug, (productsByCategory.get(categorySlug) ?? 0) + 1);
  }

  for (const category of CATEGORY_DEFINITIONS) {
    const count = productsByCategory.get(category.slug) ?? 0;

    if (count === 0) {
      throw new Error(`Category "${category.name}" has zero products.`);
    }

    success(`Category "${category.name}" has ${count} product(s).`);
  }

  /* --------------------------------------------------------------------------
     Verify all products use BuzzieWorld brand
  -------------------------------------------------------------------------- */

  const productsWithWrongBrand = products.filter((product) => {
    const populatedBrand = product.brand as
      | {
          slug?: string;
        }
      | null
      | undefined;

    return populatedBrand?.slug !== BRAND_DEFINITION.slug;
  });

  if (productsWithWrongBrand.length > 0) {
    throw new Error(
      [
        "Some products do not reference the BuzzieWorld brand:",
        ...productsWithWrongBrand.map((product) => `  - ${product.name} (${product.sku})`),
      ].join("\n"),
    );
  }

  success("All products reference BuzzieWorld.");

  /* --------------------------------------------------------------------------
     Verify image paths
  -------------------------------------------------------------------------- */

  const invalidImageProducts: string[] = [];

  for (const product of products) {
    for (const image of product.images ?? []) {
      const relativePath = image.url.replace(/^\/+/, "");
      const absolutePath = path.resolve(process.cwd(), "public", relativePath);

      if (!fs.existsSync(absolutePath)) {
        invalidImageProducts.push(`${product.name} -> ${image.url}`);
      }
    }
  }

  if (invalidImageProducts.length > 0) {
    throw new Error(
      [
        "Database contains image paths that do not exist locally:",
        ...invalidImageProducts.map((item) => `  - ${item}`),
      ].join("\n"),
    );
  }

  success("All database image paths resolve to local files.");

  /* --------------------------------------------------------------------------
     Final transaction verification
  -------------------------------------------------------------------------- */

  console.log("");
  console.log("✓ ALL TRANSACTION VERIFICATION CHECKS PASSED.");
  console.log("✓ It is safe to commit the transaction.");
}

/* ============================================================================
   15. POST-COMMIT VERIFICATION
============================================================================ */

async function verifyAfterCommit(
  Product: typeof import("@/models/Product").Product,
  Category: typeof import("@/models/Category").Category,
  Brand: typeof import("@/models/Brand").Brand,
  Collection: typeof import("@/models/Collection").Collection,
): Promise<void> {
  printSection("STEP 10 — POST-COMMIT DATABASE VERIFICATION");

  const categoryCount = await Category.countDocuments({});
  const brandCount = await Brand.countDocuments({});
  const collectionCount = await Collection.countDocuments({});
  const productCount = await Product.countDocuments({});

  info(`Categories: ${categoryCount}`);
  info(`Brands: ${brandCount}`);
  info(`Collections: ${collectionCount}`);
  info(`Products: ${productCount}`);

  if (categoryCount !== EXPECTED_CATEGORY_COUNT) {
    throw new Error(
      `POST-COMMIT FAILURE: expected ${EXPECTED_CATEGORY_COUNT} categories, found ${categoryCount}.`,
    );
  }

  if (brandCount !== EXPECTED_BRAND_COUNT) {
    throw new Error(
      `POST-COMMIT FAILURE: expected ${EXPECTED_BRAND_COUNT} brand, found ${brandCount}.`,
    );
  }

  if (collectionCount !== EXPECTED_COLLECTION_COUNT) {
    throw new Error(
      `POST-COMMIT FAILURE: expected ${EXPECTED_COLLECTION_COUNT} collections, found ${collectionCount}.`,
    );
  }

  if (productCount !== EXPECTED_PRODUCT_COUNT) {
    throw new Error(
      `POST-COMMIT FAILURE: expected ${EXPECTED_PRODUCT_COUNT} products, found ${productCount}.`,
    );
  }

  success("Post-commit catalog counts are correct.");

  const activeProductCount = await Product.countDocuments({
    status: "active",
  });

  const featuredProductCount = await Product.countDocuments({
    featured: true,
    status: "active",
  });

  info(`Active products: ${activeProductCount}`);
  info(`Featured active products: ${featuredProductCount}`);

  if (activeProductCount !== EXPECTED_PRODUCT_COUNT) {
    throw new Error(
      `Expected all ${EXPECTED_PRODUCT_COUNT} products to be active, found ${activeProductCount} active products.`,
    );
  }

  if (featuredProductCount < 6) {
    throw new Error(
      `Expected at least 6 featured products for the homepage, found ${featuredProductCount}.`,
    );
  }

  success("Active/featured product state verified.");

  const allProducts = await Product.find({})
    .populate("category", "name slug")
    .populate("brand", "name slug")
    .populate("collection", "name slug")
    .lean();

  for (const product of allProducts) {
    if (!product.category) {
      throw new Error(`POST-COMMIT FAILURE: "${product.name}" has no category.`);
    }

    if (!product.brand) {
      throw new Error(`POST-COMMIT FAILURE: "${product.name}" has no brand.`);
    }

    if (!product.collection) {
      throw new Error(`POST-COMMIT FAILURE: "${product.name}" has no collection.`);
    }

    if (!product.images?.length) {
      throw new Error(`POST-COMMIT FAILURE: "${product.name}" has no image.`);
    }
  }

  success("All product references are valid after commit.");

  printSection("FINAL PRODUCT LIST");

  for (const product of allProducts) {
    const category = product.category as
      | {
          name?: string;
        }
      | null
      | undefined;

    console.log(
      [
        `• ${product.name}`,
        `  SKU: ${product.sku}`,
        `  Slug: ${product.slug}`,
        `  Category: ${category?.name ?? "UNKNOWN"}`,
        `  Price: ₹${product.price}`,
        `  Stock: ${product.stock}`,
        `  Featured: ${product.featured ? "YES" : "NO"}`,
      ].join("\n"),
    );

    console.log("");
  }

  success("POST-COMMIT VERIFICATION PASSED.");
}

/* ============================================================================
   16. MAIN MIGRATION
============================================================================ */

async function runMigration(): Promise<void> {
  printHeader("BUZZIEWORLD — CATALOG MIGRATION V2");

  console.log(
    APPLY_MODE
      ? "MODE: APPLY — DATABASE WRITES ARE ENABLED"
      : "MODE: DRY RUN — DATABASE WRITES ARE DISABLED",
  );

  console.log("");
  console.log("IMPORTANT: The existing scripts/seed.ts is NOT being used.");

  console.log(
    "IMPORTANT: Users, orders, carts, payments and other non-catalog data are protected.",
  );

  /* --------------------------------------------------------------------------
     Environment
  -------------------------------------------------------------------------- */

  loadEnvironment();

  /* --------------------------------------------------------------------------
     Static file checks
  -------------------------------------------------------------------------- */

  validateLocalImages();

  /* --------------------------------------------------------------------------
     Catalog definition checks
  -------------------------------------------------------------------------- */

  validateCatalogDefinitions();

  /* --------------------------------------------------------------------------
     Dynamic imports
     -----------------------------------------------------------------------
     These intentionally happen AFTER dotenv.config().
  -------------------------------------------------------------------------- */

  printSection("STEP 4 — LOADING APPLICATION MODELS");

  const { connectToDatabase } = await import("@/lib/mongoose");

  const { Product } = await import("@/models/Product");

  const { Category } = await import("@/models/Category");

  const { Brand } = await import("@/models/Brand");

  const { Collection } = await import("@/models/Collection");

  const { Order } = await import("@/models/Order");

  const { Cart } = await import("@/models/Cart");

  success("Product model loaded.");
  success("Category model loaded.");
  success("Brand model loaded.");
  success("Collection model loaded.");
  success("Order model loaded.");
  success("Cart model loaded.");

  /* --------------------------------------------------------------------------
     Database connection
  -------------------------------------------------------------------------- */

  printSection("STEP 5 — CONNECTING TO MONGODB");

  try {
    await connectToDatabase();

    success("MongoDB connection established.");

    if (mongoose.connection.readyState !== 1) {
      throw new Error(
        `MongoDB connection state is ${mongoose.connection.readyState}, expected 1 (connected).`,
      );
    }

    success("MongoDB connection state confirmed as CONNECTED.");

    if (mongoose.connection.db?.databaseName) {
      info(`Database name: ${mongoose.connection.db.databaseName}`);
    }
  } catch (error) {
    throw new Error(["MongoDB connection failed.", "", describeError(error)].join("\n"));
  }

  /* --------------------------------------------------------------------------
     Database safety
  -------------------------------------------------------------------------- */

  await runDatabaseSafetyChecks(Product, Order, Cart);

  /* --------------------------------------------------------------------------
     DRY RUN STOP
  -------------------------------------------------------------------------- */

  if (DRY_RUN_MODE) {
    printHeader("DRY RUN COMPLETE — NO DATABASE CHANGES WERE MADE");

    success(`Validated ${EXPECTED_CATEGORY_COUNT} categories.`);

    success(`Validated ${EXPECTED_BRAND_COUNT} brand.`);

    success(`Validated ${EXPECTED_COLLECTION_COUNT} collections.`);

    success(`Validated ${EXPECTED_PRODUCT_COUNT} products.`);

    success(`Validated ${REQUIRED_IMAGE_PATHS.length} local product assets.`);

    console.log("");
    warning("Nothing was inserted, updated or deleted.");

    console.log("");
    console.log("If the output above looks correct, run:");

    console.log("");
    console.log("  npx tsx scripts/seed-catalog-v2.ts --apply");

    console.log("");

    return;
  }

  /* --------------------------------------------------------------------------
     Backup
  -------------------------------------------------------------------------- */

  const backupFile = await createCatalogBackup(Product, Category, Brand, Collection);

  /* --------------------------------------------------------------------------
     Transaction
  -------------------------------------------------------------------------- */

  printSection("STEP 9 — STARTING MONGODB TRANSACTION");

  const session = await mongoose.startSession();

  let transactionCommitted = false;

  try {
    await session.withTransaction(
      async () => {
        info("MongoDB transaction started.");

        /* --------------------------------------------------------------------
           IMPORTANT ORDER OF OPERATIONS
           --------------------------------------------------------------------

           Products are deleted FIRST.

           This is required because products contain references to:
             category
             brand
             collection

           After products are gone, the old catalog reference documents can
           safely be replaced.

           This entire operation occurs inside a MongoDB transaction.
        -------------------------------------------------------------------- */

        const oldProductCount = await Product.countDocuments({}, { session });

        const oldCategoryCount = await Category.countDocuments({}, { session });

        const oldBrandCount = await Brand.countDocuments({}, { session });

        const oldCollectionCount = await Collection.countDocuments({}, { session });

        info(
          `Catalog before replacement: products=${oldProductCount}, categories=${oldCategoryCount}, brands=${oldBrandCount}, collections=${oldCollectionCount}`,
        );

        /* --------------------------------------------------------------------
           Remove old products
        -------------------------------------------------------------------- */

        const productDeleteResult = await Product.deleteMany({}, { session });

        info(`Deleted old products: ${productDeleteResult.deletedCount}`);

        /* --------------------------------------------------------------------
           Remove old collections
        -------------------------------------------------------------------- */

        const collectionDeleteResult = await Collection.deleteMany({}, { session });

        info(`Deleted old collections: ${collectionDeleteResult.deletedCount}`);

        /* --------------------------------------------------------------------
           Remove old brands
        -------------------------------------------------------------------- */

        const brandDeleteResult = await Brand.deleteMany({}, { session });

        info(`Deleted old brands: ${brandDeleteResult.deletedCount}`);

        /* --------------------------------------------------------------------
           Remove old categories
        -------------------------------------------------------------------- */

        const categoryDeleteResult = await Category.deleteMany({}, { session });

        info(`Deleted old categories: ${categoryDeleteResult.deletedCount}`);

        success("Old catalog records removed inside transaction.");

        /* --------------------------------------------------------------------
           Insert new references
        -------------------------------------------------------------------- */

        const { categoryMap, collectionMap, brandId } = await buildDatabaseReferences(
          Category,
          Brand,
          Collection,
          session,
        );

        /* --------------------------------------------------------------------
           Insert products
        -------------------------------------------------------------------- */

        await insertProducts(Product, categoryMap, collectionMap, brandId, session);

        /* --------------------------------------------------------------------
           Verify BEFORE COMMIT
        -------------------------------------------------------------------- */

        await verifyInsideTransaction(Product, Category, Brand, Collection, session);

        info("Transaction callback completed successfully.");

        info("MongoDB will now commit all catalog changes atomically.");
      },
      {
        readConcern: {
          level: "snapshot",
        },
        writeConcern: {
          w: "majority",
        },
        maxCommitTimeMS: 120000,
      },
    );

    transactionCommitted = true;

    success("MongoDB transaction COMMITTED successfully.");
  } catch (error) {
    failure("MongoDB transaction FAILED.");

    console.error("");
    console.error("DETAILED TRANSACTION ERROR:");
    console.error(describeError(error));
    console.error("");

    if (!transactionCommitted) {
      warning(
        "Because the transaction did not commit, MongoDB should have rolled back the catalog changes made inside the transaction.",
      );
    }

    throw error;
  } finally {
    await session.endSession();

    success("MongoDB transaction session closed.");
  }

  /* --------------------------------------------------------------------------
     Post-commit verification
  -------------------------------------------------------------------------- */

  await verifyAfterCommit(Product, Category, Brand, Collection);

  /* --------------------------------------------------------------------------
     Final success
  -------------------------------------------------------------------------- */

  printHeader("BUZZIEWORLD CATALOG MIGRATION COMPLETED SUCCESSFULLY");

  success("Database migration completed.");
  success("Old catalog replaced.");
  success("New categories installed.");
  success("Single BuzzieWorld brand installed.");
  success("New collections installed.");
  success("New products installed.");
  success("Product references verified.");
  success("Image paths verified.");
  success("Post-commit verification passed.");

  console.log("");
  console.log("CATALOG SUMMARY");
  console.log("----------------------------------------");
  console.log(`Categories:   ${EXPECTED_CATEGORY_COUNT}`);
  console.log(`Brands:       ${EXPECTED_BRAND_COUNT}`);
  console.log(`Collections:  ${EXPECTED_COLLECTION_COUNT}`);
  console.log(`Products:     ${EXPECTED_PRODUCT_COUNT}`);
  console.log("----------------------------------------");

  console.log("");
  console.log("BACKUP FILE");
  console.log("----------------------------------------");
  console.log(backupFile);
  console.log("----------------------------------------");

  console.log("");
  console.log("Next step: start the application and verify the storefront.");
}

/* ============================================================================
   17. GLOBAL ERROR HANDLER
============================================================================ */

async function main(): Promise<void> {
  try {
    await runMigration();
  } catch (error) {
    printHeader("BUZZIEWORLD CATALOG MIGRATION FAILED");

    failure("The migration did not complete.");

    console.error("");
    console.error("ERROR DETAILS:");
    console.error(describeError(error));

    console.error("");

    console.error("IMPORTANT:");

    console.error("- If this was a DRY RUN, no database changes were made.");

    console.error(
      "- If APPLY mode failed during the MongoDB transaction, the transaction should have been rolled back.",
    );

    console.error(
      "- If the transaction committed but post-commit verification failed, DO NOT rerun the migration blindly.",
    );

    console.error("- Send me the complete terminal output before doing anything else.");

    console.error("");

    process.exitCode = 1;
  } finally {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
        success("MongoDB connection closed.");
      }
    } catch (disconnectError) {
      console.error(
        "⚠ Failed to close MongoDB connection cleanly:",
        describeError(disconnectError),
      );

      process.exitCode = 1;
    }
  }
}

/* ============================================================================
   18. RUN
============================================================================ */

void main();
