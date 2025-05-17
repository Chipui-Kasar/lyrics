import AllArtitsts from "@/components/component/AllArtists/AllArtitsts";
import { generatePageMetadata } from "@/lib/utils";
import { IArtists } from "@/models/IObjects";
import { getArtistsWithSongCount } from "@/service/allartists";
export const revalidate = 604800;
// ✅ Fetch artists with song counts
const fetchArtistsWithSongCount = async () => {
  return await getArtistsWithSongCount();
};

// ✅ Pre-generate static paths for SEO
export const generateStaticParams = async () => {
  const posts = await fetchArtistsWithSongCount();
  return posts.map((post: IArtists) => ({ artists: post.name }));
};

// ✅ Generate Metadata for SEO
export async function generateMetadata() {
  return generatePageMetadata({
    title: "All Tangkhul Artists - Tangkhul Lyrics",
    description:
      "Explore all Tangkhul artists and their song lyrics on Tangkhul Lyrics.",
    url: "https://tangkhullyrics.com/allartists",
    keywords:
      "Tangkhul artists, Tangkhul song lyrics, artist song list, Tangkhul music",
  });
}

// ✅ Server Component for displaying all artists
export default async function AllArtistsPage() {
  const artists = await fetchArtistsWithSongCount();
  return <AllArtitsts artists={artists} />;
}
