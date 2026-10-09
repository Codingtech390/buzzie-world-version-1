import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedApiSession } from "@/lib/auth";
import { addToWishlist, getCustomerWishlist } from "@/services/wishlist.service";

export async function GET() {
  try {
    const session = await getAuthenticatedApiSession();

    if (session?.user?.role !== "customer") {
      return NextResponse.json(
        {
          success: false,
          message: "Customer authentication required.",
        },
        { status: 401 },
      );
    }

    const wishlist = await getCustomerWishlist(session.user.id);

    return NextResponse.json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error("GET /api/account/wishlist error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to load wishlist.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthenticatedApiSession();

    if (session?.user?.role !== "customer") {
      return NextResponse.json(
        {
          success: false,
          message: "Customer authentication required.",
        },
        { status: 401 },
      );
    }

    const body = await request.json();

    if (typeof body.productId !== "string" || !body.productId.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required.",
        },
        { status: 400 },
      );
    }

    const item = await addToWishlist(session.user.id, body.productId);

    return NextResponse.json(
      {
        success: true,
        message: "Product added to wishlist.",
        item,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/account/wishlist error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to add product to wishlist.",
      },
      { status: 500 },
    );
  }
}
