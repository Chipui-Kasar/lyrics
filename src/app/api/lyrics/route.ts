import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Artist, Lyrics } from "@/models/model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
        { status: 400 }
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
          { status: 400 }
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
        { status: 400 }
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

    return NextResponse.json(newLyric, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const limitParam = url.searchParams.get("limit");
    const sortParam = url.searchParams.get("sort");

    const limit = limitParam ? Number(limitParam) : undefined;
    const sort = sortParam ? sortParam : undefined;
    await connectMongoDB(false); // Explicitly use user connection for read operations

    // Build query - fetch published lyrics and legacy lyrics without status field, exclude drafts
    const query = Lyrics.find({
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
    }).populate("artistId", "name image");

    if (sort) {
      query.sort({ [sort]: -1 }); // sort descending
    }

    if (limit) {
      query.limit(limit);
    }
    if (url.searchParams.get("featured")) {
      query.where({ featured: true });
    }

    const lyrics = await query.exec();
    return NextResponse.json(lyrics);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch lyrics", details: (error as Error).message },
      { status: 500 }
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
    await Lyrics.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Lyrics deleted successfully" },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting lyrics:", error);
    return NextResponse.json(
      { error: "Failed to delete lyrics", details: (error as Error).message },
      { status: 500 }
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
    await Lyrics.findByIdAndUpdate(_id, rest);
    return NextResponse.json({ message: "Lyrics updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update lyrics" },
      { status: 500 }
    );
  }
}
