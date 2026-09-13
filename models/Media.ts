import mongoose, { Schema, type Document, type Model } from "mongoose";

export type MediaResourceType = "image" | "video" | "raw";

export type MediaStatus = "active" | "inactive";

export interface IMedia extends Document {
  name: string;

  key: string;

  slot?: string;

  resourceType: MediaResourceType;

  url: string;

  secureUrl: string;

  publicId: string;

  folder?: string;

  format?: string;

  mimeType?: string;

  bytes?: number;

  width?: number;

  height?: number;

  duration?: number;

  thumbnailUrl?: string;

  alt?: string;

  title?: string;

  description?: string;

  status: MediaStatus;

  sortOrder: number;

  createdBy?: mongoose.Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },

    slot: {
      type: String,
      index: true,
      trim: true,
    },

    resourceType: {
      type: String,
      enum: ["image", "video", "raw"],
      required: true,
      index: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    secureUrl: {
      type: String,
      required: true,
      trim: true,
    },

    publicId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    folder: {
      type: String,
      trim: true,
    },

    format: {
      type: String,
      trim: true,
    },

    mimeType: {
      type: String,
      trim: true,
    },

    bytes: {
      type: Number,
      min: 0,
    },

    width: {
      type: Number,
      min: 0,
    },

    height: {
      type: Number,
      min: 0,
    },

    duration: {
      type: Number,
      min: 0,
    },

    thumbnailUrl: {
      type: String,
      trim: true,
    },

    alt: {
      type: String,
      trim: true,
    },

    title: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
      index: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

MediaSchema.index({
  resourceType: 1,
  status: 1,
  sortOrder: 1,
});

MediaSchema.index({
  slot: 1,
  status: 1,
});

export const Media: Model<IMedia> =
  (mongoose.models.Media as Model<IMedia>) || mongoose.model<IMedia>("Media", MediaSchema);

export default Media;
