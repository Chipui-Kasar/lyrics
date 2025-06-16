import SearchClient from "@/components/component/SearchResult/SearchClient";
import { generatePageMetadata } from "@/lib/utils";

export const dynamic = "force-static";
export const revalidate = 60;

export const metadata = generatePageMetadata({
  title: "Search Tangkhul Lyrics",
  description: "Find Tangkhul song lyrics and artists.",
  url: "https://tangkhullyrics.com/search",
  keywords: "Tangkhul lyrics, Search lyrics, Tangkhul song lyrics, Tangkhul music",
});

export default function SearchPage() {
  return <SearchClient />;
}
