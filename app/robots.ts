import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.buzzieworld.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/account/", "/auth/", "/checkout/", "/cart/"],
      },
    ],

    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
