from pydantic import BaseModel, Field, validator
from typing import TypeVar, Generic, Optional, List, Dict, Union
from datetime import date


T = TypeVar("T", int, date)


class OperatorType(BaseModel, Generic[T]):
    lte: Optional[T] = Field(None, alias="$lte")
    lt: Optional[T] = Field(None, alias="$lt")
    eq: Optional[T] = Field(None, alias="$eq")
    gte: Optional[T] = Field(None, alias="$gte")
    gt: Optional[T] = Field(None, alias="$gt")
    ne: Optional[T] = Field(None, alias="$ne")
    in_: Optional[List[T]] = Field(None, alias="$in")
    nin: Optional[List[T]] = Field(None, alias="$nin")
    regex: Optional[str] = Field(None, alias="$regex")
    exists: Optional[bool] = Field(None, alias="$exists")
    mod: Optional[List[int]] = Field(None, alias="$mod")
    all_: Optional[List[T]] = Field(None, alias="$all")
    elemMatch: Optional[Dict[str, Union[T, 'OperatorType[T]']]] = Field(
        None, alias="$elemMatch")
    size: Optional[int] = Field(None, alias="$size")

    class Config:
        extra = "forbid"


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

    class Config:
        extra = "forbid"


class TournamentFilters(BaseModel):
    date: Optional[OperatorType[date]] = None
    dateCreated: Optional[OperatorType[int]] = None
    size: Optional[OperatorType[int]] = None
    TID: Optional[str] = None
    tournamentName: Optional[str] = None
    swissNum: Optional[OperatorType[int]] = None
    topCut: Optional[OperatorType[int]] = None

    class Config:
        extra = "forbid"


class AllFilters(BaseFilters):
    tournament_filters: Optional[TournamentFilters] = None
    
    class Config:
        extra = "forbid"
