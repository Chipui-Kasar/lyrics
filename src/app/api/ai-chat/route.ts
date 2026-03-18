import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Artist, Lyrics } from "@/models/model";
import { slugMaker } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // Connect to MongoDB and fetch real data
    await connectMongoDB();

    // Fetch relevant data based on the user's question
    const lowerMessage = message.toLowerCase();
    let databaseContext = "";

    // If user is asking about lyrics, artists, or searching
    if (
      lowerMessage.includes("lyric") ||
      lowerMessage.includes("song") ||
      lowerMessage.includes("artist") ||
      lowerMessage.includes("search") ||
      lowerMessage.includes("find")
    ) {
      // Fetch recent/featured lyrics
      const recentLyrics = await Lyrics.find()
        .populate("artistId", "name village genre")
        .sort({ createdAt: -1 })
        .limit(10)
        .select("_id title artistId album releaseYear")
        .lean();

      // Fetch all artists
      const artists = await Artist.find()
        .sort({ name: 1 })
        .limit(20)
        .select("_id name village genre")
        .lean();

      // If user mentions specific artist or song, search for it
      const searchKeywords = message.match(
        /["']([^"']+)["']|(\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b)/g
      );
      let specificResults = null;

      if (searchKeywords && searchKeywords.length > 0) {
        const searchQuery = searchKeywords.join(" ").replace(/["']/g, "");

        specificResults = await Lyrics.aggregate([
          {
            $search: {
              index: "default",
              text: {
                query: searchQuery,
                path: ["lyrics", "title", "album"],
                fuzzy: { maxEdits: 2, prefixLength: 2 },
              },
            },
          },
          { $limit: 5 },
          {
            $lookup: {
              from: "artists",
              localField: "artistId",
              foreignField: "_id",
              as: "artist",
            },
          },
          { $unwind: "$artist" },
          {
            $project: {
              title: 1,
              album: 1,
              artistId: "$artist._id",
              artistName: "$artist.name",
              lyrics: { $substr: ["$lyrics", 0, 200] },
            },
          },
        ]);
      }

      // Build database context with IDs for link generation
      databaseContext = `\n\nACTUAL WEBSITE DATA:

AVAILABLE ARTISTS (${artists.length} total):
${artists
  .map(
    (a: any) =>
      `- ${a.name}${a.village ? ` from ${a.village}` : ""}${
        a.genre?.length ? ` (${a.genre.join(", ")})` : ""
      } [LINK: /artists/${slugMaker(a.name)}]`
  )
  .join("\n")}

RECENT/FEATURED SONGS (Latest ${recentLyrics.length}):
${recentLyrics
  .map(
    (l: any) =>
      `- "${l.title}" by ${l.artistId?.name || "Unknown"}${
        l.album ? ` (Album: ${l.album})` : ""
      }${l.releaseYear ? ` [${l.releaseYear}]` : ""} [ID: ${
        l._id
      }, LINK: /lyrics/${l._id}/${slugMaker(l.title)}_${slugMaker(
        l.artistId?.name || "Unknown"
      )}]`
  )
  .join("\n")}`;

      if (specificResults && specificResults.length > 0) {
        databaseContext += `\n\nSEARCH RESULTS FOR YOUR QUERY:
${specificResults
  .map(
    (r: any) =>
      `- "${r.title}" by ${r.artistName}${
        r.album ? ` (${r.album})` : ""
      } [LINK: /lyrics/${r._id}/${slugMaker(r.title)}_${slugMaker(
        r.artistName
      )}]\n  Preview: ${r.lyrics.substring(0, 150)}...`
  )
  .join("\n\n")}`;
      }
    }

    // Build system prompt with website context
    const systemPrompt = `You are an AI assistant embedded in a Tangkhul lyrics website. Your purpose is to help users understand and search content ONLY within this website.

WEBSITE CONTEXT:
- Website Name: Tangkhul Lyrics
- Purpose: A platform for Tangkhul songs, lyrics, artists, and cultural content
- Available Pages: Home, Artists, Lyrics, About, Contact, Contribute, Feed, Search

CURRENT PAGE CONTEXT:
${
  context
    ? `
- URL: ${context.url || "Unknown"}
- Page Title: ${context.title || "Unknown"}
- Page Type: ${context.pageType || "Unknown"}
- Content Summary: ${context.contentSummary || "No specific content"}
`
    : "No page context available"
}

RULES:
1. Answer using REAL DATA from the "ACTUAL WEBSITE DATA" section above
2. When users ask about songs or artists, reference the ACTUAL artists and songs listed
3. Provide specific song titles, artist names, and details from the database
4. If a user asks about a specific song/artist, check if it exists in the data provided
5. If something is not in the database, say "I couldn't find that in our current collection"
6. Do NOT answer questions unrelated to this lyrics website
7. If a question is outside scope, respond: "I can help only with information available on this website about Tangkhul lyrics, artists, and songs."
8. Be clear, concise, and helpful
9. Use bullet points for lists
10. Reference specific pages when relevant
11. When mentioning a song, format it as: "Song Title" by Artist Name

URL FORMATS (IMPORTANT - USE THESE EXACT PATTERNS):
- Artist page: /artists/{artist-name-slug}
- All artists page: /allartists
- Lyrics page: /lyrics/{id}/{song-title-slug}_{artist-name-slug}
- All lyrics page: /lyrics
- Search page: /search?query={keyword}

RESPONSE GUIDELINES:
- Always cite actual data when available
- ALWAYS include clickable links using the LINK paths provided in the data
- Format links as: [Song Title](/lyrics/[id]/[slug-title]_[slug-artist]) or [Artist Name](/artists/[artist-slug])
- Use the exact LINK path provided in the database context
- Example: "Check out [Hallelujah](/lyrics/12345abc/hallelujah_john-doe) by [John Doe](/artists/john-doe)"
- For all artists: [View all artists](/allartists)
- For all lyrics: [Browse all lyrics](/lyrics)
- For search page: [Search for more songs](/search?query=keyword)
- If user searches for something specific, use the SEARCH RESULTS section
- Mention album names and release years when available
- Group information logically (by artist, by genre, by village, etc.)
- Make every song title and artist name a clickable link${databaseContext}`;

    // Combine system prompt with user message
    const fullPrompt = `${systemPrompt}

USER QUESTION: ${message}

Provide a helpful response based on the website context above.`;

    // Use REST API directly with gemini-2.0-flash-exp
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Gemini API Error:", errorData);
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No response text from API");
    }

    return NextResponse.json({
      message: text,
      success: true,
    });
  } catch (error: unknown) {
    console.error("AI Chat Error:", error);
    return NextResponse.json(
      {
        error: "Failed to process request",
        message: "Sorry, I encountered an error. Please try again.",
      },
      { status: 500 }
    );
  }
}
