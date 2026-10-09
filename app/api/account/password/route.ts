import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedApiSession } from "@/lib/auth";
import { updateCustomerPassword } from "@/services/customer-settings.service";

export const dynamic = "force-dynamic";

async function requireCustomerSession() {
  const session = await getAuthenticatedApiSession();

  if (!session?.user?.id || session.user.role !== "customer") {
    return null;
  }

  return session;
}

/**
 * PATCH /api/account/password
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await requireCustomerSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer authentication required.",
        },
        { status: 401 },
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON body.",
        },
        { status: 400 },
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body.",
        },
        { status: 400 },
      );
    }

    const payload = body as {
      currentPassword?: unknown;
      newPassword?: unknown;
    };

    if (typeof payload.currentPassword !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Current password is required.",
        },
        { status: 400 },
      );
    }

    if (typeof payload.newPassword !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "New password is required.",
        },
        { status: 400 },
      );
    }

    await updateCustomerPassword(session.user.id, {
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("PATCH /api/account/password error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to change password.",
      },
      { status: 400 },
    );
  }
}
