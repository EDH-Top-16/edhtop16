from fastapi import FastAPI
from routers import commanders_router, tournaments_router, entries_router
from db import base_db
import logging

# Logger setup
logging.basicConfig(
    level=logging.ERROR,
)

app = FastAPI()

prefix = "/api"

# All routes
app.include_router(commanders_router, prefix=prefix)
app.include_router(tournaments_router, prefix=prefix)
app.include_router(entries_router, prefix=prefix)


@app.on_event("startup")
async def startup():
    await base_db.startup()


@app.on_event("shutdown")
async def shutdown():
    await base_db.shutdown()
