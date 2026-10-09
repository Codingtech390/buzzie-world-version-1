import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAuthenticatedApiSession } from "@/lib/auth";
import { getCustomerProfile, updateCustomerProfile } from "@/services/customer-account.service";

const updateProfileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters.").max(80),
  phone: z.string().trim().max(20, "Phone number must be 20 characters or fewer.").optional(),
});

async function getCustomerSession() {
  const session = await getAuthenticatedApiSession();

  if (!session?.user?.id) {
    return {
      response: NextResponse.json(
        {
          success: false,
          message: "You must be signed in to access your account.",
        },
        { status: 401 },
      ),
    } as const;
  }

  if (session.user.role !== "customer") {
    return {
      response: NextResponse.json(
        {
          success: false,
          message: "Customer access is required.",
        },
        { status: 403 },
      ),
    } as const;
  }

  return { session } as const;
}

export async function GET() {
  try {
    const auth = await getCustomerSession();

    if ("response" in auth) {
      return auth.response;
    }

    const { session } = auth;

    const profile = await getCustomerProfile(session.user.id);

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer account not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("GET /api/account/profile error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load your profile right now.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await getCustomerSession();

    if ("response" in auth) {
      return auth.response;
    }

    const { session } = auth;

    const body = await request.json().catch(() => null);
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message || "Invalid profile details.",
        },
        { status: 400 },
      );
    }

    const profile = await updateCustomerProfile(session.user.id, {
      name: parsed.data.name,
      phone: parsed.data.phone || undefined,
    });

    return NextResponse.json({
      success: true,
      data: profile,
      message: "Your profile has been updated successfully.",
    });
  } catch (error) {
    console.error("PATCH /api/account/profile error:", error);

    const message =
      error instanceof Error ? error.message : "Unable to update your profile right now.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 },
    );
  }
}
