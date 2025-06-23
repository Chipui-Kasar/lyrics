import { slugMaker } from "@/lib/utils";
import { getAllArtists, getLyrics } from "@/service/allartists";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
export const dynamic = "force-dynamic";
export async function GET() {
  const lyrics = await getLyrics();
  const artists = await getAllArtists();

  const staticPages = [
    "/",
    "/about",
    "/contact",
    "/lyrics",
    "/search",
    "/allartists",
    "/contribute",
  ];

  const lyricPages = lyrics.flatMap((lyric: any) => [
    `/lyrics/${lyric._id}/${slugMaker(lyric.title)}_${slugMaker(
      lyric.artistId?.name || ""
    )}`,
    `/lyrics/${lyric._id}/${slugMaker(lyric.title)}_${slugMaker(
      lyric.artistId?.name || ""
    )}/details`,
  ]);

  const artistPages = artists.map(
    (artist: any) => `/artists/${slugMaker(artist.name)}`
  );

  const allUrls = [...staticPages, ...lyricPages, ...artistPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allUrls
        .map(
          (url) => `<url>
        <loc>${BASE_URL}${url}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${url === "/" ? "1.0" : "0.8"}</priority>
      </url>`
        )
        .join("\n")}
      </urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
