import requests
from pymongo import MongoClient
from functools import reduce
import requests
import datetime
import json
import sys
from dotenv import dotenv_values

# Schema validation
from pydantic import BaseModel, ValidationError
from typing import List



client = MongoClient(dotenv_values("./config.env")["ATLAS_URI"])

db = client["cedhtop16"]

class Entry(BaseModel):
    name: str
    decklist: str = ""
    winsSwiss: int
    lossesSwiss: int
    draws: int
    winsBracket: int
    lossesBracket: int
    standing: int = -1

class Tournament(BaseModel):
    TID: str
    tournamentName: str
    players: int
    startDate: int
    swissRounds: int
    topCut: int
    bracketUrl: str
    standings: List[Entry]


with open("providers.csv", "r") as f:
    for line in f:
        provider, url = line.split("|")

        r = requests.get(url, stream=True)
        if r.encoding is None:
            r.encoding = 'utf-8'

        for line in r.iter_lines(decode_unicode=True):
            if line:
                try:
                    data = json.loads(line)
                except json.JSONDecodeError as e:
                    print(f"Error loading line to json. Error:\n{e}\nLine:{line}")

                TID = f"{provider}:{data['TID']}"
                if TID in db.list_collection_names(): # We've gotten to tournaments we already have; stop
                    print("Reached already-seen tournaments. Aborting.")
                    break

                try:
                    tournament = Tournament(**data)
                    tournament.TID = TID
                except ValidationError as e:
                    print(f"Validation Error -- {TID}. Error(s):\n{e.errors()}")

                print(f"Adding {TID}")

                try:
                    # Update metadata entry
                    db["metadata"].insert_one(tournament.model_dump(exclude={"standings"}))
                    
                    # Add entries to tournament collection
                    for i, entry in enumerate(tournament.standings):
                        if entry.standing == -1:
                            entry.standing = i + 1
                        db[TID].insert_one(entry.model_dump())
                except Exception as e:
                    print(f"{TID} -- Error while writing data to collection. Error:\n{e}")
                print(f"Added {TID}")
