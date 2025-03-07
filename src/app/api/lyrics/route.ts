import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Artist, Lyrics } from "@/models/model";

export async function POST(req: Request) {
  const { title, artistId, album, releaseYear, lyrics, streamingLinks } =
    await req.json();
  await connectMongoDB();
  await Lyrics.create({
    title,
    artistId,
    album,
    releaseYear,
    lyrics,
    streamingLinks,
  });
  return NextResponse.json(
    { message: "Lyrics created successfully" },
    { status: 201 }
  );
}
export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    // Extract 'limit' from query params and convert it to a number (default to 10)
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit")) || 10;

    // Fetch lyrics with a limit
    const lyrics = await Lyrics.find()
      .populate("artistId", "name image")
      .limit(limit);

    return NextResponse.json(lyrics);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch lyrics" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await connectMongoDB();
    await Lyrics.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Lyrics deleted successfully" },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete lyrics" },
      { status: 500 }
    );
  }
}
