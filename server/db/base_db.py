from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional, cast
import os

# Ignore typecheck for this line b/c Motor doesn't have typedef
client: Optional[AsyncIOMotorClient] = None  # type: ignore
MONGO_URI = cast(str, os.getenv("MONGO_URI"))


async def startup():
    global client
    client = AsyncIOMotorClient(MONGO_URI)


async def shutdown():
    global client
    if client:
        client.close()


# Ignore typecheck for this line b/c Motor doesn't have typedef
async def get_db_async(db_name: str) -> AsyncIOMotorDatabase:  # type: ignore
    if client is None:
        raise RuntimeError("Must initialize database with startup() before accessing!")

    return client[db_name]
