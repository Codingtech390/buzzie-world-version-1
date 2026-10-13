import mongoose, { Schema, type Model, type Types } from "mongoose";

import type { SiteSettings } from "@/types/settings";

export interface ISiteSetting extends SiteSettings {
  _id: Types.ObjectId;
  key: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingSchema = new Schema<ISiteSetting>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: "default",
      immutable: true,
    },

    storeName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    tagline: {
      type: String,
      default: "",
      trim: true,
      maxlength: 200,
    },
    supportEmail: {
      type: String,
      default: "",
      trim: true,
      maxlength: 254,
    },
    supportPhone: {
      type: String,
      default: "",
      trim: true,
      maxlength: 25,
    },
    storeUrl: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },
    currency: {
      type: String,
      enum: ["INR"],
      default: "INR",
      required: true,
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
      trim: true,
      maxlength: 100,
    },
    storeEnabled: {
      type: Boolean,
      default: true,
    },

    announcementEnabled: {
      type: Boolean,
      default: false,
    },
    announcementText: {
      type: String,
      default: "",
      trim: true,
      maxlength: 250,
    },

    allowGuestCheckout: {
      type: Boolean,
      default: true,
    },
    minOrderValue: {
      type: Number,
      default: 0,
      min: 0,
      max: 10000000,
    },
    freeShippingThreshold: {
      type: Number,
      default: 999,
      min: 0,
      max: 10000000,
    },
    flatShippingRate: {
      type: Number,
      default: 60,
      min: 0,
      max: 1000000,
    },
    estimatedDeliveryMinDays: {
      type: Number,
      default: 3,
      min: 0,
      max: 90,
    },
    estimatedDeliveryMaxDays: {
      type: Number,
      default: 7,
      min: 0,
      max: 90,
    },
    orderPrefix: {
      type: String,
      default: "BW",
      trim: true,
      maxlength: 12,
    },

    taxEnabled: {
      type: Boolean,
      default: false,
    },
    taxRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    pricesIncludeTax: {
      type: Boolean,
      default: true,
    },

    seoTitle: {
      type: String,
      default: "",
      trim: true,
      maxlength: 70,
    },
    seoDescription: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },
    instagramUrl: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },
    facebookUrl: {
      type: String,
      default: "",
      trim: true,
      maxlength: 300,
    },

    maintenanceMode: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const SiteSetting: Model<ISiteSetting> =
  (mongoose.models.SiteSetting as Model<ISiteSetting>) ||
  mongoose.model<ISiteSetting>("SiteSetting", SiteSettingSchema);

export default SiteSetting;
