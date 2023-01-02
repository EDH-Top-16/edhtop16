from pymongo import MongoClient
import mtg_api # Import from file
from functools import reduce
from tqdm import tqdm

client = MongoClient("mongodb://localhost:27017")

db = client['cedhtop16']

# TODO: get collections from metadata
collections = [i for i in db.list_collection_names() if i != 'metadata']

def wubrgify(color_string):
    """Parse colors in WUBRG(C) order; removes duplicates and misordering"""
    res = ''
    for c in ['W', 'U', 'B', 'R', 'G']:
        res += c if c in color_string else ''
    return res if res else "C" # return "C" for colorless if W, U, B, R, G all not in color string

for c in collections:
    print(f"Updating Collection '{c}' with commander/color identity metadata")
    col = db[c]
    for i in tqdm(col.find()):
        if 'Commander' in i.keys() and 'Color_ID' in i.keys(): # Metadata already exists
            continue
        try:
            decklist_url = i['decklist']
        except KeyError:
            print("Warning: no decklist url") # TODO: provide more useful logging data here
            continue

        try:
            commanders = mtg_api.get_deck(decklist_url).get_commander()
        except KeyError:
            print("Warning: error while fetching decklist.") # TODO: provide more useful logging data here  
            continue
        
        # Get single string for name(s) of commander(s)
        if len(commanders) == 1:
            commander_string = commanders[0]
        elif len(commanders) == 2: # Partners, Friends Forever, Background, whatever Wizards plans to do next
            commander_string = commanders[0] + ' / ' + commanders[1]
        else:
            print("Warning: Number of commanders is not 1 or 2. Skipped.") # TODO: provide more useful logging data here
            continue
        
        # Get color identity for commander(s)
        color_id = ''
        for commander in commanders:
            colors = mtg_api.get_card(commander)['color_identity']
            color_id = color_id + reduce(lambda x, y: x + y, colors) if colors else ""
        color_id = wubrgify(color_id)
    
        # print(commander_string, '')
        # print(color_id)
        col.update_one(i, {'$set': {'Commander': commander_string, 'Color_ID': color_id}})
