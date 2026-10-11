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


      {/* Full-width instructional artwork */}
      {instructions.length > 0 ? (
        <section
          aria-label={`How to play ${product.name}, step by step`}
          className="w-full overflow-hidden"
        >
          {instructions.map((instruction) => (
            <Image
              key={instruction.src}
              src={instruction.src}
              alt={instruction.alt}
              width={1650}
              height={900}
              sizes="100vw"
              className="block h-auto w-full"
              priority={instruction.src === instructions[0]?.src}
            />
          ))}
        </section>
      ) : (
        <section className="px-4 py-16 text-center sm:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0E5FF] text-[#8957C8]">
              <BookOpen size={26} />
            </div>

            <h2 className="mt-5 font-playpen text-xl font-extrabold text-[#24104F] sm:text-2xl">
              Instructions are coming soon
            </h2>

            <Link
              href={`/products/${product.slug}`}
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#8957C8] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#7543B5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8957C8] focus-visible:ring-offset-2"
            >
              View Product
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
