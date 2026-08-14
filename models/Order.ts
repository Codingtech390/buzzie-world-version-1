import mongoose, { Schema, type Model, type Types } from "mongoose";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface IShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  slug: string;
  sku?: string;
  image?: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface IOrder {
  orderNumber: string;
  user?: Types.ObjectId;

  items: IOrderItem[];

  shippingAddress: IShippingAddress;

  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;

  status: OrderStatus;
  paymentStatus: PaymentStatus;

  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;

  createdAt: Date;
  updatedAt: Date;
}

const ShippingAddressSchema = new Schema<IShippingAddress>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
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
      required: true,
      default: "India",
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
      required: true,
    },

    sku: {
      type: String,
    },

    image: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    lineTotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (value: IOrderItem[]) => value.length > 0,
        message: "Order must contain at least one item",
      },
    },

    shippingAddress: {
      type: ShippingAddressSchema,
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    shipping: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    discount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      default: "INR",
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },

    razorpayOrderId: {
      type: String,
      index: true,
      sparse: true,
    },

    razorpayPaymentId: {
      type: String,
      index: true,
      sparse: true,
    },

    razorpaySignature: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const Order: Model<IOrder> =
  (mongoose.models.Order as Model<IOrder>) || mongoose.model<IOrder>("Order", OrderSchema);
