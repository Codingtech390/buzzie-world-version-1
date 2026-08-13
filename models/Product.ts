import mongoose, { Schema, type HydratedDocument, type Model, type Types } from "mongoose";
/** * Product image */
export interface IProductImage {
  url: string;
  publicId?: string;
  alt?: string;
}
/** * Product variant */
export interface IProductVariant {
  _id?: Types.ObjectId;
  name: string;
  value: string;
  sku?: string;
  price?: number;
  stock?: number;
}
 export interface IProduct {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  images: IProductImage[];
  category?: Types.ObjectId;
  brand?: Types.ObjectId;
  collection?: Types.ObjectId;
  variants: IProductVariant[];
  stock: number;
  status: "draft" | "active" | "archived";
  featured: boolean;
  ageRange?: { min?: number; max?: number };
  createdAt: Date;
  updatedAt: Date;
}
/** * Hydrated Mongoose Product document */ export type ProductDocument =
  HydratedDocument<IProduct>;
/** * Product image schema */ const ProductImageSchema = new Schema<IProductImage>(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, trim: true },
    alt: { type: String, trim: true },
  },
  { _id: false },
);
/** * Product variant schema */ const ProductVariantSchema = new Schema<IProductVariant>({
  name: { type: String, required: true, trim: true },
  value: { type: String, required: true, trim: true },
  sku: { type: String, trim: true },
  price: { type: Number, min: 0 },
  stock: { type: Number, min: 0, default: 0 },
});
/** * Product schema */ const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    sku: { type: String, unique: true, sparse: true, trim: true },
    images: { type: [ProductImageSchema], default: [] },
    category: { type: Schema.Types.ObjectId, ref: "Category", index: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", index: true },
    collection: { type: Schema.Types.ObjectId, ref: "Collection", index: true },
    variants: { type: [ProductVariantSchema], default: [] },
    stock: { type: Number, required: true, min: 0, default: 0 },
    status: { type: String, enum: ["draft", "active", "archived"], default: "draft", index: true },
    featured: { type: Boolean, default: false, index: true },
    ageRange: { min: { type: Number, min: 0 }, max: { type: Number, min: 0 } },
  },
  { timestamps: true },
);
/** * Product search index */ ProductSchema.index({
  name: "text",
  description: "text",
  shortDescription: "text",
});

export const Product: Model<IProduct> =
  (mongoose.models.Product as Model<IProduct>) ||
  mongoose.model<IProduct>("Product", ProductSchema);
