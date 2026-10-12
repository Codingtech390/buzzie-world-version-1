import { NextRequest, NextResponse } from "next/server";

import { getAuthenticatedApiSession } from "@/lib/auth";
import { getCheckoutPricing } from "@/services/order.service";
import { getShippingQuote } from "@/services/shiprocket.service";

const CART_COOKIE = "buzzie_cart_id";

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get(CART_COOKIE)?.value;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, message: "Cart session not found." },
        { status: 400 },
      );
    }

    const body = (await request.json()) as {
      deliveryPincode?: string;
    };

    const deliveryPincode = String(body.deliveryPincode ?? "").trim();

    if (!/^[1-9][0-9]{5}$/.test(deliveryPincode)) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter a valid 6-digit delivery pincode.",
        },
        { status: 400 },
      );
    }

    const session = await getAuthenticatedApiSession();
    const customerId = session?.user?.role === "customer" ? session.user.id : undefined;

    const pricing = await getCheckoutPricing(sessionId, customerId);

    const quote = await getShippingQuote(deliveryPincode, pricing.totalBeforeShipping);

    return NextResponse.json({
      success: true,
      quote,
    });
  } catch (error) {
    console.error("POST /api/checkout/shipping error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to calculate delivery charges.",
      },
      { status: 400 },
    );
  }
}
