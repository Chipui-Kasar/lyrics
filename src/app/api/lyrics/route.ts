import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Lyrics } from "@/models/model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoDB(true); // Admin access

    const { _id, ...rest } = data;
    await Lyrics.create(_id ? { _id, ...rest } : rest);
    return NextResponse.json(
      { message: "Lyrics created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating lyrics:", error);
    return NextResponse.json(
      {
        error: "Error creating lyrics",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectMongoDB();

    const url = new URL(req.url);
    const limitParam = url.searchParams.get("limit");
    const sortParam = url.searchParams.get("sort");

    const limit = limitParam ? Number(limitParam) : undefined;
    const sort =
      sortParam === "view" || sortParam === "releaseYear"
        ? sortParam
        : undefined;

    // Build query
    const query = Lyrics.find().populate("artistId", "name image");

    if (sort) {
      query.sort({ [sort]: -1 }); // sort descending
    }

    if (limit) {
      query.limit(limit);
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
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

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
    return NextResponse.json(
      { error: "Failed to delete lyrics" },
      { status: 500 }
    );
  }
}
