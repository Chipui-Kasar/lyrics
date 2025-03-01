import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const AddNewLyrics = () => {
  return (
    <section className="container m-auto ">
      <div className="rounded-lg bg-muted p-6 shadow-lg bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
        <h2 className="text-2xl font-bold">Add new lyrics</h2>
        <p className="mt-2 text-muted-foreground">
          Please fill out the form below to add a new lyrics.
        </p>
        <div className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Song Title</Label>
            <Input id="title" placeholder="Enter the song title" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="selectArtist">Select Artist</Label>
            <Input id="selectArtist" placeholder="Enter the artist name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="album">Album</Label>
            <Input id="album" placeholder="Enter the album name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="releaseYear">Release Year</Label>
            <Input id="releaseYear" placeholder="Enter the song release year" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="streamingLinks">Streaming Links</Label>

            <Input
              id="streamingLinks.youtube"
              placeholder="YouTube"
              className="mb-2"
            />
            <Input
              id="streamingLinks.spotify"
              placeholder="Spotify"
              className="mb-2"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lyrics">Lyrics</Label>
            <Textarea
              id="lyrics"
              placeholder="Enter the song lyrics"
              rows={6}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddNewLyrics;
