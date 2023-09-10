from typing import List
import logging

from .base_db import get_db_async
from utils import oIdToString
from utils.types import AllFilters, TournamentFilters, Tournament


async def get_tournaments(tournament_filters: TournamentFilters) -> List[Tournament]:
    """
    Returns the metadata document from the database.
    """
    db = await get_db_async("cedhtop16")
    metadata = db["metadata"]

    result = await metadata.find(tournament_filters, {"_id": 0}).to_list(length=None)
    return result


async def get_commanders(filters: AllFilters) -> List[dict]:
    """
    Aggregates and returns a list of commanders that match the filters.
    """
    players = await get_players(filters)

    commanders: dict = {}
    for player in players:
        commander = player.get("commander", "")
        if not commander or commander == "Unknown Commander":
            logging.warning(f"Empty commander for player: {player}")
            continue

        if commander not in commanders:
            # If the commander is not in the dictionary, add it.
            commanders[commander] = {
                "colorID": player.get("colorID", ""),
                "wins": player.get("wins", 0),
                "winsSwiss": player.get("winsSwiss", 0),
                "winsBracket": player.get("winsBracket", 0),
                "draws": player.get("draws", 0),
                "losses": player.get("losses", 0),
                "lossesSwiss": player.get("lossesSwiss", 0),
                "lossesBracket": player.get("lossesBracket", 0),
                "count": 1
            }
        else:
            # If the commander is in the dictionary, update it.
            c = commanders.get(commander, {})
            if c == {}:
                logging.warning(f"Malformed commander: {commander}")
                continue

            # If the colorID is not set, set it if this player has a valid colorID.
            if player.get("colorID", "") in {"", "N/A"} and not c["colorID"]:
                c["colorID"] = player["colorID"]

            # Update counting stat fields
            fields = ["wins", "winsSwiss", "winsBracket",
                      "draws", "losses", "lossesSwiss", "lossesBracket"]
            for field in fields:
                c[field] += player.get(field, 0)
            # Increment counter
            c["count"] += 1

    # Calculate the winRate, winRateSwiss, and winRateBracket
    for commander in commanders:
        c = commanders[commander]
        print(commander, c)
        c["winRate"] = c["wins"] / (c["wins"] + c["losses"] + c["draws"]) \
            if (c["wins"] + c["losses"] + c["draws"]) > 0 else None
        c["winRateSwiss"] = c["winsSwiss"] / \
            (c["winsSwiss"] + c["lossesSwiss"] + c["draws"]) \
            if (c["winsSwiss"] + c["lossesSwiss"] + c["draws"]) > 0 else None
        c["winRateBracket"] = c["winsBracket"] / (c["wins"] + c["losses"]) \
            if (c["wins"] + c["losses"]) > 0 else None

    return commanders


async def get_players(filters: AllFilters) -> List[dict]:
    """
    Returns a list of players from the database.
    """
    db = await get_db_async("cedhtop16")

    tournament_filters = filters.get("tournament_filters", {})
    tournaments = await get_tournaments(tournament_filters)
    del filters["tournament_filters"]

    res: List[dict] = []
    for tournament in tournaments:
        # Get the TID from the metadata document
        tid = tournament["TID"]
        if tid == "":
            logging.warning(f"Empty TID for tournament: {tournament}")
            continue

        # Get the tournament with matching TID from the database
        t = db[tid]
        if t is None:
            logging.warning(f"Could not find tournament: {tid}")
            continue

        # Get the tournament data from the database
        result = await t.find(filters).to_list(length=None)
        res.extend(result)

    return oIdToString(res)
