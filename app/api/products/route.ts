import { NextRequest, NextResponse } from "next/server";

import { createProduct, getProducts, type ProductSort } from "@/services/product.service";

function parsePositiveInteger(value: string | null, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

function parseSort(value: string | null): ProductSort {
  switch (value) {
    case "oldest":
    case "price-low":
    case "price-high":
    case "name-az":
    case "name-za":
      return value;

    case "newest":
    default:
      return "newest";
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = parsePositiveInteger(searchParams.get("page"), 1);

    const requestedLimit = parsePositiveInteger(searchParams.get("limit"), 20);

    const limit = Math.min(requestedLimit, 100);

    const featuredParam = searchParams.get("featured");

    const featured =
      featuredParam === null
        ? undefined
        : featuredParam === "true"
          ? true
          : featuredParam === "false"
            ? false
            : undefined;

    const result = await getProducts({
      search: searchParams.get("search") || undefined,
      category: searchParams.get("category") || undefined,
      brand: searchParams.get("brand") || undefined,
      collection: searchParams.get("collection") || undefined,
      status: searchParams.get("status") || undefined,
      featured,
      sort: parseSort(searchParams.get("sort")),
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("GET /api/products error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
        },
        { status: 400 },
      );
    }

    if (typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Product name is required",
        },
        { status: 400 },
      );
    }

    /*
     * Price and stock are optional for draft products.
     * However, an active product must have both.
     */
    const status = body.status === undefined ? "draft" : body.status;

    if (!["draft", "active", "archived"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product status",
        },
        { status: 400 },
      );
    }

    const price =
      body.price === undefined || body.price === null || body.price === ""
        ? undefined
        : Number(body.price);

    const stock =
      body.stock === undefined || body.stock === null || body.stock === ""
        ? undefined
        : Number(body.stock);

    if (price !== undefined && (!Number.isFinite(price) || price < 0)) {
      return NextResponse.json(
        {
          success: false,
          message: "Price must be a valid non-negative number",
        },
        { status: 400 },
      );
    }

    if (stock !== undefined && (!Number.isInteger(stock) || stock < 0)) {
      return NextResponse.json(
        {
          success: false,
          message: "Stock must be a valid non-negative integer",
        },
        { status: 400 },
      );
    }

    if (status === "active") {
      if (price === undefined) {
        return NextResponse.json(
          {
            success: false,
            message: "Active products require a price",
          },
          { status: 400 },
        );
      }

      if (stock === undefined) {
        return NextResponse.json(
          {
            success: false,
            message: "Active products require stock",
          },
          { status: 400 },
        );
      }
    }

    const product = await createProduct({
      ...body,
      status,
      price,
      stock,
    });

    return NextResponse.json(
      {
        success: true,
        product,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/products error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create product",
      },
      { status: 500 },
    );
  }
}
