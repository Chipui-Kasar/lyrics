import { revalidateTag, revalidatePath } from "next/cache";

export function revalidateLyricsCache(lyricsId?: string, artistName?: string) {
  // Revalidate specific lyrics page
  if (lyricsId) {
    revalidateTag(`lyrics-${lyricsId}`);
  }

  // Revalidate artist cache and page
  if (artistName) {
    const artistSlug = artistName.toLowerCase().replace(/\s+/g, "-");
    revalidateTag(`artist-${artistSlug}`);
    revalidatePath(`/artists/${artistSlug}`);
  }

  // Revalidate collection caches
  revalidateTag("lyrics-all");
  revalidateTag("lyrics-featured");
  revalidateTag("lyrics-top");
  revalidateTag("search");

  // Revalidate static pages that list lyrics
  revalidatePath("/", "page");
  revalidatePath("/lyrics", "page");
}
