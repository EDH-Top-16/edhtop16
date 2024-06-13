# Flags:
# [-o] overwrite existing data assuming upstream CT api is correct;
#       Will ignore existing tournaments and only add new tournaments if not provided.

from pymongo import MongoClient
import mtg_api  # Import from file
from functools import reduce
import requests
import datetime
import json
import sys
from dotenv import dotenv_values

# -o overwrite tournaments, even if the db already contains them.
overwrite_tourneys = True if "-o" in sys.argv else False

# Paste your api key into a text file called 'eminence_api_key.txt'
with open("./eminence_api_key.txt", "r") as f:
    apiKey = f.readline().replace("\n", "")


def fetch_tournaments(filters=None):
    data = {
        "game": "Magic: The Gathering",
        "format": "EDH",
        "columns": [
            "name",
            "profile",
            "id",
            "decklist",
            "wins",
            "winsSwiss",
            "winsBracket",
            "winRate",
            "winRateSwiss",
            "winRateBracket",
            "draws",
            "losses",
            "lossesSwiss",
            "lossesBracket",
        ],
    }

    if filters:
        for k, v in filters.items():
            data[k] = v

    headers = {
        "Content-Type": "application/json",
        "Authorization": apiKey,
        "Accept": "application/json",
    }

    # r = requests.post("https://topdeck.gg/api", json=data, headers=headers)
    r = requests.post(
        "https://topdeck.gg/api/v2/tournaments", json=data, headers=headers
    )
    if r.status_code != 200:
        raise Exception(f"Error {r.status_code} -- {r.text}")
    return json.loads(r.text)


if __name__ == "__main__":
    client = MongoClient(dotenv_values("./config.env")["ATLAS_URI"])

    db = client["cedhtop16"]

    existing_tourneys = []

    # Get existing tournament names
    for i in db["metadata"].find():
        try:
            existing_tourneys.append(i["TID"])
        except KeyError:
            continue

    try:
        tournaments = fetch_tournaments(
            {"start": 0} if overwrite_tourneys else {"last": 30}
        )
    except Exception as e:
        print(
            f"{datetime.datetime.now().strftime('%Y-%m-%d')}: Error while fetching tournaments from Topdeck: {e}"
        )
        exit()

    for tourney in tournaments:
        try:
            if (not tourney["standings"]) or (not tourney["standings"][0]):
                print(
                    f"{datetime.datetime.now().strftime('%Y-%m-%d')}: Warning - empty standings for '{tourney['TID']}'."
                )
                continue
            if tourney["TID"] not in existing_tourneys:
                for i, j in enumerate(tourney["standings"]):
                    j.update({"standing": i + 1})
                standings = [
                    {
                        **entry,
                        "decklist": entry.get("decklist", None),
                        "profile": entry.get("profile", entry.get("id", None)),
                    }
                    for entry in tourney["standings"]
                ]
                for entry in standings:
                    entry.pop("id", None)

                if standings:
                    db["metadata"].insert_one(
                        {
                            "TID": tourney["TID"],
                            "tournamentName": (
                                tourney["tournamentName"]
                                if tourney["tournamentName"]
                                else "Unnamed Tournament"
                            ),
                            "size": len(tourney["standings"]),
                            "date": datetime.datetime.fromtimestamp(
                                tourney.get("startDate", tourney.get("dateCreated"))
                            ),
                            "dateCreated": tourney.get(
                                "startDate", tourney.get("dateCreated")
                            ),
                            "swissNum": tourney["swissNum"],
                            "topCut": tourney["topCut"],
                        }
                    )
                    db[tourney["TID"]].insert_many(standings)
            elif overwrite_tourneys:
                # db[tourney['TID']].drop()
                for i, j in enumerate(tourney["standings"]):
                    j.update({"standing": i + 1})
                standings = [
                    {
                        **entry,
                        "decklist": entry.get("decklist", None),
                        "profile": entry.get("profile", entry.get("id", None)),
                    }
                    for entry in tourney["standings"]
                ]
                for entry in standings:
                    entry.pop("id", None)

                if standings:
                    db["metadata"].update_one(
                        {"TID": tourney["TID"]},
                        {
                            "$set": {
                                "tournamentName": (
                                    tourney["tournamentName"]
                                    if tourney["tournamentName"]
                                    else "Unnamed Tournament"
                                ),
                                "size": len(tourney["standings"]),
                                "date": datetime.datetime.fromtimestamp(
                                    tourney.get("startDate", tourney.get("dateCreated"))
                                ),
                                "dateCreated": tourney.get(
                                    "startDate", tourney.get("dateCreated")
                                ),
                                "swissNum": tourney["swissNum"],
                                "topCut": tourney.get("topCut", None),
                            }
                        },
                    )
                    for i in standings:
                        db[tourney["TID"]].find_one_and_update(
                            {"standing": i["standing"], "name": i["name"]},
                            {"$set": i},
                            upsert=True,
                        )

        except Exception as e:
            if "TID" in tourney.keys():
                print(
                    f"{datetime.datetime.now().strftime('%Y-%m-%d')}: Error while writing data to collection '{tourney['TID']}'. Error: {e}"
                )
            else:
                print(
                    f"{datetime.datetime.now().strftime('%Y-%m-%d')}: Error while writing data. TID missing. received:\
                {tourney}"
                )
