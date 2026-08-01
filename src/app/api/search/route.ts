import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { searchLyricsAndArtists } from "@/lib/searchLyricsAndArtists";

// Add cache headers for better performance
const getCacheHeaders = (maxAge: number = 300) => ({
  "Cache-Control": `public, max-age=${maxAge}, s-maxage=${maxAge * 2}`,
  Vary: "Accept-Encoding",
});

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

    const { lyrics, artists } = await searchLyricsAndArtists(query, {
      lyricsLimit: 20,
      artistsLimit: 20,
    });

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
