  import { NextRequest, NextResponse } from "next/server";

  import { connectToDatabase } from "@/lib/mongoose";
  import { Brand } from "@/models/Brand";
  import { createSlug } from "@/lib/slug";

  export async function GET() {
    try {
      await connectToDatabase();

      const brands = await Brand.find({
        isActive: true,
      })
        .sort({ name: 1 })
        .lean();

      return NextResponse.json({
        success: true,
        brands,
      });
    } catch (error) {
      console.error("GET /api/brands error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch brands",
        },
        { status: 500 },
      );
    }
  }

  export async function POST(request: NextRequest) {
    try {
      await connectToDatabase();

      const body = await request.json();

      const brand = await Brand.create({
        ...body,
        slug:
          typeof body.slug === "string" && body.slug.trim()
            ? body.slug.trim()
            : createSlug(String(body.name)),
      });

      return NextResponse.json(
        {
          success: true,
          brand,
        },
        { status: 201 },
      );
    } catch (error) {
      console.error("POST /api/brands error:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Failed to create brand",
        },
        { status: 500 },
      );
    }
  }
