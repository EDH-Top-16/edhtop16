# 🚀 Our Site is Live! https://edhtop16.com 🚀

<h1 align="center"><img src="https://github.com/EDH-Top-16/edhtop16/blob/main/public/icon.png"></h1>

<p align="center">
  <a href="https://edhtop16.com">https://edhtop16.com</a>
</p>

## Contributing

EDHTop16 is open-source and welcoming to new contributions! After cloning this
repository, contact Jason or Ryan for instructions to setting up a local
development database.

Please see our [issues tab](https://github.com/EDH-Top-16/edhtop16/issues) for
work we need help with!

### Running Locally

EDHTop16 is written using [Next.js](https://nextjs.org/),
[Relay](https://relay.dev/), and [Prisma](https://www.prisma.io/). To start
local development, clone this repository and then run:

```sh
npm install
npm run dev
```

When submitting pull requests, please inform us if you've added any new packages
and update the corresponding package lock files.

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
docker run -p 8000:8000 --env 'DATABASE_URL=<local development database>' --env 'TOPDECK_GG_API_KEY=<your topdeck api key>
```

To test visit http://localhost:8000

## ⌨️ Special Thanks

Made possible by @znayer and the TopDeck.gg Team
