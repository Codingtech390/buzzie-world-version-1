import Image from "next/image";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "About Us",
  description:
    "Learn more about BuzzieWorld and our mission to make learning and play more meaningful for children.",
  path: "/about",
});
export default function AboutPage() {
  return (
    <main className="min-h-screen w-full overflow-hidden bg-white">
      {/* =========================================================
          ABOUT — TOP STORY
         ========================================================= */}
      <section className="w-full">
        <Image
          src="/images/banners/About-1-1.png"
          alt="The story behind BuzzieWorld"
          width={1920}
          height={1080}
          priority
          sizes="100vw"
          className="block h-auto w-full"
        />
      </section>

      {/* =========================================================
          ABOUT — MIDDLE STORY
         ========================================================= */}
      <section className="w-full mb-8">
        <Image
          src="/images/banners/About-2-3.png"
          alt="How BuzzieWorld was created"
          width={1920}
          height={1080}
          sizes="100vw"
          className="block h-auto w-full"
        />
      </section>
    </main>
  );
}
