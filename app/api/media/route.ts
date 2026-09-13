import { NextRequest, NextResponse } from "next/server";

import { getAdminApiSession } from "@/lib/auth";

import { createMedia, getAdminMedia } from "@/services/upload.service";

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page")) || 1;

    const limit = Number(searchParams.get("limit")) || 20;

    const search = searchParams.get("search") || "";

    const resourceType = searchParams.get("resourceType") || "";

    const status = searchParams.get("status") || "";

    const result = await getAdminMedia({
      page,
      limit,
      search,
      resourceType,
      status,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("GET /api/media error:", error);

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

    const name = typeof body?.name === "string" ? body.name.trim() : "";

    const key = typeof body?.key === "string" ? body.key.trim().toLowerCase() : "";

    const resourceType = body?.resourceType;

    const secureUrl = typeof body?.secureUrl === "string" ? body.secureUrl.trim() : "";

    const url = typeof body?.url === "string" ? body.url.trim() : secureUrl;

    const publicId = typeof body?.publicId === "string" ? body.publicId.trim() : "";

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Media name is required.",
        },
        {
          status: 400,
        },
      );
    }

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

    if (!["image", "video", "raw"].includes(resourceType)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid media resource type.",
        },
        {
          status: 400,
        },
      );
    }

    if (!secureUrl || !publicId) {
      return NextResponse.json(
        {
          success: false,
          message: "Cloudinary URL and public ID are required.",
        },
        {
          status: 400,
        },
      );
    }

    const media = await createMedia({
      name,
      key,
      slot: typeof body?.slot === "string" ? body.slot.trim() : undefined,
      resourceType,
      url,
      secureUrl,
      publicId,
      folder: typeof body?.folder === "string" ? body.folder.trim() : undefined,
      format: typeof body?.format === "string" ? body.format.trim() : undefined,
      mimeType: typeof body?.mimeType === "string" ? body.mimeType.trim() : undefined,
      bytes: typeof body?.bytes === "number" ? body.bytes : undefined,
      width: typeof body?.width === "number" ? body.width : undefined,
      height: typeof body?.height === "number" ? body.height : undefined,
      duration: typeof body?.duration === "number" ? body.duration : undefined,
      thumbnailUrl: typeof body?.thumbnailUrl === "string" ? body.thumbnailUrl.trim() : undefined,
      alt: typeof body?.alt === "string" ? body.alt.trim() : undefined,
      title: typeof body?.title === "string" ? body.title.trim() : undefined,
      description: typeof body?.description === "string" ? body.description.trim() : undefined,
      status: body?.status === "inactive" ? "inactive" : "active",
      sortOrder: Number.isFinite(Number(body?.sortOrder)) ? Number(body.sortOrder) : 0,
      createdBy: session.user.id,
    });

    return NextResponse.json(
      {
        success: true,
        media,
      },
      {
        status: 201,
      },
    );
  } catch (error: any) {
    console.error("POST /api/media error:", error);

    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "A media item with this key already exists.",
        },
        {
          status: 409,
        },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create media.",
      },
      {
        status: 500,
      },
    );
  }
}
