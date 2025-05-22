# Pull the application database
FROM golang:1.24 AS db

ARG DO_SPACES_ENDPOINT
ENV DO_SPACES_ENDPOINT=${DO_SPACES_ENDPOINT}

ARG DO_SPACES_ACCESS_KEY_ID
ENV DO_SPACES_ACCESS_KEY_ID=${DO_SPACES_ACCESS_KEY_ID}

ARG DO_SPACES_SECRET_ACCESS_KEY
ENV DO_SPACES_SECRET_ACCESS_KEY=${DO_SPACES_SECRET_ACCESS_KEY}

WORKDIR /app

COPY go.mod go.mod ./
RUN go mod download

COPY etl.go .
RUN go run etl.go --phases=pull

# Build the application.
FROM node:20-bullseye AS build

ARG NEXT_PUBLIC_POSTHOG_KEY
ENV NEXT_PUBLIC_POSTHOG_KEY=${NEXT_PUBLIC_POSTHOG_KEY}

WORKDIR /app

COPY . .
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN npm ci
RUN npm run build

# Main image pulling in builds and data from previous stages.
FROM unit:1.31.1-node20

WORKDIR /app
ENV NODE_ENV=production

# Install global unit-http library
RUN npm i -g unit-http@1.31

# Copy build output from build stage and install dependencies.
COPY --from=build /app/.next client/.next
COPY --from=db /app/data client/data/
COPY package*.json client/
COPY server.js client/
COPY next.config.js client/
COPY relay.config.js client/
COPY public client/public/
RUN cd client && npm ci && npm link unit-http

# Copy Nginx unit configuration file to configuration directory.
COPY unit.config.json /docker-entrypoint.d/
