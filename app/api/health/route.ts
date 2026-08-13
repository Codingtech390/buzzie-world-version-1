import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongoose";

export async function GET() {
  try {
    await connectToDatabase();

    return NextResponse.json({
      success: true,
      message: "BuzzieWorld API is healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        database: "disconnected",
      },
      {
        status: 503,
      },
    );
  }
}
