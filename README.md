<h1 align="center">
  <img src="https://github.com/EDH-Top-16/edhtop16/blob/main/public/icon.png">
  <br>
  <a href="https://edhtop16.com">https://edhtop16.com</a>
</h1>

EDHTop16 is a powerful containerized application that utilizes Apollo GraphQL to provide curated data for competitive Elder Dragon Highlander (cEDH). The SSR front-end provides standard summaries for commanders (`/commanders`) including: conversion rate, entries, meta share, and conversion bias to inform new and experienced players about commander performance. Additionally decks and commanders can be accessed by tournament (`/tournaments`) to provide easier access to specific decks and players.

## Contributing

EDHTop16 is open-source and welcoming to new contributions! Please see our
[issues tab](https://github.com/EDH-Top-16/edhtop16/issues) for work we need
help with! The application is written using [Next.js](https://nextjs.org/), and
[Relay](https://relay.dev/). The following dependencies are required for local
development:

1. Node.js

### Running in Development

As a first step contact the development team to recieve a `edhtop16.db` file for prototyping.

To run the application:

1) Install local dependencies with:

```sh
npm ci
```

2) Run the following to start the application:

```sh
npm run dev
```

*if this complains about `TOPDECK_GG_API_KEY` just export an env var with an arbitrary value*

### Adding Apollo GraphQL Abstractions 

1) Contruct the sqlite3 query you would like to select the data.
2) Modify the code (`src/lib/server/schema`) for the appropriate object. The queries are built using the Kysely expression builder.
3) Modify the code (`/src/pages`) to add your new abstractions to the site.
4) Enure that you modify `/src/pages/index.ts` to include your new abstractions.

### Rebuilding the Schema, Relay, and River to Reflect Changes

```sh
npm run generate:schem
npm run generate:relay
npm run generate:river
npm run dev
```

### Running using Docker

[Docker](https://www.docker.com/) is used to run EDHTop16 is production, and we
recommend testing with it locally before submitting a PR. To get this working,
install [Docker Desktop](https://www.docker.com/products/docker-desktop/) on
your system.

To build:

```sh
 docker build -f Dockerfile -t edhtop16 --build-arg "ENTRIES_DB_URL=<mongo db url>" .
```

To run:

```sh
docker run -p 8000:8000 --env 'ENTRIES_DB_URL=<mongo db url>' --env 'TOPDECK_GG_API_KEY=<your topdeck api key> --rm edhtop16
```

To test visit http://localhost:8000

## Special Thanks

Made possible by @znayer and the TopDeck.gg Team
