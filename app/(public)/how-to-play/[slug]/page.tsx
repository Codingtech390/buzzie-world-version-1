import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import type { StorefrontProduct, StorefrontProductResponse } from "@/types/storefront";

interface HowToPlayPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface InstructionImage {
  src: string;
  alt: string;
  title: string;
  description: string;
}

/**
 * Temporary configuration.
 *
 * Add more product slugs here as instructional artwork becomes available.
 * Images are displayed in the exact order listed in this array.
 *
 * Later, this configuration can be replaced with ordered images stored
 * in MongoDB and managed through the admin panel.
 */
const HOW_TO_PLAY_CONTENT: Record<string, InstructionImage[]> = {
  "spell-master-phonics-cards": [
    {
      src: "/images/how-to-play/spell-master/01-categories-1-2.png",
      alt: "Spell Master categories 1 and 2: CVC Words and Vowel Teams",
      title: "Explore the first two categories",
      description:
        "Start with CVC Words and Vowel Teams. Look at the visual clues and practise recognising familiar word patterns.",
    },
    {
      src: "/images/how-to-play/spell-master/02-categories-3-4.png",
      alt: "Spell Master categories 3 and 4: Consonant Blends and Ending Blends",
      title: "Move on to blends",
      description:
        "Continue with Consonant Blends and Ending Blends to build confidence with more spelling patterns.",
    },
    {
      src: "/images/how-to-play/spell-master/03-how-spell-master-works.png",
      alt: "How Spell Master works: See It, Spell It, Write It, Master It",
      title: "See it. Spell it. Write it. Master it.",
      description:
        "Follow the four-step learning process: observe the clue, work out the word, write your answer, and practise until you master it.",
    },
    {
      src: "/images/how-to-play/spell-master/04-spell-master-setup.png",
      alt: "Spell Master setup: Pick a Card, Think and Spell, Write, Wipe and Try Again",
      title: "Set up and start playing",
      description:
        "Pick a card, think through the clue, write the answer on the reusable card, then wipe it clean and try again.",
    },
  ],
};

async function getProduct(slug: string): Promise<StorefrontProduct | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/products/slug/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch product (${response.status})`);
  }

  const data: StorefrontProductResponse = await response.json();

  if (!data.success || !data.product) {
    return null;
  }

  return data.product;
}

export async function generateMetadata({ params }: HowToPlayPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "How to Play | BuzzieWorld",
    };
  }

  return {
    title: `How to Play ${product.name} | BuzzieWorld`,
    description:
      product.shortDescription ||
      `Learn how to play ${product.name} with the step-by-step BuzzieWorld guide.`,
  };
}

export default async function HowToPlayPage({ params }: HowToPlayPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const instructions = HOW_TO_PLAY_CONTENT[slug] ?? [];

  return (
    <main className="min-h-screen overflow-hidden bg-[#F0ECF8] text-[#24104F]">
      {/* Hero */}
      <section className="relative px-4 pb-10 pt-10 sm:px-6 sm:pb-14 sm:pt-14 lg:px-8 lg:pt-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-12 h-56 w-56 rounded-full bg-[#D9CBF5]/60 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-[#FFD9E7]/60 blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-2 rounded-full border border-[#D9CEE9] bg-white/80 px-4 py-2 text-sm font-semibold text-[#5E4B83] transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A77BE8]"
          >
            <ArrowLeft size={16} />
            Back to {product.name}
          </Link>
        </div>
      </section>

      {/* Ordered instructional artwork */}
      {instructions.length > 0 ? (
        <section
          aria-label={`How to play ${product.name}, step by step`}
          className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <div className="space-y-8 sm:space-y-12">
              {instructions.map((instruction, index) => (
                <article
                  key={instruction.src}
                  className="overflow-hidden  p-3 sm:rounded-[32px] sm:p-5 lg:p-7"
                >
                  <div className="overflow-hidden rounded-[10px] bg-[#D5CEE5] sm:rounded-[10px]">
                    <Image
                      src={instruction.src}
                      alt={instruction.alt}
                      width={1650}
                      height={900}
                      sizes="(max-width: 640px) calc(100vw - 56px), (max-width: 1200px) calc(100vw - 100px), 1100px"
                      className="block h-auto w-full object-contain"
                    />
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 text-center sm:mt-14">
              <p className="font-[var(--font-poppins)] text-xl font-extrabold text-[#24104F] sm:text-2xl">
                Ready to start playing?
              </p>
              <p className="max-w-xl text-sm leading-6 text-[#6F647F] sm:text-base">
                Get your game ready, follow the instructions, and enjoy learning together.
              </p>

              <Link
                href={`/products/${product.slug}`}
                className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#8957C8] px-7 py-3 text-sm font-bold shadow-[0_8px_22px_rgba(137,87,200,0.25)] transition hover:bg-[#7543B5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8957C8] focus-visible:ring-offset-2"
                style={{ color: "#FFFFFF" }}
              >
                <span style={{ color: "#FFFFFF", WebkitTextFillColor: "#FFFFFF" }}>
                  View Product
                </span>
                <ArrowRight size={17} style={{ color: "#FFFFFF", stroke: "#FFFFFF" }} />
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-[28px] border border-white bg-white/85 px-6 py-12 text-center shadow-sm sm:px-12">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0E5FF] text-[#8957C8]">
              <BookOpen size={26} />
            </div>

            <h2 className="mt-5 font-[var(--font-poppins)] text-xl font-extrabold text-[#24104F] sm:text-2xl">
              Instructions are coming soon
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#6F647F] sm:text-base">
              We are preparing the illustrated How to Play guide for this game. In the meantime,
              visit the product page to learn more.
            </p>

            <Link
              href={`/products/${product.slug}`}
              className="mt-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#8957C8] px-7 py-3 text-sm font-bold shadow-[0_8px_22px_rgba(137,87,200,0.25)] transition hover:bg-[#7543B5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8957C8] focus-visible:ring-offset-2"
              style={{ color: "#FFFFFF" }}
            >
              <span
                style={{
                  color: "#FFFFFF",
                  WebkitTextFillColor: "#FFFFFF",
                }}
              >
                View Product
              </span>
              <ArrowRight
                size={17}
                color="#FFFFFF"
                style={{ color: "#FFFFFF", stroke: "#FFFFFF" }}
              />
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
