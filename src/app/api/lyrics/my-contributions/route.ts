import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { ContributedLyrics } from "@/models/ContributedLyrics";
import { Lyrics } from "@/models/model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectMongoDB();
    // @ts-ignore
    const userId = session.user.id;

    const contributions = await ContributedLyrics.find({ submittedBy: userId })
      .populate("artistId", "name")
      .lean();

    const linkedLyricsIds = contributions
      .map((c) => c.publishedLyricsId)
      .filter(Boolean)
      .map((id) => id!.toString());

    // Lyrics published before the contributed_lyrics table existed have no
    // ContributedLyrics record at all - surface them directly so historical
    // contributions don't disappear from this list.
    const legacyPublished = await Lyrics.find({
      submittedBy: userId,
      status: "published",
      _id: { $nin: linkedLyricsIds },
    })
      .populate("artistId", "name")
      .lean();

    const merged = [
      ...contributions.map((c: any) => ({
        _id: c._id,
        title: c.title,
        artistId: c.artistId,
        status: c.status,
        rejectionReason: c.rejectionReason,
        publishedLyricsId: c.publishedLyricsId,
        createdAt: c.createdAt,
      })),
      ...legacyPublished.map((lyric: any) => ({
        _id: lyric._id,
        title: lyric.title,
        artistId: lyric.artistId,
        status: "published",
        publishedLyricsId: lyric._id,
        createdAt: lyric.createdAt,
      })),
    ].sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
    );

    return NextResponse.json(merged);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
