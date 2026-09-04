import { NextRequest, NextResponse } from "next/server";

import {
  deleteReview,
  getReviewById,
  updateReview,
  type ReviewStatus,
} from "@/services/review.service";

export const dynamic = "force-dynamic";

const VALID_STATUSES: ReviewStatus[] = ["pending", "published", "hidden"];

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const review = await getReviewById(id);

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          message: "Review not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("GET /api/reviews/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch review.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON body.",
        },
        {
          status: 400,
        },
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
        },
        {
          status: 400,
        },
      );
    }

    const status = (
      body as {
        status?: unknown;
      }
    ).status;

    if (typeof status !== "string" || !VALID_STATUSES.includes(status as ReviewStatus)) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid review status is required.",
        },
        {
          status: 400,
        },
      );
    }

    const review = await updateReview(id, {
      status: status as ReviewStatus,
    });

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          message: "Review not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Review updated successfully.",
      review,
    });
  } catch (error) {
    console.error("PATCH /api/reviews/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update review.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const deleted = await deleteReview(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Review not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/reviews/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete review.",
      },
      {
        status: 500,
      },
    );
  }
}
