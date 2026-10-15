// app/api/media/upload/route.ts

import { NextRequest, NextResponse } from "next/server";

import { MEDIA_CONFIG } from "@/config/media";
import { getAdminApiSession } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";
import { saveLocalImage } from "@/lib/media-storage";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);



function getAllowedFolder(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const folder = value.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");

  const allowed =
    /^buzzie-world\/(?:products(?:\/[a-z0-9][a-z0-9-]{0,79}(?:\/(?:gallery|a-plus|how-to-play))?)?|banners|categories|brands|homepage)$/.test(
      folder,
    );

  return allowed ? folder : null;
}



function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function getCloudinaryFolder(folder: string): string {
  // Preserve the allowed, normalized BuzzieWorld folder.
  return folder;
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
        { status: 401 },
      );
    }

    const formData = await request.formData();

    const file = formData.get("file");
    const requestedFolder = formData.get("folder");
    const altValue = formData.get("alt");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "An image file is required." },
        { status: 400 },
      );
    }

    if (file.size <= 0) {
      return NextResponse.json(
        { success: false, message: "The selected image is empty." },
        { status: 400 },
      );
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { success: false, message: "Image size must be 10 MB or smaller." },
        { status: 413 },
      );
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only JPEG, PNG, WEBP, and AVIF images are supported.",
        },
        { status: 400 },
      );
    }

    const folder = getAllowedFolder(requestedFolder);

    if (!folder) {
      return NextResponse.json(
        { success: false, message: "The requested media folder is not allowed." },
        { status: 400 },
      );
    }

    const alt = typeof altValue === "string" ? altValue.trim().slice(0, 500) : "";

    if (MEDIA_CONFIG.storageProvider === "local") {
      const saved = await saveLocalImage(file, folder);

      return NextResponse.json(
        {
          success: true,
          provider: "local",
          url: saved.url,
          secureUrl: saved.url,
          publicId: saved.publicId,
          folder: saved.folder,
          format: saved.format,
          mimeType: saved.mimeType,
          bytes: saved.bytes,
          alt: alt || undefined,
        },
        { status: 201 },
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        {
          success: false,
          message: "Cloudinary is selected but its environment variables are not configured.",
        },
        { status: 500 },
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    const bytes = Buffer.from(await file.arrayBuffer());
    const base64 = bytes.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const safeFolder = getCloudinaryFolder(folder);

    const originalName = file.name.replace(/\.[^/.]+$/, "");
    const safeName = slugify(originalName) || "product-image";

    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
      format?: string;
      bytes?: number;
      width?: number;
      height?: number;
      resource_type?: string;
    }>((resolve, reject) => {
      cloudinary.uploader.upload(
        dataUri,
        {
          folder: safeFolder,
          resource_type: "image",
          type: "upload",
          use_filename: false,
          unique_filename: true,
          filename_override: safeName,
        },
        (error, result) => {
          if (error || !result?.secure_url || !result.public_id) {
            reject(error ?? new Error("Cloudinary returned an incomplete upload result."));
            return;
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            bytes: result.bytes,
            width: result.width,
            height: result.height,
            resource_type: result.resource_type,
          });
        },
      );
    });

    return NextResponse.json(
      {
        success: true,
        provider: "cloudinary",
        url: uploadResult.secure_url,
        secureUrl: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        folder: safeFolder,
        format: uploadResult.format,
        mimeType: file.type,
        bytes: uploadResult.bytes,
        width: uploadResult.width,
        height: uploadResult.height,
        resourceType: uploadResult.resource_type,
        alt: alt || undefined,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Media upload failed:", error);

    const message = error instanceof Error ? error.message : "Unable to upload the image.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 },
    );
  }
}
