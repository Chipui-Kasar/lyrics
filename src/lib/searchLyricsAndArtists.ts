import { Artist, Lyrics } from "@/models/model";
import { calculateLevenshteinDistance } from "@/lib/utils";

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
  maxDistance: number = 2
): boolean {
  const distance = calculateLevenshteinDistance(
    searchWord.toLowerCase(),
    targetWord.toLowerCase()
  );

  const threshold = Math.max(maxDistance, Math.floor(searchWord.length * 0.25));
  return distance <= threshold;
}

export interface SearchOptions {
  lyricsLimit?: number;
  artistsLimit?: number;
  publishedOnly?: boolean;
}

// Searches both the Lyrics and Artist collections for a free-text query: MongoDB
// $text search first, falling back to scored fuzzy regex when text search misses.
export async function searchLyricsAndArtists(
  query: string,
  options: SearchOptions = {}
) {
  const { lyricsLimit = 20, artistsLimit = 20, publishedOnly = true } = options;

  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter((word) => word.length > 0);

  let lyrics: any[] = [];
  let artists: any[] = [];

  const statusFilter = publishedOnly
    ? [
        { status: { $ne: "draft" } },
        {
          $or: [
            { status: "published" },
            { status: { $exists: false } },
            { status: null },
            { status: "" },
          ],
        },
      ]
    : [];

  try {
    const textSearchLyrics = await Lyrics.find({
      $and: [{ $text: { $search: query } }, ...statusFilter],
    })
      .select({ score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .populate("artistId", "name village")
      .limit(lyricsLimit)
      .lean();

    if (textSearchLyrics.length > 0) {
      lyrics = textSearchLyrics;
    }
  } catch (textError) {
    console.log("Text search not available, using fuzzy regex");
  }

  try {
    const textSearchArtists = await Artist.find({
      $text: { $search: query },
    })
      .select({ score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .limit(artistsLimit)
      .lean();

    if (textSearchArtists.length > 0) {
      artists = textSearchArtists;
    }
  } catch (textError) {
    console.log("Artist text search not available, using fuzzy regex");
  }

  if (lyrics.length === 0) {
    const fuzzyPatterns = queryWords.map((word) => createFuzzyPattern(word));
    const exactRegex = new RegExp(
      query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );

    const fuzzySearchConditions: any[] = [
      { title: { $regex: exactRegex } },
      { lyrics: { $regex: exactRegex } },
      { album: { $regex: exactRegex } },
    ];

    fuzzyPatterns.forEach((pattern) => {
      fuzzySearchConditions.push(
        { title: { $regex: pattern } },
        { lyrics: { $regex: pattern } },
        { album: { $regex: pattern } }
      );
    });

    const candidates = await Lyrics.find({
      $and: [...statusFilter, { $or: fuzzySearchConditions }],
    })
      .populate("artistId", "name village")
      .limit(50)
      .lean();

    const scoredLyrics = candidates.map((lyric: any) => {
      let score = 0;
      const titleLower = (lyric.title || "").toLowerCase();
      const albumLower = (lyric.album || "").toLowerCase();
      const lyricsLower = (lyric.lyrics || "").toLowerCase();

      if (titleLower.includes(queryLower)) score += 100;
      if (albumLower.includes(queryLower)) score += 50;
      if (lyricsLower.includes(queryLower)) score += 10;

      queryWords.forEach((word) => {
        if (titleLower.includes(word)) score += 20;
        if (albumLower.includes(word)) score += 10;
        if (lyricsLower.includes(word)) score += 5;

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

    lyrics = scoredLyrics
      .sort((a, b) => b.fuzzyScore - a.fuzzyScore)
      .slice(0, lyricsLimit)
      .map(({ fuzzyScore, ...lyric }) => lyric);
  }

  if (artists.length === 0) {
    const fuzzyPatterns = queryWords.map((word) => createFuzzyPattern(word));
    const exactRegex = new RegExp(
      query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );

    const artistFuzzyConditions: any[] = [
      { name: { $regex: exactRegex } },
      { village: { $regex: exactRegex } },
      { genre: { $regex: exactRegex } },
    ];

    fuzzyPatterns.forEach((pattern) => {
      artistFuzzyConditions.push(
        { name: { $regex: pattern } },
        { village: { $regex: pattern } },
        { genre: { $regex: pattern } }
      );
    });

    const candidates = await Artist.find({ $or: artistFuzzyConditions })
      .limit(50)
      .lean();

    const scoredArtists = candidates.map((artist: any) => {
      let score = 0;
      const nameLower = (artist.name || "").toLowerCase();
      const villageLower = (artist.village || "").toLowerCase();
      const genreLower = (artist.genre || []).join(" ").toLowerCase();

      if (nameLower.includes(queryLower)) score += 100;
      if (villageLower.includes(queryLower)) score += 50;
      if (genreLower.includes(queryLower)) score += 30;

      queryWords.forEach((word) => {
        if (nameLower.includes(word)) score += 30;
        if (villageLower.includes(word)) score += 15;
        if (genreLower.includes(word)) score += 10;

        const nameWords = nameLower.split(/\s+/);
        nameWords.forEach((nameWord: string) => {
          if (isFuzzyMatch(word, nameWord, 3)) {
            const distance = calculateLevenshteinDistance(word, nameWord);
            score += Math.max(40 - distance * 8, 5);
          }
        });

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

    artists = scoredArtists
      .sort((a, b) => b.fuzzyScore - a.fuzzyScore)
      .slice(0, artistsLimit)
      .map(({ fuzzyScore, ...artist }) => artist);
  }

  return { lyrics, artists };
}
