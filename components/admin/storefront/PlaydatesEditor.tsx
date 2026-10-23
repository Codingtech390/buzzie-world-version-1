"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  ImagePlus,
  LoaderCircle,
  Save,
} from "lucide-react";



interface PlaydatesSettings {
  heading: string;
  description: string;
  image: string;
  imageAlt: string;
  isPublished: boolean;
}

const DEFAULT_SETTINGS: PlaydatesSettings = {
  heading: "Play Dates",
  description: "",
  image: "",
  imageAlt: "BuzzieWorld Play Dates",
  isPublished: false,
};

interface ApiResponse {
  success?: boolean;
  message?: string;
  settings?: PlaydatesSettings;
}

export default function PlaydatesEditor() {
  const [settings, setSettings] = useState<PlaydatesSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [uploading, setUploading] = useState(false);

    async function uploadPlaydatesImage(file: File) {
      setError("");
      setSuccess("");

      const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];

      if (!allowedTypes.includes(file.type)) {
        setError("Choose a JPEG, PNG, WEBP, or AVIF image.");
        return;
      }

      if (file.size <= 0 || file.size > 10 * 1024 * 1024) {
        setError("The image must be larger than 0 bytes and no bigger than 10 MB.");
        return;
      }

      setUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "buzzie-world/playdates");
        formData.append("alt", settings.imageAlt || "BuzzieWorld Play Dates");

        const response = await fetch("/api/media/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok || !result.success || !result.url) {
          throw new Error(result.message || "Local image upload failed.");
        }

        if (
          result.provider !== "local" ||
          typeof result.url !== "string" ||
          !result.url.startsWith("/")
        ) {
          throw new Error(
            "The upload did not return a local media URL. Check your media storage configuration.",
          );
        }

        setSettings((current) => ({
          ...current,
          image: result.url,
          imageAlt: current.imageAlt || file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
        }));

        setSuccess("Image uploaded to local Playdates storage.");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to upload the image.");
      } finally {
        setUploading(false);
      }
    }

  const updateField = <K extends keyof PlaydatesSettings>(key: K, value: PlaydatesSettings[K]) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setError("");
    setSuccess("");
  };

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/homepage/playdates", {
        cache: "no-store",
      });

      const result = (await response.json()) as ApiResponse;

      if (!response.ok || !result.success || !result.settings) {
        throw new Error(result.message || "Unable to load Playdates settings.");
      }

      setSettings({
        ...DEFAULT_SETTINGS,
        ...result.settings,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load Playdates settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const saveSettings = async (publish: boolean) => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload: PlaydatesSettings = {
        ...settings,
        isPublished: publish,
      };

      const response = await fetch("/api/homepage/playdates", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as ApiResponse;

      if (!response.ok || !result.success || !result.settings) {
        throw new Error(result.message || "Unable to save Playdates settings.");
      }

      setSettings({
        ...DEFAULT_SETTINGS,
        ...result.settings,
      });

      setSuccess(
        publish
          ? "Playdates content published successfully."
          : "Playdates settings saved as unpublished.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save Playdates settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-72 items-center justify-center gap-3 text-sm text-slate-500">
        <LoaderCircle className="h-5 w-5 animate-spin" />
        Loading Playdates settings...
      </div>
    );
  }

  return (
    <main className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold text-violet-600">Storefront / Playdates</p>
          <h1 className="text-3xl font-playpen font-black tracking-tight text-slate-900">Playdates</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Update the Playdates section on your homepage with fresh copy and imagery for your
            weekly activities.
          </p>
        </div>

        <span
          className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${
            settings.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              settings.isPublished ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
          {settings.isPublished ? "Published" : "Unpublished"}
        </span>
      </header>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.85fr)]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <h2 className="text-lg font-playpen font-bold text-slate-900">Section content</h2>
            <p className="mt-1 text-sm text-slate-500">
              Keep the heading clear and the description engaging for parents.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="playdates-heading"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Heading
              </label>
              <input
                id="playdates-heading"
                value={settings.heading}
                onChange={(event) => updateField("heading", event.target.value)}
                maxLength={160}
                required
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                placeholder="Play Dates"
              />
              <p className="mt-1 text-right text-xs text-slate-400">
                {settings.heading.length}/160
              </p>
            </div>

            <div>
              <label
                htmlFor="playdates-description"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Description
              </label>
              <textarea
                id="playdates-description"
                value={settings.description}
                onChange={(event) => updateField("description", event.target.value)}
                maxLength={2000}
                rows={6}
                className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                placeholder="Share this week's play ideas, activities, and little adventures..."
              />
              <p className="mt-1 text-right text-xs text-slate-400">
                {settings.description.length}/2000
              </p>
            </div>

            <div>
              <label
                htmlFor="playdates-image-alt"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Image alt text
              </label>
              <input
                id="playdates-image-alt"
                value={settings.imageAlt}
                onChange={(event) => updateField("imageAlt", event.target.value)}
                maxLength={200}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                placeholder="Children enjoying a creative play activity"
              />
              <p className="mt-1 text-xs text-slate-500">Describe the image for accessibility.</p>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5">
              <h2 className="text-lg font-playpen font-bold text-slate-900">Section image</h2>
              <p className="mt-1 text-sm text-slate-500">
                Upload a new image or retain the current one.
              </p>
            </div>

            {settings.image ? (
              <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-[#f7f4ec]">
                <Image
                  src={settings.image}
                  alt={settings.imageAlt || "Playdates preview"}
                  fill
                  unoptimized
                  sizes="(max-width: 1280px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="mb-5 flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-center">
                <ImagePlus className="mb-3 h-9 w-9 text-slate-400" />
                <p className="text-sm font-semibold text-slate-700">No image selected</p>
                <p className="mt-1 text-xs text-slate-500">
                  Upload an image to preview the section.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <label
                htmlFor="playdates-image-upload"
                className="block text-sm font-semibold text-slate-700"
              >
                Upload Playdates image
              </label>

              <input
                id="playdates-image-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                disabled={uploading || saving}
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];

                  if (file) {
                    void uploadPlaydatesImage(file);
                  }

                  // Allow selecting the same file again after an error.
                  event.currentTarget.value = "";
                }}
                className="block w-full rounded-xl border border-slate-200 bg-white p-3 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:font-semibold file:text-violet-700 disabled:opacity-60"
              />

              {uploading && (
                <p className="text-sm text-violet-700">Uploading to local media storage...</p>
              )}

              <p className="text-xs leading-5 text-slate-500">
                Files are stored under media-storage/buzzie-world/playdates. Maximum file size: 10
                MB.
              </p>
            </div>

            {settings.image && (
              <button
                type="button"
                onClick={() => updateField("image", "")}
                className="mt-3 text-sm font-semibold text-red-600 transition hover:text-red-700"
              >
                Remove selected image
              </button>
            )}

            <p className="mt-4 break-all text-xs leading-5 text-slate-500">
              {settings.image || "No image URL saved yet."}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="text-lg font-playpen font-bold text-slate-900">Publishing</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Save changes without publishing, or publish the section when the content and image are
              ready.
            </p>

            <div className="mt-5 grid gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={() => void saveSettings(false)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save as unpublished
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() => void saveSettings(true)}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#C391EE] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#E83D59] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : settings.isPublished ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {saving ? "Saving..." : "Save and publish"}
              </button>

              {settings.isPublished && (
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void saveSettings(false)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:opacity-60"
                >
                  <EyeOff className="h-4 w-4" />
                  Unpublish section
                </button>
              )}
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">
              Publishing requires an image. The homepage will show the section only when it is
              published and has an image.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
