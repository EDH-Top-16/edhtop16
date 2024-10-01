# Build the V2 client application.
FROM node:20-bullseye AS client
WORKDIR /app
COPY client .
RUN npm ci
RUN npm run build

# We take a minimal Unit image and install language-specific modules.
FROM unit:1.31.1-node20

WORKDIR /app
ENV NODE_ENV=production

# Install global unit-http library
RUN npm i -g unit-http@1.31

# Copy build output from client V2 build stage and install dependencies.
COPY --from=client /app/.next client/.next
COPY client/package*.json client/
COPY client/server.js client
COPY client/next.config.js client
COPY client/relay.config.js client
COPY client/prisma client/prisma
COPY client/public client/public
RUN cd client && npm ci && npm link unit-http && npx prisma generate

# Copy Nginx unit configuration file to configuration directory.
COPY unit.config.json /docker-entrypoint.d/
