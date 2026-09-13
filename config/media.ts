export const MEDIA_CONFIG = {
  cloudinaryRootFolder: "buzzie-world",

  folders: {
    products: "buzzie-world/products",
    productVideos: "buzzie-world/products/videos",
    homepage: "buzzie-world/homepage",
    homepageVideos: "buzzie-world/homepage/videos",
    instagram: "buzzie-world/instagram",
    instagramVideos: "buzzie-world/instagram/videos",
    banners: "buzzie-world/banners",
    categories: "buzzie-world/categories",
    brands: "buzzie-world/brands",
    blog: "buzzie-world/blog",
  },

  limits: {
    videoMaxBytes: 500 * 1024 * 1024,
    imageMaxBytes: 20 * 1024 * 1024,
  },

  allowedVideoFormats: ["mp4", "mov", "webm", "m4v"],

  allowedImageFormats: ["jpg", "jpeg", "png", "webp", "avif"],
} as const;

export const MEDIA_SLOTS = {
  INSTAGRAM_VIDEO_1: "instagram-video-1",
  INSTAGRAM_VIDEO_2: "instagram-video-2",
  INSTAGRAM_VIDEO_3: "instagram-video-3",
  INSTAGRAM_VIDEO_4: "instagram-video-4",
  INSTAGRAM_VIDEO_5: "instagram-video-5",
} as const;

export type MediaSlot = (typeof MEDIA_SLOTS)[keyof typeof MEDIA_SLOTS];
