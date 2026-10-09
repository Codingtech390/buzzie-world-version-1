import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedApiSession } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import Wishlist from "@/models/Wishlist";
import WishlistReminder from "@/models/WishlistReminder";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
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

    const { id } = await context.params;

    await connectToDatabase();

    const result = await Wishlist.deleteOne({
      _id: id,
      user: session.user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Wishlist item not found.",
        },
        { status: 404 },
      );
    }

    await WishlistReminder.updateOne(
      {
        wishlist: id,
        user: session.user.id,
      },
      {
        $set: {
          status: "cancelled",
        },
      },
    );

    return NextResponse.json({
      success: true,
      message: "Product removed from wishlist.",
    });
  } catch (error) {
    console.error("DELETE /api/account/wishlist/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to remove wishlist item.",
      },
      { status: 500 },
    );
  }
}
