import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "@/services/cart.service";

const CART_COOKIE = "buzzie_cart_id";

function getSessionId(request: NextRequest) {
  return request.cookies.get(CART_COOKIE)?.value || randomUUID();
}

function responseWithCart(
  cart: Awaited<ReturnType<typeof getCart>>,
  sessionId: string,
  status = 200,
) {
  const response = NextResponse.json(cart, { status });

  if (!response.cookies.get(CART_COOKIE)) {
    response.cookies.set(CART_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
}

export async function GET(request: NextRequest) {
  try {
    const sessionId = getSessionId(request);

    const cart = await getCart(sessionId);

    return responseWithCart(cart, sessionId);
  } catch (error) {
    console.error("GET /api/cart error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch cart",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const sessionId = getSessionId(request);

    if (
      !body ||
      typeof body.productId !== "string" ||
      !Number.isInteger(body.quantity) ||
      body.quantity < 1
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid cart item",
        },
        { status: 400 },
      );
    }

    const cart = await addToCart(sessionId, body.productId, body.quantity);

    return responseWithCart(cart, sessionId);
  } catch (error) {
    console.error("POST /api/cart error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to add item to cart",
      },
      { status: 400 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const sessionId = getSessionId(request);

    if (typeof body.productId !== "string" || !Number.isInteger(body.quantity)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid cart update",
        },
        { status: 400 },
      );
    }

    const cart = await updateCartItem(sessionId, body.productId, body.quantity);

    return responseWithCart(cart, sessionId);
  } catch (error) {
    console.error("PATCH /api/cart error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update cart",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionId = getSessionId(request);

    const productId = new URL(request.url).searchParams.get("productId");

    if (productId) {
      const cart = await removeFromCart(sessionId, productId);

      return responseWithCart(cart, sessionId);
    }

    const cart = await clearCart(sessionId);

    return responseWithCart(cart, sessionId);
  } catch (error) {
    console.error("DELETE /api/cart error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to modify cart",
      },
      { status: 500 },
    );
  }
}
