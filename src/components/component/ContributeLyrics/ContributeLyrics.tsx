"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PageLoader from "../Spinner/Spinner";
import Contact from "../Contact/Contact";

interface Artist {
  _id: string;
  name: string;
}

const ContributeLyrics = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [songTitle, setSongTitle] = useState("");
  const [artistsName, setArtistsName] = useState("");
  const [album, setAlbum] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [submitStatus, setSubmitStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch artists on component mount
  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch("/api/artist");
        if (response.ok) {
          const artistsData = await response.json();
          setArtists(artistsData);
        }
      } catch (error) {
        console.error("Error fetching artists:", error);
      }
    };

    session && fetchArtists();
  }, [session]);

  // Filter artists based on input
  useEffect(() => {
    if (artistsName.trim() === "") {
      setFilteredArtists([]);
      setShowDropdown(false);
    } else {
      const filtered = artists.filter((artist) =>
        artist.name.toLowerCase().includes(artistsName.toLowerCase()),
      );
      setFilteredArtists(filtered);
      setShowDropdown(filtered.length > 0);
    }
  }, [artistsName, artists]);

  const submitLyrics = async () => {
    setSubmitStatus("");

    if (!session) {
      setSubmitStatus("You must be logged in to contribute.");
      return;
    }

    // Validate session before submitting
    try {
      const sessionCheck = await fetch("/api/validate-session");
      if (!sessionCheck.ok) {
        setSubmitStatus("Your session has expired. Please sign in again.");
        setTimeout(() => {
          router.push("/auth/signin");
        }, 2000);
        return;
      }
    } catch (error) {
      setSubmitStatus(
        "Session validation failed. Please try signing in again.",
      );
      return;
    }

    if (!songTitle || !artistsName || !lyrics) {
      setSubmitStatus("Please fill all the required fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/lyrics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: songTitle,
          artistName: artistsName,
          album,
          releaseYear,
          lyrics,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setLoading(false);
        setSubmitStatus("success");
        clearForm();
      } else {
        setLoading(false);
        setSubmitStatus(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error submitting lyrics:", error);
      setLoading(false);
      setSubmitStatus("An error occurred while submitting lyrics.");
    }
  };

  const clearForm = () => {
    setSongTitle("");
    setArtistsName("");
    setAlbum("");
    setReleaseYear("");
    setLyrics("");
    setShowDropdown(false);
  };

  const handleArtistSelect = (artistName: string) => {
    setArtistsName(artistName);
    setShowDropdown(false);
  };

  return (
    <section className="container py-4 sm:py-8 md:py-10 m-auto ">
      <div className="rounded-lg bg-muted p-6 shadow-lg bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
        <h2 className="text-2xl font-bold">Share Lyrics</h2>
        <p className="mt-2 text-muted-foreground">
          Share your favorite song lyrics with the community.
        </p>

        {!session ? (
          <div className="mt-6 p-4 bg-yellow-100 text-yellow-800 rounded-md">
            You're not{" "}
            <a href="/auth/signin" className="font-bold underline">
              signed in
            </a>{" "}
            contribute via this form.
            <Contact />
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter the song title"
                value={songTitle}
                className={`border ${
                  submitStatus === "Please fill all the required fields"
                    ? "border-[hsl(var(--border-error))]"
                    : ""
                }`}
                required
                onChange={(e) => setSongTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2 relative">
              <Label htmlFor="artist">Artist</Label>
              <Input
                id="artist"
                placeholder="Enter or select the artist name"
                value={artistsName}
                className={`border ${
                  submitStatus === "Please fill all the required fields"
                    ? "border-[hsl(var(--border-error))]"
                    : ""
                }`}
                required
                onChange={(e) => setArtistsName(e.target.value)}
                onFocus={() => {
                  if (filteredArtists.length > 0) setShowDropdown(true);
                }}
              />

              {/* Artist Dropdown */}
              {showDropdown && filteredArtists.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-muted border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {filteredArtists.map((artist) => (
                    <button
                      key={artist._id}
                      type="button"
                      className="w-full text-left px-3 py-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      onClick={() => handleArtistSelect(artist.name)}
                    >
                      {artist.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="album">Album (Optional)</Label>
              <Input
                id="album"
                placeholder="Enter the album name"
                value={album}
                onChange={(e) => setAlbum(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="releaseYear">Release Year (Optional)</Label>
              <Input
                id="releaseYear"
                type="number"
                placeholder="Enter the release year"
                value={releaseYear}
                onChange={(e) => setReleaseYear(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lyrics">Lyrics</Label>
              <Textarea
                id="lyrics"
                placeholder="Enter the song lyrics"
                rows={8}
                required
                value={lyrics}
                className={`border ${
                  submitStatus === "Please fill all the required fields"
                    ? "border-[hsl(var(--border-error))]"
                    : ""
                }`}
                onChange={(e) => setLyrics(e.target.value)}
              />
            </div>

            {submitStatus && submitStatus !== "success" && (
              <p className="text-sm text-[hsl(var(--border-error))]">
                {submitStatus}
              </p>
            )}

            {submitStatus === "success" && (
              <p className="text-sm text-green-600">
                Lyrics submitted successfully for review!
              </p>
            )}

            <div className="flex justify-end">
              <Button onClick={submitLyrics} disabled={loading}>
                {loading ? "Submitting..." : "Submit for Review"}
              </Button>
            </div>
          </div>
        )}
      </div>
      {loading && <PageLoader isLoading={loading} />}
    </section>
  );
};

export default ContributeLyrics;
