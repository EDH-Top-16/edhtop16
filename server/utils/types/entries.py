from typing import List, Optional, Union
from pydantic import BaseModel
from datetime import datetime

class DBEntry(BaseModel):
    # Fields are no longer Optional, they can be either str or None.
    _id: Union[str, None] = None
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

class Entry(DBEntry):
    # Temporarily, everything is optional until we clean our database.
    tournamentName: Optional[str] = None
    TID: Optional[str] = None
    topCut: Optional[int] = None
    