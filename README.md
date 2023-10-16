# 🚀 Our Site is Live! https://www.edhtop16.com 🚀

> ⚡ Our team of developers are still working hard to push out new features!

# 🌸 cEDH Top 16 🌸

> Website for aggregating cEDH tournament data

## How to Contribute
After cloning this repository, contact Jason for instructions on building the database. Becasue we rely on external APIs, our database update scripts don't work as-is. We're working on a script to pull from the EDHTop16 main database.

## Running using Docker
[Docker](https://www.docker.com/) is a simpler way of running and managing the application stack. To get this working:
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) on your system.
- Run `docker-compose up` to stand up the backend and mongodb instance.
- Run the frontend using the instructions below.

Alternatively, if you wish to simply run the database, run `docker-compose up -d mongodb`.

Automatic seeding of the database has not yet been implemented - to seed the database from a zip file, you can do the following:
- Unzip the seed folder
- Run `docker cp path_to_seed_folder/ mongodb:/root/mongo_seed`
- Run `docker-compose exec -T mongodb mongorestore -d cedhtop16 /root/mongo_seed/cedhtop16`


## Running without Docker
### Start Backend 
[`server/`](/server/)
```
cd ./server/
pip install -r ./requirements.txt
uvicorn main:app --reload
```

### Start Frontend
[`client/`](/client/)
```
cd ./client/
npm install
npm run dev
```

When submitting pull requests, please inform us if you've added any new packages and update the corresponding package lock files.

## ⌨️ Special Thanks:
Made possible by @znayer and the Eminence Team
