import AllArtitsts from "@/components/component/AllArtists/AllArtitsts";
import { IArtists } from "@/models/IObjects";
import { getArtistsWithSongCount } from "@/service/allartists";

const fetchArtistsWithSongCount = async () => {
  return await getArtistsWithSongCount();
};
export const generateStaticParams = async () => {
  const posts = await fetchArtistsWithSongCount();
  return posts.map((post: IArtists) => ({ artists: post.name }));
};
export default async function AllArtistsPage() {
  const artists = await fetchArtistsWithSongCount();
  return <AllArtitsts artists={artists} />;
}
