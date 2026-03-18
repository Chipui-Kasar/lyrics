import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Artist } from "@/models/model";

// Returns minimal metadata for artists consistency checks (~50 bytes)
// This endpoint is used to check if cache needs updating without downloading full data
export async function GET() {
  try {
    await connectMongoDB(false);

    // Count all artists
    const totalCount = await Artist.countDocuments();

    // Latest updatedAt
    const latest = await Artist.find()
      .sort({ updatedAt: -1 })
      .limit(1)
      .select({ updatedAt: 1 })
      .lean();

    const lastUpdated = latest?.[0]?.updatedAt?.toISOString?.() ?? undefined;

    // Return minimal JSON (~50-100 bytes instead of 500KB+)
    return NextResponse.json(
      { totalCount, lastUpdated },
      {
        headers: {
          "Cache-Control": "no-cache, must-revalidate",
          ETag: lastUpdated ? `"${lastUpdated}"` : "",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch metadata", details: (error as Error).message },
      { status: 500 }
    );
  }
}
