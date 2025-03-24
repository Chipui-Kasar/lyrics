import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createArtist } from "@/service/allartists";
import React, { useState } from "react";

const AddArtists = () => {
  const [formData, setFormData] = useState({
    name: "",
    genre: [],
    socialLinks: { facebook: "", instagram: "", youtube: "" },
    image: "",
    village: "",
  });
  // ✅ Handle text inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "genre" ? value.split(",").map((item) => item.trim()) : value,
    }));
  };

  const handleSocialLinksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Ensure artistId is valid
    if (!formData.name) {
      alert("Please add artist name.");
      return;
    }

    // Format the data properly
    const formattedData = {
      ...formData,
      socialLinks: {
        facebook: formData.socialLinks.facebook || "",
        youtube: formData.socialLinks.youtube || "",
        instagram: formData.socialLinks.instagram || "",
      },
    };

    try {
      const response = await createArtist(formattedData);
      if (response) {
        alert("Artist added successfully!");
        setFormData({
          name: "",
          genre: [],
          socialLinks: { facebook: "", instagram: "", youtube: "" },
          image: "",
          village: "",
        });
      } else {
        alert("Failed to add artist.");
      }
    } catch (error) {
      console.error("Error submitting artist:", error);
      alert("An error occurred while submitting the artist.");
    }
  };
  return (
    <section className="container m-auto ">
      <div className="rounded-lg bg-muted p-6 shadow-lg bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
        <h2 className="text-2xl font-bold">Add new artist</h2>
        <p className="mt-2 text-muted-foreground">
          Please fill out the form below to add a new artist.
        </p>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter the artist name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="genre">Genre</Label>
            <Input
              id="genre"
              name="genre"
              placeholder="Enter the artist genre"
              value={formData.genre}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="socialLinks">Social Links</Label>
            <Input
              id="facebook"
              name="facebook"
              placeholder="Facebook"
              className="mb-2"
              value={formData.socialLinks.facebook}
              onChange={handleSocialLinksChange}
            />
            <Input
              id="instagram"
              name="instagram"
              placeholder="Instagram"
              className="mb-2"
              value={formData.socialLinks.instagram}
              onChange={handleSocialLinksChange}
            />
            <Input
              id="youtube"
              name="youtube"
              placeholder="YouTube"
              className="mb-2"
              value={formData.socialLinks.youtube}
              onChange={handleSocialLinksChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="village">Village</Label>
            <Input
              id="village"
              name="village"
              placeholder="Enter the artist village name"
              value={formData.village}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddArtists;
