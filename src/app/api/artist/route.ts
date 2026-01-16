import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Artist } from "@/models/model";
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

//get all artists
export async function GET() {
  await connectMongoDB();
  const artists = await Artist.find().sort({ name: "asc" });
  return NextResponse.json(artists);
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
