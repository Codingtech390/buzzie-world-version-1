import { NextRequest, NextResponse } from "next/server";

import { getAdminApiSession } from "@/lib/auth";
import { getPlaydatesSettings, savePlaydatesSettings } from "@/services/storefront-content.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getPlaydatesSettings();

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("GET /api/homepage/playdates error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load Playdates content.",
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
    const settings = await savePlaydatesSettings(body);

    return NextResponse.json({
      success: true,
      message: "Playdates content saved successfully.",
      settings,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save Playdates content.";

    console.error("PUT /api/homepage/playdates error:", error);

    const validationError =
      message.includes("required") ||
      message.includes("must be") ||
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
