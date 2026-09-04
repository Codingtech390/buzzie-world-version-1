import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { Review } from "@/models/Review";

export type ReviewStatus = "pending" | "published" | "hidden";


type ReviewProduct = {
  _id?: {
    toString(): string;
  };
  name?: string;
  slug?: string;
  image?: string;
  images?: Array<
    | string
    | {
        url?: string;
      }
  >;
};

type ReviewProductReference =
  | ReviewProduct
  | {
      toString(): string;
    }
  | null
  | undefined;

type ReviewDocumentLike = {
  _id: {
    toString(): string;
  };
  product?: ReviewProductReference;
  customerName?: string;
  customerEmail?: string;
  rating?: number;
  title?: string;
  comment?: string;
  verifiedPurchase?: boolean;
  status?: "pending" | "published" | "hidden";
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

type AdminReviewProduct = {
  _id: {
    toString(): string;
  };
  name?: string;
  slug?: string;
};

type ReviewFilter = {
  status?: "pending" | "published" | "hidden";
  rating?: number;
  product?: string | Types.ObjectId;
  $or?: Array<{
    customerName?: RegExp;
    customerEmail?: RegExp;
    title?: RegExp;
    comment?: RegExp;
  }>;
};

type ReviewUpdateData = {
  status?: "pending" | "published" | "hidden";
};


export interface GetAdminReviewsOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: ReviewStatus | "";
  rating?: number;
  product?: string;
}

export interface AdminReview {
  id: string;

  customer: {
    name: string;
    email: string;
  };

  product: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
  };

  rating: number;
  title: string;
  comment: string;

  verifiedPurchase: boolean;
  status: ReviewStatus;

  createdAt: string;
  updatedAt: string;
}

export interface AdminReviewStats {
  total: number;
  published: number;
  pending: number;
  hidden: number;
  verified: number;
  averageRating: number;
}

export interface AdminReviewsResponse {
  reviews: AdminReview[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: AdminReviewStats;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeString(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getProductImage(product: ReviewProduct | null | undefined): string | null {
  if (!product) {
    return null;
  }

  if (Array.isArray(product.images)) {
    const firstImage = product.images.find((image) =>
      typeof image === "string"
        ? image.trim().length > 0
        : typeof image?.url === "string" && image.url.trim().length > 0,
    );

    if (typeof firstImage === "string") {
      return firstImage;
    }

    if (firstImage?.url) {
      return firstImage.url;
    }
  }

  if (typeof product.image === "string") {
    return product.image;
  }

  return null;
}

function serializeReview(review: ReviewDocumentLike): AdminReview {
  const product =
    review.product && typeof review.product === "object" && "name" in review.product
      ? review.product
      : undefined;

  const productId =
    product?._id?.toString() ??
    (review.product && typeof review.product === "object" && "toString" in review.product
      ? review.product.toString()
      : "");

  return {
    id: review._id.toString(),

    customer: {
      name: normalizeString(review.customerName) || "Guest Customer",
      email: normalizeEmail(review.customerEmail ?? "") || "—",
    },

    product: {
      id: productId,
      name: normalizeString(product?.name) || "Deleted product",
      slug: normalizeString(product?.slug) || "",
      image: getProductImage(product),
    },

    rating: Number(review.rating ?? 0),

    title: normalizeString(review.title) || "",

    comment: normalizeString(review.comment) || "",

    verifiedPurchase: Boolean(review.verifiedPurchase),

    status: review.status as ReviewStatus,

    createdAt: review.createdAt ? new Date(review.createdAt).toISOString() : "",

    updatedAt: review.updatedAt ? new Date(review.updatedAt).toISOString() : "",
  };
}

/**
 * Get review statistics from the database.
 *
 * These are NOT calculated from the current admin page.
 * This means pagination/filtering does not distort the totals.
 */
async function getReviewStats(): Promise<AdminReviewStats> {
  const [stats] = await Review.aggregate([
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              averageRating: { $avg: "$rating" },
            },
          },
        ],

        statuses: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ],

        verified: [
          {
            $match: {
              verifiedPurchase: true,
            },
          },
          {
            $count: "count",
          },
        ],
      },
    },
  ]);

  const totals = stats?.totals?.[0];

  const statusCounts: Record<string, number> = {};

  for (const item of stats?.statuses ?? []) {
    statusCounts[item._id] = Number(item.count ?? 0);
  }

  return {
    total: Number(totals?.total ?? 0),

    published: Number(statusCounts.published ?? 0),

    pending: Number(statusCounts.pending ?? 0),

    hidden: Number(statusCounts.hidden ?? 0),

    verified: Number(stats?.verified?.[0]?.count ?? 0),

    averageRating: totals?.averageRating ? Math.round(Number(totals.averageRating) * 100) / 100 : 0,
  };
}

