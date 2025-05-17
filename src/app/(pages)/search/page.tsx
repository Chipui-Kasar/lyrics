import SearchResult from "@/components/component/SearchResult/SearchResult";
import { generatePageMetadata } from "@/lib/utils";
import { searchLyrics } from "@/service/allartists";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.query?.toString() ?? "";
  const formattedQuery = decodeURIComponent(query);

  return generatePageMetadata({
    title: `Search results for "${formattedQuery}"`,
    description: `Find Tangkhul song lyrics related to "${formattedQuery}" on TangkhulLyrics.`,
    url: `https://tangkhullyrics.com/search?query=${encodeURIComponent(query)}`,
    keywords: `Tangkhul lyrics, Search lyrics, Tangkhul song lyrics, ${formattedQuery}, Tangkhul music`,
  });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.query?.toString() ?? "";
  const formattedQuery = decodeURIComponent(query);
  const lyrics = query ? await searchLyrics(formattedQuery) : { lyrics: [] };

  return <SearchResult params={query} lyrics={lyrics} />;
}
