# Tag-Based Caching System

## Overview

This project uses Next.js 15 App Router's built-in tag-based caching with Incremental Static Regeneration (ISR) for optimal performance and fresh content delivery.

## Cache Tags

### Lyrics Tags

- `lyrics-all` - All lyrics collection
- `lyrics-featured` - Featured lyrics
- `lyrics-top` - Top/recent lyrics
- `lyrics-{id}` - Individual lyrics by ID (e.g., `lyrics-507f1f77bcf86cd799439011`)

### Artist Tags

- `artists-all` - All artists collection
- `artist-{slug}` - Individual artist by slug (e.g., `artist-kakhanang`, `artist-john-doe`)

### Other Tags

- `search` - Search results cache

## How It Works

### 1. Data Fetching with Tags

All fetch calls in `/src/service/allartists.ts` use cache tags:

```typescript
// Example: Fetching single lyrics
const res = await fetch(url, {
  next: {
    revalidate: 3600, // Cache for 1 hour
    tags: [`lyrics-${id}`], // Tag for targeted revalidation
  },
});
```

### 2. Automatic Revalidation

When content is created, updated, or deleted, the API routes automatically revalidate relevant tags:

**Lyrics API** (`/api/lyrics`)

- CREATE → Revalidates: `lyrics-{id}`, `artist-{slug}`, collection tags
- UPDATE → Revalidates: `lyrics-{id}`, `artist-{slug}`, collection tags
- DELETE → Revalidates: `lyrics-{id}`, `artist-{slug}`, collection tags

**Artist API** (`/api/artist`)

- CREATE → Revalidates: `artist-{slug}`, `artists-all`
- UPDATE → Revalidates: both old and new `artist-{slug}`, `artists-all`
- DELETE → Revalidates: `artist-{slug}`, `artists-all`

### 3. Manual Revalidation API

For external triggers or manual cache clearing:

**Endpoint:** `POST /api/revalidate`

**Authentication:** Requires admin session

**Request Body:**

```json
{
  "artist": "kakhanang",
  "id": "507f1f77bcf86cd799439011",
  "type": "lyrics"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Cache revalidated successfully",
  "revalidatedTags": [
    "artist-kakhanang",
    "lyrics-507f1f77bcf86cd799439011",
    "lyrics-all",
    "lyrics-featured",
    "lyrics-top",
    "search"
  ],
  "timestamp": "2026-01-16T10:30:00.000Z"
}
```

## Benefits

✅ **Fast Page Loads** - Static pages served from CDN  
✅ **Fresh Content** - Automatic revalidation on updates  
✅ **No ISR Limits** - Only revalidates when content changes  
✅ **Cost Efficient** - Fewer serverless function invocations  
✅ **Granular Control** - Revalidate specific pages without rebuilding everything

## Usage Examples

### In Admin Panel

When updating lyrics, the cache is automatically cleared:

```typescript
// In your admin form
const handleUpdate = async (lyricsData) => {
  await updateLyrics(lyricsData);
  // Cache is automatically revalidated by the API
  // No manual action needed
};
```

### Manual Revalidation (if needed)

```typescript
// Trigger manual revalidation
const response = await fetch("/api/revalidate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    artist: "kakhanang",
    id: "507f1f77bcf86cd799439011",
    type: "lyrics",
  }),
});
```

### Revalidating After Bulk Operations

```typescript
// After bulk import/update
const revalidateAll = async () => {
  await fetch("/api/revalidate", {
    method: "POST",
    body: JSON.stringify({ type: "lyrics" }),
  });
};
```

## Cache Durations

| Content Type    | Cache Duration   | Reason                        |
| --------------- | ---------------- | ----------------------------- |
| Single Lyrics   | 1 hour (3600s)   | Updated frequently            |
| All Lyrics      | 5 minutes (300s) | List changes often            |
| Featured Lyrics | 1 hour (3600s)   | Changes less frequently       |
| Top Lyrics      | 1 hour (3600s)   | Changes less frequently       |
| Artists         | 1 hour (3600s)   | Changes less frequently       |
| Search          | 1 hour (3600s)   | Can tolerate slight staleness |

## Production Deployment

### Vercel Settings

No special configuration needed. The tag-based revalidation works automatically with:

- ✅ Edge Network (CDN)
- ✅ ISR (Incremental Static Regeneration)
- ✅ On-Demand Revalidation

### Environment Variables

Ensure `NEXT_PUBLIC_API_URL` is set:

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000

# .env.production
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

## Monitoring

### Check Cache Status

```bash
# Check if revalidation is working
curl -X POST https://yourdomain.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"type": "lyrics"}'
```

### Debug Cache Issues

1. Check browser Network tab for cache headers
2. Look for `X-Vercel-Cache: HIT/MISS` headers
3. Verify tags in fetch calls
4. Check server logs for revalidation events

## Best Practices

1. **Always use specific tags** for individual items
2. **Revalidate collections** when individual items change
3. **Keep cache times reasonable** (1-5 minutes to 1 hour)
4. **Test revalidation** after deploying changes
5. **Monitor cache hit rates** in Vercel Analytics

## Troubleshooting

### Cache not updating

- Check if revalidateTag is called after updates
- Verify tag names match between fetch and revalidation
- Ensure authentication is working for `/api/revalidate`

### Stale data showing

- Confirm cache duration is appropriate
- Check if automatic revalidation is triggered
- Try manual revalidation via API

### ISR limits exceeded

- Should not happen with this setup
- Only revalidates on actual changes
- Check for infinite revalidation loops
