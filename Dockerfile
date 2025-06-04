# Build the application.
FROM node:20-bullseye AS build

WORKDIR /app

ENV NODE_OPTIONS=--max-old-space-size=4096

COPY package.json ./
COPY package-lock.json ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_POSTHOG_KEY
ENV NEXT_PUBLIC_POSTHOG_KEY=${NEXT_PUBLIC_POSTHOG_KEY}

RUN npm run build

# Pull application database
RUN apt-get update
RUN apt-get install s3cmd -y

ARG DO_SPACES_ENDPOINT
ARG DO_SPACES_ACCESS_KEY_ID
ARG DO_SPACES_SECRET_ACCESS_KEY
ENV AWS_ACCESS_KEY_ID=${DO_SPACES_ACCESS_KEY_ID}
ENV AWS_SECRET_ACCESS_KEY=${DO_SPACES_SECRET_ACCESS_KEY}

RUN s3cmd --host ${DO_SPACES_ENDPOINT} --host-bucket ${DO_SPACES_ENDPOINT} get s3://edhtop16/edhtop16.db

# Main image pulling in builds and data from previous stages.
FROM unit:1.31.1-node20

WORKDIR /app
ENV NODE_ENV=production

# Install global unit-http library
RUN npm i -g unit-http@1.31

# Copy build output from build stage and install dependencies.
COPY --from=build /app/.next client/.next
COPY --from=build --chown=unit:unit /app/edhtop16.db client/
COPY package*.json client/
COPY server.js client/
COPY next.config.js client/
COPY relay.config.js client/
COPY public client/public/
RUN cd client && npm ci && npm link unit-http

# Copy Nginx unit configuration file to configuration directory.
COPY unit.config.json /docker-entrypoint.d/
