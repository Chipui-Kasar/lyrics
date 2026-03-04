import AllArtistsHydrated from "@/components/component/AllArtists/AllArtistsHydrated";
import { generatePageMetadata } from "@/lib/utils";
// import { IArtists } from "@/models/IObjects";
import { getArtistsWithSongCount } from "@/service/allartists";
export const dynamic = "force-static";
// PERFORMANCE FIX: Increased from 300s to reduce ISR writes
// Artists list changes infrequently, longer cache is appropriate
export const revalidate = 3600; // 1 hour
// ✅ Fetch artists with song counts
const fetchArtistsWithSongCount = async () => {
  return await getArtistsWithSongCount();
};

// ✅ Pre-generate static paths for SEO
// export const generateStaticParams = async () => {
//   const posts = await fetchArtistsWithSongCount();
//   return posts.map((post: IArtists) => ({ artists: post.name }));
// };

// ✅ Enhanced SEO Metadata with structured data
export async function generateMetadata() {
  return generatePageMetadata({
    title: "All Tangkhul Artists - Complete Artist Directory",
    description:
      "Explore our complete directory of Tangkhul artists and musicians. Discover traditional and contemporary Tangkhul singers, songwriters, and performers with their song collections.",
    url: "https://tangkhullyrics.com/allartists",
    keywords:
      "Tangkhul artists, Tangkhul musicians, Tangkhul singers, traditional artists, contemporary musicians, Manipur artists, tribal music",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Tangkhul Artists Directory",
      description: "Complete directory of Tangkhul musicians and artists",
      url: "https://tangkhullyrics.com/allartists",
      mainEntity: {
        "@type": "ItemList",
        name: "Tangkhul Artists",
        description:
          "Collection of traditional and contemporary Tangkhul musicians",
        numberOfItems: "50+",
      },
    },
  });
}

// ✅ Server Component for displaying all artists
export default async function AllArtistsPage() {
  const artists = await fetchArtistsWithSongCount();
  return <AllArtistsHydrated initialArtists={artists} />;
}
