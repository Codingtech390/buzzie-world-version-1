

import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

const ALLOWED_VIDEO_TYPES = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "video/x-m4v": "m4v",
} as const;

type AllowedVideoMimeType = keyof typeof ALLOWED_VIDEO_TYPES;

interface DetectedVideo {
  mimeType: AllowedVideoMimeType;
  extension: "mp4" | "webm" | "mov" | "m4v";
}

export interface SavedLocalVideo {
  url: string;
  publicId: string;
  folder: string;
  format: string;
  mimeType: AllowedVideoMimeType;
  bytes: number;
}

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;

type AllowedImageMimeType = (typeof ALLOWED_MIME_TYPES)[number];

interface DetectedImage {
  mimeType: AllowedImageMimeType;
  extension: "jpg" | "png" | "webp" | "avif";
}

export interface SavedLocalImage {
  url: string;
  publicId: string;
  folder: string;
  format: string;
  mimeType: AllowedImageMimeType;
  bytes: number;
}

export interface ReadLocalMediaResult {
  buffer: Buffer;
  mimeType: AllowedImageMimeType | AllowedVideoMimeType;
}

function getStorageRoot(): string {
  const configuredRoot = process.env.MEDIA_LOCAL_ROOT?.trim();

  if (!configuredRoot) {
    return path.resolve(process.cwd(), "media-storage");
  }

  return path.resolve(configuredRoot);
}

function normalizeRelativePath(value: string): string {
  const normalized = value.replace(/\\/g, "/").replace(/^\/+/, "");

  const segments = normalized.split("/");

  if (
    !normalized ||
    segments.some(
      (segment) =>
        !segment ||
        segment === "." ||
        segment === ".." ||
        segment.includes("\0") ||
        segment.includes(":"),
    )
  ) {
    throw new Error("Invalid media path.");
  }

  return segments.join("/");
}

function resolveInsideStorage(relativePath: string): string {
  const safeRelativePath = normalizeRelativePath(relativePath);
  const root = getStorageRoot();
  const absolutePath = path.resolve(root, safeRelativePath);
  const relative = path.relative(root, absolutePath);

  if (
    !relative ||
    relative === "." ||
    relative.startsWith(`..${path.sep}`) ||
    relative === ".." ||
    path.isAbsolute(relative)
  ) {
    throw new Error("Media path is outside the storage directory.");
  }

  return absolutePath;
}

function detectImage(buffer: Buffer): DetectedImage | null {
  // JPEG
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mimeType: "image/jpeg", extension: "jpg" };
  }

  // PNG
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return { mimeType: "image/png", extension: "png" };
  }

  // WebP: RIFF....WEBP
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return { mimeType: "image/webp", extension: "webp" };
  }

  // AVIF: ISO-BMFF ftyp box with an AVIF-compatible brand.
  if (buffer.length >= 12 && buffer.toString("ascii", 4, 8) === "ftyp") {
    const boxEnd = Math.min(buffer.length, 128);
    const brands = buffer.toString("ascii", 8, boxEnd);

    if (brands.includes("avif") || brands.includes("avis")) {
      return { mimeType: "image/avif", extension: "avif" };
    }
  }

  return null;
}

function detectVideo(
  buffer: Buffer,
  extension: string,
): DetectedVideo | null {
  // WebM: EBML header signature.
  if (
    extension === "webm" &&
    buffer.length >= 4 &&
    buffer.subarray(0, 4).equals(
      Buffer.from([0x1a, 0x45, 0xdf, 0xa3]),
    )
  ) {
    return { mimeType: "video/webm", extension: "webm" };
  }

  // MP4, MOV and M4V use an ISO Base Media File Format container.
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 4, 8) === "ftyp"
  ) {
    const boxSize = buffer.readUInt32BE(0);

    if (boxSize < 8) {
      return null;
    }

    const boxEnd = Math.min(buffer.length, boxSize, 4096);
    const brands = buffer.toString("ascii", 8, boxEnd);

    if (extension === "mov" && brands.includes("qt")) {
      return {
        mimeType: "video/quicktime",
        extension: "mov",
      };
    }

    if (
      extension === "m4v" &&
      (brands.includes("M4V") || brands.includes("m4v"))
    ) {
      return {
        mimeType: "video/x-m4v",
        extension: "m4v",
      };
    }

    if (
      extension === "mp4" &&
      !brands.includes("qt") &&
      !brands.includes("M4V") &&
      !brands.includes("m4v")
    ) {
      return {
        mimeType: "video/mp4",
        extension: "mp4",
      };
    }
  }

  return null;
}


function validateFolder(folder: string): string {
  const normalized = folder
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "");

const allowedFolder =
  /^buzzie-world\/(?:products(?:\/[a-z0-9][a-z0-9-]{0,79}(?:\/(?:gallery|carousel|a-plus|how-to-play|video))?)?|banners|categories|brands|homepage|playdates)$/.test(
    normalized,
  );

  if (!allowedFolder) {
    throw new Error("The requested media folder is not allowed.");
  }

  return normalized;
}


