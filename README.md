# flakenstine.dev

My personal site and blog, built with [Astro](https://astro.build).

## Stack

- **[Astro 7](https://astro.build)** — prerendered output, with React islands for the interactive bits
- **[Tailwind CSS v4](https://tailwindcss.com)** + **[shadcn/ui](https://ui.shadcn.com)**
- **MDX content collections** for blog posts, with Shiki syntax highlighting
- **[Dokploy](https://dokploy.com)** for hosting, from the `Dockerfile` in this repo

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
credentials set in Dokploy (and in `.env` locally):

```
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=
EMAIL_PASSWORD=
```

These are read at *runtime* via the `astro:env` schema in `astro.config.mjs`,
not inlined at build time — so the image contains no secrets and the same
image works across environments.

Everything else is prerendered to static files; `/api/contact` is the only
route that runs on the server.

The contact endpoint allows five requests per client per ten-minute window and
includes a hidden honeypot field for basic bot protection. The limiter is
process-local and best-effort for this single-container deployment; add an
edge or shared-store limit if you scale to multiple replicas.

## Deploying

Dokploy builds the `Dockerfile` in this repo. Two things to set in the UI:

- **Port** — the container listens on **4321** (`HOST=0.0.0.0` is set in the image).
- **Environment** — the five `EMAIL_*` variables above.

The image is multi-stage: it builds on Debian (sharp needs glibc for image
optimization) and ships a small Alpine runtime containing only `dist/` and
the three packages the server actually imports, running as the non-root
`node` user, with a healthcheck on the contact route that verifies the required
runtime environment without sending an email.

To run it locally the way Dokploy will:

```bash
docker build -t flakenstine-dev .
docker run --rm -p 4321:4321 --env-file .env flakenstine-dev
```

When building from an ARM64 development machine for the AMD64 deployment host,
use `docker build --platform linux/amd64 -t flakenstine-dev .`.

### A note on dependencies

Only `clsx`, `nodemailer`, and `zod` are in `dependencies` — those are the sole
bare imports in the built server. Everything else (Astro, React, Tailwind,
sharp, …) is a `devDependency` because it is only needed to produce `dist/`.
That keeps the runtime image small. If you add a route that imports a new
package at runtime, move it into `dependencies` or the container will fail to
start.
