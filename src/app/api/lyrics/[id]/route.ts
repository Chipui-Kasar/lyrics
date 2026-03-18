import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Lyrics } from "@/models/model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongoDB(); // Use admin connection for updates
    const { id } = params;
    const body = await req.json();
    const { status } = body;

    if (!status || (status !== "published" && status !== "draft")) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }
    const lyric = await Lyrics.findByIdAndUpdate(id, { status }, { new: true });
    if (!lyric) {
      return NextResponse.json({ message: "Lyric not found" }, { status: 404 });
    }

    return NextResponse.json(lyric);
  } catch (error: any) {
    console.error("Error in PUT:", error.message, error.stack);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongoDB(true); // Use admin connection for deletes
    const { id } = params;
    await Lyrics.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Lyric deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
