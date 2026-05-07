import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Lyrics } from "@/models/model";
import { headers } from "next/headers";

function publicLyricsFilter() {
  return {
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
  };
}

// Returns minimal metadata for consistency checks
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const includeAll = searchParams.get("includeAll") === "true";
    const filters = includeAll ? {} : publicLyricsFilter();

    await connectMongoDB(false);

    const totalCount = await Lyrics.countDocuments(filters);

    const latest = await Lyrics.find(filters)
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
