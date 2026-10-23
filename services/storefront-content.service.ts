import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongoose";
import { DealSettings } from "@/models/DealSettings";
import { PlaydatesSettings } from "@/models/PlaydatesSettings";
import { Product } from "@/models/Product";

const DEFAULT_KEY = "default";

export interface DealItemInput {
  productId: string;
  offerType: "buy_x_get_y" | "percentage";
  buyQuantity?: number;
  freeQuantity?: number;
  discountPercent?: number;
  isEnabled: boolean;
}

export interface DealSettingsInput {
  title: string;
  description: string;
  isPublished: boolean;
  items: DealItemInput[];
}

export interface PlaydatesSettingsInput {
  heading: string;
  description: string;
  image: string;
  imageAlt: string;
  isPublished: boolean;
}

function requireText(value: unknown, field: string, maxLength: number, allowEmpty = false): string {
  if (typeof value !== "string") {
    throw new Error(`${field} must be text.`);
  }

  const normalized = value.trim();

  if (!allowEmpty && !normalized) {
    throw new Error(`${field} is required.`);
  }

  if (normalized.length > maxLength) {
    throw new Error(`${field} must be ${maxLength} characters or fewer.`);
  }

  return normalized;
}

function requireBoolean(value: unknown, field: string): boolean {
  if (typeof value !== "boolean") {
    throw new Error(`${field} must be true or false.`);
  }

  return value;
}

function normalizeDealItems(value: unknown): DealItemInput[] {
  if (!Array.isArray(value)) {
    throw new Error("Deal items must be an array.");
  }

  if (value.length > 100) {
    throw new Error("You can configure a maximum of 100 deal items.");
  }

  const items = value.map((raw, index): DealItemInput => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      throw new Error(`Deal item ${index + 1} is invalid.`);
    }

    const item = raw as Record<string, unknown>;
    const productId = typeof item.productId === "string" ? item.productId.trim() : "";

    if (!Types.ObjectId.isValid(productId)) {
      throw new Error(`Deal item ${index + 1} has an invalid product ID.`);
    }

    if (item.offerType !== "buy_x_get_y" && item.offerType !== "percentage") {
      throw new Error(`Deal item ${index + 1} has an invalid offer type.`);
    }

    if (typeof item.isEnabled !== "boolean") {
      throw new Error(`Deal item ${index + 1} must have an enabled status.`);
    }

    if (item.offerType === "buy_x_get_y") {
      const buyQuantity = item.buyQuantity;
      const freeQuantity = item.freeQuantity;

      if (
        typeof buyQuantity !== "number" ||
        !Number.isInteger(buyQuantity) ||
        buyQuantity < 1 ||
        buyQuantity > 20
      ) {
        throw new Error(`Deal item ${index + 1}: buy quantity must be between 1 and 20.`);
      }

      if (
        typeof freeQuantity !== "number" ||
        !Number.isInteger(freeQuantity) ||
        freeQuantity < 1 ||
        freeQuantity > 20
      ) {
        throw new Error(`Deal item ${index + 1}: free quantity must be between 1 and 20.`);
      }

      return {
        productId,
        offerType: "buy_x_get_y",
        buyQuantity,
        freeQuantity,
        isEnabled: item.isEnabled,
      };
    }

    if (![30, 50, 60].includes(Number(item.discountPercent))) {
      throw new Error(`Deal item ${index + 1}: discount must be 30%, 50%, or 60%.`);
    }

    return {
      productId,
      offerType: "percentage",
      discountPercent: Number(item.discountPercent),
      isEnabled: item.isEnabled,
    };
  });

  const ids = items.map((item) => item.productId);

  if (new Set(ids).size !== ids.length) {
    throw new Error("A product can only appear once in the deal list.");
  }

  return items;
}

