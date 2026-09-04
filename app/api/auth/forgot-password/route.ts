import { NextRequest, NextResponse } from "next/server";

import { createPasswordResetToken } from "@/services/auth.service";

const RESET_RESPONSE =
  "If an account exists for that email, we've sent password reset instructions.";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your email address.",
        },
        { status: 400 },
      );
    }

    const result = await createPasswordResetToken(email);

    /*
     * In production we send the token through email.
     *
     * During development, returning a reset URL makes it
     * possible to test the entire flow without pretending
     * that an email was delivered.
     */
    const isDevelopment = process.env.NODE_ENV !== "production";

    let resetUrl: string | undefined;

    if (result && isDevelopment) {
      const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

      resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(result.token)}`;
    }

    /*
     * IMPORTANT:
     * Unknown emails get the exact same response.
     */
    return NextResponse.json({
      success: true,
      message: RESET_RESPONSE,

      ...(resetUrl
        ? {
            developmentResetUrl: resetUrl,
          }
        : {}),
    });
  } catch (error) {
    console.error("POST /api/auth/forgot-password error:", error);

    /*
     * Don't expose account existence or internal
     * implementation details.
     */
    return NextResponse.json({
      success: true,
      message: RESET_RESPONSE,
    });
  }
}
