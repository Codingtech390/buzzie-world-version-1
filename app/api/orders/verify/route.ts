import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedApiSession } from "@/lib/auth";
import { verifyPayment } from "@/services/order.service";

export async function POST(request: NextRequest) {
  try {
    // Parse the request safely.
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request body.",
        },
        { status: 400 },
      );
    }

    // Accept only the internal order ID and Cashfree order ID.
    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body) ||
      !("orderId" in body) ||
      !("cashfreeOrderId" in body) ||
      typeof body.orderId !== "string" ||
      typeof body.cashfreeOrderId !== "string" ||
      !body.orderId.trim() ||
      !body.cashfreeOrderId.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment verification payload.",
        },
        { status: 400 },
      );
    }

    // Require an authenticated customer.
    const session = await getAuthenticatedApiSession();

    if (!session || session.user.role !== "customer") {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in as a customer to verify payment.",
        },
        { status: 401 },
      );
    }

    const customerId = session.user.id;

    // The server-side service must retrieve and verify the payment
    // directly with Cashfree. Never trust browser-reported payment status.
    const order = await verifyPayment(body.orderId.trim(), body.cashfreeOrderId.trim(), customerId);

    return NextResponse.json({
      success: true,
      order: {
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        total: order.total,
        currency: order.currency,
        status: order.status,
        paymentStatus: order.paymentStatus,
      },
    });
  } catch (error) {
    console.error("POST /api/orders/verify error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Payment verification failed.",
      },
      { status: 400 },
    );
  }
}
