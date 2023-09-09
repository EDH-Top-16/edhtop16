from fastapi import APIRouter, Body
from pydantic import BaseModel
from typing import List

from db import get_tournaments as get_tournaments_db
from utils import TournamentFilters, TournamentResponse


router = APIRouter()


@router.post("/tournaments")
async def get_tournaments(filters: TournamentFilters = Body(...)) -> TournamentResponse:
    """
    Returns a list of tournaments from the database given a filter.
    """
    data = await get_tournaments_db(filters.model_dump())
    return {"tournaments": data}
