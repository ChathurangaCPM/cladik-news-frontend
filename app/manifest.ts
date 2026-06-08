import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NeuralPress AI News API",
    short_name: "NeuralPress",
    description: "Structured AI News API for Developers. Query global news conceptually using semantic vector search.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafbfe",
    theme_color: "#2b86ff",
    icons: [
      {
        src: "/main-logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/main-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
