import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedApiSession } from "@/lib/auth";
import {
  createCustomerReview,
  getCustomerReviews,
  getReviewableProducts,
} from "@/services/customer-review.service";

import { getAdminApiSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function requireCustomerSession() {
  const session = await getAuthenticatedApiSession();

  if (!session?.user?.id || session.user.role !== "customer") {
    return null;
  }

  return session;
}

/**
 * GET /api/account/reviews
 *
 * Returns:
 * - customer's own reviews
 * - products the customer can still review
 */
export async function GET() {
  try {
    const session = await requireCustomerSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer authentication required.",
        },
        { status: 401 },
      );
    }

    const [reviews, products] = await Promise.all([
      getCustomerReviews(session.user.id),
      getReviewableProducts(session.user.id),
    ]);

    return NextResponse.json({
      success: true,
      reviews,
      products,
    });
  } catch (error) {
    console.error("GET /api/account/reviews error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch customer reviews.",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/account/reviews
 */
export async function POST(request: NextRequest) {
  try {
    const session = await requireCustomerSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer authentication required.",
        },
        { status: 401 },
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON body.",
        },
        { status: 400 },
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
        },
        { status: 400 },
      );
    }

    const payload = body as {
      productId?: unknown;
      rating?: unknown;
      title?: unknown;
      comment?: unknown;
    };

    if (typeof payload.productId !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Product is required.",
        },
        { status: 400 },
      );
    }

    if (typeof payload.rating !== "number") {
      return NextResponse.json(
        {
          success: false,
          message: "Rating is required.",
        },
        { status: 400 },
      );
    }

    if (typeof payload.comment !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Review comment is required.",
        },
        { status: 400 },
      );
    }

    const review = await createCustomerReview(session.user.id, {
      productId: payload.productId,
      rating: payload.rating,
      title: typeof payload.title === "string" ? payload.title : undefined,
      comment: payload.comment,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Review submitted for moderation.",
        review,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/account/reviews error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to submit review.",
      },
      { status: 400 },
    );
  }
}
