import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Lyrics } from "@/models/model";

// Returns minimal metadata for consistency checks
export async function GET() {
  try {
    await connectMongoDB(false);

    // Count published (exclude drafts)
    const totalCount = await Lyrics.countDocuments({
      $and: [
        { status: { $ne: "draft" } },
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

    // Latest updatedAt among published
    const latest = await Lyrics.find({
      $and: [
        { status: { $ne: "draft" } },
        {
          $or: [
            { status: "published" },
            { status: { $exists: false } },
            { status: null },
            { status: "" },
          ],
        },
      ],
    })
      .sort({ updatedAt: -1 })
      .limit(1)
      .select({ updatedAt: 1 })
      .lean();

    const lastUpdated = latest?.[0]?.updatedAt?.toISOString?.() ?? undefined;

    return NextResponse.json({ totalCount, lastUpdated });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch metadata", details: (error as Error).message },
      { status: 500 }
    );
  }
}
