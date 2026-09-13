import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongoose";
import { Media } from "@/models/Media";

export interface CreateMediaInput {
  name: string;

  key: string;

  slot?: string;

  resourceType: "image" | "video" | "raw";

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

  status?: "active" | "inactive";

  sortOrder?: number;

  createdBy?: string;
}

export interface UpdateMediaInput {
  name?: string;

  key?: string;

  slot?: string;

  alt?: string;

  title?: string;

  description?: string;

  status?: "active" | "inactive";

  sortOrder?: number;
}

function serializeMedia(media: any) {
  return {
    _id: String(media._id),
    name: media.name,
    key: media.key,
    slot: media.slot,
    resourceType: media.resourceType,
    url: media.url,
    secureUrl: media.secureUrl,
    publicId: media.publicId,
    folder: media.folder,
    format: media.format,
    mimeType: media.mimeType,
    bytes: media.bytes,
    width: media.width,
    height: media.height,
    duration: media.duration,
    thumbnailUrl: media.thumbnailUrl,
    alt: media.alt,
    title: media.title,
    description: media.description,
    status: media.status,
    sortOrder: media.sortOrder,
    createdAt: media.createdAt,
    updatedAt: media.updatedAt,
  };
}

export async function createMedia(input: CreateMediaInput) {
  await connectToDatabase();

  const media = await Media.create({
    ...input,
    createdBy:
      input.createdBy && Types.ObjectId.isValid(input.createdBy)
        ? new Types.ObjectId(input.createdBy)
        : undefined,
  });

  return serializeMedia(media.toObject());
}

export async function getMediaById(id: string) {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  const media = await Media.findById(id).lean();

  return media ? serializeMedia(media) : null;
}

export async function getMediaByKey(key: string) {
  await connectToDatabase();

  const media = await Media.findOne({
    key: key.trim().toLowerCase(),
    status: "active",
  }).lean();

  return media ? serializeMedia(media) : null;
}

export async function getMediaByKeys(keys: string[]) {
  await connectToDatabase();

  const normalizedKeys = keys.map((key) => key.trim().toLowerCase()).filter(Boolean);

  if (!normalizedKeys.length) {
    return [];
  }

  const media = await Media.find({
    key: {
      $in: normalizedKeys,
    },
    status: "active",
  })
    .sort({
      sortOrder: 1,
    })
    .lean();

  const serialized = media.map(serializeMedia);

  return normalizedKeys.map((key) => serialized.find((item) => item.key === key)).filter(Boolean);
}
export async function getAdminMedia(options?: {
  page?: number;
  limit?: number;
  search?: string;
  resourceType?: string;
  status?: string;
}) {
  await connectToDatabase();

  const page = Math.max(Number(options?.page) || 1, 1);

  const limit = Math.min(Math.max(Number(options?.limit) || 20, 1), 100);

  const filter: Record<string, any> = {};

  if (options?.resourceType && ["image", "video", "raw"].includes(options.resourceType)) {
    filter.resourceType = options.resourceType;
  }

  if (options?.status && ["active", "inactive"].includes(options.status)) {
    filter.status = options.status;
  }

  if (options?.search?.trim()) {
    const search = options.search.trim();

    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        key: {
          $regex: search,
          $options: "i",
        },
      },
      {
        publicId: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const [media, total] = await Promise.all([
    Media.find(filter)
      .sort({
        sortOrder: 1,
        createdAt: -1,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    Media.countDocuments(filter),
  ]);

  return {
    media: media.map(serializeMedia),

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function updateMedia(id: string, input: UpdateMediaInput) {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  const update: Record<string, unknown> = {};

  if (input.name !== undefined) {
    update.name = input.name.trim();
  }

  if (input.key !== undefined) {
    update.key = input.key.trim().toLowerCase();
  }

  if (input.slot !== undefined) {
    update.slot = input.slot.trim();
  }

  if (input.alt !== undefined) {
    update.alt = input.alt.trim();
  }

  if (input.title !== undefined) {
    update.title = input.title.trim();
  }

  if (input.description !== undefined) {
    update.description = input.description.trim();
  }

  if (input.status !== undefined) {
    update.status = input.status;
  }

  if (input.sortOrder !== undefined) {
    update.sortOrder = Number(input.sortOrder);
  }

  const media = await Media.findByIdAndUpdate(
    id,
    {
      $set: update,
    },
    {
      new: true,
      runValidators: true,
    },
  ).lean();

  return media ? serializeMedia(media) : null;
}

export async function deleteMediaRecord(id: string) {
  await connectToDatabase();

  if (!Types.ObjectId.isValid(id)) {
    return null;
  }

  return Media.findByIdAndDelete(id).lean();
}
