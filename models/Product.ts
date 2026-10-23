import mongoose, { Schema, type HydratedDocument, type Model, type Types } from "mongoose";
import type { ProductDiaryData } from "@/types/product";
/**
 * Product image
 */
export interface IProductImage {
  url: string;
  publicId?: string;
  alt?: string;
  caption?: string;
}

export interface IProductContentImage {
  url: string;
  publicId?: string;
  alt?: string;
  caption?: string;
}

export interface IProductVideo {
  url: string;
  publicId?: string;
  title?: string;
  format?: string;
  duration?: number;
}


/**
 * Product variant
 */
export interface IProductVariant {
  _id?: Types.ObjectId;
  name: string;
  value: string;
  sku?: string;
  price?: number;
  stock?: number;
}

/**
 * Product
 */
export interface IProduct {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  keyFeatures: string[];
  productDiary?: ProductDiaryData;
  /**
   * Price and stock are optional while a product is a draft.
   * Active products are validated below.
   */
  price?: number;
  compareAtPrice?: number;

  sku?: string;

  images: IProductImage[];
  listingImage?: string;

  carouselImages: IProductImage[];

  aPlusContent: IProductContentImage[];
  howToPlay: IProductContentImage[];
  videos: IProductVideo[];

  category?: Types.ObjectId;
  brand?: Types.ObjectId;
  collection?: Types.ObjectId;

  variants: IProductVariant[];

  stock?: number;

  /**
   * Commerce lifecycle.
   *
   * draft    = still being prepared
   * active   = commercially ready to sell
   * archived = no longer available
   */
  status: "draft" | "active" | "archived";

  /**
   * Storefront visibility.
   *
   * published = true
   *   The product may appear in the public catalog.
   *
   * published = false
   *   The product remains hidden from the public catalog.
   *
   * This is intentionally separate from `status`.
   */
  published: boolean;

  featured: boolean;

  ageRange?: {
    min?: number;
    max?: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Hydrated Mongoose Product document
 */
export type ProductDocument = HydratedDocument<IProduct>;

/**
 * Product image schema
 */
const ProductImageSchema = new Schema<IProductImage>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    publicId: {
      type: String,
      trim: true,
    },

    alt: {
      type: String,
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

/**
 * Product variant schema
 */
const ProductVariantSchema = new Schema<IProductVariant>({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  value: {
    type: String,
    required: true,
    trim: true,
  },

  sku: {
    type: String,
    trim: true,
  },

  price: {
    type: Number,
    min: 0,
  },

  stock: {
    type: Number,
    min: 0,
    default: 0,
  },
});


const ProductDiaryEntrySchema = new Schema(
  {
    title: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const ProductDiarySpecificationSchema = new Schema(
  {
    label: { type: String, default: "", trim: true },
    value: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const ProductDiaryTextSectionSchema = new Schema(
  {
    eyebrow: { type: String, default: "", trim: true },
    title: { type: String, default: "", trim: true },
    intro: { type: String, default: "", trim: true },
    entries: {
      type: [ProductDiaryEntrySchema],
      default: [],
    },
  },
  { _id: false },
);

const ProductDiarySpecificationSectionSchema = new Schema(
  {
    eyebrow: { type: String, default: "", trim: true },
    title: { type: String, default: "", trim: true },
    intro: { type: String, default: "", trim: true },
    entries: {
      type: [ProductDiarySpecificationSchema],
      default: [],
    },
  },
  { _id: false },
);

const ProductDiarySchema = new Schema(
  {
    overview: {
      type: ProductDiaryTextSectionSchema,
      required: false,
    },
    keyFeatures: {
      type: ProductDiaryTextSectionSchema,
      required: false,
    },
    specifications: {
      type: ProductDiarySpecificationSectionSchema,
      required: false,
    },
    benefits: {
      type: ProductDiaryTextSectionSchema,
      required: false,
    },
  },
  { _id: false },
);


/**
 * Product schema
 */
const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    shortDescription: {
      type: String,
    },

    keyFeatures: {
      type: [String],
      default: [],
    },

    productDiary: {
      type: ProductDiarySchema,
      required: false,
    },

    /**
     * Optional for draft products.
     * Active products are validated below.
     */
    price: {
      type: Number,
      min: 0,
    },

    compareAtPrice: {
      type: Number,
      min: 0,
    },

    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    images: {
      type: [ProductImageSchema],
      default: [],
    },

    listingImage: {
      type: String,
      default: "",
    },

    carouselImages: {
      type: [ProductImageSchema],
      default: [],
    },

    aPlusContent: {
      type: [ProductImageSchema],
      default: [],
    },

    howToPlay: {
      type: [ProductImageSchema],
      default: [],
    },

    videos: {
      type: [
        new Schema(
          {
            url: {
              type: String,
              required: true,
              trim: true,
            },
            publicId: {
              type: String,
              trim: true,
            },
            title: {
              type: String,
              trim: true,
            },
            format: {
              type: String,
              trim: true,
            },
            duration: {
              type: Number,
              min: 0,
            },
          },
          { _id: false },
        ),
      ],
      default: [],
      validate: {
        validator: (videos: IProductVideo[]) => videos.length <= 3,
        message: "A product can have a maximum of 3 videos.",
      },
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },

    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      index: true,
    },

    collection: {
      type: Schema.Types.ObjectId,
      ref: "Collection",
      index: true,
    },

    variants: {
      type: [ProductVariantSchema],
      default: [],
    },

    /**
     * Optional for draft products.
     * Active products are validated below.
     */
    stock: {
      type: Number,
      min: 0,
    },

    /**
     * Commerce lifecycle.
     */
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "draft",
      index: true,
    },

    /**
     * Storefront visibility.
     *
     * New products are hidden until explicitly published.
     */
    published: {
      type: Boolean,
      default: false,
      index: true,
    },

    featured: {
      type: Boolean,
      default: false,
      index: true,
    },

    ageRange: {
      min: {
        type: Number,
        min: 0,
      },

      max: {
        type: Number,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Active products must be commercially complete.
 *
 * Draft and archived products may temporarily have
 * missing price and/or stock.
 */
ProductSchema.pre("validate", function () {
  if (this.status === "active") {
    if (this.price === undefined || this.price === null) {
      this.invalidate("price", "Active products require a price.");
    }

    if (this.stock === undefined || this.stock === null) {
      this.invalidate("stock", "Active products require stock.");
    }
  }
});

/**
 * Product search index
 */
ProductSchema.index({
  name: "text",
  description: "text",
  shortDescription: "text",
});

/**
 * Product model
 */
export const Product: Model<IProduct> =
  (mongoose.models.Product as Model<IProduct>) ||
  mongoose.model<IProduct>("Product", ProductSchema);
