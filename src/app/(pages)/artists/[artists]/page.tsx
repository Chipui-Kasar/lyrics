import ArtistsSongLists from "@/components/component/AllArtists/ArtistsSongList/ArtistsSongLists";

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

export default async function Slug({
  params,
}: {
  params: { artists: string };
}) {
  const lyrics = await fetchFeaturedLyrics(params.artists);
  return <ArtistsSongLists lyrics={lyrics} />;
}

// ✅ Pre-generating Static Pages at Build Time
export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artists`);
    const artists = res.ok ? await res.json() : [];

    return artists.map((artist: { name: string }) => ({
      artists: artist.name, // Generates `/artists/{artist-name}`
    }));
  } catch (error) {
    console.error("Error fetching artist list:", error);
    return [];
  }
}
