
import mongoose, { Schema, type Model, type Types } from "mongoose";

export interface IHomepage {
  key: string;
  favoriteProductIds: Types.ObjectId[];
  isFavoriteSectionEnabled: boolean;
  heroSlides: {
    id: string;
    image: string;
    alt: string;
    href: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const HomepageSchema = new Schema<IHomepage>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "default",
    },

    favoriteProductIds: {
      type: [Schema.Types.ObjectId],
      ref: "Product",
      default: [],
    },
    isFavoriteSectionEnabled: {
      type: Boolean,
      default: false,
    },

    heroSlides: {
      type: [
        new Schema(
          {
            id: {
              type: String,
              required: true,
            },
            image: {
              type: String,
              required: true,
            },
            alt: {
              type: String,
              required: true,
            },
            href: {
              type: String,
              required: true,
            },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const Homepage =
  (mongoose.models.Homepage as Model<IHomepage>) ||
  mongoose.model<IHomepage>("Homepage", HomepageSchema);

export default Homepage;
