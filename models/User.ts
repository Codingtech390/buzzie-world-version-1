import mongoose, { Schema } from "mongoose";

export type UserRole = "customer" | "admin";

export interface IUserAddress {
  _id?: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  image?: string;
  addresses: IUserAddress[];
  isActive: boolean;
  emailVerified?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

const AddressSchema = new Schema<IUserAddress>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    addressLine1: {
      type: String,
      required: true,
      trim: true,
    },

    addressLine2: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    postalCode: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      default: "India",
      trim: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: true,
  },
);

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      select: false,
    },

    phone: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
      index: true,
    },

    image: {
      type: String,
    },

    addresses: {
      type: [AddressSchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    emailVerified: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
