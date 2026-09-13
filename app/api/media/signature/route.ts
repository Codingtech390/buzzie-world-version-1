import { NextRequest, NextResponse } from "next/server";

import { getAdminApiSession } from "@/lib/auth";

import { signCloudinaryParams } from "@/lib/cloudinary";

const ALLOWED_RESOURCE_TYPES = ["image", "video"] as const;

function isAllowedFolder(folder: unknown) {
  if (typeof folder !== "string") {
    return false;
  }

  return /^buzzie-world\/[a-zA-Z0-9/_-]+$/.test(folder);
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminApiSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin authentication required.",
        },
        {
          status: 401,
        },
      );
    }

    const body = await request.json();

    const paramsToSign = body?.paramsToSign;

    if (!paramsToSign || typeof paramsToSign !== "object" || Array.isArray(paramsToSign)) {
      return NextResponse.json(
        {
          success: false,
          message: "paramsToSign is required.",
        },
        {
          status: 400,
        },
      );
    }

    const folder = paramsToSign.folder;

    const resourceType = paramsToSign.resource_type;

    if (!isAllowedFolder(folder)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Cloudinary folder.",
        },
        {
          status: 400,
        },
      );
    }

    if (resourceType && !ALLOWED_RESOURCE_TYPES.includes(resourceType)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Cloudinary resource type.",
        },
        {
          status: 400,
        },
      );
    }

    const sanitizedParams: Record<string, string | number> = {};

    for (const [key, value] of Object.entries(paramsToSign)) {
      if (typeof value === "string" || typeof value === "number") {
        sanitizedParams[key] = value;
      }
    }

    const signature = signCloudinaryParams(sanitizedParams);

    return NextResponse.json({
      signature,
    });
  } catch (error) {
    console.error("POST /api/media/signature error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate Cloudinary signature.",
      },
      {
        status: 500,
      },
    );
  }
}
