import Lyrics from "@/components/component/AllArtists/ArtistsSongList/Lyrics/Lyrics";
import { ILyrics } from "@/models/IObjects";
import { getLyrics, getSingleLyrics } from "@/service/allartists";

// Fetch single lyrics based on both the ID and title
const fetchSingleLyrics = async (id: string, title: string, artist: string) => {
  return await getSingleLyrics(id, title, artist); // Modify this function to accept both id and title
};

// Generate static parameters using both ID and title for the URL
export async function generateStaticParams() {
  const posts = await getLyrics();

  return posts.map((post: ILyrics) => ({
    id: post._id, // Assuming your post object has an id property
    title: post.title,
    artist: post.artistId?.name,
  }));
}

const LyricsPage = async ({
  params,
}: {
  params: { lyricsID: string; "title~artist": string };
}) => {
  const [title, artist] = params["title~artist"].split("~"); // Split the title and artist
  const lyricsID = params.lyricsID;
  const [lyricsDetails] = await Promise.all([
    fetchSingleLyrics(lyricsID, title, artist), // Pass both params to fetch function
  ]);

  return <Lyrics lyrics={lyricsDetails} />;
};

export default LyricsPage;
