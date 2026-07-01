/*
  Service Worker for Tangkhul Lyrics
  - Caches visited lyrics/search pages for limited offline access
  - Keeps A-Z browse and search API responses fast on slow networks
  - Uses stale-while-revalidate for browse/query data and assets
  - Uses network-first with cache fallback for lyrics detail pages
*/

const VERSION = "v2.1.0";
const PAGE_CACHE = `pages-${VERSION}`;
const ASSET_CACHE = `assets-${VERSION}`;
const CONTENT_CACHE = `content-${VERSION}`;

const MANAGED_CACHES = [PAGE_CACHE, ASSET_CACHE, CONTENT_CACHE];
const CONTENT_CACHE_MAX_ENTRIES = 90;
const PAGE_CACHE_MAX_ENTRIES = 60;
const NETWORK_TIMEOUT_MS = 3000;

const OFFLINE_RESPONSE = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Offline | Tangkhul Lyrics</title>
    <style>
      body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0f172a; color: #f8fafc; }
      main { max-width: 38rem; padding: 2rem; text-align: center; }
      a { color: #bfdbfe; }
    </style>
  </head>
  <body>
    <main>
      <h1>You are offline</h1>
      <p>Previously visited lyrics, search, and browse pages are available from cache. Reconnect to load new songs.</p>
      <p><a href="/lyrics">Try cached lyrics</a></p>
    </main>
  </body>
</html>`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PAGE_CACHE);
      await cache
        .addAll(["/", "/lyrics"])
        .catch(() => {
          // Precache is a best-effort warm-up; runtime caching handles failures.
        });
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => !MANAGED_CACHES.includes(key))
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

function isSameOrigin(requestUrl) {
  try {
    return new URL(requestUrl).origin === self.location.origin;
  } catch {
    return false;
  }
}

function isStaticAsset(url) {
  return (
    /\.(?:js|css|svg|png|jpg|jpeg|gif|webp|avif|ico|woff2?|ttf|otf)$/i.test(
      url.pathname
    ) ||
    url.pathname.startsWith("/_next/") ||
    url.pathname === "/manifest.json"
  );
}

function isPublicNavigationPath(pathname) {
  return (
    pathname === "/" ||
    pathname === "/home" ||
    pathname === "/lyrics" ||
    pathname.startsWith("/lyrics/") ||
    pathname === "/artists" ||
    pathname.startsWith("/artists/") ||
    pathname === "/allartists" ||
    pathname === "/search"
  );
}

function isBrowseOrQueryApi(url) {
  if (url.pathname === "/api/search") {
    return Boolean(url.searchParams.get("query")?.trim());
  }

  if (url.pathname === "/api/lyrics") {
    return !url.searchParams.has("includeAll");
  }

  if (url.pathname === "/api/artist") {
    return true;
  }

  if (url.pathname === "/api/artist/lyricscount") {
    return true;
  }

  if (url.pathname === "/api/lyrics/author/lyrics") {
    return Boolean(url.searchParams.get("artistName")?.trim());
  }

  return false;
}

function shouldBypassCache(request, url) {
  return (
    request.cache === "no-store" ||
    url.searchParams.has("_cacheBust") ||
    url.pathname.startsWith("/api/auth") ||
    url.pathname.startsWith("/api/admin") ||
    url.pathname.startsWith("/admin")
  );
}

function cacheKeyForRequest(request) {
  const url = new URL(request.url);

  if (url.pathname === "/api/search") {
    const query = url.searchParams.get("query")?.trim().toLowerCase() ?? "";
    const limit = url.searchParams.get("limit") ?? "";
    return new Request(
      `${url.origin}${url.pathname}?query=${encodeURIComponent(query)}${
        limit ? `&limit=${encodeURIComponent(limit)}` : ""
      }`
    );
  }

  return request;
}

function isCacheableResponse(response) {
  if (!response || !response.ok) return false;
  if (response.type === "opaque") return false;

  return true;
}

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;

  await Promise.all(
    keys.slice(0, keys.length - maxEntries).map((request) => cache.delete(request))
  );
}

async function putInCache(cacheName, request, response, maxEntries) {
  if (!isCacheableResponse(response)) return;

  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone()).catch(() => {});
  await trimCache(cacheName, maxEntries).catch(() => {});
}

function fetchWithTimeout(request, timeoutMs = NETWORK_TIMEOUT_MS) {
  return Promise.race([
    fetch(request),
    new Promise((resolve) => setTimeout(() => resolve(null), timeoutMs)),
  ]);
}

async function networkFirstWithCacheFallback(request, options = {}) {
  const {
    cacheName = PAGE_CACHE,
    timeoutMs = NETWORK_TIMEOUT_MS,
    maxEntries = PAGE_CACHE_MAX_ENTRIES,
    fallbackRequest,
  } = options;

  const cacheKey = cacheKeyForRequest(request);
  const fallbackKey = fallbackRequest ? cacheKeyForRequest(fallbackRequest) : null;
  const cache = await caches.open(cacheName);

  try {
    const response = await fetchWithTimeout(request, timeoutMs);
    if (response) {
      await putInCache(cacheName, cacheKey, response.clone(), maxEntries);
      return response;
    }
  } catch {
    // Network failures fall through to cached content.
  }

  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  if (fallbackKey) {
    const fallback = await cache.match(fallbackKey);
    if (fallback) return fallback;
  }

  try {
    const response = await fetch(request);
    await putInCache(cacheName, cacheKey, response.clone(), maxEntries);
    return response;
  } catch {
    const rootFallback = await cache.match("/");
    return (
      rootFallback ||
      new Response(OFFLINE_RESPONSE, {
        status: 503,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      })
    );
  }
}

async function staleWhileRevalidate(request, cacheName, maxEntries, offlineFallback) {
  const cacheKey = cacheKeyForRequest(request);
  const cache = await caches.open(cacheName);
  const cached = await cache.match(cacheKey);

  const networkPromise = fetch(request)
    .then(async (response) => {
      await putInCache(cacheName, cacheKey, response.clone(), maxEntries);
      return response;
    })
    .catch(() => null);

  return (
    cached ||
    (await networkPromise) ||
    (offlineFallback
      ? await offlineFallback()
      : new Response(JSON.stringify({ offline: true, cached: false }), {
          status: 200,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        }))
  );
}

async function offlinePageFallback() {
  const cache = await caches.open(PAGE_CACHE);
  const fallback = await cache.match("/lyrics");
  return (
    fallback ||
    new Response(OFFLINE_RESPONSE, {
      status: 503,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    })
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET" || !isSameOrigin(request.url)) return;

  const url = new URL(request.url);
  if (shouldBypassCache(request, url)) return;

  if (request.mode === "navigate") {
    if (!isPublicNavigationPath(url.pathname)) return;

    // Artist and lyrics pages serve instantly from cache (if present) while
    // revalidating in the background — these are the pages precached during
    // idle time, so a stale hit should be the common case.
    if (
      url.pathname.startsWith("/artists/") ||
      url.pathname.startsWith("/lyrics/")
    ) {
      event.respondWith(
        staleWhileRevalidate(
          request,
          PAGE_CACHE,
          PAGE_CACHE_MAX_ENTRIES,
          offlinePageFallback
        )
      );
      return;
    }

    event.respondWith(
      networkFirstWithCacheFallback(request, {
        cacheName: PAGE_CACHE,
        timeoutMs: NETWORK_TIMEOUT_MS,
        maxEntries: PAGE_CACHE_MAX_ENTRIES,
        fallbackRequest:
          url.pathname === "/search"
            ? new Request(`${self.location.origin}/lyrics`)
            : undefined,
      })
    );
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(staleWhileRevalidate(request, ASSET_CACHE, 120));
    return;
  }

  if (isBrowseOrQueryApi(url)) {
    event.respondWith(
      staleWhileRevalidate(request, CONTENT_CACHE, CONTENT_CACHE_MAX_ENTRIES)
    );
    return;
  }

  if (url.pathname.startsWith("/api/lyrics/author/singleLyrics")) {
    event.respondWith(
      networkFirstWithCacheFallback(request, {
        cacheName: CONTENT_CACHE,
        timeoutMs: 3500,
        maxEntries: CONTENT_CACHE_MAX_ENTRIES,
      })
    );
  }
});
