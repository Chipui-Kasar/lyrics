import SearchResult from "@/components/component/SearchResult/SearchResult";
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
      query: lyric.lyrics.toLowerCase().replace(/\s+/g, "-"), // Ensure consistency
    }));
};

// ✅ Allow dynamic params (fixes caching issue)
export const dynamicParams = true;

// ✅ Server component for search results
export default async function SearchPage({
  params,
}: {
  params: { query: string };
}) {
  const formattedQuery = params.query.replace(/-/g, " "); // Convert slug back to normal text
  const lyrics = await fetchSearchResults(formattedQuery);

  return <SearchResult params={params.query} lyrics={lyrics} />;
}
