import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Artist, Lyrics } from "@/models/model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidateTag } from "next/cache";

// Helper function to revalidate relevant tags
function revalidateLyricsCache(lyricsId?: string, artistName?: string) {
  // Revalidate specific lyrics
  if (lyricsId) {
    revalidateTag(`lyrics-${lyricsId}`);
  }

  // Revalidate artist cache
  if (artistName) {
    const artistSlug = artistName.toLowerCase().replace(/\s+/g, "-");
    revalidateTag(`artist-${artistSlug}`);
  }

  // Revalidate collection caches
  revalidateTag("lyrics-all");
  revalidateTag("lyrics-featured");
  revalidateTag("lyrics-top");
  revalidateTag("search");
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongoDB(true); // Use admin connection for write operations
    const body = await req.json();
    const {
      title,
      artistName,
      artistId,
      album,
      releaseYear,
      lyrics,
      streamingLinks,
      thumbnail,
      featured,
      contributedBy,
    } = body;

    if (!title || !lyrics) {
      return NextResponse.json(
        { message: "Title and lyrics are required" },
        { status: 400 },
      );
    }

    let artist;

    // Handle both admin form (artistId) and contribute form (artistName)
    if (artistId) {
      // Admin form: artistId is provided
      artist = await Artist.findById(artistId);
      if (!artist) {
        return NextResponse.json(
          { message: "Artist not found" },
          { status: 400 },
        );
      }
    } else if (artistName) {
      // Contribute form: artistName is provided
      artist = await Artist.findOne({
        name: { $regex: new RegExp(`^${artistName}$`, "i") },
      });
      if (!artist) {
        artist = new Artist({ name: artistName });
        await artist.save();
      }
    } else {
      return NextResponse.json(
        { message: "Artist name or artist ID is required" },
        { status: 400 },
      );
    }

    // Set status based on user role - admin submissions are published, others are draft
    const status = session.user.role === "admin" ? "published" : "draft";

    const newLyric = new Lyrics({
      title,
      artistId: artist._id,
      album,
      releaseYear,
      lyrics,
      streamingLinks: streamingLinks || {},
      thumbnail: thumbnail || "",
      featured: featured || false,
      contributedBy: contributedBy || "",
      submittedBy: session.user.id,
      status: status,
    });

    await newLyric.save();

    // Revalidate cache
    revalidateLyricsCache(newLyric._id.toString(), artist.name);

    return NextResponse.json(newLyric, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limitParam = url.searchParams.get("limit");
    const pageParam = url.searchParams.get("page");
    const sortParam = url.searchParams.get("sort");
    const orderParam = url.searchParams.get("order");
    const fieldsParam = url.searchParams.get("fields");

    const DEFAULT_LIMIT = 60;
    const MAX_LIMIT = 200;

    const parsedLimit = limitParam ? Number(limitParam) : undefined;
    const limit =
      typeof parsedLimit === "number" && !Number.isNaN(parsedLimit)
        ? Math.min(Math.max(parsedLimit, 1), MAX_LIMIT)
        : undefined;
    const parsedPage = pageParam ? Number(pageParam) : undefined;
    const page =
      typeof parsedPage === "number" && !Number.isNaN(parsedPage)
        ? Math.max(parsedPage, 1)
        : undefined;
    const sort = sortParam ? sortParam : undefined;
    const order = orderParam === "asc" ? 1 : -1;
    await connectMongoDB(false); // Explicitly use user connection for read operations

    // Build query - fetch published lyrics and legacy lyrics without status field, exclude drafts
    const filters: Record<string, unknown> = {
      $and: [
        { status: { $ne: "draft" } }, // Explicitly exclude drafts
        {
          $or: [
            { status: "published" },
            { status: { $exists: false } }, // Legacy lyrics without status field
            { status: null }, // Lyrics with null status
            { status: "" }, // Lyrics with empty status
          ],
        },
      ],
    };

    if (url.searchParams.get("featured")) {
      filters.featured = true;
    }

    const query = Lyrics.find(filters).populate("artistId", "name image");

    if (sort) {
      query.sort({ [sort]: order }); // default desc unless order=asc
    }

    if (fieldsParam === "summary") {
      query.select({
        title: 1,
        artistId: 1,
        createdAt: 1,
        updatedAt: 1,
      });
    }

    if (page) {
      const pageLimit = limit ?? DEFAULT_LIMIT;
      const skip = (page - 1) * pageLimit;
      query.limit(pageLimit).skip(skip);
    } else if (limit) {
      query.limit(limit);
    }

    const lyrics = await query.lean().exec();

    if (page) {
      const pageLimit = limit ?? DEFAULT_LIMIT;
      const totalCount = await Lyrics.countDocuments(filters);
      const totalPages = Math.max(1, Math.ceil(totalCount / pageLimit));

      return NextResponse.json({
        items: lyrics,
        pagination: {
          page,
          limit: pageLimit,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      });
    }

    return NextResponse.json(lyrics);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch lyrics", details: (error as Error).message },
      { status: 500 },
    );
  }
}

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

    await connectMongoDB();
    const deletedLyric = await Lyrics.findByIdAndDelete(id).populate(
      "artistId",
      "name",
    );

    // Revalidate cache
    if (deletedLyric) {
      revalidateLyricsCache(id, deletedLyric.artistId?.name);
    }

    return NextResponse.json(
      { message: "Lyrics deleted successfully" },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error deleting lyrics:", error);
    return NextResponse.json(
      { error: "Failed to delete lyrics", details: (error as Error).message },
      { status: 500 },
    );
  }
}

//update
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { _id, ...rest } = await req.json();
    await connectMongoDB(true); // Admin access
    const updatedLyric = await Lyrics.findByIdAndUpdate(_id, rest, {
      new: true,
    }).populate("artistId", "name");

    // Revalidate cache
    if (updatedLyric) {
      revalidateLyricsCache(_id, updatedLyric.artistId?.name);
    }

    return NextResponse.json({ message: "Lyrics updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update lyrics" },
      { status: 500 },
    );
  }
}
