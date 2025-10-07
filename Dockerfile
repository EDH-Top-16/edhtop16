# Build the application.
FROM node:24-bookworm AS build

WORKDIR /build

ENV NODE_OPTIONS=--max-old-space-size=4096

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/pastoria/package.json ./packages/pastoria/
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run -r build
RUN pnpm run build

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
FROM node:24-bookworm

EXPOSE 8000

WORKDIR /app
ENV NODE_ENV=production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/pastoria/package.json ./packages/pastoria/
RUN pnpm install --frozen-lockfile --prod

# Copy build output from build stage and install dependencies.
COPY --from=build /build/dist ./dist
COPY --from=build /build/edhtop16.db ./

COPY server.mts ./
COPY relay.config.json ./
COPY public ./public/
COPY __generated__/persisted_queries.json ./__generated__/persisted_queries.json

CMD pnpm start
