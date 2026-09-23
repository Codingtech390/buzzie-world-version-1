import Link from "next/link";
import {
  ArrowRight,
  Brain,
  BookOpen,
  Compass,
  Gamepad2,
  Gift,
  Layers3,
  Map,
  Palette,
} from "lucide-react";

import type { CSSProperties, ElementType } from "react";

/* ============================================================================
   TYPES
============================================================================ */

type Category = {
  id: string;
  number: string;
  title: string;
  description: string;
  href: string;
  background: string;
  accent: string;
  icon: ElementType;
  blob: string;
};

/* ============================================================================
   CATEGORY DATA
============================================================================ */

const categories: Category[] = [
  {
    id: "binder",
    number: "01",
    title: "Binder",
    description: "Collect, organize and keep their favourite discoveries together.",
    href: "/shop?category=binder",
    background: "#F8D8E5",
    accent: "#E72D5A",
    icon: Layers3,
    blob: "48% 52% 45% 55% / 52% 46% 54% 48%",
  },
  {
    id: "mythology",
    number: "02",
    title: "Mythology",
    description: "Legends, stories and fascinating worlds from across time.",
    href: "/shop?category=mythology",
    background: "#F8E5B7",
    accent: "#B99055",
    icon: BookOpen,
    blob: "54% 46% 52% 48% / 46% 54% 48% 52%",
  },
  {
    id: "mind-games",
    number: "03",
    title: "Mind Games",
    description: "Challenge the brain with clever games, puzzles and strategy.",
    href: "/shop?category=mind-games",
    background: "#F7DCE7",
    accent: "#E72D5A",
    icon: Brain,
    blob: "46% 54% 49% 51% / 54% 47% 53% 46%",
  },
  {
    id: "on-the-go-games",
    number: "04",
    title: "On-the-Go Games",
    description: "Compact games made for travel, waiting and spontaneous play.",
    href: "/shop?category=on-the-go-games",
    background: "#DDE7F4",
    accent: "#667EAC",
    icon: Compass,
    blob: "52% 48% 44% 56% / 48% 56% 44% 52%",
  },
  {
    id: "phonics",
    number: "05",
    title: "Phonics",
    description: "Build language skills through playful learning.",
    href: "/shop?category=phonics",
    background: "#E9E4DE",
    accent: "#77716A",
    icon: BookOpen,
    blob: "45% 55% 53% 47% / 51% 45% 55% 49%",
  },
  {
    id: "card-games",
    number: "06",
    title: "Card Games",
    description: "Quick to learn. Hard to put down.",
    href: "/shop?category=card-games",
    background: "#F8E7C9",
    accent: "#E39A3C",
    icon: Gamepad2,
    blob: "56% 44% 48% 52% / 44% 53% 47% 56%",
  },
  {
    id: "geography",
    number: "07",
    title: "Geography",
    description: "Explore countries, places, people and our world.",
    href: "/shop?category=geography",
    background: "#DDEBD9",
    accent: "#6C9D70",
    icon: Map,
    blob: "49% 51% 55% 45% / 55% 48% 52% 45%",
  },
  {
    id: "return-gifts",
    number: "08",
    title: "Return Gifts",
    description: "Little surprises that make celebrations memorable.",
    href: "/shop?category=return-gifts",
    background: "#F3E1D3",
    accent: "#C98967",
    icon: Gift,
    blob: "53% 47% 46% 54% / 47% 55% 45% 53%",
  },
  {
    id: "customised-products",
    number: "09",
    title: "Customised Products",
    description: "Make their playtime a little more personal.",
    href: "/shop?category=customized-products",
    background: "#E8E0F4",
    accent: "#8D76B9",
    icon: Palette,
    blob: "47% 53% 51% 49% / 53% 44% 56% 47%",
  },
];

/* ============================================================================
   CATEGORY BLOB
============================================================================ */

function CategoryBlob({ category }: { category: Category }) {
  const Icon = category.icon;

  return (
    <Link
      href={category.href}
      className="
        group
        relative
        block
        aspect-square
        w-full
        max-w-[390px]
        transition-transform
        duration-500
        ease-out
        hover:-translate-y-2
      "
    >
      {/* Blob */}
      <div
        className="
          absolute
          inset-0
          overflow-hidden
          transition-all
          duration-500
          ease-out
          group-hover:scale-[1.025]
        "
        style={{
          backgroundColor: category.background,
          borderRadius: category.blob,
        }}
      >
        {/* Very subtle inner highlight */}
        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-10
            -top-10
            size-32
            rounded-full
            bg-white/25
            blur-2xl
          "
        />

        {/* Small decorative dot */}
        <span
          aria-hidden="true"
          className="
            absolute
            bottom-[22%]
            right-[17%]
            size-2
            rounded-full
            opacity-40
          "
          style={{ backgroundColor: category.accent }}
        />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col p-[14%]">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <span
            className="
              font-[var(--font-poppins)]
              text-[9px]
              font-black
              tracking-[0.16em]
              text-[#77717B]
              sm:text-[10px]
            "
          >
            {category.number}
          </span>

          <span
            className="
              flex
              size-10
              items-center
              justify-center
              rounded-full
              bg-white/60
              text-[#17213D]
              backdrop-blur-sm
              transition-transform
              duration-500
              group-hover:rotate-[-8deg]
              group-hover:scale-105
            "
          >
            <Icon aria-hidden="true" className="size-[17px]" strokeWidth={1.8} />
          </span>
        </div>

        {/* Main content */}
        <div className="mt-auto max-w-[82%] pb-[3%]">
          <h2
            className="
              font-playpen
              text-[clamp(1.55rem,3vw,2.2rem)]
              font-black
              leading-[1]
              tracking-[-0.045em]
              text-[#17213D]
            "
          >
            {category.title}
          </h2>

          <p
            className="
              mt-3
              max-w-[300px]
              font-[var(--font-poppins)]
              text-[10px]
              leading-5
              text-[#687489]
              sm:text-[11px]
              sm:leading-5
            "
          >
            {category.description}
          </p>

          <span
            className="
              mt-4
              inline-flex
              items-center
              gap-1.5
              font-[var(--font-poppins)]
              text-[9px]
              font-black
              uppercase
              tracking-[0.08em]
              transition-all
              duration-300
            "
            style={{ color: category.accent }}
          >
            Explore
            <ArrowRight
              aria-hidden="true"
              className="
                size-3.5
                transition-transform
                duration-300
                group-hover:translate-x-1
              "
              strokeWidth={2.4}
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ============================================================================
   CATEGORY GRID
============================================================================ */

export default function CategoriesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#FCFAF7]">
      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto w-full max-w-[1250px]">
          {/* Small page label */}
          <div className="mb-10 flex flex-col items-center text-center sm:mb-12">
            <div className="flex items-center gap-2">
              <span className="h-[2px] w-7 rounded-full bg-[#E72D5A]" />

              <span className="font-[var(--font-poppins)] text-[9px] font-black uppercase tracking-[0.18em] text-[#E72D5A]">
                Explore categories
              </span>

              <span className="size-1.5 rounded-full bg-[#F59A23]" />
            </div>

            <h1
              className="
                mt-4
                font-playpen
                text-[clamp(2rem,4.5vw,3.5rem)]
                font-black
                leading-none
                tracking-[-0.05em]
                text-[#17213D]
              "
            >
              Find their <span className="text-[#E72D5A]">kind of play.</span>
            </h1>
          </div>

          {/* Blobs */}
          <div className="grid grid-cols-1 place-items-center gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3 lg:gap-12">
            {categories.map((category) => (
              <CategoryBlob key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
