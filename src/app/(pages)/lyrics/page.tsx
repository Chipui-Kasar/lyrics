import AllLyrics from "@/components/component/AllLyrics/AllLyrics";
import { ILyrics } from "@/models/IObjects";
import { getLyrics } from "@/service/allartists";
import { cache } from "react";

export const revalidate = 1800; // 30 minutes

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
