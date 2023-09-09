from fastapi import FastAPI
from routers import commanders_router

app = FastAPI()

app.include_router(commanders_router)