import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Artist } from "@/models/model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const { name, genre, socialLinks, village } = await req.json();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectMongoDB(true);
  await Artist.create({ name, genre, socialLinks, village });
  return NextResponse.json(
    { message: "Artist created successfully" },
    { status: 201 }
  );
}

//get all artists
export async function GET() {
  await connectMongoDB();
  const artists = await Artist.find().sort({ name: "asc" });
  return NextResponse.json(artists);
}
export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await connectMongoDB();
    await Artist.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Artist deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete artist" },
      { status: 500 }
    );
  }
}