export async function saveLocalImage(
  file: File,
  requestedFolder: string,
): Promise<SavedLocalImage> {
  if (!(file instanceof File)) {
    throw new Error("A valid image file is required.");
  }

  if (file.size <= 0) {
    throw new Error("The selected image is empty.");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Image size must be 10 MB or smaller.");
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type as AllowedImageMimeType)) {
    throw new Error("Only JPEG, PNG, WEBP, and AVIF images are supported.");
  }

  const folder = validateFolder(requestedFolder);
  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = detectImage(buffer);

  if (!detected) {
    throw new Error("The uploaded file is not a supported image.");
  }

  // Reject MIME/signature mismatches.
  if (detected.mimeType !== file.type) {
    throw new Error("The image's content does not match its declared file type.");
  }

  const filename = `${randomUUID()}.${detected.extension}`;
  const relativePath = `${folder}/${filename}`;
  const absolutePath = resolveInsideStorage(relativePath);

  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, buffer, { flag: "wx" });

  return {
    url: `/api/media/files/${relativePath.split("/").map(encodeURIComponent).join("/")}`,
    publicId: relativePath,
    folder,
    format: detected.extension,
    mimeType: detected.mimeType,
    bytes: buffer.byteLength,
  };
}

export async function saveLocalVideo(
  file: File,
  requestedFolder: string,
): Promise<SavedLocalVideo> {
  if (!(file instanceof File)) {
    throw new Error("A valid video file is required.");
  }

  if (file.size <= 0) {
    throw new Error("The selected video is empty.");
  }

  if (file.size > MAX_VIDEO_BYTES) {
    throw new Error("Video size must be 100 MB or smaller.");
  }

  const extension = file.name
    .slice(file.name.lastIndexOf(".") + 1)
    .toLowerCase();

  if (
    !["mp4", "webm", "mov", "m4v"].includes(extension) ||
    !(file.type in ALLOWED_VIDEO_TYPES)
  ) {
    throw new Error("Only MP4, WebM, MOV, and M4V videos are supported.");
  }

  const folder = validateFolder(requestedFolder);

  if (
    !/^buzzie-world\/products\/[a-z0-9][a-z0-9-]{0,79}\/video$/.test(
      folder,
    )
  ) {
    throw new Error(
      "Videos can only be saved in a product's video folder.",
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = detectVideo(buffer, extension);

  if (!detected) {
    throw new Error(
      "The uploaded file does not contain a supported video format.",
    );
  }

  if (detected.mimeType !== file.type) {
    throw new Error(
      "The video's content does not match its declared file type.",
    );
  }

  const filename = `${randomUUID()}.${detected.extension}`;
  const relativePath = `${folder}/${filename}`;
  const absolutePath = resolveInsideStorage(relativePath);

  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, buffer, { flag: "wx" });

  return {
    url: `/api/media/files/${relativePath
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`,
    publicId: relativePath,
    folder,
    format: detected.extension,
    mimeType: detected.mimeType,
    bytes: buffer.byteLength,
  };
}


export async function readLocalMedia(
  relativePath: string,
): Promise<ReadLocalMediaResult | null> {
  let safePath: string;

  try {
    safePath = normalizeRelativePath(relativePath);
  } catch {
    return null;
  }

  let absolutePath: string;

  try {
    absolutePath = resolveInsideStorage(safePath);
  } catch {
    return null;
  }

  try {
    const buffer = await readFile(absolutePath);

    // Preserve existing image validation.
    if (/\.(jpg|png|webp|avif)$/i.test(safePath)) {
      const detected = detectImage(buffer);

      if (!detected) {
        return null;
      }

      return {
        buffer,
        mimeType: detected.mimeType,
      };
    }

    // Validate supported video formats using their file signatures.
    const videoExtension = safePath
      .split("/")
      .pop()
      ?.split(".")
      .pop()
      ?.toLowerCase();

    if (
      !videoExtension ||
      !["mp4", "webm", "mov", "m4v"].includes(videoExtension)
    ) {
      return null;
    }

    const detected = detectVideo(buffer, videoExtension);

    if (!detected) {
      return null;
    }

    return {
      buffer,
      mimeType: detected.mimeType,
    };
  } catch {
    return null;
  }
}

export async function deleteLocalMedia(relativePath: string): Promise<boolean> {
  // This helper is available for future server-side cleanup.
  // It is intentionally not exposed through a public delete endpoint.
  const safePath = normalizeRelativePath(relativePath);
  const absolutePath = resolveInsideStorage(safePath);

  const allowedExtension = /\.(jpg|png|webp|avif)$/i.test(safePath);

  if (!allowedExtension) {
    throw new Error("Only supported image files can be deleted.");
  }

  const { unlink } = await import("node:fs/promises");

  try {
    await unlink(absolutePath);
    return true;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return false;
    }

    throw error;
  }
}
