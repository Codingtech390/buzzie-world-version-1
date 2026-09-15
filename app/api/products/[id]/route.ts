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

    /*
     * Load the existing product first.
     *
     * We need the existing values because PATCH requests may only
     * contain the fields that are changing.
     */
    const existingProduct = await getProductById(id);

    if (!existingProduct) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found",
        },
        { status: 404 },
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

    /*
     * Price validation
     *
     * Empty/null price is allowed for drafts.
     */
    const price =
      body.price === undefined || body.price === null || body.price === ""
        ? undefined
        : Number(body.price);

    if (price !== undefined && (!Number.isFinite(price) || price < 0)) {
      return NextResponse.json(
        {
          success: false,
          message: "Price must be a valid non-negative number",
        },
        { status: 400 },
      );
    }

    /*
     * Stock validation
     *
     * Empty/null stock is allowed for drafts.
     */
    const stock =
      body.stock === undefined || body.stock === null || body.stock === ""
        ? undefined
        : Number(body.stock);

    if (stock !== undefined && (!Number.isInteger(stock) || stock < 0)) {
      return NextResponse.json(
        {
          success: false,
          message: "Stock must be a valid non-negative integer",
        },
        { status: 400 },
      );
    }

    /*
     * Status validation
     */
    if (body.status !== undefined && !["draft", "active", "archived"].includes(body.status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid product status",
        },
        { status: 400 },
      );
    }

    /*
     * Determine the FINAL values after this PATCH.
     *
     * This is important because PATCH requests are partial.
     */
    const finalStatus = body.status !== undefined ? body.status : existingProduct.status;

    const finalPrice = body.price !== undefined ? price : existingProduct.price;

    const finalStock = body.stock !== undefined ? stock : existingProduct.stock;

    /*
     * Active products must have both price and stock.
     */
    if (finalStatus === "active") {
      if (finalPrice === undefined || finalPrice === null) {
        return NextResponse.json(
          {
            success: false,
            message: "Active products require a price",
          },
          { status: 400 },
        );
      }

      if (finalStock === undefined || finalStock === null) {
        return NextResponse.json(
          {
            success: false,
            message: "Active products require stock",
          },
          { status: 400 },
        );
      }
    }

    /*
     * Pass the original body to the service.
     *
     * The service handles normalization and preservation
     * of existing fields.
     */
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

    const status = message.startsWith("A product") ? 409 : 500;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status },
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
