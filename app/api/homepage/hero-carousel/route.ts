import { NextRequest, NextResponse } from "next/server";

import { getAdminApiSession } from "@/lib/auth";
import { getHeroCarouselSlides, saveHeroCarouselSlides } from "@/services/homepage.service";
import { DEFAULT_HERO_SLIDES } from "@/types/homepage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const slides = await getHeroCarouselSlides();

    return NextResponse.json({
      success: true,
      slides,
    });
  } catch (error) {
    console.error("GET /api/homepage/hero-carousel error:", error);

    return NextResponse.json({
      success: true,
      slides: DEFAULT_HERO_SLIDES,
    });
  }
}

export async function PUT(request: NextRequest) {
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

    const body: unknown = await request.json();

    if (!body || typeof body !== "object" || !("slides" in body)) {
      return NextResponse.json(
        {
          success: false,
          message: "Provide a slides array.",
        },
        { status: 400 },
      );
    }

    const slides = await saveHeroCarouselSlides((body as { slides: unknown }).slides);

    return NextResponse.json({
      success: true,
      message: "Hero carousel saved successfully.",
      slides,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save hero carousel.";

    const isValidationError =
      message.includes("Slide") ||
      message.includes("slides") ||
      message.includes("three") ||
      message.includes("Exactly");

    console.error("PUT /api/homepage/hero-carousel error:", error);

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: isValidationError ? 400 : 500 },
    );
  }
}
