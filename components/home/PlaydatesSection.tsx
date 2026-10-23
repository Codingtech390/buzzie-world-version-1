import Image from "next/image";
import { Sparkles } from "lucide-react";

interface PlaydatesSettings {
  heading: string;
  description: string;
  image: string;
  imageAlt: string;
  isPublished: boolean;
}

interface PlaydatesResponse {
  success: boolean;
  settings?: PlaydatesSettings;
}

export default async function PlaydatesSection() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let settings: PlaydatesSettings | null = null;

  try {
    const response = await fetch(`${baseUrl}/api/homepage/playdates`, {
      cache: "no-store",
    });

    if (response.ok) {
      const result = (await response.json()) as PlaydatesResponse;

      if (result.success && result.settings) {
        settings = result.settings;
      }
    }
  } catch {
    // Keep the rest of the homepage available if this section cannot load.
  }

  if (!settings?.isPublished || !settings.image) {
    return null;
  }

  return (
    <section
      aria-labelledby="playdates-heading"
      className="relative isolate overflow-hidden bg-[#fff8ec] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#f56b9a]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#3f7dff]/10 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#f56b9a]/20 bg-white/80 px-4 py-2 text-sm font-bold text-[#bf426d] shadow-sm">
            <Sparkles className="h-4 w-4" />
            Little moments, big memories
          </div>

          <h2
            id="playdates-heading"
            className="max-w-xl text-4xl font-black leading-tight tracking-tight text-[#252525] sm:text-5xl lg:text-6xl"
          >
            {settings.heading}
          </h2>

          {settings.description && (
            <p className="mt-6 max-w-xl whitespace-pre-line text-base leading-8 text-slate-600 sm:text-lg">
              {settings.description}
            </p>
          )}

          <div className="mt-7 flex items-center gap-3 text-sm font-semibold text-[#3f7dff]">
            <span className="h-2.5 w-2.5 rounded-full bg-[#79d45c]" />
            Make room for imagination, connection, and play.
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative mx-auto w-full max-w-xl">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rotate-3 rounded-[2rem] bg-gradient-to-br from-[#f56b9a]/30 via-[#ffdc87]/40 to-[#3f7dff]/20"
            />

            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-white/80 bg-white shadow-[0_25px_70px_rgba(37,37,37,0.14)]">
              <Image
                src={settings.image}
                alt={settings.imageAlt || settings.heading}
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-[1.03]"
              />
            </div>

            <div
              aria-hidden="true"
              className="absolute -right-3 -top-4 h-10 w-10 rounded-2xl border-4 border-[#fff8ec] bg-[#ffcf59] shadow-md sm:-right-5 sm:-top-5 sm:h-14 sm:w-14"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-3 -left-3 h-8 w-8 rounded-full border-4 border-[#fff8ec] bg-[#f56b9a] sm:-bottom-4 sm:-left-4 sm:h-12 sm:w-12"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
