import { IArtists, ILyrics } from "@/models/IObjects";

export interface LyricsPagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface LyricsPageResponse {
  items: ILyrics[];
  pagination: LyricsPagination;
}

export const getLyrics = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/lyrics?sort=title`,
      {
        next: {
          revalidate: 300,
          tags: ["lyrics-all"],
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    return [];
  }
};

export const getLyricsPage = async ({
  page = 1,
  limit = 60,
  sort = "title",
  order = "asc",
  fields = "summary",
}: {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  fields?: "summary" | "full";
} = {}): Promise<LyricsPageResponse> => {
  try {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (sort) params.set("sort", sort);
    if (order) params.set("order", order);
    if (fields) params.set("fields", fields);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/lyrics?${params.toString()}`,
      {
        next: {
          revalidate: 300,
          tags: ["lyrics-all"],
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = (await res.json()) as LyricsPageResponse;
    if (!data?.items || !data.pagination) {
      throw new Error("Invalid paginated lyrics response");
    }

    return data;
  } catch (error) {
    console.error("Error fetching paginated lyrics:", error);
    return {
      items: [],
      pagination: {
        page,
        limit,
        totalCount: 0,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
};
export const getSingleLyrics = async (
  id: string,
  title: string,
  artist: string,
) => {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/lyrics/author/singleLyrics?id=${id}&title=${encodeURIComponent(
        title,
      )}&artist=${encodeURIComponent(artist)}`,
      {
        next: {
          revalidate: 3600,
          tags: [`lyrics-${id}`],
        },
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching single lyrics:", error);
    return null;
  }
};
export const getFeaturedLyrics = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/lyrics?limit=2&sort=createdAt&featured=true`,
      {
        next: {
          revalidate: 3600,
          tags: ["lyrics-featured"],
        },
      },
    );
    return res.ok ? await res.json() : [];
  } catch (error) {
    console.error("Error fetching featured lyrics:", error);
    return [];
  }
};
export const getTopLyrics = async (limit?: number) => {
  const query = `?sort=createdAt${limit ? `&limit=${limit}` : ""}`;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/lyrics${query}`,
      {
        next: {
          revalidate: 3600,
          tags: ["lyrics-top"],
        },
      },
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
      next: {
        revalidate: 3600,
        tags: ["artists-all"],
      },
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
      next: {
        revalidate: 3600,
        tags: ["artists-all"],
      },
    });

    if (!res.ok) return [];

    const artists = await res.json();
    if (artists.length === 0) return [];

    // Fetch song counts
    const artistIds = artists.map((artist: IArtists) => artist._id).join(",");
    const countRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/artist/lyricscount?artistIds=${artistIds}`,
      {
        next: { revalidate: 3600 },
      },
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
    const artistSlug = artistName.toLowerCase().replace(/\s+/g, "-");
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/lyrics/author/lyrics?artistName=${artistName}`,
      {
        next: {
          revalidate: 3600,
          tags: [`artist-${artistSlug}`],
        },
      },
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
        next: {
          revalidate: 3600,
          tags: ["search"],
        },
      },
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
  method?: string,
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
      },
    );
    return res.ok ? await res.json() : null;
  } catch (error) {
    console.error("Error deleting artist:", error);
    return error;
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
export const deleteLyrics = async (id: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/lyrics?id=${id}`,
      {
        method: "DELETE",
        credentials: "include", // only if you're using sessions/cookies
      },
    );
    return res.ok ? await res.json() : null;
  } catch (error) {
    console.error("Error deleting artist:", error);
    throw new Error("Failed to delete lyrics");
  }
};

export const getLyricsCount = async () => {};
