import { NextRequest, NextResponse } from "next/server";

import { createUser } from "@/services/auth.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request.",
        },
        { status: 400 },
      );
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";

    const email = typeof body.email === "string" ? body.email.trim() : "";

    const password = typeof body.password === "string" ? body.password : "";

    const phone = typeof body.phone === "string" ? body.phone.trim() : undefined;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Name is required.",
        },
        { status: 400 },
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required.",
        },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters.",
        },
        { status: 400 },
      );
    }

    const user = await createUser({
      name,
      email,
      password,
      phone,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your BuzzieWorld account has been created.",
        user,
        redirectUrl: "/account",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/auth/register error:", error);

    const message = error instanceof Error ? error.message : "Unable to create your account.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 },
    );
  }
}
