import mongoose, { Schema, type Model } from "mongoose";

export interface IPlaydatesSettings {
  key: string;
  heading: string;
  description: string;
  image: string;
  imageAlt: string;
  isPublished: boolean;
  updatedAt: Date;
  createdAt: Date;
}

const PlaydatesSettingsSchema = new Schema<IPlaydatesSettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "default",
    },
    heading: {
      type: String,
      trim: true,
      maxlength: 160,
      default: "Play Dates",
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    imageAlt: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "BuzzieWorld Play Dates",
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const PlaydatesSettings: Model<IPlaydatesSettings> =
  (mongoose.models.PlaydatesSettings as Model<IPlaydatesSettings>) ||
  mongoose.model<IPlaydatesSettings>("PlaydatesSettings", PlaydatesSettingsSchema);

export default PlaydatesSettings;
