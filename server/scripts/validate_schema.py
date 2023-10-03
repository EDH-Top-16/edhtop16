from pymongo import MongoClient
from bson.objectid import ObjectId
import mtg_api # Import from file
from functools import reduce
import requests
import datetime
import json
import sys
import os
from pydantic import ValidationError

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.types import Entry, DBEntry

rewrite_errors = True if '-r' in sys.argv else False

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
    
    if rewrite_errors:
        class DBEntry(DBEntry):
            class Config:
                extra = "ignore"

    for TID in existing_tournaments:
        if TID = "metadata": continue
        for entry in db[TID].find():
            try:
                model = DBEntry.model_validate(entry, strict=True).model_dump(by_alias=True, exclude_unset=False, exclude_none=False)
                if rewrite_errors:
                    model['_id'] = entry['_id']
                    db[TID].find_one_and_replace({'_id': ObjectId(entry['_id'])}, model)
            except ValidationError as e:
                print(f"Error for {TID}: \n{e}")
