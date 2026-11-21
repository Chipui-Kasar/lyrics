import type { MetadataRoute } from "next";

// Single source of truth for robots.txt (public/robots.txt was removed so the
// two can't disagree). /_next/ is intentionally NOT blocked: Google needs the
// JS/CSS there to render pages.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/private/", "/search?"],
      },
    ],
    sitemap: "https://tangkhullyrics.com/sitemap.xml",
    host: "https://tangkhullyrics.com",
  };
}
