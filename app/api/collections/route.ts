import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongoose";
import { Collection } from "@/models/Collection";
import { createSlug } from "@/lib/slug";

export async function GET() {
  try {
    await connectToDatabase();

    const collections = await Collection.find({
      isActive: true,
    })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      collections,
    });
  } catch (error) {
    console.error("GET /api/collections error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch collections",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();

    const collection = await Collection.create({
      ...body,
      slug:
        typeof body.slug === "string" && body.slug.trim()
          ? body.slug.trim()
          : createSlug(String(body.name)),
    });

    return NextResponse.json(
      {
        success: true,
        collection,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/collections error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create collection",
      },
      { status: 500 },
    );
  }
}
