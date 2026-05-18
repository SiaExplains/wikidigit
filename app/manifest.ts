import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WikiDigit",
    short_name: "WikiDigit",
    description:
      "Sharp, independent coverage of AI, startups, developer tools, and everything shaping the digital world.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFF9EC",
    theme_color: "#1D402D",
    icons: [
      { src: "/favicon-16x16.png",  sizes: "16x16",   type: "image/png" },
      { src: "/favicon-32x32.png",  sizes: "32x32",   type: "image/png" },
      { src: "/favicon-96x96.png",  sizes: "96x96",   type: "image/png" },
      { src: "/icon-192.png",       sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png",       sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  };
}
