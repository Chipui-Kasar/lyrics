import SearchClient from "@/components/component/SearchResult/SearchClient";
import { generatePageMetadata } from "@/lib/utils";
export const dynamic = "force-static";
export const revalidate = 300;

// ✅ Enhanced SEO Metadata using utility function
export async function generateMetadata() {
  return generatePageMetadata({
    title: "Search Tangkhul Lyrics & Artists - Find Your Favorite Songs",
    description:
      "Search through our comprehensive collection of Tangkhul songs, lyrics, and artists. Discover your favorite Tangkhul music with powerful search functionality.",
    url: "https://tangkhullyrics.com/search",
    keywords:
      "search Tangkhul lyrics, find Tangkhul songs, Tangkhul artist search, Tangkhul music search, song finder, lyrics search",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://tangkhullyrics.com/search?q={search_term_string}",
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/IOSPlatform",
          "http://schema.org/AndroidPlatform",
        ],
      },
      "query-input": "required name=search_term_string",
    },
  });
}

export default function SearchPage() {
  return <SearchClient />;
}
