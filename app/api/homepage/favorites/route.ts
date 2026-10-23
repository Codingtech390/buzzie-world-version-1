import { NextRequest, NextResponse } from "next/server";

import { getAdminApiSession } from "@/lib/auth";
import {
  getHomepageFavoriteProductIds,
  getHomepageFavoriteProducts,
  getHomepageFavoriteSectionEnabled,
  saveHomepageFavoriteProductIds,
  saveHomepageFavoriteSectionEnabled,
} from "@/services/homepage.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [productIds, products, isFavoriteSectionEnabled] = await Promise.all([
      getHomepageFavoriteProductIds(),
      getHomepageFavoriteProducts(),
      getHomepageFavoriteSectionEnabled(),
    ]);

    return NextResponse.json({
      success: true,
      productIds,
      products,
      isFavoriteSectionEnabled,
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

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid request body is required.",
        },
        { status: 400 },
      );
    }

    const payload = body as Record<string, unknown>;

    const hasProductIds = Object.prototype.hasOwnProperty.call(payload, "productIds");

    const hasVisibility = Object.prototype.hasOwnProperty.call(payload, "isFavoriteSectionEnabled");

    if (!hasProductIds && !hasVisibility) {
      return NextResponse.json(
        {
          success: false,
          message: "Provide productIds or isFavoriteSectionEnabled.",
        },
        { status: 400 },
      );
    }

    const result: {
      success: true;
      message: string;
      productIds?: string[];
      isFavoriteSectionEnabled?: boolean;
    } = {
      success: true,
      message: "Homepage highlights updated successfully.",
    };

    if (hasProductIds) {
      result.productIds = await saveHomepageFavoriteProductIds(payload.productIds);
    }

    if (hasVisibility) {
      result.isFavoriteSectionEnabled = await saveHomepageFavoriteSectionEnabled(
        payload.isFavoriteSectionEnabled,
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update homepage highlights.";

    const status =
      message.includes("invalid") ||
      message.includes("maximum") ||
      message.includes("array") ||
      message.includes("more than once") ||
      message.includes("no longer exist") ||
      message.includes("must be a boolean")
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
