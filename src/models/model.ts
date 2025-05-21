import mongoose, { Schema } from "mongoose";

const artistSchema = new Schema(
  {
    name: { type: String, required: true },
    genre: { type: [String], default: [] },
    socialLinks: { type: Object, default: {} },
    image: String,
    village: String,
  },
  {
    timestamps: true,
  }
);
artistSchema.index({ name: "text" });
artistSchema.index({ genre: 1 }); // For genre-based queries
artistSchema.index({ village: 1 }); // For village-based queries

const Artist = mongoose.models.Artist || mongoose.model("Artist", artistSchema);

const lyricsSchema = new Schema(
  {
    title: { type: String, required: true },
    artistId: { type: Schema.Types.ObjectId, ref: "Artist", required: true }, // Ensures artist reference
    album: String,
    releaseYear: Number,
    lyrics: { type: String, required: true },
    streamingLinks: { type: Object, default: {} },
    thumbnail: String,
    contributedBy: String,
    view: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);
lyricsSchema.index({ title: "text", lyrics: "text" }); // For full-text search
lyricsSchema.index({ view: -1 }); // For trending lyrics
lyricsSchema.index({ artistId: 1 }); // For artist-specific queries
lyricsSchema.index({ title: 1, artistId: 1 }); // For slug-based URL matching
lyricsSchema.index({ album: 1 }); // For album-based queries

const Lyrics = mongoose.models.Lyrics || mongoose.model("Lyrics", lyricsSchema);

export { Artist, Lyrics };
