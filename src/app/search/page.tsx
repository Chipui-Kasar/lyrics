import SearchClient from "@/components/component/SearchResult/SearchClient";
import { generatePageMetadata } from "@/lib/utils";
import { Metadata } from "next";

export const dynamic = "force-static";
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Search Tangkhul Lyrics",
  description: "Find Tangkhul song lyrics and artists.",
  keywords: [
    "Tangkhul lyrics",
    "Search lyrics",
    "Tangkhul song lyrics",
    "Tangkhul music",
  ],
  alternates: {
    canonical: "https://tangkhullyrics.com/search",
  },
  openGraph: {
    title: "Search Tangkhul Lyrics",
    description: "Find Tangkhul song lyrics and artists.",
    url: "https://tangkhullyrics.com/search",
    type: "website",
    images: [
      {
        url: "https://tangkhullyrics.com/ogImage.jpg",
        width: 1200,
        height: 630,
        alt: "Search Tangkhul Lyrics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Search Tangkhul Lyrics",
    description: "Discover Tangkhul songs and lyrics by artists and keywords.",
    images: ["https://tangkhullyrics.com/ogImage.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SearchPage() {
  return <SearchClient />;
}
