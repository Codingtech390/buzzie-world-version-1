export type ProductStatus = "draft" | "active" | "archived";

export interface ProductImage {
  url: string;
  publicId?: string;
  alt?: string;
}

export interface ProductVariant {
  _id?: string;
  name: string;
  value: string;
  sku?: string;
  price?: number;
  stock?: number;
}


export interface ProductDiaryEntry {
  title: string;
  description: string;
}

export interface ProductDiarySpecification {
  label: string;
  value: string;
}

export interface ProductDiaryTextSection {
  eyebrow: string;
  title: string;
  intro: string;
  entries: ProductDiaryEntry[];
}

export interface ProductDiarySpecificationSection {
  eyebrow: string;
  title: string;
  intro: string;
  entries: ProductDiarySpecification[];
}

export interface ProductDiaryData {
  overview: ProductDiaryTextSection;
  keyFeatures: ProductDiaryTextSection;
  productDiary?: ProductDiaryData;
  specifications: ProductDiarySpecificationSection;
  benefits: ProductDiaryTextSection;
}


export interface ProductAgeRange {
  min?: number;
  max?: number;
}

export interface Product {
  _id: string;

  name: string;
  slug: string;

  description: string;
  shortDescription?: string;

  price?: number;
  compareAtPrice?: number;

  sku?: string;

  images: ProductImage[];

  carouselImages?: ProductImage[];

  category?: string;

  brand?: string;
  collection?: string;

  variants: ProductVariant[];

  stock?: number;

  /**
   * Commerce lifecycle.
   */
  status: ProductStatus;

  /**
   * Controls whether the product is visible
   * in the public storefront catalog.
   */
  published: boolean;

  featured: boolean;

  ageRange?: ProductAgeRange;

  createdAt: string;
  updatedAt: string;
}
