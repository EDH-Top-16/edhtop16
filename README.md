# 🚀 Our Site is Live! https://www.edhtop16.com 🚀

> ⚡ Our team of developers are still working hard to push out new features!

# 🌸 cEDH Top 16 🌸

> Website for aggregating cEDH tournament data

## How to Contribute

After cloning this repository, contact Jason for instructions on building the database. Becasue we rely on external APIs, our database update scripts don't work as-is. We're working on a script to pull from the EDHTop16 main database.

## Running using Docker

[Docker](https://www.docker.com/) is a simpler way of running and managing the application stack. To get this working, install [Docker Desktop](https://www.docker.com/products/docker-desktop/) on your system. To run the database, we recommend you run locally; contact Jason for a seed file.

To build:

```sh
 docker build -f Dockerfile -t unit-app .
```

To run:

Mac/Windows: 

```sh
docker run -p 8000:8000 --env MONGO_URI=mongodb://host.docker.internal:27017 --env ATLAS_URI=mongodb://host.docker.internal:27017 --rm unit-app
```

Linux:

```sh
docker run -p 8000:8000 --net=host --env MONGO_URI=mongodb://localhost:27017 --env ATLAS_URI=mongodb://localhost:27017 --rm unit-app
```

The server should run v1 on its current routes. v2 client pages are on `/v2/*`, v2 API routes are on `v2/api/*`, GraphQL is on `v2/api/graphql`.

To test:

```sh
curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' http://localhost:8000/api/get_commanders
```

or simply visit `localhost:8000` in browser.

## Running without Docker

### Start Backend

[`server/`](/server/)

```sh
cd ./server/
pip install -r ./requirements.txt
uvicorn main:app --reload
```

### Start Frontend

[`client/`](/client/)

```sh
cd ./client/
npm install
npm run dev
```

When submitting pull requests, please inform us if you've added any new packages and update the corresponding package lock files.

## ⌨️ Special Thanks

Made possible by @znayer and the Eminence Team
