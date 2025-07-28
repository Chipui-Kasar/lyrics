import { slugMaker } from "@/lib/utils";
import { getAllArtists, getLyrics } from "@/service/allartists";

const BASE_URL = "https://tangkhullyrics.com";
export const dynamic = "force-dynamic";
export const revalidate = 86400; // 24 hours

export async function GET() {
  try {
    const lyrics = await getLyrics();
    const artists = await getAllArtists();

    const staticPages = [
      { url: "/", priority: "1.0", changefreq: "daily" },
      { url: "/about", priority: "0.8", changefreq: "monthly" },
      { url: "/contact", priority: "0.7", changefreq: "monthly" },
      { url: "/lyrics", priority: "0.9", changefreq: "daily" },
      { url: "/search", priority: "0.8", changefreq: "weekly" },
      { url: "/allartists", priority: "0.9", changefreq: "weekly" },
      { url: "/contribute", priority: "0.7", changefreq: "monthly" },
    ];

    const lyricPages = lyrics.flatMap((lyric: any) => [
      {
        url: `/lyrics/${lyric._id}/${slugMaker(lyric.title)}_${slugMaker(
          lyric.artistId?.name || ""
        )}`,
        priority: "0.8",
        changefreq: "weekly",
        lastmod: lyric.updatedAt || lyric.createdAt || new Date().toISOString(),
      },
      {
        url: `/lyrics/${lyric._id}/${slugMaker(lyric.title)}_${slugMaker(
          lyric.artistId?.name || ""
        )}/details`,
        priority: "0.7",
        changefreq: "monthly",
        lastmod: lyric.updatedAt || lyric.createdAt || new Date().toISOString(),
      },
    ]);

    const artistPages = artists.map((artist: any) => ({
      url: `/artists/${slugMaker(artist.name)}`,
      priority: "0.8",
      changefreq: "weekly",
      lastmod: new Date().toISOString(),
    }));

    const allUrls = [...staticPages, ...lyricPages, ...artistPages];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls
  .map(
    (item) => `  <url>
    <loc>${BASE_URL}${item.url}</loc>
    <lastmod>${item.lastmod || new Date().toISOString()}</lastmod>
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
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);

    // Fallback sitemap with minimal pages
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/lyrics</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
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
        "Cache-Control": "public, max-age=3600",
      },
    });
  }
}
