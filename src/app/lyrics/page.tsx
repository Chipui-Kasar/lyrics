import AllLyrics from "@/components/component/AllLyrics/AllLyrics";
import { ILyrics } from "@/models/IObjects";
import { getLyrics } from "@/service/allartists";
import { Metadata } from "next";
import { cache } from "react";
export const dynamic = "force-static";
export const revalidate = 300; // 30 minutes

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
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "All Tangkhul Lyrics | Tangkhul Laa Collection",
    description:
      "Browse a curated collection of Tangkhul lyrics and songs. Discover your favorite Tangkhul Laa with artist and album info.",
    keywords: [
      "Tangkhul lyrics",
      "Tangkhul songs",
      "Tangkhul Laa",
      "Ukhrul music",
      "Tangkhul artists",
      "Tangkhul albums",
    ],
    openGraph: {
      title: "All Tangkhul Lyrics | Tangkhul Laa Collection",
      description:
        "Explore the complete list of Tangkhul songs and lyrics. Updated regularly with the latest tracks and artists.",
      url: "https://tangkhullyrics.com/lyrics",
      type: "website",
      images: [
        {
          url: "https://tangkhullyrics.com/ogImage.jpg",
          width: 1200,
          height: 630,
          alt: "Tangkhul Lyrics Banner",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "All Tangkhul Lyrics",
      description:
        "Explore the best Tangkhul Laa with lyrics and artist details. Updated regularly.",
      images: ["https://tangkhullyrics.com/ogImage.jpg"],
    },
    alternates: {
      canonical: "https://tangkhullyrics.com/lyrics",
    },
  };
}

// ✅ Page Component
const Lyrics = async () => {
  const topLyrics = await fetchLyricsCached();

  return (
    <div className="flex min-h-screen flex-col dark:bg-background">
      <main className="flex-1">
        <section className="container py-4 sm:py-8 md:py-10 m-auto">
          <AllLyrics lyrics={topLyrics} />
        </section>
      </main>
    </div>
  );
};

export default Lyrics;
