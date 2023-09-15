from typing import Optional
from pydantic import BaseModel


class Commander(BaseModel):
    colorID: Optional[str] = None
    wins: Optional[int] = None
    winsSwiss: Optional[int] = None
    winsBracket: Optional[int] = None
    draws: Optional[int] = None
    losses: Optional[int] = None
    lossesSwiss: Optional[int] = None
    lossesBracket: Optional[int] = None
    count: Optional[int] = None
    winRate: Optional[float] = None
    winRateSwiss: Optional[float] = None
    winRateBracket: Optional[float] = None
    topCuts: Optional[int] = None
    conversionRate: Optional[float] = None

    class Config:
        extra = "forbid"


class Commanders(BaseModel):
    commanders: dict[str, Commander]

    class Config:
        extra = "forbid"
