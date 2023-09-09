from fastapi import APIRouter
from db import get_commanders

router = APIRouter()


@router.get("/commanders")
async def get_commanders():
    data = await get_commanders({})
    return {"message": "Hello World", "data": data}


@router.post("/commanders")
async def create_commander(filters: dict):
    return {"message": "Hello World"}
