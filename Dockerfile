# syntax=docker/dockerfile:1

# Debian throughout: sharp runs at build time and, for next/image, at runtime,
# so both stages need the same libc.
FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm" \
    PATH="/pnpm:$PATH" \
    NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# --- dependencies -----------------------------------------------------------
FROM base AS deps
RUN npm install --global pnpm@10.34.9
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# --- build ------------------------------------------------------------------
FROM deps AS build
COPY . .
# No secrets needed here: EMAIL_* are read per request, not at build time.
RUN pnpm build

# --- runtime ----------------------------------------------------------------
FROM base AS runtime
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=4321

COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public

EXPOSE 4321

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:4321/api/contact').then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"]

USER node
CMD ["node", "server.js"]
