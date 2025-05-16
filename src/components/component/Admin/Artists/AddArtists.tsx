import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IArtists } from "@/models/IObjects";
import {
  createArtist,
  // deleteArtist,
  getAllArtists,
  updateArtist,
} from "@/service/allartists";
import React, { useEffect, useState } from "react";

const AddArtists = () => {
  const [formData, setFormData] = useState<{
    name: string;
    genre: string[];
    socialLinks: { facebook: string; instagram: string; youtube: string };
    image: string;
    village: string;
    _id?: string;
  }>({
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
      const response = formattedData._id
        ? await updateArtist({ ...formattedData, _id: formattedData._id || "" })
        : await createArtist(formattedData);
      if (response) {
        alert(`${formattedData._id ? "Updated" : "Added"} successfully!`);
        setFormData({
          name: "",
          genre: [],
          socialLinks: { facebook: "", instagram: "", youtube: "" },
          image: "",
          village: "",
        });
        loadArtists();
      } else {
        alert("Failed to add artist.");
      }
    } catch (error) {
      console.error("Error submitting artist:", error);
      alert("An error occurred while submitting the artist.");
    }
  };

  const [artists, setArtists] = useState([]);

  useEffect(() => {
    loadArtists();
  }, []);
  const loadArtists = async () => {
    const data = await getAllArtists();
    setArtists(data);
  };

  const handleEdit = (artist: IArtists) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setFormData(artist);
  };
  // const handleDelete = async (artistId: string) => {
  //   try {
  //     await deleteArtist(artistId);
  //     loadArtists();
  //     alert("Artist deleted successfully!");
  //   } catch (error) {
  //     console.error("Error deleting artist:", error);
  //   }
  // };

  return (
    <section className="container">
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

      <h1 className="text-xl font-bold mb-4 mt-4">Artists List</h1>
      <table className="rounded-lg bg-muted p-6 shadow-lg bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Genre</th>
            <th className="border p-2">Village</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {artists.map((artist: IArtists) => (
            <tr key={artist._id} className="border-b">
              <td className="border p-2">{artist._id}</td>
              <td className="border p-2">{artist.name}</td>
              <td className="border p-2">{artist.genre.join(", ")}</td>
              <td className="border p-2">{artist.village}</td>
              <td className="border p-2">
                <Button onClick={() => handleEdit(artist)}>Edit</Button>
                {/* <Button onClick={() => handleDelete(artist._id)}>Delete</Button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default AddArtists;
