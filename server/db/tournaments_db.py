from typing import List
import logging

from .base_db import get_db_async
from utils import oIdToString
from utils import Filters, TournamentFilters


async def get_metadata() -> List[dict]:
    """
    Returns the metadata document from the database.
    """
    db = await get_db_async("cedhtop16")
    metadata = db["metadata"]

    result = await metadata.find({}, {"_id": 0}).to_list(length=None)
    return result


async def get_tournaments(filters: TournamentFilters) -> List[dict]:
    """
    Returns a list of tournaments from the database.
    """
    db = await get_db_async("cedhtop16")
    metadata = await get_metadata()

    res: List[dict] = []
    for tournament in metadata:
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


async def get_commanders(filters: Filters) -> List[dict]:
    """
    Returns a list of commanders that match the filters.
    """
    metadata = await get_metadata()
    return metadata
