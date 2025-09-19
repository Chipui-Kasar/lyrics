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
    title: optimizedTitle,
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
