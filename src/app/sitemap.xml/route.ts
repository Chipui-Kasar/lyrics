import { slugMaker } from "@/lib/utils";
import { getAllArtists, getLyrics } from "@/service/allartists";

const BASE_URL = "https://tangkhullyrics.com";
export const dynamic = "force-dynamic"; // Change to dynamic to avoid build issues
export const revalidate = 3600;

export async function GET() {
  try {
    // Create sitemap index with multiple sitemaps for better scalability
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-static.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-lyrics.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-artists.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;

    return new Response(sitemapIndex, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control":
          "public, max-age=3600, s-maxage=7200, stale-while-revalidate=86400",
        "X-Robots-Tag": "noindex",
      },
    });
  } catch (error) {
    console.error("Sitemap index generation error:", error);

    // Fallback sitemap index
    const fallbackIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-static.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;

    return new Response(fallbackIndex, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }
}
