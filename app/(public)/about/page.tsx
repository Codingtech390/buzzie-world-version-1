import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen w-full overflow-hidden bg-white">
      {/* =========================================================
          ABOUT — TOP STORY
         ========================================================= */}
      <section className="w-full">
        <Image
          src="/images/banners/about-1.png"
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
          src="/images/banners/about-2.png"
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
