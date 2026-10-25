import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { getProducts, type ProductSort } from "@/services/product.service";
import type { SortOrder } from "mongoose";
export const dynamic = "force-dynamic";

const PUBLIC_FILTER = {
  published: true,
  status: "active",
} as const;

function parsePositiveInteger(value: string | null, fallback: number): number {
  if (!value) return fallback;

  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseSort(value: string | null): ProductSort {
  switch (value) {
    case "newest":
    case "oldest":
    case "price-low":
    case "price-high":
    case "name-az":
    case "name-za":
    case "relevance":
      return value;

    default:
      return "relevance";
  }
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getFallbackSort(sort: ProductSort): Record<string, SortOrder> {
  switch (sort) {
    case "oldest":
      return { createdAt: 1, _id: 1 };

    case "price-low":
      return { price: 1, _id: 1 };

    case "price-high":
      return { price: -1, _id: 1 };

    case "name-az":
      return { name: 1, _id: 1 };

    case "name-za":
      return { name: -1, _id: 1 };

    case "newest":
    case "relevance":
    default:
      return { createdAt: -1, _id: 1 };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = (searchParams.get("search") ?? "").trim().replace(/\s+/g, " ");

    const page = parsePositiveInteger(searchParams.get("page"), 1);
    const limit = Math.min(parsePositiveInteger(searchParams.get("limit"), 12), 24);
    const sort = parseSort(searchParams.get("sort"));

    const emptyResponse = () =>
      NextResponse.json(
        {
          success: true,
          products: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );

    if (!search) {
      return emptyResponse();
    }

    if (search.length > 120) {
      return NextResponse.json(
        {
          success: false,
          message: "Search query must be 120 characters or fewer.",
        },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    // First, use the existing MongoDB text search and relevance ranking.
    const result = await getProducts({
      search,
      sort,
      page,
      limit,
      ...PUBLIC_FILTER,
    });

    // Preserve the existing search behavior whenever it finds results.
    if (result.products.length > 0) {
      return NextResponse.json(
        {
          success: true,
          products: result.products,
          pagination: result.pagination,
        },
        {
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    // Avoid broad fallback scans for one-character searches.
    if (search.length < 2) {
      return emptyResponse();
    }

    await connectToDatabase();

    // Each query word must match the beginning of a word in at least
    // one searchable product field. For example, "toddler busy"
    // matches "Toddler Busy Binder".
    const words = search.toLowerCase().split(/\s+/).filter(Boolean);

    const wordConditions = words.map((word) => {
      const prefixRegex = new RegExp(`(?:^|[^a-z0-9])${escapeRegex(word)}`, "i");

      return {
        $or: [
          { name: prefixRegex },
          { description: prefixRegex },
          { shortDescription: prefixRegex },
          { sku: prefixRegex },
        ],
      };
    });

    const fallbackQuery = {
      ...PUBLIC_FILTER,
      $and: wordConditions,
    };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(fallbackQuery)
        .populate("category", "name slug")
        .populate("brand", "name slug")
        .populate("collection", "name slug")
        .sort(getFallbackSort(sort))
        .skip(skip)
        .limit(limit)
        .lean(),

      Product.countDocuments(fallbackQuery),
    ]);

    return NextResponse.json(
      {
        success: true,
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (error) {
    console.error("GET /api/search/products error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load search results. Please try again.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
