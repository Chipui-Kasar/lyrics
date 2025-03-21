import { IArtists } from "@/models/IObjects";

export const getLyrics = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lyrics`, {
      cache: "force-cache",
    });
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    return [];
  }
};
export const getSingleLyrics = async (
  id: string,
  title: string,
  artist: string
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/lyrics/author/singleLyrics?id=${id}&title=${title}&artist=${artist}`,
      { cache: "force-cache" }
    );
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    return [];
  }
};
export const getFeaturedLyrics = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/lyrics?limit=2`,
      {
        next: { revalidate: 60 },
        // cache: "force-cache",
      }
    );
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error("Error fetching featured lyrics:", error);
    return [];
  }
};
export const getTopLyrics = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lyrics`, {
      next: { revalidate: 60 },
      // cache: "force-cache",
    });
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error("Error fetching top lyrics:", error);
    return [];
  }
};
export const getAllArtists = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artist`, {
      next: { revalidate: 60 },
      // cache: "force-cache",
    });
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error("Error fetching artists:", error);
    return [];
  }
};
export const getArtistsWithSongCount = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artist`, {
      next: { revalidate: 60 },
      // cache: "force-cache",
    });

    if (!res.ok) return [];

    const artists = await res.json();
    if (artists.length === 0) return [];

    // Fetch song counts
    const artistIds = artists.map((artist: IArtists) => artist._id).join(",");
    const countRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/artist/lyricscount?artistIds=${artistIds}`
    );

    if (!countRes.ok)
      return artists.map((artist: IArtists) => ({ ...artist, songCount: 0 }));

    const songCounts = await countRes.json();

    // Merge song counts with artists
    return artists.map((artist: IArtists) => ({
      ...artist,
      songCount: songCounts[artist._id] ?? 0,
    }));
  } catch (error) {
    console.error("Error fetching artists with song counts:", error);
    return [];
  }
};
export const getSingleArtist = async () => {};
export const getSingleArtistWithSongCount = async (artistName: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/lyrics/author/lyrics?artistName=${artistName}`,
      {
        next: { revalidate: 60 },
        // cache: "force-cache",
      }
    );
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error("Error fetching artists:", error);
    return [];
  }
};

export const createArtist = async () => {};
export const updateArtist = async () => {};
export const deleteArtist = async () => {};

export const createLyrics = async () => {};
export const updateLyrics = async () => {};
export const deleteLyrics = async () => {};

export const getLyricsCount = async () => {};
