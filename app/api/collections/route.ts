import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongoose";
import { Collection } from "@/models/Collection";
import { createSlug } from "@/lib/slug";

function serializeCollection(collection: any) {
  return {
    id: collection._id?.toString() ?? "",
    name: collection.name ?? "",
    slug: collection.slug ?? "",
    description: collection.description ?? "",
    image: collection.image ?? "",
    isActive: Boolean(collection.isActive),
    featured: Boolean(collection.featured),
    sortOrder: Number(collection.sortOrder ?? 0),
    createdAt: collection.createdAt ? new Date(collection.createdAt).toISOString() : null,
    updatedAt: collection.updatedAt ? new Date(collection.updatedAt).toISOString() : null,
  };
}

/**
 * GET /api/collections
 *
 * Admin collection list.
 *
 * Supported query parameters:
 * ?search=summer
 * ?status=all
 * ?status=active
 * ?status=inactive
 * ?featured=all
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

    const filter: Record<string, any> = {};

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

      const searchRegex = new RegExp(escapedSearch, "i");

      filter.$or = [
        {
          name: searchRegex,
        },
        {
          slug: searchRegex,
        },
        {
          description: searchRegex,
        },
      ];
    }

    const collections = await Collection.find(filter)
      .sort({
        sortOrder: 1,
        name: 1,
      })
      .lean();

    return NextResponse.json({
      success: true,
      collections: collections.map(serializeCollection),
    });
  } catch (error) {
    console.error("GET /api/collections error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch collections",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * POST /api/collections
 *
 * Create a collection.
 */
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();

    if (!body || typeof body !== "object" || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Collection name is required",
        },
        {
          status: 400,
        },
      );
    }

    const collection = await Collection.create({
      ...body,

      name: body.name.trim(),

      slug:
        typeof body.slug === "string" && body.slug.trim()
          ? body.slug.trim()
          : createSlug(String(body.name)),

      description: typeof body.description === "string" ? body.description.trim() : "",

      image: typeof body.image === "string" ? body.image.trim() : "",

      isActive: typeof body.isActive === "boolean" ? body.isActive : true,

      featured: typeof body.featured === "boolean" ? body.featured : false,

      sortOrder: Number.isFinite(Number(body.sortOrder)) ? Number(body.sortOrder) : 0,
    });

    return NextResponse.json(
      {
        success: true,
        collection: serializeCollection(collection),
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("POST /api/collections error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create collection",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * PATCH /api/collections
 *
 * Update a collection.
 *
 * Body:
 * {
 *   id: string,
 *   name?: string,
 *   slug?: string,
 *   description?: string,
 *   image?: string,
 *   isActive?: boolean,
 *   featured?: boolean,
 *   sortOrder?: number
 * }
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
          message: "Collection ID is required",
        },
        {
          status: 400,
        },
      );
    }

    const update: Record<string, any> = {};

    if (typeof body.name === "string") {
      if (!body.name.trim()) {
        return NextResponse.json(
          {
            success: false,
            message: "Collection name cannot be empty",
          },
          {
            status: 400,
          },
        );
      }

      update.name = body.name.trim();
    }

    if (typeof body.slug === "string") {
      update.slug = body.slug.trim();
    }

    if (typeof body.description === "string") {
      update.description = body.description.trim();
    }

    if (typeof body.image === "string") {
      update.image = body.image.trim();
    }

    if (typeof body.isActive === "boolean") {
      update.isActive = body.isActive;
    }

    if (typeof body.featured === "boolean") {
      update.featured = body.featured;
    }

    if (body.sortOrder !== undefined && Number.isFinite(Number(body.sortOrder))) {
      update.sortOrder = Number(body.sortOrder);
    }

    const collection = await Collection.findByIdAndUpdate(
      id,
      {
        $set: update,
      },
      {
        new: true,
        runValidators: true,
      },
    ).lean();

    if (!collection) {
      return NextResponse.json(
        {
          success: false,
          message: "Collection not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      collection: serializeCollection(collection),
    });
  } catch (error) {
    console.error("PATCH /api/collections error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update collection",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * DELETE /api/collections?id=...
 *
 * Deletes a collection.
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
          message: "Collection ID is required",
        },
        {
          status: 400,
        },
      );
    }

    const collection = await Collection.findByIdAndDelete(id);

    if (!collection) {
      return NextResponse.json(
        {
          success: false,
          message: "Collection not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Collection deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/collections error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to delete collection",
      },
      {
        status: 500,
      },
    );
  }
}
