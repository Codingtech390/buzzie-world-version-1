import { NextRequest, NextResponse } from "next/server";

import { getAdminApiSession } from "@/lib/auth";

import { deleteCloudinaryAsset } from "@/lib/cloudinary";

import { deleteMediaRecord, getMediaById, updateMedia } from "@/services/upload.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
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

    const { id } = await context.params;

    const media = await getMediaById(id);

    if (!media) {
      return NextResponse.json(
        {
          success: false,
          message: "Media not found.",
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
    console.error("GET /api/media/[id] error:", error);

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

export async function PATCH(request: NextRequest, context: RouteContext) {
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

    const { id } = await context.params;

    const body = await request.json();

    const media = await updateMedia(id, {
      name: typeof body?.name === "string" ? body.name : undefined,

      key: typeof body?.key === "string" ? body.key : undefined,

      slot: typeof body?.slot === "string" ? body.slot : undefined,

      alt: typeof body?.alt === "string" ? body.alt : undefined,

      title: typeof body?.title === "string" ? body.title : undefined,

      description: typeof body?.description === "string" ? body.description : undefined,

      status: body?.status === "active" || body?.status === "inactive" ? body.status : undefined,

      sortOrder: body?.sortOrder !== undefined ? Number(body.sortOrder) : undefined,
    });

    if (!media) {
      return NextResponse.json(
        {
          success: false,
          message: "Media not found.",
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
  } catch (error: any) {
    console.error("PATCH /api/media/[id] error:", error);

    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Another media item already uses this key.",
        },
        {
          status: 409,
        },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update media.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
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

    const { id } = await context.params;

    const media = await deleteMediaRecord(id);

    if (!media) {
      return NextResponse.json(
        {
          success: false,
          message: "Media not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (media.publicId) {
      try {
        await deleteCloudinaryAsset(media.publicId, media.resourceType);
      } catch (cloudinaryError) {
        console.error("Cloudinary delete failed:", cloudinaryError);

        /*
         * The database record is already removed.
         * We return success but expose the cleanup
         * warning so the admin knows what happened.
         */
        return NextResponse.json({
          success: true,
          message: "Media record deleted, but Cloudinary cleanup failed.",
          cloudinaryCleanupFailed: true,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Media deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/media/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete media.",
      },
      {
        status: 500,
      },
    );
  }
}
