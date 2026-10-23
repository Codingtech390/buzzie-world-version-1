"use client";

import { useRef, useState } from "react";

export interface ProductVideo {
  url: string;
  publicId?: string;
  title?: string;
  format?: string;
  duration?: number;
}

interface ProductVideosProps {
  productSlug: string;
  videos: ProductVideo[];
  onChange: (videos: ProductVideo[]) => void;
  disabled?: boolean;
}

const MAX_VIDEOS = 3;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
]);

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default function ProductVideos({
  productSlug,
  videos,
  onChange,
  disabled = false,
}: ProductVideosProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files?.length || uploading || disabled) return;

    const slug = slugify(productSlug);

    if (!slug) {
      setError("Enter a valid product name and save the product before uploading videos.");
      return;
    }

    const selected = Array.from(files);

    if (videos.length + selected.length > MAX_VIDEOS) {
      setError(`A product can have a maximum of ${MAX_VIDEOS} videos.`);
      return;
    }

    for (const file of selected) {
      if (!ALLOWED_VIDEO_TYPES.has(file.type)) {
        setError(`${file.name}: upload an MP4, WebM, MOV, or M4V video.`);
        return;
      }

      if (file.size <= 0 || file.size > MAX_VIDEO_BYTES) {
        setError(`${file.name}: the maximum video size is 100 MB.`);
        return;
      }
    }

    setUploading(true);
    setError("");

    const uploaded: ProductVideo[] = [];

    try {
      for (const file of selected) {
        const body = new FormData();

        body.append("file", file);
        body.append("folder", `buzzie-world/products/${slug}/video`);
        body.append("alt", file.name.replace(/\.[^.]+$/, ""));

        const response = await fetch("/api/media/upload", {
          method: "POST",
          credentials: "include",
          body,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok || !data?.success) {
          throw new Error(data?.message || `Unable to upload ${file.name}.`);
        }

        const url = data.url || data.secureUrl;

        if (typeof url !== "string" || !url) {
          throw new Error(`The upload server returned no URL for ${file.name}.`);
        }

        uploaded.push({
          url,
          publicId: typeof data.publicId === "string" ? data.publicId : undefined,
          title: file.name.replace(/\.[^.]+$/, ""),
          format: file.name.split(".").pop()?.toLowerCase(),
        });
      }

      onChange([...videos, ...uploaded]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Video upload failed.");
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-background p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-foreground">Product Videos</h3>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Upload up to three videos for the product's Watch & Buy section.
          Videos are stored locally in this product's video folder.
        </p>
      </div>

      {videos.length > 0 && (
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, index) => (
            <div
              key={`${video.publicId ?? video.url}-${index}`}
              className="overflow-hidden rounded-xl border border-border/60"
            >
              <video
                src={video.url}
                controls
                playsInline
                preload="metadata"
                className="aspect-[3/4] w-full bg-black object-contain"
              />

              <div className="p-3">
                <p className="break-words text-xs font-semibold text-foreground">
                  {video.title || `Video ${index + 1}`}
                </p>

                <button
                  type="button"
                  disabled={disabled || uploading}
                  onClick={() =>
                    onChange(videos.filter((_, videoIndex) => videoIndex !== index))
                  }
                  className="mt-3 rounded-lg border border-[#E83D59]/20 px-3 py-2 text-xs font-semibold text-[#E83D59] hover:bg-[#E83D59]/5 disabled:opacity-50"
                >
                  Remove video
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {videos.length < MAX_VIDEOS && (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
            multiple
            disabled={disabled || uploading}
            onChange={(event) => void handleFiles(event.target.files)}
            className="block w-full text-sm text-foreground file:mr-4 file:rounded-xl file:border-0 file:bg-[#C391EE] file:px-4 file:py-2.5 file:font-semibold file:text-white hover:file:bg-[#B074E4] disabled:opacity-50"
          />

          <p className="mt-2 text-xs text-muted-foreground">
            MP4, WebM, MOV or M4V. Maximum 100 MB per video.
          </p>
        </div>
      )}

      {videos.length >= MAX_VIDEOS && (
        <p className="text-xs font-medium text-muted-foreground">
          Maximum of three videos reached.
        </p>
      )}

      {uploading && (
        <p className="mt-3 text-sm text-muted-foreground">
          Uploading video…
        </p>
      )}

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
