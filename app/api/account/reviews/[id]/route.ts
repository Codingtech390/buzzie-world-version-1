import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedApiSession } from "@/lib/auth";
import { deleteCustomerReview, updateCustomerReview } from "@/services/customer-review.service";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

async function requireCustomerSession() {
  const session = await getAuthenticatedApiSession();

  if (!session?.user?.id || session.user.role !== "customer") {
    return null;
  }

  return session;
}

/**
 * PATCH /api/account/reviews/[id]
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
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
      rating?: unknown;
      title?: unknown;
      comment?: unknown;
    };

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

    const review = await updateCustomerReview(session.user.id, id, {
      rating: payload.rating,
      title: typeof payload.title === "string" ? payload.title : undefined,
      comment: payload.comment,
    });

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          message: "Review not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Review updated and sent for moderation.",
      review,
    });
  } catch (error) {
    console.error("PATCH /api/account/reviews/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update review.",
      },
      { status: 400 },
    );
  }
}

/**
 * DELETE /api/account/reviews/[id]
 */
export async function DELETE(_request: NextRequest, context: RouteContext) {
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

    const { id } = await context.params;

    const deleted = await deleteCustomerReview(session.user.id, id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Review not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/account/reviews/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete review.",
      },
      { status: 400 },
    );
  }
}
