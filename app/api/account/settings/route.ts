import { NextResponse } from "next/server";

import { getAuthenticatedApiSession } from "@/lib/auth";
import { deleteCustomerAccount } from "@/services/customer-settings.service";

export const dynamic = "force-dynamic";

async function requireCustomerSession() {
  const session = await getAuthenticatedApiSession();

  if (!session?.user?.id || session.user.role !== "customer") {
    return null;
  }

  return session;
}

/**
 * DELETE /api/account/settings
 */
export async function DELETE() {
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

    const deleted = await deleteCustomerAccount(session.user.id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Account not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your account has been deleted.",
    });
  } catch (error) {
    console.error("DELETE /api/account/settings error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to delete account.",
      },
      { status: 400 },
    );
  }
}
