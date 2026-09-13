import { NextRequest, NextResponse } from "next/server";

import { getMediaByKey } from "@/services/upload.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const key = searchParams.get("key")?.trim() || "";

    if (!key) {
      return NextResponse.json(
        {
          success: false,
          message: "Media key is required.",
        },
        {
          status: 400,
        },
      );
    }

    const media = await getMediaByKey(key);

    if (!media) {
      return NextResponse.json(
        {
          success: false,
          message: "Active media not found.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      media,
    });
  } catch (error) {
    console.error("GET /api/media/public error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch media.",
      },
      {
        status: 500,
      },
    );
  }
}
