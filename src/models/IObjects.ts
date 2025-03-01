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
}

export interface ILyrics {
  title: string;
  artistId: string;
  album: string;
  releaseYear: number;
  lyrics: string;
  streamingLinks: {
    spotify: string;
    youtube: string;
  };
  thumbnail: string;
  _id: string;
}
