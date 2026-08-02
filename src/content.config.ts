import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      author: z.string().default("Flakenstine"),
      description: z.string().default(""),
      image: image().optional(),
      tags: z.array(z.string()).default([]),
    }),
});

export const collections = { blog };
