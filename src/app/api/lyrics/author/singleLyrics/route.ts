import { NextRequest, NextResponse } from "next/server";
import { Lyrics } from "@/models/model";
import mongoose from "mongoose";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const ID = url.searchParams.get("id");

    if (!ID || !mongoose.Types.ObjectId.isValid(ID)) {
      return NextResponse.json(
        { error: "Invalid or missing lyrics ID" },
        { status: 400 }
      );
    }

    await connectMongoDB();
    const lyrics = await Lyrics.findOne({ _id: ID }).populate(
      "artistId",
      "name image"
    );

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
