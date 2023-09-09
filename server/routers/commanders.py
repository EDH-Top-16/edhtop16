from fastapi import APIRouter

router = APIRouter()

@router.get("/commanders")
async def get_commanders():
    return {"message": "Hello World"}

@router.post("/commanders")
async def create_commander(filters: dict):
    return {"message": "Hello World"}