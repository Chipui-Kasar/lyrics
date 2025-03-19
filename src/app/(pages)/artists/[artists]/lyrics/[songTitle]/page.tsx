import Lyrics from "@/components/component/AllArtists/ArtistsSongList/Lyrics/Lyrics";
import { ILyrics } from "@/models/IObjects";
import { getLyrics, getSingleLyrics } from "@/service/allartists";

const fetchSingleLyrics = async (params: { artists: any; songTitle: any }) => {
  return await getSingleLyrics(params.artists, params.songTitle);
};
export async function generateStaticParams() {
  const posts = await getLyrics();

  return posts.map((post: ILyrics) => ({
    artists: post.artistId.name,
    songTitle: post.title,
  }));
}
const LyricsPage = async ({
  params,
}: {
  params: { artists: string; songTitle: string };
}) => {
  const [lyricsDetails] = await Promise.all([fetchSingleLyrics(params)]);
  return <Lyrics lyrics={lyricsDetails} />;
};
export default LyricsPage;
