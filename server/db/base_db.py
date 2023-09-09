from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import Optional
import os

client: Optional[AsyncIOMotorClient] = None
MONGO_URI: str = os.getenv("MONGO_URI")


async def startup():
    global client
    client = AsyncIOMotorClient(MONGO_URI)


async def shutdown():
    global client
    if client:
        client.close()


async def get_db_async(db_name: str) -> AsyncIOMotorDatabase:
    return client[db_name]
