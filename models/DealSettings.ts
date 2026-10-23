import mongoose, { Schema, type Model, type Types } from "mongoose";

export type DealOfferType = "buy_x_get_y" | "percentage";

export interface IDealItem {
  productId: Types.ObjectId;
  offerType: DealOfferType;
  buyQuantity?: number;
  freeQuantity?: number;
  discountPercent?: number;
  isEnabled: boolean;
}

export interface IDealSettings {
  key: string;
  title: string;
  description: string;
  isPublished: boolean;
  items: IDealItem[];
  createdAt: Date;
  updatedAt: Date;
}

const DealItemSchema = new Schema<IDealItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    offerType: {
      type: String,
      enum: ["buy_x_get_y", "percentage"],
      required: true,
    },
    buyQuantity: {
      type: Number,
      min: 1,
    },
    freeQuantity: {
      type: Number,
      min: 1,
    },
    discountPercent: {
      type: Number,
      enum: [30, 50, 60],
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false },
);

const DealSettingsSchema = new Schema<IDealSettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "default",
    },
    title: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "Crazy Deals",
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    items: {
      type: [DealItemSchema],
      default: [],
    },
  },
  { timestamps: true },
);

export const DealSettings: Model<IDealSettings> =
  (mongoose.models.DealSettings as Model<IDealSettings>) ||
  mongoose.model<IDealSettings>("DealSettings", DealSettingsSchema);

export default DealSettings;
