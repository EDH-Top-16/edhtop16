from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional, cast
import os

client: Optional[AsyncIOMotorClient] = None
MONGO_URI = cast(str, os.getenv("MONGO_URI"))


async def startup():
    global client
    client = AsyncIOMotorClient(MONGO_URI)


async def shutdown():
    global client
    if client:
        client.close()


async def get_db_async(db_name: str) -> AsyncIOMotorDatabase:
    if client is None:
        raise RuntimeError("Must initialize database with startup() before accessing!")

    return client[db_name]
