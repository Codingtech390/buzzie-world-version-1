import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ICollection extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  featured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema = new Schema<ICollection>(
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
    },

    image: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const Collection: Model<ICollection> =
  (mongoose.models.Collection as Model<ICollection>) ||
  mongoose.model<ICollection>("Collection", CollectionSchema);
