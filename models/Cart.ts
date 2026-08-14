import mongoose, { Schema, type Model, type Types } from "mongoose";

export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface ICart {
  user?: Types.ObjectId;
  sessionId: string;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  {
    _id: false,
  },
);

const CartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    items: {
      type: [CartItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

export const Cart: Model<ICart> =
  (mongoose.models.Cart as Model<ICart>) || mongoose.model<ICart>("Cart", CartSchema);
