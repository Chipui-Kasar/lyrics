import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Artist, Lyrics } from "@/models/model"; // Ensure both models are imported

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const artistName = url.searchParams.get("artistName");
    const songTitle = url.searchParams.get("songTitle");

    if (!artistName || !songTitle) {
      return NextResponse.json(
        { error: "artistName and songTitle are required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Find artist by name to get the artistId
    const artist = await Artist.findOne({ name: artistName });

    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    // Find lyrics using both title and artistId
    const lyrics = await Lyrics.findOne({
      title: songTitle,
      artistId: artist._id, // Use the _id of the artist
    }).populate("artistId", "name image");

    if (!lyrics) {
      return NextResponse.json({ error: "Lyrics not found" }, { status: 404 });
    }

    return NextResponse.json(lyrics);
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch lyrics" },
      { status: 500 }
    );
  }
}
