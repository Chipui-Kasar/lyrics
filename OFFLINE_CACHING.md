# Offline-First MVP: Caching Strategy

This document describes the MVP implementation for offline-first behavior.

## Goals

- First visit requires internet; content is fetched from the backend.
- Subsequent visits work offline for previously visited pages.
- Data becomes eventually consistent when internet is available.

## Components

- Service Worker (`public/sw.js`)
  - Navigation requests: network-first with cache fallback.
  - Static assets (`/_next/*`, images, fonts): stale-while-revalidate.
  - API responses (`/api/*`): stale-while-revalidate with JSON cached in Cache Storage.
- IndexedDB (`src/lib/indexedDB.ts`)
  - Stores lyrics list (records keyed by `_id`).
  - Stores metadata document (`lyrics-metadata`) with `totalCount`, `lastUpdated`, `savedAt`.
- Offline Cache Manager (`src/components/component/OfflineCacheManager/OfflineCacheManager.tsx`)
  - On mount (client-side), if online, fetches `/api/lyrics/metadata` and compares with local metadata.
  - If different, fetches updated lyrics list and updates IndexedDB.
- Offline Indicator (`src/components/ui/OfflineIndicator.tsx`)
  - Shows a small badge when offline.
- Service Worker Registrar (`src/components/component/ServiceWorkerRegistrar/ServiceWorkerRegistrar.tsx`)
  - Registers the service worker in production builds.

## API

- `GET /api/lyrics` — returns published lyrics with optional sorting and limits.
- `GET /api/lyrics/metadata` — returns `{ totalCount, lastUpdated }` for consistency checks.

## Behavior

1. First Visit (Online):
   - Pages and assets are fetched from the network and cached by the service worker.
   - Lyrics list is fetched server-side; Offline Cache Manager will also store list + metadata in IndexedDB when online.
2. Subsequent Visits:
   - Navigation requests are served from cache when offline.
   - Static assets are served from cache; API responses may be served from cache.
   - IndexedDB provides stored lyrics for client-side features as needed.
3. Background Sync / Validation:
   - When online, Offline Cache Manager compares `/api/lyrics/metadata` with local metadata to detect changes and updates IndexedDB silently.

## Notes

- This MVP avoids complex conflict resolution or user-specific caching.
- iOS Safari has limited support for background sync / service workers; the cache manager runs on app load when online.
- SEO remains unaffected because SSR pages still render when online; cached HTML serves offline.

## Future Enhancements

- Precache critical routes and chunked API data for faster offline boot.
- Client-side hydration components that read from IndexedDB to render instantly without waiting for SSR.
- Periodic background sync (where supported) to refresh caches without user interaction.
