# Admin Guide: Cache Management

## Overview

When you add, edit, or delete lyrics or artists, the cache needs to be refreshed so users see the latest data immediately.

## How to Use

### In Admin Components

Import the cache utility functions:

```typescript
import {
  refreshLyricsCache,
  refreshArtistsCache,
  refreshAllCaches,
} from "@/lib/adminCacheUtils";
```

### After Creating/Updating Lyrics

```typescript
const handleSubmit = async (formData) => {
  try {
    // Your existing save logic
    await saveLyrics(formData);

    // Refresh the cache
    await refreshLyricsCache();

    alert("Lyrics saved and cache updated!");
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### After Creating/Updating Artists

```typescript
const handleArtistSubmit = async (artistData) => {
  try {
    // Your existing save logic
    await saveArtist(artistData);

    // Refresh the cache
    await refreshArtistsCache();

    alert("Artist saved and cache updated!");
  } catch (error) {
    console.error("Error:", error);
  }
};
```

### After Batch Operations

```typescript
const handleBulkUpdate = async () => {
  try {
    // Your bulk operations
    await bulkUpdateLyrics();
    await bulkUpdateArtists();

    // Refresh all caches at once
    await refreshAllCaches();

    alert("All data updated!");
  } catch (error) {
    console.error("Error:", error);
  }
};
```

## Implementation Examples

### Example 1: Add Lyrics Form

```tsx
"use client";
import { useState } from "react";
import { refreshLyricsCache } from "@/lib/adminCacheUtils";

export default function AddLyricsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/lyrics", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Refresh cache after successful save
        await refreshLyricsCache();
        alert("Lyrics added and cache refreshed!");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Example 2: Edit Artist Page

```tsx
"use client";
import { refreshArtistsCache } from "@/lib/adminCacheUtils";

export default function EditArtist({ artistId }) {
  const handleUpdate = async (updatedData) => {
    try {
      const response = await fetch(`/api/artist/${artistId}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        // Refresh cache
        await refreshArtistsCache();
        alert("Artist updated!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return <button onClick={handleUpdate}>Update</button>;
}
```

## When to Refresh Cache

### ✅ Always Refresh After:

- Creating new lyrics
- Updating existing lyrics
- Deleting lyrics
- Creating new artists
- Updating artist information
- Deleting artists
- Bulk operations
- Importing data

### ⚠️ Don't Need to Refresh:

- Viewing data (read operations)
- Form validation
- Image uploads (before saving)
- Draft saves (if not published)

## Troubleshooting

### Cache Not Updating?

1. Check console for errors
2. Verify API call succeeded before refreshing cache
3. Try force refresh: `await refreshLyricsCache()` (already forces refresh)
4. Clear browser cache and reload

### Users Still Seeing Old Data?

- Cache updates happen in background
- Users need to refresh their page or wait 5 minutes
- For immediate updates, they can manually refresh (Cmd/Ctrl + R)

## Testing

### Test Cache Refresh

```typescript
// In browser console (DevTools)
import { refreshAllCaches } from "@/lib/adminCacheUtils";

// Force refresh all caches
await refreshAllCaches();
console.log("Cache refreshed!");
```

### Verify Cache Update

```typescript
import { getMetadata, getArtistsMetadata } from "@/lib/indexedDB";

// Check when cache was last updated
const lyricsMeta = await getMetadata();
const artistsMeta = await getArtistsMetadata();

console.log("Lyrics cache updated:", new Date(lyricsMeta?.savedAt || 0));
console.log("Artists cache updated:", new Date(artistsMeta?.savedAt || 0));
```

## Best Practices

1. **Always await**: Make sure to `await refreshLyricsCache()` before showing success message
2. **Error handling**: Wrap in try-catch to handle failures gracefully
3. **User feedback**: Show loading state while refreshing cache
4. **Batch operations**: Use `refreshAllCaches()` instead of individual refreshes

## Complete Example

Here's a complete example of an admin form with proper cache management:

```tsx
"use client";
import { useState } from "react";
import { refreshLyricsCache } from "@/lib/adminCacheUtils";
import { createLyrics } from "@/service/allartists";

export default function AddLyricsComplete() {
  const [formData, setFormData] = useState({
    title: "",
    artistId: "",
    lyrics: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshingCache, setIsRefreshingCache] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Step 1: Save to database
      const result = await createLyrics(formData);

      if (result) {
        // Step 2: Refresh cache
        setIsRefreshingCache(true);
        await refreshLyricsCache();

        // Step 3: Show success and reset form
        alert("✅ Lyrics saved and cache refreshed!");
        setFormData({ title: "", artistId: "", lyrics: "" });
      } else {
        alert("❌ Failed to save lyrics");
      }
    } catch (error) {
      console.error("Error submitting lyrics:", error);
      alert("❌ An error occurred");
    } finally {
      setIsSubmitting(false);
      setIsRefreshingCache(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your form fields */}

      <button type="submit" disabled={isSubmitting || isRefreshingCache}>
        {isSubmitting
          ? "Saving..."
          : isRefreshingCache
          ? "Updating cache..."
          : "Submit"}
      </button>
    </form>
  );
}
```

## Quick Reference

```typescript
// Import
import {
  refreshLyricsCache,
  refreshArtistsCache,
  refreshAllCaches,
} from "@/lib/adminCacheUtils";

// Usage
await refreshLyricsCache(); // After lyrics operations
await refreshArtistsCache(); // After artist operations
await refreshAllCaches(); // After batch operations
```

That's it! Now your admin operations will keep the cache in sync automatically. 🚀
