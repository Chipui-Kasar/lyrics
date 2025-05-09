import Lyrics from "@/components/component/AllArtists/ArtistsSongList/Lyrics/Lyrics";
import { generatePageMetadata } from "@/lib/utils";
import { ILyrics } from "@/models/IObjects";
import { getLyrics, getSingleLyrics } from "@/service/allartists";

// 🔹 Generate Metadata Dynamically
export async function generateMetadata({
  params,
}: {
  params: { lyricsID: string; "title~artist": string };
}) {
  const [title, artist] = params["title~artist"].split("~"); // Split the title and artist
  const lyricsID = params.lyricsID;

  const lyric: ILyrics = await getSingleLyrics(lyricsID, title, artist);

  if (!lyric) {
    return generatePageMetadata({
      title: "Lyrics Not Found",
      description: "Lyrics not available.",
      url: "https://tangkhullyrics.com/lyrics/not-found",
    });
  }

  return generatePageMetadata({
    title: `${lyric.title} by ${lyric.artistId?.name}`,
    description: `Read the lyrics of '${lyric.title}' by ${lyric.artistId?.name}.`,
    url: `https://tangkhullyrics.com/lyrics/${lyric._id}/${lyric.title}~${lyric.artistId?.name}`,
    image: `${lyric.thumbnail ?? lyric.artistId?.image ?? "/ogImage.jpg"}`, // ✅ Use a valid image
    keywords: `${lyric.title}, ${lyric.artistId?.name}, Tangkhul lyrics, Tangkhul songs, Tangkhul Laa, ${lyric.title} lyrics, ${lyric.artistId?.name} lyrics`,
  });
}

// 🔹 Generate Static Params for SSG
export async function generateStaticParams() {
  const posts = await getLyrics();

  return posts.map((post: ILyrics) => ({
    lyricsID: post._id, // ✅ Matches route param
    "title~artist": `${post.title}~${post.artistId?.name}`, // ✅ Matches dynamic segment
  }));
}

// 🔹 Page Component
const LyricsPage = async ({
  params,
}: {
  params: { lyricsID: string; "title~artist": string };
}) => {
  const [title, artist] = params["title~artist"].split("~");
  const lyricsID = params.lyricsID;

  const lyric = await getSingleLyrics(lyricsID, title, artist);

  return <Lyrics lyrics={lyric} />;
};

export default LyricsPage;
