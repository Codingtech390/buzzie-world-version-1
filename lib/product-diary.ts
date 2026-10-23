
import type {
  ProductDiaryData,
  ProductDiaryEntry,
} from "@/types/product";

interface LegacyProductDiarySource {
  name?: string;
  description?: string;
  shortDescription?: string;
  keyFeatures?: string[];
  sku?: string;
  stock?: number;
  ageRange?: {
    min?: number;
    max?: number;
  };
}

function descriptionEntries(description: string): ProductDiaryEntry[] {
  const parts = description
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p\s*>\s*<p[^>]*>/gi, "\n")
    .replace(/<\/?p[^>]*>/gi, "")
    .split(/\r?\n+/)
    .map((part) =>
      part
        .trim()
        .replace(/^#{1,6}\s*/, "")
        .replace(/^\*{1,3}|\*{1,3}$/g, "")
        .replace(/^_{1,3}|_{1,3}$/g, "")
        .trim(),
    )
    .filter(Boolean);

  const entries: ProductDiaryEntry[] = [];

  for (let i = 0; i < parts.length; i += 2) {
    entries.push({
      title: parts[i],
      description: parts[i + 1] ?? "",
    });
  }

  return entries;
}

export function createLegacyProductDiary(
  product: LegacyProductDiarySource,
): ProductDiaryData {
  const ageRange = product.ageRange;
  const age =
    ageRange?.min !== undefined && ageRange?.max !== undefined
      ? `${ageRange.min}–${ageRange.max} years`
      : ageRange?.min !== undefined
        ? `${ageRange.min}+ years`
        : ageRange?.max !== undefined
          ? `Up to ${ageRange.max} years`
          : "";

  return {
    overview: {
      eyebrow: "QUICK OVERVIEW",
      title: product.name ?? "",
      intro:
        product.shortDescription ||
        "Discover the key details of this product before you choose your favourite.",
      entries: descriptionEntries(product.description ?? ""),
    },

    keyFeatures: {
      eyebrow: "KEY FEATURES",
      title: "Everything that makes it special.",
      intro:
        "A quick look at what comes with the product and the key features worth knowing.",
      entries: (product.keyFeatures ?? []).map((feature) => ({
        title: feature,
        description: "",
      })),
    },

    specifications: {
      eyebrow: "PRODUCT DETAILS",
      title: "Everything you need to know.",
      intro:
        "Here are the key details available for this product, so you can choose with confidence.",
      entries: [
        { label: "Age", value: age || "Suitable age group not specified" },
        { label: "SKU", value: product.sku || "Not specified" },
        {
          label: "Availability",
          value:
            product.stock === undefined
              ? "Availability pending"
              : product.stock > 0
                ? "In stock"
                : "Currently unavailable",
        },
        { label: "What's Inside", value: "Product contents" },
        { label: "Box Dimension", value: "Details coming soon" },
        { label: "Box Weight", value: "Details coming soon" },
      ],
    },

    benefits: {
      eyebrow: "BENEFITS",
      title: "Made to learn, play and grow.",
      intro:
        "Every BuzzieWorld product is designed to make learning feel playful and meaningful.",
      entries: [
        {
          title: "Skill Building & Learning",
          description:
            "Boosts general knowledge, visual-spatial skills, memory, critical thinking and social play. An educational toy that combines learning with laughter.",
        },
      ],
    },
  };
}

export function resolveProductDiary(
  product: LegacyProductDiarySource & {
    productDiary?: ProductDiaryData;
  },
): ProductDiaryData {
  const legacy = createLegacyProductDiary(product);
  const saved = product.productDiary;

  if (!saved) {
    return legacy;
  }

  return {
    overview: { ...legacy.overview, ...saved.overview },
    keyFeatures: { ...legacy.keyFeatures, ...saved.keyFeatures },
    specifications: {
      ...legacy.specifications,
      ...saved.specifications,
    },
    benefits: { ...legacy.benefits, ...saved.benefits },
  };
}
