// @ts-check
import { defineConfig, envField } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";

export default defineConfig({
  site: "https://flakenstine.dev",
  output: "static",
  // Standalone: the built server runs itself, so the container needs no
  // extra process manager. Everything is prerendered except /api/contact.
  adapter: node({ mode: "standalone" }),
  integrations: [react(), mdx(), sitemap()],
  // Read at runtime by the contact endpoint. Using import.meta.env here would
  // inline the values at build time, baking in whatever the builder had.
  env: {
    schema: {
      EMAIL_HOST: envField.string({ context: "server", access: "secret" }),
      EMAIL_PORT: envField.number({ context: "server", access: "secret" }),
      EMAIL_SECURE: envField.boolean({
        context: "server",
        access: "secret",
        default: false,
      }),
      EMAIL_USER: envField.string({ context: "server", access: "secret" }),
      EMAIL_PASSWORD: envField.string({ context: "server", access: "secret" }),
    },
  },
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
