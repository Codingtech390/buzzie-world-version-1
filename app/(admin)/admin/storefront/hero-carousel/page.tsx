"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, ImagePlus, LoaderCircle, Save } from "lucide-react";

import CloudinaryMediaUploader from "@/components/admin/media/CloudinaryMediaUploader";
import { DEFAULT_HERO_SLIDES, type HeroCarouselSlide } from "@/types/homepage";

export default function HeroCarouselAdminPage() {
  const [slides, setSlides] = useState<HeroCarouselSlide[]>(DEFAULT_HERO_SLIDES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSlides() {
      try {
        const response = await fetch("/api/homepage/hero-carousel", {
          cache: "no-store",
        });
        const result = await response.json();

        if (!response.ok || !result.success || !Array.isArray(result.slides)) {
          throw new Error(result.message || "Unable to load hero carousel.");
        }

        if (!cancelled) {
          setSlides(result.slides.length === 3 ? result.slides : DEFAULT_HERO_SLIDES);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unable to load hero carousel.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadSlides();

    return () => {
      cancelled = true;
    };
  }, []);

  function updateSlide(index: number, updates: Partial<HeroCarouselSlide>) {
    setSlides((current) =>
      current.map((slide, i) => (i === index ? { ...slide, ...updates } : slide)),
    );
    setError("");
    setSuccess("");
  }

  async function saveSlides() {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (slides.length !== 3) {
        throw new Error("Exactly three slides are required.");
      }

      for (const [index, slide] of slides.entries()) {
        if (!slide.image.trim()) {
          throw new Error(`Please add an image for slide ${index + 1}.`);
        }

        if (!slide.alt.trim()) {
          throw new Error(`Please add alt text for slide ${index + 1}.`);
        }

        if (!slide.href.startsWith("/") || slide.href.startsWith("//")) {
          throw new Error(
            `Slide ${index + 1} destination must be a local path, such as /crazy-deals.`,
          );
        }
      }

      const response = await fetch("/api/homepage/hero-carousel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to save hero carousel.");
      }

      setSlides(result.slides);
      setSuccess("Hero carousel saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save hero carousel.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-full bg-[#FCFAF7]">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>

            <h1 className="font-playpen text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Hero Carousel
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage the three promotional images displayed at the top of your BuzzieWorld homepage.
            </p>
          </div>

          <button
            type="button"
            onClick={saveSlides}
            disabled={loading || saving}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#C391EE] px-5 text-sm font-semibold text-white transition hover:bg-[#E83D59] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{success}</p>
          </div>
        )}

        {loading ? (
          <div className="flex min-h-60 items-center justify-center gap-3 text-sm text-slate-500">
            <LoaderCircle className="h-5 w-5 animate-spin" />
            Loading carousel settings...
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-3">
            {slides.map((slide, index) => (
              <section
                key={slide.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div>
                    <h2 className="font-playpen text-base font-semibold text-slate-900">
                      Slide {index + 1}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">Homepage promotional image</p>
                  </div>
                  <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                    {index + 1} of 3
                  </span>
                </div>

                <div className="p-5">
                  <div className="mb-4 flex aspect-[16/9] items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    {slide.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={slide.image}
                        alt={slide.alt || `Slide ${index + 1} preview`}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-slate-400">
                        <ImagePlus className="mx-auto mb-2 h-8 w-8" />
                        <p className="text-xs">No image selected</p>
                      </div>
                    )}
                  </div>

                  <div className="mb-5">
                    <CloudinaryMediaUploader
                      folder="buzzie-world/home/hero"
                      resourceType="image"
                      onSuccess={(info) => {
                        if (info.secure_url) {
                          updateSlide(index, { image: info.secure_url });
                        } else {
                          setError(
                            `Cloudinary did not return an image URL for slide ${index + 1}.`,
                          );
                        }
                      }}
                      onError={() => {
                        setError(`Image upload failed for slide ${index + 1}. Please try again.`);
                      }}
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor={`slide-image-${index}`}
                        className="mb-1.5 block text-xs font-semibold text-slate-700"
                      >
                        Image URL
                      </label>
                      <input
                        id={`slide-image-${index}`}
                        value={slide.image}
                        onChange={(event) => updateSlide(index, { image: event.target.value })}
                        placeholder="https://res.cloudinary.com/..."
                        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`slide-alt-${index}`}
                        className="mb-1.5 block text-xs font-semibold text-slate-700"
                      >
                        Image alt text
                      </label>
                      <input
                        id={`slide-alt-${index}`}
                        value={slide.alt}
                        onChange={(event) => updateSlide(index, { alt: event.target.value })}
                        placeholder="Describe the promotional image"
                        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`slide-href-${index}`}
                        className="mb-1.5 block text-xs font-semibold text-slate-700"
                      >
                        Click destination
                      </label>
                      <input
                        id={`slide-href-${index}`}
                        value={slide.href}
                        onChange={(event) => updateSlide(index, { href: event.target.value })}
                        placeholder="/crazy-deals"
                        className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                      />
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}

        <p className="mt-6 text-xs leading-5 text-slate-500">
          Changes take effect on the public homepage after they have been saved. Keep all three
          slides configured to ensure the carousel works as expected.
        </p>
      </div>
    </main>
  );
}
