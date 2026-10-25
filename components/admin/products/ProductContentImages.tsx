"use client";

import { useRef, useState } from "react";

export interface ProductContentImage {
  url: string;
  publicId?: string;
  alt?: string;
  caption?: string;
}

interface ProductContentImagesProps {
  title: string;
  description: string;
  folderType: "a-plus" | "how-to-play";
  productSlug: string;
  images: ProductContentImage[];
  onChange: (images: ProductContentImage[]) => void;
  disabled?: boolean;
}

const MAX_IMAGES = 20;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export default function ProductContentImages({
  title,
  description,
  folderType,
  productSlug,
  images,
  onChange,
  disabled = false,
}: ProductContentImagesProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;

    const slug = slugify(productSlug);

    if (!slug) {
      setError("Enter a valid product slug before uploading images.");
      return;
    }

    if (images.length + files.length > MAX_IMAGES) {
      setError(`You can add up to ${MAX_IMAGES} images in this section.`);
      return;
    }

    setUploading(true);
    setError("");

    const uploaded: ProductContentImage[] = [];

    try {
      for (const file of Array.from(files)) {
        if (!ACCEPTED_TYPES.has(file.type)) {
          throw new Error(`${file.name}: use JPG, PNG, WEBP, or AVIF.`);
        }

        if (file.size <= 0 || file.size > MAX_FILE_SIZE) {
          throw new Error(`${file.name}: maximum file size is 10 MB.`);
        }

        const body = new FormData();
        body.append("file", file);
        body.append("folder", `buzzie-world/products/${slug}/${folderType}`);
        body.append("alt", file.name.replace(/\.[^.]+$/, ""));

        const response = await fetch("/api/media/upload", {
          method: "POST",
          body,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok || !data?.success) {
          throw new Error(data?.message || `Unable to upload ${file.name}.`);
        }

        const url = data.url || data.secureUrl;
        const publicId = data.publicId;

        if (typeof url !== "string" || !url) {
          throw new Error(`Upload returned no URL for ${file.name}.`);
        }

        uploaded.push({
          url,
          publicId: typeof publicId === "string" ? publicId : undefined,
          alt: file.name.replace(/\.[^.]+$/, ""),
          caption: "",
        });
      }

      onChange([...images, ...uploaded]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Image upload failed.");
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function updateImage(index: number, patch: Partial<ProductContentImage>) {
    onChange(images.map((image, i) => (i === index ? { ...image, ...patch } : image)));
  }

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction;

    if (target < 0 || target >= images.length) return;

    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <section className="rounded-2xl border border-border/70 bg-background p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          {/* <h3 className="text-base font-bold text-foreground">{title}</h3> */}
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
          <p className="mt-2 break-all text-xs text-muted-foreground">
            Folder: buzzie-world/products/{slugify(productSlug) || "<product-slug>"}/{folderType}/
          </p>
        </div>

        <button
          type="button"
          disabled={disabled || uploading || images.length >= MAX_IMAGES}
          onClick={() => inputRef.current?.click()}
          className="shrink-0 rounded-xl bg-[#C391EE] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#AD7CE0] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Add images"}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        hidden
        onChange={(event) => void handleFiles(event.target.files)}
      />

      {error && (
        <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {images.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-border p-8 text-center">
          <p className="text-sm font-semibold text-foreground">No images added yet</p>
          <p className="mt-1 text-xs text-muted-foreground">Upload images to build this section.</p>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {images.map((image, index) => (
            <article
              key={`${image.publicId || image.url}-${index}`}
              className="overflow-hidden rounded-xl border border-border/70 bg-background"
            >
              <div className="flex aspect-[4/3] items-center justify-center bg-slate-50 p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.alt || ""}
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="space-y-3 p-3">
                <p className="text-xs font-semibold text-muted-foreground">Image {index + 1}</p>

                <label className="block text-xs font-medium text-foreground">
                  Alt text
                  <input
                    value={image.alt || ""}
                    disabled={disabled}
                    onChange={(event) => updateImage(index, { alt: event.target.value })}
                    className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
                    placeholder="Describe this image"
                  />
                </label>

                <label className="block text-xs font-medium text-foreground">
                  Caption (optional)
                  <input
                    value={image.caption || ""}
                    disabled={disabled}
                    onChange={(event) => updateImage(index, { caption: event.target.value })}
                    className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
                    placeholder="Add a caption"
                  />
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={disabled || index === 0}
                    onClick={() => moveImage(index, -1)}
                    className="flex-1 rounded-lg border border-border px-2 py-2 text-xs font-semibold disabled:opacity-40"
                    title="Move image earlier"
                  >
                    ↑ Move up
                  </button>

                  <button
                    type="button"
                    disabled={disabled || index === images.length - 1}
                    onClick={() => moveImage(index, 1)}
                    className="flex-1 rounded-lg border border-border px-2 py-2 text-xs font-semibold disabled:opacity-40"
                    title="Move image later"
                  >
                    ↓ Move down
                  </button>

                  <button
                    type="button"
                    disabled={disabled || uploading}
                    onClick={() => removeImage(index)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        {images.length}/{MAX_IMAGES} images. Reordering and removal are saved when you save the
        product. Removing an image here does not delete the file from disk.
      </p>
    </section>
  );
}
