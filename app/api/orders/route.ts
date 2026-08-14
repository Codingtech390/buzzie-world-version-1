import { NextRequest, NextResponse } from "next/server";

import { createOrderFromCart } from "@/services/order.service";
import { getRazorpayKeyId } from "@/lib/razorpay";

const CART_COOKIE = "buzzie_cart_id";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const sessionId = request.cookies.get(CART_COOKIE)?.value;

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart session not found",
        },
        { status: 400 },
      );
    }

    if (!body || typeof body !== "object" || !body.shippingAddress) {
      return NextResponse.json(
        {
          success: false,
          message: "Shipping address is required",
        },
        { status: 400 },
      );
    }

    const { order, razorpayOrder } = await createOrderFromCart(sessionId, body.shippingAddress);

    return NextResponse.json({
      success: true,

      order: {
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        total: order.total,
        currency: order.currency,
      },

      razorpay: {
        keyId: getRazorpayKeyId(),
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
    });
  } catch (error) {
    console.error("POST /api/orders error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create order",
      },
      { status: 400 },
    );
  }
}
