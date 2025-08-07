import AllLyrics from "@/components/component/AllLyrics/AllLyrics";
import { ILyrics } from "@/models/IObjects";
import { getLyrics } from "@/service/allartists";
import { generatePageMetadata } from "@/lib/utils";
import { cache } from "react";
export const dynamic = "force-static";
export const revalidate = 300; // 5 minutes

// Cache the lyrics fetch to prevent duplicate calls during the same request
const fetchLyricsCached = cache(async (): Promise<ILyrics[]> => {
  return await getLyrics();
});

// 🔹 Generate Static Params for SSG
export async function generateStaticParams() {
  const lyrics = await fetchLyricsCached();

  return lyrics.map((lyric: ILyrics) => ({
    id: lyric._id, // Assuming `_id` is the unique identifier
  }));
}

// ✅ Enhanced SEO Metadata using utility function
export async function generateMetadata() {
  return generatePageMetadata({
    title: "All Tangkhul Lyrics - Complete Song Collection",
    description:
      "Browse our comprehensive collection of Tangkhul song lyrics. Discover traditional and contemporary Tangkhul Laa with artist information and cultural context.",
    url: "https://tangkhullyrics.com/lyrics",
    keywords:
      "Tangkhul lyrics, Tangkhul songs, Tangkhul Laa, Ukhrul music, Tangkhul artists, traditional songs, Manipur music",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Tangkhul Lyrics Collection",
      description:
        "Complete collection of Tangkhul song lyrics and traditional music",
      url: "https://tangkhullyrics.com/lyrics",
      mainEntity: {
        "@type": "MusicPlaylist",
        name: "Tangkhul Song Collection",
        description: "Traditional and contemporary Tangkhul songs",
        genre: "Traditional Music",
      },
    },
  });
}

// ✅ Page Component
const Lyrics = async () => {
  const topLyrics = await fetchLyricsCached();

  return (
    <div className="flex min-h-screen flex-col dark:bg-background">
      <main className="flex-1">
        <section className="container py-4 sm:py-8 md:py-10 m-auto">
          <AllLyrics
            lyrics={topLyrics.sort((a, b) => a.title.localeCompare(b.title))}
          />
        </section>
      </main>
    </div>
  );
};

export default Lyrics;
