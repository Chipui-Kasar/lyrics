import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { chatCompletion } from "@/lib/aiClient";

export async function POST(request: NextRequest) {
  try {
    // 1. Auth Checks
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await request.json();
    if (!url)
      return NextResponse.json({ error: "URL is required" }, { status: 400 });

    if (!process.env.OPENROUTER_API_KEY && !process.env.GROQ_API_KEY) {
      throw new Error("Neither OPENROUTER_API_KEY nor GROQ_API_KEY is configured");
    }

    // ---------------------------------------------------------
    // STEP 1: FETCH PAGE CONTENT
    // ---------------------------------------------------------
    let pageContent = "";
    try {
      const pageResponse = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });
      if (!pageResponse.ok) throw new Error("Failed to fetch page");
      pageContent = await pageResponse.text();
    } catch (fetchError) {
      return NextResponse.json(
        { error: "Could not fetch URL content." },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // STEP 2: SEND TO OPENROUTER, FALLING BACK TO GROQ (Requesting JSON)
    // ---------------------------------------------------------
    const rawText = await chatCompletion({
      messages: [
        {
          role: "user",
          content: `Extract song data from the HTML Source Code below into a valid JSON object.

              SOURCE CODE:
              """
              ${pageContent}
              """

              STRICT EXTRACTION RULES:
              * Title = the single main song title
              * Artist = the credited performer
              * Lyrics = The main lyrics text.
              * CRITICAL: YOU MUST PRESERVE LINE BREAKS using the \\n character.
              * Keep stanza spacing (double \\n) exactly as they appear visually.
              * Do not strip whitespace that creates structure.

              OUTPUT FORMAT (JSON):
              {
                "title": "Song Title",
                "artist": "Artist Name",
                "lyrics": "Line 1\\nLine 2\\n\\nChorus Line 1..."
              }
              `,
        },
      ],
      openRouterModel: "google/gemini-2.5-flash-lite",
      groqModel: "llama-3.3-70b-versatile",
      temperature: 0.1,
      maxTokens: 2048,
      jsonMode: true,
    });

    // ---------------------------------------------------------
    // STEP 3: PARSE JSON (No manual looping needed)
    // ---------------------------------------------------------
    let extractedData;
    try {
      extractedData = JSON.parse(rawText);
    } catch (e) {
      console.error("Failed to parse OpenRouter JSON:", rawText);
      return NextResponse.json(
        { error: "Failed to parse lyrics data" },
        { status: 500 }
      );
    }

    // Validate extracted data
    if (!extractedData.title || !extractedData.lyrics) {
      return NextResponse.json(
        { error: "Failed to extract complete data.", debug: extractedData },
        { status: 400 }
      );
    }

    return NextResponse.json({
      title: extractedData.title,
      artist: extractedData.artist || "Unknown",
      lyrics: extractedData.lyrics, // This will now contain \n characters correctly
    });
  } catch (error) {
    console.error("Extract lyrics error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 }
    );
  }
}
