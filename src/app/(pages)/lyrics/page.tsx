import AllLyrics from "@/components/component/AllLyrics/AllLyrics";
import { ILyrics } from "@/models/IObjects";
import { getLyrics } from "@/service/allartists";

// ✅ Fetch all data in parallel
const fetchHomeData = async () => {
  return await Promise.all([getLyrics()]);
};

// 🔹 Generate Static Params for SSG

// 🔹 Generate Static Params for SSG
export async function generateStaticParams() {
  const [lyrics] = await fetchHomeData();

  return lyrics.map((lyric: ILyrics) => ({
    id: lyric._id, // Assuming `_id` is the unique identifier for each lyric
  }));
}

// ✅ Home Page Component
const Lyrics = async () => {
  const [topLyrics] = await fetchHomeData();

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
