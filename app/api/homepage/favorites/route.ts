import { NextRequest, NextResponse } from "next/server";

import { getAdminApiSession } from "@/lib/auth";
import {
  getHomepageFavoriteProductIds,
  getHomepageFavoriteProducts,
  saveHomepageFavoriteProductIds,
} from "@/services/homepage.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [productIds, products] = await Promise.all([
      getHomepageFavoriteProductIds(),
      getHomepageFavoriteProducts(),
    ]);

    return NextResponse.json({
      success: true,
      productIds,
      products,
    });
  } catch (error) {
    console.error("GET /api/homepage/favorites error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load homepage highlights.",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getAdminApiSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin authentication required.",
        },
        { status: 401 },
      );
    }

    const body: unknown = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      !("productIds" in body)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Provide a productIds array.",
        },
        { status: 400 },
      );
    }

    const productIds = await saveHomepageFavoriteProductIds(
      (body as { productIds: unknown }).productIds,
    );

    return NextResponse.json({
      success: true,
      message: "Homepage highlights saved successfully.",
      productIds,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to save homepage highlights.";

    const status =
      message.includes("invalid") ||
      message.includes("maximum") ||
      message.includes("array") ||
      message.includes("more than once") ||
      message.includes("no longer exist")
        ? 400
        : 500;

    console.error("PUT /api/homepage/favorites error:", error);

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status },
    );
  }
}
