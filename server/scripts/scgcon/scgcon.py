import csv
from pymongo import MongoClient
# import mtg_api # Import from file
from functools import reduce
import requests
import datetime
import json
import sys


standings = []

fields = ['name', 'profile', 'decklist', 'wins', 'winsSwiss', 'winsBracket', 'winRate', 'winRateSwiss', 'winRateBracket', 'draws', 'losses', 'lossesSwiss', 'lossesBracket', 'standing', 'colorID', 'commander']


# Populate Standings
with open('/home/jqiu21/Documents/mtg/Public_Standings_-_cEDH_5K_-_SCG_CON_Baltimore_-_06.17.23.csv') as f:
    reader = csv.reader(f, delimiter=',', quotechar='"')
    for line in reader:
        try:
            name = line[2] + ' ' + line[1]
            points = int(line[4])
            standing = int(line[0])
            wins = points // 5
            draws = points % 5

            standings.append(
                {"name": name,
                "standing": standing,
                "wins": wins,
                "draws": draws,
                "losses": 4 - wins - draws,
                "winsSwiss": wins,
                "drawsSwiss": draws,
                "lossesSwiss": 4 - wins - draws,
                "winRate": points/20,
                "winRateSwiss": points/20,
                "winRateBracket": None,
                "winsBracket": None,
                "lossesBracket": None
                })
        except:
            print(f"Error: {line}")

decklists = {}

with open('/home/jqiu21/Documents/mtg/scg_con_2023_melee_Decklists-15830.csv') as f:
    reader = csv.reader(f, delimiter=',', quotechar='"')
    for line in reader:
        if line[4] not in decklists.keys():
            decklists[line[4]] = 'https://melee.gg/Decklist/View/' + line[0]

with open('/home/jqiu21/Documents/mtg/scg_con_2023_forms_decklists.csv') as f:
    reader = csv.reader(f, delimiter=',', quotechar='"')
    for line in reader:
        if line[2] + ' ' + line[3] not in decklists.keys():
            if line[4]:
                decklists[line[2] + ' ' + line[3]] = (line[4])

for i in standings:
    if i['name'] in decklists.keys():
        i['decklist'] = decklists[i['name']]



client = MongoClient("mongodb://localhost:27017")

db = client['cedhtop16']

db['SCG0623'].insert_many(standings)