import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedApiSession } from "@/lib/auth";
import { getCustomerOrder } from "@/services/customer-order.service";

interface CustomerOrderRouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: NextRequest, context: CustomerOrderRouteContext) {
  try {
    const session = await getAuthenticatedApiSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be signed in to view this order.",
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

    const { id } = await context.params;

    const order = await getCustomerOrder(session.user.id, id);

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
      data: order,
    });
  } catch (error) {
    console.error("GET /api/account/orders/[id] error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load this order right now.",
      },
      { status: 500 },
    );
  }
}
