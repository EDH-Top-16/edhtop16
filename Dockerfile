# Build the application.
FROM node:24-bookworm AS build

WORKDIR /build

ENV NODE_OPTIONS=--max-old-space-size=4096

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Pull application database
RUN apt-get update
RUN apt-get install s3cmd -y

ARG DO_SPACES_ENDPOINT
ARG DO_SPACES_ACCESS_KEY_ID
ARG DO_SPACES_SECRET_ACCESS_KEY
ENV AWS_ACCESS_KEY_ID=${DO_SPACES_ACCESS_KEY_ID}
ENV AWS_SECRET_ACCESS_KEY=${DO_SPACES_SECRET_ACCESS_KEY}

RUN s3cmd --host ${DO_SPACES_ENDPOINT} --host-bucket ${DO_SPACES_ENDPOINT} get s3://edhtop16/edhtop16.db

COPY . .
RUN pnpm run build

# Main image pulling in builds and data from previous stages.
FROM node:24-bookworm

EXPOSE 8000

WORKDIR /app
ENV NODE_ENV=production

# Copy build output from build stage and install dependencies.
COPY --from=build /build/.next/standalone ./
COPY --from=build /build/.next/static ./.next/static
COPY --from=build /build/public ./public/
COPY --from=build /build/edhtop16.db ./

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
