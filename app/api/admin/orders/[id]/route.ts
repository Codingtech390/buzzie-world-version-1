import { NextRequest, NextResponse } from "next/server";

import { getAdminApiSession } from "@/lib/auth";
import { updateOrderShipment } from "@/services/shipment.service";
import type { ShipmentStatus } from "@/types/shipment";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const VALID_STATUSES: ShipmentStatus[] = ["pending", "shipped", "in_transit", "delivered"];

async function requireAdminSession() {
  const session = await getAdminApiSession();

  return session;
}

/**
 * PATCH /api/admin/orders/[id]
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const session = await requireAdminSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin authentication required.",
        },
        { status: 401 },
      );
    }

    const { id } = await context.params;

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
      courier?: unknown;
      trackingNumber?: unknown;
      trackingUrl?: unknown;
      status?: unknown;
    };

    if (typeof payload.courier !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Courier is required.",
        },
        { status: 400 },
      );
    }

    if (typeof payload.trackingNumber !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Tracking number / AWB is required.",
        },
        { status: 400 },
      );
    }

    if (
      typeof payload.status !== "string" ||
      !VALID_STATUSES.includes(payload.status as ShipmentStatus)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid shipment status.",
        },
        { status: 400 },
      );
    }

    if (payload.trackingUrl !== undefined && typeof payload.trackingUrl !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid tracking URL.",
        },
        { status: 400 },
      );
    }

    const result = await updateOrderShipment(id, {
      courier: payload.courier,
      trackingNumber: payload.trackingNumber,
      trackingUrl: typeof payload.trackingUrl === "string" ? payload.trackingUrl : undefined,
      status: payload.status as ShipmentStatus,
    });

    return NextResponse.json({
      success: true,
      message: "Shipment information updated successfully.",
      data: result,
    });
  } catch (error) {
    console.error("PATCH /api/admin/orders/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to update shipment information.",
      },
      { status: 400 },
    );
  }
}
