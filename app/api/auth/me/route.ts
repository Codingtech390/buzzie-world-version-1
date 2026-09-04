import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          user: null,
        },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,

      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        image: user.image,
        emailVerified: user.emailVerified ?? null,
      },
    });
  } catch (error) {
    console.error("GET /api/auth/me error:", error);

    return NextResponse.json(
      {
        success: false,
        authenticated: false,
        message: "Unable to load account.",
      },
      { status: 500 },
    );
  }
}
