import { NextRequest, NextResponse } from "next/server";

import {
  getAdminReviews,
  getReviewProductOptions,
  type ReviewStatus,
} from "@/services/review.service";

export const dynamic = "force-dynamic";

const VALID_STATUSES: ReviewStatus[] = ["pending", "published", "hidden"];

function parsePositiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = parsePositiveInteger(searchParams.get("page"), 1);

    const limit = Math.min(parsePositiveInteger(searchParams.get("limit"), 20), 100);

    const search = searchParams.get("search")?.trim() ?? "";

    const requestedStatus = searchParams.get("status")?.trim() ?? "";

    const status = VALID_STATUSES.includes(requestedStatus as ReviewStatus)
      ? (requestedStatus as ReviewStatus)
      : "";

    const ratingValue = searchParams.get("rating");

    const parsedRating = ratingValue ? Number(ratingValue) : undefined;

    const rating =
      parsedRating && Number.isInteger(parsedRating) && parsedRating >= 1 && parsedRating <= 5
        ? parsedRating
        : undefined;

    const product = searchParams.get("product")?.trim() ?? "";

    const [reviewData, products] = await Promise.all([
      getAdminReviews({
        page,
        limit,
        search,
        status,
        rating,
        product,
      }),

      getReviewProductOptions(),
    ]);

    return NextResponse.json({
      success: true,
      ...reviewData,
      products,
    });
  } catch (error) {
    console.error("GET /api/reviews error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch reviews.",
      },
      {
        status: 500,
      },
    );
  }
}
