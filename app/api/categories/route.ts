import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { createSlug } from "@/lib/slug";

export async function GET() {
  try {
    await connectToDatabase();

    const categories = await Category.find({
      isActive: true,
    })
      .sort({ sortOrder: 1, name: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("GET /api/categories error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch categories",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();

    const category = await Category.create({
      ...body,
      slug:
        typeof body.slug === "string" && body.slug.trim()
          ? body.slug.trim()
          : createSlug(String(body.name)),
    });

    return NextResponse.json(
      {
        success: true,
        category,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/categories error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create category",
      },
      { status: 500 },
    );
  }
}
