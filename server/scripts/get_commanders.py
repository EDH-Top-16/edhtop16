# Flags:
# [-u] attempt to update entries whose commander is marked unknown or missing;
#       Will ignore unknown commanders and only update entries without commanders

from pymongo import MongoClient
from functools import reduce
from tqdm import tqdm
from dotenv import dotenv_values
import sys
import time

# from selenium import webdriver
# from selenium.webdriver.common.by import By
import os

# from utils import wubrgify
from html import unescape


def wubrgify(color_string):
    """Parse colors in WUBRG(C) order; removes duplicates and misordering"""
    res = ""
    for c in ["W", "U", "B", "R", "G"]:
        res += c if c in color_string else ""
    return (
        res if res else "C"
    )  # return "C" for colorless if W, U, B, R, G all not in color string


if __name__ == "__main__":
    client = MongoClient(dotenv_values("./config.env")["ATLAS_URI"])

    memo = {}

    db = client["cedhtop16"]

    # -u to try to re-fill unknown commanders (to not ignore them)
    ignore_unknown = False if "-u" in sys.argv else True

    collections = [
        i for i in db.list_collection_names() if (i != "metadata" and i != "commanders")
    ]
    for c in collections:
        import mtg_api  # Import from file

        print(f"Updating Collection '{c}' with commander/color identity metadata")
        commander_col = db["commanders"]
        col = db[c]
        for i in tqdm(col.find()):
            if i.keys() >= {
                "commander",
                "colorID",
                "mainDeck",
            }:  # Metadata fields already exist; equivalent of checking of this set of keys is in the entry's keys
                if (
                    i["commander"] == "Unknown Commander"
                    or i["colorID"] == "N/A"
                    or not i[
                        "mainDeck"
                    ]  # Some sort of fail case happened previously to make the decklist error while processing
                ) and not ignore_unknown:
                    pass
                else:
                    continue
            try:
                decklist_url = i["decklist"]
            except KeyError:
                print(f"Warning: no decklist url. Object ID: {i['_id']}")
                continue

            # Empty or null decklist url
            if not decklist_url:
                commanders = []

            try:
                if "melee.gg" in decklist_url:
                    raise Exception("melee scraping broken")
                    ff_options = webdriver.FirefoxOptions()
                    ff_options.add_argument("-headless")
                    browser = webdriver.Firefox(options=ff_options)
                    browser.get(decklist_url)
                    time.sleep(0.5)
                    els = browser.find_elements(
                        By.XPATH,
                        r'//td[text()="Commander" or text()="Partner"]/../../..//td/a',
                    )
                    commanders = list(map(lambda x: x.text, els))
                    browser.close()
                else:
                    commanders = mtg_api.get_deck(decklist_url).get_commander()
            except Exception as e:
                print(
                    f"Warning: error while fetching decklist. Entry marked with 'Unknown Commander.' Object ID: {i['_id']} Error: {e}"
                )
                commander_string = "Unknown Commander"
                col.update_one(
                    i,
                    {
                        "$set": {
                            "commander": commander_string,
                            "colorID": "N/A",
                            "mainDeck": None,
                        }
                    },
                )
                commander_col.find_one_and_update(
                    {"commander": commander_string},
                    {"$inc": {"count": 1}, "$set": {"colorID": "N/A"}},
                    upsert=True,
                )
                continue

            # Get single string for name(s) of commander(s)
            if len(commanders) == 1:
                commander_string = commanders[0]
            elif (
                len(commanders) == 2
            ):  # Partners, Friends Forever, Background, whatever Wizards plans to do next
                commander_string = (
                    commanders[0] + " / " + commanders[1]
                    if commanders[1] > commanders[0]
                    else commanders[1] + " / " + commanders[0]
                )
            else:
                print(
                    f"Warning: Number of commanders is not 1 or 2. Entry marked with 'Unknown Commander.' Object ID: {i['_id']}"
                )
                commander_string = "Unknown Commander"
                col.update_one(
                    i,
                    {
                        "$set": {
                            "commander": commander_string,
                            "colorID": "N/A",
                            "mainDeck": None,
                        }
                    },
                )
                commander_col.find_one_and_update(
                    {"commander": commander_string},
                    {"$inc": {"count": 1}, "$set": {"colorID": "N/A"}},
                    upsert=True,
                )
                continue

            # Get color identity for commander(s)
            color_id = ""
            colors = []
            for commander in commanders:
                try:
                    commander = unescape(commander)
                    if commander not in memo:
                        memo[commander] = mtg_api.get_card(commander)["color_identity"]
                    colors += memo[commander]
                except Exception as e:
                    if (
                        "//" in commander
                    ):  # Mtggoldfish returns partners as a single string
                        commanders += list(
                            map(lambda x: x.strip(), commander.split("//"))
                        )
                    else:
                        print(e)
                        print(
                            f"Error while fetching '{commander}' from mtg_api (likely ampersand/other character). ID: {i['_id']}"
                        )
                        break
            else:
                color_id = (
                    color_id + reduce(lambda x, y: x + y, colors) if colors else ""
                )
                color_id = wubrgify(color_id)

            # Try to get main deck from url
            main_deck = []
            try:
                if "melee.gg" in decklist_url:
                    # TODO: fix all processing with melee
                    raise Exception("melee scraping broken")
                else:
                    for _cardname, cardinfo in (
                        mtg_api.get_deck(decklist_url).get_decklist().items()
                    ):
                        for _i in range(cardinfo["quantity"]):
                            main_deck.append(cardinfo["card"]["scryfall_id"])
            except Exception as e:
                print(
                    f"Warning: error while fetching decklist. Main deck marked null. Object ID:  {i['_id']} Error: {e}"
                )
                col.update_one(i, {"$set": {"mainDeck": None}})
                continue

            col.update_one(
                i,
                {
                    "$set": {
                        "commander": commander_string,
                        "colorID": (color_id if color_id else "N/A"),
                        "mainDeck": (main_deck if main_deck else None),
                    }
                },
            )
            commander_col.find_one_and_update(
                {"commander": commander_string},
                {
                    "$inc": {"count": 1},
                    "$set": {"colorID": (color_id if color_id else "N/A")},
                },
                upsert=True,
            )
