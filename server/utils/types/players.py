from typing import List, Optional
from pydantic import BaseModel
from .entries import Entry


class Player(BaseModel):
    # Temporarily, everything is optional until we clean our database.
    _id: Optional[str] = None
    name: Optional[str] = None
    profile: Optional[str] = None
    wins: Optional[int] = None
    winsSwiss: Optional[int] = None
    winsBracket: Optional[int] = None
    winRate: Optional[float] = None
    winRateSwiss: Optional[float] = None
    winRateBracket: Optional[float] = None
    draws: Optional[int] = None
    losses: Optional[int] = None
    lossesSwiss: Optional[int] = None
    lossesBracket: Optional[int] = None
    conversionRate: Optional[float] = None
    topCuts: Optional[int] = None
    tournaments: Optional[List[Entry]] = None
