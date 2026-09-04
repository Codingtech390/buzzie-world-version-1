import mongoose, { Schema, type Model, type Types } from "mongoose";

export type ReviewStatus = "pending" | "published" | "hidden";

export interface IReview {
  product: Types.ObjectId;
  user?: Types.ObjectId;

  customerName: string;
  customerEmail: string;

  rating: number;
  title?: string;
  comment: string;

  verifiedPurchase: boolean;

  status: ReviewStatus;

  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      sparse: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 160,
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    title: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    verifiedPurchase: {
      type: Boolean,
      default: false,
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "published", "hidden"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

/*
 * Useful query indexes.
 *
 * Product page:
 *   product + status + newest first
 *
 * Admin:
 *   status + newest first
 */
ReviewSchema.index({
  product: 1,
  status: 1,
  createdAt: -1,
});

ReviewSchema.index({
  status: 1,
  createdAt: -1,
});

ReviewSchema.index({
  rating: 1,
  status: 1,
});

/*
 * Prevent Mongoose from recompiling the model
 * during Next.js hot reloads.
 */
export const Review: Model<IReview> =
  (mongoose.models.Review as Model<IReview>) || mongoose.model<IReview>("Review", ReviewSchema);
