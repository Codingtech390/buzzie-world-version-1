// app/api/media/files/[...path]/route.ts

import { NextRequest, NextResponse } from "next/server";

import { readLocalMedia } from "@/lib/media-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{
    path: string[];
  }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { path: segments } = await context.params;

    if (!Array.isArray(segments) || segments.length === 0) {
      return NextResponse.json(
        { success: false, message: "Media file not found." },
        { status: 404 },
      );
    }

    // Next.js provides decoded route parameters. Reject path traversal.
    if (
      segments.some(
        (segment) =>
          !segment ||
          segment === "." ||
          segment === ".." ||
          segment.includes("/") ||
          segment.includes("\\") ||
          segment.includes("\0") ||
          segment.includes(":"),
      )
    ) {
      return NextResponse.json({ success: false, message: "Invalid media path." }, { status: 400 });
    }

    const relativePath = segments.join("/");
    const media = await readLocalMedia(relativePath);

    if (!media) {
      return NextResponse.json(
        { success: false, message: "Media file not found." },
        { status: 404 },
      );
    }

    return new NextResponse(new Uint8Array(media.buffer), {
      status: 200,
      headers: {
        "Content-Type": media.mimeType,
        "Content-Length": String(media.buffer.byteLength),
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Local media read failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to read the media file." },
      { status: 500 },
    );
  }
}
