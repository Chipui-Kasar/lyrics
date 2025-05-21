import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/richTextEditor";
import { sanitizeAndDeduplicateHTML } from "@/lib/utils";
import { IArtists, ILyrics } from "@/models/IObjects";
import { createLyrics, getLyrics, updateLyrics } from "@/service/allartists";
import React, { useEffect, useState } from "react";
// import { ObjectId } from "mongodb";

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
    _id: "",
  });
  const [lyrics, setLyrics] = useState([]);
  const [expandedArtists, setExpandedArtists] = useState<
    Record<string, boolean>
  >({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchLyrics();
    return () => {};
  }, []);
  const fetchLyrics = async () => {
    const lyrics = await getLyrics();
    setLyrics(lyrics);
  };

  // ✅ Handle text inputs
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
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

    // Find the artist object for updateLyrics
    const selectedArtist = artists.find(
      (artist) => artist._id === formData.artistId
    );

    try {
      const response = formattedData._id
        ? await updateLyrics({
            ...formattedData,
            artistId: selectedArtist as IArtists, // Ensure artistId is IArtists
          })
        : await createLyrics(formattedData);
      if (response) {
        alert(
          `Lyrics ${formattedData._id ? "updated" : "added"} successfully!`
        );
        setFormData({
          title: "",
          artistId: "",
          album: "",
          releaseYear: new Date().getFullYear(),
          streamingLinks: { youtube: "", spotify: "" },
          lyrics: "",
          thumbnail: "",
          contributedBy: "",
          _id: "",
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
  const groupLyricsByArtist = (lyrics: ILyrics[]) => {
    return Object.entries(
      lyrics
        .filter(
          (lyric) =>
            lyric.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lyric.lyrics?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .reduce((acc, lyric) => {
          const artistName = lyric.artistId.name;
          if (!acc[artistName]) {
            acc[artistName] = [];
          }
          acc[artistName].push(lyric);
          return acc;
        }, {} as Record<string, ILyrics[]>)
    )
      .sort(([, a], [, b]) =>
        a[0].artistId.name.localeCompare(b[0].artistId.name)
      )
      .reduce((acc, [artistName, lyrics]) => {
        acc[artistName] = lyrics;
        return acc;
      }, {} as Record<string, ILyrics[]>);
  };
  const toggleArtist = (artist: string) => {
    setExpandedArtists((prev) => ({
      ...prev,
      [artist]: !prev[artist],
    }));
  };

  const handleEdit = (lyrics: ILyrics) => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    setFormData({
      title: lyrics.title,
      artistId: lyrics.artistId._id, // ✅ Fix here
      album: lyrics.album,
      releaseYear: lyrics.releaseYear,
      streamingLinks: {
        youtube: lyrics.streamingLinks.youtube,
        spotify: lyrics.streamingLinks.spotify,
      },
      contributedBy: lyrics.contributedBy,
      thumbnail: lyrics.thumbnail,
      lyrics: sanitizeAndDeduplicateHTML(lyrics.lyrics || ""),
      _id: lyrics._id,
    });
  };

  return (
    <section className="container">
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
              value={formData.title ?? ""}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="artistId">Select Artist</Label>
            <Input
              id="artistId"
              name="artistId"
              placeholder="Enter the artist name"
              value={formData.artistId ?? ""}
              onChange={handleChange}
              disabled
            />
            <Dropdown
              options={generateDropdownOptions(artists)}
              value={formData.artistId ?? ""}
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
              value={formData.album ?? ""}
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
              value={formData.streamingLinks.youtube ?? ""}
              onChange={handleStreamingLinksChange}
              className="mb-2"
            />
            <Input
              id="spotify"
              name="spotify"
              placeholder="Spotify"
              value={formData.streamingLinks.spotify ?? ""}
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
              value={formData.contributedBy ?? ""}
              onChange={handleChange}
            />
          </div>

          {/* ✅ Lyrics Textarea */}
          <div className="grid gap-2">
            <Label htmlFor="lyrics">Lyrics</Label>
            <RichTextEditor
              name="lyrics"
              defaultValue={formData.lyrics ?? ""}
              onChange={({ target }) =>
                handleChange({
                  target: { name: "lyrics", value: target.value },
                })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="_id">Song ID (Deleted Song ID)</Label>
            <Input
              id="_id"
              name="_id"
              placeholder="Enter the song ID"
              value={formData._id ?? ""}
              onChange={handleChange}
            />
          </div>

          {/* ✅ Submit button inside form */}
          <div className="flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
      <h1 className="text-xl font-bold mb-4 mt-4">Artists List</h1>
      <Input
        type="text"
        placeholder="Search"
        value={searchQuery}
        className="mb-4"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="rounded-lg bg-muted p-4 shadow-lg bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
        {Object.entries(groupLyricsByArtist(lyrics)).map(
          ([artist, artistLyrics]) => (
            <div key={artist} className="mb-4 border rounded">
              <div
                className="flex justify-between items-center bg-gray-300 p-2 cursor-pointer"
                onClick={() => toggleArtist(artist)}
              >
                <h2 className="text-lg font-semibold">
                  {artist}{" "}
                  <i className="text-sm">{artistLyrics.length} lyric(s)</i>
                </h2>

                <span>{expandedArtists[artist] ? "▲" : "▼"}</span>
              </div>
              {expandedArtists[artist] && (
                <table className="w-full table-auto mt-2 border-t">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">ID</th>
                      <th className="border p-2">Title</th>
                      <th className="border p-2">Contributed By</th>
                      <th className="border p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {artistLyrics.map((lyric) => (
                      <tr key={lyric._id} className="border-t">
                        <td className="border p-2">{lyric._id}</td>
                        <td className="border p-2">{lyric.title}</td>
                        <td className="border p-2">{lyric.contributedBy}</td>
                        <td className="border p-2">
                          <Button onClick={() => handleEdit(lyric)}>
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )
        )}
      </div>
    </section>
  );
};

export default AddNewLyrics;
