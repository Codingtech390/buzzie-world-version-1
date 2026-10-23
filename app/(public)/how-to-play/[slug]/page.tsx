
import { ArrowRight, BookOpen } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import type {
  StorefrontProduct,
  StorefrontProductResponse,
} from "@/types/storefront";

interface HowToPlayPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProduct(
  slug: string,
): Promise<StorefrontProduct | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const response = await fetch(
    `${baseUrl}/api/products/slug/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch product (${response.status})`,
    );
  }

  const data: StorefrontProductResponse = await response.json();

  if (!data.success || !data.product) {
    return null;
  }

  return data.product;
}

export async function generateMetadata({
  params,
}: HowToPlayPageProps): Promise<Metadata> {
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

export default async function HowToPlayPage({
  params,
}: HowToPlayPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product || !product.published) {
    notFound();
  }

  // Use the instructions saved through the admin product form.
  // Filter invalid or empty image URLs defensively.
  const instructions = Array.isArray(product.howToPlay)
    ? product.howToPlay.filter(
        (instruction) =>
          typeof instruction.url === "string" &&
          instruction.url.trim().length > 0,
      )
    : [];

  return (
    <main className="min-h-screen overflow-hidden bg-[#F0ECF8] text-[#24104F]">
      {instructions.length > 0 ? (
        <section
          aria-label={`How to play ${product.name}, step by step`}
          className="w-full overflow-hidden"
        >
          {instructions.map((instruction, index) => (
            <Image
              key={`${instruction.url}-${index}`}
              src={instruction.url}
              alt={
                instruction.alt?.trim() ||
                `${product.name} — How to Play, step ${index + 1}`
              }
              width={1650}
              height={900}
              sizes="100vw"
              priority={index === 0}
              className="block h-auto w-full"
            />
          ))}
        </section>
      ) : (
        <section className="px-4 py-16 text-center sm:py-20">
          <div className="mx-auto max-w-3xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F0E5FF] text-[#8957C8]">
              <BookOpen size={26} aria-hidden="true" />
            </div>

            <h1 className="mt-5 font-playpen text-xl font-extrabold text-[#24104F] sm:text-2xl">
              Instructions are coming soon
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#6E6680]">
              We&apos;re preparing the How to Play guide for{" "}
              {product.name}. Please check back soon.
            </p>

            <Link
              href={`/products/${product.slug}`}
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#8957C8] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#7543B5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8957C8] focus-visible:ring-offset-2"
            >
              View Product
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
