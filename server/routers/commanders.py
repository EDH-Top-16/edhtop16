from fastapi import APIRouter, Body

from db import get_commanders as get_commanders_db
from utils.types import AllFilters, Commander

router = APIRouter()


@router.post("/commanders")
async def get_commanders(filters: AllFilters = Body(...)) -> dict[str, Commander]:
    print(filters.model_dump(by_alias=True, exclude_unset=True, exclude_none=True))
    return await get_commanders_db(filters.model_dump(by_alias=True, exclude_unset=True, exclude_none=True))
