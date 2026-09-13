import { v2 as cloudinary } from "cloudinary";

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary environment variables are not configured. " +
        "Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env.local.",
    );
  }

  return {
    cloudName,
    apiKey,
    apiSecret,
  };
}

function configureCloudinary() {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  return {
    cloudName,
    apiKey,
    apiSecret,
  };
}

export { cloudinary };

export function getCloudinaryCloudName(): string {
  return configureCloudinary().cloudName;
}

export function signCloudinaryParams(params: Record<string, string | number>): string {
  const { apiSecret } = configureCloudinary();

  return cloudinary.utils.api_sign_request(params, apiSecret);
}

export async function deleteCloudinaryAsset(
  publicId: string,
  resourceType: "image" | "video" | "raw" = "image",
) {
  configureCloudinary();

  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
    type: "upload",
    invalidate: true,
  });
}
