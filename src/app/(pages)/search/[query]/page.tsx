import SearchResult from "@/components/component/SearchResult/SearchResult";
import { generatePageMetadata, removeSlug } from "@/lib/utils";
import { ILyrics } from "@/models/IObjects";
import { getLyrics, searchLyrics } from "@/service/allartists";
import { notFound } from "next/navigation"; // Handle invalid queries

// ✅ Fetch search results on the server
const fetchSearchResults = async (query: string) => {
  if (!query) return { lyrics: [] }; // Prevent undefined errors
  return await searchLyrics(query);
};

// ✅ Pre-generate static paths for popular searches
export const generateStaticParams = async () => {
  const popularQueries = await getLyrics(); // Fetch static queries
  return popularQueries
    .filter((lyric: ILyrics) => lyric.lyrics) // Ensure lyrics exist
    .map((lyric: ILyrics) => ({
      query: encodeURIComponent(
        lyric.title?.toLowerCase()?.replace(/\s+/g, "-")
      ), // Ensure URL-safe slugs
    }));
};

// ✅ Allow dynamic params (fixes caching issue)
export const dynamicParams = true;

// ✅ Generate Metadata for better SEO
export async function generateMetadata({
  params,
}: {
  params: { query: string };
}) {
  const formattedQuery = removeSlug(params.query); // Convert slug back to normal text

  return generatePageMetadata({
    title: `Search results for "${formattedQuery}"`,
    description: `Find Tangkhul song lyrics related to "${formattedQuery}" on TangkhulLyrics. Explore the rich and vibrant world of Tangkhul music and immerse yourself in the Tangkhul lyrical oasis. Discover the best Tangkhul songs and lyrics at TangkhulLyrics.`,
    url: `https://tangkhullyrics.com/search/${params.query}`,
    keywords: `Tangkhul lyrics, Search lyrics, Tangkhul song lyrics, ${formattedQuery}, Tangkhul music, Tangkhul lyrical oasis`,
  });
}

// ✅ Server component for search results
export default async function SearchPage({
  params,
}: {
  params: { query: string };
}) {
  const formattedQuery = removeSlug(params.query); // Convert slug back to normal text
  const lyrics = await fetchSearchResults(formattedQuery);

  return <SearchResult params={params.query} lyrics={lyrics} />;
}
