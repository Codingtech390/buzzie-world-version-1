import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedApiSession } from "@/lib/auth";
import {
  getCustomerSettings,
  updateCustomerPreferences,
} from "@/services/customer-settings.service";

export const dynamic = "force-dynamic";

async function requireCustomerSession() {
  const session = await getAuthenticatedApiSession();

  if (!session?.user?.id || session.user.role !== "customer") {
    return null;
  }

  return session;
}

/**
 * GET /api/account/preferences
 */
export async function GET() {
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

    const settings = await getCustomerSettings(session.user.id);

    if (!settings) {
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
      preferences: settings.preferences,
      hasPassword: settings.hasPassword,
    });
  } catch (error) {
    console.error("GET /api/account/preferences error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to load account preferences.",
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/account/preferences
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
     emailNotifications?: unknown;
     marketingEmails?: unknown;
     wishlistReminders?: unknown;
   };

   if (
     typeof payload.emailNotifications !== "boolean" ||
     typeof payload.marketingEmails !== "boolean" ||
     typeof payload.wishlistReminders !== "boolean"
   ) {
     return NextResponse.json(
       {
         success: false,
         message: "Invalid account preferences.",
       },
       { status: 400 },
     );
   }

   const preferences = await updateCustomerPreferences(session.user.id, {
     emailNotifications: payload.emailNotifications,
     marketingEmails: payload.marketingEmails,
     wishlistReminders: payload.wishlistReminders,
   });

    return NextResponse.json({
      success: true,
      message: "Account preferences updated successfully.",
      preferences,
    });
  } catch (error) {
    console.error("PATCH /api/account/preferences error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to update account preferences.",
      },
      { status: 400 },
    );
  }
}
