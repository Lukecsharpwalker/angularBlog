# Dockerfile for Angular SSR (web project) on Cloud Run
# Multi-stage: build Angular bundles, then run the SSR server.
# Cloud Run expects the app to listen on PORT env var (default 8080).

# ---------- Build stage ----------
FROM node:20-bullseye AS builder
WORKDIR /workspace

# Install deps with npm (project uses npm based on package-lock.json)
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build the web project with SSR support
RUN npx ng build web --configuration=production

# ---------- Runtime stage ----------
FROM node:20-bullseye-slim AS runtime
ENV NODE_ENV=production
WORKDIR /srv

# Copy built artifacts from the correct path
COPY --from=builder /workspace/dist/web /srv/dist/web

# Cloud Run provides PORT env. Angular SSR server must bind to this port.
ENV PORT=8080
EXPOSE 8080

# Run the SSR server
CMD ["node", "dist/web/server/server.mjs"]
