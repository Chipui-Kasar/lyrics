import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRecentSitemapLinks, sanitizeLookbackDays } from "@/lib/sitemapTracker";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const lookbackDays = sanitizeLookbackDays(Number(body.days ?? undefined));
    const sitemapUrl = body.sitemapUrl?.trim() || undefined;

    const snapshot = await getRecentSitemapLinks({
      requestedSitemapUrl: sitemapUrl,
      lookbackDays,
    });

    if (snapshot.lastError) {
      return NextResponse.json(
        {
          ...snapshot,
          error: snapshot.lastError,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(snapshot);
  } catch (error) {
    console.error("Failed to retrieve sitemap links:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to retrieve sitemap links",
      },
      { status: 500 }
    );
  }
}
