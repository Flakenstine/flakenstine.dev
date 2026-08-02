// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://flakenstine.dev",
  output: "static",
  adapter: vercel(),
  integrations: [react(), mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: "night-owl",
      wrap: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
