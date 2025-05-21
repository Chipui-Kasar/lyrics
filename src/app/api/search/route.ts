import { connectMongoDB } from "@/lib/mongodb";
import { Artist, Lyrics } from "@/models/model";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { message: "Query parameter is required" },
      { status: 400 }
    );
  }
  await connectMongoDB();

  try {
    // Fuzzy search using MongoDB Atlas Search (if using MongoDB Atlas)
    const lyrics = await Lyrics.aggregate([
      {
        $search: {
          index: "default", // Ensure this matches your search index name
          text: {
            query,
            path: ["lyrics", "title", "album", "artistId.name"], // Fields to search in
            fuzzy: {
              maxEdits: 2,
              prefixLength: 2,
            },
          },
        },
      },
      { $limit: 10 },
      {
        $lookup: {
          from: "artists", // Ensure this matches your artists collection name
          localField: "artistId",
          foreignField: "_id",
          as: "artist",
        },
      },
      { $unwind: "$artist" },
      {
        $project: {
          lyrics: 1,
          title: 1, // ✅ Include the song title
          album: 1,
          "artistId.name": "$artist.name", // ✅ Include the artist ID
          score: { $meta: "searchScore" },
        },
      },
    ]);

    const artists = await Artist.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query,
            path: ["name", "village", "genre"],
            fuzzy: { maxEdits: 2, prefixLength: 2 },
          },
        },
      },
      { $limit: 10 },
      {
        $project: {
          name: 1,
          village: 1,
          genre: 1,
          score: { $meta: "searchScore" },
        },
      },
    ]);

    return NextResponse.json({ lyrics, artists }, { status: 200 });
  } catch (error) {
    console.error("Search Error:", error);
    return NextResponse.json({ error: "Failed to search" }, { status: 500 });
  }
}
