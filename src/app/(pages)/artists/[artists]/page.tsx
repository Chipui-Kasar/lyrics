import ArtistsSongLists from "@/components/component/AllArtists/ArtistsSongList/ArtistsSongLists";
import { IArtists } from "@/models/IObjects";
import {
  getAllArtists,
  getSingleArtistWithSongCount,
} from "@/service/allartists";

const fetchFeaturedLyrics = async (artistName: string) => {
  return await getSingleArtistWithSongCount(artistName);
};

export const generateStaticParams = async () => {
  const posts = await getAllArtists();
  return posts.map((post: IArtists) => ({ artists: post.name }));
};

export default async function ArtistPage({
  params,
}: {
  params: { artists: string };
}) {
  const lyrics = await fetchFeaturedLyrics(params.artists);
  return <ArtistsSongLists lyrics={lyrics} />;
}
