# flakenstine.dev

My personal site and blog, built with [Next.js](https://nextjs.org).

## Stack

- **[Next.js 16](https://nextjs.org)**, fully prerendered apart from the contact endpoint
- **[Tailwind CSS v4](https://tailwindcss.com)** for styling
- **[ui-sdk](https://ui-sdk.dev)** for the UI: dialogs, the command palette, hover cards, fields, toasts, and a primitive of my own
- **[Velite](https://velite.js.org)** for MDX posts, with Shiki syntax highlighting
- **WebGL2** for the head, with no library
- **[Dokploy](https://dokploy.com)** for hosting, from the `Dockerfile` in this repo

## Development

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
pnpm start      # serve the production build
pnpm check      # types and lint
```

## Where things are

| What | Where |
| --- | --- |
| The head: sampling, shaders, shock and charge | `src/lib/glyphs/` and `src/components/glyph-stage.tsx` |
| The dividers you can pluck | `src/components/strand.tsx` |
| The tool pad, on a custom ui-sdk primitive | `src/components/tool-pad.tsx` and `src/components/keypad/` |
| Live Discord presence, over Lanyard's socket | `src/lib/presence.ts` |
| Command palette (⌘K) | `src/components/site-command.tsx` |
| Phosphor colors and the sound switch | `src/lib/preferences.ts`, `src/lib/sound.ts` |
| Tools and social links | `src/data/brands.ts` |

Every color comes from `--phosphor` in `src/app/globals.css`.

## Writing a post

Drop an `.mdx` file into `content/posts/`, with its images beside it. Frontmatter
is validated by the schema in `velite.config.ts`: a mistake fails `pnpm build`,
and prints a warning and skips the post in `pnpm dev`.

```mdx
---
title: "A new post"
slug: a-new-post # the URL, /blog/a-new-post
date: 2026-01-30
description: "Shows up on the blog index, in RSS, and on social cards."
cover: ./a-new-post-cover.png # optional
tags: [linux, personal] # optional, each becomes /blog/tags/<tag>
---

Regular markdown, with images like ![A description](./picture.png).
```

Velite copies images to `public/static/` and writes typed data to `.velite/`. Both
are generated, so neither is committed. Images are measured at build time and
served responsive, with a blurred preview.

## Environment

The contact form posts to `src/app/api/contact/route.ts`, which needs SMTP
credentials set in Dokploy (and in `.env` locally). See `.env.example`.

They are read per request, so the image contains no secrets and works across
environments. The endpoint allows five requests per client per ten minutes, and
has a hidden honeypot field. The limiter is process-local: add a shared store if
you run more than one replica.

## Deploying

Dokploy builds the `Dockerfile`. Two things to set in the UI:

- **Port**: the container listens on **4321**.
- **Environment**: the five `EMAIL_*` variables. The health check fails without them.

```bash
docker build -t flakenstine-dev .
docker run --rm -p 4321:4321 --env-file .env flakenstine-dev
```

From an ARM64 machine, add `--platform linux/amd64` for an AMD64 host.
