import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // Optional: Add authentication check
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { artist, id, type } = body;

    const revalidatedTags: string[] = [];

    // Revalidate artist tag if provided
    if (artist) {
      const artistSlug = artist.toLowerCase().replace(/\s+/g, "-");
      revalidateTag(`artist-${artistSlug}`);
      revalidatedTags.push(`artist-${artistSlug}`);
    }

    // Revalidate lyrics tag if ID is provided
    if (id) {
      revalidateTag(`lyrics-${id}`);
      revalidatedTags.push(`lyrics-${id}`);
    }

    // Revalidate specific collection tags
    if (type === "lyrics" || id) {
      revalidateTag("lyrics-all");
      revalidateTag("lyrics-featured");
      revalidateTag("lyrics-top");
      revalidatedTags.push("lyrics-all", "lyrics-featured", "lyrics-top");
    }

    if (type === "artist" || artist) {
      revalidateTag("artists-all");
      revalidatedTags.push("artists-all");
    }

    // Always revalidate search cache when content changes
    if (id || artist) {
      revalidateTag("search");
      revalidatedTags.push("search");
    }

    return NextResponse.json({
      success: true,
      message: "Cache revalidated successfully",
      revalidatedTags,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error revalidating cache:", error);
    return NextResponse.json(
      {
        error: "Failed to revalidate cache",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
