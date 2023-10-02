from pymongo import MongoClient
from bson.objectid import ObjectId
import mtg_api # Import from file
from functools import reduce
import requests
import datetime
import json
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.types import Entry, DBEntry

if __name__ == "__main__":
    client = MongoClient("mongodb://localhost:27017")

    db = client['cedhtop16']

    existing_tournaments = []

    # Get existing tournament names
    for i in db['metadata'].find():
        try:
            existing_tournaments.append(i['TID'])
        except KeyError:
            continue

    for TID in ['MM1022', 'MM923', 'SCG0923']:
        for entry in db[TID].find():
            db[TID].find_one_and_replace({'_id': ObjectId(entry['_id'])}, DBEntry.model_validate(entry).model_dump(by_alias=True, exclude_unset=True, exclude_none=True))

            # print(DBEntry.model_validate(entry).model_dump(by_alias=True, exclude_unset=True, exclude_none=True))