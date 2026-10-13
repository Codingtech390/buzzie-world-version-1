import { connectToDatabase } from "@/lib/mongoose";
import { SiteSetting } from "@/models/SiteSetting";
import { defaultSiteSettings, settingsSchema, type SiteSettings } from "@/types/settings";

function toSettings(value: Record<string, unknown> | null | undefined): SiteSettings {
  const settingsOnly = Object.fromEntries(
    Object.keys(defaultSiteSettings).map((key) => [
      key,
      value?.[key] ?? defaultSiteSettings[key as keyof SiteSettings],
    ]),
  );

  const parsed = settingsSchema.safeParse(settingsOnly);

  if (!parsed.success) {
    throw new Error("Stored site settings are invalid. Review the settings document in MongoDB.");
  }

  return parsed.data;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  await connectToDatabase();

  const document = await SiteSetting.findOne({ key: "default" }).lean().exec();

  if (!document) {
    return { ...defaultSiteSettings };
  }

  return toSettings(document as unknown as Record<string, unknown>);
}

export async function updateSiteSettings(input: unknown): Promise<SiteSettings> {
  const parsed = settingsSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid settings.");
  }

  await connectToDatabase();

  const updated = await SiteSetting.findOneAndUpdate(
    { key: "default" },
    {
      $set: parsed.data,
      $setOnInsert: { key: "default" },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  )
    .lean()
    .exec();

  if (!updated) {
    throw new Error("The settings could not be saved.");
  }

  return toSettings(updated as unknown as Record<string, unknown>);
}
