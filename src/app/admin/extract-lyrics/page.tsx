"use client";

import { useState, useEffect } from "react";
import AdminNavigation from "@/components/component/Admin/Navigation/AdminNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dropdown } from "@/components/ui/dropdown";
import { RichTextEditor } from "@/components/ui/richTextEditor";
import ImageUpload from "@/components/component/Admin/ImageUpload/ImageUpload";
import { Loader2, ExternalLink, Info } from "lucide-react";
import { getAllArtists } from "@/service/allartists";
import { createLyrics } from "@/service/allartists";
import { IArtists } from "@/models/IObjects";
import { sanitizeAndDeduplicateHTML } from "@/lib/utils";

interface ExtractedData {
  title: string;
  artist: string;
  lyrics: string;
}

export default function ExtractLyricsPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );
  const [error, setError] = useState("");
  const [artists, setArtists] = useState<IArtists[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    artistId: "",
    album: "",
    releaseYear: new Date().getFullYear(),
    streamingLinks: {
      youtube: "",
      spotify: "",
    },
    contributedBy: "",
    thumbnail: "",
    lyrics: "",
    featured: false,
  });

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const artistsData = await getAllArtists();
        setArtists(artistsData);
      } catch (error) {
        console.error("Failed to fetch artists:", error);
      }
    };
    fetchArtists();
  }, []);

  const handleExtract = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setLoading(true);
    setError("");
    setExtractedData(null);

    try {
      const response = await fetch("/api/admin/extract-lyrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to extract lyrics");
      }

      setExtractedData(data);

      // Pre-fill form with extracted data
      setFormData((prev) => ({
        ...prev,
        title: data.title,
        lyrics: data.lyrics,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "releaseYear" ? Number(value) || 0 : value,
    }));
  };

  const handleStreamingLinksChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      streamingLinks: { ...prev.streamingLinks, [name]: value },
    }));
  };

  const handleThumbnailChange = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: imageUrl,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.artistId || formData.artistId.trim() === "") {
      alert("Please select an artist.");
      return;
    }

    if (isNaN(formData.releaseYear) || formData.releaseYear <= 0) {
      alert("Please enter a valid release year.");
      return;
    }

    setSubmitting(true);

    const formattedData = {
      ...formData,
      streamingLinks: {
        youtube: formData.streamingLinks.youtube || "",
        spotify: formData.streamingLinks.spotify || "",
      },
    };

    try {
      const response = await createLyrics(formattedData);
      if (response) {
        alert("Lyrics added successfully!");
        // Reset form
        setFormData({
          title: "",
          artistId: "",
          album: "",
          releaseYear: new Date().getFullYear(),
          streamingLinks: { youtube: "", spotify: "" },
          lyrics: "",
          thumbnail: "",
          contributedBy: "",
          featured: false,
        });
        setExtractedData(null);
        setUrl("");
      } else {
        alert("Failed to add lyrics.");
      }
    } catch (error) {
      console.error("Error submitting lyrics:", error);
      alert("An error occurred while submitting the lyrics.");
    } finally {
      setSubmitting(false);
    }
  };

  const generateDropdownOptions = (artists: IArtists[]) => {
    return artists.map((artist) => ({
      value: artist._id,
      label: artist.name,
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminNavigation />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Extract & Add Lyrics</h1>

          {/* URL Extraction Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Step 1: Extract from URL
            </h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://example.com/song-lyrics"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleExtract()}
                  className="flex-1"
                />
                <Button
                  onClick={handleExtract}
                  disabled={loading || !url.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    "Extract"
                  )}
                </Button>
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
                  {error}
                </div>
              )}

              {extractedData && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-blue-900">
                        Extracted Artist: {extractedData.artist}
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        Title and lyrics have been auto-filled below. Please
                        select the matching artist and complete the form.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lyrics Form Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Step 2: Complete & Submit Lyrics
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="title">Song Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter the song title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="artistId">Select Artist</Label>
                <Input
                  id="artistId"
                  name="artistId"
                  placeholder="Enter the artist name"
                  value={formData.artistId}
                  onChange={handleChange}
                  disabled
                />
                <Dropdown
                  options={generateDropdownOptions(artists)}
                  value={formData.artistId}
                  onChange={(e) =>
                    setFormData({ ...formData, artistId: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="album">Album</Label>
                <Input
                  id="album"
                  name="album"
                  placeholder="Enter the album name"
                  value={formData.album}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="releaseYear">Release Year</Label>
                <Input
                  id="releaseYear"
                  name="releaseYear"
                  type="number"
                  placeholder="Enter the song release year"
                  value={Number(formData.releaseYear)}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label>Streaming Links</Label>
                <Input
                  id="youtube"
                  name="youtube"
                  placeholder="YouTube URL"
                  value={formData.streamingLinks.youtube}
                  onChange={handleStreamingLinksChange}
                  className="mb-2"
                />
                <Input
                  id="spotify"
                  name="spotify"
                  placeholder="Spotify URL"
                  value={formData.streamingLinks.spotify}
                  onChange={handleStreamingLinksChange}
                />
              </div>

              <ImageUpload
                currentImageUrl={formData.thumbnail}
                onImageUploaded={handleThumbnailChange}
                label="Song Thumbnail"
                placeholder="Enter the song thumbnail URL"
              />

              <div className="grid gap-2">
                <Label htmlFor="contributedBy">Contributed By</Label>
                <Input
                  id="contributedBy"
                  name="contributedBy"
                  type="text"
                  placeholder="Contributed By"
                  value={formData.contributedBy}
                  onChange={handleChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="lyrics">Lyrics</Label>
                <RichTextEditor
                  name="lyrics"
                  defaultValue={formData.lyrics}
                  onChange={({ target }) =>
                    handleChange({
                      target: {
                        name: "lyrics",
                        value: sanitizeAndDeduplicateHTML(target.value),
                      },
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="featured">Featured Lyrics?</Label>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, featured: !formData.featured })
                  }
                  className={`px-4 py-2 rounded ${
                    formData.featured
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {formData.featured ? "Yes" : "No"}
                </button>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={submitting} className="flex-1">
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Add Lyrics"
                  )}
                </Button>
                {url && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.open(url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Source
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
