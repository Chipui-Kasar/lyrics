import { Connection, Schema } from "mongoose";
import { registerModel } from "@/lib/mongodb";
import { getUserModel } from "@/models/User";

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

const lyricsSchema = new Schema(
  {
    title: { type: String, required: true },
    artistId: { type: Schema.Types.ObjectId, ref: "Artist", required: true }, // Ensures artist reference
    album: String,
    releaseYear: Number,
    lyrics: { type: String, required: true },
    streamingLinks: { type: Object, default: {} },
    thumbnail: String,
    view: { type: Number, default: 0 },
    featured: { type: Boolean, default: false }, // For featured lyrics
    status: {
      type: String,
      enum: ["draft", "published", "rejected"],
      default: "draft",
    },
    rejectionReason: String,
    submittedBy: { type: Schema.Types.ObjectId, ref: "User" },
    contributedBy: String, // For display name of contributor
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

// Each caller passes the connection it got from connectMongoDB(admin) so the
// model is bound to the right credential tier for that request — models are
// no longer bound to a single shared connection at import time.
export const getArtistModel = (conn: Connection) =>
  registerModel(conn, "Artist", artistSchema);

export const getLyricsModel = (conn: Connection) => {
  // Lyrics.artistId and Lyrics.submittedBy are populate() refs — make sure
  // both referenced models are registered on this same connection too, so
  // populate works regardless of whether the calling route touches them
  // directly (each mongoose Connection keeps its own model registry).
  getArtistModel(conn);
  getUserModel(conn);
  return registerModel(conn, "Lyrics", lyricsSchema);
};
