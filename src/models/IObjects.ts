export interface IArtists {
  name: string;
  genre: string[];
  socialLinks: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
  village: string;
  image: string;
  _id: string;
  songCount?: number;
  bio?: string;
  updatedAt?: Date | string;
}

export interface ILyrics {
  title: string;
  artistId: IArtists;
  album: string;
  releaseYear: number;
  lyrics: string;
  streamingLinks?: {
    spotify: string;
    youtube: string;
  };
  thumbnail: string;
  _id: string;
  contributedBy: string;
  featured?: boolean; // ✅ Add this line
  createdAt?: Date;
  updatedAt?: Date | string;
  view?: number; // ✅ Add this line
}
