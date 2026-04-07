import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Financial Data Analysis PoC"
    API_V1_STR: str = "/api/v1"

settings = Settings()
