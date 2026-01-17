import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

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
        { status: 400 },
      );
    }

    // Use serverless chromium in production, local Chrome in dev
    const isProduction =
      process.env.VERCEL || process.env.NODE_ENV === "production";

    browser = await puppeteer.launch({
      args: isProduction ? chromium.args : [],
      defaultViewport: {
        width: 1920,
        height: 1080,
      },
      executablePath: isProduction
        ? await chromium.executablePath()
        : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", // Mac path, adjust for your OS
      headless: true,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    );

    // Navigate to the page (use domcontentloaded for faster loading)
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });

    // Wait for the SITE_PAGES_TRANSITION_GROUP to be present (this is what we actually need)
    await page.waitForSelector("#SITE_PAGES_TRANSITION_GROUP", {
      timeout: 15000,
    });

    // Give a brief moment for content to settle (Puppeteer way)
    await new Promise((resolve) => setTimeout(resolve, 1000));

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
      { status: 500 },
    );
  }
}
