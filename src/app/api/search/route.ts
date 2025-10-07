import { connectMongoDB } from "@/lib/mongodb";
import { Artist, Lyrics } from "@/models/model";
import { NextResponse } from "next/server";

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
      }
    );
  }

  try {
    await connectMongoDB();

    // Create case-insensitive regex for search
    const searchRegex = new RegExp(query, "i");

    // Search lyrics with populated artist data - published and legacy lyrics, exclude drafts
    const lyrics = await Lyrics.find({
      $and: [
        { status: { $ne: "draft" } }, // Explicitly exclude drafts
        {
          $or: [
            { status: "published" },
            { status: { $exists: false } }, // Legacy lyrics without status
            { status: null },
            { status: "" },
          ],
        },
        {
          $or: [
            { title: { $regex: searchRegex } },
            { lyrics: { $regex: searchRegex } },
            { album: { $regex: searchRegex } },
          ],
        },
      ],
    })
      .populate("artistId", "name village")
      .limit(20)
      .lean();

    // Search artists
    const artists = await Artist.find({
      $or: [
        { name: { $regex: searchRegex } },
        { village: { $regex: searchRegex } },
        { genre: { $regex: searchRegex } },
      ],
    })
      .limit(20)
      .lean();

    return NextResponse.json(
      { lyrics, artists },
      {
        status: 200,
        headers: getCacheHeaders(300), // Cache for 5 minutes
      }
    );
  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json(
      { error: "Failed to search" },
      {
        status: 500,
        headers: getCacheHeaders(60), // Cache errors for 1 minute
      }
    );
  }
}
