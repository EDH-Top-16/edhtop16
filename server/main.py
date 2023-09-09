from fastapi import FastAPI
from routers import commanders

app = FastAPI()

app.include_router(commanders.router)