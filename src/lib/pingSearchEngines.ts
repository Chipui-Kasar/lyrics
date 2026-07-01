const SITEMAP_URL = "https://tangkhullyrics.com/sitemap.xml";

// Google retired the sitemap ping endpoint in June 2023 (it now 404s) —
// kept here since it's harmless and Google may reinstate it, but don't
// rely on it. Bing's ping still works.
const PING_ENDPOINTS = [
  `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
  `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`,
];

export async function pingSearchEngines() {
  const results = await Promise.allSettled(
    PING_ENDPOINTS.map((url) => fetch(url, { method: "GET" })),
  );

  results.forEach((result, i) => {
    const endpoint = PING_ENDPOINTS[i];
    if (result.status === "rejected") {
      console.error(`Sitemap ping failed for ${endpoint}:`, result.reason);
    } else if (!result.value.ok) {
      console.error(
        `Sitemap ping returned ${result.value.status} for ${endpoint}`,
      );
    }
  });
}
