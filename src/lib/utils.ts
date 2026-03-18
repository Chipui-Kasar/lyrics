import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Metadata } from "next";
import { ILyrics } from "@/models/IObjects";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//a function to convert space to - in a string
export function slugMaker(str: string) {
  return str.replace(/\s/g, "-").toLowerCase();
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
  robots?: string;
  structuredData?: Record<string, any>;
}

export function generatePageMetadata({
  title,
  description,
  url,
  image = "https://tangkhullyrics.com/ogImage.jpg",
  keywords = "Tangkhul lyrics, Tangkhul song lyrics, Tangkhul Laa, Tangkhul music",
  robots = "index, follow",
  structuredData,
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  keywords?: string;
  robots?: string;
  structuredData?: Record<string, any>;
}): Metadata {
  // Ensure description is optimized length (150-160 characters)
  const optimizedDescription =
    description.length > 160
      ? description.substring(0, 157) + "..."
      : description;

  // Ensure title is optimized length (50-60 characters)
  const optimizedTitle =
    title.length > 60 ? title.substring(0, 57) + "..." : title;

  return {
    // Use an absolute title so route-level metadata doesn't get the layout
    // template appended a second time.
    title: {
      absolute: optimizedTitle,
    },
    description: optimizedDescription,
    keywords: Array.isArray(keywords) ? keywords : keywords.split(", "),
    metadataBase: new URL("https://tangkhullyrics.com"),

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: optimizedTitle,
      description: optimizedDescription,
      url,
      siteName: "Tangkhul Lyrics",
      type: "website",
      locale: "en_US",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: optimizedTitle,
          type: "image/jpeg",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      site: "@TangkhulLyrics",
      creator: "@TangkhulLyrics",
      title: optimizedTitle,
      description: optimizedDescription,
      images: [image],
    },

    robots: {
      index: robots.includes("index"),
      follow: robots.includes("follow"),
      googleBot: {
        index: robots.includes("index"),
        follow: robots.includes("follow"),
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    other: {
      "article:publisher": "https://tangkhullyrics.com",
      "og:site_name": "Tangkhul Lyrics",
      "twitter:domain": "tangkhullyrics.com",
      "format-detection": "telephone=no",
    },
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
export const highlightFuzzyMatch = (text: string, query: string): string => {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();

  // Exact match highlighting
  if (textLower.includes(queryLower)) {
    const regex = new RegExp(
      query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "gi",
    );
    return text.replace(
      regex,
      (match) =>
        `<span class="bg-yellow-200 text-yellow-800 font-semibold">${match}</span>`,
    );
  }

  // Partial word matching
  const words = text.split(" ");
  const queryWords = query.split(" ");

  let result = text;

  for (const queryWord of queryWords) {
    if (queryWord.length >= 2) {
      const partialRegex = new RegExp(
        `\\b\\w*${queryWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\w*`,
        "gi",
      );
      result = result.replace(partialRegex, (match) => {
        if (match.toLowerCase().includes(queryWord.toLowerCase())) {
          return `<span class="bg-blue-100 text-blue-800">${match}</span>`;
        }
        return match;
      });
    }
  }

  // Individual character matching for very fuzzy results
  if (result === text) {
    const queryChars = queryLower.split("");
    let charIndex = 0;

    result = text
      .split("")
      .map((char, index) => {
        if (
          charIndex < queryChars.length &&
          char.toLowerCase() === queryChars[charIndex]
        ) {
          charIndex++;
          return `<span class="bg-green-100 text-green-800">${char}</span>`;
        }
        return char;
      })
      .join("");
  }

  return result;
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

/**
 * Removes all custom CSS (inline styles, class, id) and duplicates from an HTML string.
 * @param html - The input HTML string.
 * @returns {string} Cleaned HTML string without custom CSS or duplicate elements.
 */
export const sanitizeAndDeduplicateHTML = (html: string): string => {
  if (!html) return "";

  const sanitized = html
    .replace(/\n/g, "<br/>")
    .replace(/\sstyle="[^"]*"/gi, "")
    .replace(/\sclass="[^"]*"/gi, "")
    .replace(/\sid="[^"]*"/gi, "");

  if (typeof window === "undefined") {
    return sanitized;
  }

  const wrapper = document.createElement("div");
  wrapper.innerHTML = sanitized;
  const elements = wrapper.querySelectorAll("*");
  elements.forEach((el) => {
    if (el.tagName !== "IMG") {
      el.removeAttribute("style");
      el.removeAttribute("class");
      el.removeAttribute("id");
    }
  });

  return wrapper.innerHTML.trim();
};

export const replaceAllHTMLTagsWithSpace = (html: string): string => {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, " ").trim();
};

// Fuzzy matching utilities
export const calculateLevenshteinDistance = (
  str1: string,
  str2: string,
): number => {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator,
      );
    }
  }

  return matrix[str2.length][str1.length];
};

export const calculateSimilarity = (query: string, text: string): number => {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();

  // Exact match gets highest score
  if (textLower.includes(queryLower)) {
    const startIndex = textLower.indexOf(queryLower);
    // Bonus for word boundary matches
    const isWordBoundary =
      startIndex === 0 || textLower[startIndex - 1] === " ";
    return 1.0 + (isWordBoundary ? 0.2 : 0.1);
  }

  // Check for partial word matches first (more generous)
  const words = textLower.split(" ");
  let partialScore = 0;

  for (const word of words) {
    // More generous partial matching
    if (queryLower.length >= 2) {
      if (
        word.startsWith(queryLower.substring(0, Math.min(3, queryLower.length)))
      ) {
        partialScore += 0.4; // Increased from 0.3
      }
      if (word.includes(queryLower.substring(0, 2))) {
        partialScore += 0.3; // Increased from 0.2
      }
      // Check if query characters appear in order (very fuzzy)
      let queryIndex = 0;
      for (let i = 0; i < word.length && queryIndex < queryLower.length; i++) {
        if (word[i] === queryLower[queryIndex]) {
          queryIndex++;
        }
      }
      if (queryIndex === queryLower.length) {
        partialScore += 0.25; // Bonus for character sequence match
      }
    }
  }

  // Fuzzy matching with Levenshtein distance (more generous)
  const distance = calculateLevenshteinDistance(queryLower, textLower);
  const maxLength = Math.max(queryLower.length, textLower.length);
  const similarity = Math.max(0, 1 - distance / maxLength);

  // For very short queries, be more permissive
  if (queryLower.length <= 3) {
    partialScore *= 1.2; // Boost short query matches
  }

  return Math.max(similarity, partialScore);
};

// Helper function to extract matching lyrics excerpt
export const getMatchingLyricsExcerpt = (
  lyrics: string,
  query: string,
  maxLines: number = 2,
): string => {
  if (!lyrics || !query) return "";

  const lines = lyrics.split("\n").filter((line) => line.trim());
  const searchRegex = new RegExp(query, "i");

  // Find the first line that matches
  const matchingLineIndex = lines.findIndex((line) => searchRegex.test(line));

  if (matchingLineIndex === -1) return "";

  // Extract the matching line and the next line (or previous line if it's the last)
  const startIndex = Math.max(0, matchingLineIndex);
  const endIndex = Math.min(lines.length, startIndex + maxLines);

  const excerpt = lines.slice(startIndex, endIndex).join("\n");

  // Truncate if too long (more than 100 characters)
  if (excerpt.length > 100) {
    return excerpt.substring(0, 97) + "...";
  }

  return excerpt;
};
