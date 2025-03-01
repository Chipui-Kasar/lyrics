import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const AddArtists = () => {
  return (
    <section className="container m-auto ">
      <div className="rounded-lg bg-muted p-6 shadow-lg bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
        <h2 className="text-2xl font-bold">Add new artist</h2>
        <p className="mt-2 text-muted-foreground">
          Please fill out the form below to add a new artist.
        </p>
        <div className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter the artist name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="genre">Genre</Label>
            <Input id="genre" placeholder="Enter the artist genre" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="socialLinks">Social Links</Label>
            <Input
              id="socialLinks.facebook"
              placeholder="Facebook"
              className="mb-2"
            />
            <Input
              id="socialLinks.instagram"
              placeholder="Instagram"
              className="mb-2"
            />
            <Input
              id="socialLinks.youtube"
              placeholder="YouTube"
              className="mb-2"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="village">Village</Label>
            <Input id="village" placeholder="Enter the artist village name" />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddArtists;
