import "./categories.css";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Compass,
  Gamepad2,
  Gift,
  Layers3,
  Map,
  Palette,
  BookOpen,
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
  color: string;
  textColor?: string;
  icon: ElementType;
  size: "large" | "medium" | "small" | "wide";
};

/* ============================================================================
   CATEGORY DATA
============================================================================ */

const categories: Category[] = [
  {
    id: "binder",
    number: "01",
    title: "Binder",
    description:
      "Collect, organize and keep their favourite discoveries together.",
    href: "/shop?category=binder",
    color: "#F47B43",
    icon: Layers3,
    size: "large",
  },
  {
    id: "mythology",
    number: "02",
    title: "Mythology",
    description:
      "Legends, stories and fascinating worlds from across time.",
    href: "/shop?category=mythology",
    color: "#E8DDBE",
    textColor: "#111111",
    icon: BookOpen,
    size: "large",
  },
  {
    id: "mind-games",
    number: "03",
    title: "Mind Games",
    description:
      "Challenge the brain with clever games, puzzles and strategy.",
    href: "/shop?category=mind-games",
    color: "#D80B62",
    icon: Brain,
    size: "large",
  },
  {
    id: "on-the-go-games",
    number: "04",
    title: "On-the-Go Games",
    description:
      "Compact games made for travel, waiting and spontaneous play.",
    href: "/shop?category=on-the-go-games",
    color: "#536FAF",
    icon: Compass,
    size: "wide",
  },
  {
    id: "phonics",
    number: "05",
    title: "Phonics",
    description:
      "Build language skills through playful learning.",
    href: "/shop?category=phonics",
    color: "#111111",
    icon: BookOpen,
    size: "wide",
  },
  {
    id: "card-games",
    number: "06",
    title: "Card Games",
    description:
      "Quick to learn. Hard to put down.",
    href: "/shop?category=card-games",
    color: "#F4A13F",
    textColor: "#111111",
    icon: Gamepad2,
    size: "small",
  },
  {
    id: "geography",
    number: "07",
    title: "Geography",
    description:
      "Explore countries, places, people and our world.",
    href: "/shop?category=geography",
    color: "#4D9B91",
    icon: Map,
    size: "small",
  },
  {
    id: "return-gifts",
    number: "08",
    title: "Return Gifts",
    description:
      "Little surprises that make celebrations memorable.",
    href: "/shop?category=return-gifts",
    color: "#E6DCC7",
    textColor: "#111111",
    icon: Gift,
    size: "small",
  },
  {
    id: "customised-products",
    number: "09",
    title: "Customised Products",
    description:
      "Make their playtime a little more personal.",
    href: "/shop?category=customized-products",
    color: "#E61D65",
    icon: Palette,
    size: "wide",
  },
];

/* ============================================================================
   PAGE HEADING
============================================================================ */

