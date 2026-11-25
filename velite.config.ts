import rehypeShiki from "@shikijs/rehype";
import remarkGfm from "remark-gfm";
import { defineCollection, defineConfig, s } from "velite";

const posts = defineCollection({
  name: "Post",
  pattern: "posts/**/*.mdx",
  schema: s.object({
    title: s.string().max(120),
    slug: s.slug("posts"),
    date: s.isodate(),
    author: s.string().default("Flakenstine"),
    description: s.string().default(""),
    cover: s.image().optional(),
    tags: s.array(s.string()).default([]),
    metadata: s.metadata(),
    excerpt: s.excerpt({ length: 200 }),
    toc: s.toc(),
    body: s.mdx(),
  }),
});

export default defineConfig({
  root: "content",
  output: {
    data: ".velite",
    assets: "public/static",
    base: "/static/",
    clean: true,
  },
  collections: { posts },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypeShiki, { theme: "night-owl" }]],
  },
});
