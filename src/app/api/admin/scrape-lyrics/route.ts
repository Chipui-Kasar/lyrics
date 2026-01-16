import { NextRequest, NextResponse } from "next/server";
import { chromium } from "playwright";

export async function POST(request: NextRequest) {
  let browser;
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Launch browser and fetch JavaScript-rendered content
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    });
    const page = await context.newPage();

    // Navigate to the page (use domcontentloaded for faster loading)
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });

    // Wait for the SITE_PAGES_TRANSITION_GROUP to be present (this is what we actually need)
    await page.waitForSelector("#SITE_PAGES_TRANSITION_GROUP", {
      timeout: 15000,
    });

    // Give a brief moment for content to settle
    await page.waitForTimeout(1000);

    // Get the fully rendered HTML
    const html = await page.content();

    await browser.close();

    return NextResponse.json({ html });
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    console.error("Error scraping lyrics:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to scrape lyrics",
      },
      { status: 500 }
    );
  }
}
