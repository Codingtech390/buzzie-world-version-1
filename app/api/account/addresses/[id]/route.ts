import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { getAuthenticatedApiSession } from "@/lib/auth";
import {
  deleteCustomerAddress,
  setCustomerDefaultAddress,
  updateCustomerAddress,
} from "@/services/customer-address.service";

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

interface AddressRouteContext {
  params: Promise<{
    id: string;
  }>;
}

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

export async function PATCH(request: NextRequest, context: AddressRouteContext) {
  try {
    const auth = await getCustomerSession();

    if ("response" in auth) {
      return auth.response;
    }

    const { id } = await context.params;

    const body = await request.json().catch(() => null);

    /*
     * A default-address update can be sent as:
     *
     * {
     *   "isDefault": true
     * }
     *
     * This intentionally keeps the API surface small.
     */
    if (body && typeof body === "object" && "isDefault" in body && Object.keys(body).length === 1) {
      const defaultSchema = z.object({
        isDefault: z.literal(true),
      });

      const parsedDefault = defaultSchema.safeParse(body);

      if (!parsedDefault.success) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid default-address request.",
          },
          { status: 400 },
        );
      }

      const address = await setCustomerDefaultAddress(auth.session.user.id, id);

      return NextResponse.json({
        success: true,
        data: address,
        message: "Default address updated successfully.",
      });
    }

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

    const address = await updateCustomerAddress(auth.session.user.id, id, parsed.data);

    return NextResponse.json({
      success: true,
      data: address,
      message: "Address updated successfully.",
    });
  } catch (error) {
    console.error("PATCH /api/account/addresses/[id] error:", error);

    const message = error instanceof Error ? error.message : "Unable to update your address.";

    const status =
      message === "Address not found."
        ? 404
        : message === "Customer account not found."
          ? 404
          : 400;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status },
    );
  }
}

export async function DELETE(_request: NextRequest, context: AddressRouteContext) {
  try {
    const auth = await getCustomerSession();

    if ("response" in auth) {
      return auth.response;
    }

    const { id } = await context.params;

    await deleteCustomerAddress(auth.session.user.id, id);

    return NextResponse.json({
      success: true,
      message: "Address deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/account/addresses/[id] error:", error);

    const message = error instanceof Error ? error.message : "Unable to delete your address.";

    const status =
      message === "Address not found."
        ? 404
        : message === "Customer account not found."
          ? 404
          : 400;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status },
    );
  }
}
