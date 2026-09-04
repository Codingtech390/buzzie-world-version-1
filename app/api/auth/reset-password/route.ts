import { NextRequest, NextResponse } from "next/server";

import { resetPasswordWithToken } from "@/services/auth.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const token = typeof body?.token === "string" ? body.token.trim() : "";

    const password = typeof body?.password === "string" ? body.password : "";

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "This password reset link is missing or invalid.",
        },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Your new password must be at least 8 characters.",
        },
        { status: 400 },
      );
    }

    await resetPasswordWithToken(token, password);

    return NextResponse.json({
      success: true,
      message: "Your password has been reset successfully.",
      redirectUrl: "/login",
    });
  } catch (error) {
    console.error("POST /api/auth/reset-password error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to reset your password.",
      },
      { status: 400 },
    );
  }
}
