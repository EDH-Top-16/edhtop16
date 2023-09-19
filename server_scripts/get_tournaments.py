from pymongo import MongoClient
import mtg_api # Import from file
from functools import reduce
import requests
import datetime
import json
import sys

# -o overwrite tournaments, even if the db already contains them.
overwrite_tourneys = True if '-o' in sys.argv else False

# Paste your api key into a text file called 'eminence_api_key.txt'
with open("./eminence_api_key.txt", 'r') as f:
    apiKey = f.readline().replace('\n', '')

def fetch_tournaments(filters=None):
    data = {'last': 365, # TODO: CHANGE THIS TO A REASONABLE NUMBER WHEN ATTACHING TO CRON JOB
        'columns': ['name',
        'profile',
        'decklist',
        'wins',
        'winsSwiss',
        'winsBracket',
        'winRate',
        'winRateSwiss',
        'winRateBracket',
        'draws',
        'losses',
        'lossesSwiss',
        'lossesBracket']}
    
    if filters:
        for k, v in filters.items():
            data[k] = v
    
    headers = {'Content-Type': 'application/json',
        'Authorization': apiKey,
        'Accept': 'application/json'}

    r = requests.post("https://eminence.events/api", json=data, headers=headers)
    return json.loads(r.text)

if __name__ == '__main__':

    client = MongoClient("mongodb://localhost:27017")

    db = client['cedhtop16']

    existing_tourneys = []

    # Get existing tournament names
    for i in db['metadata'].find():
        try:
            existing_tourneys.append(i['TID'])
        except KeyError:
            continue

    try:
        tournaments = fetch_tournaments({'last': 356000} if overwrite_tourneys else None)
    except:
        print(f"{datetime.datetime.now().strftime('%Y-%m-%d')}: Error while fetching tournaments from Eminence.")
        exit()
    
    for tourney in tournaments:
        try:
            if not tourney['standings'][0]:
                print(f"{datetime.datetime.now().strftime('%Y-%m-%d')}: Warning - empty standings for '{tourney['TID']}'.")
                continue
            if tourney['TID'] not in existing_tourneys:
                for i, j in enumerate(tourney['standings']):
                    j.update({'standing': i+1})
                standings = [i for i in tourney['standings'] if i['decklist']]
                if standings:
                    db['metadata'].insert_one({
                        'TID': tourney['TID'],
                        'tournamentName': tourney['tournamentName'] if tourney['tournamentName'] else 'Unnamed Tournament',
                        'size': len(tourney['standings']),
                        'date': datetime.datetime.fromtimestamp(tourney['dateCreated']),
                        'dateCreated': tourney['dateCreated'],
                        'swissNum': tourney['swissNum'],
                        'topCut': tourney['topCut']
                    })
                    db[tourney['TID']].insert_many(standings)
            elif overwrite_tourneys:
                # db[tourney['TID']].drop() 
                for i, j in enumerate(tourney['standings']):
                    j.update({'standing': i+1})
                standings = [i for i in tourney['standings'] if i['decklist']]
                if standings:
                    db['metadata'].update_one({'TID': tourney['TID']}, {'$set': {
                        'tournamentName': tourney['tournamentName'] if tourney['tournamentName'] else 'Unnamed Tournament',
                        'size': len(tourney['standings']),
                        'date': datetime.datetime.fromtimestamp(tourney['dateCreated']),
                        'dateCreated': tourney['dateCreated'],
                        'swissNum': tourney['swissNum'],
                        'topCut': tourney['topCut']
                    }})
                    for i in standings:
                        db[tourney['TID']].find_one_and_update({'standing': i['standing'], 'name': i['name']}, {'$set': i}, upsert=True)

        except:
            if 'TID' in tourney.keys():
                print(f"{datetime.datetime.now().strftime('%Y-%m-%d')}: Error while writing data to collection '{tourney['TID']}'.")
            else:
                print(f"{datetime.datetime.now().strftime('%Y-%m-%d')}: Error while writing data. TID missing. received:\
                {tourney}")