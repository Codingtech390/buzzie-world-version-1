import mongoose, { Schema, Types } from "mongoose";

export type WishlistReminderStatus = "active" | "processing" | "completed" | "cancelled";

export interface IWishlistReminder {
  user: Types.ObjectId;
  wishlist: Types.ObjectId;
  product: Types.ObjectId;

  reminderCount: number;
  nextReminderAt: Date;
  lastSentAt?: Date;

  status: WishlistReminderStatus;
  attempts: number;

  createdAt: Date;
  updatedAt: Date;
}

const WishlistReminderSchema = new Schema<IWishlistReminder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    wishlist: {
      type: Schema.Types.ObjectId,
      ref: "Wishlist",
      required: true,
      unique: true,
      index: true,
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    reminderCount: {
      type: Number,
      default: 0,
      min: 0,
      max: 3,
    },

    nextReminderAt: {
      type: Date,
      required: true,
      index: true,
    },

    lastSentAt: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["active", "processing", "completed", "cancelled"],
      default: "active",
      index: true,
    },

    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

WishlistReminderSchema.index({
  status: 1,
  nextReminderAt: 1,
});

const WishlistReminder =
  mongoose.models.WishlistReminder ||
  mongoose.model<IWishlistReminder>("WishlistReminder", WishlistReminderSchema);

export default WishlistReminder;
