<h1 align="center">
  <img src="https://github.com/EDH-Top-16/edhtop16/blob/main/public/icon.png">
  <br>
  <a href="https://edhtop16.com">https://edhtop16.com</a>
</h1>

## Contributing

EDHTop16 is open-source and welcoming to new contributions! Please see our
[issues tab](https://github.com/EDH-Top-16/edhtop16/issues) for work we need
help with! The application is written using [Next.js](https://nextjs.org/),
[Relay](https://relay.dev/), and [Prisma](https://www.prisma.io/). The following
prerequisites are required for local development:

1. Node.js
2. Postgresql

### Creating a Local Database

To set up a Postgresql instance suitable for local development:

```sql
CREATE DATABASE edhtop16;
CREATE USER edhtop16;
ALTER ROLE edhtop16 WITH superuser;
```

Then clone this repository and create a new file named `.env` with the following
contents:

```sh
DATABASE_URL="postgresql://edhtop16@localhost:5432/edhtop16"
```

Finally, run the following commands to install dependencies and initialize a
local database with some test data:

```sh
npm install
npx prisma migrate dev
```

The test database should be initialized with anonymized data from a few
tournaments, suitable for debugging and testing new features.

### Running in Development

After a local database has been set up, run the following to start the
application:

```sh
npm run dev
```

### Running using Docker

[Docker](https://www.docker.com/) is used to run EDHTop16 is production, and we
recommend testing with it locally before submitting a PR. To get this working,
install [Docker Desktop](https://www.docker.com/products/docker-desktop/) on
your system.

To build:

```sh
 docker build -f Dockerfile -t unit-app .
```

To run:

```sh
docker run -p 8000:8000 --env 'DATABASE_URL=postgresql://edhtop16@localhost:5432/edhtop16' --env 'TOPDECK_GG_API_KEY=<your topdeck api key>
```

To test visit http://localhost:8000

## Special Thanks

Made possible by @znayer and the TopDeck.gg Team
