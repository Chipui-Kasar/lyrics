import { slugMaker } from "@/lib/utils";
import { getAllArtists, getLyrics } from "@/service/allartists";

const BASE_URL = "https://tangkhullyrics.com";
// CRITICAL FIX: Removed force-dynamic to prevent ISR write on every crawler request
// Sitemap index is stable content, use ISR caching
export const dynamic = "force-static";
export const revalidate = 43200; // 12 hours - sitemap index is very stable

export async function GET() {
  try {
    // PERFORMANCE FIX: Use stable date rounded to revalidate period
    // This ensures ISR cache is effective and doesn't create unique content on each render
    const lastmod = new Date(Math.floor(Date.now() / (43200 * 1000)) * 43200 * 1000).toISOString();
    
    // Create sitemap index with multiple sitemaps for better scalability
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-static.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-lyrics.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-artists.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;

    return new Response(sitemapIndex, {
      headers: {
        "Content-Type": "application/xml",
        // PERFORMANCE FIX: Updated Cache-Control to match revalidate=43200 (12h)
        // Longer cache reduces unnecessary regenerations from crawler traffic
        "Cache-Control":
          "public, max-age=43200, s-maxage=86400, stale-while-revalidate=172800",
        "X-Robots-Tag": "noindex",
      },
    });
  } catch (error) {
    console.error("Sitemap index generation error:", error);

    const fallbackDate = new Date(Math.floor(Date.now() / (43200 * 1000)) * 43200 * 1000).toISOString();
    // Fallback sitemap index
    const fallbackIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap-static.xml</loc>
    <lastmod>${fallbackDate}</lastmod>
  </sitemap>
</sitemapindex>`;

    return new Response(fallbackIndex, {
      headers: {
        "Content-Type": "application/xml",
        // Longer cache for fallback as well
        "Cache-Control": "public, max-age=43200, s-maxage=86400",
      },
    });
  }
}
