from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime


class Tournament(BaseModel):
    # Temporarily, everything is optional until we clean our database.
    _id: Optional[str] = None
    TID: Optional[str] = None
    tournamentName: Optional[str] = None
    size: Optional[int] = None
    date: Optional[datetime] = None
    dateCreated: Optional[int] = None
    swissNum: Optional[int] = None
    topCut: Optional[int] = None

    class Config:
        extra = "forbid"
