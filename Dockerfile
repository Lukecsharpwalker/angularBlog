# Dockerfile for Angular SSR (blog-ssg) on Cloud Run
# Multi-stage: build Angular bundles, then run the SSR server.
# Cloud Run expects the app to listen on PORT env var (default 8080).

# ---------- Build stage ----------
FROM node:20-bullseye AS builder
WORKDIR /workspace

# Install deps with pnpm (recommended for speed). Fallback to npm if needed.
COPY package.json* pnpm-lock.yaml* package-lock.json* .npmrc* ./
RUN corepack enable && corepack prepare pnpm@latest --activate || true
RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile;         elif [ -f package-lock.json ]; then npm ci;         else pnpm install; fi

COPY . .

# Build browser, server (SSR). Prerender can be done in CI before building the image.
RUN npx ng build blog-ssg --configuration=production
RUN npx ng run blog-ssg:server:production
# Optional:
# RUN npx ng run blog-ssg:prerender --routes=apps/blog-ssg/routes.txt

# ---------- Runtime stage ----------
FROM node:20-bullseye-slim AS runtime
ENV NODE_ENV=production
WORKDIR /srv

# Copy built artifacts
COPY --from=builder /workspace/dist/apps/blog-ssg /srv/dist/apps/blog-ssg

# Cloud Run provides PORT env. Angular SSR server must bind to this port.
ENV PORT=8080
EXPOSE 8080

# Adjust path to the server entry if your project differs.
CMD ["node", "dist/apps/blog-ssg/server/server.mjs"]
