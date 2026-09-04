import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function getSignature(params: Record<string, string>, apiSecret: string) {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto.createHash("sha1").update(`${sortedParams}${apiSecret}`).digest("hex");
}

export async function POST(request: NextRequest) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    const apiKey = process.env.CLOUDINARY_API_KEY;

    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          success: false,
          message: "Cloudinary environment variables are not configured",
        },
        {
          status: 500,
        },
      );
    }

    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Image file is required",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * 10 MB maximum.
     */
    const MAX_SIZE = 10 * 1024 * 1024;

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Image must be smaller than 10 MB",
        },
        {
          status: 400,
        },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          message: "Only image files are allowed",
        },
        {
          status: 400,
        },
      );
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();

    const folder = "buzzie-world/banners";

    const signature = getSignature(
      {
        folder,
        timestamp,
      },
      apiSecret,
    );

    const uploadData = new FormData();

    uploadData.append("file", file);

    uploadData.append("api_key", apiKey);

    uploadData.append("timestamp", timestamp);

    uploadData.append("folder", folder);

    uploadData.append("signature", signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: uploadData,
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Cloudinary upload error:", result);

      return NextResponse.json(
        {
          success: false,
          message: result?.error?.message || "Image upload failed",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (error) {
    console.error("POST /api/banners/upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to upload image",
      },
      {
        status: 500,
      },
    );
  }
}
