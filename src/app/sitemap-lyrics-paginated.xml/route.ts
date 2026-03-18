// Future enhancement: Multiple lyrics sitemaps for 50,000+ lyrics
// You can uncomment and modify this when you have massive scale

/*
import { slugMaker } from "@/lib/utils";
import { getLyrics } from "@/service/allartists";

const BASE_URL = "https://tangkhullyrics.com";
export const dynamic = "force-static";
export const revalidate = 1800;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const CHUNK_SIZE = 45000; // URLs per sitemap
    
    const lyrics = await getLyrics();
    const startIndex = (page - 1) * CHUNK_SIZE;
    const endIndex = startIndex + CHUNK_SIZE;
    const currentChunk = lyrics.slice(startIndex, endIndex);

    const lyricPages = currentChunk.flatMap((lyric: any) => [
      {
        url: `/lyrics/${lyric._id}/${slugMaker(lyric.title)}_${slugMaker(
          lyric.artistId?.name || ""
        )}`,
        priority: "0.8",
        changefreq: "weekly",
        lastmod: lyric.updatedAt || lyric.createdAt || new Date().toISOString(),
      },
    ]);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${lyricPages
  .map(
    (item: any) => `  <url>
    <loc>${BASE_URL}${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=1800",
      },
    });
  } catch (error) {
    return new Response("Error generating sitemap", { status: 500 });
  }
}
*/
