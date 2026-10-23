import { NextRequest, NextResponse } from "next/server";

import { getAdminApiSession } from "@/lib/auth";
import { getDealSettings, saveDealSettings } from "@/services/storefront-content.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getDealSettings();

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("GET /api/homepage/deals error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load Crazy Deals.",
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
    const settings = await saveDealSettings(body);

    return NextResponse.json({
      success: true,
      message: "Crazy Deals settings saved successfully.",
      settings,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save Crazy Deals.";

    console.error("PUT /api/homepage/deals error:", error);

    const validationError =
      message.includes("required") ||
      message.includes("must be") ||
      message.includes("invalid") ||
      message.includes("between") ||
      message.includes("maximum") ||
      message.includes("only appear") ||
      message.includes("no longer exist") ||
      message.includes("Enable at least") ||
      message.includes("discount") ||
      message.includes("characters") ||
      message.includes("Add an image");

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: validationError ? 400 : 500 },
    );
  }
}
