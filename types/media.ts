import type { MediaResourceType, MediaStatus } from "@/models/Media";

export interface MediaItem {
  _id: string;

  name: string;

  key: string;

  slot?: string;

  resourceType: MediaResourceType;

  url: string;

  secureUrl: string;

  publicId: string;

  folder?: string;

  format?: string;

  mimeType?: string;

  bytes?: number;

  width?: number;

  height?: number;

  duration?: number;

  thumbnailUrl?: string;

  alt?: string;

  title?: string;

  description?: string;

  status: MediaStatus;

  sortOrder: number;

  createdAt: string;

  updatedAt: string;
}

export interface MediaResponse {
  success: boolean;

  media?: MediaItem;

  message?: string;
}

export interface MediaListResponse {
  success: boolean;

  media: MediaItem[];

  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  message?: string;
}
