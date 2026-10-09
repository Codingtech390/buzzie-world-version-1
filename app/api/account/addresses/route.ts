import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAuthenticatedApiSession } from "@/lib/auth";
import { createCustomerAddress, getCustomerAddresses } from "@/services/customer-address.service";

const addressSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters.")
    .max(100, "Full name must be 100 characters or fewer."),

  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required.")
    .max(20, "Phone number must be 20 characters or fewer."),

  addressLine1: z
    .string()
    .trim()
    .min(1, "Address line 1 is required.")
    .max(200, "Address line 1 must be 200 characters or fewer."),

  addressLine2: z
    .string()
    .trim()
    .max(200, "Address line 2 must be 200 characters or fewer.")
    .optional(),

  city: z
    .string()
    .trim()
    .min(1, "City is required.")
    .max(100, "City must be 100 characters or fewer."),

  state: z
    .string()
    .trim()
    .min(1, "State is required.")
    .max(100, "State must be 100 characters or fewer."),

  postalCode: z
    .string()
    .trim()
    .min(1, "Postal code is required.")
    .max(20, "Postal code must be 20 characters or fewer."),

  country: z
    .string()
    .trim()
    .min(1, "Country is required.")
    .max(100, "Country must be 100 characters or fewer.")
    .optional(),

  isDefault: z.boolean().optional(),
});

async function getCustomerSession() {
  const session = await getAuthenticatedApiSession();

  if (!session?.user?.id) {
    return {
      response: NextResponse.json(
        {
          success: false,
          message: "You must be signed in to manage your addresses.",
        },
        { status: 401 },
      ),
    } as const;
  }

  if (session.user.role !== "customer") {
    return {
      response: NextResponse.json(
        {
          success: false,
          message: "Customer access is required.",
        },
        { status: 403 },
      ),
    } as const;
  }

  return { session } as const;
}

export async function GET() {
  try {
    const auth = await getCustomerSession();

    if ("response" in auth) {
      return auth.response;
    }

    const addresses = await getCustomerAddresses(auth.session.user.id);

    return NextResponse.json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    console.error("GET /api/account/addresses error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load your addresses right now.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getCustomerSession();

    if ("response" in auth) {
      return auth.response;
    }

    const body = await request.json().catch(() => null);
    const parsed = addressSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message || "Invalid address details.",
        },
        { status: 400 },
      );
    }

    const address = await createCustomerAddress(auth.session.user.id, parsed.data);

    return NextResponse.json(
      {
        success: true,
        data: address,
        message: "Address added successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/account/addresses error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to add your address right now.",
      },
      { status: 400 },
    );
  }
}
