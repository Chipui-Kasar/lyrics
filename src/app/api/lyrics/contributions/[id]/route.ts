import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import { Lyrics } from "@/models/model";
import { ContributedLyrics } from "@/models/ContributedLyrics";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pingSearchEngines } from "@/lib/pingSearchEngines";
import { revalidateLyricsCache } from "@/lib/revalidateLyricsCache";

const EDITABLE_FIELDS = [
  "title",
  "album",
  "releaseYear",
  "thumbnail",
  "contributedBy",
  "lyrics",
  "streamingLinks",
] as const;

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
    await connectMongoDB(true);
    const { id } = params;
    const body = await req.json();
    const { status, rejectionReason } = body;

    const edits: Record<string, unknown> = {};
    for (const field of EDITABLE_FIELDS) {
      if (body[field] !== undefined) {
        edits[field] = body[field];
      }
    }

    if (status === "rejected") {
      const contribution = await ContributedLyrics.findByIdAndUpdate(
        id,
        { ...edits, status: "rejected", rejectionReason: rejectionReason || "" },
        { new: true }
      );
      if (!contribution) {
        return NextResponse.json(
          { message: "Contribution not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(contribution);
    }

    if (status === "published") {
      const contribution = await ContributedLyrics.findByIdAndUpdate(
        id,
        edits,
        { new: true }
      ).populate("artistId", "name");
      if (!contribution) {
        return NextResponse.json(
          { message: "Contribution not found" },
          { status: 404 }
        );
      }

      const newLyric = new Lyrics({
        title: contribution.title,
        artistId: contribution.artistId._id,
        album: contribution.album,
        releaseYear: contribution.releaseYear,
        lyrics: contribution.lyrics,
        streamingLinks: contribution.streamingLinks || {},
        thumbnail: contribution.thumbnail || "",
        contributedBy: contribution.contributedBy || "",
        submittedBy: contribution.submittedBy,
        status: "published",
      });
      await newLyric.save();

      contribution.status = "published";
      contribution.publishedLyricsId = newLyric._id;
      await contribution.save();

      revalidateLyricsCache(
        newLyric._id.toString(),
        contribution.artistId.name
      );
      pingSearchEngines().catch((error) =>
        console.error("Sitemap ping failed:", error)
      );

      return NextResponse.json(contribution);
    }

    if (status !== undefined) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    // No status change: save edits only, contribution stays pending.
    const contribution = await ContributedLyrics.findByIdAndUpdate(
      id,
      edits,
      { new: true }
    );
    if (!contribution) {
      return NextResponse.json(
        { message: "Contribution not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(contribution);
  } catch (error: any) {
    console.error("Error updating contribution:", error.message, error.stack);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
