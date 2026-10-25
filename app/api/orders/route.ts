import { NextRequest, NextResponse } from "next/server";

import { createOrderFromCart, getAdminOrders } from "@/services/order.service";

import { getAdminApiSession, getAuthenticatedApiSession } from "@/lib/auth";

const CART_COOKIE = "buzzie_cart_id";

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminApiSession();

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin authentication required.",
        },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "20");

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const paymentStatus = searchParams.get("paymentStatus") || "";

    const sort = searchParams.get("sort") === "oldest" ? "oldest" : "newest";

    const result = await getAdminOrders({
      page,
      limit,
      search,
      status,
      paymentStatus,
      sort,
    });

    return NextResponse.json({
      success: true,
      data: result.orders,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("GET /api/orders error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch orders",
      },
      { status: 500 },
    );
  }
}



export async function POST(request: NextRequest) {
  try {
    // Require a valid JSON request body.
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

    // Validate the request body before accessing nested properties.
    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body) ||
      !("shippingAddress" in body) ||
      !body.shippingAddress ||
      typeof body.shippingAddress !== "object" ||
      Array.isArray(body.shippingAddress)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid shipping address is required.",
        },
        { status: 400 },
      );
    }

    const shippingAddress = body.shippingAddress;

    // Require an existing cart session.
    const sessionId = request.cookies.get(CART_COOKIE)?.value;

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Cart session not found.",
        },
        { status: 400 },
      );
    }

    // Only authenticated customers may place orders.
    const session = await getAuthenticatedApiSession();

    if (!session || session.user.role !== "customer") {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in as a customer before placing an order.",
        },
        { status: 401 },
      );
    }

    const customerId = session.user.id;

    // The service recalculates product prices, discounts, shipping,
    // and the final total on the server.
    const { order, cashfreeOrder, discountLabel } = await createOrderFromCart(
      sessionId,
      shippingAddress as import("@/types/order").ShippingAddress,
      customerId,
    );

    // Never return the Cashfree client secret to the browser.
    if (!cashfreeOrder || !cashfreeOrder.payment_session_id || !cashfreeOrder.order_id) {
      console.error("POST /api/orders: Cashfree returned incomplete checkout details.", {
        orderNumber: order.orderNumber,
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "Payment checkout could not be initialized. Please contact support before retrying.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      success: true,

      order: {
        id: order._id.toString(),
        orderNumber: order.orderNumber,
        subtotal: order.subtotal,
        shipping: order.shipping,
        discount: order.discount,
        discountLabel,
        total: order.total,
        currency: order.currency,
      },

      cashfree: {
        orderId: cashfreeOrder.order_id,
        paymentSessionId: cashfreeOrder.payment_session_id,
        environment: process.env.CASHFREE_ENV,
      },
    });
  } catch (error) {
    console.error("POST /api/orders error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create order.",
      },
      { status: 400 },
    );
  }
}
