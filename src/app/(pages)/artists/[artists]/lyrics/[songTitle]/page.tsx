import Lyrics from "@/components/component/AllArtists/ArtistsSongList/Lyrics/Lyrics";

const fetchSingleLyrics = async (params: { artists: any; songTitle: any }) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/lyrics/author/singleLyrics?artistName=${params.artists}&songTitle=${params.songTitle}`,
      {
        next: { revalidate: 60 },
        // cache: "force-cache",
      }
    );
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error("Error fetching featured lyrics:", error);
    return [];
  }
};
const LyricsPage = async ({
  params,
}: {
  params: { artists: string; songTitle: string };
}) => {
  const [lyricsDetails] = await Promise.all([fetchSingleLyrics(params)]);
  return <Lyrics lyrics={lyricsDetails} />;
};
export default LyricsPage;
