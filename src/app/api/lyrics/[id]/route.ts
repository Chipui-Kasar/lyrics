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
    await connectMongoDB();
    const { id } = params;
    const { status } = await req.json();

    if (!status || (status !== "published" && status !== "draft")) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    const lyric = await Lyrics.findByIdAndUpdate(id, { status }, { new: true });

    if (!lyric) {
      return NextResponse.json({ message: "Lyric not found" }, { status: 404 });
    }

    return NextResponse.json(lyric);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
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
    await connectMongoDB();
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
