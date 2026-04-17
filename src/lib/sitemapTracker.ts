import { SitemapTrackerResponse } from "@/lib/sitemapTracker.types";

const DEFAULT_LOOKBACK_DAYS = 7;
const MAX_LOOKBACK_DAYS = 90;
const FETCH_TIMEOUT_MS = 20 * 1000;
const MAX_SITEMAPS_TO_VISIT = 30;

interface DiscoveredLink {
  link: string;
  sourceSitemap: string;
  lastModifiedAt: string | null;
}

interface ParsedSitemapItem {
  link: string;
  lastModifiedAt: string | null;
}

const isParsedSitemapItem = (
  value: ParsedSitemapItem | null
): value is ParsedSitemapItem => Boolean(value);

const xmlEntityMap: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
};

export const sanitizeLookbackDays = (value?: number) => {
  if (!value || Number.isNaN(value)) {
    return DEFAULT_LOOKBACK_DAYS;
  }

  return Math.min(Math.max(Math.floor(value), 1), MAX_LOOKBACK_DAYS);
};

const toIsoString = (value?: Date | string | null) => {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.toISOString();
};

export const normalizeTrackedUrl = (value: string) => {
  const parsedUrl = new URL(value.trim());
  parsedUrl.hash = "";
  return parsedUrl.toString();
};

const decodeXmlEntities = (value: string) =>
  value.replace(
    /&(amp|lt|gt|quot|apos);/g,
    (entity) => xmlEntityMap[entity] || entity
  );

const extractLoc = (xmlBlock: string) => {
  const locMatch = xmlBlock.match(/<loc>([\s\S]*?)<\/loc>/i);

  if (!locMatch?.[1]) {
    return null;
  }

  return decodeXmlEntities(locMatch[1].trim());
};

const extractLastMod = (xmlBlock: string) => {
  const lastModMatch = xmlBlock.match(/<lastmod>([\s\S]*?)<\/lastmod>/i);

  if (!lastModMatch?.[1]) {
    return null;
  }

  return toIsoString(decodeXmlEntities(lastModMatch[1].trim()));
};

const parseSitemapXml = (xml: string) => {
  const sitemapBlocks = Array.from(
    xml.matchAll(/<sitemap\b[^>]*>([\s\S]*?)<\/sitemap>/gi)
  );
  const urlBlocks = Array.from(xml.matchAll(/<url\b[^>]*>([\s\S]*?)<\/url>/gi));

  const nestedSitemaps = sitemapBlocks
    .map<ParsedSitemapItem | null>((match) => {
      const sitemapUrl = extractLoc(match[0]);

      if (!sitemapUrl) {
        return null;
      }

      return {
        link: sitemapUrl,
        lastModifiedAt: extractLastMod(match[0]),
      };
    })
    .filter(isParsedSitemapItem);

  const pageUrls = urlBlocks
    .map<ParsedSitemapItem | null>((match) => {
      const pageUrl = extractLoc(match[0]);

      if (!pageUrl) {
        return null;
      }

      return {
        link: pageUrl,
        lastModifiedAt: extractLastMod(match[0]),
      };
    })
    .filter(isParsedSitemapItem);

  if (nestedSitemaps.length === 0 && pageUrls.length === 0) {
    const fallbackLocs = Array.from(xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi))
      .map<ParsedSitemapItem | null>((match) => {
        const pageUrl = decodeXmlEntities(match[1].trim());

        if (!pageUrl) {
          return null;
        }

        return {
          link: pageUrl,
          lastModifiedAt: null,
        };
      })
      .filter(isParsedSitemapItem);

    return {
      nestedSitemaps: [],
      pageUrls: fallbackLocs,
    };
  }

  return {
    nestedSitemaps,
    pageUrls,
  };
};

