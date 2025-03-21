"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

const ContributeLyrics = () => {
  const [contributorName, setContributorName] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [artistsName, setArtistsName] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [submitStatus, setSubmitStatus] = useState("");

  const submitLyrics = async () => {
    setSubmitStatus("");
    if (!songTitle || !artistsName || !lyrics) {
      setSubmitStatus("Please fill all the required fields");
      return;
    }

    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: "myGmail",
        template_id: "template_8oepnwl",
        user_id: "user_Mc5QI37PU2F55mUGiqmuO",
        template_params: {
          from_name: contributorName,
          song_title: songTitle,
          song_artist: artistsName,
          message: lyrics,
        },
      }),
    }).then((res) => {
      if (res.ok) {
        setSubmitStatus("success");
        clearForm();
      } else {
        setSubmitStatus("error");
      }
    });
  };
  const clearForm = () => {
    setContributorName("");
    setSongTitle("");
    setArtistsName("");
    setLyrics("");
  };

  return (
    <section className="container py-4 sm:py-8 md:py-10 m-auto ">
      <div className="rounded-lg bg-muted p-6 shadow-lg bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
        <h2 className="text-2xl font-bold">Share Lyrics</h2>
        <p className="mt-2 text-muted-foreground">
          Share your favorite song lyrics with the community.
        </p>
        <div className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="contributorName">Your name</Label>
            <Input
              id="contributorName"
              placeholder="Enter your name"
              value={contributorName}
              onChange={(e) => setContributorName(e.target.value)}
            />
          </div>
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
          <div className="grid gap-2">
            <Label htmlFor="artist">Artist</Label>
            <Input
              id="artist"
              placeholder="Enter the artist name"
              value={artistsName}
              className={`border ${
                submitStatus === "Please fill all the required fields"
                  ? "border-[hsl(var(--border-error))]"
                  : ""
              }`}
              required
              onChange={(e) => setArtistsName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lyrics">Lyrics</Label>
            {/* <RichTextEditor onChange={(e) => setLyrics(e)} /> */}
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
          <p className="text-sm text-[hsl(var(--border-error))]">
            {submitStatus}
          </p>
          <div className="flex justify-end">
            <Button onSubmit={submitLyrics} onClick={submitLyrics}>
              Submit
            </Button>
          </div>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: lyrics.replace(/\n/g, "<br/>") }}
        ></div>
      </div>
    </section>
  );
};

export default ContributeLyrics;
