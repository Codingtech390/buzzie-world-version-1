import { NextRequest, NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongoose";
import { User } from "@/models/User";

function serializeCustomer(customer: any) {
  return {
    id: customer._id.toString(),
    name: customer.name ?? "",
    email: customer.email ?? "",
    phone: customer.phone ?? "",
    role: customer.role ?? "customer",
    image: customer.image ?? "",
    isActive: customer.isActive ?? true,
    emailVerified: customer.emailVerified ? new Date(customer.emailVerified).toISOString() : null,

    addresses: Array.isArray(customer.addresses)
      ? customer.addresses.map((address: any) => ({
          id: address._id?.toString() ?? "",
          fullName: address.fullName ?? "",
          phone: address.phone ?? "",
          addressLine1: address.addressLine1 ?? "",
          addressLine2: address.addressLine2 ?? "",
          city: address.city ?? "",
          state: address.state ?? "",
          postalCode: address.postalCode ?? "",
          country: address.country ?? "India",
          isDefault: Boolean(address.isDefault),
        }))
      : [],

    createdAt: customer.createdAt ? new Date(customer.createdAt).toISOString() : null,

    updatedAt: customer.updatedAt ? new Date(customer.updatedAt).toISOString() : null,
  };
}

/**
 * GET /api/customers
 *
 * Supports:
 * ?page=1
 * ?limit=20
 * ?search=abhijeet
 * ?status=active
 * ?status=inactive
 */
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    const page = Math.max(1, Number(searchParams.get("page") || "1"));

    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || "20")));

    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "all";

    const filter: Record<string, any> = {
      role: "customer",
    };

    if (status === "active") {
      filter.isActive = true;
    }

    if (status === "inactive") {
      filter.isActive = false;
    }

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const searchRegex = new RegExp(escapedSearch, "i");

      filter.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
    }

    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),

      User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: customers.map(serializeCustomer),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("GET /api/customers error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch customers",
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/customers
 *
 * Used by the admin page to activate/deactivate a customer.
 *
 * Body:
 * {
 *   "id": "customer_id",
 *   "isActive": false
 * }
 */
export async function PATCH(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = await request.json();

    const id = typeof body?.id === "string" ? body.id.trim() : "";

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer ID is required",
        },
        { status: 400 },
      );
    }

    if (typeof body?.isActive !== "boolean") {
      return NextResponse.json(
        {
          success: false,
          message: "isActive must be a boolean",
        },
        { status: 400 },
      );
    }

    const customer = await User.findOneAndUpdate(
      {
        _id: id,
        role: "customer",
      },
      {
        $set: {
          isActive: body.isActive,
        },
      },
      {
        new: true,
      },
    ).lean();

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: body.isActive
        ? "Customer activated successfully"
        : "Customer deactivated successfully",
      data: serializeCustomer(customer),
    });
  } catch (error) {
    console.error("PATCH /api/customers error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update customer",
      },
      { status: 500 },
    );
  }
}
