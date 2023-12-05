from typing import List, Optional, Union
from pydantic import BaseModel, validator, Field
from datetime import datetime
from utils import wubrgify
from bson.objectid import ObjectId

class DBEntry(BaseModel):
    id_: Union[str, None] = Field(None, alias="_id")
    name: Union[str, None] = None
    profile: Union[str, None] = None
    decklist: Union[str, None] = None
    wins: Union[int, None] = None
    winsSwiss: Union[int, None] = None
    winsBracket: Union[int, None] = None
    winRate: Union[float, None] = None
    winRateSwiss: Union[float, None] = None
    winRateBracket: Union[float, None] = None
    draws: Union[int, None] = None
    losses: Union[int, None] = None
    lossesSwiss: Union[int, None] = None
    lossesBracket: Union[int, None] = None
    standing: Union[int, None] = None
    colorID: Union[str, None] = None
    commander: Union[str, None] = None
    
    class Config:
        extra = "forbid"

    @validator("colorID", pre=True)
    def checkColor(color: str):
        if type(color) != str: return None
        if color == "N/A": return None
        return wubrgify(color)
    
    @validator("id_", pre=True)
    def checkID(id_):
        if isinstance(id_, ObjectId): return str(id_)
        else: return id_
    


class Entry(DBEntry):
    # Temporarily, everything is optional until we clean our database.
    # id: Optional[str] = None
    tournamentName: Optional[str] = None
    TID: Optional[str] = None
    topCut: Optional[int] = None
    
