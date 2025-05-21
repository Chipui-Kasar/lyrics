import { IArtists, ILyrics } from "@/models/IObjects";

export const getLyrics = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/lyrics?sort=title`,
      {
        // next: { revalidate: 60 },
        next: { revalidate: 604800 },
      }
    );
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
      { next: { revalidate: 3600 } }
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
      }
    );
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error("Error fetching featured lyrics:", error);
    return [];
  }
};
export const getTopLyrics = async (limit?: number) => {
  const query = `?sort=created${limit ? `&limit=${limit}` : ""}`;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/lyrics${query}`,
      {
        next: { revalidate: 60 },
      }
    );
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
      }
    );
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error("Error fetching artists:", error);
    return [];
  }
};

export const searchLyrics = async (query: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/search?query=${query}`,
      {
        next: { revalidate: 60 },
      }
    );
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error("Error fetching artists:", error);
    return [];
  }
};

export const createArtist = async (
  artistData: {
    name: string;
    genre: string[];
    socialLinks: { facebook: string; youtube: string; instagram: string };
    image: string;
    village: string;
  },
  method?: string
) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artist`, {
      method: method || "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(artistData),
    });
    return res.ok ? await res.json() : null;
  } catch (error) {
    console.error("Error creating artist:", error);
    return null;
  }
};
export const updateArtist = async (artistData: IArtists) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artist`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(artistData),
    });

    return res.ok ? await res.json() : null;
  } catch (error) {
    console.error("Error updating artist:", error);
    return null;
  }
};

export const deleteArtist = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/artist?id=${id}`,
      {
        method: "DELETE",
        credentials: "include", // only if you're using sessions/cookies
      }
    );
    return res.ok ? await res.json() : null;
  } catch (error) {
    console.error("Error deleting artist:", error);
    return null;
  }
};

export const createLyrics = async (lyricsData: {
  title: string;
  artistId: string;
  album: string;
  releaseYear: number;
  lyrics: string;
  streamingLinks?: { youtube: string; spotify: string };
}) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lyrics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(lyricsData),
    });
    return res.ok ? await res.json() : null;
  } catch (error) {
    console.error("Error creating lyrics:", error);
    return null;
  }
};
export const updateLyrics = async (lyricsData: ILyrics) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lyrics`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(lyricsData),
    });
    return res.ok ? await res.json() : null;
  } catch (error) {
    console.error("Error updating lyrics:", error);
    return null;
  }
};
export const deleteLyrics = async () => {};

export const getLyricsCount = async () => {};
