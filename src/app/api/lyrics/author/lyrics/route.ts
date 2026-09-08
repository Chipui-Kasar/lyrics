import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Artist, Lyrics } from "@/models/model"; // Ensure Artists model is imported
import { slugMaker } from "@/lib/utils";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const artistName = url.searchParams.get("artistName");

    if (!artistName) {
      return NextResponse.json(
        { error: "artistName is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const requestedName = artistName.replace(/-/g, " ");
    const requestedSlug = slugMaker(artistName);

    // Find artist by name first. Some existing artist names contain invisible
    // Unicode characters, so fall back to comparing sanitized slugs.
    let artist = (await Artist.findOne({
      name: { $regex: new RegExp(`^${escapeRegExp(requestedName)}$`, "i") },
    }).lean()) as { _id: unknown; name?: string } | null;

    if (!artist) {
      const artists = (await Artist.find()
        .select({ _id: 1, name: 1 })
        .lean()) as { _id: unknown; name?: string }[];

      artist =
        artists.find((item) => slugMaker(item.name || "") === requestedSlug) ||
        null;
    }

    if (!artist) {
      return NextResponse.json({ error: "Artist not found" }, { status: 404 });
    }

    // Find lyrics using artist's _id - published and legacy lyrics, exclude drafts
    const lyrics = await Lyrics.find({
      artistId: artist._id,
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
      .populate("artistId", "name")
      .sort({ title: 1 })
      .lean();

    const latestUpdated = lyrics
      .map((lyric) => lyric.updatedAt?.toISOString?.())
      .filter(Boolean)
      .sort()
      .at(-1);
    const etag = `"${artist._id}:${lyrics.length}:${latestUpdated || ""}"`;

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
