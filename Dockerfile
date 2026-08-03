# syntax=docker/dockerfile:1

# Build on Debian: sharp ships prebuilt glibc binaries, so image optimization
# works without compiling libvips from source.
FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm" \
    PATH="/pnpm:$PATH"
RUN corepack enable
WORKDIR /app

# --- dependencies -----------------------------------------------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# --- build ------------------------------------------------------------------
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# No secrets needed here: astro:env resolves EMAIL_* at runtime, not build time.
RUN pnpm build

# --- production dependencies ------------------------------------------------
# Only what dist/server actually imports: clsx, nodemailer, zod. All pure JS,
# so they copy cleanly onto the musl-based runtime image below.
FROM base AS prod-deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod --ignore-scripts

# --- runtime ----------------------------------------------------------------
FROM node:24-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

# The standalone server binds to HOST:PORT; 0.0.0.0 so Dokploy can reach it.
ENV HOST=0.0.0.0 \
    PORT=4321
EXPOSE 4321

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --spider -q http://127.0.0.1:4321/api/contact || exit 1

USER node
CMD ["node", "./dist/server/entry.mjs"]
