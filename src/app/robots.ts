import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  try {
    return {
      rules: [
        {
          userAgent: "*",
          allow: "/",
          disallow: ["/admin/", "/api/", "/_next/", "/private/", "/search"],
        },
        {
          userAgent: "Googlebot",
          allow: "/",
          disallow: ["/admin/", "/api/", "/search"],
        },
        {
          userAgent: "Bingbot",
          allow: "/",
          disallow: ["/admin/", "/api/", "/search"],
        },
        {
          userAgent: "facebookexternalhit",
          allow: "/",
          disallow: ["/admin/", "/api/", "/search"],
        },
        {
          userAgent: "Twitterbot",
          allow: "/",
          disallow: ["/admin/", "/api/", "/search"],
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
          disallow: ["/admin/", "/api/", "/search"],
        },
      ],
      sitemap: "https://tangkhullyrics.com/sitemap.xml",
    };
  }
}
