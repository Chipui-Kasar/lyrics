import { Lyrics } from "@/models/model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const artistIds = url.searchParams.get("artistIds")?.split(",") || [];

    if (artistIds.length === 0) {
      return NextResponse.json(
        { error: "No artist IDs provided" },
        { status: 400 }
      );
    }

    // Convert string IDs to ObjectIds
    const artistObjectIds = artistIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    await connectMongoDB();
    const lyricsCounts = await Lyrics.aggregate([
      { $match: { artistId: { $in: artistObjectIds } } },
      { $group: { _id: "$artistId", count: { $sum: 1 } } },
    ]);

    // Convert ObjectId _id to strings for the response
    const result = Object.fromEntries(
      lyricsCounts.map(({ _id, count }) => [_id.toString(), count])
    );

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch song counts" },
      { status: 500 }
    );
  }
}
