import mongoose, { Schema } from "mongoose";

const contributedLyricsSchema = new Schema(
  {
    title: { type: String, required: true },
    artistId: { type: Schema.Types.ObjectId, ref: "Artist", required: true },
    album: String,
    releaseYear: Number,
    lyrics: { type: String, required: true },
    streamingLinks: { type: Object, default: {} },
    thumbnail: String,
    contributedBy: String,
    submittedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "published", "rejected"],
      default: "pending",
    },
    rejectionReason: String,
    // Set once an admin approves this contribution, pointing at the
    // resulting live document in the Lyrics collection.
    publishedLyricsId: { type: Schema.Types.ObjectId, ref: "Lyrics" },
  },
  {
    timestamps: true,
    collection: "contributed_lyrics",
  }
);

export const ContributedLyrics =
  mongoose.models.ContributedLyrics ||
  mongoose.model("ContributedLyrics", contributedLyricsSchema);
