import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedApiSession } from "@/lib/auth";
import { getCustomerOrder } from "@/services/customer-order.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getAuthenticatedApiSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer authentication required.",
        },
        { status: 401 },
      );
    }

    if (session.user.role !== "customer") {
      return NextResponse.json(
        {
          success: false,
          message: "Customer access is required.",
        },
        { status: 403 },
      );
    }

    const orderId = request.nextUrl.searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Order ID is required.",
        },
        { status: 400 },
      );
    }

    const order = await getCustomerOrder(session.user.id, orderId);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        shipment: order.shipment,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    console.error("GET /api/account/tracking error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load tracking information.",
      },
      { status: 500 },
    );
  }
}
