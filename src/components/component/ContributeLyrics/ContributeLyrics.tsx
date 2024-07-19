import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const ContributeLyrics = () => {
  return (
    <section className="container py-4 sm:py-8 md:py-10 m-auto ">
      <div className="rounded-lg bg-muted p-6 shadow-lg bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
        <h2 className="text-2xl font-bold">Share Lyrics</h2>
        <p className="mt-2 text-muted-foreground">
          Share your favorite song lyrics with the community.
        </p>
        <div className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Enter the song title" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="artist">Artist</Label>
            <Input id="artist" placeholder="Enter the artist name" />
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

export default ContributeLyrics;
