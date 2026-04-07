from fastapi import APIRouter
from app.api.v1.endpoints import ingestion, qa, agent

api_router = APIRouter()
api_router.include_router(ingestion.router, tags=["ingestion"])
api_router.include_router(qa.router, tags=["qa"])
api_router.include_router(agent.router, tags=["agent"])
