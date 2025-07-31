import { slugMaker } from "@/lib/utils";
import { getLyrics } from "@/service/allartists";

const BASE_URL = "https://tangkhullyrics.com";
export const dynamic = "force-dynamic";
export const revalidate = 1800; // 30 minutes for lyrics (more dynamic)

export async function GET() {
  try {
    const lyrics = await getLyrics();

    // Split lyrics into chunks if too many (max 45,000 URLs per sitemap for safety)
    const CHUNK_SIZE = 45000;
    const chunks = [];
    
    for (let i = 0; i < lyrics.length; i += CHUNK_SIZE) {
      chunks.push(lyrics.slice(i, i + CHUNK_SIZE));
    }

    // For now, use first chunk. Later you can create multiple lyrics sitemaps
    const currentChunk = chunks[0] || [];

    const lyricPages = currentChunk.flatMap((lyric: any) => [
      {
        url: `/lyrics/${lyric._id}/${slugMaker(lyric.title)}_${slugMaker(
          lyric.artistId?.name || ""
        )}`,
        priority: "0.8",
        changefreq: "weekly",
        lastmod: lyric.updatedAt || lyric.createdAt || new Date().toISOString(),
      },
      // Removed /details pages to avoid duplicate content issues
    ]);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
${lyricPages
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
        "Cache-Control":
          "public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Lyrics sitemap generation error:", error);
    
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/lyrics</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

    return new Response(fallbackXml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=1800",
      },
    });
  }
}
