import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Lyrics } from "@/models/model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const { title, artistId, album, releaseYear, lyrics, streamingLinks } =
    await req.json();
  await connectMongoDB(true); // Use admin access
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    const limit = Number(url.searchParams.get("limit"));

    // Fetch lyrics with a limit
    const query = Lyrics.find().populate("artistId", "name image");
    if (limit) {
      query.limit(limit);
    }
    const lyrics = await query.exec();

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
