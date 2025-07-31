import { slugMaker } from "@/lib/utils";

const BASE_URL = "https://tangkhullyrics.com";
export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  try {
    // Static pages sitemap
    const staticPages = [
      {
        url: "/",
        priority: "1.0",
        changefreq: "daily",
        lastmod: new Date().toISOString(),
      },
      {
        url: "/about",
        priority: "0.8",
        changefreq: "monthly",
        lastmod: new Date().toISOString(),
      },
      {
        url: "/contact",
        priority: "0.7",
        changefreq: "monthly",
        lastmod: new Date().toISOString(),
      },
      {
        url: "/lyrics",
        priority: "0.9",
        changefreq: "daily",
        lastmod: new Date().toISOString(),
      },
      {
        url: "/search",
        priority: "0.8",
        changefreq: "weekly",
        lastmod: new Date().toISOString(),
      },
      {
        url: "/allartists",
        priority: "0.9",
        changefreq: "weekly",
        lastmod: new Date().toISOString(),
      },
      {
        url: "/contribute",
        priority: "0.7",
        changefreq: "monthly",
        lastmod: new Date().toISOString(),
      },
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
${staticPages
  .map(
    (item) => `  <url>
    <loc>${BASE_URL}${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
    <mobile:mobile/>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control":
          "public, max-age=3600, s-maxage=7200, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Static sitemap generation error:", error);
    
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new Response(fallbackXml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }
}
