import { NextResponse } from "next/server";

import { getAuthenticatedApiSession } from "@/lib/auth";
import { getCustomerOrders } from "@/services/customer-order.service";

export async function GET() {
  try {
    const session = await getAuthenticatedApiSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be signed in to view your orders.",
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

    const orders = await getCustomerOrders(session.user.id);

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("GET /api/account/orders error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load your orders right now.",
      },
      { status: 500 },
    );
  }
}
