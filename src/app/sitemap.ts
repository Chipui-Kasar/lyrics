import type { MetadataRoute } from "next";
import { slugMaker } from "@/lib/utils";
import { getAllArtists, getLyrics } from "@/service/allartists";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lyrics = await getLyrics();
  const artists = await getAllArtists();

  const staticPages = ["/", "/about", "/contact", "/allartists", "/contribute"];

  const lyricPages = lyrics.flatMap((lyric: any) => [
    `/lyrics/${lyric._id}/${slugMaker(lyric.title)}~${slugMaker(
      lyric.artistId?.name
    )}`,
    `/lyrics/${lyric._id}/${slugMaker(lyric.title)}~${slugMaker(
      lyric.artistId?.name
    )}/details`,
  ]);

  const artistPages = artists.map(
    (artist: any) => `/artists/${slugMaker(artist.name)}`
  );

  const allUrls = [...staticPages, ...lyricPages, ...artistPages];

  const sitemap: MetadataRoute.Sitemap = allUrls.map((url) => ({
    url: `${BASE_URL}${url}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: url === "/" ? 1.0 : 0.8,
  }));

  return sitemap;
}
