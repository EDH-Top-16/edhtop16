from fastapi import APIRouter, HTTPException

from db import get_entries as get_entries_db
from utils.types import Player, AllFilters, Entry
from typing import List

router = APIRouter()


@router.get("/player/{profile}")
async def player(profile: str) -> Player:
    """
    Returns a list of entries from the database given a filter.
    """
    # Using by_alias to convert the filters to the database format.
    data = await get_entries_db(AllFilters(profile=profile))
    if not data:
        raise HTTPException(
            status_code=404, detail=f"No player with profile '{profile}'"
        )

    out = Player(
        wins=0,
        winsSwiss=0,
        winsBracket=0,
        draws=0,
        losses=0,
        lossesSwiss=0,
        lossesBracket=0,
    )
    out.tournaments = []
    out.name = data[0].name or ""
    out.profile = profile

    topCuts = 0

    for entry in data:
        out.wins = (out.wins or 0) + (entry.wins or 0)
        out.winsSwiss = (out.winsSwiss or 0) + (entry.winsSwiss or 0)
        out.winsBracket = (out.winsBracket or 0) + (entry.winsBracket or 0)
        out.draws = (out.draws or 0) + (entry.draws or 0)
        out.losses = (out.losses or 0) + (entry.losses or 0)
        out.lossesSwiss = (out.lossesSwiss or 0) + (entry.lossesSwiss or 0)
        out.lossesBracket = (out.lossesBracket or 0) + (entry.lossesBracket or 0)

        if (entry.standing or float("inf")) <= (entry.topCut or 0):
            topCuts += 1

        out.tournaments.append(entry)

    out.winRate = (out.wins or 0) / (
        (out.wins or 0) + (out.draws or 0) + (out.losses or 0)
    )
    out.winRateSwiss = (out.winsSwiss or 0) / (
        (out.winsSwiss or 0) + (out.draws or 0) + (out.lossesSwiss or 0)
    )
    out.winRateBracket = (out.winsBracket or 0) / (
        (out.winsBracket or 0) + (out.lossesBracket or 0)
    )
    out.conversionRate = topCuts / len(out.tournaments)
    out.conversionScore = calculateConversionScore(topCuts, out.tournaments)
    out.topCuts = topCuts

    return out

def calculateConversionScore(topCuts: int, tournaments: List[Entry]) -> float:
    expected = 0
    for t in tournaments:
        expected += t.topCut / t.tournamentSize
    return topCuts / expected * 100 if expected != 0 else 0.0