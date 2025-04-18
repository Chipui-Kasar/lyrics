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
lyricsSchema.index({ title: "text", lyrics: "text" });
lyricsSchema.index({ view: -1 });
const Lyrics = mongoose.models.Lyrics || mongoose.model("Lyrics", lyricsSchema);

export { Artist, Lyrics };
