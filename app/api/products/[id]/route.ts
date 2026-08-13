import { NextRequest, NextResponse } from "next/server";

import { deleteProduct, getProductById, updateProduct } from "@/services/product.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch product",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
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

    if (body.name !== undefined && (typeof body.name !== "string" || !body.name.trim())) {
      return NextResponse.json(
        {
          success: false,
          message: "Product name cannot be empty",
        },
        { status: 400 },
      );
    }

    if (
      body.description !== undefined &&
      (typeof body.description !== "string" || !body.description.trim())
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Product description is required",
        },
        { status: 400 },
      );
    }

    if (
      body.price !== undefined &&
      (!Number.isFinite(Number(body.price)) || Number(body.price) < 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Price must be a valid non-negative number",
        },
        { status: 400 },
      );
    }

    if (
      body.stock !== undefined &&
      (!Number.isInteger(Number(body.stock)) || Number(body.stock) < 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Stock must be a valid non-negative integer",
        },
        { status: 400 },
      );
    }

    if (body.status !== undefined && !["draft", "active", "archived"].includes(body.status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product status",
        },
        { status: 400 },
      );
    }

    const product = await updateProduct(id, body);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("PATCH /api/products/[id] error:", error);

    const message =
      error instanceof Error && error.message.includes("duplicate key")
        ? "A product with this slug or SKU already exists"
        : "Failed to update product";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const product = await deleteProduct(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete product",
      },
      { status: 500 },
    );
  }
}
