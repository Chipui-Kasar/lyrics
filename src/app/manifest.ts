import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tangkhul Lyrics - Discover Tangkhul Music",
    short_name: "Tangkhul Lyrics",
    description:
      "Discover the largest collection of Tangkhul song lyrics online. Find trending hits, traditional favorites, and new releases.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#667eea",
    orientation: "portrait-primary",
    categories: ["music", "entertainment", "education"],
    lang: "en",
    dir: "ltr",
    icons: [
      {
        src: "/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/apple-touch-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Browse Lyrics",
        short_name: "Lyrics",
        description: "Browse all Tangkhul song lyrics",
        url: "/lyrics",
        icons: [{ src: "/icon-192.svg", sizes: "192x192" }],
      },
      {
        name: "All Artists",
        short_name: "Artists",
        description: "View all Tangkhul artists",
        url: "/allartists",
        icons: [{ src: "/icon-192.svg", sizes: "192x192" }],
      },
      {
        name: "Search",
        short_name: "Search",
        description: "Search for songs and artists",
        url: "/search",
        icons: [{ src: "/icon-192.svg", sizes: "192x192" }],
      },
      {
        name: "Contribute",
        short_name: "Contribute",
        description: "Contribute new lyrics",
        url: "/contribute",
        icons: [{ src: "/icon-192.svg", sizes: "192x192" }],
      },
    ],
    screenshots: [
      {
        src: "/ogImage.jpg",
        sizes: "1200x630",
        type: "image/jpeg",
        form_factor: "wide",
        label: "Tangkhul Lyrics Homepage",
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