/**
 * Get paginated reviews for admin.
 */
export async function getAdminReviews(
  options: GetAdminReviewsOptions = {},
): Promise<AdminReviewsResponse> {
  await connectToDatabase();

  const page = clamp(Number(options.page ?? 1), 1, 1000000);

  const limit = clamp(Number(options.limit ?? 20), 1, 100);

  const search = normalizeString(options.search);

  const status =
    options.status && ["pending", "published", "hidden"].includes(options.status)
      ? options.status
      : "";

  const rating =
    Number.isInteger(options.rating) && options.rating! >= 1 && options.rating! <= 5
      ? options.rating
      : undefined;

  const productId = normalizeString(options.product);

const filter: ReviewFilter = {};

  if (status) {
    filter.status = status;
  }

  if (rating) {
    filter.rating = rating;
  }

  if (productId) {
    if (!Types.ObjectId.isValid(productId)) {
      return {
        reviews: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
        stats: await getReviewStats(),
      };
    }

    filter.product = new Types.ObjectId(productId);
  }

  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(escapedSearch, "i");

    filter.$or = [
      {
        customerName: regex,
      },
      {
        customerEmail: regex,
      },
      {
        title: regex,
      },
      {
        comment: regex,
      },
    ];
  }

  const skip = (page - 1) * limit;

  const [reviews, total, stats] = await Promise.all([
    Review.find(filter)
      .populate({
        path: "product",
        select: "name slug images",
      })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    Review.countDocuments(filter),

    getReviewStats(),
  ]);

  return {
    reviews: reviews.map(serializeReview),

    pagination: {
      page,
      limit,
      total,
      totalPages: total > 0 ? Math.ceil(total / limit) : 0,
    },

    stats,
  };
}

/**
 * Get a single review by ID.
 */
export async function getReviewById(id: string): Promise<AdminReview | null> {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  const review = await Review.findById(id)
    .populate({
      path: "product",
      select: "name slug images",
    })
    .lean();

  if (!review) {
    return null;
  }

  return serializeReview(review);
}

/**
 * Update review moderation/status.
 */
export async function updateReview(
  id: string,
  updates: {
    status?: ReviewStatus;
  },
): Promise<AdminReview | null> {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  const updateData: ReviewUpdateData = {};

  if (updates.status && ["pending", "published", "hidden"].includes(updates.status)) {
    updateData.status = updates.status;
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error("No valid review updates were provided.");
  }

  const review = await Review.findByIdAndUpdate(
    id,
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .populate({
      path: "product",
      select: "name slug images",
    })
    .lean();

  if (!review) {
    return null;
  }

  return serializeReview(review);
}

/**
 * Delete a review permanently.
 */
export async function deleteReview(id: string): Promise<boolean> {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(id)) {
    return false;
  }

  const result = await Review.deleteOne({
    _id: id,
  });

  return result.deletedCount === 1;
}

/**
 * Get products for the admin review filter.
 *
 * This intentionally uses the existing Product model.
 */
export async function getReviewProductOptions() {
  await connectToDatabase();

  const products = await Product.find({
    status: "active",
  })
    .select("_id name slug")
    .sort({
      name: 1,
    })
    .limit(500)
    .lean();

  return products.map((product: AdminReviewProduct) => ({
    id: product._id.toString(),
    name: product.name,
    slug: product.slug,
  }));
}
