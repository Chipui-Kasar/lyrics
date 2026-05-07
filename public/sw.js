/*
  Simple MVP Service Worker for Offline-First
  - Caches visited pages and static assets
  - Runtime caching for API responses
  - Network-first for navigation with cache fallback
  - Stale-while-revalidate for assets and API
*/

const VERSION = "v2.0.1";
const PAGE_CACHE = `pages-${VERSION}`;
const ASSET_CACHE = `assets-${VERSION}`;
const API_CACHE = `api-${VERSION}`;

self.addEventListener("install", (event) => {
  // Skip waiting for quicker updates during development
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Clean up old caches
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => ![PAGE_CACHE, ASSET_CACHE, API_CACHE].includes(k))
          .map((k) => caches.delete(k))
      );
      // Take control immediately
      await self.clients.claim();
    })()
  );
});

function isSameOrigin(url) {
  try {
    const u = new URL(url);
    return u.origin === self.location.origin;
  } catch {
    return false;
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET
  if (request.method !== "GET") return;

  // Navigation requests: Network-first with cache fallback
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          const cache = await caches.open(PAGE_CACHE);
          // Clone and store in cache
          cache.put(request, networkResponse.clone()).catch(() => {});
          return networkResponse;
        } catch (err) {
          // Fallback to cache when offline
          const cacheResponse = await caches.match(request);
          if (cacheResponse) return cacheResponse;
          // If not cached, try serving the root page if available
          const fallback = await caches.match("/");
          return fallback || new Response("Offline", { status: 503 });
        }
      })()
    );
    return;
  }

  // Static assets: Stale-while-revalidate
  if (
    isSameOrigin(request.url) &&
    (/\.(?:js|css|svg|png|jpg|jpeg|gif|webp|ico|woff2?)$/i.test(url.pathname) ||
      url.pathname.startsWith("/_next/") ||
      url.pathname.startsWith("/public/"))
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(ASSET_CACHE);
        const cached = await cache.match(request);
        const networkPromise = fetch(request)
          .then((res) => {
            cache.put(request, res.clone()).catch(() => {});
            return res;
          })
          .catch(() => null);
        return (
          cached ||
          networkPromise ||
          new Response("Offline asset", { status: 503 })
        );
      })()
    );
    return;
  }

  function isContentApi(pathname) {
    return (
      pathname.startsWith("/api/lyrics") ||
      pathname.startsWith("/api/artist") ||
      pathname.startsWith("/api/search")
    );
  }

  // Content API responses: network-first with a short timeout and cache fallback.
  // The app-level IndexedDB cache still controls instant repeat renders.
  if (isSameOrigin(request.url) && url.pathname.startsWith("/api/")) {
    if (request.cache === "no-store" || url.searchParams.has("_cacheBust")) {
      event.respondWith(fetch(request));
      return;
    }

    event.respondWith(
      (async () => {
        const cache = await caches.open(API_CACHE);
        const cached = await cache.match(request);
        const timeoutMs = isContentApi(url.pathname) ? 2500 : 800;
        const timeout = new Promise((resolve) =>
          setTimeout(() => resolve(null), timeoutMs)
        );
        const networkPromise = fetch(request).then(async (res) => {
          if (res && res.ok) {
            await cache.put(request, res.clone()).catch(() => {});
          }
          return res;
        });
        const networkResponse = await Promise.race([
          networkPromise.catch(() => null),
          timeout,
        ]);
        return (
          networkResponse ||
          cached ||
          (await networkPromise.catch(() => null)) ||
          new Response(JSON.stringify({ offline: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
        );
      })()
    );
    return;
  }
});
