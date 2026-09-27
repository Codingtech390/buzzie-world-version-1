"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";

import {
  ArrowDown,
  ArrowUp,
  Check,
  CloudUpload,
  GripVertical,
  ImagePlus,
  Loader2,
  Star,
  Trash2,
  X,
} from "lucide-react";

import type { ProductImage } from "@/types/product";

interface ProductMediaProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  /**
   * Used to create a product-specific Cloudinary folder.
   *
   * Example:
   *   products/brain-binder
   *
   * If omitted, uploads fall back to:
   *   products
   */
  productSlug?: string;
  disabled?: boolean;
}

const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;

const ACCEPTED_EXTENSIONS = ".jpg,.jpeg,.png,.webp,.avif";

interface UploadState {
  uploading: boolean;
  current: number;
  total: number;
  fileName: string;
  error: string | null;
}

interface SignatureResponse {
  success: boolean;
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  resourceType: "image" | "video";
  publicId: string | null;
  message?: string;
}

interface CloudinaryUploadResponse {
  secure_url?: string;
  url?: string;
  public_id?: string;
  original_filename?: string;
  format?: string;
  resource_type?: string;
  error?: {
    message?: string;
  };
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function buildCloudinaryFolder(productSlug?: string): string {
  const safeSlug = productSlug ? slugify(productSlug) : "";

  if (safeSlug) {
    return `buzzie-world/products/${safeSlug}`;
  }

  return "buzzie-world/products";
}

function getFileExtension(file: File): string {
  const extension = file.name.split(".").pop()?.toLowerCase();

  return extension && /^[a-z0-9]+$/.test(extension) ? extension : "jpg";
}

function buildPublicId(file: File): string {
  const originalName = file.name.replace(/\.[^/.]+$/, "");

  const safeName = slugify(originalName) || "product-image";

  const uniquePart = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return `${safeName}-${uniquePart}`;
}

export default function ProductMedia({
  images,
  onChange,
  productSlug,
  disabled = false,
}: ProductMediaProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [alt, setAlt] = useState("");

  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    current: 0,
    total: 0,
    fileName: "",
    error: null,
  });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  /*
   * ------------------------------------------------------------
   * File picker
   * ------------------------------------------------------------
   */

  function openFilePicker() {
    if (disabled || uploadState.uploading) {
      return;
    }

    fileInputRef.current?.click();
  }

  /*
   * ------------------------------------------------------------
   * Validation
   * ------------------------------------------------------------
   */

  function validateFile(file: File): string | null {
    if (!ACCEPTED_TYPES.includes(file.type as (typeof ACCEPTED_TYPES)[number])) {
      return "Please select a JPG, PNG, WEBP, or AVIF image.";
    }

    if (file.size <= 0) {
      return "The selected image is empty or invalid.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "Image size must be 10 MB or smaller.";
    }

    return null;
  }

  /*
   * ------------------------------------------------------------
   * Request signed Cloudinary upload parameters
   * ------------------------------------------------------------
   *
   * The Cloudinary API secret NEVER reaches the browser.
   *
   * The browser asks our authenticated server for a signature.
   */

  async function getCloudinarySignature(): Promise<SignatureResponse> {
    const folder = buildCloudinaryFolder(productSlug);

    const response = await fetch("/api/media/signature", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        paramsToSign: {
          folder,
          resource_type: "image",
        },
      }),
    });

    let data: Partial<SignatureResponse> | null = null;

    try {
      data = await response.json();
    } catch {
      throw new Error("The media server returned an invalid response.");
    }

    if (!response.ok || !data?.success) {
      throw new Error(data?.message || `Unable to prepare the image upload. (${response.status})`);
    }

    if (!data.signature || !data.timestamp || !data.apiKey || !data.cloudName || !data.folder) {
      throw new Error("The media server returned incomplete Cloudinary upload credentials.");
    }

    return data as SignatureResponse;
  }

  /*
   * ------------------------------------------------------------
   * Upload one image directly to Cloudinary
   * ------------------------------------------------------------
   */

  async function uploadToCloudinary(file: File, imageAlt: string): Promise<ProductImage> {
    const signatureData = await getCloudinarySignature();

    const publicId = buildPublicId(file);

    /*
     * The signature route signs:
     *   folder
     *   timestamp
     *
     * Do not add arbitrary signed parameters here that weren't
     * included in the server-side signature.
     */

    const uploadEndpoint =
      `https://api.cloudinary.com/v1_1/` +
      `${encodeURIComponent(signatureData.cloudName)}/` +
      `${signatureData.resourceType}/upload`;

    const formData = new FormData();

    formData.append("file", file);
    formData.append("api_key", signatureData.apiKey);
    formData.append("timestamp", String(signatureData.timestamp));
    formData.append("signature", signatureData.signature);
    formData.append("folder", signatureData.folder);

    /*
     * public_id is intentionally NOT sent.
     *
     * The server signs only folder + timestamp, so sending an
     * unsigned public_id would not be correct.
     *
     * Cloudinary will generate a unique public ID automatically.
     */

    let response: Response;

    try {
      response = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      console.error("Cloudinary network error:", error);

      throw new Error(
        "Unable to connect to Cloudinary. Please check your internet connection and try again.",
      );
    }

    let data: CloudinaryUploadResponse | null = null;

    try {
      data = await response.json();
    } catch {
      throw new Error("Cloudinary returned an invalid upload response.");
    }

    if (!response.ok || !data?.secure_url || !data?.public_id) {
      const cloudinaryMessage = data?.error?.message?.trim();

      throw new Error(cloudinaryMessage || `Cloudinary could not upload "${file.name}".`);
    }

    return {
      url: data.secure_url,
      publicId: data.public_id,
      alt: imageAlt.trim() || undefined,
    };
  }

  /*
   * ------------------------------------------------------------
   * Upload multiple images
   * ------------------------------------------------------------
   */

  async function handleFiles(files: FileList | File[]) {
    if (disabled || uploadState.uploading) {
      return;
    }

    const fileArray = Array.from(files);

    if (fileArray.length === 0) {
      return;
    }

    if (images.length >= MAX_IMAGES) {
      setUploadState({
        uploading: false,
        current: 0,
        total: 0,
        fileName: "",
        error: `You can add a maximum of ${MAX_IMAGES} product images.`,
      });

      return;
    }

    const remainingSlots = MAX_IMAGES - images.length;

    const filesToUpload = fileArray.slice(0, remainingSlots);

    /*
     * Keep this local array updated during the upload process.
     *
     * This prevents the stale `images` closure bug that would
     * otherwise cause multiple selected images to overwrite
     * each other.
     */
    let nextImages = [...images];

    if (fileArray.length > remainingSlots) {
      setUploadState({
        uploading: false,
        current: 0,
        total: 0,
        fileName: "",
        error: `Only ${remainingSlots} image${
          remainingSlots === 1 ? "" : "s"
        } can be added. Maximum is ${MAX_IMAGES}.`,
      });
    } else {
      setUploadState({
        uploading: false,
        current: 0,
        total: filesToUpload.length,
        fileName: "",
        error: null,
      });
    }

    /*
     * Validate everything before uploading anything.
     *
     * This prevents a selection containing one invalid file from
     * partially uploading before the user discovers the error.
     */
    const validationErrors = filesToUpload
      .map((file) => ({
        file,
        error: validateFile(file),
      }))
      .filter(
        (
          item,
        ): item is {
          file: File;
          error: string;
        } => Boolean(item.error),
      );

    if (validationErrors.length > 0) {
      const firstError = validationErrors[0];

      setUploadState({
        uploading: false,
        current: 0,
        total: 0,
        fileName: "",
        error: `${firstError.file.name}: ${firstError.error}`,
      });

      return;
    }

    /*
     * ----------------------------------------------------------
     * Upload sequentially
     * ----------------------------------------------------------
     *
     * Sequential uploads are intentional here:
     * - predictable progress
     * - easier error handling
     * - less pressure on Cloudinary
     * - prevents state races
     */

    for (let index = 0; index < filesToUpload.length; index += 1) {
      const file = filesToUpload[index];

      try {
        setUploadState({
          uploading: true,
          current: index + 1,
          total: filesToUpload.length,
          fileName: file.name,
          error: null,
        });

        const uploadedImage = await uploadToCloudinary(file, alt);

        nextImages = [...nextImages, uploadedImage];

        /*
         * Update parent after every successful upload.
         *
         * If image #3 fails, images #1 and #2 remain available.
         */
        onChange(nextImages);
      } catch (error) {
        console.error(`Product image upload failed for "${file.name}":`, error);

        const message =
          error instanceof Error ? error.message : "Image upload failed. Please try again.";

        setUploadState({
          uploading: false,
          current: index + 1,
          total: filesToUpload.length,
          fileName: file.name,
          error: `${file.name}: ${message}`,
        });

        /*
         * Stop the batch after a failure.
         *
         * Already uploaded images remain in the product state.
         */
        return;
      }
    }

    setUploadState({
      uploading: false,
      current: 0,
      total: 0,
      fileName: "",
      error: null,
    });

    /*
     * Clear the alt field after a successful batch.
     */
    setAlt("");
  }

  /*
   * ------------------------------------------------------------
   * File input
   * ------------------------------------------------------------
   */

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;

    if (files) {
      void handleFiles(files);
    }

    /*
     * Reset the input so selecting the same image again still
     * triggers onChange.
     */
    event.target.value = "";
  }

  /*
   * ------------------------------------------------------------
   * Remove
   * ------------------------------------------------------------
   *
   * We intentionally don't delete from Cloudinary here.
   *
   * ProductMedia only changes the product's local image array.
   * Server-side cleanup should happen after the product update
   * succeeds.
   */

  function removeImage(index: number) {
    if (disabled || uploadState.uploading) {
      return;
    }

    if (index < 0 || index >= images.length) {
      return;
    }

    const imageToRemove = images[index];

    console.info("Removing product image:", {
      url: imageToRemove?.url,
      publicId: imageToRemove?.publicId,
    });

    const nextImages = images.filter((_, imageIndex) => imageIndex !== index);

    onChange(nextImages);
  }

  /*
   * ------------------------------------------------------------
   * Reorder
   * ------------------------------------------------------------
   */

  function moveImage(index: number, direction: "up" | "down") {
    if (disabled || uploadState.uploading) {
      return;
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (index < 0 || index >= images.length || targetIndex < 0 || targetIndex >= images.length) {
      return;
    }

    const nextImages = [...images];

    [nextImages[index], nextImages[targetIndex]] = [nextImages[targetIndex], nextImages[index]];

    onChange(nextImages);
  }

  /*
   * ------------------------------------------------------------
   * Primary image
   * ------------------------------------------------------------
   *
   * The first image is always the primary image.
   */

  function setPrimary(index: number) {
    if (disabled || uploadState.uploading || index === 0 || index < 0 || index >= images.length) {
      return;
    }

    const nextImages = [...images];

    const [selectedImage] = nextImages.splice(index, 1);

    if (!selectedImage) {
      return;
    }

    nextImages.unshift(selectedImage);

    onChange(nextImages);
  }

  /*
   * ------------------------------------------------------------
   * Drag and drop
   * ------------------------------------------------------------
   */

  function handleDragStart(event: DragEvent<HTMLDivElement>, index: number) {
    if (disabled || uploadState.uploading) {
      return;
    }

    setDraggedIndex(index);

    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index));
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    if (disabled || uploadState.uploading) {
      return;
    }

    event.preventDefault();

    event.dataTransfer.dropEffect = "move";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, targetIndex: number) {
    event.preventDefault();

    if (
      disabled ||
      uploadState.uploading ||
      draggedIndex === null ||
      draggedIndex === targetIndex
    ) {
      setDraggedIndex(null);
      return;
    }

    const nextImages = [...images];

    const [movedImage] = nextImages.splice(draggedIndex, 1);

    if (!movedImage) {
      setDraggedIndex(null);
      return;
    }

    nextImages.splice(targetIndex, 0, movedImage);

    onChange(nextImages);

    setDraggedIndex(null);
  }

  function handleDragEnd() {
    setDraggedIndex(null);
  }

  /*
   * ------------------------------------------------------------
   * Upload progress
   * ------------------------------------------------------------
   */

  const uploadPercentage =
    uploadState.uploading && uploadState.total > 0
      ? Math.round(((uploadState.current - 1) / uploadState.total) * 100)
      : 0;

  /*
   * ------------------------------------------------------------
   * Render
   * ------------------------------------------------------------
   */

  return (
    <section className="space-y-5">
      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#C391EE]/20 bg-[#C391EE]/10 text-[#8C55C7]">
            <ImagePlus className="h-[18px] w-[18px]" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-slate-900">
                Product Media
              </h2>

              {images.length > 0 && (
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                  {images.length} {images.length === 1 ? "image" : "images"}
                </span>
              )}
            </div>

            <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
              Upload, organize, and choose the primary product images customers will see.
            </p>
          </div>
        </div>

        <div className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-500 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C391EE]" />
          {images.length}/{MAX_IMAGES}
        </div>
      </div>

      {/* ======================================================
          UPLOAD CARD
      ======================================================= */}

      <div
        className={[
          "relative overflow-hidden rounded-2xl border",
          "border-slate-200 bg-white",
          "shadow-[0_10px_35px_rgba(15,23,42,0.045)]",
          disabled ? "opacity-60" : "",
        ].join(" ")}
      >
        {/* Decorative glow */}

        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#C391EE]/10 blur-3xl" />

        <div className="relative p-4 sm:p-5">
          <div
            role="button"
            tabIndex={disabled || uploadState.uploading ? -1 : 0}
            aria-disabled={disabled || uploadState.uploading}
            onClick={openFilePicker}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();

                openFilePicker();
              }
            }}
            onDragOver={(event) => {
              if (disabled || uploadState.uploading) {
                return;
              }

              event.preventDefault();

              event.dataTransfer.dropEffect = "copy";
            }}
            onDrop={(event) => {
              if (disabled || uploadState.uploading) {
                return;
              }

              event.preventDefault();

              const files = event.dataTransfer.files;

              if (files.length > 0) {
                void handleFiles(files);
              }
            }}
            className={[
              "group relative flex min-h-[190px]",
              "cursor-pointer flex-col items-center",
              "justify-center overflow-hidden rounded-xl",
              "border border-dashed border-slate-300",
              "bg-gradient-to-br from-slate-50/80 via-white to-[#C391EE]/[0.06]",
              "px-5 py-8 text-center",
              "transition-all duration-300",
              disabled || uploadState.uploading
                ? "cursor-not-allowed"
                : "hover:border-[#C391EE]/60 hover:bg-[#C391EE]/[0.035] hover:shadow-[inset_0_0_0_1px_rgba(195,145,238,0.08)]",
            ].join(" ")}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(195,145,238,0.08),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div
              className={[
                "relative mb-4 flex h-14 w-14 items-center justify-center",
                "rounded-2xl border border-[#C391EE]/15",
                "bg-white text-[#8C55C7]",
                "shadow-[0_8px_25px_rgba(195,145,238,0.14)]",
                "transition-transform duration-300",
                uploadState.uploading ? "" : "group-hover:-translate-y-0.5 group-hover:scale-105",
              ].join(" ")}
            >
              {uploadState.uploading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <CloudUpload className="h-6 w-6" />
              )}
            </div>

            <p className="relative text-sm font-semibold text-slate-800">
              {uploadState.uploading
                ? `Uploading ${uploadState.current} of ${uploadState.total}`
                : "Upload product images"}
            </p>

            {uploadState.uploading ? (
              <>
                <p className="relative mt-1 max-w-md truncate px-4 text-xs text-slate-500">
                  {uploadState.fileName}
                </p>

                <div className="relative mt-4 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-[#C391EE] transition-all duration-300"
                    style={{
                      width: `${Math.max(5, uploadPercentage)}%`,
                    }}
                  />
                </div>

                <p className="relative mt-2 text-[10px] font-medium text-slate-400">
                  Preparing secure upload...
                </p>
              </>
            ) : (
              <>
                <p className="relative mt-1 max-w-md text-xs leading-5 text-slate-500">
                  Drag and drop images here or click to browse. JPG, PNG, WEBP and AVIF up to 10 MB
                  each.
                </p>

                <span className="relative mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-[#C391EE] px-4 text-xs font-semibold text-white shadow-[0_5px_15px_rgba(195,145,238,0.25)] transition-all hover:bg-[#E83D59] hover:shadow-[0_7px_18px_rgba(232,61,89,0.2)]">
                  <ImagePlus className="h-3.5 w-3.5" />
                  Choose images
                </span>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            multiple
            disabled={disabled || uploadState.uploading || images.length >= MAX_IMAGES}
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="mt-3 flex flex-col gap-2 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>Maximum {MAX_IMAGES} images per product</span>

            <span>Maximum 10 MB per image</span>
          </div>
        </div>
      </div>

      {/* ======================================================
          ERROR
      ======================================================= */}

      {uploadState.error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/80 px-4 py-3 shadow-sm">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <X className="h-3.5 w-3.5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-rose-800">Image upload issue</p>

            <p className="mt-0.5 break-words text-xs leading-5 text-rose-700">
              {uploadState.error}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setUploadState({
                uploading: false,
                current: 0,
                total: 0,
                fileName: "",
                error: null,
              })
            }
            className="rounded-lg p-1.5 text-rose-500 transition hover:bg-rose-100 hover:text-rose-700"
            aria-label="Dismiss upload error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ======================================================
          ALT TEXT
      ======================================================= */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_6px_22px_rgba(15,23,42,0.035)]">
        <div className="flex flex-col gap-1">
          <label htmlFor="product-image-alt" className="text-xs font-semibold text-slate-700">
            Default image alt text
          </label>

          <p className="text-[11px] leading-4 text-slate-400">
            Used for newly uploaded images. Existing image alt text remains unchanged.
          </p>
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            id="product-image-alt"
            type="text"
            value={alt}
            onChange={(event) => setAlt(event.target.value)}
            maxLength={160}
            placeholder="Example: Brain Binder educational activity book"
            disabled={disabled || uploadState.uploading}
            className="h-10 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#C391EE] focus:bg-white focus:ring-4 focus:ring-[#C391EE]/10 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <div className="flex h-10 shrink-0 items-center rounded-xl bg-slate-50 px-3 text-[10px] font-medium text-slate-400">
            {alt.length}/160
          </div>
        </div>
      </div>

      {/* ======================================================
          EMPTY STATE
      ======================================================= */}

      {images.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/40 px-5 py-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 shadow-sm">
            <ImagePlus className="h-5 w-5" />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-700">No product images yet</p>

          <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
            Upload clear product photography above. The first image automatically becomes the
            primary image.
          </p>
        </div>
      ) : (
        /* ====================================================
           IMAGE GRID
        ===================================================== */
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Uploaded images
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Drag cards to reorder. The first image is the primary product image.
              </p>
            </div>

            {images.length > 1 && (
              <span className="text-[10px] font-medium text-slate-400">
                {images.length} images arranged
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {images.map((image, index) => {
              const isPrimary = index === 0;
              const isDragging = draggedIndex === index;

              return (
                <div
                  key={`${image.publicId || image.url}-${index}`}
                  draggable={!disabled && !uploadState.uploading}
                  onDragStart={(event) => handleDragStart(event, index)}
                  onDragOver={handleDragOver}
                  onDrop={(event) => handleDrop(event, index)}
                  onDragEnd={handleDragEnd}
                  className={[
                    "group overflow-hidden rounded-2xl border bg-white",
                    "shadow-[0_8px_28px_rgba(15,23,42,0.055)]",
                    "transition-all duration-200",
                    isDragging
                      ? "scale-[0.98] border-[#C391EE] opacity-50"
                      : "border-slate-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_16px_38px_rgba(15,23,42,0.09)]",
                  ].join(" ")}
                >
                  {/* ------------------------------------------
                      IMAGE PREVIEW
                  ------------------------------------------- */}

                  <div className="relative aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={image.url}
                      alt={image.alt || "Product image"}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                    />

                    {/* Image overlay */}

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                    {/* Drag handle */}

                    <div
                      className="absolute left-3 top-3 flex h-8 w-8 cursor-grab items-center justify-center rounded-lg border border-white/50 bg-white/90 text-slate-500 shadow-sm backdrop-blur active:cursor-grabbing"
                      title="Drag to reorder"
                    >
                      <GripVertical className="h-4 w-4" />
                    </div>

                    {/* Primary badge */}

                    {isPrimary && (
                      <div className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#C391EE] px-2.5 py-1.5 text-[10px] font-bold text-white shadow-lg">
                        <Star className="h-3 w-3 fill-current" />
                        Primary
                      </div>
                    )}

                    {/* Image number */}

                    <div className="absolute bottom-3 left-3 rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
                      Image {index + 1}
                    </div>
                  </div>

                  {/* ------------------------------------------
                      DETAILS
                  ------------------------------------------- */}

                  <div className="space-y-3 p-4">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-800">
                        {image.alt || "Product image"}
                      </p>

                      {image.publicId && (
                        <p
                          className="mt-1 truncate text-[10px] text-slate-400"
                          title={image.publicId}
                        >
                          {image.publicId}
                        </p>
                      )}
                    </div>

                    {/* Controls */}

                    <div className="grid grid-cols-4 gap-1.5">
                      <button
                        type="button"
                        onClick={() => moveImage(index, "up")}
                        disabled={disabled || uploadState.uploading || index === 0}
                        title="Move up"
                        aria-label={`Move image ${index + 1} up`}
                        className="flex h-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#C391EE]/40 hover:bg-[#C391EE]/5 hover:text-[#8C55C7] disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => moveImage(index, "down")}
                        disabled={disabled || uploadState.uploading || index === images.length - 1}
                        title="Move down"
                        aria-label={`Move image ${index + 1} down`}
                        className="flex h-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#C391EE]/40 hover:bg-[#C391EE]/5 hover:text-[#8C55C7] disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setPrimary(index)}
                        disabled={disabled || uploadState.uploading || isPrimary}
                        title={isPrimary ? "Already primary" : "Set as primary"}
                        aria-label={`Set image ${index + 1} as primary`}
                        className="flex h-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#C391EE]/40 hover:bg-[#C391EE]/5 hover:text-[#8C55C7] disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        {isPrimary ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Star className="h-3.5 w-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        disabled={disabled || uploadState.uploading}
                        title="Remove image"
                        aria-label={`Remove image ${index + 1}`}
                        className="flex h-9 items-center justify-center rounded-lg border border-rose-200 text-rose-500 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

