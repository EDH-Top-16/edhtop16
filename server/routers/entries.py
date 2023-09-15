from fastapi import APIRouter, Body
from typing import List

from db import get_entries as get_entries_db
from utils.types import Entry, AllFilters


router = APIRouter()


@router.post("/entries")
async def get_entries(filters: AllFilters = Body(...)) -> List[Entry]:
    """
    Returns a list of entries from the database given a filter.
    """
    # Using by_alias to convert the filters to the database format.
    data = await get_entries_db(filters.model_dump(by_alias=True, exclude_unset=True, exclude_none=True))
    return data
