import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedApiSession } from "@/lib/auth";
import { getCheckoutPricing } from "@/services/order.service";

const CART_COOKIE = "buzzie_cart_id";

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get(CART_COOKIE)?.value;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "Cart session not found." },
        { status: 400 },
      );
    }

    const session = await getAuthenticatedApiSession();

    const customerId = session?.user?.role === "customer" ? session.user.id : undefined;

    const pricing = await getCheckoutPricing(sessionId, customerId);

    return NextResponse.json({
      success: true,
      pricing,
    });
  } catch (error) {
    console.error("GET /api/checkout/pricing error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to calculate checkout pricing.",
      },
      { status: 400 },
    );
  }
}
