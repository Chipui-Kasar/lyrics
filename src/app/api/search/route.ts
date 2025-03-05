import { connectMongoDB } from "@/lib/mongodb";
import { Artist, Lyrics } from "@/models/model";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectMongoDB();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { message: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const lyrics = await Lyrics.find(
      { $text: { $search: query, $caseSensitive: false } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10)
      .populate("artistId", "name");

    const artists = await Artist.find(
      { $text: { $search: query, $caseSensitive: false } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10);

    return NextResponse.json({ lyrics, artists }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}
