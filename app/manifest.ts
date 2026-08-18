import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AfriLingo — Apprends les langues africaines",
    short_name: "AfriLingo",
    description:
      "Micro-leçons interactives pour apprendre le N'Ko et d'autres langues africaines, hors-ligne.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a12",
    theme_color: "#0b0b14",
    orientation: "portrait",
    lang: "fr",
    dir: "ltr",
    categories: ["education", "productivity"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}