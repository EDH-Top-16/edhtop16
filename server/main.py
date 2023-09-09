from fastapi import FastAPI
from routers import commanders_router, tournaments_router
from db import base_db

app = FastAPI()

# All routes
app.include_router(commanders_router)
app.include_router(tournaments_router)


@app.on_event("startup")
async def startup():
    await base_db.startup()


@app.on_event("shutdown")
async def shutdown():
    await base_db.shutdown()