export async function getDealSettings(isAdmin = false) {
  await connectToDatabase();

  const settings = await DealSettings.findOne({ key: DEFAULT_KEY }).lean();

  if (!settings) {
    return {
      key: DEFAULT_KEY,
      title: "Crazy Deals",
      description: "",
      isPublished: false,
      items: [],
      products: [],
    };
  }

  const visibleItems = isAdmin
    ? settings.items
    : settings.isPublished
      ? settings.items.filter((item) => item.isEnabled)
      : [];

  const ids = visibleItems.map((item) => item.productId);

  const products =
    ids.length > 0
      ? await Product.find({
          _id: { $in: ids },
          published: true,
          status: "active",
        })
          .select(
            "_id name slug description shortDescription price compareAtPrice images listingImage stock status published",
          )
          .lean()
      : [];

  const productMap = new Map(products.map((product) => [String(product._id), product]));

  const items = visibleItems
    .map((item) => {
      const product = productMap.get(String(item.productId));

      if (!product) {
        return null;
      }

      return {
        productId: String(item.productId),
        offerType: item.offerType,
        buyQuantity: item.buyQuantity,
        freeQuantity: item.freeQuantity,
        discountPercent: item.discountPercent,
        isEnabled: item.isEnabled,
        product,
      };
    })
    .filter((item) => item !== null);

  return {
    key: settings.key,
    title: settings.title,
    description: settings.description,
    isPublished: settings.isPublished,
    items,
  };
}

export async function saveDealSettings(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("A valid deal settings object is required.");
  }

  const body = input as Record<string, unknown>;

  const title = requireText(body.title, "Title", 120);
  const description = requireText(body.description, "Description", 500, true);
  const isPublished = requireBoolean(body.isPublished, "Published status");
  const items = normalizeDealItems(body.items);

  await connectToDatabase();

  const ids = items.map((item) => item.productId);

  if (ids.length > 0) {
    const existingProducts = await Product.find({
      _id: { $in: ids },
    })
      .select("_id")
      .lean();

    if (existingProducts.length !== ids.length) {
      throw new Error("One or more selected products no longer exist.");
    }
  }

  if (isPublished && !items.some((item) => item.isEnabled)) {
    throw new Error("Enable at least one deal item before publishing.");
  }

  await DealSettings.findOneAndUpdate(
    { key: DEFAULT_KEY },
    {
      $set: {
        title,
        description,
        isPublished,
        items: items.map((item) => ({
          ...item,
          productId: new Types.ObjectId(item.productId),
        })),
      },
      $setOnInsert: {
        key: DEFAULT_KEY,
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  return getDealSettings(true);
}

export async function getPlaydatesSettings(isAdmin = false) {
  await connectToDatabase();

  const settings = await PlaydatesSettings.findOne({
    key: DEFAULT_KEY,
  }).lean();

  const fallback = {
    key: DEFAULT_KEY,
    heading: "Play Dates",
    description: "",
    image: "",
    imageAlt: "BuzzieWorld Play Dates",
    isPublished: false,
  };

  if (!settings) {
    return fallback;
  }

  if (!isAdmin && !settings.isPublished) {
    return fallback;
  }

  return {
    key: settings.key,
    heading: settings.heading,
    description: settings.description,
    image: settings.image,
    imageAlt: settings.imageAlt,
    isPublished: settings.isPublished,
  };
}

export async function savePlaydatesSettings(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("A valid Playdates settings object is required.");
  }

  const body = input as Record<string, unknown>;

  const heading = requireText(body.heading, "Heading", 160);
  const description = requireText(body.description, "Description", 2000, true);
  const image = requireText(body.image, "Image path", 1000, true);
  const imageAlt = requireText(body.imageAlt, "Image alt text", 200, true);
  const isPublished = requireBoolean(body.isPublished, "Published status");

  if (isPublished && !image) {
    throw new Error("Add an image before publishing Playdates.");
  }

  await connectToDatabase();

  await PlaydatesSettings.findOneAndUpdate(
    { key: DEFAULT_KEY },
    {
      $set: {
        heading,
        description,
        image,
        imageAlt,
        isPublished,
      },
      $setOnInsert: {
        key: DEFAULT_KEY,
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  );

  return getPlaydatesSettings(true);
}
