import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  try {
    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
          disallow: ["/admin/", "/api/", "/_next/", "/private/"],
        },
        {
          userAgent: "Googlebot",
          allow: "/",
          disallow: ["/admin/", "/api/"],
        },
        {
          userAgent: "Bingbot",
          allow: "/",
          disallow: ["/admin/", "/api/"],
        },
        {
          userAgent: "facebookexternalhit",
          allow: "/",
          disallow: ["/admin/", "/api/"],
        },
        {
          userAgent: "Twitterbot",
          allow: "/",
          disallow: ["/admin/", "/api/"],
        },
      ],
      sitemap: "https://tangkhullyrics.com/sitemap.xml",
      host: "https://tangkhullyrics.com",
    };
  } catch (error) {
    console.error("Error generating robots.txt:", error);
    // Return a minimal but valid robots.txt in case of error
    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
          disallow: ["/admin/", "/api/"],
        },
      ],
      sitemap: "https://tangkhullyrics.com/sitemap.xml",
    };
  }
}
