import { NextRequest, NextResponse } from "next/server";

import { getAdminApiSession } from "@/lib/auth";
import { getSiteSettings, updateSiteSettings } from "@/services/settings.service";
import { settingsSchema } from "@/types/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getAdminApiSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access is required.",
        },
        { status: 401 },
      );
    }

    const settings = await getSiteSettings();

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("GET /api/settings error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load store settings.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getAdminApiSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access is required.",
        },
        { status: 401 },
      );
    }

    const body = await request.json().catch(() => null);
    const parsed = settingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message ?? "Please correct the invalid settings.",
          errors: parsed.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    const settings = await updateSiteSettings(parsed.data);

    return NextResponse.json({
      success: true,
      message: "Store settings saved successfully.",
      data: settings,
    });
  } catch (error) {
    console.error("PATCH /api/settings error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to save store settings.",
      },
      { status: 500 },
    );
  }
}
