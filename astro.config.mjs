// @ts-check
import { defineConfig, envField } from "astro/config";
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
  // Read at runtime by the contact endpoint. Using import.meta.env here would
  // inline the values at build time, which bakes in `undefined` on Vercel.
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
