import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IArtists } from "@/models/IObjects";
import { createLyrics } from "@/service/allartists";
import React, { useState } from "react";

const AddNewLyrics = ({ artists }: { artists: IArtists[] }) => {
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
  });

  // ✅ Handle text inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "releaseYear" ? Number(value) || 0 : value, // ✅ Convert to number
    }));
  };

  // ✅ Handle streaming links separately
  const handleStreamingLinksChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      streamingLinks: { ...prev.streamingLinks, [name]: value },
    }));
  };

  // ✅ Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Ensure artistId is valid
    if (!formData.artistId || formData.artistId.trim() === "") {
      alert("Please select an artist.");
      return;
    }

    // Ensure releaseYear is a valid number
    if (isNaN(formData.releaseYear) || formData.releaseYear <= 0) {
      alert("Please enter a valid release year.");
      return;
    }

    // Format the data properly
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
        setFormData({
          title: "",
          artistId: "",
          album: "",
          releaseYear: new Date().getFullYear(),
          streamingLinks: { youtube: "", spotify: "" },
          lyrics: "",
          thumbnail: "",
          contributedBy: "",
        });
      } else {
        alert("Failed to add lyrics.");
      }
    } catch (error) {
      console.error("Error submitting lyrics:", error);
      alert("An error occurred while submitting the lyrics.");
    }
  };

  const generateDropdownOptions = (artists: IArtists[]) => {
    return artists.map((artist) => ({
      value: artist._id,
      label: artist.name,
    }));
  };

  return (
    <section className="container m-auto">
      <div className="rounded-lg bg-muted p-6 shadow-lg bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
        <h2 className="text-2xl font-bold">Add new lyrics</h2>
        <p className="mt-2 text-muted-foreground">
          Please fill out the form below to add a new lyrics.
        </p>

        {/* ✅ Use form tag with onSubmit */}
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="title">Song Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter the song title"
              value={formData.title}
              onChange={handleChange}
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

          {/* ✅ Streaming Links */}
          <div className="grid gap-2">
            <Label>Streaming Links</Label>
            <Input
              id="youtube"
              name="youtube"
              placeholder="YouTube"
              value={formData.streamingLinks.youtube}
              onChange={handleStreamingLinksChange}
              className="mb-2"
            />
            <Input
              id="spotify"
              name="spotify"
              placeholder="Spotify"
              value={formData.streamingLinks.spotify}
              onChange={handleStreamingLinksChange}
              className="mb-2"
            />
          </div>
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

          {/* ✅ Lyrics Textarea */}
          <div className="grid gap-2">
            <Label htmlFor="lyrics">Lyrics</Label>
            <Textarea
              id="lyrics"
              name="lyrics"
              placeholder="Enter the song lyrics"
              rows={6}
              value={formData.lyrics}
              onChange={handleChange}
            />
          </div>

          {/* ✅ Submit button inside form */}
          <div className="flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddNewLyrics;
