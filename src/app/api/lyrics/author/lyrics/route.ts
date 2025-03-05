//get all lyrics by authorID
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Lyrics } from "@/models/model";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    //url: localhost:3000/artists/Pamching?artistId=67c31eedb97e124c453ac16e
    const artistId = url.searchParams.get("artistId");
    if (!artistId) {
      return NextResponse.json(
        { error: "artistId is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();
    const lyrics = await Lyrics.find({ artistId });
    return NextResponse.json(lyrics);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch lyrics" },
      { status: 500 }
    );
  }
}
