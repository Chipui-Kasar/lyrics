import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Artist, Lyrics } from "@/models/model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidateTag } from "next/cache";

// Helper function to revalidate artist cache
function revalidateArtistCache(artistName?: string) {
  // Revalidate specific artist
  if (artistName) {
    const artistSlug = artistName.toLowerCase().replace(/\s+/g, "-");
    revalidateTag(`artist-${artistSlug}`);
  }

  // Revalidate collection caches
  revalidateTag("artists-all");
  revalidateTag("search");
}

export async function POST(req: Request) {
  const { name, genre, socialLinks, village, image } = await req.json();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectMongoDB(true);
  const newArtist = await Artist.create({
    name,
    genre,
    socialLinks,
    village,
    image,
  });

  // Revalidate cache
  revalidateArtistCache(name);

  return NextResponse.json(
    { message: "Artist created successfully" },
    { status: 201 },
  );
}

//get all artists, with each artist's published song count folded in
// (avoids a second round trip with every artist ID crammed into a query string)
export async function GET() {
  await connectMongoDB();
  const artists = await Artist.find().sort({ name: "asc" }).lean();

  const lyricsCounts = await Lyrics.aggregate([
    {
      $match: {
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
      },
    },
    { $group: { _id: "$artistId", count: { $sum: 1 } } },
  ]);
  const countsByArtistId = Object.fromEntries(
    lyricsCounts.map(({ _id, count }) => [_id.toString(), count])
  );

  const artistsWithSongCount = artists.map((artist) => ({
    ...artist,
    songCount: countsByArtistId[String(artist._id)] ?? 0,
  }));

  return NextResponse.json(artistsWithSongCount, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
// Delete Artist by Query Param
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await connectMongoDB(true);
    const deletedArtist = await Artist.findByIdAndDelete(id);

    // Revalidate cache
    if (deletedArtist) {
      revalidateArtistCache(deletedArtist.name);
    }

    return NextResponse.json(
      { message: "Artist deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete artist" },
      { status: 500 },
    );
  }
}

// Update Artist
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { _id, name, genre, socialLinks, village, image } = await req.json();

    if (!_id) {
      return NextResponse.json(
        { error: "Artist ID is required" },
        { status: 400 },
      );
    }

    await connectMongoDB(true);

    const oldArtist = await Artist.findById(_id);
    const updatedArtist = await Artist.findByIdAndUpdate(
      _id,
      { name, genre, socialLinks, village, image },
      { new: true },
    );

    // Revalidate cache for both old and new names (in case name changed)
    if (oldArtist && oldArtist.name !== name) {
      revalidateArtistCache(oldArtist.name);
    }
    revalidateArtistCache(name);

    return NextResponse.json(updatedArtist, { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update artist" },
      { status: 500 },
    );
  }
}
