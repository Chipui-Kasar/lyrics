import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

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
    // STEP 2: SEND TO GEMINI (Requesting JSON)
    // ---------------------------------------------------------
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Extract song data from the HTML Source Code below into a valid JSON object.
              
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
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 2048,
            responseMimeType: "application/json", // <--- This forces valid JSON output
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json();
      throw new Error(
        `Gemini API error: ${errorData.error?.message || "Unknown error"}`
      );
    }

    const geminiData = await geminiResponse.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("Empty response from Gemini");
    }

    // ---------------------------------------------------------
    // STEP 3: PARSE JSON (No manual looping needed)
    // ---------------------------------------------------------
    let extractedData;
    try {
      extractedData = JSON.parse(rawText);
    } catch (e) {
      console.error("Failed to parse Gemini JSON:", rawText);
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
