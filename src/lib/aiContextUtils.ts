// Utility functions for extracting page context for AI Assistant

export interface PageContext {
  url: string;
  title: string;
  pageType: string;
  contentSummary: string;
  metadata?: {
    description?: string;
    keywords?: string[];
  };
}

/**
 * Extract comprehensive page context for AI assistance
 */
export function extractPageContext(): PageContext {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const title = typeof document !== "undefined" ? document.title : "";

  return {
    url,
    title,
    pageType: getPageType(url),
    contentSummary: getContentSummary(),
    metadata: getPageMetadata(),
  };
}

/**
 * Determine the type of page based on URL
 */
export function getPageType(url: string): string {
  const pathname = new URL(url).pathname;

  const pageTypes: Record<string, string> = {
    "/": "Home Page",
    "/home": "Home Page",
    "/artists": "Artists Listing Page",
    "/allartists": "All Artists Page",
    "/lyrics": "Lyrics Listing Page",
    "/search": "Search Results Page",
    "/about": "About Page",
    "/contact": "Contact Page",
    "/contribute": "Contribute Lyrics Page",
    "/feed": "Feed Page",
    "/privacy": "Privacy Policy Page",
    "/terms": "Terms of Service Page",
    "/cookies": "Cookie Policy Page",
  };

  // Check exact matches first
  if (pageTypes[pathname]) {
    return pageTypes[pathname];
  }

  // Check dynamic routes
  if (pathname.startsWith("/artist-details/")) return "Artist Details Page";
  if (pathname.startsWith("/lyrics/")) return "Lyrics Detail Page";
  if (pathname.startsWith("/artists/")) return "Artist Page";
  if (pathname.startsWith("/admin")) return "Admin Page";

  return "Other Page";
}

/**
 * Extract content summary from the current page
 */
export function getContentSummary(): string {
  if (typeof document === "undefined") return "";

  const summaryParts: string[] = [];

  // Get main heading
  const h1 = document.querySelector("h1")?.textContent?.trim();
  if (h1) {
    summaryParts.push(`Main heading: ${h1}`);
  }

  // Get first paragraph
  const firstParagraph = document.querySelector("p")?.textContent?.trim();
  if (firstParagraph && firstParagraph.length > 20) {
    summaryParts.push(
      `Content preview: ${firstParagraph.substring(0, 150)}...`
    );
  }

  // Get section headings
  const h2Elements = document.querySelectorAll("h2");
  if (h2Elements.length > 0) {
    const h2Texts = Array.from(h2Elements)
      .slice(0, 3)
      .map((el) => el.textContent?.trim())
      .filter(Boolean)
      .join(", ");
    if (h2Texts) {
      summaryParts.push(`Sections: ${h2Texts}`);
    }
  }

  return summaryParts.join(". ") || "No specific content available";
}

/**
 * Extract page metadata (description, keywords)
 */
export function getPageMetadata() {
  if (typeof document === "undefined") return {};

  const description = document
    .querySelector('meta[name="description"]')
    ?.getAttribute("content");
  const keywordsContent = document
    .querySelector('meta[name="keywords"]')
    ?.getAttribute("content");
  const keywords = keywordsContent
    ? keywordsContent.split(",").map((k) => k.trim())
    : [];

  return {
    description: description || undefined,
    keywords: keywords.length > 0 ? keywords : undefined,
  };
}

/**
 * Get website scope information
 */
export function getWebsiteScope(): string {
  return `
This is Tangkhul Lyrics website - a platform dedicated to Tangkhul songs, lyrics, and artists.

Available sections:
- Home: Featured and trending lyrics
- Artists: Browse all Tangkhul artists
- Lyrics: Search and browse all lyrics
- Artist Details: View individual artist profiles and their songs
- Search: Find lyrics by title, artist, or content
- About: Learn about the website and mission
- Contact: Get in touch with the team
- Contribute: Submit new lyrics (requires login)
- Admin: Content management (restricted access)

The website contains:
- Tangkhul song lyrics with translations
- Artist profiles and discographies
- Search functionality for finding lyrics
- User contributions and community features
- Cultural and traditional Tangkhul music content
`;
}

/**
 * Validate if a question is within website scope
 */
export function isQuestionInScope(question: string): boolean {
  const lowerQuestion = question.toLowerCase();

  // Out-of-scope indicators
  const outOfScopeKeywords = [
    "weather",
    "news",
    "stock",
    "sports",
    "recipe",
    "movie",
    "calculate",
    "math problem",
    "science",
    "history",
    "general knowledge",
    "who is",
    "what is the capital",
  ];

  // In-scope indicators
  const inScopeKeywords = [
    "lyrics",
    "song",
    "artist",
    "tangkhul",
    "music",
    "search",
    "find",
    "page",
    "website",
    "how to",
    "where",
    "feature",
    "contribute",
    "translation",
  ];

  const hasOutOfScopeKeyword = outOfScopeKeywords.some((keyword) =>
    lowerQuestion.includes(keyword)
  );

  const hasInScopeKeyword = inScopeKeywords.some((keyword) =>
    lowerQuestion.includes(keyword)
  );

  // If has out-of-scope keywords and no in-scope keywords, likely out of scope
  if (hasOutOfScopeKeyword && !hasInScopeKeyword) {
    return false;
  }

  return true;
}
