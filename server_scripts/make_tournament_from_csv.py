import csv
from pymongo import MongoClient
# import mtg_api # Import from file
from functools import reduce
import requests
import datetime
import dateutil.parser
import json
import sys
import uuid
import math


standings = []

fields = ['name', 'profile', 'decklist', 'wins', 'winsSwiss', 'winsBracket', 'winRate', 'winRateSwiss', 'winRateBracket', 'draws', 'losses', 'lossesSwiss', 'lossesBracket', 'standing', 'colorID', 'commander']

if len(sys.argv) < 2:
    print(f"Usage: {sys.argv[0]} <entry CSV> [(optional) custom TID]")
    sys.exit()
else:
    filepath = sys.argv[1]
    TID = sys.argv[2] if len(sys.argv) > 2 else uuid.uuid4()

tournament_name = input("Enter tournament name >> ")
top_cut_included = input("Top cut included? (y/N) >> ").lower().strip() in ["y", "yes"]

# Populate Standings
with open(filepath) as f:
    reader = csv.reader(f, delimiter=',', quotechar='"')

    row_1 = list(map(lambda x: x.lower(), next(reader)))
    name_index = row_1.index("name")
    decklist_index = row_1.index("decklist")

    swiss_index, wins_index, losses_index, draws_index = [-1] * 4
    if not all(i in row_1 for i in ["wins", "losses", "draws"]):
        swiss_index = row_1.index("swiss points")
        win_points = int(input("Enter win points >> "))
        draw_points = int(input("Enter draw points >> "))
    else:
        wins_index = row_1.index("wins")
        losses_index = row_1.index("losses")
        draws_index = row_1.index("draws")

    total_rounds = int(input("Enter total swiss rounds >> "))
    top_cut = int(input("Enter top cut >> "))
    bracket_rounds = math.ceil(math.log(top_cut, 4)) if top_cut > 0 else 0
    size = int(input("Enter tournament size >> "))
    date_created = int(dateutil.parser.isoparse(input("Date created ISO timestamp (YYYY-MM-DD minimum) >> ")).timestamp())

    for standing, line in enumerate(reader):
        name = line[name_index]

        if swiss_index > -1:
            points = int(line[swiss_index])
            wins = points // win_points
            draws = (points % win_points) // draw_points
            losses = total_rounds - wins - draws
        else:
            wins = int(line[wins_index])
            draws = int(line[draws_index])
            losses = int(line[losses_index])

        wins_bracket = bracket_rounds - math.ceil(math.log(standing + 1, 4)) if standing +1 <= top_cut else 0
        losses_bracket = 1 if standing + 1 > 1 and standing + 1 <= top_cut else 0

        if top_cut_included:
            wins_swiss = wins - wins_bracket
            losses_swiss = losses - losses_bracket
        else:
            wins_swiss = wins
            wins += wins_bracket
            losses_swiss = losses
            losses += losses_bracket

        standings.append(
            {"name": name,
            "standing": standing + 1,
            "wins": wins,
            "draws": draws,
            "losses": losses,
            "winsSwiss": wins_swiss,
            "drawsSwiss": draws,
            "lossesSwiss": losses_swiss,
            "winRate": wins / (wins + losses + draws) if wins + losses + draws != 0 else None,
            "winRateSwiss": wins_swiss / total_rounds if total_rounds != 0 else None,
            "winRateBracket": wins_bracket / (wins_bracket + losses_bracket) if wins_bracket + losses_bracket != 0 else None,
            "winsBracket": wins_bracket,
            "lossesBracket": losses_bracket,
            "decklist": line[decklist_index]
            })

    metadata = {
        "TID": str(TID),
        "tournamentName": tournament_name,
        "dateCreated": date_created,
        "date": datetime.datetime.fromtimestamp(date_created),
        "topCut": top_cut,
        "swissNum": total_rounds,
        "size": size
    }

client = MongoClient("mongodb://localhost:27017")

db = client['cedhtop16']

db['metadata'].insert_one(metadata)

db[str(TID)].insert_many(standings)