const fetchSitemapContent = async (sitemapUrl: string) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(sitemapUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; TangkhulLyricsBot/1.0; +https://tangkhullyrics.com)",
        Accept: "application/xml,text/xml;q=0.9,*/*;q=0.8",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap (${response.status})`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
};

const crawlSitemap = async (rootSitemapUrl: string) => {
  const discoveredLinks = new Map<string, DiscoveredLink>();
  const queue = [normalizeTrackedUrl(rootSitemapUrl)];
  const visitedSitemaps = new Set<string>();

  while (queue.length > 0) {
    const currentSitemap = queue.shift();

    if (!currentSitemap || visitedSitemaps.has(currentSitemap)) {
      continue;
    }

    visitedSitemaps.add(currentSitemap);

    if (visitedSitemaps.size > MAX_SITEMAPS_TO_VISIT) {
      throw new Error("Sitemap index is too large to process safely.");
    }

    const xml = await fetchSitemapContent(currentSitemap);
    const { nestedSitemaps, pageUrls } = parseSitemapXml(xml);

    for (const nestedSitemap of nestedSitemaps) {
      queue.push(normalizeTrackedUrl(nestedSitemap.link));
    }

    for (const pageUrl of pageUrls) {
      const normalizedLink = normalizeTrackedUrl(pageUrl.link);
      const previousEntry = discoveredLinks.get(normalizedLink);
      const nextLastModifiedAt =
        previousEntry?.lastModifiedAt &&
        pageUrl.lastModifiedAt &&
        new Date(previousEntry.lastModifiedAt) > new Date(pageUrl.lastModifiedAt)
          ? previousEntry.lastModifiedAt
          : pageUrl.lastModifiedAt ?? previousEntry?.lastModifiedAt ?? null;

      discoveredLinks.set(normalizedLink, {
        link: normalizedLink,
        sourceSitemap: previousEntry?.sourceSitemap ?? currentSitemap,
        lastModifiedAt: nextLastModifiedAt,
      });
    }
  }

  return Array.from(discoveredLinks.values()).sort((a, b) =>
    a.link.localeCompare(b.link)
  );
};

export const resolveSitemapUrl = async (requestedSitemapUrl?: string) => {
  if (requestedSitemapUrl?.trim()) {
    return normalizeTrackedUrl(requestedSitemapUrl);
  }

  return "";
};

const buildEmptyResponse = (
  lookbackDays: number,
  sitemapUrl = ""
): SitemapTrackerResponse => ({
  sitemapUrl,
  lookbackDays,
  hasConfiguredSitemap: Boolean(sitemapUrl),
  currentLinkCount: 0,
  recentLinksCount: 0,
  fetchedAt: null,
  missingLastModifiedCount: 0,
  lastError: null,
  links: [],
});

export const getRecentSitemapLinks = async ({
  requestedSitemapUrl,
  lookbackDays,
}: {
  requestedSitemapUrl?: string;
  lookbackDays?: number;
}) => {
  const sanitizedLookbackDays = sanitizeLookbackDays(lookbackDays);
  const sitemapUrl = await resolveSitemapUrl(requestedSitemapUrl);

  if (!sitemapUrl) {
    return buildEmptyResponse(sanitizedLookbackDays);
  }

  try {
    const discoveredLinks = await crawlSitemap(sitemapUrl);
    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - sanitizedLookbackDays);

    const recentLinks = discoveredLinks
      .filter((item) => {
        if (!item.lastModifiedAt) {
          return false;
        }

        return new Date(item.lastModifiedAt) >= cutoff;
      })
      .sort((a, b) => {
        if (!a.lastModifiedAt || !b.lastModifiedAt) {
          return 0;
        }

        return (
          new Date(b.lastModifiedAt).getTime() -
          new Date(a.lastModifiedAt).getTime()
        );
      });

    return {
      sitemapUrl,
      lookbackDays: sanitizedLookbackDays,
      hasConfiguredSitemap: true,
      currentLinkCount: discoveredLinks.length,
      recentLinksCount: recentLinks.length,
      fetchedAt: now.toISOString(),
      missingLastModifiedCount: discoveredLinks.filter(
        (item) => !item.lastModifiedAt
      ).length,
      lastError: null,
      links: recentLinks.map((item) => ({
        link: item.link,
        sourceSitemap: item.sourceSitemap,
        lastModifiedAt: item.lastModifiedAt,
      })),
    } satisfies SitemapTrackerResponse;
  } catch (error) {
    return {
      ...buildEmptyResponse(sanitizedLookbackDays, sitemapUrl),
      fetchedAt: new Date().toISOString(),
      lastError:
        error instanceof Error ? error.message : "Failed to fetch sitemap",
    };
  }
};
