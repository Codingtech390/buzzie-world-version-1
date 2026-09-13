"use client";

import { CldUploadWidget } from "next-cloudinary";

interface CloudinaryUploadInfo {
  public_id?: string;
  secure_url?: string;
  url?: string;
  resource_type?: string;
  type?: string;
  format?: string;
  bytes?: number;
  width?: number;
  height?: number;
  duration?: number;
  original_filename?: string;
  folder?: string;
}

interface CloudinaryUploadResult {
  info?: CloudinaryUploadInfo | string;
}

interface CloudinaryMediaUploaderProps {
  folder: string;

  resourceType?: "image" | "video";

  onSuccess: (info: CloudinaryUploadInfo) => void;

  onError?: (error: unknown) => void;
}

export default function CloudinaryMediaUploader({
  folder,
  resourceType = "video",
  onSuccess,
  onError,
}: CloudinaryMediaUploaderProps) {
  return (
    <CldUploadWidget
      signatureEndpoint="/api/media/signature"
      options={{
        resourceType,
        folder,
        sources: ["local"],
        multiple: false,
        maxFiles: 1,
        clientAllowedFormats:
          resourceType === "video"
            ? ["mp4", "mov", "webm", "m4v"]
            : ["jpg", "jpeg", "png", "webp", "avif"],
        maxChunkSize: 20_000_000,
        singleUploadAutoClose: true,
      }}
      onSuccess={(result) => {
        const uploadResult = result as CloudinaryUploadResult;

        if (!uploadResult.info || typeof uploadResult.info === "string") {
          return;
        }

        onSuccess(uploadResult.info);
      }}
      onError={(error) => {
        onError?.(error);
      }}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          className="
            inline-flex
            items-center
            justify-center
            rounded-xl
            bg-[#C391EE]
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            transition-colors
            hover:bg-[#E83D59]
          "
        >
          Upload Video
        </button>
      )}
    </CldUploadWidget>
  );
}
