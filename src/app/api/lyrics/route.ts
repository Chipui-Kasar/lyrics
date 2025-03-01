import { NextResponse } from "next/server";
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
export async function GET() {
  await connectMongoDB();
  const lyrics = await Lyrics.find();
  return NextResponse.json(lyrics);
}

export async function DELETE(req: {
  nextUrl: { searchParams: { get: (arg0: string) => any } };
}) {
  const id = req.nextUrl.searchParams.get("id");

  await connectMongoDB();
  await Lyrics.findByIdAndDelete(id);
  return NextResponse.json(
    { message: "Lyrics deleted successfully" },
    {
      status: 200,
    }
  );
}
