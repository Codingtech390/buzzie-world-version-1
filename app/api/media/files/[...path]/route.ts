
import { NextRequest, NextResponse } from "next/server";
import { readLocalMedia } from "@/lib/media-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{
    path: string[];
  }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { path: segments } = await context.params;

    if (!Array.isArray(segments) || segments.length === 0) {
      return NextResponse.json(
        { success: false, message: "Media file not found." },
        { status: 404 },
      );
    }

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
      return NextResponse.json(
        { success: false, message: "Invalid media path." },
        { status: 400 },
      );
    }

    const relativePath = segments.join("/");
    const media = await readLocalMedia(relativePath);

    if (!media) {
      return NextResponse.json(
        { success: false, message: "Media file not found." },
        { status: 404 },
      );
    }

    const size = media.buffer.byteLength;
    const range = request.headers.get("range");
    const isVideo = media.mimeType.startsWith("video/");

    const headers = new Headers({
      "Content-Type": media.mimeType,
      "Accept-Ranges": isVideo ? "bytes" : "none",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=31536000, immutable",
    });

    if (isVideo && range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);

      if (!match || (!match[1] && !match[2])) {
        headers.set("Content-Range", `bytes */${size}`);

        return new NextResponse(null, {
          status: 416,
          headers,
        });
      }

      let start: number;
      let end: number;

      if (!match[1]) {
        const suffixLength = Number(match[2]);

        if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) {
          headers.set("Content-Range", `bytes */${size}`);

          return new NextResponse(null, {
            status: 416,
            headers,
          });
        }

        start = Math.max(0, size - suffixLength);
        end = size - 1;
      } else {
        start = Number(match[1]);
        end = match[2] ? Number(match[2]) : size - 1;
      }

      if (
        !Number.isSafeInteger(start) ||
        !Number.isSafeInteger(end) ||
        start < 0 ||
        start >= size ||
        end < start
      ) {
        headers.set("Content-Range", `bytes */${size}`);

        return new NextResponse(null, {
          status: 416,
          headers,
        });
      }

      end = Math.min(end, size - 1);

      const chunk = media.buffer.subarray(start, end + 1);

      headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
      headers.set("Content-Length", String(chunk.byteLength));

      return new NextResponse(new Uint8Array(chunk), {
        status: 206,
        headers,
      });
    }

    headers.set("Content-Length", String(size));

    return new NextResponse(new Uint8Array(media.buffer), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Local media read failed:", error);

    return NextResponse.json(
      { success: false, message: "Unable to read the media file." },
      { status: 500 },
    );
  }
}
