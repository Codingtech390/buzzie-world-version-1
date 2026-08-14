import { NextRequest, NextResponse } from "next/server";

import { verifyPayment } from "@/services/order.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (
      typeof body.orderId !== "string" ||
      typeof body.razorpay_payment_id !== "string" ||
      typeof body.razorpay_order_id !== "string" ||
      typeof body.razorpay_signature !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment verification payload",
        },
        { status: 400 },
      );
    }

    const order = await verifyPayment(
      body.orderId,
      body.razorpay_payment_id,
      body.razorpay_order_id,
      body.razorpay_signature,
    );

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
        message: error instanceof Error ? error.message : "Payment verification failed",
      },
      { status: 400 },
    );
  }
}
