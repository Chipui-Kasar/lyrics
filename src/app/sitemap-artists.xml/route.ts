import { slugMaker } from "@/lib/utils";
import { getAllArtists } from "@/service/allartists";

const BASE_URL = "https://tangkhullyrics.com";
// CRITICAL FIX: Removed force-dynamic to prevent ISR write on every crawler request
// Artist data changes infrequently, use longer cache
export const dynamic = "force-static";
export const revalidate = 43200; // 12 hours - artists are added infrequently

export async function GET() {
  try {
    const artists = await getAllArtists();

    const artistPages = artists.map((artist: any) => ({
      url: `/artists/${slugMaker(artist.name)}`,
      priority: "0.8",
      changefreq: "weekly",
      lastmod: artist.updatedAt || artist.createdAt || new Date().toISOString(),
    }));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
${artistPages
  .map(
    (item: any) => `  <url>
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
        // PERFORMANCE FIX: Updated Cache-Control to match revalidate=43200 (12h)
        "Cache-Control":
          "public, max-age=43200, s-maxage=86400, stale-while-revalidate=172800",
      },
    });
  } catch (error) {
    console.error("Artists sitemap generation error:", error);

    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/allartists</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

    return new Response(fallbackXml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=43200, s-maxage=86400",
      },
    });
  }
}