function CategoriesHeading() {
  return (
    <section className="categories-page-heading">
      <div className="heading-kicker">
        <span />
        BUZZIEWORLD
        <b />
      </div>

      <h1>
        Find their
        <br />
        <em>kind of play.</em>
      </h1>

      <div className="heading-bottom">
        <p>
          Games, stories, learning tools and experiences
          designed for curious minds from 3–15 years.
        </p>

        <div className="heading-age">
          <strong>03</strong>
          <span>—</span>
          <strong>15</strong>
          <small>YEARS</small>
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   CLIENT IMAGE FEATURE
============================================================================ */

function GameInstructionsFeature() {
  return (
    <section className="game-instructions-feature">
      <div className="game-instructions-image">
        <Image
          src="/images/categories/game-instructions.png"
          alt="BuzzieWorld children enjoying educational games"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1380px"
          className="game-instructions-img"
        />
      </div>

      <div className="game-instructions-caption">
        <span>PLAY • LEARN • GROW</span>

        <p>Because the best learning experiences don&apos;t feel like lessons.</p>
      </div>
    </section>
  );
}

/* ============================================================================
   INTRO
============================================================================ */

function CategoriesIntro() {
  return (
    <section className="categories-intro">
      <div className="intro-main">
        <span className="intro-label">
          EXPLORE BY INTEREST
        </span>

        <h2>
          There is more than
          <br />
          <span>one way to play.</span>
        </h2>
      </div>

      <div className="intro-side">
        <p>
          From quick card games to mythology,
          phonics and geography — find something
          that matches how they love to learn,
          think and play.
        </p>

        <div className="intro-mark">
          <span />
          <span />
          <span />
        </div>
      </div>
    </section>
  );
}

/* ============================================================================
   CATEGORY CARD
============================================================================ */

function CategoryCard({
  category,
}: {
  category: Category;
}) {
  const Icon = category.icon;

  return (
    <Link
      href={category.href}
      className={[
        "category-modern-card",
        `category-${category.size}`,
        "group",
      ].join(" ")}
      style={
        {
          "--category-bg": category.color,
          "--category-text":
            category.textColor || "#FFFFFF",
        } as CSSProperties
      }
    >
      <span className="category-number">
        {category.number}
      </span>

      <div className="category-icon">
        <Icon
          aria-hidden="true"
          strokeWidth={1.8}
        />
      </div>

      <div className="category-modern-content">
        <h2>{category.title}</h2>

        <p>{category.description}</p>

        <span className="category-explore">
          Explore
          <ArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={2.4}
          />
        </span>
      </div>

      <span
        aria-hidden="true"
        className="category-orb"
      />

      <span
        aria-hidden="true"
        className="category-line"
      />
    </Link>
  );
}

/* ============================================================================
   CATEGORY GRID
============================================================================ */

function CategoryGrid() {
  return (
    <section className="category-section">

      <div className="category-section-header">
        <div>
          <span>09 WORLDS TO DISCOVER</span>

          <h2>
            Pick a
            <em> direction.</em>
          </h2>
        </div>

        <p>
          Whatever they're curious about,
          there's a world waiting for them.
        </p>
      </div>

      <div className="modern-category-grid">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
          />
        ))}
      </div>

    </section>
  );
}

/* ============================================================================
   AGE STRIP
============================================================================ */

function AgeStrip() {
  return (
    <section className="age-strip">

      <div className="age-strip-number">
        03
      </div>

      <div className="age-strip-copy">
        <span>
          MADE TO GROW WITH THEM
        </span>

        <h3>
          From curious kids
          <br />
          <span>to confident thinkers.</span>
        </h3>
      </div>

      <div className="age-range">
        <span>3</span>

        <div className="age-range-line">
          <div />
        </div>

        <span>15</span>

        <small>YEARS</small>
      </div>

    </section>
  );
}

/* ============================================================================
   BOTTOM CTA
============================================================================ */

function BottomCTA() {
  return (
    <section className="categories-bottom-cta">

      <div>
        <span>
          READY TO FIND THEIR NEXT FAVOURITE?
        </span>

        <h2>
          Let the
          <em> exploring</em>
          <br />
          begin.
        </h2>
      </div>

      <Link
        href="/shop"
        className="categories-cta-button"
      >
        Explore all products

        <ArrowRight
          className="size-4"
          strokeWidth={2.4}
        />
      </Link>

    </section>
  );
}

/* ============================================================================
   PAGE
============================================================================ */

export default function CategoriesPage() {
  return (
    <main className="categories-modern-page">

      <div className="categories-modern-wrapper">

        {/* 01 — LARGE EDITORIAL HEADING */}

        <CategoriesHeading />

        {/* 02 — CLIENT'S GAME INSTRUCTIONS IMAGE */}

        <GameInstructionsFeature />

        {/* 03 — CATEGORY INTRO */}

        <CategoriesIntro />

        {/* 04 — CATEGORY COLLECTION */}

        <CategoryGrid />

        {/* 05 — AGE MESSAGE */}

        <AgeStrip />

        {/* 06 — FINAL CTA */}

        <BottomCTA />

      </div>

    </main>
  );
}
