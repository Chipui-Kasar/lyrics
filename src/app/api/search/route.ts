import { connectMongoDB } from "@/lib/mongodb";
import { Artist, Lyrics } from "@/models/model";
import { NextResponse } from "next/server";
import { calculateLevenshteinDistance } from "@/lib/utils";

// Add cache headers for better performance
const getCacheHeaders = (maxAge: number = 300) => ({
  "Cache-Control": `public, max-age=${maxAge}, s-maxage=${maxAge * 2}`,
  Vary: "Accept-Encoding",
});

// Create fuzzy regex pattern that allows for typos
function createFuzzyPattern(word: string): RegExp {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  if (word.length < 3) {
    return new RegExp(`\\b${escaped}`, "i");
  }

  const chars = escaped.split("");
  let pattern = chars.slice(0, Math.min(2, chars.length)).join("");

  for (let i = Math.min(2, chars.length); i < chars.length; i++) {
    pattern += `.?`;
  }

  pattern += `.{0,2}`;
  return new RegExp(pattern, "i");
}

// Check if two words match with fuzzy tolerance
function isFuzzyMatch(
  searchWord: string,
  targetWord: string,
  maxDistance: number = 2,
): boolean {
  const distance = calculateLevenshteinDistance(
    searchWord.toLowerCase(),
    targetWord.toLowerCase(),
  );

  const threshold = Math.max(maxDistance, Math.floor(searchWord.length * 0.25));
  return distance <= threshold;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json(
      { message: "Query parameter must be at least 2 characters" },
      {
        status: 400,
        headers: getCacheHeaders(60),
      },
    );
  }

  try {
    await connectMongoDB();

    const queryLower = query.toLowerCase();
    const queryWords = queryLower
      .split(/\s+/)
      .filter((word) => word.length > 0);

    // Step 1: Try MongoDB $text search first (best for full-text search)
    let lyrics: any[] = [];
    let artists: any[] = [];

    try {
      // MongoDB text search with fuzzy matching
      const textSearchLyrics = await Lyrics.find({
        $and: [
          { $text: { $search: query } },
          { status: { $ne: "draft" } },
          {
            $or: [
              { status: "published" },
              { status: { $exists: false } },
              { status: null },
              { status: "" },
            ],
          },
        ],
      })
        .select({ score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .populate("artistId", "name village")
        .limit(20)
        .lean();

      if (textSearchLyrics.length > 0) {
        lyrics = textSearchLyrics;
      }
    } catch (textError) {
      // Text search might fail if indexes aren't set up
      console.log("Text search not available, using fuzzy regex");
    }

    try {
      const textSearchArtists = await Artist.find({
        $text: { $search: query },
      })
        .select({ score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .limit(20)
        .lean();

      if (textSearchArtists.length > 0) {
        artists = textSearchArtists;
      }
    } catch (textError) {
      console.log("Artist text search not available, using fuzzy regex");
    }

    // Step 2: If text search didn't return results, use advanced fuzzy regex
    if (lyrics.length === 0) {
      // Create regex patterns for each word
      const fuzzyPatterns = queryWords.map((word) => createFuzzyPattern(word));
      const exactRegex = new RegExp(query, "i");

      // Build comprehensive search query
      const fuzzySearchConditions = [
        // Exact match (highest priority)
        { title: { $regex: exactRegex } },
        { lyrics: { $regex: exactRegex } },
        { album: { $regex: exactRegex } },
      ];

      // Add fuzzy patterns for each word
      fuzzyPatterns.forEach((pattern) => {
        fuzzySearchConditions.push(
          { title: { $regex: pattern } },
          { lyrics: { $regex: pattern } },
          { album: { $regex: pattern } },
        );
      });

      lyrics = await Lyrics.find({
        $and: [
          { status: { $ne: "draft" } },
          {
            $or: [
              { status: "published" },
              { status: { $exists: false } },
              { status: null },
              { status: "" },
            ],
          },
          {
            $or: fuzzySearchConditions,
          },
        ],
      })
        .populate("artistId", "name village")
        .limit(50) // Get more for fuzzy scoring
        .lean();

      // Post-process: Score results by relevance
      const scoredLyrics = lyrics.map((lyric: any) => {
        let score = 0;
        const titleLower = (lyric.title || "").toLowerCase();
        const albumLower = (lyric.album || "").toLowerCase();
        const lyricsLower = (lyric.lyrics || "").toLowerCase();

        // Exact match gets highest score
        if (titleLower.includes(queryLower)) score += 100;
        if (albumLower.includes(queryLower)) score += 50;
        if (lyricsLower.includes(queryLower)) score += 10;

        // Word matches
        queryWords.forEach((word) => {
          if (titleLower.includes(word)) score += 20;
          if (albumLower.includes(word)) score += 10;
          if (lyricsLower.includes(word)) score += 5;

          // Fuzzy match using Levenshtein distance
          const titleWords = titleLower.split(/\s+/);
          const albumWords = albumLower.split(/\s+/);

          titleWords.forEach((titleWord: string) => {
            if (isFuzzyMatch(word, titleWord, 3)) {
              const distance = calculateLevenshteinDistance(word, titleWord);
              score += Math.max(30 - distance * 5, 5);
            }
          });

          albumWords.forEach((albumWord: string) => {
            if (isFuzzyMatch(word, albumWord, 3)) {
              const distance = calculateLevenshteinDistance(word, albumWord);
              score += Math.max(20 - distance * 3, 3);
            }
          });
        });

        return { ...lyric, fuzzyScore: score };
      });

      // Sort by score and take top 20
      lyrics = scoredLyrics
        .sort((a, b) => b.fuzzyScore - a.fuzzyScore)
        .slice(0, 20)
        .map(({ fuzzyScore, ...lyric }) => lyric);
    }

    // Step 3: Fuzzy search for artists
    if (artists.length === 0) {
      const fuzzyPatterns = queryWords.map((word) => createFuzzyPattern(word));
      const exactRegex = new RegExp(query, "i");

      const artistFuzzyConditions = [
        { name: { $regex: exactRegex } },
        { village: { $regex: exactRegex } },
        { genre: { $regex: exactRegex } },
      ];

      fuzzyPatterns.forEach((pattern) => {
        artistFuzzyConditions.push(
          { name: { $regex: pattern } },
          { village: { $regex: pattern } },
          { genre: { $regex: pattern } },
        );
      });

      artists = await Artist.find({
        $or: artistFuzzyConditions,
      })
        .limit(50)
        .lean();

      // Score artists by relevance
      const scoredArtists = artists.map((artist: any) => {
        let score = 0;
        const nameLower = (artist.name || "").toLowerCase();
        const villageLower = (artist.village || "").toLowerCase();
        const genreLower = (artist.genre || []).join(" ").toLowerCase();

        // Exact match
        if (nameLower.includes(queryLower)) score += 100;
        if (villageLower.includes(queryLower)) score += 50;
        if (genreLower.includes(queryLower)) score += 30;

        // Word matches
        queryWords.forEach((word) => {
          if (nameLower.includes(word)) score += 30;
          if (villageLower.includes(word)) score += 15;
          if (genreLower.includes(word)) score += 10;

          // Fuzzy match for name
          const nameWords = nameLower.split(/\s+/);
          nameWords.forEach((nameWord: string) => {
            if (isFuzzyMatch(word, nameWord, 3)) {
              const distance = calculateLevenshteinDistance(word, nameWord);
              score += Math.max(40 - distance * 8, 5);
            }
          });

          // Fuzzy match for village
          const villageWords = villageLower.split(/\s+/);
          villageWords.forEach((villageWord: string) => {
            if (isFuzzyMatch(word, villageWord, 3)) {
              const distance = calculateLevenshteinDistance(word, villageWord);
              score += Math.max(25 - distance * 5, 3);
            }
          });
        });

        return { ...artist, fuzzyScore: score };
      });

      // Sort and take top 20
      artists = scoredArtists
        .sort((a, b) => b.fuzzyScore - a.fuzzyScore)
        .slice(0, 20)
        .map(({ fuzzyScore, ...artist }) => artist);
    }

    return NextResponse.json(
      { lyrics, artists },
      {
        status: 200,
        headers: getCacheHeaders(300), // Cache for 5 minutes
      },
    );
  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json(
      { error: "Failed to search" },
      {
        status: 500,
        headers: getCacheHeaders(60), // Cache errors for 1 minute
      },
    );
  }
}
