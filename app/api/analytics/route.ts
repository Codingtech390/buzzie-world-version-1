import { NextRequest, NextResponse } from "next/server";

import { getAdminAnalytics, type AnalyticsRange } from "@/services/analytics.service";

const VALID_RANGES: AnalyticsRange[] = ["7d", "30d", "90d", "1y"];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const requestedRange = searchParams.get("range") ?? "30d";

    const range: AnalyticsRange = VALID_RANGES.includes(requestedRange as AnalyticsRange)
      ? (requestedRange as AnalyticsRange)
      : "30d";

    const analytics = await getAdminAnalytics(range);

    return NextResponse.json({
      success: true,
      data: analytics,
      range,
    });
  } catch (error) {
    console.error("GET /api/analytics error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch analytics",
      },
      {
        status: 500,
      },
    );
  }
}
