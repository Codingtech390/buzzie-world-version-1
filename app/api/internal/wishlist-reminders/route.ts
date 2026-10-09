import { NextRequest, NextResponse } from "next/server";

import { processWishlistReminders } from "@/services/wishlist-reminder.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const cronSecret = process.env.WISHLIST_REMINDER_CRON_SECRET;

    if (!cronSecret) {
      console.error("WISHLIST_REMINDER_CRON_SECRET is not configured.");

      return NextResponse.json(
        {
          success: false,
          message: "Cron secret is not configured.",
        },
        { status: 500 },
      );
    }

    const authorization = request.headers.get("authorization");

    if (!authorization) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    const expectedAuthorization = `Bearer ${cronSecret}`;

    if (authorization !== expectedAuthorization) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 },
      );
    }

    const summary = await processWishlistReminders();

    return NextResponse.json({
      success: true,
      ...summary,
    });
  } catch (error) {
    console.error("GET /api/internal/wishlist-reminders error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to process wishlist reminders.",
      },
      { status: 500 },
    );
  }
}
