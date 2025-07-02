# Build the application.
FROM node:24-bookworm AS build

WORKDIR /build

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
FROM node:24-bookworm

EXPOSE 8000

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci

# Copy build output from build stage and install dependencies.
COPY --from=build /build/dist ./dist
COPY --from=build /build/edhtop16.db ./

COPY server.mts ./
COPY relay.config.json ./
COPY public ./public/
COPY __generated__/persisted_queries.json ./__generated__/persisted_queries.json

CMD npm start
