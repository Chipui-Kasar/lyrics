import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Artist, Lyrics } from "@/models/model"; // Ensure Artists model is imported

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const artistName = url.searchParams.get("artistName");

    if (!artistName) {
      return NextResponse.json(
        { error: "artistName is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Find artist by name (case-insensitive)
    const artist = await Artist.findOne({
      name: { $regex: new RegExp(`^${artistName.replace(/-/g, " ")}$`, "i") },
    });

    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    // Find lyrics using artist's _id - published and legacy lyrics, exclude drafts
    const lyrics = await Lyrics.find({
      artistId: artist._id,
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
      ],
    }).populate("artistId", "name");

    return NextResponse.json(lyrics);
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch lyrics" },
      { status: 500 }
    );
  }
}
