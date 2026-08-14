import { NextRequest, NextResponse } from "next/server";

import { getProductBySlug } from "@/services/product.service";

interface ProductSlugRouteContext {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(_request: NextRequest, context: ProductSlugRouteContext) {
  try {
    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Product slug is required",
        },
        { status: 400 },
      );
    }

    const product = await getProductBySlug(slug);

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
    console.error("GET /api/products/slug/[slug] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch product",
      },
      { status: 500 },
    );
  }
}
