import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongoose";
import { Banner, type IBanner } from "@/models/Banner";


function serializeBanner(banner: IBanner) {
 return {
   id: banner._id?.toString() ?? "",
   name: banner.name ?? "",
   headline: banner.headline ?? "",
   subheadline: banner.subheadline ?? "",
   image: banner.image ?? "",
   mobileImage: banner.mobileImage ?? "",
   ctaText: banner.ctaText ?? "",
   ctaLink: banner.ctaLink ?? "",
   position: Number(banner.position ?? 0),
   isActive: Boolean(banner.isActive),
   featured: Boolean(banner.featured),
   startDate: banner.startDate ? banner.startDate.toISOString() : null,
   endDate: banner.endDate ? banner.endDate.toISOString() : null,
   createdAt: banner.createdAt ? banner.createdAt.toISOString() : null,
   updatedAt: banner.updatedAt ? banner.updatedAt.toISOString() : null,
 };
}

/*
 * GET /api/banners
 *
 * Admin:
 * returns all banners.
 *
 * Optional:
 * ?search=diwali
 * ?status=active
 * ?status=inactive
 * ?featured=yes
 * ?featured=no
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";

    const status = searchParams.get("status")?.trim() || "all";

    const featured = searchParams.get("featured")?.trim() || "all";

  const filter: Record<string, unknown> = {};

    if (status === "active") {
      filter.isActive = true;
    }

    if (status === "inactive") {
      filter.isActive = false;
    }

    if (featured === "yes") {
      filter.featured = true;
    }

    if (featured === "no") {
      filter.featured = false;
    }

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const regex = new RegExp(escapedSearch, "i");

      filter.$or = [
        {
          name: regex,
        },
        {
          headline: regex,
        },
        {
          subheadline: regex,
        },
      ];
    }

    const banners = await Banner.find(filter)
      .sort({
        position: 1,
        createdAt: -1,
      })
      .lean();

    return NextResponse.json({
      success: true,
      banners: banners.map(serializeBanner),
    });
  } catch (error) {
    console.error("GET /api/banners error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch banners",
      },
      {
        status: 500,
      },
    );
  }
}

/*
 * POST /api/banners
 *
 * Creates a new campaign/banner.
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid banner data",
        },
        {
          status: 400,
        },
      );
    }

    if (typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Campaign name is required",
        },
        {
          status: 400,
        },
      );
    }

    if (typeof body.headline !== "string" || !body.headline.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Banner headline is required",
        },
        {
          status: 400,
        },
      );
    }

    if (typeof body.image !== "string" || !body.image.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Banner image is required",
        },
        {
          status: 400,
        },
      );
    }

    const banner = await Banner.create({
      name: body.name.trim(),

      headline: body.headline.trim(),

      subheadline: typeof body.subheadline === "string" ? body.subheadline.trim() : "",

      image: body.image.trim(),

      mobileImage: typeof body.mobileImage === "string" ? body.mobileImage.trim() : "",

      ctaText: typeof body.ctaText === "string" ? body.ctaText.trim() : "",

      ctaLink: typeof body.ctaLink === "string" ? body.ctaLink.trim() : "",

      position: Number.isFinite(Number(body.position)) ? Number(body.position) : 0,

      isActive: typeof body.isActive === "boolean" ? body.isActive : true,

      featured: typeof body.featured === "boolean" ? body.featured : false,

      startDate: body.startDate ? new Date(body.startDate) : undefined,

      endDate: body.endDate ? new Date(body.endDate) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        banner: serializeBanner(banner),
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST /api/banners error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create banner",
      },
      {
        status: 500,
      },
    );
  }
}

/*
 * PATCH /api/banners
 *
 * Updates any banner property.
 */
export async function PATCH(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();

    const id = typeof body?.id === "string" ? body.id.trim() : "";

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Banner ID is required",
        },
        {
          status: 400,
        },
      );
    }

const update: Record<string, unknown> = {};

    if (typeof body.name === "string") {
      if (!body.name.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: "Campaign name cannot be empty",
          },
          {
            status: 400,
          },
        );
      }

      update.name = body.name.trim();
    }

    if (typeof body.headline === "string") {
      update.headline = body.headline.trim();
    }

    if (typeof body.subheadline === "string") {
      update.subheadline = body.subheadline.trim();
    }

    if (typeof body.image === "string") {
      update.image = body.image.trim();
    }

    if (typeof body.mobileImage === "string") {
      update.mobileImage = body.mobileImage.trim();
    }

    if (typeof body.ctaText === "string") {
      update.ctaText = body.ctaText.trim();
    }

    if (typeof body.ctaLink === "string") {
      update.ctaLink = body.ctaLink.trim();
    }

    if (body.position !== undefined && Number.isFinite(Number(body.position))) {
      update.position = Number(body.position);
    }

    if (typeof body.isActive === "boolean") {
      update.isActive = body.isActive;
    }

    if (typeof body.featured === "boolean") {
      update.featured = body.featured;
    }

    if (body.startDate !== undefined) {
      update.startDate = body.startDate ? new Date(body.startDate) : null;
    }

    if (body.endDate !== undefined) {
      update.endDate = body.endDate ? new Date(body.endDate) : null;
    }

    const banner = await Banner.findByIdAndUpdate(
      id,
      {
        $set: update,
      },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    if (!banner) {
      return NextResponse.json(
        {
          success: false,
          message: "Banner not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      banner: serializeBanner(banner),
    });
  } catch (error) {
    console.error("PATCH /api/banners error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update banner",
      },
      {
        status: 500,
      },
    );
  }
}

/*
 * DELETE /api/banners?id=...
 */
export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id")?.trim() || "";

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Banner ID is required",
        },
        {
          status: 400,
        },
      );
    }

    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return NextResponse.json(
        {
          success: false,
          message: "Banner not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/banners error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete banner",
      },
      {
        status: 500,
      },
    );
  }
}
