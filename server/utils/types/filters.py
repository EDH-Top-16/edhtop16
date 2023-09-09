from pydantic import BaseModel, Field
from typing import TypeVar, Generic, Optional
from datetime import date


T = TypeVar("T", int, date)


class OperatorType(BaseModel, Generic[T]):
    lte: Optional[T] = Field(None, alias="$lte")
    eq: Optional[T] = Field(None, alias="$eq")
    gte: Optional[T] = Field(None, alias="$gte")


class BaseFilters(BaseModel):
    name: Optional[str] = None
    profile: Optional[str] = None
    decklist: Optional[str] = None
    wins: Optional[OperatorType[int]] = None
    winsSwiss: Optional[OperatorType[int]] = None
    winsBracket: Optional[OperatorType[int]] = None
    winRate: Optional[OperatorType[int]] = None
    winRateSwiss: Optional[OperatorType[int]] = None
    winRateBracket: Optional[OperatorType[int]] = None
    draws: Optional[OperatorType[int]] = None
    losses: Optional[OperatorType[int]] = None
    lossesSwiss: Optional[OperatorType[int]] = None
    lossesBracket: Optional[OperatorType[int]] = None
    standing: Optional[OperatorType[int]] = None
    colorID: Optional[str] = None
    commander: Optional[str] = None


class TournamentFilters(BaseModel):
    date: Optional[OperatorType[date]] = None
    dateCreated: Optional[OperatorType[int]] = None
    size: Optional[OperatorType[int]] = None
    TID: Optional[str] = None
    tournamentName: Optional[str] = None
    swissNum: Optional[OperatorType[int]] = None
    topCut: Optional[OperatorType[int]] = None


class Filters(BaseModel):
    tourney_filter: Optional[TournamentFilters] = None
    filters: Optional[BaseFilters] = None
