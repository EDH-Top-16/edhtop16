from pymongo import MongoClient
import mtg_api # Import from file
from functools import reduce
from tqdm import tqdm

client = MongoClient("mongodb://localhost:27017")

db = client['cedhtop16']

collections = [i for i in db.list_collection_names() if (i != 'metadata' and i != 'commanders')]

def wubrgify(color_string):
    """Parse colors in WUBRG(C) order; removes duplicates and misordering"""
    res = ''
    for c in ['W', 'U', 'B', 'R', 'G']:
        res += c if c in color_string else ''
    return res if res else "C" # return "C" for colorless if W, U, B, R, G all not in color string

for c in collections:
    print(f"Updating Collection '{c}' with commander/color identity metadata")
    commander_col = db['commanders']
    col = db[c]
    for i in tqdm(col.find()):
        if 'commander' in i.keys() and 'colorID' in i.keys(): # Metadata already exists
            continue
        try:
            decklist_url = i['decklist']
        except KeyError:
            print(f"Warning: no decklist url. Object ID: {i['_id']}")
            continue

        try:
            commanders = mtg_api.get_deck(decklist_url).get_commander()
        except (KeyError, AttributeError):
            print(f"Warning: error while fetching decklist. Entry marked with 'Unknown Commander.' Object ID: {i['_id']}")
            commander_string = "Unknown Commander"
            col.update_one(i, {'$set': {'commander': commander_string, 'colorID': 'N/A'}})
            commander_col.find_one_and_update({'commander': commander_string}, {'$inc': {'count': 1}, '$set': {'colorID':'N/A'}}, upsert=True)
            continue
        
        # Get single string for name(s) of commander(s)
        if len(commanders) == 1:
            commander_string = commanders[0]
        elif len(commanders) == 2: # Partners, Friends Forever, Background, whatever Wizards plans to do next
            commander_string = commanders[0] + ' / ' + commanders[1] if commanders[1] > commanders[0] else commanders[1] + ' / ' + commanders[0]
        else:
            print(f"Warning: Number of commanders is not 1 or 2. Entry marked with 'Unknown Commander.' Object ID: {i['_id']}")
            commander_string = "Unknown Commander"
            col.update_one(i, {'$set': {'commander': commander_string, 'colorID': 'N/A'}})
            commander_col.find_one_and_update({'commander': commander_string}, {'$inc': {'count': 1}, '$set': {'colorID':'N/A'}}, upsert=True)
            continue
        
        # Get color identity for commander(s)
        color_id = ''
        colors = []
        for commander in commanders:
            try:
                colors += mtg_api.get_card(commander)['color_identity']
            except:
                print(f"Error while fetching '{commander}' from mtg_api (likely ampersand/other character). ID: {i['_id']}")
                break
        else:
            color_id = color_id + reduce(lambda x, y: x + y, colors) if colors else ""
            color_id = wubrgify(color_id)
    
            # print(commander_string, '')
            # print(color_id)
        col.update_one(i, {'$set': {'commander': commander_string, 'colorID': (color_id if color_id else 'N/A')}})
        commander_col.find_one_and_update({'commander': commander_string}, {'$inc': {'count': 1}, '$set': {'colorID':(color_id if color_id else 'N/A')}}, upsert=True)
