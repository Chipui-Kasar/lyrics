import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { getArtistModel, getLyricsModel } from "@/models/model";
import { slugMaker } from "@/lib/utils";
import { chatCompletion } from "@/lib/aiClient";
import { searchLyricsAndArtists } from "@/lib/searchLyricsAndArtists";

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    if (!process.env.OPENROUTER_API_KEY && !process.env.GROQ_API_KEY) {
      throw new Error(
        "Neither OPENROUTER_API_KEY nor GROQ_API_KEY is configured",
      );
    }

    // Connect to MongoDB and fetch real data
    const conn = await connectMongoDB();
    const Artist = getArtistModel(conn);
    const Lyrics = getLyricsModel(conn);

    // Fetch recent/featured lyrics for general "what's on this site" context
    const recentLyrics = await Lyrics.find()
      .populate("artistId", "name village genre")
      .sort({ createdAt: -1 })
      .limit(10)
      .select("_id title artistId album releaseYear")
      .lean();

    // Fetch all artists (site only has a small catalog, so listing all is cheap
    // and avoids hiding artists past an arbitrary alphabetical cutoff)
    const artists = await Artist.find()
      .sort({ name: 1 })
      .select("_id name village genre")
      .lean();

    // Search both artists and lyrics for whatever the user actually asked about
    const { lyrics: matchedLyrics, artists: matchedArtists } =
      await searchLyricsAndArtists(
        message,
        { Artist, Lyrics },
        {
          lyricsLimit: 5,
          artistsLimit: 5,
        },
      );

    // Build database context with IDs for link generation
    let databaseContext = `\n\nACTUAL WEBSITE DATA:

AVAILABLE ARTISTS (${artists.length} total):
${artists
  .map(
    (a: any) =>
      `- ${a.name}${a.village ? ` from ${a.village}` : ""}${
        a.genre?.length ? ` (${a.genre.join(", ")})` : ""
      } [LINK: /artists/${slugMaker(a.name)}]`,
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
        l.artistId?.name || "Unknown",
      )}]`,
  )
  .join("\n")}`;

    if (matchedArtists.length > 0) {
      databaseContext += `\n\nARTISTS MATCHING YOUR QUERY:
${matchedArtists
  .map(
    (a: any) =>
      `- ${a.name}${a.village ? ` from ${a.village}` : ""}${
        a.genre?.length ? ` (${a.genre.join(", ")})` : ""
      } [LINK: /artists/${slugMaker(a.name)}]`,
  )
  .join("\n")}`;
    }

    if (matchedLyrics.length > 0) {
      databaseContext += `\n\nSONGS MATCHING YOUR QUERY:
${matchedLyrics
  .map(
    (l: any) =>
      `- "${l.title}" by ${l.artistId?.name || "Unknown"}${
        l.album ? ` (${l.album})` : ""
      } [LINK: /lyrics/${l._id}/${slugMaker(l.title)}_${slugMaker(
        l.artistId?.name || "Unknown",
      )}]\n  Preview: ${(l.lyrics || "").substring(0, 150)}...`,
  )
  .join("\n\n")}`;
    }

    // Build system prompt with website context
    const systemPrompt = `You are an AI assistant embedded in a Tangkhul lyrics website. Your purpose is to help users understand and search content ONLY within this website.

WEBSITE CONTEXT:
- Website Name: Tangkhul Lyrics
- Purpose: A platform for Tangkhul songs, lyrics, artists, and cultural content
- Available Pages: Home, Artists, Lyrics, About, Contact, Contribute, Feed, Search

DEVELOPER CONTACT (share this ONLY if the user explicitly asks who built/developed/made this website, or asks for developer/contact info — when you share it, format EVERY item below as a markdown link exactly like the examples, never as a bare URL or email):
- Developer: Chipui Kasar
- Email: [tangkhullaalyrics@gmail.com](mailto:tangkhullaalyrics@gmail.com)
- Instagram: [@chipui_ks](https://instagram.com/chipui_ks)
- LinkedIn: [Chipui Kasar](https://www.linkedin.com/in/chipui-kasar-78058b104/)
- YouTube: [LooksLikeYouTengkuma](https://www.youtube.com/@LooksLikeYouTengkuma)
- Portfolio: [chipuikasar.netlify.app](https://chipuikasar.netlify.app/)
- Other projects: [Ukhrul Rental](https://ukhrulrental.vercel.app/), [Khangkhui Phungdhar](https://khangkhuiphungdhar.vercel.app/), [Tangkhul Dictionary](https://tangkhuldictionary.lovable.app/), [Tengkuma](https://tengkuma.vercel.app/)

If the user specifically and repeatedly asks for a phone/contact number (not just general contact info), share this instead: [Chat on WhatsApp](https://wa.me/918264163783?text=Iwui%20laa%20la%20sang%20ngaiya)

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
12. If the user asks who built/made/developed the website, or asks for developer/contact details, share the "DEVELOPER CONTACT" section above (name, links) — this is the one exception to rule 6
13. If the user explicitly asks for a phone/contact NUMBER again after already being given the contact links (or insists on a number specifically), share the WhatsApp link from the "DEVELOPER CONTACT" section instead of a phone number

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
- If user searches for something specific, use the "ARTISTS MATCHING YOUR QUERY" / "SONGS MATCHING YOUR QUERY" sections
- Mention album names and release years when available
- Group information logically (by artist, by genre, by village, etc.)
- Make every song title and artist name a clickable link${databaseContext}`;

    // Combine system prompt with user message
    const fullPrompt = `${systemPrompt}

USER QUESTION: ${message}

Provide a helpful response based on the website context above.`;

    // Try OpenRouter first, fall back to Groq if it fails
    const text = await chatCompletion({
      messages: [{ role: "user", content: fullPrompt }],
      openRouterModel: "google/gemini-2.5-flash",
      groqModel: "llama-3.3-70b-versatile",
      maxTokens: 2048,
    });

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
      { status: 500 },
    );
  }
}
