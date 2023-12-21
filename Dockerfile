# Build the V1 client application.
FROM node:20-bullseye as client_v1
WORKDIR /app
COPY client_v1 .
RUN npm ci
# Set API URL to empty string so the V1 client will fetch from the current host.
RUN echo 'REACT_APP_uri=' > .env
RUN npm run build

# Build the V2 client application.
FROM node:20-bullseye AS client
WORKDIR /app
COPY client .
RUN npm ci
RUN npm run build

# We take a minimal Unit image and install language-specific modules.
FROM unit:1.31.1-minimal

# First, we install the required tooling, add Unit's repo, and add Node.js's repo.
RUN apt update && apt install -y curl apt-transport-https gnupg2 lsb-release ca-certificates \
    && curl -o /usr/share/keyrings/nginx-keyring.gpg                          \
           https://unit.nginx.org/keys/nginx-keyring.gpg                      \
    && echo "deb [signed-by=/usr/share/keyrings/nginx-keyring.gpg]            \
           https://packages.nginx.org/unit/debian/ `lsb_release -cs` unit"    \
           > /etc/apt/sources.list.d/unit.list                                \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /usr/share/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/nodesource.gpg] \
            https://deb.nodesource.com/node_20.x nodistro main" > /etc/apt/sources.list.d/nodesource.list

# Next, we install the necessary language module packages and perform cleanup.
RUN apt update && apt install -y unit-python3.9 nodejs python3-pip unit-dev   \
    && apt remove -y apt-transport-https gnupg2 lsb-release                   \
    && apt autoremove --purge -y                                              \
    && rm -rf /var/lib/apt/lists/* /etc/apt/sources.list.d/*.list

WORKDIR /app
ENV NODE_ENV=production

# Copy server code and install dependencies.
COPY server server
COPY server/requirements.txt server/requirements.txt
RUN python3 -m pip install -r server/requirements.txt

# Copy build output from client V1 stage and add to static file directory.
COPY --from=client_v1 /app/build client_v1

# Install global unit-http library
RUN npm i -g unit-http

# Copy build output from client V2 build stage and install dependencies.
COPY --from=client /app/.next client/.next
COPY client/package*.json client/
COPY client/server.js client
COPY client/next.config.js client
COPY client/relay.config.js client
RUN cd client && npm ci && npm link unit-http

# Copy server V1 and install dependencies.
COPY server_v1 server_v1
RUN cd server_v1 && npm ci && npm link unit-http

# Copy Nginx unit configuration file to configuration directory.
COPY unit.config.json /docker-entrypoint.d/
