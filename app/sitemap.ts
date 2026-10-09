import type { MetadataRoute } from "next";

import { getProducts } from "@/services/product.service";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.buzzieworld.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },

    {
      url: `${SITE_URL}/shop`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },

    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },

    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },

    {
      url: `${SITE_URL}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },

    {
      url: `${SITE_URL}/crazy-deals`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },

    {
      url: `${SITE_URL}/shop/age/1-3-years`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },

    {
      url: `${SITE_URL}/shop/age/3-6-years`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },

    {
      url: `${SITE_URL}/shop/age/6-9-years`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },

    {
      url: `${SITE_URL}/shop/age/9-15-years`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },

    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },

    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },

    {
      url: `${SITE_URL}/shipping-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },

    {
      url: `${SITE_URL}/returns-refunds`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },

    {
      url: `${SITE_URL}/cancellation-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },

    {
      url: `${SITE_URL}/disclaimer`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const result = await getProducts({
    published: true,
    status: "active",
    page: 1,
    limit: 10000,
    sort: "newest",
  });

  const productPages: MetadataRoute.Sitemap = result.products.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
