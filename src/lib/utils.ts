import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Metadata } from "next";
import { ILyrics } from "@/models/IObjects";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//a function to convert space to - in a string
export function slugMaker(str: string) {
  return str.replace(/\s/g, "-");
}
export function removeSlug(str: string) {
  return str.replace(/-/g, " ");
}

//function for metatags

interface MetadataProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  keywords?: string;
}

export function generatePageMetadata({
  title,
  description,
  url,
  image = "/ogImage.jpg", // Default image if none is provided
  keywords = "Tangkhul lyrics, Tangkhul song lyrics, Tangkhul Laa, Tangkhul music",
}: MetadataProps): Metadata {
  return {
    title,
    description,
    metadataBase: new URL("https://tangkhullyrics.com/"),

    openGraph: {
      title,
      description,
      url,
      siteName: "Tangkhul Lyrics",
      images: [
        {
          url: image ?? "/ogImage.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image ?? "/ogImage.jpg"],
      site: "@TangkhulLyrics",
    },

    alternates: {
      canonical: url,
    },

    keywords,
  };
}

// Function to calculate similarity percentage (Levenshtein Distance)
const getSimilarity = (str1: string, str2: string) => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  const longerLength = longer.length;

  if (longerLength === 0) return 100;

  let costs = new Array(shorter.length + 1).fill(0).map((_, i) => i);
  let lastCost = 0,
    newCost;

  for (let i = 1; i <= longer.length; i++) {
    lastCost = i;
    for (let j = 1; j <= shorter.length; j++) {
      if (longer[i - 1] === shorter[j - 1]) {
        newCost = costs[j - 1];
      } else {
        newCost = Math.min(lastCost, costs[j], costs[j - 1]) + 1;
      }
      costs[j - 1] = lastCost;
      lastCost = newCost;
    }
    costs[shorter.length] = lastCost;
  }

  return ((longerLength - lastCost) / longerLength) * 100;
};
// Function to highlight fuzzy matches
export const highlightFuzzyMatch = (text: string, query: string) => {
  const words = text.split(" "); // Split into words
  let startIndex = -1;

  // Find the first word that matches ≥ 60%
  for (let i = 0; i < words.length; i++) {
    if (getSimilarity(words[i].toLowerCase(), query.toLowerCase()) >= 60) {
      startIndex = i;
      break;
    }
  }

  // Slice from the first matching word (or fallback to full text)
  const relevantWords = startIndex !== -1 ? words.slice(startIndex) : words;

  // Highlight all words that match ≥ 60%
  const highlightedWords = relevantWords.map((word) => {
    const similarity = getSimilarity(word.toLowerCase(), query.toLowerCase());
    if (similarity >= 60) {
      return `<span class="bg-[hsl(var(--highlight-yellow))] text-primary">${word}</span>`;
    }
    return word;
  });

  return highlightedWords.join(" "); // Join words back
};

export const handleShare = async (lyrics: ILyrics) => {
  if (typeof window !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: lyrics.title,
        text: `Check out the song "${lyrics.title}" by ${lyrics.artistId?.name}!`,
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  } else {
    alert("Sharing is not supported on this browser.");
  }
};
