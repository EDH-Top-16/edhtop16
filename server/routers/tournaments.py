from fastapi import APIRouter, Body
from pydantic import BaseModel
from typing import List

from db import get_tournaments as get_tournaments_db
from utils.types import Tournament, TournamentFilters


router = APIRouter()


@router.post("/tournaments")
async def get_tournaments(filters: TournamentFilters = Body(...)) -> List[Tournament]:
    """
    Returns a list of tournaments from the database given a filter.
    """
    # Using by_alias to convert the filters to the database format.
    data = await get_tournaments_db(filters.model_dump(by_alias=True, exclude_unset=True, exclude_none=True))
    return data
