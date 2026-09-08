import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Artist } from "@/models/model";
import { headers } from "next/headers";

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
    const etag = lastUpdated ? `"${lastUpdated}"` : "";

    const requestHeaders = await headers();
    if (etag && requestHeaders.get("if-none-match") === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          "Cache-Control": "no-cache, must-revalidate",
          ETag: etag,
        },
      });
    }

    return NextResponse.json(
      { totalCount, lastUpdated },
      {
        headers: {
          "Cache-Control": "no-cache, must-revalidate",
          ETag: etag,
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
