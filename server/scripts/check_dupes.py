from pymongo import MongoClient
import mtg_api  # Import from file
from get_tournaments import fetch_tournaments
from functools import reduce
import requests
import datetime
import json
import sys
from tqdm import tqdm
from json import JSONDecodeError

# -o overwrite tournaments, even if the db already contains them.
overwrite_tourneys = True if "-o" in sys.argv else False

# Paste your api key into a text file called 'eminence_api_key.txt'
with open("./eminence_api_key.txt", "r") as f:
    apiKey = f.readline().replace("\n", "")

if __name__ == "__main__":
    client = MongoClient("mongodb://localhost:27017")

    db = client["cedhtop16"]

    existing_tournaments = []

    # Get existing tournament names
    for i in db["metadata"].find():
        try:
            existing_tournaments.append(i["TID"])
        except KeyError:
            continue

    for TID in tqdm(existing_tournaments):
        names = {}
        standings = {}
        tournament = []
        for entry in db[TID].find():
            if "profile" not in entry.keys():
                continue
            if not tournament:
                try:
                    tournament = fetch_tournaments({"TID": TID})
                except JSONDecodeError:
                    continue
            if not tournament:
                continue
            if (
                entry["name"] in names and entry["profile"] in names[entry["name"]]
            ) or entry["standing"] in standings:
                for standing, e in enumerate(tournament[0]["standings"]):
                    if entry["name"] == e["name"] and entry["profile"] == e["profile"]:
                        db[TID].delete_many(
                            {
                                "name": entry["name"],
                                "profile": entry["profile"],
                                "standing": {"$ne": standing + 1},
                            }
                        )
                        db[TID].delete_many(
                            {
                                "$or": [
                                    {"name": {"$ne": e["name"]}},
                                    {"profile": {"$ne": e["profile"]}},
                                    {"profile": {"$exists": False}},
                                ],
                                "standing": standing + 1,
                            }
                        )
                        while len(list(db[TID].find({"standing": standing + 1}))) > 1:
                            db[TID].delete_one({"standing": standing + 1})
            else:
                names[entry["name"]] = {entry["profile"]}
                standings[entry["standing"]] = entry["profile"]
