import { NextRequest, NextResponse } from "next/server";
import { Lyrics } from "@/models/model";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();
    
    // Get the current filtering logic version
    const query = Lyrics.find({
      $and: [
        { status: { $ne: "draft" } }, // This should be present in the updated version
        {
          $or: [
            { status: "published" },
            { status: { $exists: false } },
            { status: null },
            { status: "" },
          ],
        },
      ],
    });

    const count = await query.countDocuments();
    
    // Also get the count of drafts for comparison
    const draftCount = await Lyrics.countDocuments({ status: "draft" });
    
    // Get a sample of recent lyrics to see their status
    const recentLyrics = await Lyrics.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title status createdAt")
      .lean();

    return NextResponse.json({
      message: "Draft filtering test",
      version: "v2.0-explicit-exclude",
      timestamp: new Date().toISOString(),
      publicLyricsCount: count,
      draftCount: draftCount,
      recentLyrics: recentLyrics,
      filteringLogic: "Using $and with explicit $ne draft exclusion"
    });
  } catch (error) {
    console.error("Test endpoint error:", error);
    return NextResponse.json(
      { error: "Test failed", details: (error as Error).message },
      { status: 500 }
    );
  }
}