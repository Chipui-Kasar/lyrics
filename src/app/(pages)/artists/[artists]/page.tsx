import ArtistsSongLists from "@/components/component/AllArtists/ArtistsSongList/ArtistsSongLists";
import { IArtists } from "@/models/IObjects";

const fetchFeaturedLyrics = async (artistName: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/lyrics/author/lyrics?artistName=${artistName}`
    );
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error("Error fetching featured lyrics:", error);
    return [];
  }
};

export const generateStaticParams = async () => {
  const posts = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artist`, {
    cache: "force-cache",
  }).then((res) => res.json());

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
