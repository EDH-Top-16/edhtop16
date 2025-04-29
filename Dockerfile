# Build the application.
FROM node:20-bullseye AS build

ARG ENTRIES_DB_URL
ARG NEXT_PUBLIC_POSTHOG_KEY
ENV NEXT_PUBLIC_POSTHOG_KEY=${NEXT_PUBLIC_POSTHOG_KEY}

WORKDIR /app

COPY . .
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN npm ci
RUN npm run build
RUN npm run generate:db -- --entries-db-url="${ENTRIES_DB_URL}"

# We take a minimal Unit image and install language-specific modules.
FROM unit:1.31.1-node20

WORKDIR /app
ENV NODE_ENV=production

# Install global unit-http library
RUN npm i -g unit-http@1.31

# Copy build output from build stage and install dependencies.
COPY --from=build /app/.next client/.next
COPY --from=build /app/data client/data/
COPY package*.json client/
COPY server.js client/
COPY next.config.js client/
COPY relay.config.js client/
COPY public client/public/
RUN cd client && npm ci && npm link unit-http

# Copy Nginx unit configuration file to configuration directory.
COPY unit.config.json /docker-entrypoint.d/
