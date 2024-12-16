# Build the application.
FROM node:20-bullseye AS build
ARG ENTRIES_DB_URL
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
COPY --from=build /app/prisma client/prisma/
COPY package*.json client/
COPY server.js client/
COPY next.config.js client/
COPY relay.config.js client/
COPY public client/public/
RUN cd client && npm ci && npm link unit-http && npx prisma generate

# Copy Nginx unit configuration file to configuration directory.
COPY unit.config.json /docker-entrypoint.d/
