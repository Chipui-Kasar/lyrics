import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api"],
    },
    sitemap: `${NEXT_PUBLIC_API_URL}/sitemap.xml`,
  };
}
