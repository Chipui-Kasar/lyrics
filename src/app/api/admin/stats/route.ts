import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongoDB } from "@/lib/mongodb";
import { getArtistModel, getLyricsModel } from "@/models/model";
import { getContributedLyricsModel } from "@/models/ContributedLyrics";
import { getUserModel } from "@/models/User";

export async function GET() {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const conn = await connectMongoDB(true);
    const Artist = getArtistModel(conn);
    const Lyrics = getLyricsModel(conn);
    const ContributedLyrics = getContributedLyricsModel(conn);
    const User = getUserModel(conn);

    const [
      totalLyrics,
      draftLyrics,
      totalArtists,
      totalUsers,
      pendingContributions,
      viewsAgg,
      recentLyrics,
      recentContributions,
    ] = await Promise.all([
      Lyrics.countDocuments({ status: "published" }),
      Lyrics.countDocuments({ status: "draft" }),
      Artist.countDocuments(),
      User.countDocuments(),
      ContributedLyrics.countDocuments({ status: "pending" }),
      Lyrics.aggregate([
        { $group: { _id: null, total: { $sum: "$view" } } },
      ]),
      Lyrics.find({ status: "published" })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("artistId", "name")
        .select({ title: 1, artistId: 1, createdAt: 1 })
        .lean(),
      ContributedLyrics.find({ status: "pending" })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("artistId", "name")
        .select({ title: 1, artistId: 1, contributedBy: 1, createdAt: 1 })
        .lean(),
    ]);

    return NextResponse.json({
      totalLyrics,
      draftLyrics,
      totalArtists,
      totalUsers,
      pendingContributions,
      totalViews: viewsAgg[0]?.total ?? 0,
      recentLyrics,
      recentContributions,
    });
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
