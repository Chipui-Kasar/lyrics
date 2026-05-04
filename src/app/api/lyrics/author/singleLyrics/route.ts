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
    const lyrics = (await Lyrics.findOne({
      _id: ID,
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
    })
      .populate("artistId", "name image")
      .lean()) as { updatedAt?: Date; _id?: unknown } | null;

    if (!lyrics) {
      return NextResponse.json({ error: "Lyrics not found" }, { status: 404 });
    }

    const updatedAt = lyrics.updatedAt?.toISOString?.() || "";
    const etag = updatedAt ? `"${updatedAt}"` : `"${ID}"`;

    if (req.headers.get("if-none-match") === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    }

    return NextResponse.json(lyrics, {
      headers: {
        ETag: etag,
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch lyrics" },
      { status: 500 }
    );
  }
}
