import { NextRequest, NextResponse } from "next/server";

import { getAdminApiSession } from "@/lib/auth";
import { signCloudinaryParams } from "@/lib/cloudinary";

const ALLOWED_RESOURCE_TYPES = ["image", "video"] as const;

type AllowedResourceType = (typeof ALLOWED_RESOURCE_TYPES)[number];

function isAllowedFolder(folder: unknown): folder is string {
  if (typeof folder !== "string") {
    return false;
  }

  /*
   * Only allow assets inside our BuzzieWorld Cloudinary namespace.
   *
   * Examples:
   *   buzzie-world/products
   *   buzzie-world/products/brain-binder
   *   buzzie-world/products/brain-binder/gallery
   */
  return /^buzzie-world\/[a-zA-Z0-9/_-]+$/.test(folder);
}

function isValidPublicId(publicId: unknown): publicId is string {
  if (publicId === undefined) {
    return true;
  }

  if (typeof publicId !== "string") {
    return false;
  }

  if (!publicId.trim()) {
    return false;
  }

  /*
   * Keep public IDs predictable and prevent arbitrary paths.
   */
  return /^[a-zA-Z0-9/_-]+$/.test(publicId);
}

function isValidResourceType(resourceType: unknown): resourceType is AllowedResourceType {
  return (
    resourceType === undefined ||
    ALLOWED_RESOURCE_TYPES.includes(resourceType as AllowedResourceType)
  );
}

export async function POST(request: NextRequest) {
  try {
    /*
     * ---------------------------------------------------------
     * 1. Admin authentication
     * ---------------------------------------------------------
     */
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

    /*
     * ---------------------------------------------------------
     * 2. Parse request
     * ---------------------------------------------------------
     */
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
    const publicId = paramsToSign.public_id;

    /*
     * ---------------------------------------------------------
     * 3. Validate folder
     * ---------------------------------------------------------
     */
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

    /*
     * ---------------------------------------------------------
     * 4. Validate resource type
     * ---------------------------------------------------------
     */
    if (!isValidResourceType(resourceType)) {
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

    /*
     * ---------------------------------------------------------
     * 5. Validate public ID
     * ---------------------------------------------------------
     */
    if (!isValidPublicId(publicId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Cloudinary public ID.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * ---------------------------------------------------------
     * 6. Validate Cloudinary environment
     * ---------------------------------------------------------
     */
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;

    if (!cloudName || !apiKey) {
      console.error(
        "Cloudinary configuration is missing CLOUDINARY_CLOUD_NAME or CLOUDINARY_API_KEY.",
      );

      return NextResponse.json(
        {
          success: false,
          message: "Cloudinary is not configured correctly.",
        },
        {
          status: 500,
        },
      );
    }

    /*
     * ---------------------------------------------------------
     * 7. Generate the timestamp on the SERVER
     * ---------------------------------------------------------
     *
     * This prevents the browser from controlling the timestamp
     * used in the signature.
     */
    const timestamp = Math.floor(Date.now() / 1000);

    /*
     * ---------------------------------------------------------
     * 8. Build the exact parameters Cloudinary will receive
     * ---------------------------------------------------------
     *
     * Only parameters that need signing are included here.
     *
     * resource_type is used in the upload endpoint and does not
     * need to be included in the signed upload parameters.
     */
    const sanitizedParams: Record<string, string | number> = {
      folder,
      timestamp,
    };

    if (publicId) {
      sanitizedParams.public_id = publicId;
    }

    /*
     * ---------------------------------------------------------
     * 9. Generate Cloudinary signature
     * ---------------------------------------------------------
     */
    const signature = signCloudinaryParams(sanitizedParams);

    /*
     * ---------------------------------------------------------
     * 10. Return ONLY safe client-side Cloudinary information
     * ---------------------------------------------------------
     *
     * IMPORTANT:
     * CLOUDINARY_API_SECRET is NEVER returned.
     */
    return NextResponse.json({
      success: true,
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder,
      resourceType: resourceType ?? "image",
      publicId: publicId ?? null,
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
