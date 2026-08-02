# flakenstine.dev

My personal site and blog, built with [Astro](https://astro.build).

## Stack

- **[Astro 5](https://astro.build)** — static output, with React islands for the interactive bits
- **[Tailwind CSS v4](https://tailwindcss.com)** + **[shadcn/ui](https://ui.shadcn.com)**
- **MDX content collections** for blog posts, with Shiki syntax highlighting
- **[Vercel](https://vercel.com)** for hosting; Cloudflare for DNS

## Development

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # production build into dist/
pnpm preview    # serve the production build
pnpm check      # astro check (types + template diagnostics)
```

## Writing a post

Drop an `.mdx` file into `posts/`. The frontmatter is validated at build time by
the schema in `src/content.config.ts`, so a typo fails the build instead of the
page:

```mdx
---
title: "A new post"
date: 2026-01-30
description: "Shows up on the blog index, in RSS, and on social cards."
image: "../src/assets/blog/my-image.png" # optional, optimized at build
tags: [linux, personal] # optional, each becomes /blog/tags/<tag>
---

Regular markdown, plus any Astro/React component you import.
```

Images referenced with a relative path — in frontmatter or in the body — are
optimized and given responsive `srcset`s. Images in `public/` are served as-is.

## Environment

The contact form posts to `src/pages/api/contact.ts`, which needs SMTP
credentials set in Vercel (and in `.env` locally):

```
EMAIL_HOST=
EMAIL_PORT=
EMAIL_SECURE=
EMAIL_USER=
EMAIL_PASSWORD=
```

Everything else is statically rendered — the contact endpoint is the only
serverless function.

## Deploying

Pushing to `main` deploys via Vercel. `./deploy.sh -m "message"` builds first
and only commits and pushes if the build succeeds.
