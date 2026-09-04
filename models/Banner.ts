import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IBanner extends Document {
  name: string;

  headline: string;

  subheadline?: string;

  image: string;

  mobileImage?: string;

  ctaText?: string;

  ctaLink?: string;

  position: number;

  isActive: boolean;

  featured: boolean;

  startDate?: Date;

  endDate?: Date;

  createdAt: Date;

  updatedAt: Date;
}

const BannerSchema = new Schema<IBanner>(
  {
    /*
     * Internal campaign name.
     *
     * Example:
     * "Diwali Sale 2026"
     * "Crazy Deals"
     */
    name: {
      type: String,
      required: true,
      trim: true,
    },

    /*
     * Main text shown on the banner.
     */
    headline: {
      type: String,
      required: true,
      trim: true,
    },

    /*
     * Optional supporting text.
     */
    subheadline: {
      type: String,
      trim: true,
    },

    /*
     * Desktop / primary banner image.
     */
    image: {
      type: String,
      required: true,
      trim: true,
    },

    /*
     * Optional mobile-specific image.
     *
     * If empty, the storefront can fall back
     * to the main image.
     */
    mobileImage: {
      type: String,
      trim: true,
    },

    /*
     * CTA button.
     *
     * Example:
     * "Shop Now"
     */
    ctaText: {
      type: String,
      trim: true,
    },

    /*
     * CTA destination.
     *
     * Example:
     * "/collections/diwali-sale"
     */
    ctaLink: {
      type: String,
      trim: true,
    },

    /*
     * Controls banner ordering.
     */
    position: {
      type: Number,
      default: 0,
      index: true,
    },

    /*
     * Whether the banner is currently enabled.
     */
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    /*
     * Whether this is considered a featured campaign.
     */
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },

    /*
     * Optional campaign scheduling.
     */
    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

BannerSchema.index({
  isActive: 1,
  position: 1,
});

export const Banner: Model<IBanner> =
  (mongoose.models.Banner as Model<IBanner>) || mongoose.model<IBanner>("Banner", BannerSchema);
