import mongoose, { Schema, type Document, type Model, type Types } from "mongoose";

export interface IPasswordResetToken extends Document {
  user: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
}

const PasswordResetTokenSchema = new Schema<IPasswordResetToken>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
  },
);

/*
 * MongoDB automatically removes expired reset tokens.
 */
PasswordResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PasswordResetToken =
  (mongoose.models.PasswordResetToken as Model<IPasswordResetToken>) ||
  mongoose.model<IPasswordResetToken>("PasswordResetToken", PasswordResetTokenSchema);

export default PasswordResetToken;

